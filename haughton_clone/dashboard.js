import BASE_URL from './base_url.js';
document.addEventListener('DOMContentLoaded', function() {

    let homepageData = {};
    const addQuill = new Quill('#add-quill', { theme: 'snow' });
    const editQuill = new Quill('#edit-quill', { theme: 'snow' });
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    
    (function() {
    const token = localStorage.getItem('dashboard_token');
    if (!token) {
        window.location.href = 'login.html';
    }})();

    // Enhanced sidebar toggle functionality
    let sidebarOpen = false;
    
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        
        if (sidebarOpen) {
            // Open sidebar
            sidebarNav.classList.remove('-translate-x-full');
            sidebarNav.classList.add('translate-x-0');
            sidebarOverlay.classList.remove('hidden');
            
            // Animate hamburger to X
            hamburgerLines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            // Close sidebar
            sidebarNav.classList.add('-translate-x-full');
            sidebarNav.classList.remove('translate-x-0');
            sidebarOverlay.classList.add('hidden');
            
            // Animate hamburger back to normal
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        }
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            if (sidebarOpen) {
                toggleSidebar();
            }
        });
    }
    
    // Close sidebar when clicking on navigation links (mobile)
    document.querySelectorAll('#sidebarLinks a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && sidebarOpen) {
                toggleSidebar();
            }
        });
    });
    
    // Section navigation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Hide all sections
            ['home', 'about', 'portfolio', 'insight', 'contact'].forEach(section => {
                const element = document.getElementById(section + 'Section');
                if (element) {
                    element.classList.add('hidden');
                }
            });
            
            // Show target section
            const targetElement = document.getElementById(targetSection + 'Section');
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
            
            // Update active nav state
            document.querySelectorAll('[data-section]').forEach(navLink => {
                navLink.classList.remove('bg-blue-600', 'text-white');
                navLink.classList.add('text-gray-700', 'hover:bg-gray-100');
            });
            
            this.classList.remove('text-gray-700', 'hover:bg-gray-100');
            this.classList.add('bg-blue-600', 'text-white');
        });
    });
    
    // Handle window resize
    function handleSidebarResize() {
        if (window.innerWidth >= 768) {
            // Desktop: ensure sidebar is visible and reset mobile states
            sidebarNav.classList.remove('-translate-x-full');
            sidebarNav.classList.add('translate-x-0');
            sidebarOverlay.classList.add('hidden');
            sidebarOpen = false;
            
            // Reset hamburger animation
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        } else {
            // Mobile: hide sidebar by default
            if (!sidebarOpen) {
                sidebarNav.classList.add('-translate-x-full');
                sidebarNav.classList.remove('translate-x-0');
            }
        }
    }
    
    window.addEventListener('resize', handleSidebarResize);
    
    // Initialize sidebar state
    handleSidebarResize();

    // Logout function
    window.logoutDashboard = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('dashboard_token');
            window.location.href = 'login.html';
        }
    };

