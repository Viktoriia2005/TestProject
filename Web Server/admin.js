const http = require('http');

const server = http.createServer((req, res) => {
    // Function to set the response content and end the response
    const sendResponse = (statusCode, contentType, content) => {
        res.writeHead(statusCode, { 'Content-Type': contentType });
        res.end(content);
    };

    const handleAdmin = () => {
        const content = '<html><body><p>This is admin Page.</p></body></html>';
        sendResponse(200, 'text/html', content);
    };

    if (req.url === '/admin') {
        handleAdmin();
    }
    else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});
    server.listen(5000);
    console.log('Node.js web server at port 5000 is running..');
