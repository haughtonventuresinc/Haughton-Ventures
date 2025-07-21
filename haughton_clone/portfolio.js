import BASE_URL from './base_url.js';

// Load portfolio data from backend
async function loadPortfolioData() {
    try {
        const response = await fetch(BASE_URL + '/api/portfolio-data');
        const result = await response.json();
        
        if (result.success && result.data && result.data.portfolioItems) {
            console.log('[PORTFOLIO] Portfolio data loaded successfully');
            renderPortfolioItems(result.data.portfolioItems);
            // Initialize Webflow interactions after content is loaded
            initializePortfolioInteractions();
        } else {
            console.warn('[PORTFOLIO] Failed to load portfolio data:', result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('[PORTFOLIO] Error loading portfolio data:', error);
        // Fallback to existing hardcoded content
    }
}

// Render portfolio items dynamically
function renderPortfolioItems(portfolioData) {
    const container = document.querySelector('.w-dyn-items');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    portfolioData.forEach(item => {
        const portfolioItem = createPortfolioItem(item);
        container.appendChild(portfolioItem);
    });
}

// Create individual portfolio item HTML
function createPortfolioItem(item) {
    const div = document.createElement('div');
    div.setAttribute('role', 'listitem');
    div.className = 'portfolio-item w-dyn-item';
    
    div.innerHTML = `
        <a href="#" class="portfolio-link-grid w-inline-block">
            <h2 id="w-node-_723a4fb5-0479-6ea6-9229-04ed35322407-f4a50b40" class="heading h5">${item.company}</h2>
            <p id="w-node-_470969b2-a9f4-16ab-2834-ccc3ef63bc31-f4a50b40" class="paragraph tight">${item.intro}</p>
            <p class="paragraph">${item.industry}</p>
            <p class="paragraph">${item.stage}</p>
            <p class="paragraph">${item.founded}</p>
        </a>
        <div class="portfolio-item-pop-out" style="display: none; opacity: 0; visibility: hidden; transform: translateX(100%); transition: all 0.3s ease;">
            <a href="#" class="close-pop-up-icon w-inline-block">
                <img src="../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50ae3_Cross%20Icon.svg" loading="lazy" width="20" alt="" />
            </a>
            <h3 class="heading h2">${item.company}</h3>
            <div class="portfolio-info-list-white">
                <div class="portfolio-info-block-white">
                    <div class="portfolio-info-block-title-white">Industry</div>
                    <p class="paragraph small-margin">${item.industry}</p>
                </div>
                <div class="portfolio-info-block-white">
                    <div class="portfolio-info-block-title-white">Stage</div>
                    <p class="paragraph small-margin">${item.stage}</p>
                </div>
                <div class="portfolio-info-block-white">
                    <div class="portfolio-info-block-title-white">Founded</div>
                    <p class="paragraph small-margin">${item.founded}</p>
                </div>
            </div>
            <p class="paragraph tight">${item.description}</p>
        </div>
    `;
    
    return div;
}

// Initialize portfolio interactions (popup modals and hover effects)
function initializePortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add hover effects for opacity changes
    portfolioItems.forEach(item => {
        const link = item.querySelector('.portfolio-link-grid');
        
        // Mouse enter - fade other items
        link.addEventListener('mouseenter', function() {
            portfolioItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.style.opacity = '0.4';
                    otherItem.style.transition = 'opacity 0.3s ease';
                }
            });
        });
        
        // Mouse leave - restore all items
        link.addEventListener('mouseleave', function() {
            portfolioItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
            });
        });
    });
    
    // Add click handlers for portfolio items to show popup
    document.querySelectorAll('.portfolio-link-grid').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const portfolioItem = this.closest('.portfolio-item');
            const popup = portfolioItem.querySelector('.portfolio-item-pop-out');
            if (popup) {
                popup.style.display = 'block';
                popup.style.visibility = 'visible';
                // Trigger reflow
                popup.offsetHeight;
                // Slide in from right
                popup.style.opacity = '1';
                popup.style.transform = 'translateX(0%)';
                popup.classList.add('show');
                // Allow scrolling when popup is active
            }
        });
    });

    // Add click handlers for close buttons
    document.querySelectorAll('.close-pop-up-icon').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close ALL open popups
            const allPopups = document.querySelectorAll('.portfolio-item-pop-out.show');
            allPopups.forEach(popup => {
                // Slide out to right
                popup.style.opacity = '0';
                popup.style.transform = 'translateX(100%)';
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.style.display = 'none';
                    popup.style.visibility = 'hidden';
                }, 300); // Match CSS transition duration
            });
            // Keep scrolling enabled
        });
    });

    // Close popup when clicking outside
    document.querySelectorAll('.portfolio-item-pop-out').forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                const closeBtn = this.querySelector('.close-pop-up-icon');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        });
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const visiblePopup = document.querySelector('.portfolio-item-pop-out.show');
            if (visiblePopup) {
                const closeBtn = visiblePopup.querySelector('.close-pop-up-icon');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }
    });

    // Reinitialize Webflow if available
    if (window.Webflow) {
        window.Webflow.destroy();
        window.Webflow.ready();
        window.Webflow.require('ix2').init();
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolioData);