function renderHeroImagesEditor(images) {
  const list = document.getElementById('heroImagesList');
  list.innerHTML = '';
  images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = 'flex gap-2 mb-2 items-center';
    div.innerHTML = `
      <img src="${img.src||''}" alt="Preview" class="w-12 h-12 object-cover border rounded" style="min-width:48px;min-height:48px;" onerror="this.src='https://via.placeholder.com/48x48?text=No+Img'" />
      <input type="text" placeholder="Image URL (src)" value="${img.src||''}" class="border rounded p-1 w-1/2 heroImageUrlInput" data-field="src" data-idx="${i}" />
      <input type="file" accept="image/*" class="uploadHeroImageInput" data-idx="${i}" style="display:inline-block;width:auto;" />`
    list.appendChild(div);
  });
  // Add upload and preview logic
  setTimeout(() => {
    document.querySelectorAll('.uploadHeroImageInput').forEach(input => {
      input.addEventListener('change', function(e) {
        const idx = +this.dataset.idx;
        const file = this.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        fetch(BASE_URL + '/api/upload-image', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.url) {
            homepageData.heroImages[idx].src = data.url;
            renderHeroImagesEditor(homepageData.heroImages);
          } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
          }
        })
        .catch(() => alert('Upload failed'));
      });
    });
    // Live preview for URL input
    document.querySelectorAll('.heroImageUrlInput').forEach(input => {
      input.addEventListener('input', function(e) {
        const idx = +this.dataset.idx;
        homepageData.heroImages[idx].src = this.value;
        const img = this.parentElement.querySelector('img');
        img.src = this.value || 'https://via.placeholder.com/48x48?text=No+Img';
      });
    });
  }, 0);
}
function renderHeroSliderEditor(slides) {
  const list = document.getElementById('heroSliderList');
  list.innerHTML = '';
  slides.forEach((slide, i) => {
    const div = document.createElement('div');
    div.className = 'flex flex-wrap gap-2 mb-2 border p-2 rounded';
    div.innerHTML = `
      <img src="${slide.logo||''}" alt="Logo Preview" class="w-12 h-12 object-contain border rounded" style="min-width:48px;min-height:48px;" onerror="this.src='https://via.placeholder.com/48x48?text=No+Img'" />
      <input type="text" placeholder="Logo URL" value="${slide.logo||''}" class="border rounded p-1 w-1/4 heroSliderLogoUrlInput" data-field="logo" data-idx="${i}" />
      <input type="file" accept="image/*" class="uploadHeroSliderLogoInput" data-idx="${i}" style="display:inline-block;width:auto;" />
      <input type="text" placeholder="Tags (comma)" value="${(slide.tags||[]).join(', ')}" class="border rounded p-1 w-1/4" data-field="tags" data-idx="${i}" />
      <textarea placeholder="Description" class="border rounded p-1 w-full min-h-[120px]" data-field="description" data-idx="${i}">${slide.description||''}</textarea>
      <input type="text" placeholder="Link" value="${slide.link||''}" class="border rounded p-1 w-1/4" data-field="link" data-idx="${i}" />
      <button type="button" class="bg-red-500 text-white px-2 rounded removeHeroSlideBtn" data-idx="${i}">Remove</button>`;
    list.appendChild(div);
  });
  // Add upload and preview logic
  setTimeout(() => {
    document.querySelectorAll('.uploadHeroSliderLogoInput').forEach(input => {
      input.addEventListener('change', function(e) {
        const idx = +this.dataset.idx;
        const file = this.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        fetch(BASE_URL + '/api/upload-image', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.url) {
            homepageData.heroSlider[idx].logo = data.url;
            renderHeroSliderEditor(homepageData.heroSlider);
          } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
          }
        })
        .catch(() => alert('Upload failed'));
      });
    });
    // Live preview for logo URL input
    document.querySelectorAll('.heroSliderLogoUrlInput').forEach(input => {
      input.addEventListener('input', function(e) {
        const idx = +this.dataset.idx;
        homepageData.heroSlider[idx].logo = this.value;
        const img = this.parentElement.querySelector('img');
        img.src = this.value || 'https://via.placeholder.com/48x48?text=No+Img';
      });
    });
  }, 0);
}
function bindEditorEvents() {
  document.getElementById('heroTitleInput').addEventListener('input', e => {
    homepageData.heroTitle = e.target.value;
  });
  document.getElementById('addHeroImageBtn').onclick = () => {
    homepageData.heroImages.push({src:'',alt:'',class:'',sizes:'',srcset:''});
    renderHeroImagesEditor(homepageData.heroImages);
    
  };
  document.getElementById('addHeroSlideBtn').onclick = () => {
    homepageData.heroSlider.push({logo:'',logoWidth:150,logoClass:'',tags:[],description:'',link:''});
    renderHeroSliderEditor(homepageData.heroSlider);
    
  };
  document.getElementById('heroImagesList').addEventListener('input', e => {
    const idx = +e.target.dataset.idx;
    const field = e.target.dataset.field;
    homepageData.heroImages[idx][field] = e.target.value;
    
  });
  document.getElementById('heroImagesList').addEventListener('click', e => {
    if (e.target.classList.contains('removeHeroImageBtn')) {
      const idx = +e.target.dataset.idx;
      homepageData.heroImages.splice(idx,1);
      renderHeroImagesEditor(homepageData.heroImages);
      
    }
  });
  document.getElementById('heroSliderList').addEventListener('input', e => {
    const idx = +e.target.dataset.idx;
    const field = e.target.dataset.field;
    if (field === 'tags') {
      homepageData.heroSlider[idx].tags = e.target.value.split(',').map(t=>t.trim()).filter(Boolean);
    } else if (field === 'logoWidth') {
      homepageData.heroSlider[idx][field] = +e.target.value;
    } else {
      homepageData.heroSlider[idx][field] = e.target.value;
    }
    
  });
  document.getElementById('heroSliderList').addEventListener('click', e => {
    if (e.target.classList.contains('removeHeroSlideBtn')) {
      const idx = +e.target.dataset.idx;
      homepageData.heroSlider.splice(idx,1);
      renderHeroSliderEditor(homepageData.heroSlider);
      
    }
  });
  document.getElementById('cancelHomepageEditBtn').onclick = () => {
    fetch(BASE_URL+'/api/homepage').then(r=>r.json()).then(data=>{
      homepageData = Object.assign({}, data, {
        heroImages: Array.isArray(data.heroImages)?[...data.heroImages]:[],
        heroSlider: Array.isArray(data.heroSlider)?[...data.heroSlider]:[]
      });
      document.getElementById('heroTitleInput').value = homepageData.heroTitle||'';
      renderHeroImagesEditor(homepageData.heroImages);
      renderHeroSliderEditor(homepageData.heroSlider);
      
    });
  };
}
document.addEventListener('DOMContentLoaded', () => {
  fetch(BASE_URL+'/api/homepage').then(r=>r.json()).then(data=>{
    homepageData = Object.assign({}, data, {
      heroImages: Array.isArray(data.heroImages)?[...data.heroImages]:[],
      heroSlider: Array.isArray(data.heroSlider)?[...data.heroSlider]:[]
    });
    document.getElementById('heroTitleInput').value = homepageData.heroTitle||'';
    renderHeroImagesEditor(homepageData.heroImages);
    renderHeroSliderEditor(homepageData.heroSlider);
    
    bindEditorEvents();
  });
  document.getElementById('homepageEditor').onsubmit = function(e) {
    e.preventDefault();
    fetch(BASE_URL+'/api/homepage', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(homepageData)
    })
    .then(r=>r.json())
    .then(resp=>{
      if(resp.success) {
        alert('Homepage content saved!');
      } else {
        alert('Failed to save: '+(resp.error||'Unknown error'));
      }
    })
    .catch(err=>alert('Error: '+err.message));
  };
});


