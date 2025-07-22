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
        //console.log(data);
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
    // Values section - completely rebuild the grid
    const valuesGrid = document.querySelector('._4-grid');
    const valuesTitle = document.getElementById('values-title');
    
    if (valuesTitle && data.values) {
        valuesTitle.textContent = data.values.title;
    }
    
    if (valuesGrid && data.values && data.values.items) {
        // Clear existing content
        valuesGrid.innerHTML = '';
        
        // Create new value items
        data.values.items.forEach((value, index) => {
            const valueDiv = document.createElement('div');
            valueDiv.className = 'text-box _720px';
            
            valueDiv.innerHTML = `
                <div class="paragraph grey-text">{${value.number}}</div>
                <h3 class="heading h4">${value.title}</h3>
                <div class="spacer _24"></div>
                <p class="paragraph">${value.description}</p>
            `;
            
            valuesGrid.appendChild(valueDiv);
        });
    }
    
    // Motto section
    const mottoImage = document.getElementById('motto-image');
    const mottoTitle = document.getElementById('motto-title');
    const mottoDescription = document.getElementById('motto-description1');
    const mottoDescription2 = document.getElementById('motto-description2');
    
    if (mottoImage && data.motto) {
        // Check if the image path is relative (starts with 'uploads/') and prefix with BASE_URL
        const imageSrc = data.motto.image.startsWith('uploads/') 
            ? `${BASE_URL}/${data.motto.image}` 
            : data.motto.image;
        mottoImage.src = imageSrc;
        
        // Clear srcset for uploaded images to avoid showing old CDN images
        if (data.motto.image.startsWith('uploads/')) {
            mottoImage.src = `${BASE_URL}/${data.motto.image}`;
            mottoImage.removeAttribute('srcset');
            mottoImage.setAttribute('sizes', '100vw');
        } else {
            mottoImage.src = data.motto.image;
            if (data.motto.imageSrcset) {
                mottoImage.srcset = data.motto.imageSrcset;
                mottoImage.setAttribute('sizes', '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px');
            } else {
                mottoImage.removeAttribute('srcset');
                mottoImage.setAttribute('sizes', '(max-width: 767px) 100vw, (max-width: 991px) 95vw, 940px');
            }
        }
    }
    if (mottoTitle && data.motto) {
        mottoTitle.textContent = data.motto.title;
    }
    if (mottoDescription && data.motto) {
        mottoDescription.innerHTML = data.motto.description1;
    }
    if (mottoDescription2 && data.motto) {
        mottoDescription2.innerHTML = data.motto.description2;
    }

    // Testimonials with slider functionality
    const testimonialsSlider = document.getElementById('testimonials-slider');
    if (testimonialsSlider && data.testimonials) {
        let currentSlide = 0;
        const totalSlides = data.testimonials.length;
        
        // Clear existing content
        testimonialsSlider.innerHTML = '';
        
        // Create slides
        data.testimonials.forEach((testimonial, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'w-slide';
            slideDiv.setAttribute('aria-label', `${index + 1} of ${totalSlides}`);
            slideDiv.setAttribute('role', 'group');
            slideDiv.style.cssText = `
                transition: all 500ms ease;
                transform: translateX(0px);
                opacity: ${index === 0 ? '1' : '0'};
                z-index: ${index === 0 ? '12' : '10'};
                visibility: ${index === 0 ? 'visible' : 'hidden'};
                position: ${index === 0 ? 'relative' : 'absolute'};
                top: 0;
                left: 0;
                width: 100%;
            `;
            if (index !== 0) {
                slideDiv.setAttribute('aria-hidden', 'true');
            }
            
            slideDiv.innerHTML = `
                <div class="quote-slider-text-box">
                    <h2 class="heading h2">"${testimonial.quote}"</h2>
                    <p class="paragraph">— ${testimonial.author}</p>
                </div>
            `;
            testimonialsSlider.appendChild(slideDiv);
        });
        
        // Create navigation dots
        const navContainer = document.querySelector('.quote-slide-nav');
        if (navContainer) {
            navContainer.innerHTML = '';
            data.testimonials.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `w-slider-dot ${index === 0 ? 'w-active' : ''}`;
                dot.setAttribute('data-wf-ignore', '');
                dot.setAttribute('aria-label', `Show slide ${index + 1} of ${totalSlides}`);
                dot.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
                dot.setAttribute('role', 'button');
                dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
                dot.style.cssText = 'margin-left: 3px; margin-right: 3px; cursor: pointer;';
                
                dot.addEventListener('click', () => goToSlide(index));
                navContainer.appendChild(dot);
            });
        }
        
        // Function to go to specific slide
        function goToSlide(slideIndex) {
            const slides = testimonialsSlider.querySelectorAll('.w-slide');
            const dots = navContainer.querySelectorAll('.w-slider-dot');
            
            // Hide current slide
            slides[currentSlide].style.opacity = '0';
            slides[currentSlide].style.visibility = 'hidden';
            slides[currentSlide].style.position = 'absolute';
            slides[currentSlide].style.zIndex = '10';
            slides[currentSlide].setAttribute('aria-hidden', 'true');
            
            // Update current slide
            currentSlide = slideIndex;
            
            // Show new slide
            slides[currentSlide].style.opacity = '1';
            slides[currentSlide].style.visibility = 'visible';
            slides[currentSlide].style.position = 'relative';
            slides[currentSlide].style.zIndex = '12';
            slides[currentSlide].removeAttribute('aria-hidden');
            
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('w-active');
                    dot.setAttribute('aria-pressed', 'true');
                    dot.setAttribute('tabindex', '0');
                } else {
                    dot.classList.remove('w-active');
                    dot.setAttribute('aria-pressed', 'false');
                    dot.setAttribute('tabindex', '-1');
                }
            });
        }
        
        // Function to go to next slide
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % totalSlides;
            goToSlide(nextIndex);
        }
        
        // Function to go to previous slide
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(prevIndex);
        }
        
        // Add event listeners to arrow buttons
        const leftArrow = document.querySelector('.quote-left-arrow');
        const rightArrow = document.querySelector('.quote-right-arrow');
        
        if (leftArrow) {
            leftArrow.addEventListener('click', prevSlide);
            leftArrow.setAttribute('role', 'button');
            leftArrow.setAttribute('tabindex', '0');
            leftArrow.setAttribute('aria-label', 'previous slide');
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', nextSlide);
            rightArrow.setAttribute('role', 'button');
            rightArrow.setAttribute('tabindex', '0');
            rightArrow.setAttribute('aria-label', 'next slide');
        }
    }

    // FAQs with toggle functionality
    const faqsWrapper = document.getElementById('faqs-wrapper');
    if (faqsWrapper && data.faqs) {
        faqsWrapper.innerHTML = '';
        data.faqs.forEach((faq, index) => {
            const faqDiv = document.createElement('div');
            faqDiv.className = 'question-container';
            faqDiv.innerHTML = `
                <div class="question-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
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

