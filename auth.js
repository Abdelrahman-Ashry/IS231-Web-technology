

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form[action="#"]'); 
    const signupForm = document.querySelector('form[action="login.html"]'); 

  
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-psw').value;
            const confirmPassword = document.getElementById('confirm-psw').value;
            const isAdmin = document.querySelector('input[name="is_admin"]:checked').value;

           
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            
            if (!email.includes("@")) {
                alert("Please enter a valid email address.");
                return;
            }

        
            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                role: isAdmin 
            };

            localStorage.setItem(email, JSON.stringify(userData));
            alert("Registration Successful! Please log in.");
            window.location.href = "login.html";
        });
    }

   
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            
            const storedUser = localStorage.getItem(email);

            if (storedUser) {
                const userObj = JSON.parse(storedUser);

            
                if (userObj.password === password) {
                    alert(`Welcome back, ${userObj.fullName}!`);
                    
                   
                    if (userObj.role === 'admin') {
                        window.location.href = "admin_dashboard.html"; 
                    } else {
                        window.location.href = "user_home.html"; 
                    }
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("User not found. Please sign up first.");
            }
        });
    }
});


function clearForm() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type !== 'radio') input.value = '';
    });
}