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
          <span class="${homeBold}">${
    banner.resultSummary.wonSetsHomeTeam
  }</span>
          <span>:</span>
          <span class="${awayBold}">${
    banner.resultSummary.wonSetsAwayTeam
  }</span>
        </div>
        <div class="banner-score-sets">
          ${setResultsArr.map((s) => `<div>${s}</div>`).join("")}
        </div>
      </div>
      <div class="banner-teams-row">
        <div class="banner-team home">
          ${
            banner.homeLogo
              ? `<img class="banner-team-logo" src="${banner.homeLogo}" alt=""/>`
              : ""
          }
          ${banner.homeTeam}
        </div>
        <div class="banner-team away">
          ${
            banner.awayLogo
              ? `<img class="banner-team-logo" src="${banner.awayLogo}" alt=""/>`
              : ""
          }
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
        <table style="width:100%; border-collapse:collapse; table-layout: fixed;">
          <thead>
            <tr>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 18%; font-size: 0.9em;">Datum/Zeit</th>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 8%; font-size: 0.9em;">Team</th>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 18%; font-size: 0.9em;">Heim</th>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 18%; font-size: 0.9em;">Gast</th>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 10%; font-size: 0.9em;">Liga</th>                  
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 10%; font-size: 0.9em;">Ort</th>
              <th style="text-align:left; padding: 0.2rem 0.3rem; width: 20%; font-size: 0.9em;">Halle</th>
            </tr>
          </thead>
          <tbody>
            ${validGames
              .map(
                (game) => `
              <tr>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.playDateTime}</td>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em; font-weight: bold;">${game.teamName}</td>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.homeTeam}</td>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.awayTeam}</td>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.league}</td>                    
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.city}</td>
                <td style="padding: 0.2rem 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em;">${game.hall}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,

  // Ranglisten - Tabelle
  rankingBanner: function (data) {
    return `
      <div class="banner" style="margin-bottom:1.5rem; text-align:left;">
        <div class="banner-score-sets" style="margin-bottom: 1rem;">
          <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
            <thead>
              <tr style="background: #f6f7fa; border-bottom: 0.5px solid #e0e3e8;">
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:7%; font-size: 0.95em;">Rang</th>
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:38%; font-size: 0.95em;">Team</th>
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:11%; font-size: 0.95em;">Spiele</th>
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:11%; font-size: 0.95em;">Siege</th>
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:11%; font-size: 0.95em;">Niederlagen</th>
                <th style="text-align:left; padding: 0.2rem 0.7rem; width:11%; font-size: 0.95em;">Punkte</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map((row, idx) => {
                  const isLast = idx === data.length - 1;
                  return `
                <tr${!isLast ? ' style="border-bottom: 0.5px solid #e0e3e8;"' : ''}>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; white-space:nowrap;">${row.rank}</td>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; font-weight: bold; white-space:nowrap;">${row.teamCaption}</td>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; white-space:nowrap;">${row.games}</td>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; white-space:nowrap;">${row.wins}</td>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; white-space:nowrap;">${row.defeats}</td>
                  <td style="padding: 0.2rem 0.7rem; font-size: 0.92em; white-space:nowrap;">${row.points}</td>
                </tr>
              `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
};

// Templates global verfügbar machen
if (typeof module !== "undefined" && module.exports) {
  module.exports = Templates;
} else {
  window.Templates = Templates;
}
