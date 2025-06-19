document.addEventListener("DOMContentLoaded", () => {
  // Team Konfiguration
  const teams = [
    { teamId: 1730, gender: "f", name: "DJ1" },
    { teamId: 1731, gender: "f", name: "DJ2" },
    { teamId: 12773, gender: "f", name: "DJ3" },
    { teamId: 4985, gender: "f", name: "Damen 1" },
    { teamId: 2797, gender: "m", name: "Herren 1" },
    { teamId: 128, gender: "f", name: "Damen 2" },
    { teamId: 1728, gender: "m", name: "Herren 2" }
  ];
  const clubId = 911080;
  const apiBase = "https://api.volleyball.ch/indoor/recentResults";
  const authHeader = "ef3775e2a47b975672144722db6ef8840258f873";

  let banners = [];
  let bannerStart = 0;
  const bannersToShow = 3;

  function getBannerIndex(i) {
    const len = banners.length;
    return ((i % len) + len) % len;
  }

  function formatSetResults(setResults) {
    if (!setResults) return [];
    return Object.keys(setResults)
      .sort((a, b) => Number(a) - Number(b))
      .map(
        (set) =>
          `${setResults[set].home}:${setResults[set].away}`
      );
  }

  function formatDateTime(dateStr) {
    // dateStr: "2025-03-10 20:00:00"
    const date = new Date(dateStr.replace(" ", "T"));
    return date.toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" }) +
      ", " +
      date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
  }

  function renderBanners() {
    const slider = document.getElementById("banner-slider");
    slider.innerHTML = "";
    for (let i = 0; i < bannersToShow; i++) {
      const idx = getBannerIndex(bannerStart + i);
      const banner = banners[idx];
      if (!banner) continue;

      // Bold the higher set count
      let homeSets = banner.resultSummary.wonSetsHomeTeam;
      let awaySets = banner.resultSummary.wonSetsAwayTeam;
      let homeBold = homeSets > awaySets ? "bold" : "";
      let awayBold = awaySets > homeSets ? "bold" : "";

      // Satzresultate
      const setResultsArr = formatSetResults(banner.setResultsRaw);

      slider.innerHTML += `
        <div class="banner">
          <div class="banner-header">
            <div class="banner-date">${banner.playDateTime}</div>
            <div class="banner-location">${banner.city}</div>
          </div>
          <div class="banner-score-row">
            <div class="banner-score-main">
              <span class="${homeBold}">${homeSets}</span>
              <span>:</span>
              <span class="${awayBold}">${awaySets}</span>
            </div>
            <div class="banner-score-sets">
              ${setResultsArr.map(s => `<div>${s}</div>`).join("")}
            </div>
          </div>
          <div class="banner-teams-row">
            <div class="banner-team home">
              ${banner.homeLogo ? `<img class="banner-team-logo" src="${banner.homeLogo}" alt=""/>` : ""}
              ${banner.homeTeam}
            </div>
            <div class="banner-team away">
              ${banner.awayLogo ? `<img class="banner-team-logo" src="${banner.awayLogo}" alt=""/>` : ""}
              ${banner.awayTeam}
            </div>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <div class="banner-league">${banner.league}</div>
            <div class="banner-teamname">${banner.teamName}</div>
          </div>
        </div>
      `;
    }
  }

  function showBannerLoading() {
    const slider = document.getElementById("banner-slider");
    slider.innerHTML = `
      <div class="banner-loading">
        <img src="/assets/img/volleyball-loader.png" alt="Volleyball Loader" class="banner-volleyball-spinner" />
      </div>
    `;
  }

  document.getElementById("banner-arrow-left").addEventListener("click", () => {
    bannerStart = getBannerIndex(bannerStart - 1);
    renderBanners();
  });

  document.getElementById("banner-arrow-right").addEventListener("click", () => {
    bannerStart = getBannerIndex(bannerStart + 1);
    renderBanners();
  });

  // Zeige Spinner bevor die Banner geladen werden
  showBannerLoading();

  // Daten für alle Teams laden
  Promise.all(
    teams.map((team) =>
      fetch(
        `${apiBase}?region=SVRI&gender=${team.gender}&clubId=${clubId}&teamId=${team.teamId}`,
        {
          headers: { Authorization: authHeader }
        }
      )
        .then((res) => res.json())
        .then((games) => {
          if (!Array.isArray(games) || games.length === 0) return null;
          // Neuestes Spiel finden
          games.sort((a, b) => new Date(b.playDate) - new Date(a.playDate));
          const game = games[0];
          return {
            teamName: team.name,
            playDateTime: formatDateTime(game.playDate),
            homeTeam: game.teams.home.caption,
            awayTeam: game.teams.away.caption,
            homeLogo: game.teams.home.logo,
            awayLogo: game.teams.away.logo,
            league: game.league.caption,
            city: game.hall.city,
            setResultsRaw: game.setResults,
            resultSummary: game.resultSummary
          };
        })
        .catch(() => null)
    )
  ).then((results) => {
    banners = results.filter(Boolean);
    if (banners.length === 0) {
      // Fallback falls keine Daten geladen werden konnten
      banners = [
        {
          teamName: "Keine Daten",
          playDateTime: "-",
          homeTeam: "-",
          awayTeam: "-",
          homeLogo: "",
          awayLogo: "",
          league: "-",
          city: "-",
          setResultsRaw: {},
          resultSummary: { wonSetsHomeTeam: "-", wonSetsAwayTeam: "-" }
        }
      ];
    }
    renderBanners();

    // Bereich für "Nächste Spiele" Banner vorbereiten
    function renderNaechsteSpieleBanner() {
      const container = document.getElementById("naechste-spiele-banner");
      if (!container) return;

      // Platzhalterdaten für alle Teams in einem Banner
      let html = `
        <div class="banner" style="margin-bottom:1.5rem;">          
          <div class="banner-score-sets" style="margin-bottom: 1rem;">
            <!-- Hier werden alle Teams gelistet -->
            <table style="width:100%; border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Datum/Zeit</th>
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Team</th>
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Heim</th>
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Gast</th>
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Liga</th>                  
                  <th style="text-align:left; padding: 0.2rem 0.5rem;">Ort</th>
                </tr>
              </thead>
              <tbody>
                ${teams.map(team => `
                  <tr>
                    <td style="padding: 0.2rem 0.5rem;">Datum/Zeit</td>
                    <td style="padding: 0.2rem 0.5rem;">${team.name}</td>
                    <td style="padding: 0.2rem 0.5rem;">Heimteam</td>
                    <td style="padding: 0.2rem 0.5rem;">Auswärtsteam</td>
                    <td style="padding: 0.2rem 0.5rem;">Liga</td>                    
                    <td style="padding: 0.2rem 0.5rem;">Ort</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
      container.innerHTML = html;
    }

    // Nach dem Rendern der letzten Ergebnisse Banner:
    renderNaechsteSpieleBanner();
  });
});

