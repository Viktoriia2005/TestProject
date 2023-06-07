import { handleHome } from './home.js';
import * as http from 'http';
import { handleStudent } from './student.js';
import { handleAdmin } from './admin.js';
import { handleUsers } from './users.js';
import { handleCalc } from './calculator.js';
import { sendResponse } from './utils.js';

const server = http.createServer((req, res) => {

    // Route handling
    if (req.url === '/') {
        handleHome(res);
    }
    else if (req.url === '/student') {
        handleStudent(res);
    }
    else if (req.url === '/admin') {
        handleAdmin(res);
    }
    else if (req.url === '/users') {
        handleUsers(res);
    }
    else if (req.url === '/calc' && req.method === 'POST') {
        handleCalc(req, res);
    }
    else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
