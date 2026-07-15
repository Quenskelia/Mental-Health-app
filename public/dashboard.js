document.addEventListener("DOMContentLoaded",()=>{
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            var user = data.users[0];
            var moodHistory = user.moodHistory;
            document.getElementById('greeting').textContent = 'Hello ' + user.name + '! I hope your day is going well.';
            buildWeeklyOverview(moodHistory);
            var todaysMood = moodHistory[moodHistory.length -1].mood;
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
    