// === CONFIGURABLE BACKEND BASE URL ===
// Change this when deploying!

  // Auto-upload image on form submit (Add and Edit)
  async function uploadImageIfPresent(fileInputId) {
      const fileInput = document.getElementById(fileInputId);
      if (fileInput && fileInput.files.length) {
          const formData = new FormData();
          formData.append('image', fileInput.files[0]);
          const resp = await fetch(BASE_URL + '/api/upload-image', {
              method: 'POST',
              body: formData
          });
          const data = await resp.json();
          if (data.success) return BASE_URL + '/' + data.url;
          else throw new Error(data.error || 'Upload failed');
      }
      return null;
  }
  // Format date as 'Month DD, YYYY' for display
  function formatDateWords(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  // Format: Month DD, YYYY
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  }

  const insightsData = `${BASE_URL}/api/insights-data`;


  // Load and display insights with Edit button
  function updateInsightsTable() {
      // Add cache-busting parameter to prevent caching issues
      fetch(`${insightsData}?_=${new Date().getTime()}`)
          .then(response => response.json())
          .then(data => {
              const insightsTable = document.getElementById('insightsBody');
              insightsTable.innerHTML = '';
              data.forEach(insight => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td class="px-4 py-4 md:py-6 align-middle">${insight.title}</td>
                      <td class="px-4 py-4 md:py-6 align-middle">${insight.category}</td>
                      <td class="px-4 py-4 md:py-6 align-middle">${insight.date}</td>
                      <td class="px-4 py-4 md:py-6 align-middle">${insight.excerpt}</td>
                      <td class="px-4 py-4 md:py-6 align-middle">
                          <button onclick="editInsight('${insight.id}')" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow transition mr-2">Edit</button>
                          <button onclick="deleteInsight('${insight.id}')" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition">Delete</button>
                      </td>
                  `;
                  insightsTable.appendChild(row);
              });
          });
  }
  // Initial table render
  updateInsightsTable();

  // Show edit form and load content
 
  
  function hideEditForm() {
      document.getElementById('editInsightForm').style.display = 'none';
  }


  // Dummy delete function
  function deleteInsight(id) {
    if (!confirm('Are you sure you want to delete this insight?')) return;
    fetch(BASE_URL + '/api/delete-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Insight deleted.');
            fetch(`${BASE_URL}/api/insights-data`)
                .then(r => r.json())
                .then(d => {
                    localStorage.setItem('insightsDataCache', JSON.stringify(d));
                    updateInsightsTable();
                });
        } else {
            alert('Failed to delete: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        alert('Error deleting: ' + err.message);
    });
}

window.deleteInsight = deleteInsight;

// Generate the 'Other posts' HTML for the insight template
window.generateOtherPostsHtml = function(currentId) {
let html = '';
try {
  const data = JSON.parse(localStorage.getItem('insightsDataCache')) || [];
  const others = data.filter(item => item.id !== currentId);
  for (const post of others) {
      html += `
      <div role="listitem" class="insights-item w-dyn-item">
          <a href="${post.link}" class="insight-link-block w-inline-block">
              <div class="insight-thumbnail">
                  <div class="insight-category-tag">${post.category}</div>
                  <img alt="${post.title}" loading="lazy" width="808" src="${post.image || ''}" class="insight-cover-image"/>
              </div>
              <div class="insights-text-box">
                  <div class="post-date">${formatDateWords(post.date)}</div>
                  <h3 class="paragraph x-large">${post.title}</h3>
                  <p class="paragraph small dark-grey">${post.excerpt}</p>
                  <div class="post-arrow-link">Read now</div>
              </div>
          </a>
      </div>`;
  }
} catch (e) { html = ''; }
return html;
};

// Cache insights data for use in generateOtherPostsHtml
fetch(`${BASE_URL}/api/insights-data`).then(r => r.json()).then(d => localStorage.setItem('insightsDataCache', JSON.stringify(d)));

// Initialize Quill editors


// --- Modify Add Insight Handler ---
const newInsightForm = document.getElementById('newInsightForm');
newInsightForm.addEventListener('submit', async event => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const excerpt = document.getElementById('excerpt').value;
    let image = document.getElementById('add-image').value;
    const bodyContent = addQuill.root.innerHTML;
    try {
        const uploaded = await uploadImageIfPresent('add-image-file');
        if (uploaded) image = uploaded;
    } catch (e) {
        alert('Image upload failed: ' + e.message);
        return;
    }
    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    Promise.all([
        fetch('insights/insight-template.html').then(r => r.text()),
        fetch(`${BASE_URL}/api/insights-data`).then(r => r.json())
    ]).then(([template, insightsData]) => {
        const others = insightsData.filter(item => item.id !== id);
        let otherPostsHtml = '';
        for (const post of others) {
            let href = post.link.startsWith('insights/') ? post.link.replace('insights/', '') : post.link;
            otherPostsHtml += `\n                    <div role="listitem" class="insights-item w-dyn-item">\n                        <a href="${href}" class="insight-link-block w-inline-block">\n                            <div class="insight-thumbnail">\n                                <div class="insight-category-tag">${post.category}</div>\n                                <img alt="${post.title}" loading="lazy" width="808" src="${post.image || ''}" class="insight-cover-image"/>\n                            </div>\n                            <div class="insights-text-box">\n                                <div class="post-date">${formatDateWords(post.date)}</div>\n                                <h3 class="paragraph x-large">${post.title}</h3>\n                                <p class="paragraph small dark-grey">${post.excerpt}</p>\n                                <div class="post-arrow-link">Read now</div>\n                            </div>\n                        </a>\n                    </div>`;
        }
        let htmlContent = template
            .replace(/{{TITLE}}/g, title)
            .replace(/{{DESCRIPTION}}/g, excerpt)
            .replace(/{{IMAGE_URL}}/g, image)
            .replace(/{{CATEGORY}}/g, category)
            .replace(/{{DATE}}/g, formatDateWords(date))
            .replace(/{{SUMMARY}}/g, excerpt)
            .replace(/{{CONTENT}}/g, bodyContent)
            .replace(/{{OTHER_POSTS}}/g, `<div class=\"insights-grid-wrapper w-dyn-list\"><div role=\"list\" class=\"insights-grid w-dyn-items\">${otherPostsHtml}</div></div>`);
        fetch(BASE_URL + '/api/save-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, content: htmlContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
              fetch(BASE_URL + '/api/save-insight-meta', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          id,
                          title,
                          category,
                          date,
                          excerpt,
                          image,
                          link: `insights/${id}.html`,
                          content: bodyContent // <-- add this line
                      })
                  })
                .then(resp => resp.json())
                .then(metaResp => {
                    if (metaResp.success) {
                        alert('Insight added successfully!');
                        updateInsightsTable();
                        //clear form
                        newInsightForm.reset();
                        addQuill.root.innerHTML = '';
                    } else {
                        alert('Added file, but failed to update list: ' + (metaResp.error || 'Unknown error'));
                    }
                });
            } else {
                alert('Failed to add: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(err => {
            alert('Error adding: ' + err.message);
        });
    });
});

