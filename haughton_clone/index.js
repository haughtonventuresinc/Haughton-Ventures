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
  
  // Load random insights
  loadRandomInsights();
  
  // Load services data
  loadServicesData();
  
  // Load philosophy data
  loadPhilosophyData();
  
  // Load values data
  loadValuesData();
  
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
});