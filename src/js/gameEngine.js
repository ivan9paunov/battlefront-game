export async function start(state, game) {
    game.createHero(state.hero);
    game.personalRecord.textContent = await getUserScore();
    game.gameRecord.textContent = await getBestScore();

    window.requestAnimationFrame(gameLoop.bind(null, state, game));
};

function gameLoop(state, game, timestamp) {
    const { hero } = state;
    const { heroElement, gameScreen, endScreen } = game;
    const { lev1 } = state;

    game.playerName.textContent = `player: ${state.player}`;
    game.scoreboard.textContent = `score: ${state.score} pts.`;

    // Move hero
    modifyHeroPosition(state, game);

    // Spawn fireballs
    if (state.keys.Space && timestamp > state.fireball.nextSpawnTimestamp) {
        // Main hero shoots
        game.createFireball(state.hero, state.fireball);

        // Each comrade shoots
        state.comrades.forEach((comrade) => {
            game.createFireball(
                { ...state.hero, posX: parseFloat(comrade.style.left) }, // Fireball from comrade's position
                state.fireball
            );
        });

        state.fireball.nextSpawnTimestamp = timestamp + state.fireball.fireRate;
    }

    // Spawn items
    if (timestamp > state.extraItemStats.nextSpawnTimestamp &&
        state.extraItemStats.count < lev1.length) {

        const leftItemData = lev1[state.extraItemStats.count];
        const rightItemData = lev1[state.extraItemStats.count + 1];

        const { leftItemElement, rightItemElement } = game.createItemsRow(state.extraItemStats, leftItemData, rightItemData);

        leftItemElement.style.backgroundImage = `url('../images/${lev1[state.extraItemStats.count].type}.png')`;
        rightItemElement.style.backgroundImage = `url('../images/${lev1[state.extraItemStats.count + 1].type}.png')`;

        state.extraItemStats.count += 2;
        state.extraItemStats.nextSpawnTimestamp = timestamp + state.extraItemStats.spawnInterval;
    }

    // Spawn enemy after all items are spawned
    if (!state.enemy.spawned && state.extraItemStats.count >= lev1.length
        && timestamp > state.extraItemStats.nextSpawnTimestamp + 1000
    ) {
        state.enemy.spawned = true;
        game.createEnemy(state.enemy);
    }

    // Render enemy
    let enemyElements = document.querySelectorAll('.enemy');
    enemyElements.forEach(enemy => {
        let posY = parseInt(enemy.style.top);

        if (detectCollision(heroElement, enemy)) {
            state.gameOver = true;
        }

        if (posY < game.gameScreen.offsetHeight) {
            enemy.style.top = posY + state.extraItemStats.speed + 'px';
        } else {
            state.gameOver = true;
        }
    });

    // Render items
    let leftItemElements = document.querySelectorAll('.left-item');
    leftItemElements.forEach(item => {
        let posY = parseInt(item.style.top);
        const itemType = item.dataset.type;

        // Detect collision with hero
        if (itemType != 'comrade' && detectCollision(heroElement, item)) {
            state.gameOver = true;
        } else if (itemType == 'comrade' && detectCollision(heroElement, item)) {
            if (item.dataset.extraComrade > 0) {
                const comradeElement = game.createHero({
                    ...hero,
                    posX: hero.posX + (state.comrades.length % 2 == 0 ? 3 : -3) * (state.comrades.length + 1)
                }, true);

                comradeElement.style.left = hero.posX + (state.comrades.length % 2 == 0 ? 3 : -3) * (state.comrades.length + 1) + '%';

                state.comrades.push(comradeElement);
            } else {
                removeComrade(state, Math.abs(item.dataset.extraComrade));
            }

            item.remove();
        }

        if (posY < game.gameScreen.offsetHeight) {
            item.style.top = posY + state.extraItemStats.speed + 'px';
        } else {
            item.remove();
        }
    });
    let rightItemElements = document.querySelectorAll('.right-item');
    rightItemElements.forEach(item => {
        let posY = parseInt(item.style.top);
        const itemType = item.dataset.type;

        // Detect collision with hero
        if (itemType != 'comrade' && detectCollision(heroElement, item)) {
            state.gameOver = true;
        } else if (itemType == 'comrade' && detectCollision(heroElement, item)) {
            if (item.dataset.extraComrade > 0) {
                const comradeElement = game.createHero({
                    ...hero,
                    posX: hero.posX + (state.comrades.length % 2 == 0 ? 3 : -3) * (state.comrades.length + 1)
                }, true);

                comradeElement.style.left = hero.posX + (state.comrades.length % 2 == 0 ? 3 : -3) * (state.comrades.length + 1) + '%';

                state.comrades.push(comradeElement);
            } else {
                removeComrade(state, Math.abs(item.dataset.extraComrade));
            }

            item.remove();
        }

        if (posY < game.gameScreen.offsetHeight) {
            item.style.top = posY + state.extraItemStats.speed + 'px';
        } else {
            item.remove();
        }
    });

    // Render fireballs
    document.querySelectorAll('.fireball').forEach(fireball => {
        let posY = parseInt(fireball.style.bottom);

        // Detect collision with item
        leftItemElements.forEach(item => {
            if (detectCollision(item, fireball)) {
                const itemType = item.dataset.type;

                if (itemType != 'comrade') {
                    let currentStrength = item.dataset.strength;
                    currentStrength -= state.fireball.fireDamage;

                    if (currentStrength <= 0) {
                        state.fireball.fireRate -= Number(item.dataset.fireRate);
                        state.fireball.fireDamage += Number(item.dataset.fireDamage);
                        state.fireball.width += Number(item.dataset.addWidth);
                        state.fireball.height += Number(item.dataset.addHeight);

                        item.remove();
                        state.score += state.killScore;
                    } else {
                        item.dataset.strength = currentStrength;

                        const textElement = item.querySelector('.strength-text');
                        if (textElement) {
                            textElement.textContent = currentStrength;
                        }
                    }
                }

                fireball.remove();
            }
        });
        rightItemElements.forEach(item => {
            if (detectCollision(item, fireball)) {
                const itemType = item.dataset.type;

                if (itemType == 'barrel' || itemType == 'gate') {
                    let currentStrength = item.dataset.strength;
                    currentStrength -= state.fireball.fireDamage;

                    if (currentStrength <= 0) {
                        state.fireball.fireRate -= Number(item.dataset.fireRate);
                        state.fireball.fireDamage += Number(item.dataset.fireDamage);
                        state.fireball.width += Number(item.dataset.addWidth);
                        state.fireball.height += Number(item.dataset.addHeight);

                        item.remove();
                        state.score += state.killScore;
                    } else {
                        item.dataset.strength = currentStrength;

                        const textElement = item.querySelector('.strength-text');
                        if (textElement) {
                            textElement.textContent = currentStrength;
                        }
                    }
                }

                fireball.remove();
            }
        });
        enemyElements.forEach(enemy => {
            if (detectCollision(enemy, fireball)) {
                let currentStrength = enemy.dataset.strength;
                currentStrength -= state.fireball.fireDamage;

                if (currentStrength <= 0) {
                    state.win = true;

                    enemy.remove();
                    state.score += state.killScore;
                } else {
                    enemy.dataset.strength = currentStrength;

                    const textElement = enemy.querySelector('.enemy-text');
                    if (textElement) {
                        textElement.textContent = currentStrength;
                    }
                }

                fireball.remove();
            }
        });

        if (posY > game.gameScreen.offsetHeight) {
            fireball.remove();
        } else {
            fireball.style.bottom = posY + state.fireball.speed + 'px';
        }
    });

    // Render hero
    heroElement.style.left = hero.posX + '%';


    if (state.gameOver) {
        game.showRestartButton(state, game, restartGame);
    } else {
        if (state.win) {
            gameScreen.classList.add('hidden');
            endScreen.classList.remove('hidden');
            game.levelScore.textContent = `${state.score} pts.`;
            
            // game.nextLevelButton.replaceWith(game.nextLevelButton.cloneNode(true));
            game.nextLevelButton.addEventListener('click', async () => {
                await saveScore(state.player, state.score);
                window.location.reload();
            });
        } else {
            state.score += state.scoreRate;
            window.requestAnimationFrame(gameLoop.bind(null, state, game));
        }
    }

};