// --- Modify Edit Insight Handler ---
function editInsight(id) {
    fetch(insightsData)
        .then(response => response.json())
        .then(data => {
            const insight = data.find(i => i.id === id);
            if (!insight) return;
            document.getElementById('edit-id').value = insight.id;
            document.getElementById('edit-title').value = insight.title;
            document.getElementById('edit-category').value = insight.category;
            document.getElementById('edit-date').value = insight.date;
            document.getElementById('edit-excerpt').value = insight.excerpt;
            document.getElementById('edit-image').value = insight.image || '';
            var previewImg = document.getElementById('edit-image-preview');
            if (insight.image) {
            previewImg.src = insight.image;
            previewImg.style.display = '';
            } else {
            previewImg.src = '';
            previewImg.style.display = 'none';
            }
            // Load HTML content from file
            fetch(`insights/${id}.html`)
                .then(resp => resp.text())
                .then(html => {
                    // Extract .w-richtext inner HTML
                    let match = html.match(/<div class=\"w-richtext\">([\s\S]*?)<\/div>/);
                    let htmlBody = '';
                    if (match) {
                        htmlBody = match[1];
                    } else {
                        // fallback: try to extract all <body> content
                        let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                        htmlBody = bodyMatch ? bodyMatch[1] : html;
                    }
                    editQuill.root.innerHTML = htmlBody.trim();
                    document.getElementById('editInsightForm').style.display = '';
                });
        });
}

// --- Modify Edit Insight Submit Handler ---
document.getElementById('editInsightForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;
    const category = document.getElementById('edit-category').value;
    const date = document.getElementById('edit-date').value;
    const excerpt = document.getElementById('edit-excerpt').value;
    let image = document.getElementById('edit-image').value;
    const bodyContent = editQuill.root.innerHTML;
    try {
        const uploaded = await uploadImageIfPresent('edit-image-file');
        if (uploaded) image = uploaded;
    } catch (e) {
        alert('Image upload failed: ' + e.message);
        return;
    }
    Promise.all([
        fetch('insights/insight-template.html').then(r => r.text()),
        fetch(`${BASE_URL}/api/insights-data`).then(r => r.json())
    ]).then(([template, insightsData]) => {
        const others = insightsData.filter(item => item.id !== id);
        let otherPostsHtml = '';
        for (const post of others) {
            let href = post.link.startsWith('insights/') ? post.link.replace('insights/', '') : post.link;
            otherPostsHtml += `\n                    <div role="listitem" class="insights-item w-dyn-item">\n                        <a href="${href}" class="insight-link-block w-inline-block">\n                            <div class="insight-thumbnail">\n                                <div class="insight-category-tag">${post.category}</div>\n                                <img alt="${post.title}" loading="lazy" width="808" src="${post.image || ''}" class="insight-cover-image"/>\n                            </div>\n                            <div class="insights-text-box">\n                                <div class="post-date">${formatDateWords(post.date)}</div>\n                                <h3 class="paragraph x-large">${post.title}</h3>\n                                <p class="paragraph small dark-grey">${post.excerpt}</p>\n                                <div class="post-arrow-link">Read now</div>\n                            </div>\n                        </a>\n                    </div>`;
        }
        let htmlContent = template
            .replace(/{{TITLE}}/g, title)
            .replace(/{{DESCRIPTION}}/g, excerpt)
            .replace(/{{IMAGE_URL}}/g, image)
            .replace(/{{CATEGORY}}/g, category)
            .replace(/{{DATE}}/g, formatDateWords(date))
            .replace(/{{SUMMARY}}/g, excerpt)
            .replace(/{{CONTENT}}/g, bodyContent)
            .replace(/{{OTHER_POSTS}}/g, `<div class=\"insights-grid-wrapper w-dyn-list\"><div role=\"list\" class=\"insights-grid w-dyn-items\">${otherPostsHtml}</div></div>`);
        fetch(BASE_URL + '/api/save-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, content: htmlContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
              fetch(BASE_URL + '/api/save-insight-meta', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id,
                            title,
                            category,
                            date,
                            excerpt,
                            image,
                            link: `insights/${id}.html`,
                            content: bodyContent // <-- add this line
                        })
                    })
                .then(resp => resp.json())
                .then(metaResp => {
                    if (metaResp.success) {
                        alert('Insight updated successfully!');
                        updateInsightsTable();
                        hideEditForm();
                    } else {
                        alert('Error saving meta: ' + metaResp.error);
                    }
                });
            } else {
                alert('Error saving: ' + data.error);
            }
        })
        .catch(err => {
            alert('Error saving: ' + err.message);
        });
    });
});


if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebarLinks.classList.toggle('hidden');
  });
}
// Hide sidebar links by default on mobile
function handleSidebarResize() {
  if(window.innerWidth < 768) {
    sidebarLinks.classList.add('hidden');
  } else {
    sidebarLinks.classList.remove('hidden');
  }
}
window.addEventListener('resize', handleSidebarResize);
document.addEventListener('DOMContentLoaded', handleSidebarResize);
// Smooth scroll for anchor links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // On mobile, hide sidebar after click
      if(window.innerWidth < 768) sidebarLinks.classList.add('hidden');
    });
  });


  // Smooth scroll for anchor links (for browsers that don't support CSS scroll-behavior)
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

    // Smooth scroll for anchor links (for browsers that don't support CSS scroll-behavior)
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
      function logoutDashboard() {
        localStorage.removeItem('dashboard_token');
        window.location.href = 'login.html';
      }
      
          // Show only one form at a time logic
    function showEditForm() {
        document.getElementById('addInsightPanel').style.display = 'none';
        document.getElementById('editInsightPanel').classList.remove('hidden');
      }
      function hideEditForm() {
        document.getElementById('editInsightPanel').classList.add('hidden');
        document.getElementById('addInsightPanel').style.display = '';
      }
      // Patch global editInsight to show modal
      const _originalEditInsight = window.editInsight;
      window.editInsight = function(id) {
        showEditForm();
        if (_originalEditInsight) _originalEditInsight(id);
      }
      // Hide edit modal on load
      document.addEventListener('DOMContentLoaded',()=>{
        hideEditForm();
      });

});

// Contact Page Editor Functionality
let contactData = {
    heroTitle: "It's time to talk",
    heroSubtitle: "Leave us a message and we will get back to you as soon as we can.",
    heroImage: "../cdn.prod.website-files.com/687563dc787e44a7f4a50a72/687563dc787e44a7f4a50af2_Rectangle%20324.webp",
    sectionTitle: "Inquire now",
    contactDescription: "Fill out the form to the right and we will get back to you soon. Don't like forms? No worries, feel free to send us a direct email.",
    emailLabel: "Email",
    contactEmail: "contact@haughtonventures.com"
};

// Load contact data from backend or localStorage
function loadContactData() {
    // Try to load from backend first, fallback to default values
    fetch(BASE_URL + '/api/contact-data')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                contactData = { ...contactData, ...data.data };
            }
            populateContactForm();
        })
        .catch(() => {
            // Fallback to localStorage or default values
            const saved = localStorage.getItem('contactData');
            if (saved) {
                contactData = { ...contactData, ...JSON.parse(saved) };
            }
            populateContactForm();
        });
}

// Populate contact form with current data
function populateContactForm() {
    document.getElementById('contactHeroTitle').value = contactData.heroTitle || '';
    document.getElementById('contactHeroSubtitle').value = contactData.heroSubtitle || '';
    document.getElementById('contactHeroImage').value = contactData.heroImage || '';
    document.getElementById('contactSectionTitle').value = contactData.sectionTitle || '';
    document.getElementById('contactDescription').value = contactData.contactDescription || '';
    document.getElementById('contactEmailLabel').value = contactData.emailLabel || '';
    document.getElementById('contactEmail').value = contactData.contactEmail || '';
    
    // Show image preview if URL exists
    if (contactData.heroImage) {
        const preview = document.getElementById('contactHeroImagePreview');
        const img = document.getElementById('contactHeroImagePreviewImg');
        img.src = contactData.heroImage;
        preview.classList.remove('hidden');
    }
}

