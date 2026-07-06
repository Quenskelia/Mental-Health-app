require('dotenv').config();
var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/users', function(req, res) {
    fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`, {
        method: 'GET',
        headers:{
            'X-Access-Key': process.env.JSONBIN_KEY,
            'X-Bin-Private': 'true'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        res.json(data);
    })
    .catch(function(error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    });
});
app.post('/api/users', function(req, res) {
    var newUser = req.body;

    fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`, {
        method: 'GET',
        headers: {
            'X-Access-Key': process.env.JSONBIN_KEY,
            'X-Bin-Private': 'true'
        }

    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        var users=data.record.users;
        return fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'X-Access-Key': process.env.JSONBIN_KEY,
                'X-Bin-Private': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: [...users, newUser] })
        });
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
       res.json(data);
    })
    
    
    .catch(function(error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    
    }); 
});

app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`);
});