function modifyHeroPosition(state, game) {
    const { hero, comrades } = state;

    // Move hero
    if (state.keys.ArrowLeft) {
        hero.posX = Math.max(hero.posX - hero.speed, 3);
    }

    if (state.keys.ArrowRight) {
        let maxPosX = 100 - (hero.width / game.gameScreen.offsetWidth) * 100 + 15;
        hero.posX = Math.min(hero.posX + hero.speed, maxPosX);
    }

    // Move comrades alongside the hero
    comrades.forEach((comrade, index) => {
        const offset = (index % 2 === 0 ? 3 : -3) * (index + 1);

        comrade.style.left = hero.posX + offset + '%';
        comrade.style.bottom = hero.posY + 'px';
    });
};

function removeComrade(state, count = 1) {
    for (let i = 0; i < count; i++) {
        if (state.comrades.length > 0) {
            const comrade = state.comrades.pop();
            comrade.remove();
        } else {
            state.gameOver = true;
        }
    }
};

function detectCollision(elementA, elementB) {
    let fireball = elementA.getBoundingClientRect();
    let defendingItem = elementB.getBoundingClientRect();

    let hasCollision = !(fireball.top > defendingItem.bottom ||
        fireball.bottom < defendingItem.top ||
        fireball.right < defendingItem.left ||
        fireball.left > defendingItem.right);

    return hasCollision;
};

