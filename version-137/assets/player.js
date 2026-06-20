(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playButton');
    var sourceNode = document.getElementById('stream-json');

    if (!video || !sourceNode) {
        return;
    }

    var streamUrl = '';

    try {
        streamUrl = JSON.parse(sourceNode.textContent).url || '';
    } catch (error) {
        streamUrl = '';
    }

    if (!streamUrl) {
        return;
    }

    var attached = false;
    var hlsInstance = null;

    var attachStream = function () {
        if (attached) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            attached = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            attached = true;
            return;
        }

        video.src = streamUrl;
        attached = true;
    };

    var playVideo = function () {
        attachStream();
        if (button) {
            button.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    };

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
