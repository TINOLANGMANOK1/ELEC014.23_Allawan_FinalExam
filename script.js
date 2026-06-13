let currentActiveIndex = 1;

/*
 * Gallery configuration
 * Place your images/videos inside the IMGHERE/ folder (project root).
 * This array is generated from the folder contents and will be used to build slides.
 */
const galleryFiles = [
    "IMGHERE/11b0c853-5677-47f1-a1da-aeab70568980.jpg",
    "IMGHERE/65d7618f-8924-4fea-ac3a-10ff7d19d831.jpg",
    "IMGHERE/7055b03a-b611-41d1-ad4a-e66221de6ee7.jpg",
    "IMGHERE/8ae82e1a-7056-4475-a5c2-4145ea956e12.jpg",
    "IMGHERE/9a3e81ea-763e-42ea-b987-925e934bdf1f.jpg",
    "IMGHERE/f546d68d-e485-44e0-a96a-c0db41a94671.jpg",
    "IMGHERE/f91b59d9-8766-41f3-af7d-890b02bf9a0a.jpg",
    "IMGHERE/fea3e6d9-0d55-46dd-9f40-7e1256762372.jpg"
];

// Human-friendly captions for gallery images (keyed by filename)
const captionsMap = {
    "11b0c853-5677-47f1-a1da-aeab70568980.jpg": "Image 1",
    "65d7618f-8924-4fea-ac3a-10ff7d19d831.jpg": "Image 2",
    "7055b03a-b611-41d1-ad4a-e66221de6ee7.jpg": "Image 3",
    "8ae82e1a-7056-4475-a5c2-4145ea956e12.jpg": "Image 4",
    "9a3e81ea-763e-42ea-b987-925e934bdf1f.jpg": "Image 5",
    "f546d68d-e485-44e0-a96a-c0db41a94671.jpg": "Image 6",
    "f91b59d9-8766-41f3-af7d-890b02bf9a0a.jpg": "Image 7",
    "fea3e6d9-0d55-46dd-9f40-7e1256762372.jpg": "Image 8"
};

// Build the gallery slides from `galleryFiles` array
function buildGallery() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    track.innerHTML = '';

    galleryFiles.forEach((path, idx) => {
        const ext = path.split('.').pop().toLowerCase();
        const slide = document.createElement('div');
        slide.className = 'slide node-fade';

        const indexLabel = document.createElement('div');
        indexLabel.className = 'slide-index';
        indexLabel.textContent = `${String(idx+1).padStart(2,'0')} / ${galleryFiles.length}`;
        slide.appendChild(indexLabel);

        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'media-container';

        if (['mp4','webm','ogg'].includes(ext)) {
            const video = document.createElement('video');
            video.controls = true;
            const src = document.createElement('source');
            src.src = path;
            src.type = `video/${ext}`;
            video.appendChild(src);
            mediaContainer.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = path;
            img.alt = `Slide ${idx+1}`;
            mediaContainer.appendChild(img);
        }

        slide.appendChild(mediaContainer);

        // Add caption (use mapping if available)
        const caption = document.createElement('div');
        caption.className = 'slide-caption';
        const filename = path.split('/').pop();
        caption.textContent = captionsMap[filename] || filename;
        slide.appendChild(caption);

        track.appendChild(slide);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Ensure panels are visible by default (no dropdown behavior)
    const accordions = document.querySelectorAll(".modern-accordion");
    accordions.forEach(acc => {
        // visually keep the header style but disable interaction
        acc.classList.add("active");
        acc.style.cursor = 'default';
        const chevron = acc.querySelector('.chevron');
        if (chevron) chevron.style.display = 'none';
        const panel = acc.nextElementSibling;
        if (panel) {
            panel.style.maxHeight = 'none';
            panel.style.overflow = 'visible';
            panel.style.display = 'block';
        }
    });

    // 2. Initialize Slide Navigation Array Nodes & Pagination Layout
    // Build gallery slides dynamically from IMGHERE
    buildGallery();
    initializeDots();
    renderSlides(currentActiveIndex);

    // 3. Document Navigation Scroll Tracking Matrix
    window.addEventListener('scroll', executeScrollMetrics);
});

// Build Slide Indicators Dynamically
function initializeDots() {
    const slides = document.getElementsByClassName("slide");
    const container = document.getElementById("dotContainer");
    if(!container) return;
    
    container.innerHTML = ""; // Clear existing contents safely
    for(let idx = 0; idx < slides.length; idx++) {
        let dotElement = document.createElement("span");
        dotElement.className = "dot";
        dotElement.setAttribute("onclick", `jumpToSlide(${idx + 1})`);
        container.appendChild(dotElement);
    }
}

// Controller Logic for Next/Prev Actions
function changeSlide(step) {
    renderSlides(currentActiveIndex += step);
}

// Direct Navigation Index Selection
function jumpToSlide(targetIndex) {
    renderSlides(currentActiveIndex = targetIndex);
}

function renderSlides(indexPosition) {
    let slides = document.getElementsByClassName("slide");
    let indicators = document.getElementsByClassName("dot");
    
    if (slides.length === 0) return;
    
    if (indexPosition > slides.length) { currentActiveIndex = 1; }
    if (indexPosition < 1) { currentActiveIndex = slides.length; }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        
        // Context Preservation: Safely pause running media segments when moving away
        let embeddedVideo = slides[i].querySelector("video");
        if(embeddedVideo) {
            embeddedVideo.pause();
        }
    }
    
    for (let d = 0; d < indicators.length; d++) {
        indicators[d].classList.remove("active-dot");
    }
    
    slides[currentActiveIndex - 1].style.display = "block";
    if(indicators[currentActiveIndex - 1]) {
        indicators[currentActiveIndex - 1].classList.add("active-dot");
    }
}

// Window Navigation Progress Calculations
function executeScrollMetrics() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("progressBar");
    if(bar) {
        bar.style.width = scrolled + "%";
    }

    // Dynamic Navigation Highlighting
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-dock a");
    
    let currentSectionId = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
            currentSectionId = section.getAttribute("id");
        }
    });

    if (currentSectionId) {
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }
}