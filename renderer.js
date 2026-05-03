const KARAFUN_HOST = 'https://www.karafun.com';
const KARAFUN_WS_PROTOCOL = 'kcpj~v2+emuping';
const MAX_QUEUE_ITEMS = 8;

let socket = null;
let currentSessionId = null;
let currentNickname = null;
let socketSessionId = null;
let socketLogin = null;
let hasReceivedQueue = false;
let sessionModal = null;
let sessionForm = null;
let sessionInputEl = null;
let nicknameInputEl = null;
let outboundMessageId = 1;
let defaultCoverUrl = '';
let coverUrlBySongId = new Map();

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateTime();
  setInterval(updateTime, 1000);
  startSessionFlow();
});

function setupEventListeners() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (window.electronAPI?.toggleFullscreen) {
      window.electronAPI.toggleFullscreen();
    }
  });

  sessionModal = document.getElementById('session-modal');
  sessionForm = document.getElementById('session-form');
  sessionInputEl = document.getElementById('session-input');
  nicknameInputEl = document.getElementById('nickname-input');

  if (sessionForm) {
    sessionForm.addEventListener('submit', handleSessionSubmit);
  }

  if (sessionModal) {
    sessionModal.addEventListener('click', (event) => {
      if (event.target?.dataset?.closeModal === 'true') {
        closeSessionModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSessionModal();
    }
  });

  const cancelButton = document.getElementById('cancel-session');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      closeSessionModal();
      updateStatus('No session selected', 'error');
    });
  }

  const changeSessionButton = document.getElementById('change-session');
  if (changeSessionButton) {
    changeSessionButton.addEventListener('click', () => {
      startSessionFlow();
    });
  }
}

function startSessionFlow() {
  openSessionModal();
}

function openSessionModal() {
  if (!sessionModal || !sessionInputEl || !nicknameInputEl) {
    updateStatus('Session form is not available', 'error');
    return;
  }

  const defaultNickname = currentNickname || `QueueAdmin${Math.floor(Math.random() * 1000)}`;
  sessionInputEl.value = currentSessionId || '';
  nicknameInputEl.value = defaultNickname;
  sessionModal.classList.remove('hidden');
  sessionModal.setAttribute('aria-hidden', 'false');

  const focusTarget = sessionInputEl.value ? nicknameInputEl : sessionInputEl;
  focusTarget.focus();
  focusTarget.select();
}

function closeSessionModal() {
  if (!sessionModal) {
    return;
  }

  sessionModal.classList.add('hidden');
  sessionModal.setAttribute('aria-hidden', 'true');
}

function handleSessionSubmit(event) {
  event.preventDefault();

  const sessionValue = sessionInputEl?.value?.trim() || '';
  const parsedSessionId = parseSessionId(sessionValue);
  if (!parsedSessionId) {
    updateStatus('Invalid session ID or URL', 'error');
    sessionInputEl?.focus();
    return;
  }

  const nicknameValue = nicknameInputEl?.value?.trim().slice(0, 16) || '';
  if (!nicknameValue) {
    updateStatus('Nickname cannot be empty', 'error');
    nicknameInputEl?.focus();
    return;
  }

  currentSessionId = parsedSessionId;
  currentNickname = nicknameValue;

  connectToSession(currentSessionId, currentNickname);
  generateQRCode(currentSessionId);
  updateSessionLabel(currentSessionId);
  closeSessionModal();
}

function parseSessionId(input) {
  const trimmed = String(input).trim();

  if (/^\d{4,10}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/karafun\.com\/(\d{4,10})\/?/i) || trimmed.match(/\/(\d{4,10})\/?$/);
  return match ? match[1] : null;
}

