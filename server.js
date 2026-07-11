require('dotenv').config();
var fs = require('fs');
var path = require('path');
var usersFilePath = path.join(__dirname, 'data', 'users.json');
var express = require('express');
var app = express();
var port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/api/users', function(req, res) {
    try {
        var data = fs.readFileSync(usersFilePath, 'utf8');
        var parsed = JSON.parse(data);
        res.json(parsed);
    } catch(error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Failed to read users' });
    }
});
app.post('/api/users', function(req, res) {
    try {
        var data = fs.readFileSync(usersFilePath, 'utf8');
        var parsed = JSON.parse(data);
        
        var moodEntry ={
            mood: req.body.mood,
            date: new Date().toISOString().split('T')[0]
        };

        if (req.body.name){
            var newUser = {
                name: req.body.name,
                moodHistory: [moodEntry]
            };
            parsed.users.push(newUser);
        } else {
            var user = parsed.users[parsed.users.length - 1];
            user.moodHistory.push(moodEntry);
        }
        fs.writeFileSync(usersFilePath, JSON.stringify(parsed, null, 2));
        res.json({success: true});
    } catch(error){
        console.error('Error saving users:', error);
        res.status(500).json({ error: 'Failed to save user' });
    }
});
function initializeStorage() {
    try {
    if(!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2));
        console.log('user.json recreated');
        return;
    }
    var data = fs.readFileSync(usersFilePath, 'utf8');
    var parsed = JSON.parse(data);
    if (!parsed.users) {
        fs.writeFileSync(usersFilePath, JSON.stringify( { users: [] }, null, 2));
        console.log('user.json repaired');
    }
} catch (error) {
    fs.writeFileSync(usersFilePath, JSON.stringify({ users: []}, null, 2));
    console.log('users.json was corrupted and has been recreated.');
    }
}
initializeStorage();
app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`);
});
