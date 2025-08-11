const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Environment Variable Loading...\n');

// Test 1: Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('1. .env file path:', envPath);
console.log('   Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    // Test 2: Read .env file content
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('\n2. .env file content:');
    console.log(envContent);
    
    // Test 3: Parse environment variables
    console.log('\n3. Parsed environment variables:');
    const envLines = envContent.split('\n');
    envLines.forEach((line, index) => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                console.log(`   ${key.trim()}: "${value}"`);
            }
        }
    });
    
    // Test 4: Try to set process.env
    console.log('\n4. Setting process.env manually:');
    envLines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                process.env[key.trim()] = value;
                console.log(`   Set ${key.trim()} = "${value}"`);
            }
        }
    });
    
    // Test 5: Verify process.env
    console.log('\n5. Verifying process.env:');
    console.log('   PORT:', process.env.PORT);
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    console.log('   TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('   TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
    console.log('   TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);
} else {
    console.log('❌ .env file not found!');
}
