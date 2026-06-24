/* ===============================
   YARDIMCI: Modal aç/kapat
   (.open sınıfı CSS animasyonunu tetikler)
================================= */
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.dataset.modalOpen = id;
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    delete document.body.dataset.modalOpen;
}

/* ===============================
   PENCERE (ŞEHİRLER) MANTIĞI
================================= */
let currentSlideIndex = 0;
const slides = ["slide-sanliurfa", "slide-istanbul"];

function openWindowModal() {
    openModal('window-modal');
    currentSlideIndex = 0;
    showSlide(currentSlideIndex);
}
function closeWindowModal() { closeModal('window-modal'); }

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= slides.length) { currentSlideIndex = 0; }
    else if (currentSlideIndex < 0) { currentSlideIndex = slides.length - 1; }
    showSlide(currentSlideIndex);
}
function goToSlide(index) { currentSlideIndex = index; showSlide(currentSlideIndex); }

function showSlide(index) {
    slides.forEach(id => { document.getElementById(id).style.display = "none"; });
    document.getElementById(slides[index]).style.display = "block";
    document.querySelectorAll('#window-dots .dot')
        .forEach((d, i) => d.classList.toggle('active', i === index));
}

/* ===============================
   GİYSİ DOLABI (TARZIM) MANTIĞI
================================= */
let currentWardrobeIndex = 1;
const totalWardrobeImages = 9; 

function openWardrobeModal() {
    openModal('wardrobe-modal');
    currentWardrobeIndex = 1;
    updateWardrobeImage();
}
function closeWardrobeModal() { closeModal('wardrobe-modal'); }

function changeWardrobeSlide(direction) {
    currentWardrobeIndex += direction;
    if (currentWardrobeIndex > totalWardrobeImages) { currentWardrobeIndex = 1; }
    else if (currentWardrobeIndex < 1) { currentWardrobeIndex = totalWardrobeImages; }
    updateWardrobeImage();
}
function updateWardrobeImage() {
    document.getElementById('wardrobe-img').src = `img/${currentWardrobeIndex}.jpeg`;
    const counter = document.getElementById('wardrobe-current');
    if (counter) counter.textContent = currentWardrobeIndex;
}

/* ===============================
   KİTAPLIK MANTIĞI
================================= */
function openBookshelfModal() {
    openModal('bookshelf-modal');
}
function closeBookshelfModal() {
    closeModal('bookshelf-modal');
}

/* ===============================
   MÜZİK ÇALAR MANTIĞI
================================= */
function openMusicModal() { openModal('music-modal'); }
function closeMusicModal() { closeModal('music-modal'); }


/* ===============================
   KAHVE KUPASI MANTIĞI (TOOLTIP)
================================= */
let coffeeClicks = 0;

function drinkCoffee() {
    coffeeClicks++;
    
    // Her tıklamada değişen dinamik rakamlar
    const linesOfCode = 340 + (coffeeClicks * 85);
    const remainingBugs = Math.max(0, 7 - coffeeClicks);
    
    // Değerleri Tooltip içine yazdır
    document.getElementById('coffee-count').innerText = coffeeClicks;
    document.getElementById('code-count').innerText = linesOfCode;
    document.getElementById('bug-count').innerText = remainingBugs === 0 ? "Tertemiz! 🎉" : remainingBugs + " 🐛";
    
    // Tıklandığını hissettirmek için ufak bir animasyon
    const cup = document.getElementById('coffee-cup');
    cup.style.transform = 'scale(0.9)';
    setTimeout(() => {
        cup.style.transform = 'scale(1)';
    }, 150);
}

/* ===============================
   RÜYA EKRANI (GECE MODU)
================================= */
let dreamTimeout;

function startDream() {
    const overlay = document.getElementById('dream-overlay');
    const dreamText = document.getElementById('dream-text');
    
    dreamText.classList.remove('hide-text');
    overlay.classList.add('active');
    
    dreamTimeout = setTimeout(() => {
        dreamText.classList.add('hide-text');
    }, 2500);
}

function wakeUp() {
    const overlay = document.getElementById('dream-overlay');
    overlay.classList.remove('active');
    if(dreamTimeout) clearTimeout(dreamTimeout);
}

/* ===============================
   BİLGİSAYAR VE OYUN MANTIĞI
================================= */
let gameInterval;
let gameKeyDown = null;
let gameKeyUp = null;

