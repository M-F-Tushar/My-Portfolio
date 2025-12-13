require('dotenv').config({ path: 'frontend/.env' });

function checkUrl(varName) {
    const url = process.env[varName];
    if (!url) {
        console.log(`${varName} is missing`);
        return;
    }

    try {
        // Try to parse as URL
        // format: postgres://user:pass@host:port/db
        const parsed = new URL(url);
        console.log(`${varName} Host: ${parsed.hostname}`);
        console.log(`${varName} Port: ${parsed.port}`);

        const password = parsed.password;
        const specialChars = /[:@/?#&=]/;
        if (specialChars.test(password)) {
            console.log("WARNING: Password contains special characters that might break URL parsing (:, @, /, ?, #, &, =).");
            console.log("It should be URL encoded.");
        } else {
            console.log("Password seems safe (alphanumeric or safe symbols).");
        }
    } catch (e) {
        console.log(`Could not parse ${varName} as a URL. It might be malformed.`);
        console.log(`Error: ${e.message}`);
    }
}

console.log("Checking DIRECT_URL...");
checkUrl('DIRECT_URL');
