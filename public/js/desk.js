/**
 * VOX LIBRORUM - DESK LOGIC
 * Handles specific interactions for the Project Desk environment.
 */

const DESK_DATA = {
    // Legacy reference for backward compatibility if needed, but we use global DB now.
    // In a real app, this would be empty or removed.
};

constructor() {
    this.activeProjectId = null;
    this.projects = [];
    this.archive = DB.artifacts; // Resources can still use static DB for library for now (The "Vault" step next)
    this.pinned = JSON.parse(localStorage.getItem('voxPinned') || '[]');

    this.dom = {
        projectShelf: document.querySelector('.desk-shelf'),
        projectListContainer: document.getElementById('projectListContainer'),
        pinnedSection: document.getElementById('pinnedSection'),
        pinnedList: document.getElementById('pinnedList'),
        workspaceTitle: document.querySelector('main h2'),
        workspaceDesc: document.querySelector('main p'),
        resourceGrid: document.getElementById('deskWorkspaceGrid'),
        conduitStream: document.querySelector('.conduit-stream'),
        conduitInput: document.querySelector('.conduit-input input'),
        modalOverlay: document.getElementById('resourceModal'),
        modalList: document.getElementById('modalList'),
        addResourceBtn: document.getElementById('addResourceBtn'),
        detailModal: document.getElementById('resourceDetailModal'),
        detailContent: document.getElementById('detailContent'),
        closeDetailBtn: document.getElementById('closeDetailBtn'),
        // Tools
        toolFocus: document.getElementById('toolFocus'),
        toolNote: document.getElementById('toolNote'),
        toolBookmark: document.getElementById('toolBookmark'),
        toolShare: document.getElementById('toolShare'),
        toolScreenshot: document.getElementById('toolScreenshot'),
        noteLayer: document.getElementById('noteLayer'),
        // Settings
        deskSettingsBtn: document.getElementById('deskSettingsBtn'),
        deskSettingsMenu: document.getElementById('deskSettingsMenu'),
        fontDisplay: document.getElementById('fontDisplay'),
        compactModeToggle: document.getElementById('compactModeToggle')
    };

    this.init();
}

    async init() {
    await this.fetchProjects(); // Fetch from network
    this.renderProjectList();
    this.renderPinnedItems();

    if (this.projects.length > 0) {
        this.loadProject(this.projects[0].id);
    } else {
        // No projects? Maybe clear workspace or show empty state
        if (this.dom.workspaceTitle) this.dom.workspaceTitle.innerText = "No Active Projects";
        if (this.dom.workspaceDesc) this.dom.workspaceDesc.innerText = "Create a project to begin.";
        if (this.dom.resourceGrid) this.dom.resourceGrid.innerHTML = '';
    }

    this.setupEventListeners();
    this.setupConduit();
    this.setupTools();
    this.setupSettings();
}

    async fetchProjects() {
    try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
            if (res.status === 401) {
                window.location.href = '../login.html'; // Redirect
                return;
            }
            throw new Error('Failed to load projects');
        }
        this.projects = await res.json();
        // Parse resources_json if it comes as string (should be object via express/sequelize magic but let's be safe)
        this.projects.forEach(p => {
            if (typeof p.resources_json === 'string') {
                p.resources = JSON.parse(p.resources_json);
            } else {
                p.resources = p.resources_json || []; // Mapping DB field to frontend field
            }
        });
    } catch (err) {
        console.error(err);
        // Fallback for demo if offline
        this.projects = [];
        this.logToConduit('<strong>System:</strong> Connection lost. ' + err.message, false, 'red');
    }
}

