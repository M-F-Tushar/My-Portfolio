require('dotenv').config();
console.log('Checking Environment Variables...');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    console.log('DATABASE_URL is set.');
    // Mask the actual secret but show the protocol
    const protocol = dbUrl.split(':')[0];
    console.log('Protocol:', protocol);
    if (protocol === 'file') console.log('FAIL: Still detecting SQLite (file:)');
    if (protocol === 'postgresql') console.log('PASS: Detected PostgreSQL (postgresql:)');
} else {
    console.log('ERROR: DATABASE_URL is NOT set.');
}
