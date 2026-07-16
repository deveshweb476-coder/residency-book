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
        { num: '01', title: 'Introduction', desc: 'The transition from fresh MBBS to resident is a shock. Raw, unfiltered survival during those first brutal 36-hour shifts.', img: 'assets/toc/1.jpeg' },
        { num: '02', title: 'Fitness', desc: 'Why lifting heavy and staying active is the ultimate counter to the brutal physical demands of residency.', img: 'assets/toc/2.jpg' },
        { num: '03', title: 'Nutrition', desc: 'Fueling your body for 36-hour shifts without relying on hospital cafeteria junk.', img: 'assets/toc/3.jpg' },
        { num: '04', title: 'Mindset', desc: 'Developing an unbreakable psychological baseline to handle stress, loss, and exhaustion.', img: 'assets/toc/4.jpg' },
        { num: '05', title: 'Finances', desc: 'Managing resident stipends, avoiding debt traps, and building long-term wealth early.', img: 'assets/toc/5.jpg' },
        { num: '06', title: 'Relationships & Social Wealth', desc: 'Keeping your personal life alive when the hospital demands everything from you.', img: 'assets/toc/6.jpg' },
        { num: '07', title: 'Clinical Efficiency', desc: 'How to work smarter, not harder on the wards. Master the unwritten rules of hospital workflow.', img: 'assets/toc/7.jpg' },
        { num: '08', title: 'Mental Health', desc: 'Recognizing burnout and depression before they consume you. It is okay to not be okay.', img: 'assets/toc/8.jpg' },
        { num: '09', title: 'Depersonalization', desc: 'The silent crisis in modern medicine. Reconnecting with your humanity when you feel numb.', img: 'assets/toc/9.jpg' },
        { num: '10', title: 'Building CV', desc: 'Strategically positioning yourself for fellowships, publications, and competitive opportunities.', img: 'assets/toc/10.jpg' },
        { num: '11', title: 'Sex Transmutation', desc: 'Channeling raw personal energy into intense focus, discipline, and professional excellence.', img: 'assets/toc/11.jpg' },
        { num: '12', title: 'What to Expect from Residency?', desc: 'A pragmatic, no-nonsense look at the realities, politics, and triumphs of postgraduate training.', img: 'assets/toc/12.jpeg' },
        { num: '13', title: 'The Only Good Habits That Matter', desc: 'Stripping away the noise to focus on the daily micro-habits that actually move the needle.', img: 'toc-page187.jpg' },
        { num: '14', title: 'Finale', desc: 'Looking back on the journey, leaving a legacy, and moving forward as a complete physician.', img: 'toc-page202.jpg' }
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

    gsap.to('.hpb-book-wrap', {
        opacity: 1,
        y: 0,
        rotationY: -12,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.hero-panel-bottom',
            start: 'top 80%',
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
    document.body.addEventListener('click', function (e) {
        // Open modal
        var openBtn = e.target.closest('.btn-open-modal');
        if (openBtn) {
            var targetSelector = openBtn.getAttribute('data-target') || '#read-modal';
            var targetModal = document.querySelector(targetSelector);
            if (targetModal) {
                targetModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Close modal (via close button)
        var closeBtn = e.target.closest('.btn-close-modal');
        if (closeBtn) {
            var openModal = closeBtn.closest('.read-modal');
            if (openModal) {
                openModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
        
        // Close modal (via overlay click)
        if (e.target.classList.contains('read-modal')) {
            e.target.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

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

    // ── Supabase Setup ──
    var SUPABASE_URL = 'https://tjhtplbngkyziktmdmer.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaHRwbGJuZ2t5emlrdG1kbWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NzgyNzgsImV4cCI6MjA5OTI1NDI3OH0.vptfim9HXQur1y89XZHUuOc7uH0pcvZj8HH8XHyk520';
    
    var supabaseClient = null;
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // ── All submitted reviews stored in memory ──
    var allReviews = [];
    var activeFilter = 0; // 0 = show all

    // ── Fetch Reviews from Supabase ──
    async function fetchReviews() {
        if (!supabaseClient) {
            // Fallback to local storage if Supabase isn't configured yet
            var savedReviews = localStorage.getItem("drDeveshReviews");
            allReviews = savedReviews ? JSON.parse(savedReviews) : [];
            renderReviews();
            return;
        }

        var { data, error } = await supabaseClient
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (!error && data) {
            allReviews = data;
            renderReviews();
        }
    }
    fetchReviews();


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

    // ── XSS Prevention Helper ──
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, function(tag) {
            var charsToReplace = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            };
            return charsToReplace[tag] || tag;
        });
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
            var safeText = escapeHTML(r.text);
            var safeName = escapeHTML(r.name);
            card.innerHTML =
                buildStars(r.rating, false) +
                '<p class="review-text">"' + safeText + '"</p>' +
                '<p class="review-author">— ' + safeName + '</p>';
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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        var nameVal   = document.getElementById('fb-name').value.trim();
        var textVal   = document.getElementById('fb-text').value.trim();
        var ratingVal = parseInt(ratingInput.value);

        if (!nameVal || !textVal) return;
        if (ratingVal < 1) {
            alert('Please select a star rating!');
            return;
        }

        // ── Rate Limiting (60 seconds cooldown) ──
        var lastSubTime = localStorage.getItem('last_review_submit');
        if (lastSubTime) {
            var diff = Date.now() - parseInt(lastSubTime);
            if (diff < 60000) {
                var waitTime = Math.ceil((60000 - diff) / 1000);
                alert('Please wait ' + waitTime + ' seconds before submitting another review to prevent spam.');
                return;
            }
        }

        // Bad word check — silently block
        if (containsBadWord(textVal) || containsBadWord(nameVal)) {
            form.reset();
            ratingInput.value = 0;
            highlightStars(0);
            alert('Your feedback contains inappropriate language and was not posted.');
            return;
        }

        var newReview = {
            name:   nameVal,
            text:   textVal,
            rating: ratingVal
        };

        if (supabaseClient) {
            // Push to Supabase
            var { error } = await supabaseClient.from('reviews').insert([newReview]);
            if (error) {
                console.error('Error saving review:', error);
                alert('Error saving review. Please try again.');
                return;
            }
        }

        // Add to local UI array immediately
        allReviews.unshift(newReview);
        
        // Update rate limit timestamp
        localStorage.setItem('last_review_submit', Date.now().toString());

        // Fallback save to local storage if Supabase isn't setup
        if (!supabaseClient) {
            localStorage.setItem("drDeveshReviews", JSON.stringify(allReviews));
        }

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


/* ==========================================================================
   Checkout Modal & Razorpay Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const checkoutOverlay = document.getElementById('checkoutModalOverlay');
    const checkoutClose = document.getElementById('btnCheckoutClose');
    const formStep = document.getElementById('checkout-form-step');
    const successStep = document.getElementById('checkout-success-step');
    const checkoutForm = document.getElementById('checkoutForm');
    const btnProceed = document.getElementById('btn-proceed-payment');
    
    // Buttons that open checkout
    const directBuyBtns = document.querySelectorAll('.btn-buy-direct, .btn-buy-direct-chapter');
    
    function openCheckout() {
        formStep.style.display = 'block';
        successStep.style.display = 'none';
        checkoutForm.reset();
        btnProceed.textContent = 'Proceed to Payment';
        
        // Fetch dynamic price
        fetch('/api/get-price')
            .then(res => res.json())
            .then(data => {
                if (data.price) {
                    btnProceed.textContent = `Proceed to Payment (₹${data.price})`;
                }
            })
            .catch(err => console.error('Failed to fetch price:', err));

        checkoutOverlay.classList.add('active');
    }
    
    function closeCheckout() {
        checkoutOverlay.classList.remove('active');
    }
    
    directBuyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCheckout();
        });
    });
    
    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }
    
    checkoutOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutOverlay) closeCheckout();
    });
    
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('buyerName').value;
        const email = document.getElementById('buyerEmail').value;
        
        if (!name || !email) return alert('Name and email are required');
        
        btnProceed.disabled = true;
        btnProceed.textContent = 'Processing...';
        
        try {
            // 1. Create order
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to create order');
            }
            
            // 2. Open Razorpay or show download if already paid
            if (data.alreadyPaid) {
                // Show success step directly
                formStep.style.display = 'none';
                successStep.style.display = 'block';
                const successTitle = successStep.querySelector('h2');
                if (successTitle) successTitle.textContent = 'Already Purchased!';
                const successDesc = successStep.querySelector('p');
                if (successDesc) successDesc.textContent = 'You have already purchased this e-book. You can download it below.';
                document.getElementById('direct-download-link').href = data.downloadLink;
                return;
            }

            const options = {
                key: data.key_id, // Pulled from the backend securely
                amount: data.amount,
                currency: "INR",
                name: "Dr. Devesh Bhargude",
                description: "Redefining Residency Life In Your Own Terms",
                order_id: data.orderId,
                handler: async function (response) {
                    btnProceed.textContent = 'Verifying...';
                    // 3. Verify payment
                    try {
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        const verifyData = await verifyRes.json();
                        
                        if (verifyRes.ok && verifyData.success) {
                            // Show success step
                            formStep.style.display = 'none';
                            successStep.style.display = 'block';
                            document.getElementById('direct-download-link').href = verifyData.downloadLink;
                        } else {
                            alert('Payment verification failed. If money was deducted, please contact support.');
                            btnProceed.disabled = false;
                            btnProceed.textContent = 'Proceed to Payment';
                        }
                    } catch (err) {
                        alert('Error verifying payment.');
                        btnProceed.disabled = false;
                        btnProceed.textContent = 'Proceed to Payment';
                    }
                },
                prefill: {
                    name: name,
                    email: email
                },
                theme: {
                    color: "#D4AF37"
                }
            };
            
            // Note: We need to pull Razorpay key from somewhere. For now, it will fail until the user provides it.
            // Ideally we fetch it from a non-secret endpoint or inject it.
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment failed: ' + response.error.description);
                btnProceed.disabled = false;
                btnProceed.textContent = 'Proceed to Payment';
            });
            rzp.open();
            
        } catch (error) {
            alert('Error: ' + error.message);
            btnProceed.disabled = false;
            btnProceed.textContent = 'Proceed to Payment';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() { document.querySelectorAll('.hpb-book-wrap').forEach(function(wrap) { wrap.addEventListener('mouseenter', function() { if (window.gsap) { gsap.to(wrap, { rotationY: -5, scale: 1.05, y: -10, duration: 0.4, ease: 'power2.out' }); } }); wrap.addEventListener('mouseleave', function() { if (window.gsap) { gsap.to(wrap, { rotationY: -12, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }); } }); }); document.querySelectorAll('.footer-book-cover img').forEach(function(img) { img.addEventListener('mouseenter', function() { if (window.gsap) { gsap.to(img, { scale: 1.1, y: -10, rotationZ: 2, duration: 0.4, ease: 'back.out(1.7)' }); } }); img.addEventListener('mouseleave', function() { if (window.gsap) { gsap.to(img, { scale: 1, y: 0, rotationZ: 0, duration: 0.4, ease: 'power2.out' }); } }); }); });
