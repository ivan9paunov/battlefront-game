import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from './firebase.js';
import { initGameObject } from './gameObjects.js';

const game = initGameObject();

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const repass = e.target.repass.value;

    if (!username || !email || !password || !repass) {
        return;
    }

    if (password.trim() != repass.trim()) {
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        
        localStorage.setItem('userUID', user.uid);

        game.registerScreen.classList.add('hidden');
        game.startScreen.classList.remove('hidden');
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem('userUID', user.uid);

        game.loginScreen.classList.add('hidden');
        game.startScreen.classList.remove('hidden');
    } catch(err) {
        alert('Error: ' + err.message);
    }
});

document.querySelector('.logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userUID');
        window.location.reload();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});