import { sendResponse } from "./utils.js";
import fs from 'fs';
import express from 'express';
const app = express();
app.use(express.json());

export function handleUsers(res) {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
            return;
        }

        try {
            const usersArray = JSON.parse(data);

            sendResponse(res, 200, 'application/json', JSON.stringify(usersArray));
        } catch (error) {
            console.error('Error parsing JSON:', error);
            sendResponse(res, 500, 'text/plain', 'Internal Server Error');
        }
    });
}

export function handleUserById(req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const usersArray = JSON.parse(data) || []; // Призначаємо масив користувачів без перевірки наявності властивості "users"

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
}

function getMaxId(usersArray) {
    let maxId = 0;
    for (const user of usersArray) {
        if (user.id > maxId) {
            maxId = user.id;
        }
    }
    return maxId;
}

export function handleNewUser(req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const usersArray = JSON.parse(data) || [];

            var newUser = req.body;

            newUser.id = getMaxId(usersArray) + 1;

            usersArray.push(newUser);

            fs.writeFile('users.json', JSON.stringify(usersArray, null, 2), 'utf8', function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.status(201).json({ id: newUser.id });
            });

        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}

export function handleEditUser(req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const usersArray = JSON.parse(data) || [];

            var user_id = req.params.id;
            var updatedUser = req.body;

            var userIndex = usersArray.findIndex((user) => user.id === parseInt(user_id));

            if (userIndex !== -1) {
                // Updating the user
                usersArray[userIndex] = { ...usersArray[userIndex], ...updatedUser };

                // Write the updated array of users to the user.json file
                fs.writeFile('users.json', JSON.stringify(usersArray, null, 2), 'utf8', function (err) {
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
}

export function handleDeleteUser(req, res) {
    fs.readFile('users.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const usersArray = JSON.parse(data) || [];

            var user_id = req.params.id;

            var userIndex = usersArray.findIndex((user) => user.id === parseInt(user_id));

            if (userIndex !== -1) {
                var deletedUser = usersArray.splice(userIndex, 1);

                // Записуємо оновлений масив користувачів у файл users.json
                fs.writeFile('users.json', JSON.stringify(usersArray, null, 2), 'utf8', function (err) {
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
}