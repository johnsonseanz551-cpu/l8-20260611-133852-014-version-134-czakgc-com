(function () {
    const CDN_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    let cachedHlsClass = null;
    let loadingPromise = null;

    function loadClassicScript(src) {
        return new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function getHlsClass() {
        if (cachedHlsClass) {
            return cachedHlsClass;
        }
        if (window.Hls) {
            cachedHlsClass = window.Hls;
            return cachedHlsClass;
        }
        if (!loadingPromise) {
            loadingPromise = import('./video-player-dru42stk.js')
                .then(function (module) {
                    return module.H;
                })
                .catch(function () {
                    return loadClassicScript(CDN_URL).then(function () {
                        return window.Hls;
                    });
                });
        }
        cachedHlsClass = await loadingPromise;
        return cachedHlsClass;
    }

    function setMessage(box, message) {
        const node = box.querySelector('[data-player-message]');
        if (node) {
            node.textContent = message;
        }
    }

    async function startPlayer(box) {
        const video = box.querySelector('video');
        const source = box.getAttribute('data-video-src');
        if (!video || !source) {
            setMessage(box, '播放源未找到。');
            return;
        }

        box.classList.add('is-playing');
        video.controls = true;
        setMessage(box, '正在加载播放源，请保持网络连接。');

        try {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                await video.play();
                setMessage(box, '正在播放。');
                return;
            }

            const Hls = await getHlsClass();
            if (Hls && Hls.isSupported && Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video.addEventListener('canplay', function onCanPlay() {
                    video.removeEventListener('canplay', onCanPlay);
                    video.play().catch(function () {
                        setMessage(box, '播放器已就绪，点击视频控件继续播放。');
                    });
                });
                if (Hls.Events && Hls.Events.ERROR) {
                    hls.on(Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            setMessage(box, '播放加载失败，请刷新页面后重试。');
                        }
                    });
                }
                setMessage(box, '播放器已初始化。');
                return;
            }

            video.src = source;
            await video.play();
            setMessage(box, '正在播放。');
        } catch (error) {
            setMessage(box, '浏览器阻止了自动播放，请点击视频控件继续播放。');
        }
    }

    function initPlayers() {
        document.querySelectorAll('.js-player').forEach(function (box) {
            const button = box.querySelector('[data-player-start]');
            if (!button) {
                return;
            }
            button.addEventListener('click', function () {
                startPlayer(box);
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', initPlayers);
}());
