const http = require('http');

const server = http.createServer((req, res) => {
    // Function to set the response content and end the response
    const sendResponse = (statusCode, contentType, content) => {
        res.writeHead(statusCode, { 'Content-Type': contentType });
        res.end(content);
    };

    // Function to handle the home page
    const handleHome = () => {
        const content = '<html><body><p>This is home Page.</p></body></html>';
        sendResponse(200, 'text/html', content);
    };
    // Route handling
    if (req.url === '/') {
        handleHome();
    }
    else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
