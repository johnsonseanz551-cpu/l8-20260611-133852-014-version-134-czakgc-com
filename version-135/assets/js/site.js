(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initMobileNav() {
        var button = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var timer = null;

        function show(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function initHomeSearch() {
        var input = document.querySelector("[data-global-search]");
        var box = document.querySelector("[data-global-search-results]");
        var source = window.SEARCH_INDEX || [];
        if (!input || !box || !source.length) {
            return;
        }
        input.addEventListener("input", function () {
            var q = normalize(input.value);
            if (!q) {
                box.classList.remove("open");
                box.innerHTML = "";
                return;
            }
            var results = source.filter(function (item) {
                var text = normalize([item.title, item.year, item.region, item.genre, item.type, (item.tags || []).join(" ")].join(" "));
                return text.indexOf(q) !== -1;
            }).slice(0, 12);
            box.innerHTML = results.map(function (item) {
                return "<a href=\"" + item.url + "\"><strong>" + escapeHtml(item.title) + "</strong><span>" + escapeHtml(item.year + " · " + item.region) + "</span></a>";
            }).join("");
            box.classList.toggle("open", results.length > 0);
        });
        document.addEventListener("click", function (event) {
            if (!box.contains(event.target) && event.target !== input) {
                box.classList.remove("open");
            }
        });
    }

    function initFilters() {
        var grid = document.querySelector("[data-movie-grid]");
        if (!grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        var search = document.querySelector("[data-filter-search]");
        var region = document.querySelector("[data-filter-region]");
        var genre = document.querySelector("[data-filter-genre]");
        var year = document.querySelector("[data-filter-year]");
        var sort = document.querySelector("[data-filter-sort]");
        var status = document.querySelector("[data-filter-status]");
        var empty = document.querySelector("[data-empty-state]");

        function cardText(card) {
            return normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.genre,
                card.dataset.year,
                card.dataset.type,
                card.dataset.tags
            ].join(" "));
        }

        function selected(el) {
            return el ? el.value : "全部";
        }

        function apply() {
            var q = normalize(search && search.value);
            var r = selected(region);
            var g = selected(genre);
            var y = selected(year);
            var visible = 0;

            cards.forEach(function (card) {
                var ok = true;
                if (q && cardText(card).indexOf(q) === -1) {
                    ok = false;
                }
                if (r !== "全部" && card.dataset.region !== r) {
                    ok = false;
                }
                if (g !== "全部" && normalize(card.dataset.genre).indexOf(normalize(g)) === -1 && normalize(card.dataset.tags).indexOf(normalize(g)) === -1) {
                    ok = false;
                }
                if (y !== "全部" && card.dataset.year !== y) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });

            if (status) {
                status.textContent = visible ? "当前显示 " + visible + " 部影片" : "没有匹配的影片";
            }
            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }

        function reorder() {
            var mode = selected(sort);
            var sorted = cards.slice().sort(function (a, b) {
                if (mode === "title-asc") {
                    return String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-Hans-CN");
                }
                if (mode === "hot-desc") {
                    return Number(b.dataset.hot || 0) - Number(a.dataset.hot || 0);
                }
                return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
            });
            sorted.forEach(function (card) {
                grid.appendChild(card);
            });
            apply();
        }

        [search, region, genre, year].forEach(function (el) {
            if (el) {
                el.addEventListener("input", apply);
                el.addEventListener("change", apply);
            }
        });
        if (sort) {
            sort.addEventListener("change", reorder);
        }
        reorder();
    }

    function escapeHtml(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    ready(function () {
        initMobileNav();
        initHero();
        initHomeSearch();
        initFilters();
    });
}());
