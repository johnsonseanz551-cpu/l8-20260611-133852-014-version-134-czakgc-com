(function () {
    function initMobileNav() {
        const toggle = document.querySelector('[data-mobile-toggle]');
        const nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        const hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        let current = 0;
        let timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function initFilters() {
        const toolbar = document.querySelector('[data-filter-toolbar]');
        const grid = document.querySelector('[data-card-grid]');
        if (!toolbar || !grid) {
            return;
        }
        const keywordInput = toolbar.querySelector('[data-filter-keyword]');
        const regionSelect = toolbar.querySelector('[data-filter-region]');
        const typeSelect = toolbar.querySelector('[data-filter-type]');
        const yearSelect = toolbar.querySelector('[data-filter-year]');
        const resetButton = toolbar.querySelector('[data-filter-reset]');
        const countNode = toolbar.querySelector('[data-filter-count]');
        const emptyState = document.querySelector('[data-empty-state]');
        const cards = Array.from(grid.querySelectorAll('[data-search-card]'));
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q') || '';

        if (keywordInput && initialQuery) {
            keywordInput.value = initialQuery;
        }

        function applyFilter() {
            const keyword = normalize(keywordInput ? keywordInput.value : '');
            const region = normalize(regionSelect ? regionSelect.value : '');
            const type = normalize(typeSelect ? typeSelect.value : '');
            const yearBucket = normalize(yearSelect ? yearSelect.value : '');
            let visibleCount = 0;

            cards.forEach(function (card) {
                const searchText = normalize(card.getAttribute('data-search'));
                const cardRegion = normalize(card.getAttribute('data-region'));
                const cardType = normalize(card.getAttribute('data-type'));
                const cardYearBucket = normalize(card.getAttribute('data-year-bucket'));
                const matched =
                    (!keyword || searchText.indexOf(keyword) !== -1) &&
                    (!region || cardRegion === region) &&
                    (!type || cardType === type) &&
                    (!yearBucket || cardYearBucket === yearBucket);
                card.hidden = !matched;
                if (matched) {
                    visibleCount += 1;
                }
            });

            if (countNode) {
                countNode.textContent = String(visibleCount);
            }
            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        }

        [keywordInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (keywordInput) {
                    keywordInput.value = '';
                }
                if (regionSelect) {
                    regionSelect.value = '';
                }
                if (typeSelect) {
                    typeSelect.value = '';
                }
                if (yearSelect) {
                    yearSelect.value = '';
                }
                applyFilter();
            });
        }

        applyFilter();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initHero();
        initFilters();
    });
}());
