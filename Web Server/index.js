const http = require('http');
const fs = require('fs');

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

    // Function to handle the student page
    const handleStudent = () => {
        const content = '<html><body><p>This is student Page.</p></body></html>';
        sendResponse(200, 'text/html', content);
    };

    // Function to handle the admin page
    const handleAdmin = () => {
        const content = '<html><body><p>This is admin Page.</p></body></html>';
        sendResponse(200, 'text/html', content);
    };

    // Function to handle the users page
    const handleUsers = () => {
        fs.readFile('SiteData.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Помилка при читанні файлу:', err);
                sendResponse(500, 'text/plain', 'Internal Server Error');
                return;
            }

            sendResponse(200, 'application/json', data);
        });
    };

    // Route handling
    if (req.url === '/') {
        handleHome();
    } else if (req.url === '/student') {
        handleStudent();
    } else if (req.url === '/admin') {
        handleAdmin();
    } else if (req.url === '/users') {
        handleUsers();
    } else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
