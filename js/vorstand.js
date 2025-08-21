const vorstandData = [
  { name: "Thomas Steimann", funktion: "Präsident" },
  { name: "Selina Poletti", funktion: "Vizepräsidentin / Anlässe" },
  { name: "Samuel Tartarotti", funktion: "Hallenvolleyball" },
  { name: "Tanja Burri", funktion: "Meisterschaft" },
  { name: "Nadin Andergassen", funktion: "Beachvolleyball / Material" },
  { name: "Sara Mattmann", funktion: "Presse / Sponsoring" },
  { name: "Marc Beissl", funktion: "Finanzen" },
  { name: "Aline Petermann", funktion: "Administration" }
];

document.querySelectorAll('.vorstand-img-block').forEach((block, i) => {
  const img = block.querySelector('img');
  let info = document.createElement('div');
  info.className = 'vorstand-hover-info-text';
  block.appendChild(info);

  img.addEventListener('mouseenter', function () {
    info.innerHTML = `<strong>${vorstandData[i].funktion}</strong><br>${vorstandData[i].name}`;
    info.style.display = 'block';
  });
  img.addEventListener('mouseleave', function () {
    info.style.display = 'none';
    info.innerHTML = '';
  });
});
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

