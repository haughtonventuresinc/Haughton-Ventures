import BASE_URL from './base_url.js';

// Load contact data from backend
async function loadContactData() {
    try {
        const response = await fetch(BASE_URL + '/api/contact-data');
        const result = await response.json();
        
        if (result.success && result.data) {
            const data = result.data;
            
            // Update hero section
            document.getElementById('heroTitle').textContent = data.heroTitle;
            document.getElementById('heroSubtitle').textContent = data.heroSubtitle;
            
            // Update hero image
            if (data.heroImage) {
                const heroImg = document.getElementById('heroImage');
                heroImg.src = data.heroImage;
                heroImg.srcset = data.heroImage;
            }
            
            // Update contact section
            document.getElementById('sectionTitle').textContent = data.sectionTitle;
            document.getElementById('contactDescription').textContent = data.contactDescription;
            document.getElementById('emailLabel').textContent = data.emailLabel;
            
            // Update contact email
            const emailLink = document.getElementById('contactEmail');
            emailLink.href = 'mailto:' + data.contactEmail;
            emailLink.textContent = data.contactEmail;
            
            console.log('[CONTACT] Contact data loaded successfully');
        } else {
            console.warn('[CONTACT] Failed to load contact data:', result.error);
        }
    } catch (error) {
        console.error('[CONTACT] Error loading contact data:', error);
        // Fallback to default content (already in HTML)
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadContactData);
