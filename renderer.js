const KARAFUN_HOST = 'https://www.karafun.com';
const KARAFUN_WS_PROTOCOL = 'kcpj~v2+emuping';
const RECONNECT_BASE_DELAY_MS = 2000;
const RECONNECT_MAX_DELAY_MS = 30000;
const STALE_CONNECTION_THRESHOLD_MS = 45000;
const SCREENSAVER_IDLE_THRESHOLD_MS = 30000;
const SCREENSAVER_QUOTE_ROTATION_MS = 60000;

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
let latestQueueData = { current: null, queue: [] };
let reconnectTimer = null;
let reconnectAttempts = 0;
let activeConnectionId = 0;
let lastSocketMessageAt = 0;
let playbackState = {
  baseRemainingSeconds: null,
  capturedAtMs: null,
  isPaused: false,
  pausedSinceMs: null
};
let screensaverQuotes = [];
let screensaverQuoteIndex = 0;
let screensaverLastRotateAt = 0;
let noQueueSinceMs = null;
let screensaverActive = false;

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initializeScreensaverQuotes();
  renderScreensaverQuote();
  updateClockAndPlayback();
  setInterval(updateClockAndPlayback, 1000);
  startSessionFlow();
});

function setupEventListeners() {
  // Right-click is the only universal on-screen gesture expected during normal
  // operation, so it is reserved for kiosk-style fullscreen toggling.
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (window.electronAPI?.toggleFullscreen) {
      window.electronAPI.toggleFullscreen();
    }
  });

  sessionModal = document.getElementById('session-modal');
  sessionForm = document.getElementById('session-form');
  sessionInputEl = document.getElementById('session-input');
  nicknameInputEl = document.getElementById('nickname-input');

  const currentCover = document.getElementById('current-cover');
  if (currentCover) {
    currentCover.addEventListener('error', () => {
      currentCover.classList.add('hidden');
      currentCover.removeAttribute('src');
      currentCover.alt = 'No current cover art';
    });
  }

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

  window.addEventListener('resize', () => {
    renderQueueState();
  });

  if (window.electronAPI) {
    window.electronAPI.onFullscreenToggled(() => {
      // Fullscreen changes alter the available queue height, so the queue is
      // re-rendered to preserve the no-scroll display rule.
      renderQueueState();
    });

    window.electronAPI.onOpenSessionModal(() => {
      startSessionFlow();
    });

    window.electronAPI.onReconnectSession(() => {
      reconnectNow();
    });
  }
}

function startSessionFlow() {
  hideScreensaver();
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

  hideScreensaver();
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

function isRecoverableSessionError(error) {
  const status = Number(error?.status || 0);

  if (!status) {
    return true;
  }

  return status === 408 || status === 429 || status >= 500;
}

async function connectToSession(sessionId, nickname) {
  const connectionId = ++activeConnectionId;

  clearReconnectTimer();

  if (socket) {
    socket.close();
    socket = null;
  }

  socketSessionId = sessionId;
  socketLogin = nickname;
  hasReceivedQueue = false;
  outboundMessageId = 1;
  lastSocketMessageAt = Date.now();
  latestQueueData = { current: null, queue: [] };
  playbackState = {
    baseRemainingSeconds: null,
    capturedAtMs: null,
    isPaused: false,
    pausedSinceMs: null
  };
  noQueueSinceMs = null;
  hideScreensaver();

  updateStatus(`Connecting to session ${sessionId}...`, 'info');

  let settings;
  try {
    settings = await fetchSessionSettings(sessionId);
  } catch (error) {
    if (connectionId !== activeConnectionId) {
      return;
    }

    // Invalid or forbidden session IDs should fail fast so the operator can
    // correct the input instead of waiting through pointless retries.
    if (!isRecoverableSessionError(error)) {
      updateStatus(`Failed to load session: ${error?.message || 'Unknown error'}`, 'error');
      return;
    }

    handleRecoverableFailure(`Failed to load session: ${error?.message || 'Unknown error'}`, connectionId);
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
    handleRecoverableFailure(`WebSocket error: ${error?.message || 'Unable to open socket'}`, connectionId);
    return;
  }

  const currentSocket = socket;

  currentSocket.addEventListener('open', () => {
    if (connectionId !== activeConnectionId) {
      return;
    }

    reconnectAttempts = 0;
    lastSocketMessageAt = Date.now();
    updateStatus(`Connected to ${sessionId}. Authenticating...`, 'info');
    sendSocketMessage('remote.UpdateUsernameRequest', { username: socketLogin });
  });

  currentSocket.addEventListener('message', (event) => {
    if (connectionId !== activeConnectionId) {
      return;
    }

    lastSocketMessageAt = Date.now();

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
      syncPlaybackState(message.payload);

      if (!hasReceivedQueue) {
        updateStatus(`Session active: ${socketSessionId}`, 'success');
      }
      return;
    }

    if (message.type === 'remote.QueueEvent') {
      hasReceivedQueue = true;
      const items = message?.payload?.queue?.items || [];
      latestQueueData = buildQueueData(items);

      updateCurrentSong(latestQueueData);
      renderQueueState();
      evaluateScreensaverState();
      updateStatus(`Live queue connected: ${socketSessionId}`, 'success');

      hydrateQueueArtwork(items);
    }
  });

  currentSocket.addEventListener('close', () => {
    if (connectionId !== activeConnectionId) {
      return;
    }

    socket = null;
    scheduleReconnect('Disconnected from KaraFun session');
  });

  currentSocket.addEventListener('error', () => {
    if (connectionId !== activeConnectionId) {
      return;
    }

    updateStatus('Connection issue detected. Attempting recovery...', 'error');
  });
}