async function connectToSession(sessionId, nickname) {
  if (socket) {
    socket.close();
    socket = null;
  }

  socketSessionId = sessionId;
  socketLogin = nickname;
  hasReceivedQueue = false;
  outboundMessageId = 1;

  updateStatus(`Connecting to session ${sessionId}...`, 'info');

  let settings;
  try {
    settings = await fetchSessionSettings(sessionId);
  } catch (error) {
    updateStatus(`Failed to load session: ${error?.message || 'Unknown error'}`, 'error');
    return;
  }

  if (!settings?.kcs_url) {
    updateStatus('Session connection URL not found', 'error');
    return;
  }

  defaultCoverUrl = settings.image?.default || '';
  coverUrlBySongId = new Map();

  try {
    socket = new WebSocket(settings.kcs_url, KARAFUN_WS_PROTOCOL);
  } catch (error) {
    updateStatus(`WebSocket Error: ${error?.message || 'Unable to open socket'}`, 'error');
    return;
  }

  socket.addEventListener('open', () => {
    updateStatus(`Connected to ${sessionId}. Authenticating...`, 'info');
    sendSocketMessage('remote.UpdateUsernameRequest', { username: socketLogin });
  });

  socket.addEventListener('message', (event) => {
    const message = parseJsonSafely(event.data);
    if (!message) {
      return;
    }

    if (message.type === 'core.PingRequest') {
      sendRawMessage({ id: message.id, type: 'core.PingResponse', payload: {} });
      return;
    }

    if (message.type === 'core.AuthenticatedEvent') {
      updateStatus(`Connected as ${socketLogin} to ${socketSessionId}`, 'success');
      return;
    }

    if (message.type === 'remote.UpdateUsernameResponse' || message.type === 'remote.UsernameUpdateEvent') {
      updateStatus(`Session joined: ${socketSessionId}`, 'success');
      return;
    }

    if (message.type === 'remote.StatusEvent') {
      if (!hasReceivedQueue) {
        updateStatus(`Session active: ${socketSessionId}`, 'success');
      }
      return;
    }

    if (message.type === 'remote.QueueEvent') {
      hasReceivedQueue = true;
      const items = message?.payload?.queue?.items || [];
      const normalizedQueue = normalizeQueue(items);
      const queueData = {
        current: normalizedQueue[0] || null,
        queue: normalizedQueue
      };

      updateCurrentSong(queueData);
      updateQueueList(queueData);
      updateStatus(`Live queue connected: ${socketSessionId}`, 'success');

      hydrateQueueArtwork(items);
      return;
    }
  });

  socket.addEventListener('close', () => {
    updateStatus('Disconnected from KaraFun session', 'error');
  });

  socket.addEventListener('error', () => {
    updateStatus('Socket Error: Unable to connect to session', 'error');
  });
}

function normalizeQueue(rawQueue) {
  if (!Array.isArray(rawQueue)) {
    return [];
  }

  return rawQueue.map((item = {}, index) => {
    const songId = Number(item.song?.id?.id || item.songId || 0) || 0;
    const title = item.title || item.songTitle || item.name || item.song?.title || 'Unknown Song';
    const mappedBySongId = songId ? coverUrlBySongId.get(songId) : '';
    const coverUrl = item.cover || item.coverUrl || item.img || item.song?.cover || item.song?.image || mappedBySongId || defaultCoverUrl;

    return {
      id: item.queueId || item.id || `${index}`,
      title,
      artist: item.artist || item.artistName || item.album || item.song?.artist || '',
      singer: item.singer || item.options?.singer || item.login || item.username || item.addedBy || item.user?.username || '',
      coverUrl
    };
  });
}

