import { handleHome } from './home.js';
import * as http from 'http';
import * as url from 'url';
import { handleStudent } from './student.js';
import { handleAdmin } from './admin.js';
import { handleUsers } from './users.js';
import { handleCalc } from './calculator.js';
import { sendResponse } from './utils.js';
import express from 'express';
import fs from 'fs';

const app = express();

var PORT = process.env.PORT || 5000;

app.get("/users", function (req, res) {
    handleUsers(res);
});

// GET user by ID
app.get("/users/:id", function (req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            var user_id = req.params.id;
            var user = usersArray.find((user) => user.id === parseInt(user_id));

            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

function getMaxId(usersArray) {
    let maxId = 0;
    for (const user of usersArray) {
        if (user.id > maxId) {
            maxId = user.id;
        }
    }
    return maxId;
}

// POST create new user
app.post("/users", function (req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            var newUser = req.body;
            var userIndex = usersArray.findIndex(user => user.id === newUser.id);

            if (userIndex !== -1) {
                // Update existing user
                usersArray[userIndex] = { ...usersArray[userIndex], ...newUser };
                res.json(usersArray[userIndex]);
            } else {
                newUser.id = getMaxId(usersArray) + 1; // We get a new identifier

                // Add a new user to the array
                usersArray.push(newUser);

                // Update the users.json file with new data
                fs.writeFile('users.json', JSON.stringify({ users: usersArray }), 'utf8', function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }

                    res.status(201).json({ id: newUser.id });
                });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// PUT update user
app.put("/users/:id", function (req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            var user_id = req.params.id;
            var updatedUser = req.body;

            var userIndex = usersArray.findIndex((user) => user.id === parseInt(user_id));

            if (userIndex !== -1) {
                // Updating the user
                usersArray[userIndex] = { ...usersArray[userIndex], ...updatedUser };

                // Write the updated array of users to the user.json file
                fs.writeFile('users.json', JSON.stringify({ users: usersArray }), 'utf8', function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }

                    res.json(usersArray[userIndex]);
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// DELETE user
app.delete("/users/:id", function (req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            var user_id = req.params.id;

            var userIndex = usersArray.findIndex((user) => user.id === parseInt(user_id));

            if (userIndex !== -1) {
                var deletedUser = usersArray.splice(userIndex, 1);

                // Write the updated array of users to the user.json file
                fs.writeFile('users.json', JSON.stringify({ users: usersArray }), 'utf8', function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }

                    res.json(deletedUser[0]);
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});