function restartGame(state, game) {
    state.gameOver = false;
    state.win = false;
    state.score = 0;
    state.enemy.spawned = false;
    state.comrades = [];
    state.fireball.width = 20;
    state.fireball.height = 20;
    state.fireball.nextSpawnTimestamp = 0;
    state.fireball.fireRate = 200;
    state.fireball.fireDamage = 1;
    state.extraItemStats.count = 0;
    state.extraItemStats.nextSpawnTimestamp = 0;

    game.gameScreen.innerHTML = '';

    const records = document.createElement('div');
    records.classList.add('records');

    const playerName = document.createElement('div');
    playerName.classList.add('username');
    playerName.textContent = `player: ${state.player}`;

    const scoreboard = document.createElement('div');
    scoreboard.classList.add('score');
    scoreboard.textContent = `score: ${state.score} pts.`;

    const personalRecord = document.createElement('div');
    personalRecord.classList.add('personal-record');
    personalRecord.textContent = `personal record: ${state.personalRecord} pts.`;

    const gameRecord = document.createElement('div');
    gameRecord.classList.add('game-record');
    gameRecord.textContent = `game record: ${state.gameRecord} pts.`;

    const logout = document.createElement('div');
    logout.classList.add('logout-btn');
    logout.textContent = 'Logout';

    records.appendChild(playerName);
    records.appendChild(scoreboard);
    records.appendChild(personalRecord);
    records.appendChild(gameRecord);

    game.gameScreen.appendChild(records);
    game.gameScreen.appendChild(logout);

    game.playerName = playerName;
    game.scoreboard = scoreboard;

    game.createHero(state.hero);

    window.requestAnimationFrame(gameLoop.bind(null, state, game));
};

async function saveScore(player, score) {
    const _userId = localStorage.getItem('userUID');

    const response = await fetch('/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _userId, player, score })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.message);
}

async function getUserScore() {
    const _userId = localStorage.getItem('userUID');
    const response = await fetch(`/get-user-score/${_userId}`);
    const data = await response.json();

    return `personal record: ${data.score} pts.`;
}

async function getBestScore() {
    const response = await fetch('/get-best-score');
    const data = await response.json();

    return `game record: ${data.score} pts.`;
}