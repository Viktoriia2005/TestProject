import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());

export function handleUserById(req, res) {
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
}