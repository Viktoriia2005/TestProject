import { handleHome } from './home.js';
import * as http from 'http';
import * as url from 'url';
import { handleStudent } from './student.js';
import { handleAdmin } from './admin.js';
import { handleUsers } from './users.js';
import { handleCalc } from './calculator.js';
import { sendResponse } from './utils.js';

const express = require('express');
const app = express();
const PORT = 3000;

const server = http.createServer((req, res) => {
    try {
        const requestUrl = url.parse(req.url, true);

        // Route handling
        if (requestUrl.pathname === '/' && req.method === 'GET') {
            handleHome(res);
        }
        else if (requestUrl.pathname === '/student' && req.method === 'GET') {
            handleStudent(res);
        }
        else if (requestUrl.pathname === '/admin' && req.method === 'GET') {
            handleAdmin(res);
        }
        else if (requestUrl.pathname === '/users') {
            if (req.method === 'GET') {
                var user_id = requestUrl.query.id;
                handleGetUser(user_id, res);
            }
            else if (req.method === 'POST') {
                handleCreateUser(req, res);
            }
            else if (req.method === 'PUT') {
                var user_id = requestUrl.query.id;
                handleUpdateUser(user_id, req, res);
            }
            else if (req.method === 'DELETE') {
                var user_id = requestUrl.query.id;
                handleDeleteUser(user_id, res);
            }
            else {
                sendResponse(res, 400, 'text/plain', 'Invalid Method!');
            }
        }
        else if (requestUrl.pathname === '/calc' && req.method === 'POST') {
            handleCalc(req, res);
        }
        else {
            sendResponse(res, 404, 'text/plain', 'Invalid Request!');
        }
    } catch (error) {
        sendResponse(res, 500, 'text/html', error);
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
