export function initState() {
    const state = {
        player: '',
        score: 0,
        gameRecord: 0,
        personalRecord: 0,
        win: false,
        gameOver: false,
        scoreRate: 1,
        killScore: 10,
        hero: {
            width: 95,
            height: 100,
            posX: 50,
            posY: 1,
            speed: 2
        },
        enemy: {
            width: 134,
            height: 150,
            posX: 50,
            posY: -160,
            strength: 2048,
            spawned: false,
        },
        comrades: [],
        fireball: {
            width: 20,
            height: 20,
            speed: 12,
            nextSpawnTimestamp: 0,
            fireRate: 225,
            fireDamage: 1
        },
        extraItemStats: {
            width: 150,
            height: 150,
            nextSpawnTimestamp: 0,
            spawnInterval: 4500,
            speed: 2,
            count: 0
        },
        keys: {
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        },
        lev1: [
            { type: 'barrel', strength: 2, fireRate: 5, fireDamage: 0, extraComrade: 0, addWidth: 0, addHeight: 0 },
            { type: 'barrel', strength: 12, fireRate: 10, fireDamage: 0, extraComrade: 0, addWidth: 0, addHeight: 0 },
            { type: 'barrel', strength: 18, fireRate: 15, fireDamage: 0, extraComrade: 0, addWidth: 0, addHeight: 0 },
            { type: 'comrade', strength: 0, fireRate: 0, fireDamage: 0, extraComrade: 1, addWidth: 0, addHeight: 0 },
            { type: 'gate', strength: 30, fireRate: 0, fireDamage: 3, extraComrade: 0, addWidth: 3, addHeight: 3 },
            { type: 'gate', strength: 22, fireRate: 0, fireDamage: 2, extraComrade: 0, addWidth: 2, addHeight: 2 },
            { type: 'barrel', strength: 112, fireRate: 20, fireDamage: 0, extraComrade: 0, addWidth: 0, addHeight: 0 },
            { type: 'gate', strength: 128, fireRate: 0, fireDamage: 4, extraComrade: 0, addWidth: 4, addHeight: 4 },
            { type: 'comrade', strength: 0, fireRate: 0, fireDamage: 0, extraComrade: 1, addWidth: 0, addHeight: 0 },
            { type: 'comrade', strength: 0, fireRate: 0, fireDamage: 0, extraComrade: -1, addWidth: 0, addHeight: 0 },
            { type: 'gate', strength: 256, fireRate: 0, fireDamage: 5, extraComrade: 0, addWidth: 5, addHeight: 5 },
            { type: 'barrel', strength: 256, fireRate: 25, fireDamage: 0, extraComrade: 0, addWidth: 0, addHeight: 0 },
            { type: 'comrade', strength: 0, fireRate: 0, fireDamage: 0, extraComrade: 2, addWidth: 0, addHeight: 0 },
            { type: 'gate', strength: 1024, fireRate: 0, fireDamage: 6, extraComrade: 0, addWidth: 6, addHeight: 6 }
        ]
    };

    return state;
}