// Handle image upload for contact hero
document.getElementById('contactHeroImageFile').addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(BASE_URL + '/api/upload-image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success && data.url) {
            contactData.heroImage = data.url;
            document.getElementById('contactHeroImage').value = data.url;
            
            // Show preview
            const preview = document.getElementById('contactHeroImagePreview');
            const img = document.getElementById('contactHeroImagePreviewImg');
            img.src = data.url;
            preview.classList.remove('hidden');
        } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Upload failed: ' + error.message);
    }
});

// Handle image URL input change
document.getElementById('contactHeroImage').addEventListener('input', function(e) {
    const url = this.value;
    contactData.heroImage = url;
    
    if (url) {
        const preview = document.getElementById('contactHeroImagePreview');
        const img = document.getElementById('contactHeroImagePreviewImg');
        img.src = url;
        preview.classList.remove('hidden');
    } else {
        document.getElementById('contactHeroImagePreview').classList.add('hidden');
    }
});

// Handle contact form submission
document.getElementById('contactEditor').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Update contactData with form values
    contactData.heroTitle = document.getElementById('contactHeroTitle').value;
    contactData.heroSubtitle = document.getElementById('contactHeroSubtitle').value;
    contactData.heroImage = document.getElementById('contactHeroImage').value;
    contactData.sectionTitle = document.getElementById('contactSectionTitle').value;
    contactData.contactDescription = document.getElementById('contactDescription').value;
    contactData.emailLabel = document.getElementById('contactEmailLabel').value;
    contactData.contactEmail = document.getElementById('contactEmail').value;
    
    try {
        // Save to backend
        const response = await fetch(BASE_URL + '/api/save-contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Also save to localStorage as backup
            localStorage.setItem('contactData', JSON.stringify(contactData));
            
            // Update the actual contact.html file locally
            await updateContactHtmlFile();
            
            alert('Contact page updated successfully!');
        } else {
            alert('Failed to save: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        // Fallback to localStorage
        localStorage.setItem('contactData', JSON.stringify(contactData));
        
        // Still try to update HTML file locally
        await updateContactHtmlFile();
        
        alert('Saved locally. Contact page updated!');
    }
});

// Update contact.html file with new content (LOCAL FILE UPDATE)
async function updateContactHtmlFile() {
    try {
        // Read the current contact.html file
        const response = await fetch('./contact.html');
        if (!response.ok) {
            throw new Error('Failed to read contact.html');
        }
        
        let htmlContent = await response.text();
        
        // Update hero title
        htmlContent = htmlContent.replace(
            /<h1 class="heading l-h1">.*?<\/h1>/,
            `<h1 class="heading l-h1">${contactData.heroTitle}</h1>`
        );
        
        // Update hero subtitle
        htmlContent = htmlContent.replace(
            /<p class="paragraph">Leave us a message.*?<\/p>/,
            `<p class="paragraph">${contactData.heroSubtitle}</p>`
        );
        
        // Update hero image
        if (contactData.heroImage) {
            htmlContent = htmlContent.replace(
                /src="[^"]*Rectangle%20324[^"]*"/,
                `src="${contactData.heroImage}"`
            );
            htmlContent = htmlContent.replace(
                /srcset="[^"]*Rectangle%2520324[^"]*"/,
                `srcset="${contactData.heroImage}"`
            );
        }
        
        // Update section title
        htmlContent = htmlContent.replace(
            /<div id="w-node-_52ddbf7d-cd50-6ba1-1b40-e56600327524-f4a50b36" class="section-intro-text">.*?<\/div>/,
            `<div id="w-node-_52ddbf7d-cd50-6ba1-1b40-e56600327524-f4a50b36" class="section-intro-text">${contactData.sectionTitle}</div>`
        );
        
        // Update contact description
        htmlContent = htmlContent.replace(
            /<p class="paragraph">Fill out the form.*?<\/p>/,
            `<p class="paragraph">${contactData.contactDescription}</p>`
        );
        
        // Update email label
        htmlContent = htmlContent.replace(
            /<div class="paragraph">Email<\/div>/,
            `<div class="paragraph">${contactData.emailLabel}</div>`
        );
        
        // Update contact email
        htmlContent = htmlContent.replace(
            /<a href="mailto:[^"]*" class="contact-text-link">.*?<\/a>/,
            `<a href="mailto:${contactData.contactEmail}" class="contact-text-link">${contactData.contactEmail}</a>`
        );
        
        // Note: In a real deployment, you would need a server-side script to write the file
        // For now, this demonstrates the HTML transformation logic
        console.log('[CONTACT] HTML content updated (local transformation complete)');
        
    } catch (error) {
        console.warn('[CONTACT] Failed to update contact.html locally:', error.message);
        // This is expected in a browser environment since we can't write files directly
        // The backend would handle this in a real deployment
    }
}

// Cancel contact editing
document.getElementById('cancelContactEditBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        loadContactData(); // Reload original data
    }
});

// Preview contact changes
document.getElementById('previewContactBtn').addEventListener('click', function() {
    // Update contactData with current form values
    contactData.heroTitle = document.getElementById('contactHeroTitle').value;
    contactData.heroSubtitle = document.getElementById('contactHeroSubtitle').value;
    contactData.heroImage = document.getElementById('contactHeroImage').value;
    contactData.sectionTitle = document.getElementById('contactSectionTitle').value;
    contactData.contactDescription = document.getElementById('contactDescription').value;
    contactData.emailLabel = document.getElementById('contactEmailLabel').value;
    contactData.contactEmail = document.getElementById('contactEmail').value;
    
    // Save to localStorage for preview
    localStorage.setItem('contactDataPreview', JSON.stringify(contactData));
    
    // Open contact page in new tab
    window.open('contact.html?preview=true', '_blank');
});

// Initialize contact editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load contact data
    loadContactData();
});

// === PORTFOLIO MANAGEMENT FUNCTIONALITY ===
let portfolioData = { portfolioItems: [] };

