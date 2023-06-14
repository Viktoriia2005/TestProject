import { handleUsers } from './users.js';
import { handleUserById } from './users.js';
import { handleNewUser } from './users.js';
import { handleEditUser } from './users.js';
import { handleDeleteUser } from './users.js';
import { handleCities } from './cities.js';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
// const cors=cors();

app.use(cors({
    origin: '*'
}));

var PORT = process.env.PORT || 5000;

app.get("/users", function (req, res) {
    handleUsers(res);
});

app.get("/cities", function (req, res) {
    handleCities(res);
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