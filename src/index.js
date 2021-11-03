const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checkExistsUsername(request, response, next) {
    const { username } = request.headers;

    const userAlreadyExists = users.find(user => user.username == username);

    if (!userAlreadyExists) {
        return response.status(404).json({
            error: "Username not exists."
        });
    }

    request.user = userAlreadyExists;

    return next();
}

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
        username,
        todos: []
    };

    users.push(user);

    return response.status(201).json({
        success: true
    });
});

app.post('/todos', checkExistsUsername, (request, response) => {
    const { user } = request;
    const { title, deadline } = request.body;

    const todo = {
        id: uuid(),
        done: false,
        title,
        deadline: new Date(deadline),
        creadted_at: new Date()
    }

    user.todos.push(todo);

    return response.status(201).json({
        success: true,
        data: user.todos
    });
});

app.get('/todos', checkExistsUsername, (request, response) => {
    const { user } = request;

    return response.status(200).json(user.todos);
});

app.put('/todos/:id', checkExistsUsername, (request, response) => {
    const { title, deadline } = request.body;
    const { id } = request.params;
    const { user } = request;

    const indexTodos = user.todos.findIndex(todo => todo.id == id);

    if (indexTodos < 0) {
        return response.status(404).json({
            error: "Task does not exist."
        });
    }

    user.todos[indexTodos] = {
        id: user.todos[indexTodos].id,
        title,
        deadline: new Date(deadline),
        created: user.todos[indexTodos].created_at
    }

    return response.status(200).json({
        success: true,
        data: user.todos
    });
});

app.patch('/todos/:id/done', checkExistsUsername, (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const indexTodos = user.todos.findIndex(todo => todo.id == id);

    if (indexTodos < 0) {
        return response.status(404).json({
            error: "Task does not exist."
        });
    }

    if (user.todos[indexTodos].done) {
        return response.status(403).json({
            error: "Task already finished."
        });
    }

    user.todos[indexTodos].done = true;

    return response.status(200).json({
        success: true,
        data: user.todos
    });
});

app.delete('/todos/:id', checkExistsUsername, (request, response) => {
    const { user } = request;
    const { id } = request.params;

    const todo = user.todos.find(todo => todo.id == id);

    if (!todo) {
        return response.status(404).json({
            error: "Task does not exist."
        });
    }

    user.todos.splice(todo, 1);

    return response.status(200).json({
        success: true,
        data: user.todos
    });
});

app.listen(3000);

