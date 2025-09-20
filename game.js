// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    dx: 4,
    dy: 4,
    speed: 4
};

const paddleHeight = 80;
const paddleWidth = 10;
const playerPaddle = {
    y: canvas.height / 2 - paddleHeight / 2,
    x: 50,
    height: paddleHeight,
    width: paddleWidth,
    dy: 5,
    score: 0
};

const computerPaddle = {
    y: canvas.height / 2 - paddleHeight / 2,
    x: canvas.width - 50 - paddleWidth,
    height: paddleHeight,
    width: paddleWidth,
    dy: 4,
    score: 0
};

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawCenterLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game objects
    drawCenterLine();
    drawBall();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    
    // Update score display
    document.getElementById('player-score').textContent = playerPaddle.score;
    document.getElementById('computer-score').textContent = computerPaddle.score;
}

// Movement and controls
function movePaddles() {
    // Computer AI
    const paddleCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;
    
    if (paddleCenter < ballCenter - 35) {
        computerPaddle.y += computerPaddle.dy;
    } else if (paddleCenter > ballCenter + 35) {
        computerPaddle.y -= computerPaddle.dy;
    }

    // Keep paddles within canvas
    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));
    computerPaddle.y = Math.max(0, Math.min(canvas.height - computerPaddle.height, computerPaddle.y));
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collisions
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collisions
    if (checkPaddleCollision(playerPaddle) || checkPaddleCollision(computerPaddle)) {
        ball.dx *= -1.1; // Increase speed slightly
    }

    // Score points
    if (ball.x + ball.size > canvas.width) {
        playerPaddle.score++;
        resetBall();
    } else if (ball.x - ball.size < 0) {
        computerPaddle.score++;
        resetBall();
    }
}

function checkPaddleCollision(paddle) {
    return ball.x - ball.size < paddle.x + paddle.width &&
           ball.x + ball.size > paddle.x &&
           ball.y > paddle.y &&
           ball.y < paddle.y + paddle.height;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

// Keyboard controls
const keys = {
    w: false,
    s: false
};

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') keys.w = true;
    if (e.key.toLowerCase() === 's') keys.s = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') keys.w = false;
    if (e.key.toLowerCase() === 's') keys.s = false;
});

function handlePlayerInput() {
    if (keys.w) playerPaddle.y -= playerPaddle.dy;
    if (keys.s) playerPaddle.y += playerPaddle.dy;
}

// Initialize game loop
function gameLoop() {
    handlePlayerInput();
    movePaddles();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
resetBall();
gameLoop();