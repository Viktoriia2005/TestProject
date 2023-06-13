const express = require("express");
const path = require("path");
const app = express();

var PORT = process.env.PORT || 3000;

// View Engine Setup
app.set("views", path.join(__dirname));
app.set("view engine", "ejs");

// Dummy data
const users = [
    {
        id: 1,
        name: "John Doe",
        birthday: "1990-01-01",
        city: 123,
        isAdmin: true,
    },
    {
        id: 2,
        name: "Jane Smith",
        birthday: "1995-05-05",
        city: 456,
        isAdmin: false,
    },
    {
        id: 3,
        name: "Daria Lyashuk",
        birthday: "2005-09-14",
        city: 326,
        isAdmin: false,
    },
];

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