setupSettings() {
    if (!this.dom.deskSettingsBtn || !this.dom.deskSettingsMenu) return;

    // Toggle Menu
    this.dom.deskSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.deskSettingsMenu.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!this.dom.deskSettingsMenu.contains(e.target) && e.target !== this.dom.deskSettingsBtn) {
            this.dom.deskSettingsMenu.classList.add('hidden');
        }
    });

    // Theme Switcher
    const themeBtns = this.dom.deskSettingsMenu.querySelectorAll('[data-theme]');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme === 'light') document.body.classList.add('light-mode');
            else document.body.classList.remove('light-mode');

            // Active state
            themeBtns.forEach(b => b.classList.replace('text-white', 'text-white/50'));
            btn.classList.replace('text-white/50', 'text-white');
        });
    });

    // Typography
    let fontSizePct = 100;
    const updateFont = () => {
        document.documentElement.style.fontSize = fontSizePct + '%';
        if (this.dom.fontDisplay) this.dom.fontDisplay.innerText = fontSizePct + '%';
    };
    const incBtn = document.getElementById('increaseFont');
    const decBtn = document.getElementById('decreaseFont');
    if (incBtn) incBtn.addEventListener('click', (e) => { e.stopPropagation(); fontSizePct = Math.min(130, fontSizePct + 5); updateFont(); });
    if (decBtn) decBtn.addEventListener('click', (e) => { e.stopPropagation(); fontSizePct = Math.max(80, fontSizePct - 5); updateFont(); });

    // Accents
    const colorBtns = this.dom.deskSettingsMenu.querySelectorAll('[data-color]');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            document.documentElement.style.setProperty('--ember', color);
            // Also update rgba soft
            document.documentElement.style.setProperty('--ember-soft', color + '40'); // simple approx
        });
    });

    // Compact Mode
    if (this.dom.compactModeToggle) {
        this.dom.compactModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('compact-mode');
            const dot = this.dom.compactModeToggle.querySelector('.toggle-dot');
            const track = this.dom.compactModeToggle.querySelector('div.relative'); // The track container

            if (document.body.classList.contains('compact-mode')) {
                dot.style.transform = 'translateX(100%)';
                dot.classList.add('bg-amber-500');
                dot.classList.remove('bg-white/40');
                if (track) track.classList.add('bg-amber-500/20');
            } else {
                dot.style.transform = 'translateX(0)';
                dot.classList.remove('bg-amber-500');
                dot.classList.add('bg-white/40');
                if (track) track.classList.remove('bg-amber-500/20');
            }
        });
    }
}

setupTools() {
    if (this.dom.toolFocus) this.dom.toolFocus.addEventListener('click', () => this.toggleFocusMode());
    if (this.dom.toolNote) this.dom.toolNote.addEventListener('click', () => this.addStickyNote());
    if (this.dom.toolBookmark) this.dom.toolBookmark.addEventListener('click', () => this.bookmarkState());
    if (this.dom.toolShare) this.dom.toolShare.addEventListener('click', () => this.shareProject());
    if (this.dom.toolScreenshot) this.dom.toolScreenshot.addEventListener('click', () => this.takeScreenshot());
}

toggleFocusMode() {
    document.body.classList.toggle('focus-active');
    const isActive = document.body.classList.contains('focus-active');
    this.logToConduit(`<strong>System:</strong> Focus Mode ${isActive ? 'Engaged' : 'Disengaged'}.`);
}

addStickyNote(text = '') {
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.style.left = Math.random() * 20 + 10 + '%';
    note.style.top = Math.random() * 20 + 20 + '%';

    note.innerHTML = `
            <div class="sticky-close">✕</div>
            <textarea placeholder="Field notes...">${text}</textarea>
        `;

    // Close
    note.querySelector('.sticky-close').addEventListener('click', () => note.remove());

    // Draggable Logic
    let isDragging = false;
    let offsetX, offsetY;

    note.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'textarea') return; // Allow typing
        isDragging = true;
        note.classList.add('dragging');
        offsetX = e.clientX - note.getBoundingClientRect().left;
        offsetY = e.clientY - note.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // Constrain to container (roughly)
        const parent = this.dom.noteLayer;
        if (!parent) return;

        // We're essentially moving it fixed relative to viewport for now or relative to layer
        // Since noteLayer is absolute inset-0 of relative DeskWorkspace?
        // Actually noteLayer is inside main.desk-workspace.
        // Let's just use simple styles.

        note.style.left = (e.clientX - 260 - offsetX) + 'px'; // 260 is approx sidebar width
        note.style.top = (e.clientY - 60 - offsetY) + 'px'; // 60 is approx header height
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        note.classList.remove('dragging');
    });

    // Re-enable pointer events for the note itself (layer is none)
    note.style.pointerEvents = 'auto';
    this.dom.noteLayer.appendChild(note);
}

