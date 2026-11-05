// Keep previews still for visitors who prefer reduced motion.
// Native video controls remain available, including without JavaScript.
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });

  document.querySelectorAll("video.demo-video").forEach((video) => {
    observer.observe(video);
  });
}
