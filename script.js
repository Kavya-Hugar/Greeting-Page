class GreetingApp {
    constructor() {
        this.nameInput = document.getElementById('nameInput');
        this.greetBtn = document.getElementById('greetBtn');
        this.greetingMessage = document.getElementById('greetingMessage');
        this.confettiContainer = document.getElementById('confettiContainer');
        this.partyPopperContainer = document.getElementById('partyPopperContainer');
        this.glowingBurstContainer = document.getElementById('glowingBurstContainer');
        
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4', '#00CED1'];
        this.animationInProgress = false;
        
        this.init();
    }
    
    init() {
        this.greetBtn.addEventListener('click', () => this.handleGreet());
        this.nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGreet();
            }
        });
    }
    
    handleGreet() {
        const name = this.nameInput.value.trim();
        
        if (!name) {
            this.shakeInput();
            return;
        }
        
        this.displayGreeting(name);
        this.triggerRandomAnimation();
    }
    
    shakeInput() {
        this.nameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.nameInput.style.animation = '';
        }, 500);
    }
    
    displayGreeting(name) {
        // Reset the animation by removing the show class
        this.greetingMessage.classList.remove('show');
        
        // Brief delay to ensure the animation resets
        setTimeout(() => {
            // Update the text content with the new name
            this.greetingMessage.textContent = `Hello ${name}!`;
            
            // Add the show class to trigger the animation
            this.greetingMessage.classList.add('show');
        }, 50);
    }
    
    clearAnimations() {
        this.confettiContainer.innerHTML = '';
        this.partyPopperContainer.innerHTML = '';
        this.glowingBurstContainer.innerHTML = '';
    }
    
    triggerRandomAnimation() {
        // If animation is already in progress, ignore new requests
        if (this.animationInProgress) {
            return;
        }
        
        // Set flag to prevent multiple animations
        this.animationInProgress = true;
        
        // Clear any existing animations first
        this.clearAnimations();
        
        // Use crypto-based random for better unpredictability
        let randomValue;
        try {
            randomValue = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
        } catch (error) {
            // Fallback to Math.random if crypto is not available
            console.warn('Crypto API not available, falling back to Math.random()');
            randomValue = Math.random();
        }
        
        const animationIndex = Math.floor(randomValue * 3);
        
        const animations = [
            () => this.createConfetti(),
            () => this.createPartyPopper(),
            () => this.createGlowingBurst()
        ];
        
        // Execute the selected animation
        try {
            animations[animationIndex]();
        } catch (error) {
            console.error('Error executing animation:', error);
            this.animationInProgress = false;
            return;
        }
        
        // Reset flag after animation completes (varies by animation type)
        const animationDurations = [4000, 1500, 1000]; // confetti, party popper, glowing burst
        setTimeout(() => {
            this.animationInProgress = false;
        }, animationDurations[animationIndex]);
    }
    
    createConfetti() {
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                this.confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 4000);
            }, i * 30);
        }
    }
    
    createPartyPopper() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'party-particle';
            particle.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 200 + 100;
            const deltaX = Math.cos(angle) * velocity;
            const deltaY = Math.sin(angle) * velocity;
            
            // Use direct transform instead of dynamic keyframes for better compatibility
            particle.style.animation = 'party-burst 1.5s ease-out forwards';
            particle.style.setProperty('--deltaX', deltaX + 'px');
            particle.style.setProperty('--deltaY', deltaY + 'px');
            
            try {
                // Try to add dynamic keyframes
                const styleSheet = document.styleSheets[0];
                const keyframes = `
                    @keyframes party-burst-${i} {
                        0% {
                            transform: translate(0, 0) scale(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translate(${deltaX}px, ${deltaY}px) scale(1);
                            opacity: 0;
                        }
                    }
                `;
                
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
                particle.style.animation = `party-burst-${i} 1.5s ease-out forwards`;
            } catch (e) {
                // Fallback to CSS custom properties if dynamic keyframes fail
                particle.style.animation = 'none';
                particle.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1)`;
                particle.style.opacity = '0';
                particle.style.transition = 'all 1.5s ease-out';
            }
            
            this.partyPopperContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1500);
        }
    }
    
    createGlowingBurst() {
        const burstCount = 5;
        
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.className = 'glow-burst';
                
                const size = Math.random() * 100 + 50;
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                burst.style.width = size + 'px';
                burst.style.height = size + 'px';
                burst.style.left = x + 'px';
                burst.style.top = y + 'px';
                
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                burst.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
                burst.style.boxShadow = `0 0 ${size/2}px ${color}`;
                
                this.glowingBurstContainer.appendChild(burst);
                
                setTimeout(() => {
                    if (burst.parentNode) {
                        burst.remove();
                    }
                }, 1000);
            }, i * 200);
        }
    }
}

// Add shake animation to styles
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GreetingApp();
});
