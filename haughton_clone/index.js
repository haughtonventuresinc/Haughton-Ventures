import BASE_URL from "./base_url.js";

document.addEventListener('DOMContentLoaded', function() {
  // Key used in dashboard for home content
  const HOME_CONTENT_KEY = 'dashboard_home_content';
  const homeHeroTitle = document.getElementById('homeHeroTitle');
  
  // Load saved content
  const savedContent = localStorage.getItem(HOME_CONTENT_KEY);
  if (savedContent && homeHeroTitle) {
    homeHeroTitle.innerHTML = savedContent;
  }
  
  // Load Hero data
  loadHeroData();

  // Load random insights
  loadRandomInsights();
  
  // Load services data
  loadServicesData();
  
  // Load philosophy data
  loadPhilosophyData();
  
  // Load values data
  loadValuesData();
  
  // Load about data
  loadAboutData();
  
  
  // Function to fetch and display 3 random insights
  async function loadRandomInsights() {
    try {
      const response = await fetch(`${BASE_URL}/api/insights-data`);
      const insights = await response.json();
      
      if (insights && insights.length > 0) {
        // Get 3 random insights
        const randomInsights = getRandomItems(insights, 3);
        populateInsightsGrid(randomInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }
  
  // Function to get random items from array
  function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Function to populate the insights grid
  function populateInsightsGrid(insights) {
    const insightsGrid = document.querySelector('.insights-grid.w-dyn-items');
    if (!insightsGrid) return;
    
    // Clear existing content
    insightsGrid.innerHTML = '';
    
    insights.forEach(insight => {
      const insightItem = createInsightItem(insight);
      insightsGrid.appendChild(insightItem);
    });
  }
  
  // Function to create insight item HTML
  function createInsightItem(insight) {
    const item = document.createElement('div');
    item.className = 'insights-item w-dyn-item';
    item.setAttribute('role', 'listitem');
    
    // Handle image URL - add BASE_URL if it's a relative path
    let imageUrl = insight.image;
    if (imageUrl && imageUrl.startsWith('uploads/')) {
      imageUrl = `${BASE_URL}/${imageUrl}`;
    }
    
    // Format date
    const formattedDate = new Date(insight.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    item.innerHTML = `
      <a href="${insight.link}" class="insight-link-block w-inline-block">
        <div class="insight-thumbnail">
          <div class="insight-category-tag">${insight.category}</div>
          <img alt="${insight.title}" loading="lazy" width="808"
               src="${imageUrl}"
               sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 808px"
               class="insight-cover-image" />
        </div>
        <div class="insights-text-box">
          <div class="post-date">${formattedDate}</div>
          <h3 class="paragraph x-large">${insight.title}</h3>
          <p class="paragraph medium grey">${insight.excerpt}</p>
          <div class="post-arrow-link">Read now</div>
        </div>
      </a>
    `;
    
    return item;
  }
  
  // Function to load and populate services data
  async function loadServicesData() {
    try {
      const response = await fetch(`${BASE_URL}/api/homepage`);
      const data = await response.json();
      
      if (data.services) {
        console.log('Services data loaded:', data.services);
        populateServicesSection(data.services);
      } else {
        console.log('No services data found in response:', data);
      }
    } catch (error) {
      console.error('Error loading services data:', error);
    }
  }
  
  // Function to populate the services section
  function populateServicesSection(services) {
    // Update the heading and description
    const headingElement = document.querySelector('.section.black .text-box._450px .heading.h2');
    const descriptionElement = document.querySelector('.section.black .text-box._450px .paragraph');
    
    if (headingElement) {
      headingElement.textContent = services.heading;
    }
    if (descriptionElement) {
      descriptionElement.textContent = services.description;
    }
    
    // Update the question containers with service items
    const questionContainers = document.querySelectorAll('.section.black .question-container.dark');
    
    services.items.forEach((service, index) => {
      if (questionContainers[index]) {
        const container = questionContainers[index];
        
        // Update the question title
        const titleElement = container.querySelector('.question-header .heading.h5');
        if (titleElement) {
          titleElement.textContent = service.title;
        }
        
        // Update the answer description
        const answerElement = container.querySelector('.question-answer .paragraph');
        if (answerElement) {
          answerElement.textContent = service.description;
        }
        
        // Update the icon if needed
        const iconElement = container.querySelector('.question-plus-icon');
        if (iconElement && service.icon) {
          iconElement.src = service.icon;
        }
      }
    });
  }
  
  // Function to load and populate philosophy data
  async function loadPhilosophyData() {
    try {
      const response = await fetch(`${BASE_URL}/api/homepage`);
      const data = await response.json();
      
      if (data.philosophy) {
        console.log('Philosophy data loaded:', data.philosophy);
        populatePhilosophySection(data.philosophy);
      } else {
        console.log('No philosophy data found in response:', data);
      }
    } catch (error) {
      console.error('Error loading philosophy data:', error);
    }
  }
  
  // Function to populate the philosophy section
  function populatePhilosophySection(philosophy) {
    // Update the heading
    const headingElement = document.getElementById('philosophy-heading');
    if (headingElement) {
      headingElement.textContent = philosophy.heading;
    }
    
    // Update the description
    const descriptionElement = document.getElementById('philosophy-description');
    if (descriptionElement) {
      descriptionElement.textContent = philosophy.description;
    }
    
    // Update the button text and link
    const buttonElement = document.getElementById('philosophy-button');
    if (buttonElement) {
      buttonElement.textContent = philosophy.buttonText;
      buttonElement.href = philosophy.buttonLink;
    }
    
    // Update the image
    const imageElement = document.getElementById('philosophy-image');
    if (imageElement && philosophy.image) {
      imageElement.src = philosophy.image.src;
      imageElement.alt = philosophy.image.alt;
      imageElement.sizes = philosophy.image.sizes;
      imageElement.srcset = philosophy.image.srcset;
      imageElement.className = philosophy.image.class;
    }
  }
  
  // Function to load and populate values data
  async function loadValuesData() {
    try {
      const response = await fetch(`${BASE_URL}/api/homepage`);
      const data = await response.json();
      
      if (data.values) {
        console.log('Values data loaded:', data.values);
        populateValuesSection(data.values);
      } else {
        console.log('No values data found in response:', data);
      }
    } catch (error) {
      console.error('Error loading values data:', error);
    }
  }

  // Function to populate the values section
  function populateValuesSection(values) {
    // Update the main heading
    const headingElement = document.querySelector('.grey-card .heading.h2');
    if (headingElement) {
      headingElement.textContent = values.heading;
    }

    // Get all the value items in the 4-grid
    const valueBoxes = document.querySelectorAll('._4-grid .text-box._450px');
    
    if (values.items && valueBoxes.length >= values.items.length) {
      values.items.forEach((item, index) => {
        const box = valueBoxes[index];
        if (box) {
          // Update the number (already in HTML as {01}, {02}, etc.)
          const numberElement = box.querySelector('.paragraph:first-child');
          if (numberElement) {
            numberElement.textContent = item.number;
          }
          
          // Update the title
          const titleElement = box.querySelector('.heading.h4');
          if (titleElement) {
            titleElement.textContent = item.title;
          }
          
          // Update the description
          const descriptionElement = box.querySelector('.paragraph.medium');
          if (descriptionElement) {
            descriptionElement.textContent = item.description;
          }
        }
      });
    }
  }

  // Function to load and populate about data
  async function loadAboutData() {
    try {
      const response = await fetch(`${BASE_URL}/api/homepage`);
      const data = await response.json();
      
      if (data.about) {
        console.log('About data loaded:', data.about);
        populateAboutSection(data.about);
      } else {
        console.log('No about data found in response:', data);
      }
    } catch (error) {
      console.error('Error loading about data:', error);
    }
  }

  // Function to populate the about section
  function populateAboutSection(about) {
    // Update the section intro text
    const sectionIntroText = document.querySelector('.section.blue .section-intro-text');
    if (sectionIntroText) {
      sectionIntroText.textContent = about.title;
    }

    // Update the main heading
    const headingElement = document.querySelector('.section.blue .heading.h1');
    if (headingElement) {
      headingElement.innerHTML = about.heading.replace(/\\n/g, '<br>');
    }

    // Update the corner image
    const cornerImage = document.querySelector('.section.blue .top-right-corner-block');
    if (cornerImage && about.cornerImage) {
      cornerImage.src = about.cornerImage.src;
      cornerImage.alt = about.cornerImage.alt;
    }

    // Update the sections content
    if (about.sections) {
      // First section (in right column of first grid)
      const firstSection = document.querySelector('.section.blue .large-2-column-grid.bottom-align .text-box._500px');
      if (firstSection && about.sections[0]) {
        const numberElement = firstSection.querySelector('.paragraph:first-child');
        const descriptionElement = firstSection.querySelector('.paragraph:last-child');
        
        if (numberElement) numberElement.textContent = about.sections[0].number;
        if (descriptionElement) descriptionElement.textContent = about.sections[0].description;
      }

      // Second and third sections (in left column of second grid)
      const secondGrid = document.querySelector('.section.blue .large-2-column-grid:not(.bottom-align)');
      if (secondGrid) {
        const textBox = secondGrid.querySelector('.text-box._450px');
        if (textBox) {
          const paragraphs = textBox.querySelectorAll('.paragraph');
          
          // Second section
          if (paragraphs[0] && about.sections[1]) {
            paragraphs[0].textContent = about.sections[1].number;
          }
          if (paragraphs[1] && about.sections[1]) {
            paragraphs[1].textContent = about.sections[1].description;
          }
          
          // Third section
          if (paragraphs[2] && about.sections[2]) {
            paragraphs[2].textContent = about.sections[2].number;
          }
          if (paragraphs[3] && about.sections[2]) {
            paragraphs[3].textContent = about.sections[2].description;
          }
        }
      }
    }

    // Update the button
    const buttonElement = document.querySelector('.section.blue .arrow-link');
    if (buttonElement && about.buttonText && about.buttonLink) {
      buttonElement.textContent = about.buttonText;
      buttonElement.href = about.buttonLink;
    }

    // Update the main image
    const mainImage = document.querySelector('.section.blue .large-2-column-grid:not(.bottom-align) img');
    if (mainImage && about.image) {
      mainImage.src = about.image.src;
      mainImage.alt = about.image.alt;
      mainImage.sizes = about.image.sizes;
      mainImage.srcset = about.image.srcset;
    }
  }
  
  // Function to load and populate hero section
  async function loadHeroData() {
    try {
      const response = await fetch(`${BASE_URL}/api/homepage`);
      const data = await response.json();
      
      if (data.heroTitle || data.heroImages || data.heroSlider) {
        console.log('Hero data loaded:', { 
          title: data.heroTitle, 
          images: data.heroImages?.length, 
          slider: data.heroSlider?.length 
        });
        populateHeroSection(data);
      } else {
        console.log('No hero data found in response:', data);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    }
  }

  // Function to populate the hero section with exact styling
  function populateHeroSection(data) {
    const heroContainer = document.getElementById('dynamic-hero-section');
    if (!heroContainer) {
      console.error('Hero container not found');
      return;
    }
  
    // Create hero section HTML with exact structure and classes
    let heroHTML = `
      <div class="home-title-box">
        <h1 id="homeHeroTitle" class="heading h1">${data.heroTitle || ''}</h1>
      </div>
      <div class="spacer _48"></div>
      <div class="home-hero-image-block">
        ${data.heroImages && data.heroImages[0] ? `
          <img src="${data.heroImages[0].src}" 
               alt="${data.heroImages[0].alt || ''}" 
               class="${data.heroImages[0].class || ''}">
        ` : ''}
        ${data.heroImages && data.heroImages[1] ? `
          <img src="${data.heroImages[1].src}" 
               loading="lazy" 
               sizes="${data.heroImages[1].sizes || '100vw'}" 
               srcset="${data.heroImages[1].srcset || ''}" 
               alt="${data.heroImages[1].alt || ''}" 
               class="${data.heroImages[1].class || ''}">
        ` : ''}
        
        ${data.heroSlider && data.heroSlider.length > 0 ? `
          <div data-delay="4000" data-animation="cross" class="company-hero-slider w-slider" 
               data-autoplay="false" data-easing="ease" data-hide-arrows="false" 
               data-disable-swipe="false" data-autoplay-limit="0" data-nav-spacing="3" 
               data-duration="500" data-infinite="true" role="region" aria-label="carousel">
            <div class="w-slider-mask" id="w-slider-mask-0">
              ${data.heroSlider.map((slide, index) => `
                <div class="company-hero-slide w-slide" aria-label="${index + 1} of ${data.heroSlider.length}" 
                     role="group" style="${index === 0 ? 'transition: all, opacity 500ms; transform: translateX(0px); opacity: 1; z-index: 2;' : 'transition: all; transform: translateX(0px); opacity: 1; z-index: 1; visibility: hidden;'}" 
                     ${index > 0 ? 'aria-hidden="true"' : ''}>
                  <div class="company-hero-slide-content" ${index > 0 ? 'aria-hidden="true"' : ''}>
                    <div ${index > 0 ? 'aria-hidden="true"' : ''}>
                      <img src="${slide.logo}" 
                           loading="lazy" 
                           width="${slide.logoWidth || 150}" 
                           alt="" 
                           class="${slide.logoClass || 'image-2'}" 
                           ${index > 0 ? 'aria-hidden="true"' : ''}>
                    </div>
                    <div class="company-tag-row" ${index > 0 ? 'aria-hidden="true"' : ''}>
                      ${slide.tags && slide.tags.length > 0 ? slide.tags.map(tag => `
                        <div class="company-tag" ${index > 0 ? 'aria-hidden="true"' : ''}>${tag}</div>
                      `).join('') : ''}
                    </div>
                    <div class="company-divider" ${index > 0 ? 'aria-hidden="true"' : ''}></div>
                    <div class="text-box _250px" ${index > 0 ? 'aria-hidden="true"' : ''}>
                      <p class="paragraph medium" ${index > 0 ? 'aria-hidden="true"' : ''}>${slide.description || ''}</p>
                    </div>
                    <a href="${slide.link || 'portfolio.html'}" 
                       class="underline-link white" 
                       ${index > 0 ? 'tabindex="-1" aria-hidden="true"' : ''}>View Profile</a>
                  </div>
                </div>
              `).join('')}
              <div aria-live="off" aria-atomic="true" class="w-slider-aria-label" data-wf-ignore="">Slide 1 of ${data.heroSlider.length}.</div>
            </div>
            <div class="hero-slider-arrow let w-slider-arrow-left" role="button" tabindex="0" 
                 aria-controls="w-slider-mask-0" aria-label="previous slide">
              <div class="hero-slider-arrow-icon w-icon-slider-left"></div>
            </div>
            <div class="hero-slider-arrow w-slider-arrow-right" role="button" tabindex="0" 
                 aria-controls="w-slider-mask-0" aria-label="next slide">
              <div class="hero-slider-arrow-icon w-icon-slider-right"></div>
            </div>
            <div class="hidden w-slider-nav w-round w-num">
              ${data.heroSlider.map((_, index) => `
                <div class="w-slider-dot ${index === 0 ? 'w-active' : ''}" data-wf-ignore="" 
                     aria-label="Show slide ${index + 1} of ${data.heroSlider.length}" 
                     aria-pressed="${index === 0 ? 'true' : 'false'}" 
                     role="button" 
                     tabindex="${index === 0 ? '0' : '-1'}" 
                     style="margin-left: 3px; margin-right: 3px;">${index + 1}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  
    // Insert the HTML into the container
    heroContainer.innerHTML = heroHTML;
    
    // Update localStorage for dashboard compatibility
    const homeHeroTitle = document.getElementById('homeHeroTitle');
    if (homeHeroTitle && data.heroTitle) {
      localStorage.setItem('dashboard_home_content', data.heroTitle);
    }
    
    // Initialize Webflow slider if it exists
    if (window.Webflow && data.heroSlider && data.heroSlider.length > 0) {
      window.Webflow.ready();
    }
  }
});