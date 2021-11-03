const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.post('/users', (request, response) => {
    const { name, username } = request.body;

    const userAlreadyExists = users.find(user => user.username == username);

    if (userAlreadyExists) {
        return response.status(400).json({
            error: "Username already exists."
        });
    }

    const user = {
        id: uuid(),
        name,
        username
    };

    users.push(user);

    return response.status(201).json({
        success: true
    });
});

app.post('/todos', (request, response) => {

});

app.get('/todos', (request, response) => {

});

app.put('/todos/:id', (request, response) => {

});

app.listen(3000);