function handleRecoverableFailure(message, connectionId) {
  if (connectionId !== activeConnectionId) {
    return;
  }

  scheduleReconnect(message);
}

function scheduleReconnect(reason) {
  if (!currentSessionId || !currentNickname || reconnectTimer) {
    updateStatus(reason, 'error');
    return;
  }

  const delay = reconnectAttempts === 0
    ? 0
    : Math.min(
      RECONNECT_BASE_DELAY_MS * (2 ** (reconnectAttempts - 1)),
      RECONNECT_MAX_DELAY_MS
    );
  reconnectAttempts += 1;

  if (delay === 0) {
    updateStatus(`${reason}. Reconnecting now...`, 'error');
  } else {
    updateStatus(`${reason}. Retrying in ${Math.ceil(delay / 1000)}s...`, 'error');
  }

  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connectToSession(currentSessionId, currentNickname);
  }, delay);
}

function reconnectNow() {
  if (!currentSessionId || !currentNickname) {
    startSessionFlow();
    return;
  }

  updateStatus('Manual reconnect requested. Reconnecting now...', 'info');
  reconnectAttempts = 0;
  clearReconnectTimer();
  connectToSession(currentSessionId, currentNickname);
}

function clearReconnectTimer() {
  if (!reconnectTimer) {
    return;
  }

  window.clearTimeout(reconnectTimer);
  reconnectTimer = null;
}

function buildQueueData(items) {
  const normalizedQueue = normalizeQueue(items);
  const markedCurrent = normalizedQueue.find((entry) => entry.isCurrent);
  const current = markedCurrent || normalizedQueue[0] || null;

  return {
    current,
    queue: normalizedQueue
  };
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
      coverUrl,
      isCurrent: Boolean(
        item?.isCurrent
        || item?.current
        || item?.isPlaying
        || item?.playing
        || String(item?.status || '').toLowerCase() === 'playing'
        || String(item?.state || '').toLowerCase() === 'playing'
      )
    };
  });
}

async function fetchSessionSettings(sessionId) {
  const response = await fetch(`${KARAFUN_HOST}/${sessionId}/`, { cache: 'no-store' });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const html = await response.text();
  const match = html.match(/Settings\s*=\s*(\{[\s\S]*?\});/);
  if (!match?.[1]) {
    throw new Error('Session settings not found');
  }

  return JSON.parse(match[1]);
}

