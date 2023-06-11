import { handleHome } from './home.js';
import * as http from 'http';
import * as url from 'url';
import { handleStudent } from './student.js';
import { handleAdmin } from './admin.js';
import { handleUsers } from './users.js';
import { handleCalc } from './calculator.js';
import { sendResponse } from './utils.js';



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
        else if (requestUrl.pathname === '/users' && req.method === 'GET') {
            // Here, you can add the code for the '/users' route
            const express = require("express");
            const path = require("path");
            const app = express();

            var PORT = process.env.PORT || 5000;

            // View Engine Setup
            app.set("views", path.join(__dirname));
            app.set("view engine", "ejs");

            // GET user by ID
            app.get("/users/:id", function (req, res) {
                var user_id = req.params.id;
                var user = users.find((user) => user.id === parseInt(user_id));

                if (user) {
                    res.json(user);
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            });

            // POST create new user
            app.post("/users", function (req, res) {
                var newUser = req.body;
                newUser.id = users.length + 1; // Generate new user ID
                users.push(newUser);
                res.status(201).json({ id: newUser.id });
            });

            // PUT update user
            app.put("/users/:id", function (req, res) {
                var user_id = req.params.id;
                var updatedUser = req.body;
                var userIndex = users.findIndex((user) => user.id === parseInt(user_id));

                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...updatedUser };
                    res.json(users[userIndex]);
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            });

            // DELETE user
            app.delete("/users/:id", function (req, res) {
                var user_id = req.params.id;
                var userIndex = users.findIndex((user) => user.id === parseInt(user_id));

                if (userIndex !== -1) {
                    var deletedUser = users.splice(userIndex, 1);
                    res.json(deletedUser[0]);
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            });

            handleUsers(res);

            app.listen(PORT, function (error) {
                if (error) throw error;
                console.log("Server created Successfully on PORT", PORT);
            });
        }
        else if (requestUrl.pathname === '/calc' && req.method === 'POST') {
            handleCalc(req, res);
        }
        else {
            sendResponse(res, 404, 'text/plain', 'Invalid Request!');
        }
    } catch (error) {
        sendResponse(res, 500, 'text/html', error.toString());
    }
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running..');
