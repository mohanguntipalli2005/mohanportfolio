// ==============================
// DOM READY INITIALIZATION
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    
    // Check and set active theme on load
    const savedTheme = localStorage.getItem("portfolio-theme");
    const isLightMode = savedTheme === "light";
    if (isLightMode) {
        document.body.classList.add("light");
        const themeBtn = document.getElementById("theme-toggle");
        if (themeBtn) {
            themeBtn.className = "fa-solid fa-sun";
        }
    }

    // ==============================
    // VANTA BACKGROUND
    // ==============================
    let vantaEffect = null;

    function initVantaBackground() {
        if (vantaEffect) {
            vantaEffect.destroy();
        }

        const isLight = document.body.classList.contains("light");

        if (typeof VANTA !== "undefined" && VANTA.NET) {
            vantaEffect = VANTA.NET({
                el: "#vantajs",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1,
                scaleMobile: 1,
                color: isLight ? 0x008fa0 : 0x60a5fa,
                backgroundColor: isLight ? 0xf4f7f6 : 0x09090b,
                points: 14,
                maxDistance: 20,
                spacing: 18
            });
        }
    }

    // Initialize Vanta
    initVantaBackground();

    // Re-init Vanta on window resize to ensure fluid responsive canvas resizing
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initVantaBackground();
        }, 300);
    });

    // ==============================
    // DARK / LIGHT MODE SWITCHER
    // ==============================
    const themeBtn = document.getElementById("theme-toggle");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light");

            const isLight = document.body.classList.contains("light");

            // Update local storage preference
            localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");

            // Toggle icon
            if (isLight) {
                themeBtn.className = "fa-solid fa-sun";
                showToast("Switched to Light Mode");
            } else {
                themeBtn.className = "fa-solid fa-moon";
                showToast("Switched to Dark Mode");
            }

            // Recreate Vanta background with new theme palette
            initVantaBackground();
        });
    }

    // ==============================
    // TYPING ANIMATION
    // ==============================
    if (document.getElementById("typing") && typeof Typed !== "undefined") {
        new Typed("#typing", {
            strings: [
                "Java Backend Specialist",
                "Computer Science (AI) Student",
                "Full Stack Developer",
                "Machine Learning Enthusiast",
                "Analytical Problem Solver"
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1600,
            loop: true
        });
    }

    // ==============================
    // AOS ANIMATION TRIGGERS
    // ==============================
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-quad",
            once: true,
            offset: 100
        });
    }

    // ==============================
    // ACTIVE SECTION HIGHLIGHTING
    // ==============================
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    function highlightActiveLink() {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 150; // Offset to trigger early

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", highlightActiveLink);
    highlightActiveLink(); // Trigger initially on page load

    // ==============================
    // SMOOTH SCROLL WITH DYNAMIC NAVBAR OFFSET
    // ==============================
    const navbar = document.getElementById("navbar");
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset based on navbar height (including margin-top)
                const navHeight = navbar ? navbar.offsetHeight + 20 : 110;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // WEB3FORMS CONFIGURATION (Real Email Setup)
    // ==========================================
    // To start receiving real emails in your inbox (mohanguntupalli2005@gmail.com):
    // 1. Visit https://web3forms.com/ and request a free Access Key.
    // 2. Paste your Access Key inside the quotes below:
    const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

    // ==============================
    // CONTACT FORM INTERACTIVE HANDLER
    // ==============================
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
            const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
            const messageInput = contactForm.querySelector('textarea');

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            if (!name || !email || !message) {
                showToast("Please fill in all the required fields.", "error");
                return;
            }

            const sendButton = contactForm.querySelector('button[type="submit"]');
            if (sendButton) {
                const originalText = sendButton.innerHTML;
                sendButton.disabled = true;
                sendButton.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>`;

                // If Web3Forms Access Key is not configured yet, run a friendly fallback
                if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
                    setTimeout(() => {
                        sendButton.disabled = false;
                        sendButton.innerHTML = originalText;
                        showToast("Add your Web3Forms Access Key in script.js to activate real email delivery!", "info");
                        contactForm.reset();
                    }, 1200);
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
                    formData.append("name", name);
                    formData.append("email", email);
                    formData.append("message", message);
                    formData.append("subject", `New Portfolio Contact from ${name}`);
                    formData.append("from_name", "Mohan Guntupalli Portfolio");

                    const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: formData
                    });

                    const data = await response.json();

                    sendButton.disabled = false;
                    sendButton.innerHTML = originalText;

                    if (data.success) {
                        showToast(`Thank you, ${name}! Your message has been sent successfully.`);
                        contactForm.reset();
                    } else {
                        showToast("Failed to send message. Please verify your Web3Forms Access Key.", "error");
                    }
                } catch (error) {
                    sendButton.disabled = false;
                    sendButton.innerHTML = originalText;
                    showToast("Network connection error. Please try again later.", "error");
                }
            }
        });
    }

    // ==============================
    // TOAST NOTIFICATION ENGINE
    // ==============================
    function showToast(message, type = "success") {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }

        // Elegant custom icons depending on message context
        let iconHtml = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>';
        if (type === "error") {
            iconHtml = '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>';
        } else if (type === "info") {
            iconHtml = '<i class="fa-solid fa-circle-info" style="color: #38bdf8;"></i>';
        }

        toast.innerHTML = `${iconHtml} <span id="toast-msg">${message}</span>`;
        toast.classList.add("show");

        // Automatically hide the toast after 4.5 seconds
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4500);
    }

    // ==================================
    // CHROME OFFLINE DINO GAME
    // ==================================
    const dinoContainer = document.getElementById("dino-game-container");
    const dinoCanvas = document.getElementById("dino-canvas");
    const dinoStartScreen = document.getElementById("dino-start");
    const dinoGameOverScreen = document.getElementById("dino-gameover");
    const dinoScoreVal = document.getElementById("dino-score");
    const dinoHighScoreVal = document.getElementById("dino-highscore");
    const dinoRestartBtn = document.getElementById("dino-restart");

    if (dinoCanvas && dinoContainer) {
        const ctx = dinoCanvas.getContext("2d");
        
        // Setup fixed internal resolution for crisp scaling
        dinoCanvas.width = 600;
        dinoCanvas.height = 375;

        // Physics parameters
        const gravity = 0.55;
        const groundY = 310; // floor height

        let score = 0;
        let highScore = parseInt(localStorage.getItem("dino_high") || "0");
        let isGameRunning = false;
        let isGameOver = false;
        let speed = 5.2;
        let gameFrame = 0;

        // Player (T-Rex)
        const player = {
            x: 50,
            y: groundY - 44,
            vy: 0,
            width: 44,
            height: 44,
            legFrame: 0,
            frameTimer: 0,
            isJumping: false,
            jump() {
                if (!this.isJumping) {
                    this.vy = -11.5;
                    this.isJumping = true;
                    // Emit jump dust
                    createDustParticles(this.x + 10, groundY);
                }
            },
            update() {
                this.vy += gravity;
                this.y += this.vy;

                if (this.y >= groundY - this.height) {
                    this.y = groundY - this.height;
                    this.vy = 0;
                    this.isJumping = false;
                }

                // Leg animation
                if (!this.isJumping && isGameRunning) {
                    this.frameTimer++;
                    if (this.frameTimer > 6) {
                        this.legFrame = 1 - this.legFrame;
                        this.frameTimer = 0;
                    }
                }
            },
            draw() {
                ctx.save();
                
                // Pure vector silhouette of retro T-Rex
                ctx.fillStyle = "#ffffff";
                
                // Draw T-Rex body blocks
                const pixels = [
                    [22, 0, 18, 4],
                    [20, 4, 22, 4],
                    [20, 8, 22, 4],
                    [20, 12, 14, 4],
                    [20, 16, 20, 4],
                    [0, 16, 12, 16],
                    [4, 12, 16, 24],
                    [8, 8, 12, 16],
                    [0, 12, 4, 8],
                    [2, 16, 4, 8],
                    [20, 24, 8, 4]
                ];

                // Render core body blocks
                pixels.forEach(([px, py, pw, ph]) => {
                    ctx.fillRect(this.x + px, this.y + py, pw, ph);
                });

                // Eye cutout (uses deep dark theme color)
                ctx.fillStyle = "#09090b";
                ctx.fillRect(this.x + 24, this.y + 4, 4, 4);

                // Animated Legs
                ctx.fillStyle = "#ffffff";
                if (this.isJumping) {
                    ctx.fillRect(this.x + 6, this.y + 36, 4, 4);
                    ctx.fillRect(this.x + 14, this.y + 36, 4, 4);
                } else if (this.legFrame === 0) {
                    ctx.fillRect(this.x + 6, this.y + 36, 4, 4);
                    ctx.fillRect(this.x + 14, this.y + 36, 4, 4);
                    ctx.fillRect(this.x + 14, this.y + 32, 4, 4);
                } else {
                    ctx.fillRect(this.x + 6, this.y + 36, 4, 4);
                    ctx.fillRect(this.x + 6, this.y + 32, 4, 4);
                    ctx.fillRect(this.x + 14, this.y + 36, 4, 4);
                }

                ctx.restore();
            }
        };

        // Entities arrays
        let obstacles = [];
        let clouds = [];
        let particles = [];
        let groundDashes = [];

        // Seed initial clouds & ground dashes
        for (let i = 0; i < 3; i++) {
            clouds.push({
                x: Math.random() * 600 + i * 200,
                y: 40 + Math.random() * 70,
                speedMultiplier: 0.15 + Math.random() * 0.1
            });
        }
        for (let i = 0; i < 8; i++) {
            groundDashes.push({
                x: i * 85,
                width: 15 + Math.random() * 20
            });
        }

        // Particle System
        class Particle {
            constructor(x, y, vx, vy, size, color, alphaDecay) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.size = size;
                this.color = color;
                this.alpha = 1.0;
                this.alphaDecay = alphaDecay || 0.03;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.alphaDecay;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
                ctx.restore();
            }
        }

        function createDustParticles(x, y) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(
                    x, 
                    y - Math.random() * 5, 
                    -(1 + Math.random() * 3), 
                    -(Math.random() * 2), 
                    2 + Math.random() * 3, 
                    "rgba(255, 255, 255, 0.4)",
                    0.04
                ));
            }
        }

        function createExplosionParticles(x, y) {
            const colors = ["#ef4444", "#38bdf8", "#ffffff", "#8b5cf6"];
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const force = 1 + Math.random() * 6;
                particles.push(new Particle(
                    x,
                    y,
                    Math.cos(angle) * force,
                    Math.sin(angle) * force,
                    2 + Math.random() * 4,
                    colors[Math.floor(Math.random() * colors.length)],
                    0.02
                ));
            }
        }

        // Draw ground & sky elements
        function drawBackground() {
            // Horizon Line
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(dinoCanvas.width, groundY);
            ctx.stroke();

            // Ground movement speed indicators
            ctx.fillStyle = "rgba(56, 189, 248, 0.3)";
            groundDashes.forEach(dash => {
                ctx.fillRect(dash.x, groundY + 4, dash.width, 2);
                if (isGameRunning) {
                    dash.x -= speed;
                    if (dash.x < -60) {
                        dash.x = dinoCanvas.width + Math.random() * 50;
                        dash.width = 15 + Math.random() * 20;
                    }
                }
            });

            // Clouds drift
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            clouds.forEach(cloud => {
                // Pixel Cloud Vector
                ctx.fillRect(cloud.x, cloud.y, 45, 10);
                ctx.fillRect(cloud.x + 8, cloud.y - 6, 28, 18);
                ctx.fillRect(cloud.x + 16, cloud.y - 12, 14, 24);

                if (isGameRunning) {
                    cloud.x -= speed * cloud.speedMultiplier;
                    if (cloud.x < -60) {
                        cloud.x = dinoCanvas.width + Math.random() * 150;
                        cloud.y = 30 + Math.random() * 80;
                    }
                }
            });
        }

        // Spawn obstacles (Cactuses and occasional pterodactyls)
        function handleObstacles() {
            if (isGameRunning && gameFrame % Math.floor(80 + Math.random() * 70) === 0) {
                const isCactus = Math.random() > 0.25;
                if (isCactus) {
                    const h = 25 + Math.floor(Math.random() * 25); // cactus height
                    const w = 15 + Math.floor(Math.random() * 20); // cactus width
                    obstacles.push({
                        type: "cactus",
                        x: dinoCanvas.width,
                        y: groundY - h,
                        width: w,
                        height: h,
                        color: Math.random() > 0.5 ? "#38bdf8" : "#8b5cf6" // glowing cyan/purple cactuses
                    });
                } else {
                    // Pterodactyl/Bird!
                    const birdY = groundY - 45 - Math.floor(Math.random() * 40);
                    obstacles.push({
                        type: "bird",
                        x: dinoCanvas.width,
                        y: birdY,
                        width: 28,
                        height: 18,
                        wingState: 0,
                        wingTimer: 0
                    });
                }
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                if (isGameRunning) {
                    obs.x -= speed;
                }

                // Draw obstacle
                if (obs.type === "cactus") {
                    ctx.save();
                    ctx.fillStyle = obs.color;
                    ctx.shadowColor = obs.color;
                    ctx.shadowBlur = 8;
                    
                    // Procedural Cactus segments
                    const midX = obs.x + obs.width / 2;
                    ctx.fillRect(midX - 3, obs.y, 6, obs.height); // Main trunk
                    ctx.fillRect(obs.x, obs.y + obs.height * 0.3, obs.width, 4); // Arm bar
                    ctx.fillRect(obs.x, obs.y + obs.height * 0.1, 4, obs.height * 0.2); // Left vertical arm
                    ctx.fillRect(obs.x + obs.width - 4, obs.y + obs.height * 0.15, 4, obs.height * 0.2); // Right vertical arm
                    ctx.restore();
                } else {
                    // Draw Pterodactyl Bird
                    ctx.save();
                    ctx.fillStyle = "#fb7185"; // soft red/rose bird
                    ctx.shadowColor = "#fb7185";
                    ctx.shadowBlur = 6;
                    
                    if (isGameRunning) {
                        obs.wingTimer++;
                        if (obs.wingTimer > 10) {
                            obs.wingState = 1 - obs.wingState;
                            obs.wingTimer = 0;
                        }
                    }

                    // Body
                    ctx.fillRect(obs.x + 8, obs.y + 6, 12, 6);
                    ctx.fillRect(obs.x, obs.y + 4, 8, 4); // Head/beak
                    
                    // Wing animation
                    if (obs.wingState === 0) {
                        ctx.fillRect(obs.x + 10, obs.y, 4, 6); // Wing up
                    } else {
                        ctx.fillRect(obs.x + 10, obs.y + 12, 4, 6); // Wing down
                    }
                    ctx.restore();
                }

                // Collision detection (with generous, fun hitboxes)
                const hitBoxPadding = 4;
                if (
                    player.x + hitBoxPadding < obs.x + obs.width - hitBoxPadding &&
                    player.x + player.width - hitBoxPadding > obs.x + hitBoxPadding &&
                    player.y + hitBoxPadding < obs.y + obs.height - hitBoxPadding &&
                    player.y + player.height - hitBoxPadding > obs.y + hitBoxPadding
                ) {
                    triggerGameOver(obs.x + obs.width / 2, obs.y + obs.height / 2);
                }

                // Remove off-screen obstacles
                if (obs.x < -60) {
                    obstacles.splice(i, 1);
                }
            }
        }

        // Draw and update particle queue
        function handleParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        }

        // Scores update
        function updateScores() {
            if (isGameRunning) {
                gameFrame++;
                if (gameFrame % 5 === 0) {
                    score++;
                    dinoScoreVal.textContent = String(score).padStart(5, "0");
                }
                // Gradually increase horizontal speed
                speed += 0.0012;
                if (speed > 13) speed = 13;
            }
        }

        // Main animation tick
        function tick() {
            // Clear screen
            ctx.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);

            // Draw landscape elements
            drawBackground();

            // Update & Draw player
            player.update();
            player.draw();

            // Obstacles & Collision
            handleObstacles();

            // Visual Particles
            handleParticles();

            // High scores
            updateScores();

            if (isGameRunning) {
                requestAnimationFrame(tick);
            }
        }

        // Control logic triggers
        function startGame() {
            if (isGameRunning) return;
            
            // Clear variables
            isGameRunning = true;
            isGameOver = false;
            score = 0;
            speed = 5.2;
            gameFrame = 0;
            obstacles = [];
            particles = [];
            
            dinoScoreVal.textContent = "00000";
            dinoHighScoreVal.textContent = "HI " + String(highScore).padStart(5, "0");

            dinoStartScreen.style.opacity = "0";
            setTimeout(() => { dinoStartScreen.style.display = "none"; }, 300);
            
            dinoGameOverScreen.style.display = "none";

            // Focus container to capture keyboard keys nicely
            dinoContainer.focus();

            // Run loop
            tick();
        }

        function triggerGameOver(impactX, impactY) {
            isGameRunning = false;
            isGameOver = true;

            // Save highscore
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("dino_high", String(highScore));
                dinoHighScoreVal.textContent = "HI " + String(highScore).padStart(5, "0");
            }

            // Explode particles on dino body
            createExplosionParticles(player.x + 22, player.y + 22);
            // Explode particles at exact impact point
            createExplosionParticles(impactX, impactY);

            // Redraw final frame to show the explosion effect perfectly
            ctx.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
            drawBackground();
            player.draw();
            obstacles.forEach(obs => {
                if (obs.type === "cactus") {
                    ctx.save();
                    ctx.fillStyle = obs.color;
                    ctx.shadowColor = obs.color;
                    ctx.shadowBlur = 8;
                    const midX = obs.x + obs.width / 2;
                    ctx.fillRect(midX - 3, obs.y, 6, obs.height);
                    ctx.fillRect(obs.x, obs.y + obs.height * 0.3, obs.width, 4);
                    ctx.fillRect(obs.x, obs.y + obs.height * 0.1, 4, obs.height * 0.2);
                    ctx.fillRect(obs.x + obs.width - 4, obs.y + obs.height * 0.15, 4, obs.height * 0.2);
                    ctx.restore();
                } else {
                    ctx.save();
                    ctx.fillStyle = "#fb7185";
                    ctx.shadowColor = "#fb7185";
                    ctx.shadowBlur = 6;
                    ctx.fillRect(obs.x + 8, obs.y + 6, 12, 6);
                    ctx.fillRect(obs.x, obs.y + 4, 8, 4);
                    ctx.fillRect(obs.x + 10, obs.y, 4, 6);
                    ctx.restore();
                }
            });
            handleParticles();

            // Display game over screen overlay
            dinoGameOverScreen.style.display = "flex";
            dinoGameOverScreen.style.opacity = "1";
        }

        // Hover tracking to prevent scrolling main page when key-pressing inside hero
        let isHovered = false;
        dinoContainer.addEventListener("mouseenter", () => { isHovered = true; });
        dinoContainer.addEventListener("mouseleave", () => { isHovered = false; });

        // Click / Touch interactions
        dinoContainer.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isGameRunning && !isGameOver) {
                startGame();
            } else if (isGameOver) {
                startGame();
            } else {
                player.jump();
            }
        });

        // Click on restart icon explicitly
        if (dinoRestartBtn) {
            dinoRestartBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                startGame();
            });
        }

        // Global key events nicely bound
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                // Only intercept key scrolls if focused or hovering or playing
                if (isGameRunning || isHovered || document.activeElement === dinoContainer) {
                    e.preventDefault();
                    if (!isGameRunning && !isGameOver) {
                        startGame();
                    } else if (isGameOver) {
                        startGame();
                    } else {
                        player.jump();
                    }
                }
            }
        });

        // Draw initial setup frame
        dinoHighScoreVal.textContent = "HI " + String(highScore).padStart(5, "0");
        drawBackground();
        player.draw();
    }
});
