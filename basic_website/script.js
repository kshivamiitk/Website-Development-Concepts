(function(){

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginSection = document.getElementById('login-page');
    const mainSection = document.getElementById('main-section');
    const loginButton = document.getElementById('login-button');

    let users = [];

    async function login(user , pass){

        const file = await fetch("users.txt");
        const text = await file.text();

        const lines = text.split('\n').filter(line => line.trim() !== '');

        users = lines.map(line =>{
            const [u, p] = line.split(':').map(s => s.trim());
            return {username : u , password : p};
        });

        const matchedUser = users.find(u => u.username === user && u.password === pass);

        if(matchedUser){

            loginSection.classList.add('hidden');
            mainSection.classList.remove('hidden');

            const html = `<p> welcome ${user} to the basic website </p>`;
            mainSection.innerHTML = html;

        }else{

            const errorLogin = document.getElementById('error-login');
            errorLogin.innerHTML = '<p> wrong username or password </p>';
        }
    }

    loginButton.addEventListener('click', () => {
        login(usernameInput.value.trim(), passwordInput.value.trim());
    });

    window.onload = function () {
        loginSection.classList.remove('hidden');
        mainSection.classList.add('hidden');
    };

})();