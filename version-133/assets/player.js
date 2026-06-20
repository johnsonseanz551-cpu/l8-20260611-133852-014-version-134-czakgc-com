import { H as Hls } from './hls-vendor-dru42stk.js';

document.querySelectorAll('.player-box').forEach(function (box) {
  var video = box.querySelector('.movie-player');
  var button = box.querySelector('.player-start');
  var stream = video ? video.getAttribute('data-stream') : '';
  var ready = false;
  var hls = null;

  function attach() {
    if (!video || !stream || ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      ready = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      ready = true;
    }
  }

  function start() {
    attach();
    box.classList.add('is-playing');

    if (video) {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  }
});
