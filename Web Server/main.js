import { handleHome } from './home.js';
import * as http from 'http';
import * as fs from 'fs';

import { handleStudent } from './student.js';
import * as http from 'http';
import * as fs from 'fs';

import { handleAdmin } from './admin.js';
import * as http from 'http';
import * as fs from 'fs';

import { handleUsers } from './users.js';
import * as http from 'http';
import * as fs from 'fs';

import { handleCalc } from './calculator.js';
import * as http from 'http';
import * as fs from 'fs';

const server = http.createServer((req, res) => {
    // Function to set the response content and end the response

    // Function to handle the home page


    // Function to handle the student page
    // const handleStudent = () => {
    //     const content = '<html><body><p>This is student Page.</p></body></html>';
    //     sendResponse(200, 'text/html', content);
    // };

    // // Function to handle the admin page
    // const handleAdmin = () => {
    //     const content = '<html><body><p>This is admin Page.</p></body></html>';
    //     sendResponse(200, 'text/html', content);
    // };

    // // Function to handle the users page
    // const handleUsers = () => {
    //     fs.readFile('SiteData.json', 'utf8', (err, data) => {
    //         if (err) {
    //             console.error('Помилка при читанні файлу:', err);
    //             sendResponse(500, 'text/plain', 'Internal Server Error');
    //             return;
    //         }

    //         sendResponse(200, 'application/json', data);
    //     });
    // };

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
    else if (req.url === '/calc') {
        handleCalc(param1, param2);
    }
    else {
        sendResponse(404, 'text/plain', 'Invalid Request!');
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
