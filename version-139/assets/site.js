(function () {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let current = 0;
        let timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
                startTimer();
            });
        });

        hero.addEventListener("mouseenter", stopTimer);
        hero.addEventListener("mouseleave", startTimer);
        showSlide(0);
        startTimer();
    }

    const searchInput = document.querySelector("[data-search-input]");
    const yearFilter = document.querySelector("[data-year-filter]");
    const typeFilter = document.querySelector("[data-type-filter]");
    const cards = Array.from(document.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
        const keyword = normalize(searchInput ? searchInput.value : "");
        const year = normalize(yearFilter ? yearFilter.value : "");
        const type = normalize(typeFilter ? typeFilter.value : "");

        cards.forEach(function (card) {
            const title = normalize(card.getAttribute("data-title"));
            const cardYear = normalize(card.getAttribute("data-year"));
            const cardType = normalize(card.getAttribute("data-type"));
            const keywordMatch = !keyword || title.indexOf(keyword) !== -1;
            const yearMatch = !year || cardYear === year;
            const typeMatch = !type || cardType.indexOf(type) !== -1;
            card.classList.toggle("is-hidden", !(keywordMatch && yearMatch && typeMatch));
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }
    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
    }
    if (typeFilter) {
        typeFilter.addEventListener("change", applyFilters);
    }

    const query = new URLSearchParams(window.location.search).get("q");
    if (query && searchInput) {
        searchInput.value = query;
        applyFilters();
    }
})();
