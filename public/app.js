document.addEventListener("DOMContentLoaded",()=>{
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            var userArray = data.record.record.users;
            if (userArray.length > 0){
                console.log("Users fetched successfully:", data);
            } else {
                console.log("No users found.");
            }
           
        });
    console.log("DOM fully loaded and ready!");
   
})

