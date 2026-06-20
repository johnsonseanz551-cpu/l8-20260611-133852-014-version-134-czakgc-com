(function () {
    window.initMoviePlayer = function (source, videoSelector, buttonSelector) {
        var video = document.querySelector(videoSelector);
        var button = document.querySelector(buttonSelector);
        var started = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (started) {
                return;
            }
            started = true;
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
        }

        function play() {
            attachSource();
            if (button) {
                button.classList.add("hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    if (button) {
                        button.classList.remove("hidden");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (!video.ended && button && video.currentTime === 0) {
                button.classList.remove("hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    };
}());
