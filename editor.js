// Tab switching functionality (Keep this part as it is)
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codeBlocks = document.querySelectorAll('.code-block');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            codeBlocks.forEach(block => block.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Format toggle functionality (Keep or adapt if you want to simulate PDF vs Image locally)
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // If you keep this, generatePreview might change its local rendering style
        });
    });
    
    // Smooth scrolling for navigation links (Keep this part)
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

    // NEW: Element selectors for our HTML/CSS inputs and the preview iframe
    const htmlInputEl = document.getElementById('html-input');
    const cssInputEl = document.getElementById('css-input');
    const previewIframeEl = document.getElementById('preview-frame-element'); // Corrected ID

    // NEW: The real generatePreview function
    window.generatePreview = function() { // Make it global if called by onclick
        if (!htmlInputEl || !cssInputEl || !previewIframeEl) {
            console.error("One or more editor elements not found!");
            return;
        }

        const htmlContent = htmlInputEl.value;
        const cssContent = cssInputEl.value;
        // For this client-side preview, we won't execute arbitrary JS from a textarea
        // unless you specifically add a JS input and are comfortable with sandboxing.

        const iframeDoc = previewIframeEl.contentDocument || previewIframeEl.contentWindow.document;

        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Live Preview</title>
                <style>
                    body { margin: 0; /* Common reset for iframe body */ }
                    ${cssContent}
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(fullHtml);
        iframeDoc.close();

        // Optionally re-enable download buttons if they were for a client-side generated preview
        // For backend API calls, you'd enable them after the API responds.
        // const downloadBtns = document.querySelectorAll('.download-btn');
        // downloadBtns.forEach(btn => btn.disabled = false);
    }

    // Optional: Set some default content and run preview on load
    if (htmlInputEl && cssInputEl) {
        htmlInputEl.value = `<h1>Hello from pdfy.cloud!</h1>
<p>This is a live preview.</p>
<button class="my-button">Click Me</button>`;
        
        cssInputEl.value = `body { 
    font-family: Arial, sans-serif; 
    padding: 20px; 
    background-color: #f0f0f0; 
    color: #333;
}
h1 { 
    color: #10b981; 
}
.my-button {
    background-color: #10b981;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.my-button:hover {
    background-color: #059669;
}`;
        generatePreview(); // Generate initial preview
    }

    // Add event listener to the "Generate Preview" button if it exists and isn't using onclick
    const generateBtn = document.querySelector('.generate-btn');
    if (generateBtn && !generateBtn.hasAttribute('onclick')) {
        generateBtn.addEventListener('click', generatePreview);
    }

});

// Interactive animations (Keep this part as it is)
document.addEventListener('DOMContentLoaded', function() {
    // ... (your existing IntersectionObserver code) ...
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
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});