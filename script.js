// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust the canvas size to fit the mobile screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    heroSize = Math.min(canvas.width, canvas.height) * 0.16; // Responsive size
    enemySize = Math.min(canvas.width, canvas.height) * 0.2; // Responsive size
    bulletSize = Math.min(canvas.width, canvas.height) * 0.1; // Responsive size
    enemySpeed = Math.min(canvas.width, canvas.height) * 0.005; // Responsive speed
    bulletSpeed = Math.min(canvas.width, canvas.height) * 0.05; // Responsive speed
}
resizeCanvas(); // Initial resize

window.addEventListener('resize', resizeCanvas);

// Load images
const heroImage = new Image();
const enemyImages = [new Image(), new Image(), new Image(), new Image(), new Image()];
const bulletImage = new Image();

// Set image sources
heroImage.src = 'hero.png'; // Replace with the path to your hero image
enemyImages.forEach((image, index) => image.src = `enemy${index + 1}.png`); // Replace with paths to your enemy images
bulletImage.src = 'bullet.png'; // Replace with the path to your bullet image

const hero = {
    x: canvas.width / 2,
    y: canvas.height - heroSize / 2,
    width: heroSize,
    height: heroSize
};

let enemies = [];
let bullets = [];

// Function to create a new enemy
function createEnemy() {
    const x = Math.random() * canvas.width;
    const y = -enemySize;  // Start above the screen
    const dx = 0; // No horizontal movement
    const dy = enemySpeed; // Move downwards

    // Randomly choose an enemy image
    const image = enemyImages[Math.floor(Math.random() * enemyImages.length)];

    enemies.push({
        x, y, dx, dy,
        width: enemySize, height: enemySize,
        image
    });
}

function drawHero() {
    ctx.drawImage(heroImage, hero.x - hero.width / 2, hero.y - hero.height / 2, hero.width, hero.height);
}

function drawEnemy(enemy) {
    ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawBullet(bullet) {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bulletSize, bulletSize);
}

function update() {
    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Remove off-screen bullets
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    // Check for collisions
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bulletSize > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bulletSize > enemy.y) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });

    // Check for collisions with hero
    enemies.forEach(enemy => {
        if (hero.x < enemy.x + enemy.width &&
            hero.x + hero.width > enemy.x &&
            hero.y < enemy.y + enemy.height &&
            hero.y + hero.height > enemy.y) {
            alert('Game Over!');
            document.location.reload();
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHero();
    enemies.forEach(drawEnemy);
    bullets.forEach(drawBullet);
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

function shootBullet(x, y) {
    // Calculate bullet direction
    const dx = x - hero.x;
    const dy = y - hero.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;

    bullets.push({
        x: hero.x - bulletSize / 2,
        y: hero.y - bulletSize / 2,
        dx: normalizedDx * bulletSpeed,
        dy: normalizedDy * bulletSpeed
    });
}

function handleInput(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event.type === 'mousedown') {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    } else if (event.type === 'touchstart') {
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
    }

    shootBullet(x, y);
}

// Add event listeners for mouse and touch input
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput);

setInterval(createEnemy, 1000);

gameLoop();
