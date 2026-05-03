// Configuration - Update these with your KaraFun server details
const API_BASE_URL = 'http://localhost:8080'; // Change to your KaraFun server IP
const POLL_INTERVAL = 3000; // Poll every 3 seconds
const MAX_QUEUE_ITEMS = 8; // Maximum items to display before showing "more"

let currentSession = null;
let lastQueueData = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  generateQRCode();
  startPolling();
  updateTime();
  setInterval(updateTime, 1000);
});

// Setup event listeners
function setupEventListeners() {
  // Right-click to toggle fullscreen (handled by electron)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // Electron main process handles this
  });

  // Update time display
  function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Generate QR Code for joining session
function generateQRCode() {
  try {
    // Dynamic URL based on current server
    const qrUrl = `${API_BASE_URL}/remote`;
    
    // Create a simple QR code using a public API
    // For production, use the 'qrcode' npm package instead
    const qrElement = document.getElementById('qr-code');
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`;
    qrImage.alt = 'QR Code';
    qrImage.className = 'qr-image';
    qrElement.innerHTML = '';
    qrElement.appendChild(qrImage);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
}

// Start polling the KaraFun API
function startPolling() {
  fetchQueue();
  setInterval(fetchQueue, POLL_INTERVAL);
}

// Fetch queue from API
async function fetchQueue() {
  try {
    // Fetch queue data
    const queueResponse = await fetch(`${API_BASE_URL}/remote/queue`);
    if (!queueResponse.ok) throw new Error(`HTTP error! status: ${queueResponse.status}`);
    
    const queueData = await queueResponse.json();
    lastQueueData = queueData;

    // Update UI
    updateCurrentSong(queueData);
    updateQueueList(queueData);
    updateStatus('Connected', 'success');

  } catch (error) {
    console.error('Failed to fetch queue:', error);
    updateStatus(`Connection Error: ${error.message}`, 'error');
  }
}

// Update current song display
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
  document.getElementById('current-artist').textContent = current.artist || current.album || '';
  document.getElementById('current-singer').textContent = `Sung by: ${current.singer || current.addedBy || 'Unknown'}`;
  
  // Set album cover if available
  if (current.cover || current.coverUrl) {
    document.getElementById('current-cover').src = current.cover || current.coverUrl;
  }
}

// Update queue list
function updateQueueList(data) {
  const queueList = document.getElementById('queue-list');
  const queue = data.queue || [];

  // Skip current song (it's displayed above)
  const upcomingQueue = queue.slice(1);

  if (upcomingQueue.length === 0) {
    queueList.innerHTML = '<div class="queue-empty">Queue is empty</div>';
    return;
  }

  let html = '';
  const displayCount = Math.min(upcomingQueue.length, MAX_QUEUE_ITEMS);

  // Render queue items
  for (let i = 0; i < displayCount; i++) {
    const song = upcomingQueue[i];
    html += renderQueueItem(song, i + 1);
  }

  // Show "more songs" message if queue is larger
  if (upcomingQueue.length > MAX_QUEUE_ITEMS) {
    const moreCount = upcomingQueue.length - MAX_QUEUE_ITEMS;
    html += `<div class="queue-more">+ ${moreCount} more ${moreCount === 1 ? 'song' : 'songs'} in queue</div>`;
  }

  queueList.innerHTML = html;
}

// Render a single queue item
function renderQueueItem(song, position) {
  const cover = song.cover || song.coverUrl || '';
  const title = song.title || 'Unknown Song';
  const artist = song.artist || song.album || 'Unknown Artist';
  const singer = song.singer || song.addedBy || 'Unknown';

  return `
    <div class="queue-item">
      <div class="queue-position">${position}</div>
      <div class="queue-cover">
        ${cover ? `<img src="${cover}" alt="${title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22%3E♪%3C/text%3E%3C/svg%3E'">` : '<div class="cover-placeholder">♪</div>'}
      </div>
      <div class="queue-details">
        <div class="queue-title">${escapeHtml(title)}</div>
        <div class="queue-artist">${escapeHtml(artist)}</div>
        <div class="queue-singer">Added by: ${escapeHtml(singer)}</div>
      </div>
    </div>
  `;
}

// Update status display
function updateStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status status-${type}`;
}

// Update time display
function updateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Listen for fullscreen toggle from Electron
if (window.electronAPI) {
  window.electronAPI.onFullscreenToggled((isFullscreen) => {
    console.log('Fullscreen:', isFullscreen);
  });
}
