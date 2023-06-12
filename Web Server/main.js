import { handleHome } from './home.js';
import * as http from 'http';
import * as url from 'url';
import { handleStudent } from './student.js';
import { handleAdmin } from './admin.js';
import { handleUsers } from './users.js';
import { handleCalc } from './calculator.js';
import { sendResponse } from './utils.js';
import express from 'express';

const app = express();

var PORT = process.env.PORT || 5000;

app.get("/users", function (req, res) {
    handleUsers(res);
});

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

app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});

