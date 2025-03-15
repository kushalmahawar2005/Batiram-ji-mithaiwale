document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // Check if user is already logged in and session is valid
    const adminToken = localStorage.getItem('adminToken');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (adminToken && sessionExpiry && new Date().getTime() < parseInt(sessionExpiry)) {
        window.location.href = 'admin.html';
    } else {
        // Clear expired session
        localStorage.removeItem('adminToken');
        localStorage.removeItem('sessionExpiry');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store the admin token with 24-hour expiry
                localStorage.setItem('adminToken', data.token);
                const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
                localStorage.setItem('sessionExpiry', expiry.toString());
                
                // Store last login time
                localStorage.setItem('lastLogin', new Date().toISOString());
                
                // Redirect to dashboard with secure state
                const secureRedirect = btoa(JSON.stringify({
                    timestamp: new Date().getTime(),
                    token: data.token
                }));
                window.location.href = `admin.html?auth=${secureRedirect}`;
            } else {
                showError(data.message || 'Invalid email or password');
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    });

    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        if (!email) {
            showError('Please enter your email address first.');
            return;
        }

        try {
            const response = await fetch('/api/admin/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Password reset instructions have been sent to your email.');
            } else {
                showError(data.message || 'Failed to send reset instructions.');
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Forgot password error:', error);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    function showSuccess(message) {
        errorMessage.style.backgroundColor = '#e8f5e9';
        errorMessage.style.color = '#2e7d32';
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}); 