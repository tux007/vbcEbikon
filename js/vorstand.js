var $g = document.querySelector(".gallery");
var $h = document.querySelector(".horizontal");

var translate = 0;
const halfViewport = window.innerWidth / 2;
window.addEventListener("wheel", (e) => {
  event.preventDefault();
  const finalPosition = translate + -e.deltaY;
  if (finalPosition < halfViewport && finalPosition > (-6 * halfViewport)) {
    translate += -e.deltaY;

    $h.style.transform = `translate(${translate}px)`;
  }
}, { passive: false });

