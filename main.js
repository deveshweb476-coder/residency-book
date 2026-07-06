// == Navbar scroll effect ==
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// == Section 2: Interactive Chapter Hover ==
var indexItems = document.querySelectorAll('.idx-item');
var summaryTexts = document.querySelectorAll('.summary-text');
var featureImages = document.querySelectorAll('.feat-img');

indexItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
        indexItems.forEach(function (i) { i.classList.remove('active'); });
        summaryTexts.forEach(function (s) { s.classList.remove('active'); });
        featureImages.forEach(function (img) { img.classList.remove('active'); });

        item.classList.add('active');

        var targetId = item.getAttribute('data-target');
        var targetSummary = document.getElementById(targetId);
        if (targetSummary) targetSummary.classList.add('active');

        var targetImg = document.getElementById('img-' + targetId);
        if (targetImg) targetImg.classList.add('active');
    });
});

// == Read Modal Logic ==
var btnExplore = document.getElementById('btn-explore-book');
var modal = document.getElementById('read-modal');
var btnCloseModal = document.getElementById('btn-close-modal');

if (btnExplore && modal && btnCloseModal) {
    btnExplore.addEventListener('click', function () {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
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

// == Section 3: Journey Scroll-Reveal ==
// Add .js-anim to body so CSS opacity:0 states apply (progressive enhancement)
// Then observe and add .is-visible when each element enters the viewport
(function () {
    // Step 1: Opt in — this tells CSS to hide elements initially
    document.body.classList.add('js-anim');

    // Step 2: Collect all images and text halves
    var fadeImgs = document.querySelectorAll('.journey-img');
    var fadeTexts = document.querySelectorAll('.journey-text-half');
    var allFade = [];

    fadeImgs.forEach(function (el) { allFade.push(el); });
    fadeTexts.forEach(function (el) { allFade.push(el); });

    if (!allFade.length) return;

    // Step 3: Observe — add .is-visible when 12% in viewport
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12
    });

    allFade.forEach(function (el) {
        observer.observe(el);
    });
}());

/* ══════════════════════════════════════════════════════════
   SECTION 4: 3D CAROUSEL GALLERY
══════════════════════════════════════════════════════════ */
(function initCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!cards.length) return;

    let activeIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        cards.forEach((card, i) => {
            card.className = 'carousel-card'; // reset classes
            
            // Calculate relative offset
            let offset = i - activeIndex;
            
            if (offset === 0) {
                card.classList.add('active');
            } else if (offset === -1 || (activeIndex === 0 && i === totalCards - 1)) {
                card.classList.add('prev-1');
            } else if (offset === 1 || (activeIndex === totalCards - 1 && i === 0)) {
                card.classList.add('next-1');
            } else if (offset === -2 || (activeIndex === 0 && i === totalCards - 2) || (activeIndex === 1 && i === totalCards - 1)) {
                card.classList.add('prev-2');
            } else if (offset === 2 || (activeIndex === totalCards - 1 && i === 1) || (activeIndex === totalCards - 2 && i === 0)) {
                card.classList.add('next-2');
            } else {
                card.classList.add('hidden-card');
            }
        });
    }

    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            activeIndex = (activeIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            activeIndex = (activeIndex + 1) % totalCards;
            updateCarousel();
        });
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            activeIndex = index;
            updateCarousel();
        });
    });

    // Initial setup
    updateCarousel();
})();

/* ══════════════════════════════════════════════════════════
   SECTION 5: LIVE FEEDBACK FORM
══════════════════════════════════════════════════════════ */
(function initFeedback() {
    const form = document.getElementById('feedback-form');
    const reviewList = document.getElementById('review-list');
    if (!form || !reviewList) return;

    // A simple profanity filter array
    const badWords = ['badword', 'idiot', 'stupid', 'dumb', 'crap', 'shit'];

    function filterProfanity(text) {
        let filtered = text;
        badWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '***');
        });
        return filtered;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('fb-name');
        const roleInput = document.getElementById('fb-role');
        const textInput = document.getElementById('fb-text');
        
        const name = filterProfanity(nameInput.value.trim());
        let role = filterProfanity(roleInput.value.trim());
        const text = filterProfanity(textInput.value.trim());
        
        if (!name || !text) return;
        
        let authorText = `— ${name}`;
        if (role) {
            authorText += `, ${role}`;
        }

        // Create new review element
        const newReview = document.createElement('div');
        newReview.className = 'review-card';
        newReview.innerHTML = `
            <p class="review-text">"${text}"</p>
            <p class="review-author">${authorText}</p>
        `;
        
        // Add to the top of the list
        reviewList.prepend(newReview);
        
        // Reset form
        form.reset();
    });
})();
