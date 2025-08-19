document.addEventListener("DOMContentLoaded", () => {
  // Team Konfiguration
  const teams = [
    { teamId: 1730, gender: "f", name: "DJ1", groupId: "" },
    { teamId: 1731, gender: "f", name: "DJ2", groupId: "" },
    { teamId: 12773, gender: "f", name: "DJ3", groupId: "" },
    { teamId: 4985, gender: "f", name: "Damen 1", groupId: "27263" },
    { teamId: 2797, gender: "m", name: "Herren 1", groupId: "27278" },
    { teamId: 128, gender: "f", name: "Damen 2", groupId: "" },
    { teamId: 1728, gender: "m", name: "Herren 2", groupId: "" },
  ];
  const clubId = 911080;
  const apiBase = "https://api.volleyball.ch/indoor/recentResults";
  const upcomingApiBase = "https://api.volleyball.ch/indoor/upcomingGames";
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
      .map((set) => `${setResults[set].home}:${setResults[set].away}`);
  }

  function formatDateTime(dateStr) {
    // dateStr: "2025-03-10 20:00:00"
    const date = new Date(dateStr.replace(" ", "T"));
    return (
      date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })
    );
  }

  function formatDateTimeShort(dateStr) {
    // dateStr: Für nächste Spiele mit Monatszahl
    const date = new Date(dateStr.replace(" ", "T"));
    return (
      date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })
    );
  }

  function renderBanners() {
    const slider = document.getElementById("banner-slider");
    if (!slider) return;
    slider.innerHTML = "";
    for (let i = 0; i < bannersToShow; i++) {
      const idx = getBannerIndex(bannerStart + i);
      const banner = banners[idx];
      if (!banner) continue;

      let homeSets = banner.resultSummary.wonSetsHomeTeam;
      let awaySets = banner.resultSummary.wonSetsAwayTeam;
      let homeBold = homeSets > awaySets ? "bold" : "";
      let awayBold = awaySets > homeSets ? "bold" : "";

      // Satzresultate
      const setResultsArr = formatSetResults(banner.setResultsRaw);

      slider.innerHTML += Templates.resultBanner(
        banner,
        homeBold,
        awayBold,
        setResultsArr
      );
    }
  }

  function showBannerLoading() {
    const slider = document.getElementById("banner-slider");
    if (!slider) return;
    slider.innerHTML = Templates.loadingSpinner();
  }

  const bannerArrowLeft = document.getElementById("banner-arrow-left");
  if (bannerArrowLeft) {
    bannerArrowLeft.addEventListener("click", () => {
      bannerStart = getBannerIndex(bannerStart - 1);
      renderBanners();
    });
  }

  const bannerArrowRight = document.getElementById("banner-arrow-right");
  if (bannerArrowRight) {
    bannerArrowRight.addEventListener("click", () => {
      bannerStart = getBannerIndex(bannerStart + 1);
      renderBanners();
    });
  }

  // Zeige Spinner bevor die Banner geladen werden
  showBannerLoading();

  // Daten für alle Teams laden
  Promise.all(
    teams.map((team) =>
      fetch(
        `${apiBase}?region=SVRI&gender=${team.gender}&clubId=${clubId}&teamId=${team.teamId}`,
        {
          headers: { Authorization: authHeader },
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
            resultSummary: game.resultSummary,
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
          resultSummary: { wonSetsHomeTeam: "-", wonSetsAwayTeam: "-" },
        },
      ];
    }
    renderBanners();

    // Bereich für "Nächste Spiele" Banner
    function renderNaechsteSpieleBanner() {
      const container = document.getElementById("naechste-spiele-banner");
      if (!container) return;

      // Zeige Loading-Spinner für nächste Spiele
      container.innerHTML = Templates.loadingSpinner();

      // Lade nächste Spiele für alle Teams
      Promise.all(
        teams.map((team) =>
          fetch(
            `${upcomingApiBase}?region=SVRI&gender=${team.gender}&clubId=${clubId}&teamId=${team.teamId}`,
            {
              headers: { Authorization: authHeader },
            }
          )
            .then((res) => res.json())
            .then((games) => {
              if (!Array.isArray(games) || games.length === 0) return null;
              // Nächstes Spiel finden (sortiert nach Datum)
              games.sort((a, b) => new Date(a.playDate) - new Date(b.playDate));
              const game = games[0];
              return {
                teamName: team.name,
                playDateTime: formatDateTimeShort(game.playDate),
                homeTeam: game.teams.home.caption,
                awayTeam: game.teams.away.caption,
                homeLogo: game.teams.home.logo,
                awayLogo: game.teams.away.logo,
                league: game.league.caption,
                city: game.hall.city,
                hall: game.hall.caption,
                playDate: new Date(game.playDate), // Für Sortierung
              };
            })
            .catch(() => null)
        )
      ).then((upcomingGames) => {
        const validGames = upcomingGames.filter(Boolean);

        if (validGames.length === 0) {
          container.innerHTML = Templates.noUpcomingGames();
          return;
        }

        // Sortiere nach Datum (nächstes Spiel zuerst)
        validGames.sort((a, b) => a.playDate - b.playDate);

        container.innerHTML = Templates.upcomingGamesTable(validGames);
      });
    }

    // Nach dem Rendern der letzten Ergebnisse Banner:
    renderNaechsteSpieleBanner();
  });

  // Rangliste für ein Team laden und anzeigen
  function loadTeamRanking(teamName, groupId) {
    const rankingContainer = document.getElementById("team-ranking-table");
    if (!rankingContainer || !groupId) return;
    rankingContainer.innerHTML = Templates.loadingSpinner();
    fetch(`https://api.volleyball.ch/indoor/ranking/${groupId}`, {
      headers: { Authorization: authHeader },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          rankingContainer.innerHTML =
            '<div style="padding:1rem;">Keine Ranglistendaten gefunden.</div>';
          return;
        }
        // Nutze das Template für die Rangliste
        rankingContainer.innerHTML = Templates.rankingBanner(data);
      })
      .catch(() => {
        rankingContainer.innerHTML =
          '<div style="padding:1rem;">Fehler beim Laden der Rangliste.</div>';
      });
  }

  // Automatisch für Damen 1 laden, wenn die Seite geladen ist
  const rankingTable = document.getElementById("team-ranking-table");
  if (rankingTable) {
    // Teamname dynamisch aus dem H1-Element lesen
    const teamTitleElem = document.querySelector(".team-title");
    let teamName = teamTitleElem ? teamTitleElem.textContent.trim() : null;
    // Sonderfall: Teamname kann im H1 abweichen, ggf. Mapping nötig
    const team = teams.find((t) => t.name === teamName);
    if (team && team.groupId) {
      loadTeamRanking(team.name, team.groupId);
    }
  }

  // Navbar active link handling
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a, .header-nav a");
    if (navLinks.length > 0) {
      // Remove all active classes
      navLinks.forEach((link) => link.classList.remove("active"));

      // Aktuellen Pfad bestimmen
      const currentPath = window.location.pathname.replace(/\/+$/, "");
      let foundActive = false;

      navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href");
        if (
          linkPath &&
          linkPath !== "#" &&
          (linkPath === currentPath ||
            (linkPath !== "/" && currentPath.endsWith(linkPath)))
        ) {
          link.classList.add("active");
          foundActive = true;
        }
      });

      // Wenn kein Link passt, Home als aktiv markieren (nur beim ersten Laden)
      if (!foundActive) {
        navLinks[0].classList.add("active");
      }

      // Add click handler to update active class
      navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          // Entferne active von allen Links
          navLinks.forEach((l) => l.classList.remove("active"));
          // Setze active nur auf den geklickten Link
          this.classList.add("active");
        });
      });
    }
  });
});
