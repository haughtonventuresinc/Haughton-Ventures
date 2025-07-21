import BASE_URL from "./base_url.js";

document.addEventListener('DOMContentLoaded', function() {
    loadAboutData();
});

async function loadAboutData() {
    try {
        const response = await fetch(`${BASE_URL}/api/about-data`);
        if (!response.ok) {
            throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        populateAboutPage(data);
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

function populateAboutPage(data) {
    // Hero section
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    
    if (heroTitle && data.hero) {
        heroTitle.textContent = data.hero.title;
    }
    if (heroDescription && data.hero) {
        heroDescription.textContent = data.hero.description;
    }

    // About Us section
    const aboutTitle = document.getElementById('about-title');
    const aboutDescription = document.getElementById('about-description');
    
    if (aboutTitle && data.aboutUs) {
        aboutTitle.textContent = data.aboutUs.title;
    }
    if (aboutDescription && data.aboutUs) {
        aboutDescription.textContent = data.aboutUs.description;
    }

    // Values section
    const valuesGrid = document.getElementById('values-grid');
    if (valuesGrid && data.values) {
        data.values.forEach((value, index) => {
            const valueTitle = document.getElementById(`values-0${index + 1}`);
            const valueDescription = document.getElementById(`values-desc-0${index + 1}`);
            
            if (valueTitle) valueTitle.textContent = value.title;
            if (valueDescription) valueDescription.textContent = value.description;
        });
    }

    // Motto section
    const mottoImage = document.getElementById('motto-image');
    const mottoTitle = document.getElementById('motto-title');
    const mottoDescription = document.getElementById('motto-description');
    const mottoDescription2 = document.getElementById('motto-description2');
    
    if (mottoImage && data.motto) {
        mottoImage.src = data.motto.image;
    }
    if (mottoTitle && data.motto) {
        mottoTitle.textContent = data.motto.title;
    }
    if (mottoDescription && data.motto) {
        mottoDescription.textContent = data.motto.description;
    }
    if (mottoDescription2 && data.motto) {
        mottoDescription2.textContent = data.motto.description2;
    }

    // Testimonials
    const testimonialsSlider = document.getElementById('testimonials-slider');
    if (testimonialsSlider && data.testimonials) {
        testimonialsSlider.innerHTML = '';
        data.testimonials.forEach(testimonial => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'quote-slide w-slide';
            slideDiv.innerHTML = `
                <div class="quote-block">
                    <h2 class="heading h2">"${testimonial.quote}"</h2>
                    <p class="paragraph">— ${testimonial.author}</p>
                </div>
            `;
            testimonialsSlider.appendChild(slideDiv);
        });
    }

    // FAQs with toggle functionality
    const faqsWrapper = document.getElementById('faqs-wrapper');
    if (faqsWrapper && data.faqs) {
        faqsWrapper.innerHTML = '';
        data.faqs.forEach((faq, index) => {
            const faqDiv = document.createElement('div');
            faqDiv.className = 'question-container';
            faqDiv.innerHTML = `
                <div class="question-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
                    <h3 class="heading h5" style="margin: 0;">${faq.question}</h3>
                    <img src="../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50aeb_Plus%20Icon.svg" width="22" alt="" class="question-plus-icon" style="transition: transform 0.3s ease;"/>
                </div>
                <div class="question-answer" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; padding: 0;">
                    <p class="paragraph" style="margin: 0; padding: 20px 0;">${faq.answer}</p>
                </div>
            `;
            
            // Add click event listener for toggle functionality
            const header = faqDiv.querySelector('.question-header');
            const answer = faqDiv.querySelector('.question-answer');
            const icon = faqDiv.querySelector('.question-plus-icon');
            
            header.addEventListener('click', function() {
                const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
                
                if (isOpen) {
                    // Close the answer
                    answer.style.maxHeight = '0px';
                    answer.style.padding = '0';
                    icon.style.transform = 'rotate(0deg)';
                    icon.src = '../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50aeb_Plus%20Icon.svg';
                } else {
                    // Open the answer
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.padding = '0';
                    icon.style.transform = 'rotate(45deg)';
                    icon.src = '../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50aeb_Plus%20Icon.svg';
                }
            });
            
            faqsWrapper.appendChild(faqDiv);
        });
    }
}

