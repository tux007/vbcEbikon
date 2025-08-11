// HTML Templates für die Volleyball Website

const Templates = {
  // Banner für letzte Ergebnisse
  resultBanner: (banner, homeBold, awayBold, setResultsArr) => `
    <div class="banner">
      <div class="banner-header">
        <div class="banner-date">${banner.playDateTime}</div>
        <div class="banner-location">${banner.city}</div>
      </div>
      <div class="banner-score-row">
        <div class="banner-score-main">
          <span class="${homeBold}">${banner.resultSummary.wonSetsHomeTeam}</span>
          <span>:</span>
          <span class="${awayBold}">${banner.resultSummary.wonSetsAwayTeam}</span>
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
  `,

  // Loading Spinner
  loadingSpinner: () => `
    <div class="banner-loading">
      <img src="/assets/img/volleyball-loader.png" alt="Volleyball Loader" class="banner-volleyball-spinner" />
    </div>
  `,

  // Nächste Spiele - Keine Spiele gefunden
  noUpcomingGames: () => `
    <div class="banner" style="margin-bottom:1.5rem;">
      <div class="banner-score-sets" style="margin-bottom: 1rem; text-align: center;">
        <p>Keine anstehenden Spiele gefunden.</p>
      </div>
    </div>
  `,

  // Nächste Spiele - Tabelle
  upcomingGamesTable: (validGames) => `
    <div class="banner" style="margin-bottom:1.5rem;">          
      <div class="banner-score-sets" style="margin-bottom: 1rem;">
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
            ${validGames.map(game => `
              <tr>
                <td style="padding: 0.2rem 0.5rem;">${game.playDateTime}</td>
                <td style="padding: 0.2rem 0.5rem;">${game.teamName}</td>
                <td style="padding: 0.2rem 0.5rem;">${game.homeTeam}</td>
                <td style="padding: 0.2rem 0.5rem;">${game.awayTeam}</td>
                <td style="padding: 0.2rem 0.5rem;">${game.league}</td>                    
                <td style="padding: 0.2rem 0.5rem;">${game.city}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `
};

// Templates global verfügbar machen
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Templates;
} else {
  window.Templates = Templates;
}
