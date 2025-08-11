const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for BMW E-commerce Server...\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Backing up...');
    const backupPath = path.join(__dirname, '.env.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('✅ Backup created as .env.backup');
}

// Create .env file content
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-for-bmw-ecommerce-2024

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bmw-ecommerce

# Twilio Configuration
# Get these from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Email Configuration (Gmail)
# Use App Password, not your regular password
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=10mb
`;

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file created successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit the .env file and add your actual Twilio credentials');
console.log('2. Get Twilio credentials from: https://console.twilio.com/');
console.log('3. For Gmail, use App Password (not regular password)');
console.log('4. Run: npm start');
console.log('\n🔑 Required Twilio credentials:');
console.log('   - TWILIO_ACCOUNT_SID: Your Twilio Account SID');
console.log('   - TWILIO_AUTH_TOKEN: Your Twilio Auth Token');
console.log('   - TWILIO_PHONE_NUMBER: Your Twilio phone number');
console.log('\n📱 For testing without Twilio:');
console.log('   - Leave Twilio credentials empty');
console.log('   - OTP will be shown in console for development');
console.log('\n🚀 To start the server:');
console.log('   cd server');
console.log('   npm start');
