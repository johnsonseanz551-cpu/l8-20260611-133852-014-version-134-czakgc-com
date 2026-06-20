(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupPlayer(shell) {
        var video = shell.querySelector("video");
        var overlay = shell.querySelector(".player-overlay");
        if (!video || !overlay) {
            return;
        }
        var stream = video.getAttribute("data-stream");
        var hls = null;
        var loaded = false;

        function loadStream() {
            if (loaded || !stream) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function playVideo() {
            loadStream();
            overlay.classList.add("is-hidden");
            video.setAttribute("controls", "controls");
            var attempt = video.play();
            if (attempt && attempt.catch) {
                attempt.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        }

        overlay.addEventListener("click", playVideo);
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });
        video.addEventListener("ended", function () {
            overlay.classList.remove("is-hidden");
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        document.querySelectorAll("[data-player]").forEach(setupPlayer);
    });
}());
