import { initState } from './gameState.js';
import { initGameObject } from './gameObjects.js';
import { start } from './gameEngine.js';
import { auth } from './firebase.js';

let state = initState();
let game = initGameObject();

const availableKeys = [
    'ArrowLeft',
    'ArrowRight',
    'Space'
];

document.addEventListener('keydown', (e) => {
    if (availableKeys.includes(e.code)) {
        state.keys[e.code] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (availableKeys.includes(e.code)) {
        state.keys[e.code] = false;
    }
});

if (localStorage.getItem('userUID')) {
    game.welcomeScreen.classList.add('hidden');
    game.startScreen.classList.remove('hidden');
}

game.loginNavigate.addEventListener('click', () => {
    game.welcomeScreen.classList.add('hidden');
    game.loginScreen.classList.remove('hidden');
});
game.registerNavigate.addEventListener('click', () => {
    game.welcomeScreen.classList.add('hidden');
    game.registerScreen.classList.remove('hidden');
});

//Toggle login/register
document.querySelector('.login-redirect').addEventListener('click', (e) => {
    e.preventDefault();
    game.loginScreen.classList.add('hidden');
    game.registerScreen.classList.remove('hidden');
});
document.querySelector('.register-redirect').addEventListener('click', (e) => {
    e.preventDefault();
    game.registerScreen.classList.add('hidden');
    game.loginScreen.classList.remove('hidden');
});

game.startButton.addEventListener('click', () => {
    const user = auth.currentUser;
    state.player = user?.displayName || 'Guest';

    game.startScreen.classList.add('hidden');
    game.gameScreen.classList.remove('hidden');

    // Start game
    start(state, game);
});
