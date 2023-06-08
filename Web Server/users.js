import { sendResponse } from "./utils.js";
import fs from 'fs';

export function handleUsers(res) {
    fs.readFile('SiteData.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            sendResponse(res, 200, 'application/json', JSON.stringify(usersArray));
        } catch (error) {
            console.error('Error parsing JSON:', error);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
        }
    });
}
