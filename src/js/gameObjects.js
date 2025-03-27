export function initGameObject() {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const loginNavigate = document.querySelector('.login-navigation');
    const registerNavigate = document.querySelector('.register-navigation');
    const loginScreen = document.querySelector('.login-screen');
    const registerScreen = document.querySelector('.register-screen');
    const startScreen = document.querySelector('.start-screen');
    const startButton = document.querySelector('.start-btn');
    const gameScreen = document.querySelector('.game-screen');
    const endScreen = document.querySelector('.end-screen');
    const playerName = document.querySelector('.username');
    const scoreboard = document.querySelector('.score');
    const personalRecord = document.querySelector('.personal-record');
    const gameRecord = document.querySelector('.game-record');
    const levelScore = document.querySelector('.level-score');
    const nextLevelButton = document.querySelector('.next-btn');

    return {
        welcomeScreen,
        loginNavigate,
        registerNavigate,
        loginScreen,
        registerScreen,
        startScreen,
        startButton,
        gameScreen,
        endScreen,
        playerName,
        scoreboard,
        personalRecord,
        gameRecord,
        levelScore,
        nextLevelButton,
        createHero(initialState, isComrade = false) {
            let heroElement = document.createElement('div');
            heroElement.classList.add('hero');
            
            heroElement.style.width = initialState.width + 'px';
            heroElement.style.height = initialState.height + 'px';

            heroElement.style.left = initialState.posX + '%';
            heroElement.style.bottom = initialState.posY + 'px';

            if (!isComrade) {
                this.heroElement = heroElement;
            }

            this.gameScreen.appendChild(heroElement);
            return heroElement;
        },
        createEnemy(initialState) {
            let enemyElement = document.createElement('div');
            enemyElement.classList.add('enemy');

            enemyElement.style.width = initialState.width + 'px';
            enemyElement.style.height = initialState.height + 'px';

            enemyElement.style.left = initialState.posX + '%';
            enemyElement.style.top = initialState.posY + 'px';

            const enemyTextElement = document.createElement('span');
            enemyTextElement.classList.add('enemy-text');
            enemyTextElement.textContent = initialState.strength;
            enemyElement.appendChild(enemyTextElement);

            enemyElement.dataset.type = 'enemy';
            enemyElement.dataset.strength = initialState.strength;

            this.enemyElement = enemyElement;
            this.gameScreen.appendChild(enemyElement);

            return enemyElement;
        },
        createFireball(hero, fireball) {
            let fireballElement = document.createElement('div');
            fireballElement.classList.add('fireball');
            fireballElement.style.left = hero.posX - 1 + '%';
            fireballElement.style.bottom = hero.posY + 110 + 'px';
            fireballElement.style.width = fireball.width + 'px';
            fireballElement.style.height = fireball.height + 'px';

            gameScreen.appendChild(fireballElement);
        },
        createItemsRow(stats, leftItemData, rightItemData) {
            const itemsRowElement = document.createElement('div');
            itemsRowElement.classList.add('items-row');

            const leftItemElement = document.createElement('div');
            leftItemElement.classList.add('left-item');
            leftItemElement.dataset.type = leftItemData.type;
            leftItemElement.dataset.strength = leftItemData.strength;
            leftItemElement.dataset.fireRate = leftItemData.fireRate;
            leftItemElement.dataset.fireDamage = leftItemData.fireDamage;
            leftItemElement.dataset.extraComrade = leftItemData.extraComrade;
            leftItemElement.dataset.addWidth = leftItemData.addWidth;
            leftItemElement.dataset.addHeight = leftItemData.addHeight;

            const rightItemElement = document.createElement('div');
            rightItemElement.classList.add('right-item');
            rightItemElement.dataset.type = rightItemData.type;
            rightItemElement.dataset.strength = rightItemData.strength;
            rightItemElement.dataset.fireRate = rightItemData.fireRate;
            rightItemElement.dataset.fireDamage = rightItemData.fireDamage;
            rightItemElement.dataset.extraComrade = rightItemData.extraComrade;
            rightItemElement.dataset.addWidth = rightItemData.addWidth;
            rightItemElement.dataset.addHeight = rightItemData.addHeight;

            const leftTextElement = document.createElement('span');
            if (leftItemData.type == 'barrel' || leftItemData.type == 'gate') {
                leftTextElement.classList.add('strength-text');
                leftTextElement.textContent = leftItemData.strength;
            } else if (leftItemData.type == 'comrade') {
                leftTextElement.classList.add('extra-comrade-text');
                leftTextElement.textContent = leftItemData.extraComrade;
            }
            leftItemElement.appendChild(leftTextElement);

            const rightTextElement = document.createElement('span');
            if (rightItemData.type == 'barrel' || rightItemData.type == 'gate') {
                rightTextElement.classList.add('strength-text');
                rightTextElement.textContent = rightItemData.strength;
            } else if (rightItemData.type == 'comrade') {
                rightTextElement.classList.add('extra-comrade-text');
                rightTextElement.textContent = rightItemData.extraComrade;
            }
            rightItemElement.appendChild(rightTextElement);

            itemsRowElement.appendChild(leftItemElement);
            itemsRowElement.appendChild(rightItemElement);

            leftItemElement.style.width = stats.width + 'px';
            leftItemElement.style.height = stats.height + 'px';
            leftItemElement.style.top = '-140px';

            rightItemElement.style.width = stats.width + 'px';
            rightItemElement.style.height = stats.height + 'px';
            rightItemElement.style.top = '-140px';
            rightItemElement.style.left = '57%';

            gameScreen.appendChild(itemsRowElement);

            return {leftItemElement, rightItemElement };
        },
        showRestartButton(state, game, restartGameFn) {
            let restartButton = document.createElement('button');
            restartButton.textContent = 'Restart Game';
            restartButton.classList.add('restart-button');
            restartButton.onclick = () => restartGameFn(state, game);
    
            game.gameScreen.appendChild(restartButton);
        }
    };
}