// Load and display portfolio items
function updatePortfolioTable() {
    fetch(`${BASE_URL}/api/portfolio-data?_=${new Date().getTime()}`)
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data && result.data.portfolioItems) {
                console.log('[PORTFOLIO] Portfolio data loaded successfully');
                
                portfolioData = result.data;
                const portfolioTable = document.getElementById('portfolioBody');
                portfolioTable.innerHTML = '';
                
                result.data.portfolioItems.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-4 py-4 md:py-6 align-middle">${item.company}</td>
                        <td class="px-4 py-4 md:py-6 align-middle">${item.industry}</td>
                        <td class="px-4 py-4 md:py-6 align-middle">${item.stage}</td>
                        <td class="px-4 py-4 md:py-6 align-middle">${item.founded}</td>
                        <td class="px-4 py-4 md:py-6 align-middle">
                            <button onclick="editPortfolioItem(${item.id})" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow transition mr-2">Edit</button>
                            <button onclick="deletePortfolioItem(${item.id})" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition">Delete</button>
                        </td>
                    `;
                    portfolioTable.appendChild(row);
                });
            } else {
                console.error('[PORTFOLIO] Failed to load portfolio data:', result.error);
            }
        })
        .catch(error => {
            console.error('[PORTFOLIO] Error fetching portfolio data:', error);
        });
}

// Show portfolio modal for adding new item
function showPortfolioModal() {
    document.getElementById('portfolioModal').classList.remove('hidden');
    document.getElementById('portfolioModalTitle').textContent = 'Add Portfolio Item';
    document.getElementById('portfolioForm').reset();
    document.getElementById('portfolio-id').value = ''; // Clear hidden ID for new item
}

// Hide portfolio modal
function hidePortfolioModal() {
    document.getElementById('portfolioModal').classList.add('hidden');
}

// Fixed edit portfolio item function
function editPortfolioItem(id) {
    const item = portfolioData.portfolioItems.find(p => p.id === id);
    if (!item) return;
    
    // Populate the same form fields (not edit-specific ones)
    document.getElementById('portfolio-id').value = item.id;
    document.getElementById('portfolio-company').value = item.company;
    document.getElementById('portfolio-intro').value = item.intro;
    document.getElementById('portfolio-industry').value = item.industry;
    document.getElementById('portfolio-stage').value = item.stage;
    document.getElementById('portfolio-founded').value = item.founded;
    document.getElementById('portfolio-description').value = item.description;
    
    // Change modal title and show modal
    document.getElementById('portfolioModalTitle').textContent = 'Edit Portfolio Item';
    document.getElementById('portfolioModal').classList.remove('hidden');
}

// Delete portfolio item
function deletePortfolioItem(id) {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    // Remove item from portfolioData
    portfolioData.portfolioItems = portfolioData.portfolioItems.filter(item => item.id !== id);
    
    // Save updated data
    fetch(BASE_URL + '/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Portfolio item deleted successfully!');
            updatePortfolioTable();
        } else {
            alert('Failed to delete: ' + (result.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Error deleting: ' + error.message);
    });
}



// Make functions globally available
window.showPortfolioModal = showPortfolioModal;
window.hidePortfolioModal = hidePortfolioModal;
window.editPortfolioItem = editPortfolioItem;
window.deletePortfolioItem = deletePortfolioItem;

// Wait for DOM to be ready before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add new portfolio item
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const company = document.getElementById('portfolio-company').value;
            const intro = document.getElementById('portfolio-intro').value;
            const industry = document.getElementById('portfolio-industry').value;
            const stage = document.getElementById('portfolio-stage').value;
            const founded = document.getElementById('portfolio-founded').value;
            const description = document.getElementById('portfolio-description').value;
            const portfolioId = document.getElementById('portfolio-id').value;
            
            // Check if this is an edit (has ID) or new item
            if (portfolioId) {
                // Edit existing item
                const itemIndex = portfolioData.portfolioItems.findIndex(item => item.id == portfolioId);
                if (itemIndex !== -1) {
                    portfolioData.portfolioItems[itemIndex] = {
                        id: parseInt(portfolioId),
                        company,
                        intro,
                        industry,
                        stage,
                        founded: parseInt(founded),
                        description
                    };
                }
            } else {
                // Generate new ID for new item
                const newId = portfolioData.portfolioItems.length > 0 
                    ? Math.max(...portfolioData.portfolioItems.map(item => item.id)) + 1 
                    : 1;
                
                const newItem = {
                    id: newId,
                    company,
                    intro,
                    industry,
                    stage,
                    founded: parseInt(founded),
                    description
                };
                
                portfolioData.portfolioItems.push(newItem);
            }
            
            // Save to backend
            fetch(BASE_URL + '/api/save-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(portfolioData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Portfolio saved successfully:', data);
                updatePortfolioTable();
                hidePortfolioModal();
                document.getElementById('portfolioForm').reset();
                document.getElementById('portfolio-id').value = ''; // Clear the hidden ID field
            })
            .catch(error => {
                console.error('Error saving portfolio:', error);
                alert('Error saving portfolio item. Please try again.');
            });
        });
    }
    
    // Initialize portfolio table
    updatePortfolioTable();
});

// === ABOUT SECTION DATA MANAGEMENT ===
let aboutData = {
    hero: {
        title: "About Us",
        subtitle: "Learn more about our company",
        image: ""
    },
    aboutUs: {
        title: "About Us",
        description: "We are a leading company in our industry."
    },
    values: {
        title: "Our Values",
        items: [
            {
                number: "01",
                title: "Innovation",
                description: "We strive for innovation in everything we do."
            },
            {
                number: "02",
                title: "Quality",
                description: "Quality is at the heart of our work."
            },
            {
                number: "03",
                title: "Integrity",
                description: "We maintain the highest standards of integrity."
            },
            {
                number: "04",
                title: "Excellence",
                description: "We pursue excellence in all our endeavors."
            }
        ]
    },
    motto: {
        image: "",
        title: "Our Motto",
        description1: "First part of our motto description.",
        description2: "Second part of our motto description."
    },
    testimonials: {
        title: "What Our Clients Say",
        items: [
            {
                quote: "This company exceeded our expectations.",
                author: "John Doe",
                position: "CEO, Example Corp"
            }
        ]
    },
    faqs: {
        title: "Frequently Asked Questions",
        items: [
            {
                question: "What services do you offer?",
                answer: "We offer a wide range of services to meet your needs."
            }
        ]
    }
};

// Load about data from backend
function loadAboutData() {
    fetch(BASE_URL + '/api/about-data')
        .then(response => response.json())
        .then(data => {
            if (data.success || data.hero) {
                aboutData = { ...aboutData, ...data };
            }
            console.log(data)
            populateAboutForm();
        })
        .catch(() => {
            // Fallback to localStorage or default values
            const saved = localStorage.getItem('aboutData');
            if (saved) {
                aboutData = { ...aboutData, ...JSON.parse(saved) };
            }
            populateAboutForm();
        });
}

// Populate about form with current data
function populateAboutForm() {
    // Hero section - fix field names to match HTML
    const aboutHeroTitle = document.getElementById('aboutHeroTitle');
    const aboutHeroDescription = document.getElementById('aboutHeroDescription'); // Changed from aboutHeroSubtitle
    
    if (aboutHeroTitle) aboutHeroTitle.value = aboutData.hero?.title || '';
    if (aboutHeroDescription) aboutHeroDescription.value = aboutData.hero?.description || ''; // Changed from subtitle
    
    // About Us section
    const aboutUsTitle = document.getElementById('aboutUsTitle');
    const aboutUsDescription = document.getElementById('aboutUsDescription');
    
    if (aboutUsTitle) aboutUsTitle.value = aboutData.aboutUs?.title || '';
    if (aboutUsDescription) aboutUsDescription.value = aboutData.aboutUs?.description || '';
    
    // Values section
    const valuesTitle = document.getElementById('valuesTitle');
    if (valuesTitle) valuesTitle.value = aboutData.values?.title || '';
    
    // Check if values items exist and render them
    if (aboutData.values?.items) {
        renderValuesEditor(aboutData.values.items);
    }
    
    // Motto section
    const mottoTitle = document.getElementById('mottoTitle');
    const mottoDescription1 = document.getElementById('mottoDescription1');
    const mottoDescription2 = document.getElementById('mottoDescription2');
    const mottoImage = document.getElementById('mottoImage');
    
    if (mottoTitle) mottoTitle.value = aboutData.motto?.title || '';
    if (mottoDescription1) mottoDescription1.value = aboutData.motto?.description1 || '';
    if (mottoDescription2) mottoDescription2.value = aboutData.motto?.description2 || '';
    if (mottoImage) mottoImage.value = aboutData.motto?.image || '';
    
    // Testimonials section - fix data structure
    const testimonialsTitle = document.getElementById('testimonialsTitle');
    if (testimonialsTitle) testimonialsTitle.value = 'What Our Clients Say'; // Default title
    
    // The backend has testimonials as array, not nested in object
    if (aboutData.testimonials && Array.isArray(aboutData.testimonials)) {
        renderTestimonialsEditor(aboutData.testimonials);
    }
    
    // FAQs section - fix data structure  
    const faqsTitle = document.getElementById('faqsTitle');
    if (faqsTitle) faqsTitle.value = 'Frequently Asked Questions'; // Default title
    
    // The backend has faqs as array, not nested in object
    if (aboutData.faqs && Array.isArray(aboutData.faqs)) {
        renderFaqsEditor(aboutData.faqs);
    }
    
    // Show image previews if URLs exist
    if (aboutData.motto?.image) {
        showImagePreview('mottoImagePreview', 'mottoImagePreviewImg', aboutData.motto.image);
    }
    
    console.log('About form populated with data:', aboutData);
}

// Render values editor
function renderValuesEditor(values) {
    const list = document.getElementById('valuesList');
    list.innerHTML = '';
    values.forEach((value, i) => {
        const div = document.createElement('div');
        div.className = 'border p-4 rounded-lg space-y-3';
        div.innerHTML = `
            <div class="flex gap-3">
                <input type="text" placeholder="Number (e.g., 01)" value="${value.number || ''}" class="border rounded p-2 w-20" data-field="number" data-idx="${i}" />
                <input type="text" placeholder="Title" value="${value.title || ''}" class="border rounded p-2 flex-1" data-field="title" data-idx="${i}" />
                <button type="button" class="bg-red-500 text-white px-3 py-1 rounded removeValueBtn" data-idx="${i}">Remove</button>
            </div>
            <textarea placeholder="Description" class="border rounded p-2 w-full min-h-[80px]" data-field="description" data-idx="${i}">${value.description || ''}</textarea>
        `;
        list.appendChild(div);
    });
}

// Render testimonials editor
function renderTestimonialsEditor(testimonials) {
    const list = document.getElementById('testimonialsList');
    list.innerHTML = '';
    testimonials.forEach((testimonial, i) => {
        const div = document.createElement('div');
        div.className = 'border p-4 rounded-lg space-y-3';
        div.innerHTML = `
            <textarea placeholder="Quote" class="border rounded p-2 w-full min-h-[80px]" data-field="quote" data-idx="${i}">${testimonial.quote || ''}</textarea>
            <div class="flex gap-3">
                <input type="text" placeholder="Author" value="${testimonial.author || ''}" class="border rounded p-2 flex-1" data-field="author" data-idx="${i}" />
                <input type="text" placeholder="Position" value="${testimonial.position || ''}" class="border rounded p-2 flex-1" data-field="position" data-idx="${i}" />
                <button type="button" class="bg-red-500 text-white px-3 py-1 rounded removeTestimonialBtn" data-idx="${i}">Remove</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Render FAQs editor
function renderFaqsEditor(faqs) {
    const list = document.getElementById('faqsList');
    list.innerHTML = '';
    faqs.forEach((faq, i) => {
        const div = document.createElement('div');
        div.className = 'border p-4 rounded-lg space-y-3';
        div.innerHTML = `
            <input type="text" placeholder="Question" value="${faq.question || ''}" class="border rounded p-2 w-full" data-field="question" data-idx="${i}" />
            <textarea placeholder="Answer" class="border rounded p-2 w-full min-h-[80px]" data-field="answer" data-idx="${i}">${faq.answer || ''}</textarea>
            <button type="button" class="bg-red-500 text-white px-3 py-1 rounded removeFaqBtn" data-idx="${i}">Remove</button>
        `;
        list.appendChild(div);
    });
}

// Show image preview helper
function showImagePreview(previewId, imgId, url) {
    const preview = document.getElementById(previewId);
    const img = document.getElementById(imgId);
    if (preview && img) {
        img.src = url;
        preview.classList.remove('hidden');
    }
}

// Handle about hero image upload
document.getElementById('aboutHeroImageFile')?.addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(BASE_URL + '/api/upload-image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success && data.url) {
            if (!aboutData.hero) aboutData.hero = {};
            aboutData.hero.image = data.url;
            const aboutHeroImageInput = document.getElementById('aboutHeroImage');
            if (aboutHeroImageInput) aboutHeroImageInput.value = data.url;
            showImagePreview('aboutHeroImagePreview', 'aboutHeroImagePreviewImg', data.url);
        } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Upload failed: ' + error.message);
    }
});

