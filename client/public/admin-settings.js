document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();

    // Load current settings
    loadSettings();

    // Setup event listeners
    setupEventListeners();
});

function checkAuth() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'admin-login.html';
    }
}

async function loadSettings() {
    try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/settings', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load settings');
        }

        const settings = await response.json();
        updateSettingsForms(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Failed to load settings', 'error');
    }
}

function updateSettingsForms(settings) {
    // Update General Settings
    const generalForm = document.getElementById('generalSettingsForm');
    generalForm.querySelector('[name="storeName"]').value = settings.storeName || '';
    generalForm.querySelector('[name="storeEmail"]').value = settings.storeEmail || '';
    generalForm.querySelector('[name="storePhone"]').value = settings.storePhone || '';
    generalForm.querySelector('[name="storeAddress"]').value = settings.storeAddress || '';
    generalForm.querySelector('[name="openTime"]').value = settings.openTime || '09:00';
    generalForm.querySelector('[name="closeTime"]').value = settings.closeTime || '21:00';

    // Update Notification Settings
    const notificationForm = document.getElementById('notificationSettingsForm');
    notificationForm.querySelector('[name="newOrder"]').checked = settings.notifications?.email?.newOrder || false;
    notificationForm.querySelector('[name="lowStock"]').checked = settings.notifications?.email?.lowStock || false;
    notificationForm.querySelector('[name="customerSupport"]').checked = settings.notifications?.email?.customerSupport || false;
    notificationForm.querySelector('[name="smsNewOrder"]').checked = settings.notifications?.sms?.newOrder || false;
    notificationForm.querySelector('[name="smsDelivery"]').checked = settings.notifications?.sms?.delivery || false;

    // Update Payment Settings
    const paymentForm = document.getElementById('paymentSettingsForm');
    paymentForm.querySelector('[name="cod"]').checked = settings.payment?.cod || false;
    paymentForm.querySelector('[name="upi"]').checked = settings.payment?.upi || false;
    paymentForm.querySelector('[name="card"]').checked = settings.payment?.card || false;
    paymentForm.querySelector('[name="minOrderAmount"]').value = settings.payment?.minOrderAmount || 100;
    paymentForm.querySelector('[name="deliveryCharges"]').value = settings.payment?.deliveryCharges || 50;

    // Update Security Settings
    const securityForm = document.getElementById('securitySettingsForm');
    securityForm.querySelector('[name="2fa"]').checked = settings.security?.twoFactorAuth || false;
}

function setupEventListeners() {
    // Sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-hidden');
    });

    // Form submissions
    document.getElementById('generalSettingsForm').addEventListener('submit', handleGeneralSettingsSubmit);
    document.getElementById('notificationSettingsForm').addEventListener('submit', handleNotificationSettingsSubmit);
    document.getElementById('paymentSettingsForm').addEventListener('submit', handlePaymentSettingsSubmit);
    document.getElementById('securitySettingsForm').addEventListener('submit', handleSecuritySettingsSubmit);
}

async function handleGeneralSettingsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
        storeName: formData.get('storeName'),
        storeEmail: formData.get('storeEmail'),
        storePhone: formData.get('storePhone'),
        storeAddress: formData.get('storeAddress'),
        openTime: formData.get('openTime'),
        closeTime: formData.get('closeTime')
    };

    try {
        await updateSettings('general', settings);
        showNotification('General settings updated successfully');
    } catch (error) {
        console.error('Error updating general settings:', error);
        showNotification('Failed to update general settings', 'error');
    }
}

async function handleNotificationSettingsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
        email: {
            newOrder: formData.get('newOrder') === 'on',
            lowStock: formData.get('lowStock') === 'on',
            customerSupport: formData.get('customerSupport') === 'on'
        },
        sms: {
            newOrder: formData.get('smsNewOrder') === 'on',
            delivery: formData.get('smsDelivery') === 'on'
        }
    };

    try {
        await updateSettings('notifications', settings);
        showNotification('Notification settings updated successfully');
    } catch (error) {
        console.error('Error updating notification settings:', error);
        showNotification('Failed to update notification settings', 'error');
    }
}

async function handlePaymentSettingsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
        cod: formData.get('cod') === 'on',
        upi: formData.get('upi') === 'on',
        card: formData.get('card') === 'on',
        minOrderAmount: parseInt(formData.get('minOrderAmount')),
        deliveryCharges: parseInt(formData.get('deliveryCharges'))
    };

    try {
        await updateSettings('payment', settings);
        showNotification('Payment settings updated successfully');
    } catch (error) {
        console.error('Error updating payment settings:', error);
        showNotification('Failed to update payment settings', 'error');
    }
}

async function handleSecuritySettingsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword && newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    const settings = {
        twoFactorAuth: formData.get('2fa') === 'on'
    };

    if (newPassword) {
        settings.currentPassword = currentPassword;
        settings.newPassword = newPassword;
    }

    try {
        await updateSettings('security', settings);
        showNotification('Security settings updated successfully');
        e.target.reset();
    } catch (error) {
        console.error('Error updating security settings:', error);
        showNotification('Failed to update security settings', 'error');
    }
}

async function updateSettings(section, settings) {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`/api/admin/settings/${section}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });

    if (!response.ok) {
        throw new Error('Failed to update settings');
    }

    return response.json();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 