bookmarkState() {
    // Save current view state toast
    this.logToConduit(`<strong>System:</strong> Workspace state saved to local archives.`);
    const btn = this.dom.toolBookmark;
    const original = btn.innerHTML;
    btn.innerHTML = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
    setTimeout(() => btn.innerHTML = original, 2000);
}

shareProject() {
    const project = this.projects.find(p => p.id === this.activeProjectId);
    const text = `Project: ${project.title}\nResources: ${project.resources.length}\n\nVox Librorum Secure Link: vox://share/${project.id}`;
    navigator.clipboard.writeText(text).then(() => {
        this.logToConduit(`<strong>System:</strong> Secure share link generated and copied.`);
    });
}

takeScreenshot() {
    this.logToConduit(`<strong>System:</strong> Capturing workspace visual...`);
    // We temporarily hide the toolbar for the shot
    const toolbar = document.querySelector('.desk-toolbar');
    if (toolbar) toolbar.style.display = 'none';

    html2canvas(document.body).then(canvas => {
        if (toolbar) toolbar.style.display = 'flex';

        // Download
        const link = document.createElement('a');
        link.download = `vox-desk-snap-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        this.logToConduit(`<strong>System:</strong> Snapshot downloaded.`);
    }).catch(err => {
        if (toolbar) toolbar.style.display = 'flex';
        console.error(err);
        this.logToConduit(`<strong>System:</strong> Capture failed: ${err.message}`, false, 'red');
    });
}

// --- PINNED ITEMS ---
togglePin(resource) {
    const index = this.pinned.findIndex(i => i.id === resource.id);
    if (index >= 0) {
        this.pinned.splice(index, 1);
        this.logToConduit(`<strong>System:</strong> Unpinned "${resource.title}".`);
    } else {
        this.pinned.push(resource);
        this.logToConduit(`<strong>System:</strong> Pinned "${resource.title}" to quick view.`);
    }
    localStorage.setItem('voxPinned', JSON.stringify(this.pinned));
    this.renderPinnedItems();
    // Re-render current resources to update pin icon state
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (project) this.renderResources(project.resources);
}

renderPinnedItems() {
    if (!this.dom.pinnedSection || !this.dom.pinnedList) return;

    if (this.pinned.length === 0) {
        this.dom.pinnedSection.classList.add('hidden');
        return;
    }

    this.dom.pinnedSection.classList.remove('hidden');
    this.dom.pinnedList.innerHTML = '';

    this.pinned.forEach(item => {
        const el = document.createElement('div');
        el.className = 'text-sm text-white/60 p-2 rounded hover:bg-white/5 cursor-pointer flex justify-between group transition-colors hover:text-white';
        el.innerHTML = `
                <span class="truncate pr-2">${item.title}</span>
                <button class="text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            `;

        // Unpin on X click
        el.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePin(item);
        });
        // Load if it has a page, or just highlight? For now, nothing on main click or maybe open detail modal?
        // Let's assume clicking it does nothing for now as items are just "References".

        this.dom.pinnedList.appendChild(el);
    });
}

