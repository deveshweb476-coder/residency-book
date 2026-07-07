/* ═══════════════════════════════════════════════════════════════
   DR. DEVESH BHARGUDE — main.js
   Hero mosaic, GSAP entrance, Section 2 chapter hover,
   Modal, Journey scroll-reveal, Gallery 3D carousel, Feedback
   ═══════════════════════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   HERO: Book-cover mosaic background
   Fills the top panel with 28 tiles (7 cols × 4 rows)
   ═══════════════════════════════════════════════════════════════ */
(function initHeroMosaic() {
    var mosaic = document.getElementById('heroMosaic');
    if (!mosaic) return;

    // Medical / book-themed Unsplash images for the mosaic grid
    var mosaicImages = [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1551076805-e1869033e561?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&q=60&fit=crop',
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=300&q=60&fit=crop',
        'book-cover.png',
        'book-cover.png',
        'book-cover.png'
    ];

    // 7 cols × 4 rows = 28 tiles
    var totalTiles = 28;
    for (var i = 0; i < totalTiles; i++) {
        var tile = document.createElement('div');
        tile.className = 'hero-mosaic-tile';

        var img = document.createElement('img');
        img.src = mosaicImages[i % mosaicImages.length];
        img.alt = '';
        img.loading = (i < 12) ? 'eager' : 'lazy';

        var brightness = 0.3 + (Math.random() * 0.3);
        var contrast   = 0.8 + (Math.random() * 0.4);
        img.style.filter = 'grayscale(55%) brightness(' + brightness + ') contrast(' + contrast + ')';

        tile.appendChild(img);
        mosaic.appendChild(tile);
    }

    if (window.gsap) {
        gsap.fromTo('.hero-mosaic-tile', {
            opacity: 0,
            scale: 0.88
        }, {
            opacity: 1,
            scale: 1,
            duration: 1.4,
            stagger: { amount: 1.8, from: 'random' },
            ease: 'power3.out',
            delay: 0.1
        });

        gsap.registerPlugin(ScrollTrigger);
        gsap.to('.hero-mosaic', {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-panel-top',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
})();

/* ═══════════════════════════════════════════════════════════════
   HERO: GSAP entrance timeline
   ═══════════════════════════════════════════════════════════════ */
(function heroEntrance() {
    if (!window.gsap) return;

    var tl = gsap.timeline({ delay: 0.15 });

    tl.fromTo('.hero-cred-strip', 
        { y: 16, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    )
    .fromTo('.hero-name-line1', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.95, ease: 'power4.out' }, '-=0.3'
    )
    .fromTo('.hero-tagline', 
        { y: 16, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5'
    )
    .fromTo('#heroAuthorPhoto', 
        { x: 50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, '-=0.75'
    )
    .fromTo('#hpbLeft', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6'
    )
    .fromTo('#hpbRight', 
        { x: 40, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6'
    );
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: Chapter index hover interaction (Panel B)
   ═══════════════════════════════════════════════════════════════ */
(function initSection2() {
    var items = document.querySelectorAll('.s2b-item');
    var previewContainer = document.getElementById('s2bCardContainer');
    var lastHoveredIndex = 0; // The first item is active by default

    var chapterData = [
        { num: '01', title: 'Introduction', desc: 'The transition from fresh MBBS to resident is a shock. Raw, unfiltered survival during those first brutal 36-hour shifts.', img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800&q=80' },
        { num: '02', title: 'The Reality of ICU', desc: 'Managing intensive care when exhausted — maintaining clinical judgment when stakes are life and death.', img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80' },
        { num: '03', title: 'Finding the Rhythm', desc: 'From frightened junior to confident senior — the unwritten hospital rules and leading emergency teams.', img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80' },
        { num: '04', title: 'Mental Resilience', desc: 'Maintaining humanity through the emotional toll of residency and guarding against burnout.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
        { num: '05', title: 'Exams & Preparation', desc: 'Balancing patient care with study — reading in 20 stolen minutes and retaining knowledge under pressure.', img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80' },
        { num: '06', title: 'MRCP UK Journey', desc: 'Navigating international medical exams — mindset shifts and resources to conquer the prestigious MRCP UK.', img: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=800&q=80' },
        { num: '07', title: 'The DM Pinnacle', desc: 'The grueling DM Cardiology entrance — exact steps to reach the apex of super-specialty training.', img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800&q=80' },
        { num: '08', title: 'Life Beyond the White Coat', desc: 'Finding balance, maintaining relationships, and leaving a legacy beyond the hospital walls.', img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80' }
    ];

    function activateChapter(idx) {
        if (idx === lastHoveredIndex) return;

        items.forEach(function(item) { item.classList.remove('active'); });
        items[idx].classList.add('active');

        var data = chapterData[idx];
        if (!data || !previewContainer) return;

        // Create new card
        var cardHTML = `
            <div class="s2b-chapter-photo-frame">
                <img src="${data.img}" alt="Chapter Image" class="s2b-chapter-img">
            </div>
            <button class="s2a-btn-primary btn-open-modal" style="margin-top: 25px;">Find Out More</button>
        `;

        var newCard = document.createElement('div');
        newCard.className = 's2b-chapter-card temp-card active-card';
        newCard.innerHTML = cardHTML;
        
        // Setup initial position (same as link-hover.tsx)
        newCard.style.position = 'absolute';
        previewContainer.appendChild(newCard);

        if (window.gsap) {
            // Start from bottom-left rotated
            gsap.set(newCard, {
                top: '125%',
                left: '-50%',
                rotation: -30
            });

            // Animate to normal position
            gsap.to(newCard, {
                top: '0%',
                left: '0%',
                rotation: 0,
                duration: 1.25,
                ease: 'power3.out',
                onComplete: function() {
                    // Cleanup old cards (like the React effect)
                    gsap.delayedCall(2, function() {
                        var allCards = previewContainer.querySelectorAll('.temp-card');
                        if (allCards.length > 1) {
                            Array.from(allCards).slice(0, -1).forEach(function(c) {
                                c.remove();
                            });
                        }
                    });
                }
            });
        } else {
            // Fallback: just remove old cards immediately
            var allCards = previewContainer.querySelectorAll('.temp-card');
            if (allCards.length > 1) {
                Array.from(allCards).slice(0, -1).forEach(function(c) {
                    c.remove();
                });
            }
        }
        
        lastHoveredIndex = idx;
    }

    items.forEach(function(item, idx) {
        item.addEventListener('mouseenter', function() {
            activateChapter(idx);
        });
    });
})();

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: Section 2 scroll-in animation
   ═══════════════════════════════════════════════════════════════ */
(function section2ScrollAnim() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.s2-left-inner', 
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
            trigger: '.s2-two-panel',
            start: 'top 70%',
            once: true
        }
    });

    gsap.fromTo('.s2-book-wrap', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power3.out',
        scrollTrigger: {
            trigger: '.s2-two-panel',
            start: 'top 70%',
            once: true
        }
    });

    gsap.fromTo('.s2-stats-strip', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3,
        scrollTrigger: {
            trigger: '.s2-two-panel',
            start: 'top 60%',
            once: true
        }
    });
})();

(function extraSectionsAnim() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.dedication-content p', {
        y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
        scrollTrigger: {
            trigger: '.dedication-section',
            start: 'top 80%',
            once: true
        }
    });


})();

/* ═══════════════════════════════════════════════════════════════
   READ MODAL
   ═══════════════════════════════════════════════════════════════ */
var modal        = document.getElementById('read-modal');
var btnCloseModal = document.getElementById('btn-close-modal');

if (modal && btnCloseModal) {
    // Event delegation for dynamically created "Find Out More" buttons
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-open-modal') || e.target.closest('.btn-open-modal')) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });

    btnCloseModal.addEventListener('click', function () {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: Journey Scroll-Reveal
   ═══════════════════════════════════════════════════════════════ */
(function initJourneyReveal() {
    document.body.classList.add('js-anim');

    var fadeImgs  = document.querySelectorAll('.journey-img');
    var fadeTexts = document.querySelectorAll('.journey-text-half');
    var allFade   = [];

    fadeImgs.forEach(function(el)  { allFade.push(el); });
    fadeTexts.forEach(function(el) { allFade.push(el); });
    if (!allFade.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12 });

    allFade.forEach(function(el) { observer.observe(el); });
}());

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: ABOUT THE AUTHOR (Flip Gallery)
   ═══════════════════════════════════════════════════════════════ */
(function initFlipGallery() {
    var container = document.getElementById('author-flip-gallery');
    if (!container) return;
    
    var images = [
        "gallary/IMG-20260707-WA0020.jpg",
        "gallary/IMG-20260707-WA0021.jpg",
        "gallary/IMG-20260707-WA0024.jpg",
        "gallary/IMG-20260707-WA0025.jpg",
        "gallary/IMG-20260707-WA0026.jpg",
        "gallary/IMG-20260707-WA0027.jpg"
    ];
    
    var topEl = container.querySelector('.top');
    var bottomEl = container.querySelector('.bottom');
    var overlayTopEl = container.querySelector('.overlay-top');
    var overlayBottomEl = container.querySelector('.overlay-bottom');
    var unites = [topEl, bottomEl, overlayTopEl, overlayBottomEl];
    
    var currentIndex = 0;
    var FLIP_SPEED = 750;
    var flipTiming = { duration: FLIP_SPEED, iterations: 1 };
    
    var flipAnimationTop = [
        { transform: 'rotateX(0)' },
        { transform: 'rotateX(-90deg)' },
        { transform: 'rotateX(-90deg)' }
    ];
    var flipAnimationBottom = [
        { transform: 'rotateX(90deg)' },
        { transform: 'rotateX(90deg)' },
        { transform: 'rotateX(0)' }
    ];
    
    function setActiveImage(el) {
        if (el) el.style.backgroundImage = "url('" + images[currentIndex] + "')";
    }
    
    // Initial load
    unites.forEach(setActiveImage);
    
    function updateGallery(nextIndex) {
        if (overlayTopEl.animate) {
            overlayTopEl.animate(flipAnimationTop, flipTiming);
            overlayBottomEl.animate(flipAnimationBottom, flipTiming);
        }
        
        // update images with slight delay so animation looks continuous
        unites.forEach(function(el, idx) {
            var delay = (idx === 1 || idx === 2) ? FLIP_SPEED - 200 : 0;
            setTimeout(function() { setActiveImage(el); }, delay);
        });
    }
    
    // Auto loop every 2 seconds
    setInterval(function() {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery(currentIndex);
    }, 2000);
}());

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: LIVE FEEDBACK — Star Rating + Filter + Bad Word Hide
   ═══════════════════════════════════════════════════════════════ */
(function initFeedback() {
    var form       = document.getElementById('feedback-form');
    var reviewList = document.getElementById('review-list');
    if (!form || !reviewList) return;

    // ── Bad word list ──
    var badWords = [
        'fuck','shit','bitch','asshole','bastard','cunt','dick','pussy',
        'motherfucker','faggot','nigger','chutiya','madarchod','behenchod',
        'bhenchod','saala','gaandu','randi','harami','mc','bc','lodu',
        'idiot','stupid','dumb','crap','bakwas'
    ];

    function containsBadWord(text) {
        var lower = text.toLowerCase();
        return badWords.some(function(word) {
            return lower.includes(word);
        });
    }

    // ── All submitted reviews stored in memory ──
    var allReviews = [];
    var activeFilter = 0; // 0 = show all

    // ── Build star HTML ──
    function buildStars(rating, interactive) {
        var html = '<div class="star-row' + (interactive ? ' star-input' : '') + '">';
        for (var i = 1; i <= 5; i++) {
            if (interactive) {
                html += '<span class="star" data-val="' + i + '">&#9733;</span>';
            } else {
                html += '<span class="star' + (i <= rating ? ' filled' : '') + '">&#9733;</span>';
            }
        }
        html += '</div>';
        return html;
    }

    // ── Render review cards based on active filter ──
    function renderReviews() {
        reviewList.innerHTML = '';
        var filtered = activeFilter === 0
            ? allReviews
            : allReviews.filter(function(r) { return r.rating === activeFilter; });

        if (filtered.length === 0) {
            reviewList.innerHTML = '<p class="no-reviews">No reviews yet.</p>';
            return;
        }

        filtered.forEach(function(r) {
            var card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML =
                buildStars(r.rating, false) +
                '<p class="review-text">"' + r.text + '"</p>' +
                '<p class="review-author">— ' + r.name + '</p>';
            reviewList.appendChild(card);
        });
    }

    // ── Inject star input into form ──
    var starWrapper = document.createElement('div');
    starWrapper.className = 'form-group';
    starWrapper.innerHTML =
        '<label>Your Rating</label>' +
        '<div class="star-row star-input" id="star-input">' +
            '<span class="star" data-val="1">&#9733;</span>' +
            '<span class="star" data-val="2">&#9733;</span>' +
            '<span class="star" data-val="3">&#9733;</span>' +
            '<span class="star" data-val="4">&#9733;</span>' +
            '<span class="star" data-val="5">&#9733;</span>' +
        '</div>' +
        '<input type="hidden" id="fb-rating" value="0">';

    // Insert before submit button
    var submitBtn = form.querySelector('button[type="submit"]');
    form.insertBefore(starWrapper, submitBtn);

    // Star hover + click logic
    var starInput = document.getElementById('star-input');
    var ratingInput = document.getElementById('fb-rating');
    var stars = starInput.querySelectorAll('.star');

    function highlightStars(val) {
        stars.forEach(function(s) {
            s.classList.toggle('filled', parseInt(s.dataset.val) <= val);
        });
    }

    stars.forEach(function(star) {
        star.addEventListener('mouseenter', function() {
            highlightStars(parseInt(this.dataset.val));
        });
        star.addEventListener('click', function() {
            var val = parseInt(this.dataset.val);
            ratingInput.value = val;
            highlightStars(val);
        });
    });
    starInput.addEventListener('mouseleave', function() {
        highlightStars(parseInt(ratingInput.value) || 0);
    });



    // ── Inject filter buttons above review list ──
    var filterRow = document.createElement('div');
    filterRow.className = 'review-filter-row';
    filterRow.innerHTML =
        '<button class="filter-btn active" data-val="0">All</button>' +
        '<button class="filter-btn" data-val="5">&#9733;&#9733;&#9733;&#9733;&#9733;</button>' +
        '<button class="filter-btn" data-val="4">&#9733;&#9733;&#9733;&#9733;</button>' +
        '<button class="filter-btn" data-val="3">&#9733;&#9733;&#9733;</button>' +
        '<button class="filter-btn" data-val="2">&#9733;&#9733;</button>' +
        '<button class="filter-btn" data-val="1">&#9733;</button>';

    reviewList.parentNode.insertBefore(filterRow, reviewList);

    filterRow.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterRow.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            activeFilter = parseInt(this.dataset.val);
            renderReviews();
        });
    });

    // ── Form submit ──
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameVal   = document.getElementById('fb-name').value.trim();
        var textVal   = document.getElementById('fb-text').value.trim();
        var ratingVal = parseInt(ratingInput.value);

        if (!nameVal || !textVal) return;
        if (ratingVal < 1) {
            alert('Please select a star rating!');
            return;
        }

        // Bad word check — silently block
        if (containsBadWord(textVal) || containsBadWord(nameVal)) {
            form.reset();
            ratingInput.value = 0;
            highlightStars(0);
            alert('Your feedback contains inappropriate language and was not posted.');
            return;
        }

        allReviews.unshift({
            name:   nameVal,
            text:   textVal,
            rating: ratingVal
        });

        form.reset();
        ratingInput.value = 0;
        highlightStars(0);



        // Reset filter to All
        activeFilter = 0;
        filterRow.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        filterRow.querySelector('[data-val="0"]').classList.add('active');

        renderReviews();
    });

    renderReviews();
}());

