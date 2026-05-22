// ===== DIGITAL ENGAGEMENT INVITATION =====
// Jayanth & Ranjani - 2nd July 2026

(function() {
    'use strict';

    // ===== GLOBALS =====
    let currentSection = 0;
    let totalSections = 6;
    let isTransitioning = false;
    let isEnvelopeOpen = false;
    let scratchPercentage = 0;
    let musicPlaying = false;
    let scratchRevealed = false;

    // ===== PRELOADER =====
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('hidden');
        }, 2000);
    });

    // ===== ENVELOPE INTERACTION =====
    const envelopeContainer = document.querySelector('.envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeSection = document.getElementById('envelope-section');

    envelopeContainer.addEventListener('click', openEnvelope);
    envelopeContainer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        openEnvelope();
    });

    function openEnvelope() {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        // Open envelope animation
        envelope.classList.add('open');
        
        // Play music
        startMusic();
        
        // Show audio button
        document.getElementById('audio-toggle').classList.add('visible');

        // Celebration burst on envelope open!
        setTimeout(() => {
            createFireworkBurst(envelopeSection, 30);
            createEmojiBurst(envelopeSection, ['✨', '💌', '💍', '🎊', '💕', '❤️'], 20);
            createGlitterShower(envelopeSection, 50);
        }, 400);

        // Transition to welcome section after animation
        setTimeout(() => {
            envelopeSection.style.opacity = '0';
            envelopeSection.style.transform = 'scale(1.1)';
            envelopeSection.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                envelopeSection.style.display = 'none';
                showSection(0);
                document.getElementById('nav-dots').classList.add('visible');
            }, 800);
        }, 1200);
    }

    // ===== MUSIC CONTROL =====
    const audioToggle = document.getElementById('audio-toggle');
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.3;

    function startMusic() {
        bgMusic.play().then(() => {
            musicPlaying = true;
            updateAudioIcon();
        }).catch(() => {
            musicPlaying = false;
            updateAudioIcon();
        });
    }

    audioToggle.addEventListener('click', function() {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
        } else {
            bgMusic.play();
            musicPlaying = true;
        }
        updateAudioIcon();
    });

    function updateAudioIcon() {
        const playingIcon = document.querySelector('.audio-icon.playing');
        const mutedIcon = document.querySelector('.audio-icon.muted');
        if (musicPlaying) {
            playingIcon.classList.remove('hidden');
            mutedIcon.classList.add('hidden');
        } else {
            playingIcon.classList.add('hidden');
            mutedIcon.classList.remove('hidden');
        }
    }

    // ===== SECTION NAVIGATION =====
    const sections = [
        document.getElementById('welcome-section'),
        document.getElementById('names-section'),
        document.getElementById('scratch-section'),
        document.getElementById('details-section'),
        document.getElementById('countdown-section'),
        document.getElementById('closing-section')
    ];

    function showSection(index) {
        if (index < 0 || index >= totalSections || isTransitioning) return;
        if (sections[index].classList.contains('active')) return; // Already showing
        
        isTransitioning = true;
        currentSection = index;

        // First: hide all other sections
        sections.forEach((section, i) => {
            if (i !== index) {
                section.classList.remove('active');
            }
        });

        // Then: show the target section after a brief delay to avoid flicker
        setTimeout(() => {
            sections[index].classList.add('active');
            triggerSectionAnimations(index);
        }, 50);

        updateNavDots();

        setTimeout(() => {
            isTransitioning = false;
        }, 1200);
    }

    function navigateToSection(direction) {
        const newSection = currentSection + direction;
        if (newSection >= 0 && newSection < totalSections) {
            showSection(newSection);
        }
    }

    // ===== SCROLL / SWIPE HANDLING =====
    let touchStartY = 0;
    let touchEndY = 0;
    let lastScrollTime = 0;

    // Mouse wheel
    document.addEventListener('wheel', function(e) {
        if (!isEnvelopeOpen) return;
        if (isTransitioning) return;
        // Block navigation from scratch section until scratch is revealed
        if (currentSection === 2 && !scratchRevealed) return;
        const now = Date.now();
        if (now - lastScrollTime < 1400) return;
        lastScrollTime = now;

        if (e.deltaY > 0) {
            navigateToSection(1);
        } else {
            navigateToSection(-1);
        }
    }, { passive: true });

    // Touch events
    document.addEventListener('touchstart', function(e) {
        if (!isEnvelopeOpen) return;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (!isEnvelopeOpen) return;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartY - touchEndY;
        const threshold = 60;

        if (Math.abs(diff) < threshold) return;
        if (isTransitioning) return;
        // Block navigation from scratch section until scratch is revealed
        if (currentSection === 2 && !scratchRevealed) return;

        const now = Date.now();
        if (now - lastScrollTime < 1200) return;
        lastScrollTime = now;

        if (diff > 0) {
            navigateToSection(1);
        } else {
            navigateToSection(-1);
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!isEnvelopeOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                openEnvelope();
            }
            return;
        }

        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                navigateToSection(1);
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                navigateToSection(-1);
                break;
        }
    });

    // ===== NAV DOTS =====
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionIndex = parseInt(this.dataset.section);
            showSection(sectionIndex);
        });
    });

    function updateNavDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSection);
        });
    }

    // ===== SECTION ANIMATIONS =====
    function triggerSectionAnimations(sectionIndex) {
        // Sparkle burst on every section change
        const currentSec = sections[sectionIndex];
        if (currentSec) {
            createGlitterShower(currentSec, 20);
        }

        switch(sectionIndex) {
            case 0: // Welcome
                animateWelcome();
                break;
            case 1: // Names
                animateNames();
                break;
            case 2: // Scratch
                initScratchCard();
                break;
            case 3: // Details  
                animateDetails();
                break;
            case 4: // Countdown
                startCountdown();
                animateCountdown();
                break;
            case 5: // Closing
                animateClosing();
                break;
        }
    }

    // Welcome animations
    function animateWelcome() {
        createParticles();
        const welcomeSection = document.getElementById('welcome-section');
        // Continuous subtle sparkle every few seconds
        setTimeout(() => createEmojiBurst(welcomeSection, ['✨', '⭐', '💫'], 8), 1500);
    }

    // Countdown animations
    function animateCountdown() {
        const countdownSection = document.getElementById('countdown-section');
        setTimeout(() => createEmojiBurst(countdownSection, ['💍', '💛', '✨', '⏰'], 10), 600);
        setTimeout(() => createGlitterShower(countdownSection, 25), 1000);
    }

    // Names animations
    function animateNames() {
        const namesSection = document.getElementById('names-section');
        setTimeout(() => {
            document.querySelector('.groom-card').classList.add('visible');
            // Burst on groom name reveal
            createBurst(namesSection, namesSection.offsetWidth * 0.35, namesSection.offsetHeight * 0.3, 15, ['#c9a96e', '#e8d5a3', '#ffd700'], [3, 7], 80);
        }, 300);
        setTimeout(() => {
            document.querySelector('.bride-card').classList.add('visible');
            // Burst on bride name reveal
            createBurst(namesSection, namesSection.offsetWidth * 0.65, namesSection.offsetHeight * 0.7, 15, ['#c17b7b', '#f5e6e0', '#ff69b4'], [3, 7], 80);
        }, 800);
        // Sparkle shower after both names
        setTimeout(() => {
            createGlitterShower(namesSection, 30);
        }, 1200);
    }

    // Details animations
    function animateDetails() {
        const detailsSection = document.getElementById('details-section');
        const cards = document.querySelectorAll('.detail-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
                // Mini burst on each card reveal
                const rect = card.getBoundingClientRect();
                const sectionRect = detailsSection.getBoundingClientRect();
                createBurst(
                    detailsSection,
                    rect.left - sectionRect.left + rect.width / 2,
                    rect.top - sectionRect.top + rect.height / 2,
                    10,
                    ['#c9a96e', '#e8d5a3', '#ffd700'],
                    [3, 6],
                    60
                );
            }, 300 + (i * 300));
        });
        // Grand sparkle after all cards are in
        setTimeout(() => {
            createGlitterShower(detailsSection, 35);
            createEmojiBurst(detailsSection, ['📅', '⏰' , '✨', '💍'], 12);
        }, 1200);
    }

    // Closing animations
    function animateClosing() {
        const closingSection = document.getElementById('closing-section');
        setTimeout(createConfetti, 500);
        // Multiple waves of celebration
        setTimeout(() => createFireworkBurst(closingSection, 35), 800);
        setTimeout(() => createEmojiBurst(closingSection, ['🎉', '💍', '✨', '💕', '🥳', '🎊', '💛', '❤️'], 25), 1200);
        setTimeout(() => createGlitterShower(closingSection, 60), 1500);
        setTimeout(() => createFireworkBurst(closingSection, 25), 2500);
    }

    // ===== PARTICLES =====
    function createParticles() {
        const container = document.getElementById('particles');
        if (container.children.length > 0) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${Math.random() > 0.5 ? 'var(--gold)' : 'var(--gold-light)'};
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: particleFloat ${Math.random() * 4 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }

        // Add particle animation
        if (!document.getElementById('particle-style')) {
            const style = document.createElement('style');
            style.id = 'particle-style';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
                    25% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
                    50% { transform: translateY(-10px) translateX(-5px); opacity: 0.2; }
                    75% { transform: translateY(-25px) translateX(5px); opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== SCRATCH CARD =====
    let scratchInitialized = false;

    function initScratchCard() {
        if (scratchInitialized) return;
        scratchInitialized = true;

        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const scratchCard = document.querySelector('.scratch-card');
        
        // Set canvas size
        const rect = scratchCard.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Create scratch surface with gradient and pattern
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#c9a96e');
        gradient.addColorStop(0.3, '#e8d5a3');
        gradient.addColorStop(0.5, '#c9a96e');
        gradient.addColorStop(0.7, '#b8944d');
        gradient.addColorStop(1, '#c9a96e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add decorative text on scratch surface
        ctx.fillStyle = 'rgba(139, 105, 20, 0.4)';
        ctx.font = '14px Montserrat';
        ctx.textAlign = 'center';
        ctx.fillText('✦ SCRATCH HERE ✦', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '11px Montserrat';
        ctx.fillText('Reveal the details', canvas.width / 2, canvas.height / 2 + 15);

        // Add decorative pattern
        ctx.strokeStyle = 'rgba(139, 105, 20, 0.2)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Add border
        ctx.strokeStyle = 'rgba(139, 105, 20, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Scratch functionality
        let isScratching = false;

        ctx.globalCompositeOperation = 'destination-out';

        function scratch(x, y) {
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();

            // Add some randomness for natural feel
            for (let i = 0; i < 5; i++) {
                const randomX = x + (Math.random() - 0.5) * 40;
                const randomY = y + (Math.random() - 0.5) * 40;
                ctx.beginPath();
                ctx.arc(randomX, randomY, 18, 0, Math.PI * 2);
                ctx.fill();
            }

            checkScratchProgress();
        }

        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            return { x, y };
        }

        // Mouse events
        canvas.addEventListener('mousedown', function(e) {
            isScratching = true;
            const pos = getPosition(e);
            scratch(pos.x, pos.y);
        });

        canvas.addEventListener('mousemove', function(e) {
            if (!isScratching) return;
            const pos = getPosition(e);
            scratch(pos.x, pos.y);
        });

        canvas.addEventListener('mouseup', () => isScratching = false);
        canvas.addEventListener('mouseleave', () => isScratching = false);

        // Touch events
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            isScratching = true;
            const pos = getPosition(e);
            scratch(pos.x, pos.y);
        });

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!isScratching) return;
            const pos = getPosition(e);
            scratch(pos.x, pos.y);
        });

        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            isScratching = false;
        });
    }

    function checkScratchProgress() {
        if (scratchRevealed) return;

        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparent++;
        }

        scratchPercentage = (transparent / total) * 100;

        const hint = document.getElementById('scratch-hint');
        
        if (scratchPercentage > 15) {
            hint.textContent = '✨ Almost there... ✨';
        }

        // Like GPay: once ~25% scratched, auto-clear the entire card
        if (scratchPercentage > 25) {
            scratchRevealed = true;
            hint.classList.add('hidden');
            
            // Animate erasing remaining scratch layer (expanding circles from center)
            animateFullReveal(canvas, ctx);
        }
    }

    // GPay-style full reveal animation
    function animateFullReveal(canvas, ctx) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        let currentRadius = 0;
        const speed = maxRadius / 20; // Complete in ~20 frames

        ctx.globalCompositeOperation = 'destination-out';

        function eraseFrame() {
            currentRadius += speed;
            ctx.beginPath();
            ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            if (currentRadius < maxRadius) {
                requestAnimationFrame(eraseFrame);
            } else {
                // Fully erased — now fade out canvas cleanly
                canvas.style.transition = 'opacity 0.4s ease';
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.style.display = 'none';
                    // CELEBRATION BURST!
                    const scratchSection = document.getElementById('scratch-section');
                    createFireworkBurst(scratchSection, 35);
                    createEmojiBurst(scratchSection, ['\uD83C\uDF89', '\uD83D\uDC8D', '\u2728', '\uD83C\uDF8A', '\uD83D\uDC95', '\uD83E\uDD73', '\u2764\uFE0F'], 25);
                    createGlitterShower(scratchSection, 50);
                    setTimeout(() => createFireworkBurst(scratchSection, 20), 600);
                    setTimeout(() => createEmojiBurst(scratchSection, ['\uD83D\uDC9B', '\u2728', '\uD83C\uDF8A', '\uD83D\uDC8D'], 15), 1000);

                    // Show "scroll to continue" hint after celebrations
                    setTimeout(() => {
                        const scrollHint = document.createElement('p');
                        scrollHint.textContent = 'Swipe up to continue';
                        scrollHint.style.cssText = `
                            position: absolute;
                            bottom: 30px;
                            font-family: var(--font-sans);
                            font-weight: 200;
                            font-size: 0.7rem;
                            letter-spacing: 3px;
                            text-transform: uppercase;
                            color: var(--gold-light);
                            opacity: 0;
                            animation: fadeInUp 0.8s ease forwards;
                        `;
                        scratchSection.appendChild(scrollHint);
                    }, 2000);
                }, 400);
            }
        }

        requestAnimationFrame(eraseFrame);
    }

    // ===== COUNTDOWN TIMER =====
    let countdownInterval;

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateCountdown() {
        const engagementDate = new Date('July 2, 2026 12:00:00').getTime();
        const now = new Date().getTime();
        const diff = engagementDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // ===== CELEBRATION BURST EFFECTS =====

    // Generic burst: creates a radial explosion of particles from a point
    function createBurst(container, x, y, count, colors, sizeRange, spread) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const distance = Math.random() * spread + spread * 0.3;
            const duration = Math.random() * 1 + 1;

            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 9999;
                animation: burstParticle ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                --tx: ${Math.cos(angle) * distance}px;
                --ty: ${Math.sin(angle) * distance}px;
                --rot: ${Math.random() * 720 - 360}deg;
            `;
            container.appendChild(particle);
            setTimeout(() => particle.remove(), duration * 1000);
        }
    }

    // Firework sparkle burst at a given section
    function createFireworkBurst(section, count) {
        const rect = section.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const colors = ['#c9a96e', '#e8d5a3', '#c17b7b', '#f5e6e0', '#ff6b6b', '#ffd700', '#ffffff'];

        // Create multiple bursts at different positions
        for (let b = 0; b < 3; b++) {
            const bx = centerX + (Math.random() - 0.5) * rect.width * 0.6;
            const by = centerY + (Math.random() - 0.5) * rect.height * 0.4;
            setTimeout(() => {
                createBurst(section, bx, by, count || 25, colors, [4, 10], 150);
            }, b * 300);
        }
    }

    // Emoji burst (hearts, stars, sparkles)
    function createEmojiBurst(container, emojis, count) {
        const rect = container.getBoundingClientRect();
        for (let i = 0; i < count; i++) {
            const emoji = document.createElement('div');
            const symbol = emojis[Math.floor(Math.random() * emojis.length)];
            const startX = Math.random() * rect.width;
            const startY = rect.height + 20;
            const duration = Math.random() * 2 + 2;
            const drift = (Math.random() - 0.5) * 100;

            emoji.textContent = symbol;
            emoji.style.cssText = `
                position: absolute;
                left: ${startX}px;
                top: ${startY}px;
                font-size: ${Math.random() * 16 + 14}px;
                pointer-events: none;
                z-index: 9999;
                animation: emojiRise ${duration}s ease-out forwards;
                --drift: ${drift}px;
                opacity: 1;
            `;
            container.appendChild(emoji);
            setTimeout(() => emoji.remove(), duration * 1000);
        }
    }

    // Glitter shower effect
    function createGlitterShower(container, count) {
        const rect = container.getBoundingClientRect();
        const colors = ['#c9a96e', '#e8d5a3', '#ffd700', '#ffffff', '#ffec8b'];
        for (let i = 0; i < count; i++) {
            const glitter = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 5 + 2;
            const startX = Math.random() * rect.width;
            const duration = Math.random() * 2 + 1.5;
            const delay = Math.random() * 1.5;

            glitter.style.cssText = `
                position: absolute;
                left: ${startX}px;
                top: -10px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                animation: glitterFall ${duration}s ease-in ${delay}s forwards;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            container.appendChild(glitter);
            setTimeout(() => glitter.remove(), (duration + delay) * 1000);
        }
    }

    // ===== CONFETTI =====
    function createConfetti(targetContainer) {
        const container = targetContainer || document.getElementById('confetti');
        if (!targetContainer && container.children.length > 0) return;

        const colors = ['#c9a96e', '#e8d5a3', '#c17b7b', '#f5e6e0', '#6b1d3a', '#ffffff', '#ff6b6b', '#ffd700', '#ff69b4'];
        const shapes = ['circle', 'square', 'triangle'];

        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            let borderRadius = '0';
            let clipPath = 'none';
            
            if (shape === 'circle') {
                borderRadius = '50%';
            } else if (shape === 'triangle') {
                clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            }
            
            piece.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${color};
                border-radius: ${borderRadius};
                clip-path: ${clipPath};
                width: ${Math.random() * 10 + 4}px;
                height: ${Math.random() * 10 + 4}px;
                animation-delay: ${Math.random() * 2}s;
                animation-duration: ${Math.random() * 2 + 2.5}s;
            `;
            
            container.appendChild(piece);
        }

        // Also fire emoji burst and glitter
        createEmojiBurst(container, ['✨', '💍', '💛', '🎊', '🎉', '💕'], 15);
        createGlitterShower(container, 40);
    }

    // ===== PREVENT SCROLL ON SCRATCH SECTION =====
    document.getElementById('scratch-canvas')?.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: false });

    // ===== INJECT CELEBRATION CSS ANIMATIONS =====
    (function injectCelebrationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes burstParticle {
                0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0); opacity: 0; }
            }
            @keyframes emojiRise {
                0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 1; }
                50% { transform: translateY(-50vh) translateX(var(--drift)) scale(1.2); opacity: 0.8; }
                100% { transform: translateY(-100vh) translateX(calc(var(--drift) * 1.5)) scale(0.3); opacity: 0; }
            }
            @keyframes glitterFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    })();

    // ===== INITIALIZE =====
    // Start countdown immediately (for when section becomes visible)
    startCountdown();

})();
