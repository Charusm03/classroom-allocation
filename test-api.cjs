const fetch = require('node-fetch'); // You might need to install this or use built-in fetch if node version > 18
// Since I can't easily install node-fetch right now without polluting package.json, I'll use a simple http request or assume node 18+ has fetch.
// Actually, I'll just use the browser subagent to run a console script or use curl if available.
// Let's try to write a simple node script using http module to be safe.

const http = require('http');

const data = JSON.stringify({ test: "data" });

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/storage/testkey',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, classRes => {
    console.log(`statusCode: ${classRes.statusCode}`);
    classRes.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
