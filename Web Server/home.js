function sendResponse(res, statusCode, contentType, content) {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(content);
};

export function handleHome(res) {
    const content = '<html><body><p>This is home Page.</p></body></html>';
    sendResponse(res, 200, 'text/html', content);
}
