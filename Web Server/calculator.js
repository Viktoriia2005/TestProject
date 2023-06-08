import { sendResponse } from "./utils.js";
import * as url from 'url';

export function handleCalc(req, res) {
    const requestUrl = url.parse(req.url, true);

    if (requestUrl.query.param1) {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        }).on('end', () => {
            const data = JSON.parse(body);
            const result = Number(requestUrl.query.param1) + data.param2;
            const response = JSON.stringify({ result });

            sendResponse(res, 200, 'application/json', response);

        });
    }
    else {
        sendResponse(res, 500, 'text/html', 'Parameter param1 is required');
    }
};
