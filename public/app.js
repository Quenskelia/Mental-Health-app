var selectedMood = null;
var isReturningUser = false;
document.addEventListener("DOMContentLoaded",()=>{
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
        var userArray = data.users;
            if (userArray.length > 0){
                isReturningUser = true;
                document.getElementById('main-title').textContent ="Welcome Back Friend!";
                document.getElementById('naming').style.display='none';
            }
        });
    document.querySelectorAll('.mood-buttons').forEach(button => {
    button.addEventListener('click', () => {
        selectedMood = button.id;
        document.querySelectorAll('.mood-buttons').forEach(b => {
            b.classList.remove('active');
        });
        button.classList.add('active');
        if (isReturningUser){
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mood: selectedMood })
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = 'app.html';
            });
        }
    })
        });
});



document.getElementById('submit-name').addEventListener('click', () => {
    var nameInput = document.getElementById('name').value;
    if (nameInput.trim() === ''){
        alert("Please enter your name!");
        return;
    }
    if (selectedMood === null){
        alert("Please select your mood!");
        return;
    }

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nameInput, mood: selectedMood  })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created!', data);
        window.location.href = 'app.html';
    });
});