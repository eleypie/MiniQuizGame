// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats counting
    // const statNumbers = document.querySelectorAll('.stat-number');
    
    // statNumbers.forEach(stat => {
    //     const target = parseInt(stat.getAttribute('data-count'));
    //     const duration = 2000;
    //     const step = target / (duration / 16);
    //     let current = 0;
        
    //     const updateCount = () => {
    //         current += step;
    //         if (current < target) {
    //             stat.textContent = Math.floor(current);
    //             requestAnimationFrame(updateCount);
    //         } else {
    //             stat.textContent = target;
    //         }
    //     };
        
    //     // Start animation when element is in viewport
    //     const observer = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting) {
    //             updateCount();
    //             observer.unobserve(stat);
    //         }
    //     });
        
    //     observer.observe(stat);
    // });

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