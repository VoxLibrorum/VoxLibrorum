document.addEventListener('DOMContentLoaded', () => {
    console.log("Vox Login System: Online (External Script)");

    // Tabs
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const gateForm = document.getElementById('gateForm');
    const signupForm = document.getElementById('signupForm');

    if (tabLogin && tabSignup && gateForm && signupForm) {
        tabLogin.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Switching to Login");
            tabLogin.className = "text-xs uppercase tracking-[0.2em] text-amber-500 pb-2 border-b-2 border-amber-500 transition-colors cursor-pointer";
            tabSignup.className = "text-xs uppercase tracking-[0.2em] text-white/30 pb-2 border-b-2 border-transparent hover:text-white/60 transition-colors cursor-pointer";
            gateForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        });

        tabSignup.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Switching to Signup");
            tabSignup.className = "text-xs uppercase tracking-[0.2em] text-amber-500 pb-2 border-b-2 border-amber-500 transition-colors cursor-pointer";
            tabLogin.className = "text-xs uppercase tracking-[0.2em] text-white/30 pb-2 border-b-2 border-transparent hover:text-white/60 transition-colors cursor-pointer";
            signupForm.classList.remove('hidden');
            gateForm.classList.add('hidden');
        });
    }

    // 🟢 REAL AUTH LOGIC
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('passkey');
    const errorMsg = document.getElementById('errorMsg');

    // LOGIN
    if (gateForm) {
        gateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Attempting Login...");
            // Reset UI
            if (errorMsg) errorMsg.style.opacity = '0';

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) return;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                // Check if 404 (Server API missing) or Network Error
                if (res.status === 404 || res.status === 500) throw new Error('OFFLINE_MODE');

                const data = await res.json();

                if (res.ok) {
                    if (errorMsg) {
                        errorMsg.style.color = '#34d399';
                        errorMsg.innerText = 'Identity Verified. Access Granted.';
                        errorMsg.style.opacity = '1';
                    }
                    setTimeout(() => window.location.href = 'desk/index.html', 800);
                } else {
                    throw new Error(data.error || 'Access Denied');
                }
            } catch (err) {
                console.warn("Backend Unreachable, attempting Simulation Mode...", err);

                // 🟡 FALLBACK: SIMULATION MODE (For GitHub Pages / Static Demo)
                // In a real secure environment, you wouldn't do this. 
                // But for valid "Publish to GitHub" readiness, this ensures the UI works.
                if (username && password) {
                    // Simple Mock Logic
                    if (password === 'secret123' || password === 'EMBER' || password === 'NOVA') {
                        console.log("Simulation Access Granted");
                        // Store a fake token so Desk knows we are 'dummmy' logged in
                        localStorage.setItem('vox_demo_user', username);

                        if (errorMsg) {
                            errorMsg.style.color = '#fbbf24'; // Amber for simulation
                            errorMsg.innerText = 'Offline Mode: Simulation Access Granted.';
                            errorMsg.style.opacity = '1';
                        }
                        setTimeout(() => window.location.href = 'desk/index.html', 1000);
                        return;
                    }
                }

                if (errorMsg) {
                    console.error(err);
                    errorMsg.style.color = '#ef4444';
                    errorMsg.innerText = (err.message === 'OFFLINE_MODE')
                        ? 'Archive Offline. Try Passkey: EMBER'
                        : err.message;
                    errorMsg.style.opacity = '1';
                }
            }
        });
    }

    // REGISTER
    const newIdentifier = document.getElementById('newIdentifier');
    const newEmail = document.getElementById('newEmail');
    const newPass = document.getElementById('newPass');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Attempting Registration...");
            const btn = signupForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Encrypting...";
            btn.disabled = true;

            const username = newIdentifier.value.trim();
            const email = newEmail.value.trim();
            const password = newPass.value.trim();

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (res.status === 404 || res.status === 500) throw new Error('OFFLINE_MODE');

                const data = await res.json();

                if (res.ok) {
                    alert("Clearance Granted. Please log in with your new credentials.");
                    location.reload(); // Reload to go back to login tab
                } else {
                    throw new Error(data.error || 'Registration Failed');
                }
            } catch (err) {
                console.warn("Backend Unreachable, attempting Simulation Mode...", err);

                // 🟡 FALLBACK: MOCK REGISTRATION
                alert("Archive Offline. Local Simulation Account Created.\n\nPlease log in with your set Credentials (or use passkey 'EMBER').");
                localStorage.setItem('vox_demo_user', username);
                location.reload();
            }
        });
    }
});
