/**
 * 延迟加载（Lazy Loading）实现
 * 支持图片和视频的延迟加载，提升网站性能
 */

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.videoObserver = null;
        this.init();
    }

    init() {
        // 检查浏览器是否支持 Intersection Observer
        if ('IntersectionObserver' in window) {
            this.setupImageLazyLoading();
            this.setupVideoLazyLoading();
        } else {
            // 降级处理：直接加载所有图片和视频
            this.fallbackLoad();
        }
    }

    setupImageLazyLoading() {
        const imageOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, imageOptions);

        // 观察所有带有 data-src 属性的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    setupVideoLazyLoading() {
        const videoOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    observer.unobserve(video);
                }
            });
        }, videoOptions);

        // 观察所有带有 data-src 属性的视频
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            // 创建新的图片对象来预加载
            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = src;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                // 添加淡入效果
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease-in-out';
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            };
            imageLoader.onerror = () => {
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-error');
                console.warn('Failed to load image:', src);
            };
            imageLoader.src = src;
        }
    }

    loadVideo(video) {
        const src = video.getAttribute('data-src');
        if (src) {
            video.src = src;
            video.classList.remove('lazy-loading');
            video.classList.add('lazy-loaded');
            
            // 添加淡入效果
            video.style.opacity = '0';
            video.style.transition = 'opacity 0.3s ease-in-out';
            requestAnimationFrame(() => {
                video.style.opacity = '1';
            });
        }
    }

    fallbackLoad() {
        // 降级处理：直接加载所有延迟加载的元素
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
        });

        document.querySelectorAll('video[data-src]').forEach(video => {
            video.src = video.getAttribute('data-src');
            video.classList.remove('lazy-loading');
            video.classList.add('lazy-loaded');
        });
    }

    // 手动触发加载（用于用户交互）
    loadAll() {
        document.querySelectorAll('img[data-src], video[data-src]').forEach(element => {
            if (element.tagName === 'IMG') {
                this.loadImage(element);
            } else {
                this.loadVideo(element);
            }
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
});

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
