// Dynamic Portfolio Loader & Pop-out Handler
// Assumes insights-data.json is in the same directory as portfolio.html
// and that .portfolio-header-grid and .w-dyn-items exist in the DOM

const insightsDataUrl = 'insights-data.json';

function createPortfolioItem(insight) {
    // Create the portfolio item node (matching grid structure)
    const item = document.createElement('div');
    item.className = 'portfolio-item w-dyn-item';
    item.innerHTML = `
      <a href="#" class="portfolio-link-grid w-inline-block">
        <h2 class="heading h5">${insight.title}</h2>
        <p class="paragraph tight">${insight.excerpt}</p>
        <p class="paragraph">${insight.category}</p>
        <p class="paragraph">${insight.stage || ''}</p>
        <p class="paragraph">${insight.date}</p>
      </a>
    `;
    // Attach click handler for pop-out
    item.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        showPortfolioPopout(insight);
    });
    return item;
}

function showPortfolioPopout(insight) {
    // Remove existing popout if any
    let popout = document.getElementById('portfolio-popout');
    if (popout) popout.remove();
    // Create popout div
    popout = document.createElement('div');
    popout.id = 'portfolio-popout';
    popout.className = 'portfolio-item-pop-out';
    popout.style.display = 'block';
    popout.style.transform = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)';
    popout.style.transformStyle = 'preserve-3d';
    popout.style.opacity = '0';
    popout.style.transition = 'opacity 0.3s, transform 0.3s';
    popout.innerHTML = `
      <a href="#" class="close-pop-up-icon w-inline-block"><img src="../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50ae3_Cross%20Icon.svg" loading="lazy" width="20" alt=""></a>
      <h3 class="heading h2">${insight.title}</h3>
      <div class="portfolio-info-list-white">
        <div class="portfolio-info-block-white">
          <div class="portfolio-info-block-title-white">Industry</div>
          <p class="paragraph small-margin">${insight.category}</p>
        </div>
        <div class="portfolio-info-block-white">
          <div class="portfolio-info-block-title-white">Stage</div>
          <p class="paragraph small-margin">${insight.stage || ''}</p>
        </div>
        <div class="portfolio-info-block-white">
          <div class="portfolio-info-block-title-white">Founded</div>
          <p class="paragraph small-margin">${insight.date}</p>
        </div>
      </div>
      <p class="paragraph tight">${insight.excerpt}</p>
    `;
    // Append to body
    document.body.appendChild(popout);
    // Animate in
    setTimeout(() => {
        popout.style.opacity = '1';
        popout.style.transform = 'none';
    }, 10);
    // Close handler
    popout.querySelector('.close-pop-up-icon').addEventListener('click', function(e) {
        e.preventDefault();
        // Animate out
        popout.style.opacity = '0';
        popout.style.transform = 'scale3d(0.95,0.95,1)';
        setTimeout(() => popout.remove(), 300);
    });
}

function loadPortfolioItems() {
    fetch(insightsDataUrl)
        .then(r => r.json())
        .then(data => {
            const container = document.querySelector('.w-dyn-items');
            if (!container) return;
            // Remove all existing dynamic items (except template or static)
            container.querySelectorAll('.portfolio-item.w-dyn-item').forEach(e => e.remove());
            data.forEach(insight => {
                container.appendChild(createPortfolioItem(insight));
            });
        });
}

document.addEventListener('DOMContentLoaded', loadPortfolioItems);