// --- PROJECTS ---
renderProjectList() {
    if (!this.dom.projectListContainer) return;

    this.dom.projectListContainer.innerHTML = '';

    this.projects.forEach(p => {
        const el = document.createElement('div');
        el.className = `project-item ${p.id === this.activeProjectId ? 'active' : ''}`;
        el.dataset.id = p.id;
        el.innerHTML = `
                <svg class="project-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                </svg>
                <div class="flex-grow">
                    <div class="font-medium text-sm text-white/90">${p.title}</div>
                    <div class="text-[0.65rem] text-white/50">${p.resources.length} Resources</div>
                </div>
            `;
        el.addEventListener('click', () => this.loadProject(p.id));
        this.dom.projectListContainer.appendChild(el);
    });

    // Create Button
    const createBtn = document.createElement('button');
    createBtn.className = "flex items-center gap-2 text-xs text-amber-500 hover:text-amber-400 mt-6 pl-2 disabled:opacity-50";
    createBtn.innerHTML = `<span>+</span> Create New Project`;
    createBtn.addEventListener('click', () => this.openCreateProjectModal());

    this.dom.projectListContainer.appendChild(createBtn);
}

loadProject(id) {
    this.activeProjectId = id;
    const project = this.projects.find(p => p.id === id);
    if (!project) return;

    // Update Sidebar UI
    if (this.dom.projectListContainer) {
        this.dom.projectListContainer.querySelectorAll('.project-item').forEach(el => {
            el.classList.toggle('active', el.dataset.id === id);
        });
    }

    // Update Workspace Header
    if (this.dom.workspaceTitle) this.dom.workspaceTitle.innerText = project.title;
    if (this.dom.workspaceDesc) this.dom.workspaceDesc.innerText = project.description;

    // Render Resources
    this.renderResources(project.resources);

    // Notify Conduit
    if (this.dom.conduitStream) {
        this.logToConduit(`<strong>System:</strong> Loaded context: "${project.title}"`, true);
        setTimeout(() => {
            if (window.VOX_UTILS && window.VOX_UTILS.decodeText) {
                const msg = this.logToConduit('<strong>AI:</strong> <span class="ai-text">Analyzing...</span>');
                const span = msg.querySelector('.ai-text');
                if (span) window.VOX_UTILS.decodeText(span, project.aiContext || "Awaiting input.", 1000);
            } else {
                this.logToConduit(`<strong>AI:</strong> ${project.aiContext || "Ready."}`);
            }
        }, 600);
    }
}

