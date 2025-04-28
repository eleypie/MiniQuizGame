// script.js
document.addEventListener('DOMContentLoaded', function() {

    // Create floating particles
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 20 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 + 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        particlesContainer.appendChild(particle);
    }

    // Add hover effect to topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const hoverEffect = card.querySelector('.card-hover');
            hoverEffect.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            const hoverEffect = card.querySelector('.card-hover');
            hoverEffect.style.opacity = '0';
        });
    });

    // Topic selection
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function() {
            const selectedSet = this.getAttribute('data-set');
            localStorage.setItem('selectedQuizSet', selectedSet);
            window.location.href = "quiz.html";
        });
    });
    
});