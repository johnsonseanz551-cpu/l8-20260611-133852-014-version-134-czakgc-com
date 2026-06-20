(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    if (slides.length) {
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          showSlide(i);
        });
      });
      showSlide(0);
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    var filterBox = document.querySelector(".filter-box");
    if (filterBox) {
      var search = filterBox.querySelector("[data-filter-search]");
      var region = filterBox.querySelector("[data-filter-region]");
      var type = filterBox.querySelector("[data-filter-type]");
      var genre = filterBox.querySelector("[data-filter-genre]");
      var year = filterBox.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      var empty = document.querySelector(".empty-state");

      function value(el) {
        return el ? el.value.trim().toLowerCase() : "";
      }

      function runFilter() {
        var q = value(search);
        var r = value(region);
        var t = value(type);
        var g = value(genre);
        var y = value(year);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre,
            card.dataset.tags
          ].join(" ").toLowerCase();

          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (r && (card.dataset.region || "").toLowerCase().indexOf(r) === -1) {
            ok = false;
          }
          if (t && (card.dataset.type || "").toLowerCase().indexOf(t) === -1) {
            ok = false;
          }
          if (g && (card.dataset.genre || "").toLowerCase().indexOf(g) === -1 && (card.dataset.tags || "").toLowerCase().indexOf(g) === -1) {
            ok = false;
          }
          if (y && (card.dataset.year || "") !== y) {
            ok = false;
          }

          card.classList.toggle("hidden-card", !ok);
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [search, region, type, genre, year].forEach(function (el) {
        if (el) {
          el.addEventListener("input", runFilter);
          el.addEventListener("change", runFilter);
        }
      });
    }

    var video = document.querySelector("video[data-stream]");
    var cover = document.querySelector(".player-cover");
    var attached = false;

    function attachStream() {
      if (!video || attached) {
        return;
      }

      var url = video.getAttribute("data-stream");
      if (!url) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      attached = true;
    }

    function startVideo() {
      if (!video) {
        return;
      }
      attachStream();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(function () {
          if (cover) {
            cover.classList.add("is-hidden");
          }
        }).catch(function () {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      } else if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    if (cover) {
      cover.addEventListener("click", startVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          startVideo();
        } else {
          video.pause();
        }
      });
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });
      video.addEventListener("pause", function () {
        if (cover && video.currentTime < 1) {
          cover.classList.remove("is-hidden");
        }
      });
    }
  });
})();