renderResources(resources) {
    if (!this.dom.resourceGrid) return;
    this.dom.resourceGrid.innerHTML = '';

    resources.forEach((res, index) => {
        const isPinned = this.pinned.some(p => p.id === res.id);
        const card = document.createElement('article');
        card.className = 'resource-card group relative active:cursor-grabbing cursor-grab'; // Cursor feedback
        card.draggable = true; // Make Draggable
        card.dataset.id = res.id;
        card.dataset.index = index;

        let iconColor = 'text-gray-400';
        let iconPath = 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';

        const typeLower = (res.type || 'unknown').toLowerCase();

        if (typeLower === 'oral-history') { iconColor = 'text-amber-500'; iconPath = 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'; }
        else if (typeLower === 'map' || typeLower === 'cartography') { iconColor = 'text-blue-400'; iconPath = 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'; }
        else if (typeLower === 'manuscript') { iconColor = 'text-emerald-400'; }
        else if (typeLower === 'oddities') { iconColor = 'text-purple-400'; iconPath = 'M13 10V3L4 14h7v7l9-11h-7z'; } // Bolt icon for oddities

        card.innerHTML = `
                <div class="flex justify-between items-start mb-4 pointer-events-none"> <!-- Disable pointer events on children so drag isn't blocked -->
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
                        </svg>
                        <span class="text-xs uppercase tracking-wide ${iconColor} opacity-80">${res.type}</span>
                    </div>
                     <div class="flex gap-2 pointer-events-auto"> <!-- Re-enable for buttons -->
                        <button class="action-pin text-white/20 hover:text-amber-500 transition-colors" title="${isPinned ? 'Unpin' : 'Pin'}">
                            <svg class="w-4 h-4 ${isPinned ? 'text-amber-500 fill-current' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                        </button>
                         <button class="action-cite text-white/20 hover:text-blue-400 transition-colors" title="Copy Citation">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                            </svg>
                        </button>
                        <button class="action-remove text-white/20 hover:text-red-400 transition-colors" title="Remove">✕</button>
                    </div>
                </div>
                <h3 class="resource-title text-lg font-serif text-white mb-2 cursor-pointer hover:underline pointer-events-auto">${res.title}</h3>
                <p class="text-sm text-gray-400 mb-4 line-clamp-3 pointer-events-none">${res.summary || ''}</p>
                <div class="flex gap-2 pointer-events-none flex-wrap">
                    ${(res.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
                </div>
            `;

        // Drag Listeners
        card.addEventListener('dragstart', (e) => this.handleDragStart(e, index));
        card.addEventListener('dragover', (e) => this.handleDragOver(e));
        card.addEventListener('drop', (e) => this.handleDrop(e, index));
        card.addEventListener('dragend', (e) => this.handleDragEnd(e));

        // Button Listeners
        card.querySelector('.action-pin').addEventListener('click', (e) => { e.stopPropagation(); this.togglePin(res); });
        card.querySelector('.action-cite').addEventListener('click', (e) => { e.stopPropagation(); this.copyCitation(res); });
        card.querySelector('.action-remove').addEventListener('click', (e) => { e.stopPropagation(); this.removeResource(res.id); });

        // View Details - Click on Title or Card Background (if not dragging)
        card.querySelector('.resource-title').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openResourceDetail(res);
        });
        // We can also add a double-click on the card
        card.addEventListener('dblclick', (e) => {
            this.openResourceDetail(res);
        });

        this.dom.resourceGrid.appendChild(card);
    });

    // Add Card
    const addCard = document.createElement('article');
    addCard.className = 'resource-card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-8 hover:bg-white/5 cursor-pointer transition-colors';
    addCard.style.minHeight = '200px';
    addCard.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
            <span class="text-sm text-white/40">Open Resource Library</span>
        `;
    addCard.addEventListener('click', () => this.openModal());
    addCard.addEventListener('dragover', (e) => e.preventDefault()); // Allow drop near it?

    this.dom.resourceGrid.appendChild(addCard);
}

// --- DRAG AND DROP HANDLERS ---
handleDragStart(e, index) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    e.target.classList.add('opacity-50', 'scale-95');
}

handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

handleDrop(e, targetIndex) {
    e.stopPropagation();
    e.preventDefault();

    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    // Reorder
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project) return;

    const items = [...project.resources];
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(targetIndex, 0, removed);

    project.resources = items;
    this.renderResources(project.resources);

    // No log needed for reorder, keep it subtle
}

handleDragEnd(e) {
    e.target.classList.remove('opacity-50', 'scale-95');
}

copyCitation(res) {
    const year = new Date().getFullYear();
    const text = `"${res.title}." Vox Librorum Archive. ID: ${res.id}. Accessed ${year}.`;

    navigator.clipboard.writeText(text).then(() => {
        this.logToConduit(`<strong>System:</strong> Citation verified/copied: ${res.id}`);
    }).catch(err => {
        this.logToConduit(`<strong>System:</strong> Error copying citation.`, false, 'red');
    });
}

setupEventListeners() {
    if (this.dom.addResourceBtn) {
        this.dom.addResourceBtn.addEventListener('click', () => this.openModal());
    }

    // Create Project Modal Listeners
    const confirmBtn = document.getElementById('confirmCreateProjectBtn');
    const cancelBtn = document.getElementById('cancelCreateProjectBtn');
    const input = document.getElementById('newProjectTitle');

    if (confirmBtn) confirmBtn.addEventListener('click', () => this.createProject());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeCreateProjectModal());

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createProject();
        });
    }

    // Detail Modal
    if (this.dom.closeDetailBtn) {
        this.dom.closeDetailBtn.addEventListener('click', () => this.closeResourceDetail());
    }
    // Close on background click
    if (this.dom.detailModal) {
        this.dom.detailModal.addEventListener('click', (e) => {
            if (e.target === this.dom.detailModal) this.closeResourceDetail();
        });
    }
}

setupConduit() {
    if (!this.dom.conduitInput) return;
    this.dom.conduitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = this.dom.conduitInput.value;
            if (!val.trim()) return;
            this.dom.conduitInput.value = '';
            this.logToConduit(`> ${val}`, false, 'rgba(255,255,255,0.8)');
            setTimeout(() => { this.processCommand(val); }, 800);
        }
    });
}

processCommand(cmd) {
    const lower = cmd.toLowerCase();
    let response = `<strong>Assistant:</strong> I'm analyzing "${cmd}"...`;
    let encodedText = "";

    if (lower.includes('analyze') || lower.includes('scan')) {
        if (this.activeProjectId === 'salt-line') {
            encodedText = "Cross-referencing coastal data. Discrepancy found in sector 4.";
        } else {
            encodedText = "Scanning current project resources... No structural anomalies detected in text data.";
        }
    } else if (lower.includes('hello') || lower.includes('hi')) {
        encodedText = "Greetings, Archivist Nova. I am ready to assist.";
    } else if (lower.includes('help')) {
        encodedText = "Available commands: ANALYZE, SCAN, IMPORT, CONNECT.";
    }

    if (encodedText && window.VOX_UTILS && window.VOX_UTILS.decodeText) {
        const msg = this.logToConduit('<strong>Assistant:</strong> <span class="ai-resp">Processing...</span>');
        const span = msg.querySelector('.ai-resp');
        if (span) window.VOX_UTILS.decodeText(span, encodedText, 800);
    } else {
        this.logToConduit(response);
    }
}

