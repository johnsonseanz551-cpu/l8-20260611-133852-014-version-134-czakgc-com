(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        var current = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        };

        var restart = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        };

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restart();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restart();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                restart();
            });
        });

        showSlide(0);
        start();
    }

    var pageSearch = document.querySelector('[data-page-search]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-search-text]'));
    var empty = document.querySelector('[data-empty-state]');
    var activeFilter = 'all';

    var filterCards = function () {
        if (!cards.length) {
            return;
        }
        var query = pageSearch ? pageSearch.value.trim().toLowerCase() : '';
        var visible = 0;

        cards.forEach(function (card) {
            var searchText = (card.getAttribute('data-search-text') || '').toLowerCase();
            var typeText = (card.getAttribute('data-type') || '').toLowerCase();
            var yearText = (card.getAttribute('data-year') || '').toLowerCase();
            var filterText = activeFilter.toLowerCase();
            var matchesQuery = !query || searchText.indexOf(query) !== -1;
            var matchesFilter = activeFilter === 'all' || typeText.indexOf(filterText) !== -1 || yearText.indexOf(filterText) !== -1 || searchText.indexOf(filterText) !== -1;
            var show = matchesQuery && matchesFilter;
            card.setAttribute('data-hidden', show ? 'false' : 'true');
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    };

    if (pageSearch) {
        pageSearch.addEventListener('input', filterCards);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeFilter = button.getAttribute('data-filter-value') || 'all';
            filterCards();
        });
    });

    filterCards();

    var searchInput = document.querySelector('[data-global-search]');
    var results = document.querySelector('[data-search-results]');
    var resultTitle = document.querySelector('[data-result-title]');

    var getQuery = function () {
        var params = new URLSearchParams(window.location.search);
        return (params.get('q') || '').trim();
    };

    var makeCard = function (movie) {
        var article = document.createElement('article');
        article.className = 'movie-card';

        var posterLink = document.createElement('a');
        posterLink.className = 'poster-link';
        posterLink.href = movie.url;

        var frame = document.createElement('span');
        frame.className = 'poster-frame';

        var image = document.createElement('img');
        image.src = movie.image;
        image.alt = movie.title;
        image.loading = 'lazy';

        var shine = document.createElement('span');
        shine.className = 'poster-shine';

        frame.appendChild(image);
        frame.appendChild(shine);
        posterLink.appendChild(frame);

        var body = document.createElement('div');
        body.className = 'movie-body';

        var title = document.createElement('a');
        title.className = 'movie-title';
        title.href = movie.url;
        title.textContent = movie.title;

        var meta = document.createElement('p');
        meta.className = 'movie-meta';
        meta.textContent = [movie.year, movie.region, movie.type].filter(Boolean).join(' · ');

        var desc = document.createElement('p');
        desc.className = 'movie-desc';
        desc.textContent = movie.oneLine || movie.genre || '';

        var tags = document.createElement('div');
        tags.className = 'tag-list';
        (movie.tags || []).slice(0, 3).forEach(function (tag) {
            var span = document.createElement('span');
            span.textContent = tag;
            tags.appendChild(span);
        });

        body.appendChild(title);
        body.appendChild(meta);
        body.appendChild(desc);
        body.appendChild(tags);
        article.appendChild(posterLink);
        article.appendChild(body);
        return article;
    };

    var renderSearch = function (query) {
        if (!results || typeof SITE_MOVIES === 'undefined') {
            return;
        }

        results.innerHTML = '';
        var lower = query.toLowerCase();
        var matched = SITE_MOVIES.filter(function (movie) {
            var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tagsText, movie.oneLine].join(' ').toLowerCase();
            return !lower || haystack.indexOf(lower) !== -1;
        }).slice(0, 240);

        if (resultTitle) {
            resultTitle.textContent = query ? '搜索结果' : '为你推荐';
        }

        matched.forEach(function (movie) {
            results.appendChild(makeCard(movie));
        });

        if (empty) {
            empty.classList.toggle('is-visible', matched.length === 0);
        }
    };

    if (searchInput && results) {
        var initialQuery = getQuery();
        searchInput.value = initialQuery;
        searchInput.addEventListener('input', function () {
            renderSearch(searchInput.value.trim());
        });
        renderSearch(initialQuery);
    }
})();
