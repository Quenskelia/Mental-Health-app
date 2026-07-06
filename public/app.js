document.addEventListener("DOMContentLoaded",()=>{
    fetch('/api/users')
        .then(response => response.json())
        fetch('/api/users')
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Frontend received:', data);
        var userArray = data.record.users;
            if (userArray.length > 0){
                document.getElementById('main-title').textContent ="Welcome Back Friend!";
                document.getElementById('naming').style.display='none';
            } else {
                console.log("No users found.");
            }
           
        })
    })


document.getElementById('submit-name').addEventListener('click', () => {
    var nameInput = document.getElementById('name').value;
    if (nameInput.trim() === ''){
        alert("Please enter your name!");
        return;
    }

    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nameInput })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created!', data);
        window.location.href = 'app.html';
    });
});