// Handle motto image upload
document.getElementById('mottoImageFile')?.addEventListener('change', async function(e) {
    const file = this.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch(BASE_URL + '/api/upload-image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.success && data.url) {
            aboutData.motto.image = data.url;
            document.getElementById('mottoImage').value = data.url;
            showImagePreview('mottoImagePreview', 'mottoImagePreviewImg', data.url);
        } else {
            alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Upload failed: ' + error.message);
    }
});

// Handle image URL input changes
document.getElementById('aboutHeroImage')?.addEventListener('input', function(e) {
    const url = this.value;
    if (!aboutData.hero) aboutData.hero = {};
    aboutData.hero.image = url;
    if (url) {
        showImagePreview('aboutHeroImagePreview', 'aboutHeroImagePreviewImg', url);
    } else {
        document.getElementById('aboutHeroImagePreview')?.classList.add('hidden');
    }
});

document.getElementById('mottoImage')?.addEventListener('input', function(e) {
    const url = this.value;
    aboutData.motto.image = url;
    if (url) {
        showImagePreview('mottoImagePreview', 'mottoImagePreviewImg', url);
    } else {
        document.getElementById('mottoImagePreview')?.classList.add('hidden');
    }
});

// Add event listeners for dynamic content
document.addEventListener('click', function(e) {
    // Add value button
    if (e.target.id === 'addValueBtn') {
        if (!aboutData.values) aboutData.values = { items: [] };
        if (!aboutData.values.items) aboutData.values.items = [];
        aboutData.values.items.push({ number: '', title: '', description: '' });
        renderValuesEditor(aboutData.values.items);
    }
    
    // Remove value button
    if (e.target.classList.contains('removeValueBtn')) {
        const idx = parseInt(e.target.dataset.idx);
        if (aboutData.values?.items) {
            aboutData.values.items.splice(idx, 1);
            renderValuesEditor(aboutData.values.items);
        }
    }
    
    // Add testimonial button
    if (e.target.id === 'addTestimonialBtn') {
        if (!Array.isArray(aboutData.testimonials)) aboutData.testimonials = [];
        aboutData.testimonials.push({ quote: '', author: '', position: '' });
        renderTestimonialsEditor(aboutData.testimonials);
    }
    
    // Remove testimonial button
    if (e.target.classList.contains('removeTestimonialBtn')) {
        const idx = parseInt(e.target.dataset.idx);
        if (Array.isArray(aboutData.testimonials)) {
            aboutData.testimonials.splice(idx, 1);
            renderTestimonialsEditor(aboutData.testimonials);
        }
    }
    
    // Add FAQ button
    if (e.target.id === 'addFaqBtn') {
        if (!Array.isArray(aboutData.faqs)) aboutData.faqs = [];
        aboutData.faqs.push({ question: '', answer: '' });
        renderFaqsEditor(aboutData.faqs);
    }
    
    // Remove FAQ button
    if (e.target.classList.contains('removeFaqBtn')) {
        const idx = parseInt(e.target.dataset.idx);
        if (Array.isArray(aboutData.faqs)) {
            aboutData.faqs.splice(idx, 1);
            renderFaqsEditor(aboutData.faqs);
        }
    }
});

