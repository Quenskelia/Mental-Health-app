document.addEventListener("DOMContentLoaded",()=>{
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            var user = data.users[0];
            if(!user) {
                window.location.href = 'index.html';
                return;
            }
            if (!user.moodHistory || user.moodHistory.length === 0){
                window.location.href = 'index.html';
                return;
            }
            var moodHistory = user.moodHistory;
            document.getElementById('greeting').textContent = 'Hello ' + user.name + '! I hope your day is going well.';
            buildWeeklyOverview(moodHistory);
            var todaysMood = moodHistory[moodHistory.length -1].mood;
            getSuggestion(todaysMood);
            console.log('Todays mood:', todaysMood);
        });
    });
    
    function buildWeeklyOverview(moodHistory){
        var today = new Date();
        for (var i = 6; i >= 0; i--){
            var day = new Date(today);
            day.setDate(today.getDate() - i);
            var dateString = day.toISOString().split('T')[0];
            var dayName = day.toLocaleDateString('en-US', { weekday : 'short'});
            var entry = moodHistory.find(function(e){
                return e.date === dateString;
                
            });
             var moodText = entry ? entry.mood : 'No entry';
             var card = document.createElement('div');
             card.classList.add('day-card');

             if (!entry){
                    card.classList.add('empty-card');
                }

             card.innerHTML = '<p>' + dayName + '</p><p>' + moodText + '</p>';
             document.getElementById('week-grid').appendChild(card);
        }
    }
    function getSuggestion(mood){
        if (mood === 'happy'){
            fetch('/api/activity')
            .then(response => response.json())
            .then(data =>{
                var activity = data.activity;
                var type = data.type;
                document.getElementById('suggestion-content').innerHTML = '<p>' + activity + '</p><p>Type: ' + type + '</p>';
            })

        }else if (mood === 'okay'){
            fetch('/api/quote')
            .then(response => response.json())
            .then(data =>{
                var quote = data[0].q;
                var author = data[0].a;
                document.getElementById('suggestion-content').innerHTML = '<p>"' + quote + '"</p><p>-' + author + '</p>'
        })

        }else if (mood === 'low'){
            fetch('/api/video')
            .then(response => response.json())
            .then(data => {
                var videoId = data.items[0].id.videoId;
                var title = data.items[0].snippet.title;
                var thumbnail = data.items[0].snippet.thumbnails.medium.url;
                document.getElementById('suggestion-content').innerHTML = 
                '<p>Here\'s something to cheer you up!</p>' +
                '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank">' +
                '<img src="' + thumbnail + '" alt="' + title + '">' +
                '<p>' + title + '</p>' +
                '</a>';
                
            
            })

        }else if (mood === 'stressed'){
              fetch('/api/quote')
            .then(response => response.json())
            .then(data => {
                var quote = data[0].q;
                var author = data[0].a;
                document.getElementById('suggestion-content').innerHTML = '<p>"' + quote + '"</p><p>-' + author + '</p>';
        });

        }
    }