logToConduit(html, pulse = false, color = null) {
    if (!this.dom.conduitStream) return;
    const msg = document.createElement('div');
    msg.className = `ai-msg ${pulse ? 'animate-pulse' : ''}`;
    if (color) msg.style.color = color;
    msg.innerHTML = html;
    this.dom.conduitStream.appendChild(msg);
    this.dom.conduitStream.scrollTop = this.dom.conduitStream.scrollHeight;
    return msg;
}

openModal() {
    if (!this.dom.modalOverlay) return;

    this.dom.modalList.innerHTML = '';
    this.archive.forEach(item => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer';
        row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-amber-500/50"></div>
                    <span class="text-sm text-white/80">${item.title}</span>
                    <span class="text-xs text-white/30 uppercase">${item.type}</span>
                </div>
                <button class="text-xs text-amber-500 hover:text-amber-400 font-medium px-2 py-1 rounded border border-transparent hover:border-amber-500/30 transition-all">Add +</button>
            `;

        // Logic: Click row or button to add
        const handleAdd = (e) => {
            e.stopPropagation();
            const btn = row.querySelector('button');

            // Check if already added
            const project = this.projects.find(p => p.id === this.activeProjectId);
            if (project && project.resources.some(r => r.id === item.id)) {
                btn.innerText = "Already Added";
                btn.className = "text-xs text-white/40 font-medium px-2 py-1";
                setTimeout(() => {
                    btn.innerText = "Add +";
                    btn.className = "text-xs text-amber-500 hover:text-amber-400 font-medium px-2 py-1 rounded border border-transparent hover:border-amber-500/30 transition-all";
                }, 1500);
                return;
            }

            this.addResourceToProject(item);

            // Visual Feedback
            btn.innerText = "Added";
            btn.className = "text-xs text-emerald-400 font-medium px-2 py-1";
        };

        row.addEventListener('click', handleAdd);
        row.querySelector('button').addEventListener('click', handleAdd);

        this.dom.modalList.appendChild(row);
    });

    this.dom.modalOverlay.classList.remove('hidden');
    this.dom.modalOverlay.classList.add('flex');
}

closeModal() {
    this.dom.modalOverlay.classList.add('hidden');
    this.dom.modalOverlay.classList.remove('flex');
}

addResourceToProject(item) {
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project) return;

    if (!project.resources.some(r => r.id === item.id)) {
        project.resources.push({
            ...item,
            summary: item.summary || item.desc || "Imported from Archive. Awaiting full analysis.",
            tags: item.tags || ["Imported"], // Ensure tags exist to prevent crash
        });
        this.renderResources(project.resources);
        this.renderProjectList();
        this.logToConduit(`<strong>System:</strong> Imported "${item.title}" from Archive.`);
    } else {
        this.logToConduit(`<strong>System:</strong> Item "${item.title}" is already in workspace.`);
    }
}

openResourceDetail(res) {
    if (!this.dom.detailModal || !this.dom.detailContent) return;

    const typeDisplay = res.type || "Unknown Type";
    const metaInfo = [
        { label: "Origin", value: res.origin },
        { label: "Date", value: res.date },
        { label: "Material", value: res.material },
        { label: "Hazard Rating", value: res.hazard }
    ].filter(m => m.value);

    const html = `
            <div class="flex items-center gap-3 mb-6">
                 <span class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    ${typeDisplay}
                 </span>
                 <span class="text-xs text-white/40 uppercase tracking-widest">${res.id}</span>
            </div>
            
            <h2 class="text-3xl font-serif text-white mb-6 leading-tight">${res.title}</h2>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="space-y-4">
                    <h4 class="text-xs uppercase tracking-widest text-white/50 border-b border-white/10 pb-2">Description</h4>
                    <p class="text-gray-300 leading-relaxed text-sm">${res.desc || res.summary || "No description available."}</p>
                </div>
                <div class="space-y-4">
                    <h4 class="text-xs uppercase tracking-widest text-white/50 border-b border-white/10 pb-2">Metadata</h4>
                    <ul class="space-y-3">
                        ${metaInfo.map(m => `
                            <li class="flex justify-between text-sm">
                                <span class="text-white/40">${m.label}</span>
                                <span class="text-white/80 text-right">${m.value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            ${res.img ? `
            <div class="mb-8 p-4 bg-black/40 rounded-lg border border-white/5">
                <p class="text-center text-xs text-white/30 italic">Attached Signal / Image Data: ${res.img}</p>
                 <!-- Image placeholder -->
                <div class="w-full h-48 bg-gray-900 mt-2 flex items-center justify-center text-white/10">
                    [NO SIGNAL]
                </div>
            </div>
            ` : ''}

            <div class="flex gap-2 flex-wrap mt-4">
                ${(res.tags || []).map(t => `<span class="px-3 py-1 rounded bg-white/5 text-white/60 text-xs border border-white/5">${t}</span>`).join('')}
            </div>
        `;

    this.dom.detailContent.innerHTML = html;
    this.dom.detailModal.classList.remove('hidden');
    this.dom.detailModal.classList.add('flex');
}

closeResourceDetail() {
    if (this.dom.detailModal) {
        this.dom.detailModal.classList.add('hidden');
        this.dom.detailModal.classList.remove('flex');
        this.dom.detailContent.innerHTML = '';
    }
}

openCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    const input = document.getElementById('newProjectTitle');
    if (!modal || !input) return;

    input.value = ''; // Reset
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    input.focus();
}

closeCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

createProject() {
    const input = document.getElementById('newProjectTitle');
    if (!input) return;

    const title = input.value.trim();
    if (!title) return;

    const newId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newProj = {
        id: newId,
        title: title,
        description: "New investigation awaiting parameters.",
        resources: [],
        aiContext: "Initializing new sector scan..."
    };
    this.projects.push(newProj);
    this.renderProjectList();
    this.loadProject(newId);
    this.closeCreateProjectModal();
    this.logToConduit(`<strong>System:</strong> New project "${title}" initialized.`);
}

removeResource(id) {
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project) return;

    project.resources = project.resources.filter(r => r.id !== id);
    this.renderResources(project.resources);
    this.renderProjectList(); // update count
    this.logToConduit(`<strong>System:</strong> Resource removed from project.`);
}
}

// Global instance
let deskManager;
document.addEventListener('DOMContentLoaded', () => {
    deskManager = new DeskManager();
});
