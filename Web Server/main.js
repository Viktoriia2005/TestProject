import { handleUsers } from './users.js';
import { handleUserById } from './User by id.js';
import { handleNewUser } from './New user.js';
import { handleEditUser } from './Edit user.js';
import { handleDeleteUser } from './Delete user.js';
import express from 'express';

const app = express();
app.use(express.json());

var PORT = process.env.PORT || 5000;

app.get("/users", function (req, res) {
    handleUsers(res);
});

// GET user by ID
app.get("/users/:id", function (req, res) {
    handleUserById(req, res);
});

// POST create new user
app.post("/users", function (req, res) {
    handleNewUser(req, res);
});

// PUT update user
app.put("/users/:id", function (req, res) {
    handleEditUser(req, res);
});

// DELETE user
app.delete("/users/:id", function (req, res) {
    handleDeleteUser(req, res);
});

app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});

