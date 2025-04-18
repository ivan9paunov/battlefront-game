import { initGameObject } from './gameObjects.js';
import {
    auth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from './firebase.js';

const provider = new GoogleAuthProvider();
const game = initGameObject();

document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', signInWithGoogle);
});

document.querySelector('.register-form').addEventListener('submit', (e) => registerWithEmail(e));

document.querySelector('.login-form').addEventListener('submit', (e) => loginWithEmail(e));

document.querySelector('.logout-btn').addEventListener('click', logout);

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        localStorage.setItem('userUID', user.uid);
        
        game.loginScreen.classList.add('hidden');
        game.registerScreen.classList.add('hidden');
        game.startScreen.classList.remove('hidden');
    } catch (err) {
            console.error('Google sign-in error:', err);
    }
}

async function registerWithEmail(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const repass = e.target.repass.value;

    const emailRegExp = new RegExp(/^[A-Za-z0-9_]+(?:[A-Za-z0-9._-]*[A-Za-z0-9_])?@[A-Za-z]+\.[A-Za-z]{2,4}(\.[A-Za-z]{2,4})?$/);
    const usernameRegExp = new RegExp(/^[A-Za-z0-9_][A-Za-z0-9\._]{3,}$/);
    const passwordRegExp = new RegExp(/^\S{6,}$/);

    if (!email || !username || !password || !repass) {
        return;
    }

    // TODO - add error handling
    if (!emailRegExp.test(email)) {
        return;
    } 
    if (!usernameRegExp.test(username)) {
        return;
    }
    if (!passwordRegExp.test(password)) {
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
        document.querySelector('.register-form').reset();

        game.registerScreen.classList.add('hidden');
        game.startScreen.classList.remove('hidden');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function loginWithEmail(e) {
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
        document.querySelector('.login-form').reset();

        game.loginScreen.classList.add('hidden');
        game.startScreen.classList.remove('hidden');
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function logout() {
    try {
        await signOut(auth);
        localStorage.removeItem('userUID');
        window.location.reload();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}