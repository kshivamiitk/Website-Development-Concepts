(function() {
    // ---------- State ----------
    let currentUser = null;               // logged-in username
    let userList = [];                    // array of {username, password} from users.txt
    let notepads = [];                     // all notepads (from localStorage)
    let currentNotepadId = null;           // id of opened notepad

    // DOM elements
    const loginSection = document.getElementById('login-section');
    const mainSection = document.getElementById('main-section');
    const loginError = document.getElementById('login-error');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserSpan = document.getElementById('current-user');
    const notepadListDiv = document.getElementById('notepad-list');
    const createBtn = document.getElementById('create-notepad-btn');
    const editorSection = document.getElementById('editor-section');
    const editorTitle = document.getElementById('editor-title');
    const editorBadge = document.getElementById('editor-badge');
    const notepadContent = document.getElementById('notepad-content');
    const saveBtn = document.getElementById('save-notepad-btn');
    const closeEditorBtn = document.getElementById('close-editor-btn');
    const shareSection = document.getElementById('share-section');
    const shareListDiv = document.getElementById('share-list');
    const shareUsername = document.getElementById('share-username');
    const sharePermission = document.getElementById('share-permission');
    const addShareBtn = document.getElementById('add-share-btn');
    const shareError = document.getElementById('share-error');

    // ---------- Helpers ----------
    function loadNotepadsFromStorage() {
        const stored = localStorage.getItem('notepads');
        if (stored) {
            try {
                notepads = JSON.parse(stored);
            } catch (e) {
                notepads = [];
            }
        } else {
            notepads = [];
        }
    }

    function saveNotepadsToStorage() {
        localStorage.setItem('notepads', JSON.stringify(notepads));
    }

    // Get notepads visible to a user (owner or shared) with permission info
    function getNotepadsForUser(user) {
        return notepads.map(np => {
            // if owner
            if (np.owner === user) {
                return { ...np, permission: 'write' };
            }
            // if shared
            const share = np.shares.find(s => s.username === user);
            if (share) {
                return { ...np, permission: share.permission };
            }
            return null;
        }).filter(np => np !== null);
    }

    // Check if a username exists in userList (from users.txt)
    function userExists(username) {
        return userList.some(u => u.username === username);
    }

    // Render the list of notepads for the current user
    function renderNotepadList() {
        if (!currentUser) return;
        const userNotepads = getNotepadsForUser(currentUser);
        if (userNotepads.length === 0) {
            notepadListDiv.innerHTML = '<p>No notepads yet. Create one!</p>';
            return;
        }

        let html = '';
        userNotepads.forEach(np => {
            const ownerLabel = np.owner === currentUser ? '<span class="badge owner">owner</span>' : '';
            const permLabel = np.permission === 'read' ? '<span class="badge readonly">read-only</span>' : '<span class="badge">read/write</span>';
            html += `
                <div class="notepad-item">
                    <div class="notepad-info" data-id="${np.id}">
                        <strong>${np.title || 'Untitled'}</strong> ${ownerLabel} ${permLabel}
                        <div style="font-size:0.9em; color:#666;">by ${np.owner}</div>
                    </div>
                </div>
            `;
        });
        notepadListDiv.innerHTML = html;

        // Attach click listeners to each notepad info div
        document.querySelectorAll('.notepad-info').forEach(el => {
            el.addEventListener('click', () => {
                const id = Number(el.dataset.id);
                openNotepad(id);
            });
        });
    }

    // Open a notepad in the editor
    function openNotepad(id) {
        const notepad = notepads.find(np => np.id === id);
        if (!notepad) return;

        // Determine permission for current user
        let permission = null;
        if (notepad.owner === currentUser) {
            permission = 'write';
        } else {
            const share = notepad.shares.find(s => s.username === currentUser);
            if (share) permission = share.permission;
        }
        if (!permission) return; // should not happen

        currentNotepadId = id;
        editorTitle.textContent = notepad.title || 'Untitled';
        notepadContent.value = notepad.content || '';
        editorBadge.textContent = permission === 'write' ? 'editable' : 'read-only';

        // Enable/disable textarea based on permission
        notepadContent.disabled = (permission !== 'write');
        saveBtn.disabled = (permission !== 'write');

        // Show share section only to owner
        if (notepad.owner === currentUser) {
            shareSection.classList.remove('hidden');
            renderShareList(notepad);
        } else {
            shareSection.classList.add('hidden');
        }

        editorSection.classList.remove('hidden');
    }

    // Render the share list for the currently opened notepad (owner only)
    function renderShareList(notepad) {
        if (!notepad || notepad.owner !== currentUser) return;
        let html = '';
        notepad.shares.forEach((share, index) => {
            html += `
                <div class="share-entry">
                    <span>${share.username} (${share.permission === 'write' ? 'read/write' : 'read-only'})</span>
                    <button class="small-btn danger" data-share-index="${index}">Remove</button>
                </div>
            `;
        });
        if (html === '') html = '<p>No shares yet.</p>';
        shareListDiv.innerHTML = html;

        // Attach remove listeners
        document.querySelectorAll('[data-share-index]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = btn.dataset.shareIndex;
                removeShare(Number(index));
            });
        });
    }

    // Remove a share from the current notepad
    function removeShare(shareIndex) {
        const notepad = notepads.find(np => np.id === currentNotepadId);
        if (!notepad || notepad.owner !== currentUser) return;
        notepad.shares.splice(shareIndex, 1);
        saveNotepadsToStorage();
        renderShareList(notepad);
        // If the current user lost access due to removal? But owner never loses access.
    }

    // Add a share to the current notepad
    function addShare() {
        const username = shareUsername.value.trim();
        const permission = sharePermission.value;
        shareError.textContent = '';

        if (!username) {
            shareError.textContent = 'Username required';
            return;
        }
        if (!userExists(username)) {
            shareError.textContent = 'User does not exist';
            return;
        }
        if (username === currentUser) {
            shareError.textContent = 'You cannot share with yourself';
            return;
        }

        const notepad = notepads.find(np => np.id === currentNotepadId);
        if (!notepad || notepad.owner !== currentUser) return;

        // Check if already shared with this user
        if (notepad.shares.some(s => s.username === username)) {
            shareError.textContent = 'Already shared with this user';
            return;
        }

        notepad.shares.push({ username, permission });
        saveNotepadsToStorage();
        renderShareList(notepad);
        shareUsername.value = '';
    }

    // Create a new notepad
    function createNotepad() {
        const title = prompt('Enter notepad title:', 'New Notepad');
        if (title === null) return;
        const newNotepad = {
            id: Date.now(),
            owner: currentUser,
            title: title,
            content: '',
            shares: []
        };
        notepads.push(newNotepad);
        saveNotepadsToStorage();
        renderNotepadList();
        openNotepad(newNotepad.id);
    }

    // Save the content of the currently opened notepad
    function saveCurrentNotepad() {
        if (!currentNotepadId) return;
        const notepad = notepads.find(np => np.id === currentNotepadId);
        if (!notepad) return;
        // Check permission: only owner or shared write can save
        const canWrite = (notepad.owner === currentUser) || notepad.shares.some(s => s.username === currentUser && s.permission === 'write');
        if (!canWrite) return;
        notepad.content = notepadContent.value;
        saveNotepadsToStorage();
        // Optionally show a brief "saved" message
    }

    // Close editor
    function closeEditor() {
        editorSection.classList.add('hidden');
        currentNotepadId = null;
    }

    // Logout
    function logout() {
        currentUser = null;
        userList = [];
        notepads = [];
        currentNotepadId = null;
        loginSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
        editorSection.classList.add('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        loginError.textContent = '';
    }

    // ---------- Login ----------
    async function login(username, password) {
        loginError.textContent = '';
        try {
            const response = await fetch('users.txt');
            if (!response.ok) throw new Error('Could not fetch users.txt');
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const users = lines.map(line => {
                const [user, pass] = line.split(':').map(s => s.trim());
                return { username: user, password: pass };
            });

            const matchedUser = users.find(u => u.username === username && u.password === password);
            if (matchedUser) {
                currentUser = username;
                userList = users;  // store for existence checks
                loadNotepadsFromStorage();
                loginSection.classList.add('hidden');
                mainSection.classList.remove('hidden');
                currentUserSpan.textContent = currentUser;
                renderNotepadList();
                closeEditor(); // ensure editor is closed
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        } catch (err) {
            loginError.textContent = 'Error loading users.txt. Make sure the file exists.';
            console.error(err);
        }
    }

    // ---------- Event Listeners ----------
    loginBtn.addEventListener('click', () => {
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();
        if (user && pass) {
            login(user, pass);
        } else {
            loginError.textContent = 'Please enter username and password';
        }
    });

    // Allow Enter key in login fields
    [usernameInput, passwordInput].forEach(field => {
        field.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    });

    logoutBtn.addEventListener('click', logout);

    createBtn.addEventListener('click', createNotepad);

    saveBtn.addEventListener('click', saveCurrentNotepad);

    closeEditorBtn.addEventListener('click', closeEditor);

    addShareBtn.addEventListener('click', addShare);

    // Initialize: make sure login is visible, app hidden
    window.onload = function() {
        loginSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
    };
})();