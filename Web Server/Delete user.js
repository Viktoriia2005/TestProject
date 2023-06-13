import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());

export function handleDeleteUser(req, res) {
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
}