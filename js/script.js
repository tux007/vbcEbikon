document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = `
    <ul>
      <li>🏐 Trainingslager 2025 findet in Sarnen statt</li>
      <li>🎉 Damen 1 steigen in die 1. Liga auf!</li>
    </ul>
  `;

  const resultateContainer = document.getElementById("resultate-container");
  resultateContainer.innerHTML = `
    <ul>
      <li>Herren 1 - Luzern 2: 3:1</li>
      <li>Damen 2 - Emmen: 2:3</li>
    </ul>
  `;

  const spieleContainer = document.getElementById("spiele-container");
  spieleContainer.innerHTML = `
    <ul>
      <li>Herren 1 vs. Horw – 20.06.2025, 19:30</li>
      <li>Damen 1 vs. Kriens – 22.06.2025, 18:00</li>
    </ul>
  `;
});