// Handle input changes for dynamic content
document.addEventListener('input', function(e) {
    const target = e.target;
    const field = target.dataset.field;
    const idx = parseInt(target.dataset.idx);
    
    if (field && !isNaN(idx)) {
        // Values section
        if (target.closest('#valuesList')) {
            if (!aboutData.values) aboutData.values = { items: [] };
            if (!aboutData.values.items[idx]) aboutData.values.items[idx] = {};
            aboutData.values.items[idx][field] = target.value;
        }
        // Testimonials section
        else if (target.closest('#testimonialsList')) {
            if (!Array.isArray(aboutData.testimonials)) aboutData.testimonials = [];
            if (!aboutData.testimonials[idx]) aboutData.testimonials[idx] = {};
            aboutData.testimonials[idx][field] = target.value;
        }
        // FAQs section
        else if (target.closest('#faqsList')) {
            if (!Array.isArray(aboutData.faqs)) aboutData.faqs = [];
            if (!aboutData.faqs[idx]) aboutData.faqs[idx] = {};
            aboutData.faqs[idx][field] = target.value;
        }
    }
    
    // Handle other form inputs - fix field names
    if (target.id === 'aboutHeroTitle') {
        if (!aboutData.hero) aboutData.hero = {};
        aboutData.hero.title = target.value;
    }
    if (target.id === 'aboutHeroDescription') { // Changed from aboutHeroSubtitle
        if (!aboutData.hero) aboutData.hero = {};
        aboutData.hero.description = target.value; // Changed from subtitle
    }
    if (target.id === 'aboutUsTitle') {
        if (!aboutData.aboutUs) aboutData.aboutUs = {};
        aboutData.aboutUs.title = target.value;
    }
    if (target.id === 'aboutUsDescription') {
        if (!aboutData.aboutUs) aboutData.aboutUs = {};
        aboutData.aboutUs.description = target.value;
    }
    if (target.id === 'valuesTitle') {
        if (!aboutData.values) aboutData.values = {};
        aboutData.values.title = target.value;
    }
    if (target.id === 'mottoTitle') {
        if (!aboutData.motto) aboutData.motto = {};
        aboutData.motto.title = target.value;
    }
    if (target.id === 'mottoDescription1') {
        if (!aboutData.motto) aboutData.motto = {};
        aboutData.motto.description1 = target.value;
    }
    if (target.id === 'mottoDescription2') {
        if (!aboutData.motto) aboutData.motto = {};
        aboutData.motto.description2 = target.value;
    }
    if (target.id === 'mottoImage') {
        if (!aboutData.motto) aboutData.motto = {};
        aboutData.motto.image = target.value;
    }
});

// Handle about form submission
document.getElementById('aboutEditor')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Save to backend
        const response = await fetch(BASE_URL + '/api/save-about', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aboutData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('About page content saved successfully!');
            // Also save to localStorage as backup
            localStorage.setItem('aboutData', JSON.stringify(aboutData));
        } else {
            alert('Failed to save: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error saving: ' + error.message);
        // Save to localStorage as fallback
        localStorage.setItem('aboutData', JSON.stringify(aboutData));
    }
});

// Handle cancel button
document.getElementById('cancelAboutEditBtn')?.addEventListener('click', function() {
    loadAboutData(); // Reload original data
});

// Handle preview button
document.getElementById('previewAboutBtn')?.addEventListener('click', function() {
    // Save current data to localStorage for preview
    localStorage.setItem('aboutData', JSON.stringify(aboutData));
    window.open('about.html', '_blank');
});

// Initialize about data when about section is accessed
document.addEventListener('DOMContentLoaded', function() {
    // Load about data when the about section becomes visible
    const aboutSection = document.getElementById('about');
    if (aboutSection && !aboutSection.classList.contains('hidden')) {
        loadAboutData();
    }
    
    // Also load when about nav is clicked - fix the selector
    document.querySelector('a[href="#about"]')?.addEventListener('click', function() {
        setTimeout(loadAboutData, 100); // Small delay to ensure section is visible
    });
});

