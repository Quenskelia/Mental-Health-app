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

var quotes = [
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "In the middle of every difficulty lies opportunity.", a: "Albert Einstein" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "You are never too old to set another goal or dream a new dream.", a: "C.S. Lewis" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" }
];

app.get('/api/quote', function(req, res) {
    var random = quotes[Math.floor(Math.random() * quotes.length)];
    res.json([random]);

});

app.get('/api/activity', function(req, res) {
    fetch('https://bored-api.appbrewery.com/random')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.error('Error fetching activity:', error);
            res.status(500).json({ error: 'Failed to fetch activity' });
        });
});

app.get('/api/video', function(req, res) {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=funny+videos&videoCategoryId=23&type=video&key=${process.env.YOUTUBE_API_KEY}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            res.json(data);
        })
        .catch(function(error) {
            console.error('Error fetching video:', error);
            res.status(500).json({ error: 'Failed to fetch video' });
        });
});

initializeStorage();
app.listen(port, function() {
    console.log(`Server is running on http://localhost:${port}`);
});
