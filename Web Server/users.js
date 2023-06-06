const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Function to set the response content and end the response
    const sendResponse = (statusCode, contentType, content) => {
        res.writeHead(statusCode, { 'Content-Type': contentType });
        res.end(content);
    };

    const handleUsers = () => {
        fs.readFile('SiteData.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                sendResponse(500, 'text/plain', 'Internal Server Error');
                return;
            }

            sendResponse(200, 'application/json', data);
        });
    };

    if (req.url === '/users') {
        handleUsers();
    }
    else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});
    server.listen(5000);
    console.log('Node.js web server at port 5000 is running..');
