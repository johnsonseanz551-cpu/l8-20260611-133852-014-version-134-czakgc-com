(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setSlide(activeSlide + 1);
    }, 5200);
  }

  setSlide(0);

  document.querySelectorAll('[data-filter-area]').forEach(function (area) {
    var section = area.closest('main') || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll('[data-card]'));
    var keywordInput = area.querySelector('[data-filter-keyword]');
    var regionSelect = area.querySelector('[data-filter-region]');
    var yearSelect = area.querySelector('[data-filter-year]');
    var categorySelect = area.querySelector('[data-filter-category]');
    var empty = section.querySelector('[data-empty-filter]');

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var keyword = valueOf(keywordInput);
      var region = valueOf(regionSelect);
      var year = valueOf(yearSelect);
      var category = valueOf(categorySelect);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();

        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchRegion = !region || (card.getAttribute('data-region') || '').toLowerCase().indexOf(region) !== -1;
        var matchYear = !year || (card.getAttribute('data-year') || '').toLowerCase() === year;
        var matchCategory = !category || (card.getAttribute('data-category') || '').toLowerCase() === category;
        var match = matchKeyword && matchRegion && matchYear && matchCategory;

        card.style.display = match ? '' : 'none';

        if (match) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [keywordInput, regionSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();
