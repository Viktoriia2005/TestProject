import { sendResponse } from "./utils.js";


export function handleCalc(req, res) {
    const param1 = parseInt(req.url.split('=')[1]);
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    }).on('end', () => {
        const data = JSON.parse(body);
        const param2 = data.param2;
        const result = param1 + param2;
        const response = JSON.stringify({ result });

        sendResponse(res, 200, 'application/json', response);

    });

};