async function hydrateQueueArtwork(queueItems) {
  // Artwork lookups are best-effort only. Queue rendering should remain stable
  // even if KaraFun does not return metadata for some entries.
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

    latestQueueData = buildQueueData(queueItems);
    updateCurrentSong(latestQueueData);
    renderQueueState();
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
    renderQrCodeImage('qr-code', joinUrl, 150, 'qr-image');
    renderQrCodeImage('screensaver-qr', joinUrl, 180, 'screensaver-qr-image');
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
}

function renderQrCodeImage(containerId, joinUrl, size, imageClass) {
  const qrElement = document.getElementById(containerId);
  if (!qrElement) {
    return;
  }

  const qrImage = document.createElement('img');
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(joinUrl)}`;
  qrImage.alt = 'QR Code';
  qrImage.className = imageClass;
  qrElement.innerHTML = '';
  qrElement.appendChild(qrImage);
}

function updateSessionLabel(sessionId) {
  const sessionElement = document.getElementById('session-id');
  if (sessionElement) {
    sessionElement.textContent = sessionId;
  }
}

function updateCurrentSong(data) {
  const current = data.current || data.queue?.[0];
  const currentTitle = document.getElementById('current-title');
  const currentArtist = document.getElementById('current-artist');
  const currentSinger = document.getElementById('current-singer');
  const currentCover = document.getElementById('current-cover');

  if (!currentTitle || !currentArtist || !currentSinger || !currentCover) {
    return;
  }

  if (!current) {
    currentTitle.textContent = 'Waiting for the next song';
    currentArtist.textContent = '';
    currentSinger.textContent = '';
    currentCover.classList.add('hidden');
    currentCover.removeAttribute('src');
    currentCover.alt = 'No current cover art';
    updatePlaybackIndicator(false);
    return;
  }

  currentTitle.textContent = current.title || 'Unknown Song';
  currentArtist.textContent = current.artist || '';
  currentSinger.textContent = current.singer ? `Sung by: ${current.singer}` : '';

  if (current.coverUrl) {
    currentCover.classList.remove('hidden');
    currentCover.src = current.coverUrl;
    currentCover.alt = `${current.title || 'Current song'} cover art`;
  } else {
    currentCover.classList.add('hidden');
    currentCover.removeAttribute('src');
    currentCover.alt = 'No current cover art';
  }

  updatePlaybackIndicator(!playbackState.isPaused);
}

function updatePlaybackIndicator(isPlaying) {
  const indicator = document.getElementById('playback-indicator');
  if (!indicator) {
    return;
  }

  indicator.classList.toggle('active', Boolean(isPlaying));
}

function renderQueueState() {
  const queueList = document.getElementById('queue-list');
  if (!queueList) {
    return;
  }

  const upcomingQueue = getUpcomingQueue();
  if (upcomingQueue.length === 0) {
    queueList.innerHTML = '<div class="queue-empty">No items on the queue</div>';
    return;
  }

  const displayCount = Math.min(
    calculateVisibleQueueItems(upcomingQueue.length),
    upcomingQueue.length
  );
  let html = '';

  for (let index = 0; index < displayCount; index += 1) {
    html += renderQueueItem(upcomingQueue[index], index + 1, index === 0 && isOnDeckWindow());
  }

  if (upcomingQueue.length > displayCount) {
    const moreCount = upcomingQueue.length - displayCount;
    html += `<div class="queue-more">${moreCount} more songs in the queue</div>`;
  }

  queueList.innerHTML = html;
}

function getUpcomingQueue() {
  const queue = latestQueueData.queue || [];
  const current = latestQueueData.current;

  if (!current) {
    return queue;
  }

  const currentIndex = queue.findIndex((entry) => isSameQueueEntry(entry, current));
  if (currentIndex < 0) {
    return queue;
  }

  return queue.filter((_, index) => index !== currentIndex);
}

function isSameQueueEntry(left, right) {
  if (!left || !right) {
    return false;
  }

  if (left.id && right.id) {
    return String(left.id) === String(right.id);
  }

  return (
    String(left.title || '') === String(right.title || '')
    && String(left.artist || '') === String(right.artist || '')
    && String(left.singer || '') === String(right.singer || '')
  );
}

function initializeScreensaverQuotes() {
  const providedQuotes = window.SCREENSAVER_QUOTES;
  if (Array.isArray(providedQuotes) && providedQuotes.length > 0) {
    screensaverQuotes = providedQuotes.filter((line) => typeof line === 'string' && line.trim().length > 0);
  }

  if (screensaverQuotes.length === 0) {
    screensaverQuotes = [
      'No songs yet. Be the reason the room wakes up.',
      'One scan. One song. Instant good vibes.'
    ];
  }
}

function renderScreensaverQuote() {
  const quoteEl = document.getElementById('screensaver-quote');
  if (!quoteEl || screensaverQuotes.length === 0) {
    return;
  }

  quoteEl.textContent = screensaverQuotes[screensaverQuoteIndex];
}

function rotateScreensaverQuote(nowMs) {
  if (!screensaverActive || screensaverQuotes.length < 2) {
    return;
  }

  if (nowMs - screensaverLastRotateAt < SCREENSAVER_QUOTE_ROTATION_MS) {
    return;
  }

  screensaverQuoteIndex = (screensaverQuoteIndex + 1) % screensaverQuotes.length;
  screensaverLastRotateAt = nowMs;
  renderScreensaverQuote();
}

function hasPlayableQueueContent() {
  return Boolean(latestQueueData.current) || (latestQueueData.queue || []).length > 0;
}

function isSessionModalOpen() {
  return sessionModal && !sessionModal.classList.contains('hidden');
}

function showScreensaver() {
  const screensaver = document.getElementById('screensaver');
  if (!screensaver || screensaverActive) {
    return;
  }

  screensaver.classList.remove('hidden');
  screensaver.setAttribute('aria-hidden', 'false');
  screensaverActive = true;
  screensaverLastRotateAt = Date.now();
  renderScreensaverQuote();
}

function hideScreensaver() {
  const screensaver = document.getElementById('screensaver');
  if (!screensaver || !screensaverActive) {
    return;
  }

  screensaver.classList.add('hidden');
  screensaver.setAttribute('aria-hidden', 'true');
  screensaverActive = false;
}

function evaluateScreensaverState() {
  if (!currentSessionId || isSessionModalOpen()) {
    noQueueSinceMs = null;
    hideScreensaver();
    return;
  }

  const nowMs = Date.now();
  const hasCurrentItem = Boolean(latestQueueData.current);
  const hasUpcomingItems = getUpcomingQueue().length > 0;

  const pausedTooLong = Boolean(
    playbackState.isPaused
    && playbackState.pausedSinceMs
    && (nowMs - playbackState.pausedSinceMs >= SCREENSAVER_IDLE_THRESHOLD_MS)
  );

  if (pausedTooLong) {
    showScreensaver();
    return;
  }

  // When playback is active, prioritize queue visibility for operator awareness.
  if (hasUpcomingItems) {
    noQueueSinceMs = null;
    hideScreensaver();
    return;
  }

  if (hasCurrentItem) {
    noQueueSinceMs = null;
    hideScreensaver();
    return;
  }

  if (!noQueueSinceMs) {
    noQueueSinceMs = nowMs;
  }

  if (nowMs - noQueueSinceMs >= SCREENSAVER_IDLE_THRESHOLD_MS) {
    showScreensaver();
  }
}

function calculateVisibleQueueItems(totalUpcomingItems) {
  const queueSection = document.querySelector('.queue-section');
  const queueTitle = document.querySelector('.queue-title');

  if (!queueSection) {
    return Math.min(totalUpcomingItems, 6);
  }

  // The queue intentionally adapts to available height instead of relying on
  // scrollbars, which are forbidden in the dedicated-display UX.
  const sectionHeight = queueSection.clientHeight;
  const titleHeight = queueTitle?.offsetHeight || 0;
  const reservedHeight = titleHeight + 40;
  const summaryHeight = totalUpcomingItems > 1 ? 72 : 0;
  const estimatedItemHeight = window.innerHeight <= 900 ? 114 : 132;
  const availableHeight = Math.max(sectionHeight - reservedHeight - summaryHeight, estimatedItemHeight);

  return Math.max(1, Math.floor(availableHeight / estimatedItemHeight));
}

function renderQueueItem(song, position, isOnDeck) {
  const cover = song.coverUrl || '';
  const title = song.title || 'Unknown Song';
  const artist = song.artist || 'Unknown Artist';
  const singer = song.singer || '';
  const stateMarkup = isOnDeck
    ? '<div class="queue-item-state"><span class="queue-state-badge">On Deck</span><span class="queue-ready-flash">Get ready</span></div>'
    : '';

  return `
    <div class="queue-item${isOnDeck ? ' queue-item-on-deck' : ''}">
      <div class="queue-position">${position}</div>
      <div class="queue-cover">
        ${cover ? `<img src="${cover}" alt="${title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22%3E♪%3C/text%3E%3C/svg%3E'">` : '<div class="cover-placeholder">♪</div>'}
      </div>
      <div class="queue-details">
        ${stateMarkup}
        <div class="queue-title">${escapeHtml(title)}</div>
        <div class="queue-artist">${escapeHtml(artist)}</div>
        ${singer ? `<div class="queue-singer">Added by: ${escapeHtml(singer)}</div>` : ''}
      </div>
    </div>
  `;
}

function syncPlaybackState(payload) {
  const pausedFlag = extractPausedState(payload);
  if (pausedFlag === true) {
    if (!playbackState.isPaused) {
      playbackState.pausedSinceMs = Date.now();
    }
    playbackState.isPaused = true;
  } else if (pausedFlag === false) {
    playbackState.isPaused = false;
    playbackState.pausedSinceMs = null;
  }

  const timing = extractPlaybackTiming(payload);
  if (timing) {
    playbackState.baseRemainingSeconds = timing.remainingSeconds;
    playbackState.capturedAtMs = Date.now();
  }

  updatePlaybackIndicator(Boolean(latestQueueData.current) && !playbackState.isPaused);

  renderQueueState();
}

function extractPausedState(payload) {
  return findBooleanState(
    payload,
    ['isPaused', 'paused', 'pause', 'isPlaying', 'playing'],
    ['state', 'status', 'playbackState', 'playbackStatus', 'playerState', 'transportState', 'mode']
  );
}

function findBooleanState(source, booleanKeys, stringStateKeys) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const lowerBooleanKeys = new Set(booleanKeys.map((key) => key.toLowerCase()));
  const lowerStringKeys = new Set(stringStateKeys.map((key) => key.toLowerCase()));

  for (const [key, value] of Object.entries(source)) {
    const lowerKey = key.toLowerCase();
    if (lowerBooleanKeys.has(lowerKey) && typeof value === 'boolean') {
      if (lowerKey === 'isplaying' || lowerKey === 'playing') {
        return !value;
      }
      return value;
    }

    if (
      typeof value === 'string'
      && (lowerStringKeys.has(lowerKey) || /(state|status|mode)/i.test(key))
    ) {
      const normalized = value.toLowerCase();
      if (normalized.includes('pause')) {
        return true;
      }
      if (normalized.includes('play')) {
        return false;
      }
    }

    if (value && typeof value === 'object') {
      const nested = findBooleanState(value, booleanKeys, stringStateKeys);
      if (nested !== null) {
        return nested;
      }
    }
  }

  return null;
}

function extractPlaybackTiming(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const remainingFromEndTime = extractRemainingFromEndTime(payload);
  if (Number.isFinite(remainingFromEndTime)) {
    return { remainingSeconds: remainingFromEndTime };
  }

  const remaining = findNumericValue(payload, [
    'remainingSeconds',
    'remainingTime',
    'timeRemaining',
    'secondsLeft',
    'leftSeconds',
    'remaining',
    'remain',
    'left',
    'remainingMs',
    'remainingMilliseconds'
  ]);

  if (Number.isFinite(remaining)) {
    return { remainingSeconds: normalizeTimingSeconds(remaining) };
  }

  const duration = findNumericValue(payload, [
    'durationSeconds',
    'duration',
    'length',
    'durationMs',
    'totalDuration',
    'totalTime'
  ]);
  const elapsed = findNumericValue(payload, [
    'elapsedSeconds',
    'elapsed',
    'positionSeconds',
    'position',
    'currentTime',
    'progress',
    'elapsedMs',
    'positionMs'
  ]);

  if (Number.isFinite(duration) && Number.isFinite(elapsed)) {
    return {
      remainingSeconds: Math.max(0, normalizeTimingSeconds(duration) - normalizeTimingSeconds(elapsed))
    };
  }

  return null;
}

function extractRemainingFromEndTime(payload) {
  const rawEndValue = findValue(payload, [
    'endTime',
    'endTimestamp',
    'endsAt',
    'songEnd',
    'endDate',
    'finishAt'
  ]);

  if (rawEndValue === null || rawEndValue === undefined) {
    return null;
  }

  const nowMs = Date.now();
  let endMs = null;

  if (typeof rawEndValue === 'number' && Number.isFinite(rawEndValue)) {
    endMs = rawEndValue > 1000000000000 ? rawEndValue : rawEndValue * 1000;
  }

  if (typeof rawEndValue === 'string') {
    const asNumber = Number(rawEndValue);
    if (Number.isFinite(asNumber)) {
      endMs = asNumber > 1000000000000 ? asNumber : asNumber * 1000;
    } else {
      const parsed = Date.parse(rawEndValue);
      if (Number.isFinite(parsed)) {
        endMs = parsed;
      }
    }
  }

  if (!Number.isFinite(endMs)) {
    return null;
  }

  return Math.max(0, Math.round((endMs - nowMs) / 1000));
}

function findNumericValue(source, candidateKeys) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const candidateSet = new Set(candidateKeys.map((key) => key.toLowerCase()));

  for (const [key, value] of Object.entries(source)) {
    if (candidateSet.has(key.toLowerCase()) && Number.isFinite(Number(value))) {
      return Number(value);
    }

    if (value && typeof value === 'object') {
      const nestedValue = findNumericValue(value, candidateKeys);
      if (Number.isFinite(nestedValue)) {
        return nestedValue;
      }
    }
  }

  return null;
}

function findValue(source, candidateKeys) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const candidateSet = new Set(candidateKeys.map((key) => key.toLowerCase()));

  for (const [key, value] of Object.entries(source)) {
    if (candidateSet.has(key.toLowerCase())) {
      return value;
    }

    if (value && typeof value === 'object') {
      const nestedValue = findValue(value, candidateKeys);
      if (nestedValue !== null && nestedValue !== undefined) {
        return nestedValue;
      }
    }
  }

  return null;
}

function normalizeTimingSeconds(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (value > 3600) {
    return Math.max(0, Math.round(value / 1000));
  }

  return Math.max(0, Math.round(value));
}

function getRemainingSeconds() {
  if (!Number.isFinite(playbackState.baseRemainingSeconds) || !playbackState.capturedAtMs) {
    return null;
  }

  const elapsedSeconds = Math.floor((Date.now() - playbackState.capturedAtMs) / 1000);
  return Math.max(0, playbackState.baseRemainingSeconds - elapsedSeconds);
}

function isOnDeckWindow() {
  const remainingSeconds = getRemainingSeconds();
  return Number.isFinite(remainingSeconds) && remainingSeconds <= 30;
}

function updateStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.className = `status status-${type}`;
}

function updateClockAndPlayback() {
  const now = new Date();
  const nowMs = Date.now();
  const timeElement = document.getElementById('time');
  if (timeElement) {
    timeElement.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  if (latestQueueData.queue.length > 1 && Number.isFinite(getRemainingSeconds())) {
    renderQueueState();
  }

  evaluateScreensaverState();
  rotateScreensaverQuote(nowMs);

  if (socket && socket.readyState === WebSocket.OPEN && currentSessionId && currentNickname) {
    const idleMs = Date.now() - lastSocketMessageAt;
    if (idleMs > STALE_CONNECTION_THRESHOLD_MS) {
      // If the socket stays open but no events arrive for too long, treat it as
      // unhealthy and force a reconnect so queue updates can resume.
      lastSocketMessageAt = Date.now();
      reconnectAttempts = 0;
      reconnectNow();
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
