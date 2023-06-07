import { sendResponse } from "./utils.js";


    export function handleUsers (res) {
        fs.readFile('SiteData.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                sendResponse(res, 500, 'text/plain', 'Internal Server Error');
                return;
            }

            sendResponse(res, 200, 'application/json', data);
        });
    }