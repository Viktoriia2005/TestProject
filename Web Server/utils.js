export function sendResponse(res, statusCode, contentType, content) {
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(content);
};