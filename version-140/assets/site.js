(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        function start() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        show(0);
        start();
    }

    function setupSearchRedirects() {
        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[type='search']");
                var q = input ? input.value.trim() : "";
                var base = form.getAttribute("data-search-base") || "./search.html";
                window.location.href = q ? base + "?q=" + encodeURIComponent(q) : base;
            });
        });
    }

    function setupFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var root = panel.parentElement || document;
            var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card[data-title]"));
            var search = panel.querySelector("[data-filter-search]");
            var category = panel.querySelector("[data-filter-category]");
            var year = panel.querySelector("[data-filter-year]");
            var region = panel.querySelector("[data-filter-region]");
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q") || "";

            if (search && q) {
                search.value = q;
            }

            function value(el) {
                return el ? el.value.trim().toLowerCase() : "";
            }

            function apply() {
                var term = value(search);
                var cat = value(category);
                var yr = value(year);
                var reg = value(region);
                cards.forEach(function (card) {
                    var text = [
                        card.dataset.title,
                        card.dataset.tags,
                        card.dataset.region,
                        card.dataset.year,
                        card.dataset.category,
                        card.dataset.type
                    ].join(" ").toLowerCase();
                    var visible = true;
                    if (term && text.indexOf(term) === -1) {
                        visible = false;
                    }
                    if (cat && (card.dataset.category || "").toLowerCase() !== cat) {
                        visible = false;
                    }
                    if (yr && (card.dataset.year || "").toLowerCase() !== yr) {
                        visible = false;
                    }
                    if (reg && (card.dataset.region || "").toLowerCase().indexOf(reg) === -1) {
                        visible = false;
                    }
                    card.hidden = !visible;
                    var holder = card.closest("li");
                    if (holder && holder.parentElement && holder.parentElement.classList.contains("ranking-list")) {
                        holder.hidden = !visible;
                    }
                });
            }

            [search, category, year, region].forEach(function (el) {
                if (el) {
                    el.addEventListener("input", apply);
                    el.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    ready(function () {
        setupMobileMenu();
        setupHero();
        setupSearchRedirects();
        setupFilters();
    });
}());
