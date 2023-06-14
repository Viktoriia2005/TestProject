import { sendResponse } from "./utils.js";
import fs from 'fs';
import express from 'express';
const app = express();
app.use(express.json());

export function handleCities(res) {
    fs.readFile('cities.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
            return;
        }

        try {
            const citiesArray = JSON.parse(data);

            sendResponse(res, 200, 'application/json', JSON.stringify(citiesArray));
        } catch (error) {
            console.error('Error parsing JSON:', error);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
        }
    });
}