async function fetchSessionSettings(sessionId) {
  const response = await fetch(`${KARAFUN_HOST}/${sessionId}/`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const match = html.match(/Settings\s*=\s*(\{[\s\S]*?\});/);
  if (!match?.[1]) {
    throw new Error('Session settings not found');
  }

  const settings = JSON.parse(match[1]);
  return settings;
}

async function hydrateQueueArtwork(queueItems) {
  const songIds = Array.from(new Set(
    (queueItems || [])
      .map((item) => Number(item?.song?.id?.id || item?.songId || 0) || 0)
      .filter(Boolean)
  ));

  if (songIds.length === 0) {
    return;
  }

  const formData = new FormData();
  formData.append('songIds', songIds.join(','));
  formData.append('quizIds', '');
  formData.append('communityIds', '');

  try {
    const response = await fetch(`${KARAFUN_HOST}/${socketSessionId}/?type=queueData`, {
      method: 'POST',
      body: formData,
      cache: 'no-store'
    });

    if (!response.ok) {
      return;
    }

    const details = await response.json();
    if (!Array.isArray(details)) {
      return;
    }

    let changed = false;
    for (const item of details) {
      const songId = Number(item?.songId || 0) || 0;
      const imageUrl = item?.img || '';

      if (!songId || !imageUrl) {
        continue;
      }

      const existing = coverUrlBySongId.get(songId);
      if (existing !== imageUrl) {
        coverUrlBySongId.set(songId, imageUrl);
        changed = true;
      }
    }

    if (!changed) {
      return;
    }

    const normalizedQueue = normalizeQueue(queueItems);
    const queueData = {
      current: normalizedQueue[0] || null,
      queue: normalizedQueue
    };

    updateCurrentSong(queueData);
    updateQueueList(queueData);
  } catch (_error) {
    // Ignore artwork hydration failures and keep existing UI state.
  }
}

function parseJsonSafely(raw) {
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function sendSocketMessage(type, payload) {
  sendRawMessage({
    id: outboundMessageId++,
    type,
    payload: payload || {}
  });
}

function sendRawMessage(message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(message));
}

function generateQRCode(sessionId) {
  try {
    const joinUrl = `${KARAFUN_HOST}/${sessionId}/`;
    const qrElement = document.getElementById('qr-code');
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinUrl)}`;
    qrImage.alt = 'QR Code';
    qrImage.className = 'qr-image';
    qrElement.innerHTML = '';
    qrElement.appendChild(qrImage);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
}

function updateSessionLabel(sessionId) {
  const sessionElement = document.getElementById('session-id');
  if (sessionElement) {
    sessionElement.textContent = sessionId;
  }
}

function updateCurrentSong(data) {
  const current = data.current || data.queue?.[0];

  if (!current) {
    document.getElementById('current-title').textContent = 'No song currently playing';
    document.getElementById('current-artist').textContent = '';
    document.getElementById('current-singer').textContent = '';
    document.getElementById('current-cover').src = '';
    return;
  }

  document.getElementById('current-title').textContent = current.title || 'Unknown Song';
  document.getElementById('current-artist').textContent = current.artist || '';
  document.getElementById('current-singer').textContent = current.singer ? `Sung by: ${current.singer}` : '';

  if (current.coverUrl) {
    document.getElementById('current-cover').src = current.coverUrl;
  } else {
    document.getElementById('current-cover').src = '';
  }
}

function updateQueueList(data) {
  const queueList = document.getElementById('queue-list');
  const queue = data.queue || [];
  const upcomingQueue = queue.slice(1);

  if (upcomingQueue.length === 0) {
    queueList.innerHTML = '<div class="queue-empty">Queue is empty</div>';
    return;
  }

  let html = '';
  const displayCount = Math.min(upcomingQueue.length, MAX_QUEUE_ITEMS);

  for (let i = 0; i < displayCount; i++) {
    html += renderQueueItem(upcomingQueue[i], i + 1);
  }

  if (upcomingQueue.length > MAX_QUEUE_ITEMS) {
    const moreCount = upcomingQueue.length - MAX_QUEUE_ITEMS;
    html += `<div class="queue-more">+ ${moreCount} more ${moreCount === 1 ? 'song' : 'songs'} in queue</div>`;
  }

  queueList.innerHTML = html;
}

function renderQueueItem(song, position) {
  const cover = song.coverUrl || '';
  const title = song.title || 'Unknown Song';
  const artist = song.artist || 'Unknown Artist';
  const singer = song.singer || '';

  return `
    <div class="queue-item">
      <div class="queue-position">${position}</div>
      <div class="queue-cover">
        ${cover ? `<img src="${cover}" alt="${title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22%3E♪%3C/text%3E%3C/svg%3E'">` : '<div class="cover-placeholder">♪</div>'}
      </div>
      <div class="queue-details">
        <div class="queue-title">${escapeHtml(title)}</div>
        <div class="queue-artist">${escapeHtml(artist)}</div>
        ${singer ? `<div class="queue-singer">Added by: ${escapeHtml(singer)}</div>` : ''}
      </div>
    </div>
  `;
}

function updateStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status status-${type}`;
}

function updateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (window.electronAPI) {
  window.electronAPI.onFullscreenToggled((isFullscreen) => {
    console.log('Fullscreen:', isFullscreen);
  });
}
