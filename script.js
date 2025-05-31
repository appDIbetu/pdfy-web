// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codeBlocks = document.querySelectorAll('.code-block');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Remove active class from all tabs and code blocks
            tabBtns.forEach(b => b.classList.remove('active'));
            codeBlocks.forEach(block => block.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding code block
            btn.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Format toggle functionality
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Generate preview functionality
function generatePreview() {
    const previewFrame = document.getElementById('preview-frame');
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    // Show loading state
    previewFrame.innerHTML = `
        <div class="preview-placeholder">
            <div class="placeholder-icon">⏳</div>
            <p>Generating preview...</p>
        </div>
    `;
    
    // Simulate API call with timeout
    setTimeout(() => {
        const activeFormat = document.querySelector('.format-btn.active').dataset.format;
        
        if (activeFormat === 'image') {
            previewFrame.innerHTML = `
                <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h1 style="color: #1f2937; margin-bottom: 10px;">Hello World</h1>
                    <p style="color: #6b7280;">Generated with pdfy API</p>
                </div>
            `;
        } else {
            previewFrame.innerHTML = `
                <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); width: 100%; max-width: 300px;">
                    <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">
                        <h2 style="color: #1f2937; font-size: 18px;">PDF Document</h2>
                    </div>
                    <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">Hello World</h1>
                    <p style="color: #6b7280; line-height: 1.5;">Generated with pdfy API</p>
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                        Page 1 of 1
                    </div>
                </div>
            `;
        }
        
        // Enable download buttons
        downloadBtns.forEach(btn => {
            btn.disabled = false;
            btn.addEventListener('click', () => {
                alert('In a real implementation, this would download the generated file.');
            });
        });
    }, 2000);
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});