import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());

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
            const jsonData = JSON.parse(data);
            const usersArray = jsonData.users;

            var newUser = req.body;

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

        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}