(function () {
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;
    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("active", position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("active", position === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var normalize = function (value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  };

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-filter-input]");
    var typeSelect = scope.querySelector("[data-filter-type]");
    var yearSelect = scope.querySelector("[data-filter-year]");
    var regionSelect = scope.querySelector("[data-filter-region]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    var apply = function () {
      var query = normalize(input ? input.value : "");
      var typeValue = normalize(typeSelect ? typeSelect.value : "");
      var yearValue = normalize(yearSelect ? yearSelect.value : "");
      var regionValue = normalize(regionSelect ? regionSelect.value : "");
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));
        var typeOk = !typeValue || normalize(card.getAttribute("data-type")).indexOf(typeValue) !== -1;
        var yearOk = !yearValue || normalize(card.getAttribute("data-year")).indexOf(yearValue) === 0;
        var regionOk = !regionValue || normalize(card.getAttribute("data-region")).indexOf(regionValue) !== -1;
        var queryOk = !query || text.indexOf(query) !== -1;
        card.classList.toggle("is-hidden", !(typeOk && yearOk && regionOk && queryOk));
      });
    };
    [input, typeSelect, yearSelect, regionSelect].forEach(function (node) {
      if (node) {
        node.addEventListener("input", apply);
        node.addEventListener("change", apply);
      }
    });
  });

  window.MoviePlayer = {
    init: function (videoId, buttonId, mediaUrl) {
      var video = document.getElementById(videoId);
      var button = document.getElementById(buttonId);
      if (!video || !button || !mediaUrl) {
        return;
      }
      var started = false;
      var hideButton = function () {
        button.classList.add("is-hidden");
        video.setAttribute("controls", "controls");
      };
      var playVideo = function () {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      };
      var start = function () {
        hideButton();
        if (started) {
          playVideo();
          return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = mediaUrl;
          video.load();
          playVideo();
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(mediaUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
        } else {
          video.src = mediaUrl;
          video.load();
          playVideo();
        }
      };
      button.addEventListener("click", start);
      video.addEventListener("click", function () {
        if (!started) {
          start();
        }
      });
    }
  };
})();
