// PWA Install Prompt
let installPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  installPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      console.log('PWA installed');
      showNotification('App installed successfully!');
    }
  });
  installPrompt = null;
  installBtn.style.display = 'none';
});

// Modal Management
const uploadModal = document.getElementById('uploadModal');
const uploadBtn = document.getElementById('uploadBtn');
const closeUploadBtn = document.getElementById('closeUploadBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');
const uploadForm = document.getElementById('uploadForm');
const contentType = document.getElementById('contentType');
const linkInputDiv = document.getElementById('linkInput');
const fileInputDiv = document.getElementById('fileInputDiv');

uploadBtn.addEventListener('click', () => uploadModal.classList.add('active'));
closeUploadBtn.addEventListener('click', () => uploadModal.classList.remove('active'));
cancelUploadBtn.addEventListener('click', () => uploadModal.classList.remove('active'));
uploadModal.addEventListener('click', (e) => {
  if (e.target === uploadModal) uploadModal.classList.remove('active');
});

contentType.addEventListener('change', () => {
  linkInputDiv.style.display = 'none';
  fileInputDiv.style.display = 'none';
  if (['app', 'link'].includes(contentType.value)) linkInputDiv.style.display = 'block';
  else if (['image', 'video', 'file'].includes(contentType.value)) fileInputDiv.style.display = 'block';
});

// File Upload
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInputField = document.getElementById('fileInputField');

fileUploadArea.addEventListener('click', () => fileInputField.click());
fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('dragover'); });
fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragover'));
fileUploadArea.addEventListener('drop', (e) => { e.preventDefault(); fileUploadArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
fileInputField.addEventListener('change', (e) => handleFiles(e.target.files));

function handleFiles(files) {
  fileUploadArea.innerHTML = `✅ ${files.length} file(s) selected`;
}

// Form Submission
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = {
    id: Date.now(),
    type: contentType.value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    url: document.getElementById('url').value,
    tags: document.getElementById('tags').value.split(',').map(t => t.trim()),
    isPublic: document.getElementById('isPublic').checked,
    createdAt: new Date().toISOString(),
    fileCount: fileInputField.files.length
  };
  
  const items = JSON.parse(localStorage.getItem('sharedItems') || '[]');
  items.unshift(content);
  localStorage.setItem('sharedItems', JSON.stringify(items));
  
  showNotification(`Content "${content.title}" uploaded successfully!`);
  uploadForm.reset();
  fileUploadArea.innerHTML = `<div style="font-size: 48px; margin-bottom: 12px;">📁</div><p><strong>Click to upload or drag and drop</strong></p>`;
  uploadModal.classList.remove('active');
  renderContent();
});

// Content Rendering
function renderContent(filter = 'all') {
  const contentGrid = document.getElementById('contentGrid');
  const items = JSON.parse(localStorage.getItem('sharedItems') || '[]');
  const filtered = filter === 'all' ? items : items.filter(item => item.type === filter);
  
  contentGrid.innerHTML = filtered.length === 0 
    ? `<div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: #6b7280;"><div style="font-size: 48px; margin-bottom: 16px;">🗑️</div><p>No content yet. Start uploading!</p></div>`
    : filtered.map(item => `
      <div class="content-item" onclick="handleContentClick('${item.id}')">
        <div class="content-thumbnail">${getContentIcon(item.type)}</div>
        <div class="content-info">
          <h4>${item.title}</h4>
          <p>${item.type} • ${new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    `).join('');
}

function getContentIcon(type) {
  const icons = { 'app': '📱', 'link': '🔗', 'image': '🖼️', 'video': '🎥', 'file': '📄' };
  return icons[type] || '📦';
}

function handleContentClick(id) {
  const items = JSON.parse(localStorage.getItem('sharedItems') || '[]');
  const item = items.find(i => i.id == id);
  if (item?.url) window.open(item.url, '_blank');
  else showNotification(`${item.title}`);
}

// Tab Handler
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderContent(btn.dataset.tab);
  });
});

// Notification
function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: ${type === 'error' ? '#ef4444' : '#10b981'}; color: white;
    padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000; max-width: 400px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Browse Button
document.getElementById('browseBtn').addEventListener('click', () => {
  document.getElementById('shared').scrollIntoView({ behavior: 'smooth' });
});

// Initial Render
renderContent();

// Menu Button
document.getElementById('menuBtn').addEventListener('click', () => {
  showNotification('Menu opened');
});