function openPC() {
    const room = document.querySelector('.room-wrapper');
    room.classList.add('zoom-in-effect');
    setTimeout(() => { openModal('pc-modal'); }, 1750);
}
function closePC() {
    closeModal('pc-modal');
    document.querySelector('.room-wrapper').classList.remove('zoom-in-effect');
    closeInnerWindow();
}
function showSection(id) {
    document.getElementById('pc-window').style.display = 'block';
    document.querySelectorAll('.pc-content').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (gameInterval) clearInterval(gameInterval);
}
function closeInnerWindow() {
    document.getElementById('pc-window').style.display = 'none';
    if (gameInterval) clearInterval(gameInterval);
    detachGameKeys();
}
function detachGameKeys() {
    if (gameKeyDown) document.removeEventListener("keydown", gameKeyDown);
    if (gameKeyUp) document.removeEventListener("keyup", gameKeyUp);
    gameKeyDown = gameKeyUp = null;
}

/* ---------- BLOK KIRICI ---------- */
function startGame() {
    showSection('game-container');
    if (gameInterval) clearInterval(gameInterval);
    detachGameKeys();

    const canvas = document.getElementById("brickBreaker");
    const ctx = canvas.getContext("2d");

    const LEVELS = [
        { rows: 3, cols: 5, speed: 2.4 },
        { rows: 4, cols: 6, speed: 2.9 },
        { rows: 5, cols: 7, speed: 3.4 }
    ];
    const ROW_COLORS = ["#f5c542", "#8e7be6", "#5ec3e0", "#e0795e", "#6ee07b"];

    let level = 0;
    let score = 0;
    let lives = 3;
    let state = "play";

    const ballRadius   = 9;
    const paddleHeight = 12;
    const paddleWidth  = 82;
    const brickHeight  = 20;
    const brickPadding = 8;
    const brickOffsetTop  = 42;
    const brickOffsetSide = 24;

    let x, y, dx, dy, paddleX, bricks, brickWidth, remaining;
    let rightPressed = false, leftPressed = false;

    function resetBall() {
        const cfg = LEVELS[level];
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = cfg.speed * (Math.random() < 0.5 ? -1 : 1);
        dy = -cfg.speed;
        paddleX = (canvas.width - paddleWidth) / 2;
    }
    function buildLevel() {
        const cfg = LEVELS[level];
        brickWidth = (canvas.width - 2 * brickOffsetSide - (cfg.cols - 1) * brickPadding) / cfg.cols;
        bricks = [];
        remaining = 0;
        for (let c = 0; c < cfg.cols; c++) {
            bricks[c] = [];
            for (let r = 0; r < cfg.rows; r++) { bricks[c][r] = { status: 1 }; remaining++; }
        }
        resetBall();
    }
    buildLevel();

    gameKeyDown = function (e) {
        if (e.key === "ArrowRight" || e.key === "Right") rightPressed = true;
        else if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = true;
    };
    gameKeyUp = function (e) {
        if (e.key === "ArrowRight" || e.key === "Right") rightPressed = false;
        else if (e.key === "ArrowLeft" || e.key === "Left") leftPressed = false;
    };
    document.addEventListener("keydown", gameKeyDown);
    document.addEventListener("keyup", gameKeyUp);

    function movePaddleToClientX(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;
        const rx = (clientX - rect.left) * scale;
        if (rx > 0 && rx < canvas.width) paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, rx - paddleWidth / 2));
    }
    canvas.onmousemove = e => { if (state === "play") movePaddleToClientX(e.clientX); };
    canvas.ontouchmove = e => { e.preventDefault(); if (state === "play") movePaddleToClientX(e.touches[0].clientX); };

    document.querySelectorAll('.touch-btn').forEach(btn => {
        const dir = btn.dataset.dir;
        btn.onpointerdown = () => { dir === 'left' ? (leftPressed = true) : (rightPressed = true); };
        btn.onpointerup    = () => { dir === 'left' ? (leftPressed = false) : (rightPressed = false); };
        btn.onpointerleave = () => { dir === 'left' ? (leftPressed = false) : (rightPressed = false); };
    });

    function advance() {
        if (state === "levelup") { level++; buildLevel(); state = "play"; }
        else if (state === "gameover" || state === "win") { level = 0; score = 0; lives = 3; buildLevel(); state = "play"; }
    }
    canvas.onclick = advance;

    function collisionDetection() {
        const cfg = LEVELS[level];
        for (let c = 0; c < cfg.cols; c++) {
            for (let r = 0; r < cfg.rows; r++) {
                const b = bricks[c][r];
                if (b.status !== 1) continue;
                const bx = brickOffsetSide + c * (brickWidth + brickPadding);
                const by = brickOffsetTop + r * (brickHeight + brickPadding);
                if (x > bx && x < bx + brickWidth && y > by && y < by + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    remaining--;
                    if (remaining === 0) state = (level === LEVELS.length - 1) ? "win" : "levelup";
                }
            }
        }
    }

    function drawBricks() {
        const cfg = LEVELS[level];
        for (let c = 0; c < cfg.cols; c++) {
            for (let r = 0; r < cfg.rows; r++) {
                if (bricks[c][r].status !== 1) continue;
                const bx = brickOffsetSide + c * (brickWidth + brickPadding);
                const by = brickOffsetTop + r * (brickHeight + brickPadding);
                ctx.fillStyle = ROW_COLORS[r % ROW_COLORS.length];
                if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(bx, by, brickWidth, brickHeight, 5); ctx.fill(); }
                else ctx.fillRect(bx, by, brickWidth, brickHeight);
            }
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.fillStyle = "#f5c542";
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 6); ctx.fill(); }
        else ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    }
    function drawHUD() {
        ctx.font = "13px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#f3eefb";
        ctx.fillText("Skor " + score, 12, 22);
        ctx.textAlign = "center";
        ctx.fillStyle = "#b8aed0";
        ctx.fillText("Seviye " + (level + 1) + "/" + LEVELS.length, canvas.width / 2, 22);
        ctx.textAlign = "right";
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("\u2665 ".repeat(lives).trim(), canvas.width - 12, 22);
        ctx.textAlign = "left";
    }
    function drawBanner(big, small) {
        ctx.fillStyle = "rgba(8,6,12,0.72)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "#f5c542";
        ctx.font = "700 26px Sora, sans-serif";
        ctx.fillText(big, canvas.width / 2, canvas.height / 2 - 6);
        ctx.fillStyle = "#dcd4ef";
        ctx.font = "13px Inter, sans-serif";
        ctx.fillText(small, canvas.width / 2, canvas.height / 2 + 22);
        ctx.textAlign = "left";
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawPaddle();
        drawHUD();

        if (state !== "play") {
            drawBall();
            if (state === "levelup") drawBanner("Seviye " + level + " tamam!", "Devam için tıkla / dokun");
            else if (state === "win") drawBanner("Tebrikler! \uD83C\uDFC6", "Tüm seviyeleri bitirdin · Tekrar için tıkla");
            else if (state === "gameover") drawBanner("Oyun Bitti", "Skor " + score + " · Tekrar için tıkla");
            return;
        }

        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
        if (y + dy < ballRadius) { dy = -dy; }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                const hit = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
                dx = LEVELS[level].speed * hit * 1.1;
            } else {
                lives--;
                if (lives <= 0) state = "gameover";
                else resetBall();
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
        else if (leftPressed && paddleX > 0) paddleX -= 7;

        drawBall();
        x += dx;
        y += dy;
    }

    gameInterval = setInterval(draw, 10);
}

/* ===============================
   GENEL UX İYİLEŞTİRMELERİ
================================= */
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const open = document.body.dataset.modalOpen;
        if (!open) return;
        (open === 'pc-modal') ? closePC() : closeModal(open);
    });

    ['window-modal', 'wardrobe-modal', 'bookshelf-modal', 'music-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(id); });
        }
    });

    document.querySelectorAll('[role="button"]').forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
        });
    });

    const infoHotspots = document.querySelectorAll('.hotspot:not(.clickable)');
    infoHotspots.forEach(h => {
        h.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = h.classList.contains('show-tooltip');
            infoHotspots.forEach(o => o.classList.remove('show-tooltip'));
            if (!wasOpen) h.classList.add('show-tooltip');
        });
    });
    document.addEventListener('click', () => infoHotspots.forEach(o => o.classList.remove('show-tooltip')));

    const hint = document.getElementById('scroll-hint');
    if (hint) {
        const hide = () => { hint.style.opacity = '0'; setTimeout(() => hint.remove(), 500); };
        setTimeout(hide, 5000);
        window.addEventListener('scroll', hide, { once: true, passive: true });
        const rc = document.querySelector('.room-container');
        if (rc) rc.addEventListener('scroll', hide, { once: true, passive: true });
    }
});