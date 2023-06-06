import { sendResponse } from "./utils";

export function handleCalc (param1, param2) {
    const result = param1 + param2;
    const response = JSON.stringify({ result });

    sendResponse(200, 'application/json', response);
};

if (req.url === '/calc' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        const requestBody = JSON.parse(body);
        const param1 = parseInt(req.url.split('=')[1]);
        const param2 = requestBody.param2;

        handleCalc(param1, param2);
    });
}
else {
    sendResponse(404, 'text/plain', 'Invalid Request!');
}