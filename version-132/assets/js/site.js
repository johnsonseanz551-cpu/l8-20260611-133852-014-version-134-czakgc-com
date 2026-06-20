(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var sliders = document.querySelectorAll("[data-hero-slider]");
    sliders.forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var previous = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      function play() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (previous) {
        previous.addEventListener("click", function () {
          show(index - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          play();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          play();
        });
      });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", play);
      show(0);
      play();
    });
  }

  function initFilters() {
    var scopes = document.querySelectorAll("[data-filter-scope]");
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var selects = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-select]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var empty = scope.querySelector("[data-empty-state]");
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");

      if (input && initialQuery && scope.hasAttribute("data-search-page")) {
        input.value = initialQuery;
      }

      function valueFor(name) {
        var select = scope.querySelector('[data-filter-select="' + name + '"]');
        return select ? select.value : "";
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var region = valueFor("region");
        var type = valueFor("type");
        var year = valueFor("year");
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-genre") || ""
          ].join(" ").toLowerCase();

          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (region && card.getAttribute("data-region") !== region) {
            matched = false;
          }
          if (type && card.getAttribute("data-type") !== type) {
            matched = false;
          }
          if (year && card.getAttribute("data-year") !== year) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      apply();
    });
  }

  function initPlayers() {
    var players = document.querySelectorAll("[data-video-player]");
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var source = player.getAttribute("data-video-url");
      var started = false;
      var hls = null;

      if (!video || !source) {
        return;
      }

      function attachSource() {
        if (started) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        started = true;
      }

      function startPlayback() {
        attachSource();
        if (button) {
          button.classList.add("hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            if (button) {
              button.classList.remove("hidden");
            }
          });
        }
      }

      if (button) {
        button.addEventListener("click", startPlayback);
      }

      video.addEventListener("click", function () {
        if (!started) {
          startPlayback();
        }
      });

      video.addEventListener("play", function () {
        if (button) {
          button.classList.add("hidden");
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
