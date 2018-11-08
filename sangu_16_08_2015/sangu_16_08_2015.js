function sangu_ready() {
  var /**
     * When game_data.majorVersion is different from Sangu version then activate sangu 'compatibility' mode (gray icon)
     */
    sangu_version = '8.34.1',
    /**
     * true: popup with crash dump, false: don't show the popup
     */
    sangu_crash = sangu_version.split(".").length === 4,
    /**
     * jQuery element of the cell (td) that contains all page specific widgets
     */
    content_value = $("#content_value"),
    /**
     * config/ Configuration per server (nl, de). Contains stuff like ajaxAllowed, etc
     */
    server_settings = {},
    /**
     * config/ Contains all translations except for the setting related translations in sangu_trans
     */
    trans = {},
    /**
     * config/ Contains all user settings
     */
    user_data = {},
    /**
     * config/ The current world configuration. settings like hasArchers, nightbonus, etc
     */
    world_config = {},
    /**
     * config/ Contains all data for this world (resources, units, buildings, units_off, unitsSize, ...)
     * What's in this variable depends on world_config.
     * This variable is a complete and utter mess :)
     */
    world_data = {},
    /**
     * Identifies the current page based on the querystring
     */
    current_page = {
      screen: game_data.screen,
      mode: game_data.mode
    },
    keyCodeMap = {
      8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pausebreak", 20: "capslock", 27: "escape", 32: " ",
      33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "arrow left", 38: "arrow up", 39: "arrow right", 40: "arrow down", 43: "+",
      44: "printscreen", 45: "insert", 46: "delete", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9",
      59: ";", 61: "=", 65: "a",  66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m",
      78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 96: "0", 97: "1",
      98: "2", 99: "3", 100: "4", 101: "5",  102: "6", 103: "7", 104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/", 112: "f1",
      113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6",  118: "f7", 119: "f8", 120: "f9",  121: "f10", 122: "f11", 123: "f12", 144: "numlock",
      145: "scrolllock", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
    };

  server_settings = {
    /**
     * Calculate how many more days we can attack in vacation mode
     */
    maxSitDays: 60,
    helpdeskUrl: "https://forum.tribalwars.nl/showthread.php?137674-8-11-GM-Algemeen-discussietopic-Sangu-Package",
    /**
     * This needs to be here for 'historical' reasons (Innogames versionchecker API remembers email on the server)
     * when in 'compatibility' mode (gray sangu icon). Also used in the crash report.
     */
    sangu: "sangu.be",
    sanguEmail: "package@sangu.be",
    /**
     * More then 500 [ cannot be sent in messages or pasted in the noteblock
     */
    allowedSquareBrackets: 500,
    /**
     * Are ajax calls allowed on this server
     */
    ajaxAllowed: true,
    /*
     * async: true on AJAX calls is only allowed when this property is true
     */
    asyncAjaxAllowed: false,
    /**
     * True: we add a direct link in the place to fill in coordinates. False: Show coords in an input field
     */
    coordinateLinkAllowed: false,
    /**
     * Can we fill in the coordinates directly in the place (using the url querystring) from troops overview
     */
    autoFillCoordinatesAllowed: true,
    scriptsDatabaseUrl: "http://www.twscripts.nl/"
  };
  /**
   * Contains all translation
   * The highest level is split in
   * - tw = translations that should be translated by their server equivalents (they are used somewhere in the html by Innogames)
   * - sp = new translations specific for the Sangu Package
   */
  trans = {
    tw: {
      units: {
        names: { "spear": "Speer", "sword": "Zwaard", "archer": "Boog", "axe": "Bijl", "spy": "Verk", "light": "Lc", "marcher": "Bb", "heavy": "Zc", "ram": "Ram", "catapult": "Kata", "knight": "Ridder", "snob": "Edel" },
        twShortNames: { "spear": "Speer", "sword": "Zwaard", "archer": "Boog", "axe": "Bijl", "spy": "Verk.", "light": "Lcav.", "marcher": "Bboog.", "heavy": "Zcav.", "ram": "Ram", "catapult": "Kata.", "knight": "Ridder", "snob": "Edel." },
        shortNames: { "spear": "Sp", "sword": "Zw", "archer": "Boog", "axe": "Bijl", "spy": "Ver", "light": "Lc", "marcher": "Bb", "heavy": "Zc", "ram": "Ram", "catapult": "Kata", "knight": "Ridder", "snob": "Edel" },
        militia: "Militia"
      },
      all: {
        today: "vandaag om",
        tomorrow: "morgen om",
        dateOn: "op",
        timeOn: "om",
        farm: "Boerderij",
        wood: "Hout",
        iron: "IJzer",
        stone: "Leem",
        groups: "Groepen",
        continentPrefix: "C"
      },
      main: {
        loyaltyHeader: "Toestemming:"
      },
      command: {
        returnText: "Terugkeer",
        attack: "Aanval",
        support: "Ondersteuning",
        haul: "Buit:",
        abortedOperation: "Afgebroken commando",
        catapultTarget: "Katapultdoel:",
        buttonValue: "OK",
        attackOn: "Aanval op ",
        supportFor: "Ondersteuning voor ",
        walkingTimeTitle: "Duur:"
      },
      incoming: {
        defaultCommandName: "Bevel"
      },
      place: {
        troopMovements: "Troepenbewegingen"
      },
      market: {
        incomingTransports: "Binnenkomende transporten"
      },
      profile: {
        title: "Profiel",
        claimedBy: "Geclaimd door:",
        awardsWon: "Behaalde awards"
      },
      overview: {
        village: "Dorp",
        incomingTroops: "Aankomend"
      }
    },
    sp: {
      sp: {
        settings: {
          reset: "De standaard Sangu Package settings herstellen",
          resetAll: "Sangu Package 'fabrieksinstellingen' herstellen",
          configuration: "Configuratie",
          configurationFormTogglerTooltip: "Klik op de knoppen om de verschillende editeerschermen te openen",
          activate: "Activeer",
          deleteTooltip: "Verwijderen",
          addRecord: "&raquo; Toevoegen",
          exportSettings: "Instellingen exporteren",
          importSettings: "Instellingen importeren",
          importSettingsDesc: "Door de sangu instellingen te exporteren en elders opnieuw te importeren kan je de huidige sangu configuratie hergebruiken op een andere wereld of computer.",
          importSettingsSuccess: "Settings zijn geïmporteerd!",
          importError: "Het ziet er naar uit dat de geplakte tekst foutief is.",
          importErrorContinueAnyway: "Toch importeren?"
        },
        donate: {
          title: "Donatie",
          whyWouldI: "Als je op regelmatige basis functionaliteit van het Sangu Package gebruikt, dan is dat een goede reden om een donatie te doen."
            + "<br><br>"
            + "Jouw dankbaarheid en financiële steun helpen me motiveren verder te blijven werken aan het Sangu Package.",
          books: "Er staan ook een aantal zeer interessante JavaScript boeken op mijn {abegin}Amazon wishlist{aend}. Daarmee kan je me ook altijd een plezier doen :)",
          notable: "Een aantal personen hebben reeds een notabele donatie gedaan:",
          buttonAmount: "Doneer €{amount}",
          beer: "Trakteer me een biertje",
          food: "Een spaghetti voor Wouter! (of pizza!)",
          yaye: "Een nieuw IT boek voor mijn verzameling!"
        },
        configuration: "Sangu Package configureren (v{version})",
        activatePackage: "Sangu Package activeren",
        deactivatePackage: "Sangu Package deactiveren",
        packageCrashTitle: "Het Sangu Package is gecrasht :)",
        packageCrashTooltip: "Crash!!! Klik op de bol om het crash rapport te bekijken. "
          + "Je kan dit rapport naar ons doorsturen waardoor we het probleem mogelijk kunnen oplossen.",
        packageCrash:
          "<a href='http://" + server_settings.sangu + "'>Controleer eerst of er een update is!</a><br>"
          + "<b>Foutmelding</b>: <i>{error}</i><br>"
          + "<b>Details</b>:<br>"
          + "<textarea style='width: 95%' rows='20' id='crashArea'>"
          + "Foutmelding: {error}\n"
          + "Pagina: {title} -> {page}\n"
          + "URL: {url}\n"
          + "Versie: {version}\n"
          + "Brower: {browser}\n"
          + "game_data: {game_data}\n"
          + "\n{stacktrace}\n"
          + "\n\n\n[HTML]\n"
          + "</textarea>"
          + "<br><br>Je kan de bug <a href='{forum-url}' target='_blank'>hier</a> melden."
          + "<br>Of je kan de bug <a href='mailto:{email}'>mailen</a>."
          + "<br><br><center><i>Een bug waarvan we niet weten dat ie bestaat zal ook niet gefixed worden!</i></center>"
          + "<br><center><b>Geef zoveel mogelijk informatie mee bij het sturen van een bugrapport!!!</b></center>",

        activatePackageWithCompatibility: "Sangu Package (v{version}) mogelijk incompatibel met huidige TW versie",
        firstTimeRun: "<b>Welkom!</b> Het Sangu Package is momenteel inactief. Klik op de nieuwe {img} naast de opslagplaats hierboven om het package aan en uit te schakelen.",
        firstTimeRunEditSettings: "Klik op de nieuwe 'Sangu Package' link om het package naar jouw smaak in te stellen!",
        removeScriptWarning: "Niet meer tonen",
        moreScripts: "Meer scripts",
        moreScriptsTooltip: "Ga naar de site met alle goedgekeurde TW scripts",
        sanguLinkTitle: "Het package naar jouw smaak instellen"
      },
      all: {
        populationShort: "Pop",
        population: "Populatie",
        total: "Totaal",
        last: "Laatste",
        target: "Doel",
        targetEx: "Doelwit",
        more: "meer",
        less: "minder",
        all: "Alle",
        withText: "met",
        merchants: "Handelaren",
        further: "verder",
        closer: "dichter",
        fieldsSuffix: "(F{0})",
        close: "Sluiten"
      },
      main: {
        unitsReplacement: "Eigen",
        unitsOther: "Ondersteunende Eenheden",
        rallyPointTroops: "troepen",
        ownStackTitle: "Totale populatie van de eigen troepen",
        supportingStackTitle: "Totale populatie van de ondersteunende troepen",
        showHiddenDivs: "&raquo; Alle verborgen terugzetten ({amount} verborgen)",
        hideDiv: "Volledig verbergen"
      },
      map: {
        dodgeLastTagged: "Dodgetijd van de laatst getagde aanval"
      },
      tagger: {
        openButton: "Open Tagger",
        rename: "Herbenoemen",
        renameTooltip: "Alle bevelen waarvan de checkbox aangevinkt is hernoemen",
        incomingTroops: "Binnenkomende troepen",
        arrival: "Aankomst",
        arrivalIn: "Aankomst in",
        sentNow: "Zojuist",
        sentSeconds: "seconde(n)",
        sent1Minute: "1 minuut",
        sentMinutes: "minuten",
        sent1Hour: "1 uur",
        sentHours: "uren",
        sentOn: "Verstuurtijd",
        ago: "Geleden",
        arrivesInNightBonus: " (NACHT!)",
        tagIt: "Aanval Taggen",
        checkAllSupport: "Aanvinken van alle zichtbare ondersteuning",
        uncheckAllSupport: "Uitvinken van alle zichtbare ondersteuning",
        tagged: "Tagged!",
        dodgeTime: "Dodgetijd",
        slowest: "Traagst",
        slowestTip: "Traagste eenheid in het dorp",
        allAbove: "Alle vroegere aanvallen aanvinken",
        allBelow: "Alle latere aanvallen aanvinken",
        renameTo: "Hernoemen naar: ",
        switchModus: "&raquo; Alle aanvallen openen/sluiten",
        checkAllAttacks: "Aanvinken van alle zichtbare aanvallen",
        uncheckAllAttacks: "Uitvinken van alle zichtbare aanvallen",
        activeDodgeTime: "Actieve dodgetijd (wordt op de kaart getoond)",
        totalAttacksOnVillage: "Aantal aanvallen",
        renameButtonShortcutTooltip: "Shortcut: CTRL + {hitkey}"
      },
      place: {
        distance: "Afstand",
        backOn: "Terug op",
        onlyAttack: "1 aanval op {arrivalDateFirst} ({timeLeftFirst})",
        multipleAttack: "{amount} aanvallen tussen {arrivalDateFirst} ({timeLeftFirst}) en {arrivalDateLast} ({timeLeftLast})",
        changeSpeedImageTooltips: "{originalTitle} - Klik om de traagste eenheid te wijzigen"
      },
      jumper: {
        goToMap: "Ga naar de kaart"
      },
      command: {
        returnOn: "Terug op:",
        arrival: "Aankomst",
        dodgeNotFarEnough: "De dodge is niet ver genoeg!",
        dodgeMinuteReturn: "(Terugkeer na {minutes})",
        catapultImageTitle: "Klik om gebouw te vernietigen"
      },
      overviews: {
        totalVillages: "Aantal dorpen:",
        loadNextPage: "[volgende pagina laden]"
      },
      troopOverview: {
        help: "<b>Laat je looptijden uitrekenen door Sangu!</b><br>"
          + "Gebruik de nieuwe kolom uiterst rechts om de looptijden tot een ingegeven doeldorp te berekenen.<br>"
          + "<br>Je kan de eenheden icons ({unitIcon}) aanklikken om de snelheid van de traagste eenheid te wijzigen."
          + "<span style='line-height: 2'>"
          + "<br>Klikken wijzigt de <span style='border: 2px green dotted'>snelheid op de huidige pagina</span>. "
          + "<br>Dubbelklikken wijzigt de <span style='border: 3px red solid'>snelheid op alle pagina's</span>."
          + "</span>"
          + "<br>De cellen met de groene en rode rand geven de huidige traagst eenheid-snelheid aan."
          + "<br><br><b>De iconen in de 'Opdracht' kolom</b>:"
          + "<br>Gebruik <img src='graphic/dots/red.png'> om een rij te verwijderen."
          + "<br>Gebruik <img src='graphic/command/attack.png'> om naar de verzamelplaats te gaan."
          + "(gebruik de middelste muisknop om in een nieuwe tab te openen)",
        helpTitle: "Snel dorpen aanvallen (of ondersteunen)",
        removeVillage: "Dorp verwijderen",
        toThePlace: "Verzamelplaats",
        setTargetVillageButton: "OK",
        setTargetVillageButtonAlert: "Geef de coördinaten van het dorp dat je wil aanvallen (of ondersteunen)",
        commandTitle: "Opdracht",
        selectUnitSpeed: "Selecteer {0} als traagste eenheid. (Klik op deze pagina, Dubbel klik op alle pagina's.)",
        nightBonus: "Nacht?",
        village: "Dorp",
        filterTroops: "Filter",
        filterTroopsTooltip: "Toon enkel de dorpen met meer dan het aangegeven aantal eenheden",
        filterPopulation: "Filter populatie",
        filterPopulationTooltip: "Toon enkel de dorpen met meer/minder bevolking",
        filterWalkingTime: "Filter looptijd",
        filterWalkingTimeTooltip: "Toon enkel de dorpen met een langere looptijd (in uren) tot het doeldorp",
        calcStack: "Bereken stack",
        calcStackTooltip: "Toon de bevolking per dorp in de \"Nacht?\" kolom",
        filterNoble: "Toon edels",
        filterNobleTooltip: "Toon enkel de dorpen waar edels aanwezig zijn",
        filterUnderAttack: "Toon onder aanval",
        filterUnderAttackTooltip: "Toon enkel de dorpen die onder aanval zijn",
        sort: "Sorteren",
        sortTooltip: "Sorteren op looptijd tot doeldorp",
        restack: "Stack BB Codes",
        restackTitle: "<b>Alle dorpen met minstens {requiredDiff}k bevolking minder dan {to}k</b><br>"
          + "<font size='-2'>(configuratie wijzigbaar bij Sangu instellingen)</font>",
        cheapNobles: "Goedkope edelmannen beschikbaar",

        filtersReverse: "De filtering omdraaien",
        filtersReverseInfo: "Filters omdraaien",
        freeTextFilter: "Tekst filter",
        freeTextFilterTooltip: "Dorpen {filterType} de tekst wegfilteren",
        freeTextFilterTooltipFilterTypeWith: "met",
        freeTextFilterTooltipFilterTypeWithout: "zonder",
        continentFilter: "Continent",
        continentFilterTooltip: "Alle dorpen in continent wegfilteren",
        continentFilterTooltipReverse: "Alle dorpen in continent tonen"
      },
      prodOverview: {
        filter: "Filter",
        filterFullGS: "Volle opslag",
        merchantTooltip: "Vink aan om handelaren te highlighten",
        merchantAmountTooltip: "Als de checkbox aangevinkt is worden dorpen met minder dan x handelaren in het rood gehighlight",
        bbCodes: "BB Codes",
        bbCodesInfo: "Gebruik IMG",
        filterTooltip: "Dorpen die niet aan de filtercriteria voldoen verbergen",
        filterTooltipReverse: "Dorpen die voldoen aan de filtercriteria highlighten",
        filterFullGSTooltip: "Dorpen waarbij niet minstens 1 van de grondstoffen vol is verbergen",
        filterFullGSTooltipReverse: "Dorpen waarbij minstens 1 van de grondstoffen vol is highlighten",
        filterAllTooltip: "Dorpen waarbij niet minstens 1 van de grondstoffen meer/minder dan x is verbergen",
        filterAllTooltipReverse: "Dorpen waarbij minstens 1 van de grondstoffen meer/minder dan x is highlighten",
        filter1Tooltip: "Dorpen waarbij er nier meer/minder dan x {0} is verbergen",
        filter1TooltipReverse: "Dorpen waarbij er meer/minder dan x {0} is highlighten",
        tooMuch: "Teveel:",
        tooMuchText: "Alle dorpen met minstens {diff}k meer grondstoffen dan {min}k",
        tooLittle: "Te weinig:",
        tooLittleText: "Alle dorpen met minstens {diff}k minder grondstoffen dan {min}k",
        bbCodeExtraInfo: "<br><font size='-2'>(configuratie wijzigbaar bij Sangu instellingen)</font>"
      },
      buildOverview: {
        optimistic: "Optimistisch",
        mark: "Duiden",
        filter: "Filteren"
      },
      smithOverview: {
        optimistic: "Optimistisch",
        mark: "Duiden",
        filter: "Filteren"
      },
      defOverview: {
        stackButton: "Totalen berekenen",
        stackTooltip: "Totale stack en afstanden berekenen",
        stackFilter: "Filter op stack",
        stackFilterTooltip: "Filter dorpen met meer/minder dan x totale stack vanbuiten het dorp",
        village: "Dorp:",
        distFilter: "Filter op afstand",
        distFilterTooltip: "Filter alle dorpen die verder/dichter dan x velden liggen van dorp y",
        stackBBCodes: "Stack BBCodes",
        stackBBCodesTooltip: "Bepaal BB codes en aantal troepen voor een stack tot x populatie voor alle zichtbare dorpen",
        filterNoSupport: "Zonder OS wegfilteren",
        filterNoSupportTooltip: "Wegfilteren van alle dorpen waar geen ondersteuning meer zichtbaar is",
        extraFiltersSupport: "Ondersteunende dorpen filters:",
        extraFiltersDefense: "Ondersteuning filters:",
        extraFiltersReverse: "De filtering omdraaien",
        extraFiltersInfo: "Filters omdraaien",
        distFilter2: "Afstand filter",
        freeTextFilter: "Tekst filter",
        barbarianFilter: "Barbarendorpen",
        barbarianFilterTooltip: "Toon alle ondersteuningen naar barbarendorpen",
        nobleFilter: "Alle edel-ondersteuning tonen",
        nobleFilterRev: "Alle edel-ondersteuning wegfilteren",
        spyFilter: "Alle verkenner-ondersteuning tonen",
        spyFilterRev: "Alle verkenner-ondersteuning wegfilteren",
        attackFilter: "Alle aanval-ondersteuning tonen",
        attackFilterRev: "Alle aanval-ondersteuning wegfilteren",
        supportFilter: "Alle verdediging-ondersteuning tonen",
        supportFilterRev: "Alle verdediging-ondersteuning wegfilteren",
        otherPlayerFilterShow: "tonen",
        otherPlayerFilterHide: "wegfilteren",
        otherPlayerFilterTo: "Alle ondersteuningen naar andere spelers {action}",
        otherPlayerFilterFrom: "Alle ondersteuningen van andere spelers {action}",

        filterTooltipVillageTypeSupporting: "Ondersteunende dorpen",
        filterTooltipVillageTypeSupported: "Ondersteunde dorpen",
        freeTextFilterTooltip: "{villageType} {filterType} de tekst wegfilteren",
        freeTextFilterTooltipFilterTypeWith: "met",
        freeTextFilterTooltipFilterTypeWithout: "zonder",
        distanceFilterTooltip: "{villageType} die {filterType} dan het aangegeven aantal velden liggen wegfilteren",
        distanceFilterTooltipFilterTypeCloser: "dichter",
        distanceFilterTooltipFilterTypeFurther: "verder",

        totalFromOtherVillages: "totaal uit andere dorpen",
        totalInOtherVillages: "totaal in andere dorpen",
        freeText: "Vrij tekstveld (wordt niet opgeslagen!):",
        fieldsPrefix: "F{0}",
        thousandSuffix: "k",
        totalVillages: "Dorpen ({0})",
        distanceToVillageNoneEntered: "Geef een coördinaat! (eerste tekstveld)",
        distanceToVillage: "Afstand tot {0}",
        filterUnderAttack: "Filter onder aanval"
      },
      commands: {
        filterReturn: "Filter terugkeer",
        filterReturnTooltip: "'Teruggestuurd' en 'Terugkeer' bevelen verbergen",
        totalRows: "Somlijn",
        group: "Groeperen",
        totalRowsText: "{0}x OS = {1} pop",
        totalVillagesSupport: "Ondersteunde dorpen:",
        totalVillagesAttack: "Aangevallen dorpen:",
        totalSupport: "Ondersteuningen",
        totalAttack: "Aanvallen",
        bbCodeExport: "BBCode Export",
        bbCodeExportTooltip: "Overblijvende aanvallen exporteren",
        supportPlayerExport: "Ondersteuning exporteren",
        supportPlayerExportTooltip: "Geef de naam van de speler waarvoor je de ondersteuning wil exporteren "
          + "(of laat leeg om alle ondersteuningen te exporteren). Door de export als mededeling "
          + "naar de andere speler door te sturen "
          + "kan deze jouw gestuurde troepen als bevelnaam zetten. (Hij heeft daarvoor natuurlijk"
          + " ook het Sangu Package nodig :)",
        filtersReverse: "De filtering omdraaien",
        filtersReverseInfo: "Filters omdraaien",
        freeTextFilter: "Tekst filter",
        freeTextFilterTooltip: "Aanvallen {filterType} de tekst wegfilteren",
        freeTextFilterTooltipFilterTypeWith: "met",
        freeTextFilterTooltipFilterTypeWithout: "zonder",
        nobleFilter: "Alle edelaanvallen tonen",
        nobleFilterRev: "Alle edelaanvallen wegfilteren",
        spyFilter: "Alle verkenneraanvallen tonen",
        spyFilterRev: "Alle verkenneraanvallen wegfilteren",
        tableTotal: "Bevel ({0})",
        fakeFilter: "Alle fake aanvallen wegfilteren",
        fakeFilterRev: "Alle fake aanvallen tonen",
        continentFilter: "Continent",
        continentFilterTooltip: "Alle dorpen in continent wegfilteren",
        continentFilterTooltipReverse: "Alle dorpen in continent tonen",
        exportAttackHeader: "{village} {#} aanvallen, laatste [b]{lastAttack}[/b]",
        exportDefenseHeader: "{village} {support#} ondersteuningen voor [b]{totalStack} pop[/b]",
        exportCompleteHeader: "{village} {#} aanvallen, laatste [b]{lastAttack}[/b]\n+ {support#} ondersteuningen voor [b]{totalStack} pop[/b]",
        exportNone: "Geen ondersteuning gevonden!"
      },
      groups: {
        villageFilter: "Dorpsnaam",
        villageFilterTitle: "Alle dorpen met de tekst in de dorpsnaam wegfilteren",
        villageFilterTitleRev: "Alle dorpen met de tekst in de dorpsnaam tonen",
        pointsFilter: "Punten",
        amountFilter: "Aantal",
        groupNameFilter: "Groepsnaam",
        amountFilterTitle: "Alle dorpen met minder groepen wegfilteren",
        amountFilterTitleRev: "Alle dorpen met meer groepen wegfilteren",
        pointsFilterTitle: "Alle dorpen met minder punten wegfilteren",
        pointsFilterTitleRev: "Alle dorpen met meer punten wegfilteren",
        farmFilterTitle: "Alle dorpen met minder populatie wegfilteren",
        farmFilterTitleRev: "Alle dorpen met meer populatie wegfilteren",
        groupNameFilterTitle: "Alle dorpen met de tekst in een groepsnaam wegfilteren",
        groupNameFilterTitleRev: "Alle dorpen met de tekst in een groepsnaam tonen"
      },
      snob: {
        canProduce: "Je kan meteen produceren:"
      },
      profile: {
        twStatsMap: "TWStats Kaart",
        externalPage: "(Extern)",
        internalPage: "(Intern)",
        conquers: "Overnames",
        villages: "Dorpen:",
        graphPoints: "Punten",
        graphVillages: "Dorpen",
        graphOD: "OD Totaal",
        graphODD: "OD Verdediging",
        graphODA: "OD Aanval",
        graphRank: "Rang",
        graphMembers: "Leden",
        graphTWMap: "TribalWarsMap.com"
      },
      incomings: {
        dynamicGrouping: "Dynamisch groeperen",
        dynamicGroupingTooltip: "Groepeert trager maar bevriest de pagina niet",
        summation: "Somlijn",
        fastGrouping: "Snel groeperen",
        fastGroupingTooltip: "Groepeert sneller en bevriest de pagina (geen refreshs wanneer een aanval binnenkomt)",
        showNewIncomings: "Toon nieuwe aanvallen",
        sortByAttackId: "Sorteer op aanvalsid",
        sortByAttackIdTooltip: "Een kleiner aanvalsid betekent een eerder verstuurde aanval",
        amount: "Aanvallen:",
        attackId: "Aanvalsid",
        attackIdDifference: "Verschil",
        filterColumnButton: "Kolom filter",
        filterColumnButtonTooltip: "Alle bevelen waarbij de geselecteerde kolom de ingegeven tekst bevat {type}",
        filterColumnButtonTooltipHide: "verbergen",
        filterColumnButtonTooltipShow: "tonen",

        indicator: {
          lastTimeCheckHintBoxTooltip: "Klik op {img} om de laatste tijdcheck met de huidige tijd te vervangen.",
          lastTimeCheckNotYetSet: "(nog niet)"
        },
        commandsImport: "Ondersteuning importeren",
        commandsImportTooltip: "Ondersteuning naar jouw dorpen kan op jouw account ingelezen worden"
          + " door de andere speler zijn bevelen te laten exporteren via Sangu Package (Pagina Overzicht: Bevelen)"
          + " en die export hier te plakken.",
        commandsImportError: "Fout bij het inladen van de ondersteuningen.\nHet zou er zoals dit moeten uitzien: \n"
          + '[{"commandName": "702|459 (speler) Zw=1 (Pop: 1)", "commandId": "7538763"}]',
        commandsImportSuccess: "{replaced} van de {total} ondersteuningen zijn hernoemd."
      },
      rest: {
        sittingAttackTill: "Aanvallen en verdedigen van dorpen niet in eigen beheer tot:",
        friendsOnline: "Vrienden {friends} ({onlineimg} {online#} | {offlineimg} {offline#})",
        friendsOnlineTitle: "Online: {playerNames}"
      }
    }
  };

  /**
   * Log the parameter to the console (print yaye when undefined)
   */
  function q(what) { console.log(typeof what === "undefined" ? "yaye" : what); }

  /**
   * Alert the parameter (yaye when undefined)
   */
  function qa(what) { alert(typeof what === "undefined" ? "yaye" : what); }

  /**
   * Show crash report
   */
  function sangu_alert(e, title) {
    var activator = $("#sangu_activator");

    activator
      .attr("src", "graphic/dots/grey.png")
      .attr("title", trans.sp.sp.packageCrashTooltip);

    (function() {
      var position = $("#storage").position(),
        options = {
          left: position.left - 150,
          top: position.top + 35
        },
        content = {body: trans.sp.sp.packageCrashTooltip, title: trans.sp.sp.packageCrashTitle};

      createFixedTooltip("sanguCrashTooltip", content, options);
    }());

    activator.click(function() {
      var currentPageHtml = document.documentElement.innerHTML,
        position = $("#storage").position(),
        options = {
          left: $(window).width() / 2 - 300,
          top: position.top + 35,
          width: 600,
          showOnce: false
        },
        game_dataSubset = {
          majorVersion: game_data.majorVersion,
          market: game_data.market,
          world: game_data.world,
          sitter: game_data.player.sitter,
          village_id: game_data.village.id,
          player_id: game_data.player.id,
          player_name: game_data.player.name,
          ally_id: game_data.player.ally_id,
          villages: game_data.player.villages,
          premium: game_data.player.premium/*,
           account_manager: game_data.player.account_manager,
           farm_manager: game_data.player.farm_manager*/
        },
        content = {
          title: trans.sp.sp.packageCrashTitle,
          body: trans.sp.sp.packageCrash
            .replace("{forum-url}", server_settings.helpdeskUrl)
            .replace("{title}", title)
            .replace(/\{error\}/g, e.message)
            .replace("{page}", JSON.stringify(current_page))
            .replace("{url}", document.location.href)
            .replace("{version}", sangu_version)
            .replace("{browser}", JSON.stringify($.browser))
            .replace("{game_data}", JSON.stringify(game_dataSubset))
            .replace("{stacktrace}", e.stack ? e.stack + "\n\n" + e.stacktrace : "assertion?")
            .replace("{email}", server_settings.sanguEmail)
            .replace("{html}", currentPageHtml)
        };

      createFixedTooltip("sanguCrash", content, options);
      $("#crashArea").val($("#crashArea").val() + currentPageHtml);

      return false;
    });

    for(i = 0; i < 7; i++) {
      activator.fadeTo('slow', 0.2).fadeTo('slow', 1.0);
    }
    if (sangu_crash) {
      activator.click();
    }
  }

  /**
   * Failed assertions show the crash report!
   */
  function assert(shouldBeTruthy, message) {
    if (!shouldBeTruthy) {
      sangu_alert({message: message || "(broken assertion)"});
    }
  }

  /**
   * Show crash report
   */
  function handleException(e, title) {
    sangu_alert(e, title);
  }
  function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }

  /**
   * Gets a value from the querystring (or returns "")
   * @param {string} name the name of the querystring parameter
   * @param {string} [url] when omitted, the current location.url is assumed
   */
  function getQueryStringParam(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url == undefined ? window.location.href : url);
    if (results == null) {
      return "";
    } else {
      return results[1];
    }
  }

  /**
   * Get a TW url taking account sitting etc in account
   * @param {string} url provide the url starting from &screen=
   * @param {number} [villageId] when omitted the current village is assumed
   */
  function getUrlString(url, villageId) {
    if (url.indexOf("?") == -1) {
      var link = location.href.substr(0, location.href.indexOf("?"));
      link += "?village=" + (villageId ? villageId : getQueryStringParam("village"));
      var isSit = getQueryStringParam("t");
      if (isSit) {
        link += "&t=" + isSit;
      }

      if (url.indexOf("=") == -1) {
        return link + "&screen=" + url;
      } else {
        return link + "&" + url;
      }
    } else {
      return url;
    }
  }

  /**
   * Perform an ajax call (if the server allows it)
   * @param {string} screen passed to getUrlString. (start from &screen=)
   * @param {function} strategy executed on success. Has parameter text (content of the parameter depends on opts.contentValue)
   * @param {object} [opts] object with properties
   *              {false|number} [villageId] passed to getUrlString. Default is false which defaults to current village. Otherwise pass a village id.
   *              {boolean=true} [contentValue] true (default): only return the #content_value. false: return entire DOM HTML
   *              {boolean=true} [async] defaults to true
   */
  function ajax(screen, strategy, opts) {
    if (!server_settings.ajaxAllowed) {
      alert("Ajax is not allowed on this server.");
      return;
    }

    opts = $.extend({}, { villageId: false, contentValue: true, async: false }, opts);

    $.ajax({
             url: getUrlString(screen, opts.villageId),
             async: server_settings.asyncAjaxAllowed ? opts.async : false,
             success: function(text) {
               text = opts.contentValue ? $("#content_value", text) : text;
               strategy(text);
             }
           });
  }

  function spSpeedCookie(setter) {
    if (setter == undefined) {
      var speedCookie = pers.get("targetVillageSpeed");
      if (speedCookie == '') {
        speedCookie = 'ram';
      }
      return speedCookie;
    } else {
      if (setter.indexOf('_') == 4) {
        setter = setter.substr(setter.indexOf('_') + 1);
      }
      pers.set("targetVillageSpeed", setter);
      return setter;
    }
  }

  function spTargetVillageCookie(setter) {
    if (setter == undefined) {
      return pers.get("targetVillageCoord");
    } else {
      pers.set("targetVillageCoord", setter);
      return setter;
    }
  }

  function getDistance(x1, x2, y1, y2, speed) {
    var dist = {};
    dist.fields = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    dist.travelTime = dist.fields * (speed == '' ? world_data.unitsSpeed.unit_ram : world_data.unitsSpeed['unit_' + speed]);
    dist.arrivalTime = getDateFromTW($("#serverTime").text(), true);
    dist.arrivalTime.setTime(dist.arrivalTime.getTime() + (dist.travelTime * 60 * 1000));
    dist.isNightBonus = isDateInNightBonus(dist.arrivalTime);

    if (speed == 'snob' && dist.travelTime > world_config.maxNobleWalkingTime) {
      dist.html = "<font color='" + user_data.colors.error + "'><b>" + twDurationFormat(dist.travelTime) + "</b></font>";
      dist.isNightBonus = true;
    } else {
      var displayTime = twDateFormat(dist.arrivalTime);
      if (speed != 'merchant' && dist.isNightBonus) {
        displayTime = "<font color='" + user_data.colors.error + "'><b>" + displayTime + "</b></font>";
      }
      dist.html = user_data.walkingTimeDisplay
        .replace("{duration}", twDurationFormat(dist.travelTime))
        .replace("{arrival}", displayTime);
    }
    if (dist.fields == 0) {
      dist.html = "";
    }

    return dist;
  }

  //_gaq.push(['b._setAccount', 'UA-30075487-3']);

  /**
   * Send click to google analytics
   * @param {string} action
   */
  function trackClickEvent(action) {
    trackEvent("ButtonClick", action);
  }

  /**
   * google analytics event tracking
   */
  function trackEvent(category, action, label) {
    // category: clicks (downloads, ...)
    // action: which button clicked
    if (typeof label === 'undefined') {
      label = getQueryStringParam("screen");
      var mode = getQueryStringParam("mode");
      if (mode) label += "-" + mode;
    }

    //_gaq.push(['b._setAccount', 'UA-30075487-3']);
    //_gaq.push(['b._trackPageview']);
    // _gat._getTrackerByName('b')._trackEvent("SanguPackage", "Loaded", "withGetB");
    try
    {
      _gat._getTrackerByName('b')._trackEvent(category, action, label);
    }
    catch (e) {
      // no crash report for this
    }
  }

  function fillRallyPoint(units) {
    var script = "";
    $.each(world_data.units, function (i, v) {
      if (units[v] != undefined && units[v] > 0) {
        script += "document.forms[0]." + v + ".value=\"" + units[v] + "\";";
      } else {
        script += "document.forms[0]." + v + ".value=\"\";";
      }
    });

    return script;
  }

  /**
   * Tries to find village coords in str and convert it to a 'village' object
   * @param {string} str the string to be converted to a village object
   * @param {true|} looseMatch !!!Do not provide a value for looseMatch when converting a real village name.!!!
   *          It should be set to true when it was the user that provided the input str. When true,
   *          a str like 456-789 would also match. (so that Sangu Package users don't have to use | but can instead
   *          use anything to seperate the 2 coordinates).
   * @returns {object} object with parameters isValid: false when the string could not be matched and true with extra properties
   * x, y, coord, validName (=html friendly id name) and continent
   */
  function getVillageFromCoords(str, looseMatch) {
    // if str is "villageName (X|Y) C54" then the villageName could be something like "456-321"
    // the regex then thinks that the villageName are the coords
    // looseMatch
    var targetMatch = looseMatch != undefined ? str.match(/(\d+)\D(\d+)/g) : str.match(/(\d+)\|(\d+)/g);
    if (targetMatch != null && targetMatch.length > 0) {
      var coordMatch = targetMatch[targetMatch.length - 1].match(/(\d+)\D(\d+)/);
      var village = { "isValid": true, "coord": coordMatch[1] + '|' + coordMatch[2], "x": coordMatch[1], "y": coordMatch[2] };

      village.validName = function () { return this.x + '_' + this.y; };
      village.continent = function () { return this.y.substr(0, 1) + this.x.substr(0, 1); };

      return village;
    }
    return { "isValid": false };
  }

  function buildAttackString(villageCoord, unitsSent, player, isSupport, minimum, haulDescription) {
    var seperator = " ";
    if (minimum == undefined) {
      minimum = 0;
    }

    var totalPop = 0;
    var renamed = villageCoord == null ? "" : villageCoord + seperator;
    var sent = "";
    $.each(world_data.units, function (i, val) {
      var amount = unitsSent[val];
      if (amount != 0) {
        if (val == "snob") {
          renamed += trans.tw.units.names[val] + "! ";
        }
        else if (amount >= minimum) {
          sent += ", " + trans.tw.units.shortNames[val] + "=" + amount;
        }

        totalPop += amount * world_data.unitsPositionSize[i];
      }
    });

    if (player) {
      renamed += '(' + player + ')' + seperator;
    }
    if (sent.length > 2) {
      sent = sent.substr(2);
    }

    if (isSupport) {
      sent += seperator + "(" + trans.sp.all.populationShort + ": " + formatNumber(totalPop) + ")";
    }

    if (user_data.attackAutoRename.addHaul && typeof haulDescription !== 'undefined') {
      sent += " (" + trans.tw.command.haul + " " + haulDescription + ")";
    }

    return renamed + sent;
  }

  function calcTroops(units) {
    // units is an array of numbers; keys are the unit names (without unit_)
    var x = {};
    x.totalDef = 0;

    function removeElement(arr, element) {
      var idx = arr.indexOf(element);
      if (idx != -1) {
        arr.splice(idx, 1);
      }
      return arr;
    }

    // heavy doesn't count in determining whether the village is def/off (since you got some crazy guys using hc as offense and defense:)
    $.each(removeElement(world_data.units_def, 'heavy'), function (i, v) { x.totalDef += units[v] * world_data.unitsSize['unit_' + v]; });
    x.totalOff = 0;
    $.each(removeElement(world_data.units_off, 'heavy'), function (i, v) { x.totalOff += units[v] * world_data.unitsSize['unit_' + v]; });

    x.isDef = x.totalDef > x.totalOff;
    x.isScout = units.spy * world_data.unitsSize.unit_spy > x.totalDef + x.totalOff;
    x.isMatch = function (type) { return (type == 'all' || (type == 'def' && this.isDef) || (type == 'off' && !this.isDef)); };

    x.getSlowest =
      function () {
        var slowest_unit = null;
        $.each(world_data.units, function (i, v) {
          if (units[v] > 0 && (slowest_unit == null || world_data.unitsSpeed["unit_" + slowest_unit] < world_data.unitsSpeed["unit_" + v])) {
            slowest_unit = v;
          }
        });
        return slowest_unit;
      };

    x.colorIfNotRightAttackType =
      function (cell, isAttack) {
        var isSet = false;
        if (units.snob != undefined && units.snob > 0) {
          if (isAttack) {
            if (units.snob > 1) {
              isSet = true;
              cell.css("background-color", user_data.colors.error).css("border", "1px solid black");
              cell.animate({
                             width: "70%",
                             opacity: 0.4,
                             marginLeft: "0.6in",
                             fontSize: "3em",
                             borderWidth: "10px"
                           }, 5000, function () {
                // Animation complete.
              });
            } else {
              return;
            }
          } else {
            isSet = true;
          }
        }
        else if (x.totalDef + x.totalOff < user_data.command.filterFakeMaxPop) {
          // fake
          return;
        }

        if (!isSet && (x.isScout || x.isMatch(isAttack ? 'off' : 'def'))) {
          return;
        }
        cell.css("background-color", user_data.colors.error);
      };

    return x;
  }


  function stackDisplay(totalFarm, stackOptions) {
    // TODO: this function is only used on main village overview
    if (stackOptions == undefined) {
      stackOptions = {};
    }
    var farmSize = game_data.village.buildings.farm * world_config.farmLimit;

    var stackDesc = '<b>' + formatNumber(totalFarm);
    if (stackOptions.showFarmLimit && world_config.farmLimit > 0) {
      stackDesc += ' / ' + formatNumber(farmSize);
    }

    if (stackOptions.percentage) {
      stackDesc += ' (' + stackOptions.percentage + ')</b>';
    }

    var bgColor = getStackColor(totalFarm, farmSize);
    if (stackOptions.cell == undefined) {
      return {
        color: bgColor,
        desc: stackDesc,
        cssColor: "style='background-color:" + bgColor + "'"
      };
    } else {
      if (stackOptions.appendToCell) {
        stackOptions.cell.append(" &raquo; " + stackDesc);
      } else {
        stackOptions.cell.html(stackDesc);
      }
      if (!stackOptions.skipColoring) {
        stackOptions.cell.css("background-color", bgColor);
      }
    }
  }

  /**
   * Gets the configured stack backgroundcolor for the given stackTotal
   * @param stackTotal {number}
   * @returns {color}
   */
  function getStackColor(stackTotal) {
    var color = null,
      arrayToIterate,
      farmLimitModifier;

    if (world_config.farmLimit > 0) {
      arrayToIterate = user_data.farmLimit.acceptableOverstack;
      farmLimitModifier = 30 * world_config.farmLimit;
    } else {
      arrayToIterate = user_data.farmLimit.unlimitedStack;
      farmLimitModifier = 1; // = No modifier
    }

    if (arrayToIterate.length > 0) {
      $.each(arrayToIterate, function (index, configValue) {
        if (color == null && stackTotal < farmLimitModifier * configValue) {
          if (index === 0) {
            color = "";
          } else {
            color = user_data.farmLimit.stackColors[index - 1];
            //q(stackTotal +"<"+ farmLimitModifier +"*"+ configValue);
            //q("return " + (index - 1) + "->" + color);
          }
          return false;
        }
      });

      if (color != null) {
        //q(stackTotal + " -> " + color);
        return color;
      }
      return user_data.farmLimit.stackColors[user_data.farmLimit.stackColors.length - 1];
    }

    return "";
  }
  var modernizr = (function () {
    // Difference in capital letter with the Modernizr library
    // So nothing will break should TW start making use of it
    return {
      localstorage: (function supports_html5_storage() {
        try {
          return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
          return false;
        }
      })()
    };
  })();

  var pers;
  (function (pers) {
    function getKey(key) {
      return 'sangu_' + key;
    }

    function getWorldKey(key) {
      return 'sangu_' + game_data.world + '_' + key;
    }

    function getCookie(key) {
      key = getWorldKey(key);
      return (function() {
        var x, cooks, cookie;
        if (document.cookie.match(/;/)) {
          cooks = document.cookie.split("; ");
          for (x = 0; x < cooks.length; x++) {
            cookie = cooks[x];
            if (cookie.match(key + "=")) {
              return cookie.replace(key + "=", "");
            }
          }
        } else {
          if (document.cookie.match(key + "=")) {
            return document.cookie.replace(key + "=", "");
          }
        }

        return '';
      })();
    }

    function getGlobal(key) {
      key = getKey(key);
      if (modernizr.localstorage) {
        var value = localStorage[key];
        return typeof value === 'undefined' ? '' : value;
      } else {
        return getCookie(key);
      }
    }

    function getSession(key) {
      key = getWorldKey(key);
      if (modernizr.localstorage) {
        var value = sessionStorage[key];
        return typeof value === 'undefined' ? '' : value;
      } else {
        return getCookie(key);
      }
    }

    function get(key) {
      return getGlobal(key);
    }

    function setCookie(key, value, expireMinutes) {
      key = getWorldKey(key);
      (function() {
        var date_obj = new Date(),
          time = date_obj.getTime();
        if (typeof expireMinutes === 'undefined') {
          time += 60 * 1000 * 24 * 356;
        } else {
          time += expireMinutes * 1000 * 60;
        }
        date_obj.setTime(time);

        document.cookie = key + "=" + value + ";expires=" + date_obj.toGMTString() + ";";
      })();
    }

    function setGlobal(key, value) {
      key = getKey(key);
      if (modernizr.localstorage) {
        localStorage[key] = value;
      } else {
        setCookie(key, value);
      }
    }

    function setSession(key, value) {
      key = getWorldKey(key);
      if (modernizr.localstorage) {
        sessionStorage[key] = value;
      } else {
        setCookie(key, value);
      }
    }

    function set(key, value) {
      setGlobal(key, value);
    }

    function removeSessionItem(key) {
      key = getKey(key);
      if (modernizr.localstorage) {
        sessionStorage.removeItem(key);
      }
      // fuck cookies
    }

    function clear() {
      if (modernizr.localstorage) {
        sessionStorage.clear();
        localStorage.clear();
      }
    }

    pers.removeSessionItem = removeSessionItem;
    pers.getWorldKey = getWorldKey;
    pers.getKey = getKey;
    pers.set = set;
    pers.setCookie = setCookie;
    pers.setGlobal = setGlobal;
    pers.setSession = setSession;
    pers.get = get;
    pers.getCookie = getCookie;
    pers.getGlobal = getGlobal;
    pers.getSession = getSession;
    pers.clear = clear;
  })(pers || (pers = {}));
  $.fn.sortElements = (function () {
    var sort = [].sort;
    return function (comparator, getSortable) {
      getSortable = getSortable || function () { return this; };
      var placements = this.map(function () {
        var sortElement = getSortable.call(this),
          parentNode = sortElement.parentNode,
        // Since the element itself will change position, we have
        // to have some way of storing its original position in
        // the DOM. The easiest way is to have a 'flag' node:
          nextSibling = parentNode.insertBefore(
            document.createTextNode(''),
            sortElement.nextSibling
          );

        return function () {
          if (parentNode === this) {
            throw new Error("You can't sort elements if any one is a descendant of another.");
          }

          // Insert before flag:
          parentNode.insertBefore(this, nextSibling);
          // Remove flag:
          parentNode.removeChild(nextSibling);
        };
      });

      return sort.call(this, comparator).each(function (i) {
        placements[i].call(getSortable.call(this));
      });
    };
  })();

  $.fn.outerHTML =
    function () {
      return $('<div>').append(this.clone()).remove().html();
    };

  /**
   * Create a dialog box on a fixed position with self closing functionality
   * @param {string} id The DOM ID of the div
   * @param content .title: Short title. Defaults to Sangu Package.
   *                .body: The HTML to show in the body of the tooltip
   * @param options .top: CSS top in px
   *                .left: CSS left in px
   *                .width: CSS width in px. Defaults to 350.
   *                .showOnce: If true the tooltip will never be shown again once closed. Defaults to true.
   */
  function createFixedTooltip(id, content, options) {
    if (typeof options.width === 'undefined') {
      options.width = 350;
    }
    if (typeof options.showOnce === 'undefined') {
      options.showOnce = true;
    }
    if (typeof content.title === 'undefined') {
      content.title = "Sangu Package";
    }

    var persKey = "fixedToolTip_"+id; // Other implementations depend on this naming
    if (!options.showOnce || pers.getGlobal(persKey) == '') {
      content_value.after('<div id="' + id + '" class="vis" style="z-index: 100001; margin: 2px; '
                            + 'width: '+options.width+'px; display: block; position:absolute; top: '+options.top+'px; left: '+options.left+'px; border: 1px solid black; background-color: #F4E4BC">'
                            + '<h4>' + '<img class="'+id+'closeTooltip" style="float: right; cursor: pointer;" src="graphic/minus.png">' + content.title + '</h4>'
                            + '<div style="display: block; text-align: left; margin: 2px;">' + content.body + '</div>'
                            + '</div>');

      $("."+id+"closeTooltip", "#" + id).click(function() {
        $("#" + id).hide();
        if (options.showOnce) {
          pers.setGlobal(persKey, "1");
        }
      });
    }
  }

  function createSpoiler(button, content, opened) {
    return "<div id='spoiler'><input type='button' value='" + button + "' onclick='toggle_spoiler(this)' /><div><span style='display:" + (opened ? 'block' : 'none') + "'>" + content + "</span></div></div>";
  }

  function createMoveableWidget(id, title, content) {
    return '<div id=' + id + '+ class="vis moveable widget"><h4><img style="float: right; cursor: pointer;"'
      + ' onclick="return VillageOverview.toggleWidget(\'' + id + '\', this);" src="graphic/minus.png">'
      + title + '</h4><div style="display: block;">' + content + '</div></div>';
  }

  function printCoord(village, desc) {
    if (server_settings.coordinateLinkAllowed) {
      return "<a href=# onclick=\"$('#inputx').val("+village.x+"); $('#inputy').val("+village.y+"); return false;\">" + desc + "</a>";
    } else {
      return "<b>" + desc + "</b> <input type=text onclick='this.select(); this.focus()' size=7 value='" + village.x + '|' + village.y + "'>";
    }
  }

  // Activate / deactivate the tool
  var isSanguActive = pers.get("sanguActive") == "true";
  if (location.href.indexOf('changeStatus=') > -1) {
    isSanguActive = location.href.indexOf('changeStatus=true') > -1;
    pers.set("sanguActive", isSanguActive);
    pers.setGlobal("fixedToolTip_sanguActivatorTooltip", 1);
  }

  var activatorImage = isSanguActive ? "green" : 'red';
  var activatorTitle = (!isSanguActive ? trans.sp.sp.activatePackage : trans.sp.sp.deactivatePackage) + " (v" + sangu_version + ")";

  function isSanguCompatible() {
    return sangu_version.indexOf(game_data.majorVersion) === 0;
  }

  // Check for new version
  var loginMonitor = pers.get("sanguLogin");
  if (typeof GM_xmlhttpRequest !== "undefined" && !isSanguCompatible() && loginMonitor !== '') {
    var parts = loginMonitor.match(/(\d+)/g);
    if (parseInt(parts[2], 10) != (new Date()).getDate()) {
      GM_xmlhttpRequest({
                          method: "GET",
                          url: "http://www.sangu.be/api/sangupackageversion.php",
                          onload: function (response) {
                            console.log(response.status, response.responseText.substring (0, 80));
                          }
                        });

    }
  }

  if (pers.get("forceCompatibility") === '' || pers.get("forceCompatibility") === 'false') {
    if (isSanguActive) {
      // Check compatibility with TW version
      if (!isSanguCompatible()) {
        try {
          ScriptAPI.register('Sangu Package', sangu_version, 'Laoujin', server_settings.sanguEmail);
        } catch (e) {
          $("#script_list a[href$='mailto:"+server_settings.sanguEmail+"']").after(" &nbsp;<a href='' id='removeScriptWarning'>"+trans.sp.sp.removeScriptWarning+"</a>");
          $("#removeScriptWarning").click(function() {
            pers.set("forceCompatibility", "true");
          });
        }
      }
    }

    // gray icon when tw version doesn't match
    if (!isSanguCompatible()) {
      activatorImage = "grey";
      activatorTitle = trans.sp.sp.activatePackageWithCompatibility.replace("{version}", sangu_version);
    }
  }

  $("#storage").parent()
    .after(
      "<td class='icon-box' nowrap><a href=" + location.href.replace("&changeStatus=" + isSanguActive, "")
      + "&changeStatus=" + (!isSanguActive) + "><img src='graphic/dots/" + activatorImage
      + ".png' title='" + activatorTitle
      + "' id='sangu_activator' /></a>&nbsp;</td>");

  // First time run message - Position beneath resource/storage display
  if (!isSanguActive) {
    (function() {
      var position = $("#storage").position(),
        options = {
          left: position.left - 150,
          top: position.top + 35
        },
        content = {body: trans.sp.sp.firstTimeRun.replace("{img}", "<img src='graphic/dots/red.png' />")};

      createFixedTooltip("sanguActivatorTooltip", content, options);
    }());
  } else {
    (function() {
      var position = $("#storage").position(),
        options = {
          left: position.left - 150,
          top: position.top + 35
        },
        content = {body: '<b>Sangu stelt zijn nieuwste tool voor: <a href="http://sangu.be">TW Tactics</a>!</b><br><br>Probeer het zeker eens voordat je vijanden het tegen jou beginnen te gebruiken!'};

      createFixedTooltip("twTacticsTooltip", content, options);
    }());
  }

  // User config
  // Configure the Sangu Package

  /*
   user_data = pers.get('sangusettings');
   if (user_data !== '') {
   user_data = JSON.parse(user_data);

   } else {*/
  user_data = {
    proStyle: true,
    displayDays: false, /* true: display (walking)times in days when > 24 hours. false: always displays in hours */
    walkingTimeDisplay: "{duration} || {arrival}",

    colors: {
      error: "#FF6347",
      good: "#32CD32",
      special: "#00FFFF",
      neutral: "#DED3B9"
    },

    global: {
      resources: {
        active: true, /* All pages: true/false: color the resources based on how much the storage is filled */
        backgroundColors: ['#ADFF2F', '#7FFF00', '#32CD32', '#3CB371', '#228B22', '#FFA500', '#FF7F50', '#FF6347', '#FF4500', '#FF0000'], /* All pages: Colors used for the previous setting. First is least filled, last is most filled storage place */
        blinkWhenStorageFull: true /* All pages: Blink the resources if the storage is full */
      },
      incomings: {
        editLinks: true, /* All pages: Edit the incoming attacks/support links: add "show all groups" and "show all pages" to the original links */
        track: true,
        indicator: "({current} <small>{difference}</small>)",
        indicatorTooltip: "Laatste tijdcheck: {elapsed} geleden",
        lastTimeCheckWarning: "Aanvallen: {difference}. Laatste tijdcheck: {elapsed} geleden"
      },
      visualizeFriends: true,
      duplicateLogoffLink: false
    },

    scriptbar: {
      editBoxCols: 700,
      editBoxRows: 12
    },

    main: {
      villageNames: [], /* Add village names to the village headquarters to quickly edit the village name to a preset name. Set to [] or null to disable, for 1 village name use ['MyVillageName'] or for more names: ['name1', 'name2', 'name3'] */
      villageNameClick: true, /* true: one of the previous button clicked automatically changes the village name. false: only fills in the name in the textbox but does not click the button */
      ajaxLoyalty: true /* Get the loyalty at the building construction/destruction page */
    },

    other: {
      calculateSnob: true, /* nobles: calculates how many nobles can be produced immediately */
      reportPublish: ["own_units", "own_losses", "opp_units", "opp_losses", "carry", "buildings", "own_coords", "opp_coords", "belief"] /* Publishing report: automatically check the 'show' checkboxes */
    },

    market: {
      resizeImage: true,
      autoFocus: true
    },

    farmLimit: {
      stackColors: ['#DED3B9', '#3CB371', '#FF6347'],
      acceptableOverstack: [0.5, 1.2, 1.35], /* Different pages: % of acceptable overstack (only relevant for farmlimit worlds) */
      unlimitedStack: [24000, 60000, 100000] /* Different pages: Calculate stacks based on total troops (for non farmlimit worlds) */
    },

    command: { /* features for the own troops overview page */
      changeTroopsOverviewLink: true, /* Change the link to the own troops overview */
      middleMouseClickDeletesRow2: false, /* Let the new default overwrite the old one */

      filterMinPopulation: 18000, /* Default number filled in to filter on village stack */
      filterMinDefaultType: 'axe', /* This unit type is by default selected in the filter dropdown */
      filterMinDefault: 5000, /* The default number filled in to filter on troop amounts */
      filterMin: { axe: 7000, spear: 3000, archer: 3000, heavy: 500, catapult: 50, spy: 50, light: 2000, marcher: 2000, ram: 1, catapult: 50, snob: 2 }, /* Default filter numbers for the other units */
      filterMinOther: 5000, /* Use this number as the default when the unit is not present in filterMin */
      filterAutoSort: true, /* Automatically sort the list on walking distance when entering a target village */

      /* These features apply to the commands overview page */
      sumRow: true, /* Add a totalrow between different villages */
      filterFakeMaxPop: 300, /* Commands fake filter: Everything below 300 pop is considered a fake attack */
      bbCodeExport: { /* BB code export */
        requiredTroopAmount: 100
      }
    },

    incomings: {
      attackIdDescriptions: [
        {minValue: 10, text: "&nbsp;"},
        {minValue: 50, text: "10-50"},
        {minValue: 100, text: "50-100"},
        {minValue: 200, text: "100-200"},
        {minValue: 500, text: "200-500"},
        {minValue: 1000, text: "500-1000"},
        {minValue: 5000, text: "1000-5000"}
      ],
      attackIdHigherDescription: "5000+"
    },


    overviews: {
      addFancyImagesToOverviewLinks: true
    },

    incoming: { /* Features for the built in TW tagger */
      autoOpenTagger: true, 		/* Open the tagger automatically if the incoming attack has not yet been renamed */
      forceOpenTagger: true, 	/* Always open the tagger automatically */
      renameInputTexbox: "{unit} ({xy}) {player} F{fields}{night}", /* Possibilities: {id}:internal tw attack id {unit}: short unitname {xy}: coordinates {player} {village}: full village name {c}: continent {fields} distance between the villages {night} indication when attack arrives during the nightbonus. Set to "" to disable. */
      villageBoxSize: 600, 			/* Adjust the width of the table with the village information (support for 2-click) */
      invertSort: true		/* true=noblemen at the top and scouts at the bottom of the table */
    },

    overview: { /* The default village overview page */
      ajaxSeperateSupport: true, /* Village overview: Seperate own and supported troops */
      ajaxSeperateSupportStacks: true, /* Village overview: Calculate stacks for own and supported troops */
      canHideDiv: true
    },

    mainTagger2: {
      active: true,
      autoOpen: true,
      inputBoxWidth: 300,
      defaultDescription: "{xy} OK",
      otherDescs:
        [
          { active: true, name: "Dodgen", hitKey: "D", renameTo: "{xy}----------------------------------------- DODGE THIS" },
          { active: true, name: "Nacht", hitKey: "N", renameTo: "{xy} NIGHTBONUS" },
          { active: true, name: "Check stack", hitKey: "P", renameTo: "{xy}----------------------------------------- CHECK STACK" },
          { active: true, name: "Timen!", hitKey: "T", renameTo: "{xy}***************************************** TIME IT!" },
          { active: true, name: "Edelen!", hitKey: "E", renameTo: "{xy}----------------------------------------- NOBLE!!" },
          { active: false, name: "Leeg1", hitKey: "L", renameTo: "It has to be, automatically" },
          { active: false, name: "Leeg2", hitKey: "U", renameTo: "Check it out, you'd better work it out" },
          { active: false, name: "Leeg3", hitKey: "Y", renameTo: "Change to another route" },
          { active: false, name: "Leeg4", hitKey: "O", renameTo: "My techniques, strategies, abilities" }
        ],
      keepReservedWords: true,
      reservedWords: [
        "Edel.", "Edelman",
        "Ram", "Kata.", "Katapult",
        "Zcav.", "Zware cavalerie",
        "Lcav.", "Lichte Cavalerie", "Bereden boog", "Bboog.",
        "Verk.", "Verkenner",
        "Bijl", "Zwaard", "Speer", "Boog",
        "Ridder"
      ],
      autoOpenCommands: false,
      minutesDisplayDodgeTimeOnMap: 3,
      minutesWithoutAttacksDottedLine: 3 * 60,
      colorSupport: '#FFF5DA' /* Main village overview: give incoming support a different background color */
    },

    villageInfo4: [
      {
        /* On info_village page add extra link to attack. */
        active: true,
        off_link: {
          name: "Aanvalleuh!",
          group: 0,
          filter: {
            active: true,
            unit: "axe",
            amount: 5000
          },
          sort: true,
          changeSpeed: "ram",
          icon: "graphic/unit/unit_knight.png"
        },
        def_link: {
          name: "Verdedigen!",
          group: 0,
          filter: {
            active: true,
            unit: "spear",
            amount: 4000
          },
          sort: true,
          changeSpeed: "spear",
          icon: "graphic/command/support.png"
        }
      },
      {
        /* On info_village page add extra link to attack. */
        active: false,
        off_link: {
          name: "&raquo; off2",
          group: 0,
          filter: {
            active: false,
            unit: "axe",
            amount: 4000
          },
          sort: true,
          changeSpeed: "ram"
        },
        def_link: {
          name: "&raquo; Snelle Os!",
          group: 0,
          filter: {
            active: true,
            unit: "spear",
            amount: 1000
          },
          sort: true,
          changeSpeed: "spear"
        }
      }
    ],

    resources: {
      requiredResDefault: 250000,
      requiredMerchants: 50,
      filterMerchants: true,
      filterRows: false,
      bbcodeMinimumDiff: 50000,
      highlightColor: "#FF7F27"
    },

    jumper: {
      enabled: true,
      autoShowInputbox: false
    },

    attackAutoRename: {
      active: true,
      addHaul: false
    },

    confirm: {
      addExtraOkButton: false,
      replaceNightBonus: true,
      replaceTribeClaim: true,
      addCatapultImages: true
    },

    place: {
      attackLinks: {
        scoutVillage: 100,
        scoutPlaceLinks: [5, 100, 500],
        scoutPlaceLinksName: "Scout{amount}",

        fakePlaceLink: true,
        fakePlaceExcludeTroops: [],
        fakePlaceLinkName: "Fake",

        noblePlaceLink: true, /* (de)Activate all noble links */
        noblePlaceLinkFirstName: "NobleFirst", /* Name for the first noble which has most troops */

        noblePlaceLinkSupportName: "NobleMin", /* snob with only minimal support */
        noblePlaceLinksForceShow: true, /* Show NobleMin also where is only one 1 snob in the village */
        nobleSupport: [
          { amount: 50, unit: 'light', villageType: 'off' },
          { amount: 50, unit: 'heavy', villageType: 'def'}
        ],

        noblePlaceLinkDivideName: "NobleDivide",
        noblePlaceLinkDivideAddRam: false /* false: Rams are not sent along with NobleDivide */
      },
      customPlaceLinks:
        [
          // use minus zero numbers to leave so many units at home
          { active: true, type: 'def', name: 'AllDef', spear: 25000, heavy: 5000, archer: 25000, sword: 25000, sendAlong: 0 },
          { active: true, type: 'def', name: '1/2-Zc', spear: 4000, heavy: 1000, sendAlong: 500 },
          { active: true, type: 'off', name: 'Smart'/*, spear: 25000*/, sword: -10, axe: 25000, spy: 1, light: 5000/*, heavy: 5000*/, marcher: 5000, ram: 5000, catapult: 5000, sendAlong: 0 },
          { active: true, type: 'off', name: 'Bijl', spear: 25000, axe: 25000, spy: 1, light: 5000, heavy: 5000, marcher: 5000, sendAlong: 0 },
          { active: true, type: 'off', name: 'Zwaard', spear: 25000, sword: -10, axe: 25000, spy: 1, light: 5000, heavy: 5000, marcher: 5000, sendAlong: 0, required: ['sword', 1] },

          { active: false, type: 'def', name: 'AlleDef', spear: 25000, sword: 25000, heavy: 5000, archer: 25000, sendAlong: 0 },
          { active: false, type: 'def', name: '3deZc', spear: 2500, heavy: 650, sendAlong: 0 },
          { active: false, type: 'def', name: '4deZc', spear: 2000, heavy: 500, sendAlong: 0 },
          { active: false, type: 'def', name: 'HelftZw', spear: 5000, sword: 5000, sendAlong: 500 },
          { active: false, type: 'def', name: '3deZw', spear: 3300, sword: 3300, sendAlong: 0 },
          { active: false, type: 'def', name: '4deZw', spear: 2500, sword: 2500, sendAlong: 0 }
        ]
    },

    /**
     * units_support_detail: options on the 2 def troop overview pages
     * on bbcode restack - and others!!)
     */
    restack: {
      to: 72000,
      requiredDifference: 1000,
      fieldsDistanceFilterDefault: 30,
      filterReverse: true,
      autohideWithoutSupportAfterFilter: true,
      calculateDefTotalsAfterFilter: true,
      defaultPopulationFilterAmount: 80000, /* this isn't related to restack */
      removeRowsWithoutSupport: false
    },

    showPlayerProfileOnVillage: false,
    profile: {
      show: true,
      moveClaim: true,
      mapLink: {
        show: true,
        fill: '#000000',
        zoom: '200',
        grid: true,
        playerColor: '#ffff00',
        tribeColor: '#0000FF',
        centreX: 500,
        centreY: 500,
        ownColor: '#FFFFFF',
        markedOnly: true,
        yourTribeColor: "#FF0000"
      },
      playerGraph: [["points", false], ["villages", false], ["od", false], ["oda", false], ["odd", false], ["rank", false]], // small / big / false
      tribeGraph: [["points", false], ["villages", false], ["od", false], ["oda", false], ["odd", false], ["rank", false], ["members", 'big', true]],
      twMapPlayerGraph: { player: [true, true], p_player: [false, false], oda_player: [true, false], odd_player: [true, false] },
      twMapTribeGraph: { tribe: [true, true], p_tribe: [false, false], oda_tribe: [true, false], odd_tribe: [true, false] },

      popup: {
        show: true,
        width: 900,
        height: 865,
        left: 50,
        top: 50
      }
    },
    smithy:
      [
        ['offense', { spear: [3, 3], sword: [1, 1], axe: [3, 3], spy: [0, 0], light: [3, 3], heavy: [3, 3], ram: [2, 2], catapult: [0, 0]}],
        ['defense', { spear: [3, 3], sword: [1, 1], axe: [0, 3], spy: [0, 3], light: [0, 3], heavy: [3, 3], ram: [0, 1], catapult: [1, 3]}],
        ['catapult', { spear: [2, 3], sword: [1, 1], axe: [3, 3], spy: [0, 3], light: [2, 3], heavy: [3, 3], ram: [0, 0], catapult: [2, 3]}]
      ],
    buildings: {
      main: [20, 20],
      barracks: [25, 25],
      stable: [20, 20],
      garage: [1, 5],
      church: [0, 1],
      church_f: [0, 1],
      snob: [1, 3],
      smith: [20, 20],
      place: [1, 1],
      statue: [0, 1],
      market: [10, 20],
      wood: [30, 30],
      stone: [30, 30],
      iron: [30, 30],
      farm: [30, 30],
      storage: [30, 30],
      hide: [0, 10],
      wall: [20, 20]
    }
  };
  //}

  (function() {
    var saved_data = pers.get('sangusettings');
    if (saved_data !== '') {
      user_data = $.extend(true, user_data, JSON.parse(saved_data));
    }
  }());

  if (isSanguActive) {
    // world config: global game settings
    world_config = {
      hasMilitia: false,
      nightbonus: {
        active: false,
        from: 0,
        till: 0
      },
      smithyLevels: true,
      hasChurch: false,
      hasArchers: false,
      hasKnight: false,
      speed: 1,
      unitSpeed: 1,
      farmLimit: 0,
      minFake: 0,
      hasMinFakeLimit: false,
      coins: false,
      maxNobleWalkingTime: 999
    };

    if (pers.get('worldconfig') !== '') {
      world_config = JSON.parse(pers.get("worldconfig"));

    } else {
      // load new world through tw API
      if (server_settings.ajaxAllowed) {
        function world_config_setter_unit(configBag, unitInfoXml) {
          configBag.hasMilitia = $("config militia", unitInfoXml).length !== 0;
        }

        function world_config_setter(configBag, infoXml) {
          configBag.nightbonus = {
            active: $("night active", infoXml).text() === "1",
            from: parseInt($("night start_hour", infoXml).text(), 10),
            till: parseInt($("night end_hour", infoXml).text(), 10)
          };
          configBag.smithyLevels = $("game tech", infoXml).text() === "1" || $("game tech", infoXml).text() === "0";
          configBag.hasChurch = $("game church", infoXml).text() !== "0";
          configBag.hasArchers = $("game archer", infoXml).text() !== "0";
          configBag.hasKnight = $("game knight", infoXml).text() !== "0";
          configBag.speed = parseFloat($("config speed", infoXml).text());
          configBag.unitSpeed = parseFloat($("config unit_speed", infoXml).text());
          configBag.farmLimit = parseInt($("game farm_limit", infoXml).text(), 10);
          configBag.minFake = parseInt($("game fake_limit", infoXml).text(), 10) / 100;
          configBag.hasMinFakeLimit = configBag.minFake > 0;
          configBag.coins = $("snob gold", infoXml).text() === "1";
          configBag.maxNobleWalkingTime = parseInt($("snob max_dist", infoXml).text(), 10) * configBag.speed * configBag.unitSpeed;
        }

        function world_config_getter(world) {
          // world nl: http://nl16.tribalwars.nl/
          // world de: http://de90.die-staemme.de/
          if (typeof world === 'undefined') world = '';

          var world_config = {};
          $.ajax({
                   url: world + "interface.php?func=get_unit_info",
                   async: false,
                   success: function(xml) {
                     world_config_setter_unit(world_config, xml);
                   }
                 });

          $.ajax({
                   url: world + "interface.php?func=get_config",
                   async: false,
                   success: function(xml) {
                     world_config_setter(world_config, xml);
                   }
                 });
          return world_config;
        }
        world_config = world_config_getter();

      } else {
        // Not allowed to get data with ajax: need to store the configuration here
        //world_config = (function() {
        // paste the world configurations for all worlds on servers that disallow ajax
        //})();
        alert("No configurations present for this server! (see world_config.js)\nContinueing with default settings.");
      }

      pers.set("worldconfig", JSON.stringify(world_config));
    }
    // world config
    // RESOURCES
    world_data.resources = ['holz', 'lehm', 'eisen'];
    world_data.resources_en = ['wood', 'stone', 'iron'];

    // BUILDINGS
    world_data.buildingsSize =
      [
        ["main", [5, 6, 7, 8, 9, 11, 13, 15, 18, 21, 24, 28, 33, 38, 45, 53, 62, 72, 84, 99, 116, 135, 158, 185, 216, 253, 296, 347, 406, 475]],
        ["barracks", [7, 8, 10, 11, 13, 15, 18, 21, 25, 29, 34, 39, 46, 54, 63, 74, 86, 101, 118, 138, 162, 189, 221, 259, 303]],
        ["stable", [8, 9, 11, 13, 15, 18, 21, 24, 28, 33, 38, 45, 53, 62, 72, 84, 99, 115, 135, 158]],
        ["garage", [8, 9, 11, 13, 15, 18, 21, 24, 28, 33, 38, 45, 53, 62, 72]],
        ["snob", [80, 94, 110]],
        ["smith", [20, 23, 27, 32, 37, 44, 51, 60, 70, 82, 96, 112, 132, 154, 180, 211, 247, 289, 338, 395]],
        ["place", [0]],
        ["market", [20, 23, 27, 32, 37, 44, 51, 60, 70, 82, 96, 112, 132, 154, 180, 211, 247, 289, 338, 395, 462, 541, 633, 740, 866]],
        ["wood", [5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 21, 24, 28, 33, 38, 43, 50, 58, 67, 77, 89, 103, 119, 138, 159, 183, 212, 245, 283, 326]],
        ["stone", [10, 11, 13, 15, 17, 19, 22, 25, 29, 33, 37, 42, 48, 55, 63, 71, 81, 93, 106, 121, 137, 157, 179, 204, 232, 265, 302, 344, 392, 447]],
        ["iron", [10, 12, 14, 16, 19, 22, 26, 30, 35, 41, 48, 56, 66, 77, 90, 105, 123, 144, 169, 197, 231, 270, 316, 370, 433, 507, 593, 696, 811, 949]],
        ["farm", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
        ["storage", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
        ["hide", [2, 2, 3, 3, 4, 4, 5, 6, 7, 8]],
        ["wall", [5, 6, 7, 8, 9, 11, 13, 15, 18, 21, 24, 28, 33, 38, 45, 53, 62, 72, 84, 99]]
      ];

    world_data.buildingsPoints =
      [
        ["main", [10, 12, 14, 17, 21, 25, 30, 36, 43, 52, 62, 74, 89, 107, 128, 145, 185, 222, 266, 319, 383, 460, 552, 662, 795, 954, 1145, 1648, 1978]],
        ["barracks", [16, 19, 23, 28, 33, 40, 48, 57, 69, 83, 99, 119, 143, 171, 205, 247, 296, 355, 426, 511, 613, 736, 883, 1060, 1272]],
        ["stable", [20, 24, 29, 35, 41, 50, 60, 72, 86, 103, 124, 149, 178, 214, 257, 308, 370, 444, 532, 639]],
        ["garage", [24, 29, 35, 41, 50, 60, 72, 86, 103, 124, 149, 178, 214, 257, 308]],
        ["snob", [512, 614, 737]],
        ["smith", [19, 23, 27, 33, 39, 47, 57, 68, 82, 98, 118, 141, 169, 203, 244, 293, 351, 422, 506, 607]],
        ["place", [0]],
        ["market", [10, 12, 14, 17, 21, 25, 30, 36, 43, 52, 62, 74, 89, 107, 128, 154, 185, 222, 266, 319, 383, 460, 552, 662, 795]],
        ["wood", [6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 45, 53, 64, 77, 92, 111, 133, 160, 192, 230, 276, 331, 397, 477, 572, 687, 824, 989, 1187]],
        ["stone", [6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 45, 53, 64, 77, 92, 111, 133, 160, 192, 230, 276, 331, 397, 477, 572, 687, 824, 989, 1187]],
        ["iron", [6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 45, 53, 64, 77, 92, 111, 133, 160, 192, 230, 276, 331, 397, 477, 572, 687, 824, 989, 1187]],
        ["farm", [5, 6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 45, 53, 64, 77, 92, 111, 133, 160, 192, 230, 276, 331, 397, 477, 572, 687, 824, 989]],
        ["storage", [6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 45, 53, 64, 77, 92, 111, 133, 160, 192, 230, 276, 331, 397, 477, 572, 687, 824, 989, 1187]],
        ["hide", [5, 6, 7, 9, 10, 12, 15, 18, 21, 26]],
        ["wall", [8, 10, 12, 14, 17, 20, 24, 29, 34, 41, 50, 59, 71, 86, 103, 123, 148, 177, 213, 256]]
      ];

    world_data.buildings = ["main", "barracks", "stable", "garage"];
    if (world_config.hasChurch) {
      world_data.buildingsSize.push(["church", [5000, 7750, 12013]]);
      world_data.buildingsSize.push(["church_f", [5]]);
      world_data.buildings.push("church");
    }
    world_data.buildings = world_data.buildings.concat(["snob", "smith", "place"]);
    if (world_config.hasKnight) {
      world_data.buildingsSize.push(["statue", [10]]);
      world_data.buildingsPoints.push(["statue", [24]]);
      world_data.buildings.push("statue");
    }
    world_data.buildings = world_data.buildings.concat(["market", "wood", "stone", "iron", "farm", "storage", "hide", "wall"]);


    // UNITS
    world_data.unitsSize = { "unit_spear": 1, "unit_sword": 1, "unit_axe": 1, "unit_spy": 2, "unit_light": 4, "unit_heavy": 6, "unit_ram": 5, "unit_catapult": 8, "unit_snob": 100 };
    world_data.unitsSpeed = { "unit_spear": 18, "unit_sword": 22, "unit_axe": 18, "unit_spy": 9, "unit_light": 10, "unit_heavy": 11, "unit_ram": 30, "unit_catapult": 30, "unit_snob": 35, "unit_merchant": 6 };

    world_data.units_def = ["spear", "sword", "heavy"];
    world_data.units_off = ["axe", "light", "heavy"];
    if (!world_config.hasArchers && !world_config.hasKnight) {
      world_data.unitsPositionSize = [1, 1, 1, 2, 4, 6, 5, 8, 100];
      world_data.units = ["spear", "sword", "axe", "spy", "light", "heavy", "ram", "catapult", "snob"];
    } else {
      world_data.units = ["spear", "sword", "axe"];
      world_data.unitsPositionSize = [1, 1, 1];
      if (world_config.hasArchers) {
        world_data.units_off.push("marcher");
        world_data.units_def.push("archer");
        $.extend(world_data.unitsSize, { "unit_archer": 1 }, { "unit_marcher": 5 });
        $.extend(world_data.unitsSpeed, { "unit_archer": 18 }, { "unit_marcher": 10 });
        world_data.units.push("archer");
        world_data.unitsPositionSize.push(1);
      }
      world_data.units.push("spy");
      world_data.unitsPositionSize.push(2);
      world_data.units.push("light");
      world_data.unitsPositionSize.push(4);
      if (world_config.hasArchers) {
        world_data.units.push("marcher");
        world_data.unitsPositionSize.push(5);
      }
      world_data.units.push("heavy");
      world_data.unitsPositionSize.push(6);
      world_data.units.push("ram");
      world_data.unitsPositionSize.push(5);
      world_data.units.push("catapult");
      world_data.unitsPositionSize.push(8);
      if (world_config.hasKnight) {
        $.extend(world_data.unitsSize, { "unit_knight": 10 });
        $.extend(world_data.unitsSpeed, { "unit_knight": 10 });
        world_data.units.push("knight");
        world_data.unitsPositionSize.push(10);
      }
      world_data.units.push("snob");
      world_data.unitsPositionSize.push(100);
    }

    // Unit speed adjustments
    world_config.maxNobleWalkingTime *= world_data.unitsSpeed.unit_snob;
    var speedModifier = world_config.speed * world_config.unitSpeed;
    if (speedModifier != 1) {
      $.each(world_data.unitsSpeed, function (index, value) {
        world_data.unitsSpeed[index] = world_data.unitsSpeed[index] / speedModifier;
      });
    }

    /**
     * Adds a . thousands separator
     */
    function formatNumber(nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
      }
      return x1 + x2;
    }
    // DATETIME FUNCTIONS
    function prettyDate(diff, showSeconds) {
      diff = diff / 1000;
      if (diff < 0) {
        return "&nbsp;";
      }
      if (diff < 60) {
        if (showSeconds) {
          return diff + " " + trans.sp.tagger.sentSeconds;
        }
        return trans.sp.tagger.sentNow;
      }
      if (diff < 120) {
        return trans.sp.tagger.sent1Minute;
      }
      if (diff < 3600) {
        return Math.floor(diff / 60) + " " + trans.sp.tagger.sentMinutes;
      }
      if (diff < 7200) {
        return trans.sp.tagger.sent1Hour + ", " + Math.floor((diff - 3600) / 60) + " " + trans.sp.tagger.sentMinutes;
      }
      return Math.floor(diff / 3600) + " " + trans.sp.tagger.sentHours + ", " + Math.floor((diff % 3600) / 60) + " " + trans.sp.tagger.sentMinutes;
    }

    function twDurationFormat(num) {
      var days = 0;
      if (user_data.displayDays) {
        days = Math.floor(num / 1440);
      }
      num -= days * 1440;
      var hours = Math.floor(num / 60);
      num -= hours * 60;
      var mins = Math.floor(num);
      num -= mins;
      var secs = Math.round(num * 60);

      if (days > 0) {
        return days + '.' + pad(hours, 2) + ':' + pad(mins, 2) + ':' + pad(secs, 2);
      } else {
        return pad(hours, 2) + ':' + pad(mins, 2) + ':' + pad(secs, 2);
      }
    }

    function twDateFormat(dat, alwaysPrintFullDate, addYear) {
      var day = dat.getDate();
      var cur = new Date().getDate();

      if (!alwaysPrintFullDate && day == cur) {
        return trans.tw.all.today + " " + pad(dat.getHours(), 2) + ':' + pad(dat.getMinutes(), 2) + ':' + pad(dat.getSeconds(), 2);
      }
      else if (!alwaysPrintFullDate && day == cur + 1) {
        return trans.tw.all.tomorrow + " " + pad(dat.getHours(), 2) + ':' + pad(dat.getMinutes(), 2) + ':' + pad(dat.getSeconds(), 2);
      }
      else if (addYear) {
        return trans.tw.all.dateOn + " " + dat.getDate() + "." + pad(dat.getMonth() + 1, 2) + "." + (dat.getFullYear() + '').substr(2) + " " + pad(dat.getHours(), 2) + ':' + pad(dat.getMinutes(), 2) + ':' + pad(dat.getSeconds(), 2); // + "(" + dat.getFullYear() + ")";
      } else {
        return trans.tw.all.dateOn + " " + dat.getDate() + "." + pad(dat.getMonth() + 1, 2) + ". " + pad(dat.getHours(), 2) + ':' + pad(dat.getMinutes(), 2) + ':' + pad(dat.getSeconds(), 2); // + "(" + dat.getFullYear() + ")";
      }
    }

    function getTimeFromTW(str) {
      // NOTE: huh this actually returns the current date
      // with some new properties with the "str" time
      //17:51:31
      var timeParts = str.split(":");
      var seconds = timeParts[2];
      var val = {};
      val.hours = parseInt(timeParts[0], 10);
      val.minutes = parseInt(timeParts[1], 10);
      if (seconds.length > 2) {
        var temp = seconds.split(".");
        val.seconds = parseInt(temp[0], 10);
        val.milliseconds = parseInt(temp[1], 10);
      } else {
        val.seconds = parseInt(seconds, 10);
      }
      val.totalSecs = val.seconds + val.minutes * 60 + val.hours * 3600;
      return val;
    }

    function getDateFromTW(str, isTimeOnly) {
      //13.02.11 17:51:31
      var timeParts, seconds;
      if (isTimeOnly) {
        timeParts = str.split(":");
        seconds = timeParts[2];
        var val = new Date();
        val.setHours(timeParts[0]);
        val.setMinutes(timeParts[1]);
        if (seconds.length > 2) {
          var temp = seconds.split(".");
          val.setSeconds(temp[0]);
          val.setMilliseconds(temp[1]);
        } else {
          val.setSeconds(seconds);
        }
        return val;
      } else {
        var parts = str.split(" ");
        var dateParts = parts[0].split(".");
        timeParts = parts[1].split(":");
        seconds = timeParts[2];
        var millis = 0;
        if (seconds.length > 2) {
          var temp = seconds.split(".");
          seconds = temp[0];
          millis = temp[1];
        } if (dateParts[2].length == 2) {
          dateParts[2] = (new Date().getFullYear() + '').substr(0, 2) + dateParts[2];
        }

        return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0], timeParts[0], timeParts[1], seconds, millis);
      }
    }

    function getDateFromTodayTomorrowTW(str) {
      var currentT = new Date();
      var dateParts = [];
      var parts = $.trim(str).split(" ");
      if (str.indexOf(trans.tw.all.tomorrow) != -1) {
        // morgen om 06:35:29 uur
        dateParts[0] = currentT.getDate() + 1;
        dateParts[1] = currentT.getMonth();
      } else if (str.indexOf(trans.tw.all.today) != -1) {
        // vandaag om 02:41:40 uur
        dateParts[0] = currentT.getDate();
        dateParts[1] = currentT.getMonth();
      } else {
        // op 19.05. om 11:31:51 uur
        dateParts = parts[1].split(".");
        dateParts[1] = parseInt(dateParts[1], 10) - 1;
      }

      // last part is "hour" but there is a script from lekensteyn that
      // corrects the projected arrival time each second
      // the script has not been updated to add the word "hour" after the time.
      var timeParts = parts[parts.length - 2].split(":");
      if (timeParts.length === 1) {
        timeParts = parts[parts.length - 1].split(":");
      }

      var seconds = timeParts[2];
      var millis = 0;
      if (seconds.length > 2) {
        var temp = seconds.split(".");
        seconds = temp[0];
        millis = temp[1];
      }

      return new Date(new Date().getFullYear(), dateParts[1], dateParts[0], timeParts[0], timeParts[1], seconds, millis);
    }

    function isDateInNightBonus(date) {
      if (!world_config.nightbonus.active) return false;
      return date.getHours() >= world_config.nightbonus.from && date.getHours() < world_config.nightbonus.till;
    }
    function getBuildingSpace() {
      var total = 0;
      for (var building = 0; building < world_data.buildingsSize.length; building++) {
        var b = world_data.buildingsSize[building];
        if (parseInt(game_data.village.buildings[b[0]], 10) > 0) {
          total += b[1][parseInt(game_data.village.buildings[b[0]], 10) - 1];
        }
      }
      return total;
    }

    function getBuildingPoints() {
      var total = 0;
      for (var building = 0; building < world_data.buildingsPoints.length; building++) {
        var b = world_data.buildingsPoints[building];
        if (parseInt(game_data.village.buildings[b[0]], 10) > 0) {
          total += b[1][parseInt(game_data.village.buildings[b[0]], 10) - 1];
        }
      }
      return total;
    }

    if (user_data.jumper.enabled) {
      (function() {
        //console.time("jumper");
        try {
          var cell = "<span style='display: none;' id=sanguJumperFrame>";
          cell += "<input type=text type=text size=6 id=sangujumper style='height: 16px; border: 0; top: -2px; position: relative'>";
          cell += "</span>";
          cell += "&nbsp;<a href=# id=sangujumperOpen><span class='icon ally internal_forum' title='" + trans.sp.jumper.goToMap + "'></span></a>";
          $("#menu_row2").append("<td>" + cell + "</td>");

          $("#sangujumper").keyup(function (e) {
            if (e.which == 13) {
              $("#sangujumperOpen").click();
            }
          });

          $("#sangujumperOpen").click(function () {
            var input = $("#sangujumper");
            if ($("#sanguJumperFrame").is(":visible")) {
              var village = getVillageFromCoords(input.val(), true);
              if (village.isValid) {
                trackClickEvent("JumperOpen_RealValue");
                // Jump to coordinates on the map
                location.href = getUrlString("&screen=map&x=" + village.x + "&y=" + village.y);

              } else {
                // incorrect coordinates
                if (!$("#sangujumperpos").is(":visible")) {
                  $("#sangujumperpos").show();
                  input.css("border", "1px solid red");
                } else
                  $("#sangujumperpos").hide();
              }
            } else {
              // activate mapJumper
              var input = $("#sangujumper");
              if (input.val() == "") {
                $("#sanguJumperFrame").fadeIn();
              } else {
                $("#sanguJumperFrame").show();
                $("#sangujumperOpen").click();
              }
            }

            return false;
          });

          if (user_data.jumper.autoShowInputbox) {
            $("#sangujumperOpen").click();
          }
        } catch (e) { handleException(e, "jumper"); }
        //console.timeEnd("jumper");
      }());
    }
    // Send usage statistics to GA once/day
    (function() {
      //console.time("ga");
      try {
        var loginMonitor = pers.get("sanguLogin");
        if (loginMonitor !== '') {
          var parts = loginMonitor.match(/(\d+)/g);
          loginMonitor = new Date(parts[0], parts[1]-1, parts[2]);

          //if (Math.abs(loginMonitor.getTime() - (new Date()).getTime()) > 1000 * 3600 * 24) {
          if (parseInt(parts[2], 10) != (new Date()).getDate()) {
            loginMonitor = '';
          }
        }
        if (loginMonitor === '') {
          loginMonitor = new Date();
          loginMonitor.setHours(0, 0, 0);
          loginMonitor = loginMonitor.getFullYear() + '-' + pad(loginMonitor.getMonth()+1, 2) + '-' +  pad(loginMonitor.getDate(), 2);
          trackEvent("ScriptUsage", "DailyUsage", loginMonitor);
          pers.set("sanguLogin", loginMonitor);

          // also log world/tribe usage
          trackEvent("ScriptUsage", "WorldUsage", game_data.world);
          trackEvent("ScriptUsage", "TribeUsage", game_data.world + " " + game_data.player.ally_id);
          trackEvent("ScriptUsage", "HasPremium", game_data.player.premium ? "Yes" : "No");		// Do we need to support non PA users?
          trackEvent("ScriptUsage", "HasAM", game_data.player.account_manager ? "Yes" : "No");	// Do we need to do stuff on the AM pages?
        }
      } catch (e) { handleException(e, "ga"); }
      //console.timeEnd("ga");
    }());

    q("-------------------------------------------------------------------- Start: "+sangu_version);

    // BEGIN PAGE PROCESSING
    switch (current_page.screen) {
      case "overview":
        // MAIN VILLAGE OVERVIEW
        (function() {
          /**
           * The slowest unit in the village in the form unit_spear
           */
          var slowest_unit = null;

          (function() {
            /**
             * Each key is in the form unit_sword and holds the total amount of the type in the village
             * (own and supporting troops combined)
             */
            var totalUnits = {},
              /**
               * Total population of all units (own + supporting)
               */
              totalFarm = 0,
              /**
               * Own population only (total - supporting)
               */
              ownFarmTotal = 0,
              /**
               * jQuery div with the troops in the village (becomes the own troops only div)
               */
              unitTable = $("#show_units"),
              /**
               * HTML table builder string for the supporting troops div
               */
              supportingTroopsTable = "<table class=vis width='100%'>";

            try {
              $("#show_units > h4").prepend(trans.sp.main.unitsReplacement);

              // calculate current stack
              $("table:first td", unitTable).not(":last").each(function () {
                var unit = $('img', this)[0].src,
                  unitsSize,
                  unitAmount;

                unit = unit.substr(unit.lastIndexOf('/') + 1);
                unit = unit.substr(0, unit.lastIndexOf('.'));
                unitsSize = world_data.unitsSize[unit];
                unitAmount = $('strong', this);
                unitAmount[0].id = "spAmount" + unit;
                unitAmount = unitAmount[0].innerHTML;
                totalUnits[unit] = unitAmount;
                totalFarm += unitsSize * unitAmount;

                if (slowest_unit == null || world_data.unitsSpeed[slowest_unit] < world_data.unitsSpeed[unit]) {
                  slowest_unit = unit;
                }
              });

              // fetch own troops
              if (user_data.overview.ajaxSeperateSupport && totalFarm > 0) {
                if (server_settings.ajaxAllowed) {
                  ajax("place",
                       function (placeText) {
                         if (placeText.find(".unitsInput").size() > 0) {
                           slowest_unit = null;
                           placeText.find(".unitsInput").each(function () {
                             // separate own / supporting troops
                             var unit = 'unit_' + this.id.substr(this.id.lastIndexOf("_") + 1);
                             var unitAmount = $(this).next().text().substr(1);
                             unitAmount = parseInt(unitAmount.substr(0, unitAmount.length - 1), 10);
                             var unitsSize = world_data.unitsSize[unit];
                             ownFarmTotal += unitsSize * unitAmount;

                             var unitLabel = $("#spAmount" + unit);
                             var supportingTroopsAmount = totalUnits[unit] - unitAmount;
                             if (supportingTroopsAmount > 0) {
                               var unitDesc = $.trim(unitLabel.parent().text());
                               unitDesc = unitDesc.substr(unitDesc.indexOf(" ") + 1);
                               supportingTroopsTable +=
                                 "<tr><td>" + unitLabel.prev().outerHTML()
                                 + " <b>" + formatNumber(supportingTroopsAmount)
                                 + "</b> "
                                 + unitDesc + "</td></tr>";
                             }

                             if (unitAmount > 0) {
                               unitLabel.text(unitAmount);
                               if (slowest_unit == null || world_data.unitsSpeed[slowest_unit] < world_data.unitsSpeed[unit]) {
                                 slowest_unit = unit;
                               }
                             } else {
                               unitLabel.parent().parent().hide();
                             }
                           });

                         } else {
                           ownFarmTotal = totalFarm; // No rally point
                         }
                       }, {async: false});

                } else {
                  ownFarmTotal = totalFarm; // No ajax
                }

                if (slowest_unit != null) {
                  $("#slowestUnitCell").html("<img title='"+trans.sp.tagger.slowestTip+"' src='graphic/unit/" + slowest_unit + ".png'>").attr("slowestUnit", slowest_unit);
                }

                if (ownFarmTotal > 0 && user_data.overview.ajaxSeperateSupportStacks) {
                  // stack in the village
                  unitTable.find("table:first").append("<tr><td><span class='icon header population' title='" + trans.sp.main.ownStackTitle + "'></span>" + stackDisplay(ownFarmTotal).desc + "</td></tr>");
                }
                if (totalFarm - ownFarmTotal > 0) {
                  // stack from other villages
                  supportingTroopsTable += "<tr><td><a href='" + getUrlString("screen=place&mode=units") + "'>&raquo; " + trans.sp.main.rallyPointTroops + "</a></td></tr>";
                  if (user_data.overview.ajaxSeperateSupportStacks) {
                    (function() {
                      var supportDisplay = stackDisplay(totalFarm - ownFarmTotal, { showFarmLimit: true });
                      supportingTroopsTable +=
                        '<tr><td style="border-top: 1px solid #85550d ;background-color: ' + supportDisplay.color + '">'
                        + '<span class="icon header population" title="' + trans.sp.main.supportingStackTitle
                        + '"></span>'
                        + '<b>' + supportDisplay.desc + '</b>' + '</td></tr>';
                    }());
                  }

                  unitTable.after(createMoveableWidget("os_units", trans.sp.main.unitsOther, supportingTroopsTable + "</table>"));
                }

                // total stack
                (function() {
                  var cell = $("#order_level_farm"),
                    isClassicOverview = cell.length !== 0,
                    percentage,
                    stackDetails,
                    cellContent;

                  if (isClassicOverview) {
                    cell = cell.parent();
                    if (game_data.player.premium) {
                      cell = cell.next();
                    }
                    percentage = world_config.farmLimit == 0 ? "" : cell.children().html();
                    stackDisplay(
                      totalFarm, {
                        showFarmLimit: true,
                        percentage: percentage ? percentage.substr(0, percentage.indexOf('%') + 1) : "",
                        cell: cell,
                        appendToCell: !game_data.player.premium
                      });

                  } else {
                    stackDetails = stackDisplay(
                      totalFarm, {
                        showFarmLimit: true,
                        percentage: $("#l_farm .building_extra").html()
                      });

                    //cellContent = '<tr><td style="border-top: 1px solid #85550d ;background-color: ' + stackDetails.color + '">' + '<b>' + trans.tw.all.farm + ': ' + stackDetails.desc + '</b>' + '</td></tr>';
                    cellContent = ' | <b>' + trans.tw.all.farm + ': ' + stackDetails.desc + '</b>';
                    $("#show_units tbody:first td:last").append(cellContent).css("border-top", "1px solid #85550d").css("background-color", stackDetails.color);
                  }
                }());
              }
            }
            catch (e) {
              handleException(e, "supportingunits");
            }
          }());
          // Incoming/outgoing attacks
          var mainTable = $("#overviewtable");
          var incomingTable = $("#show_incoming_units table.vis:first");
          var outgoingTable = $("#show_outgoing_units");
          if (incomingTable.size() == 1 || outgoingTable.size() == 1) {
            if (incomingTable.size() == 1) {
              // tagger - add header
              // inputBoxWidth : clicking the button focusses the newly created inputbox
              //                 solution is to no longer show inputboxes on screen load
              /*if (user_data.mainTagger2.inputBoxWidth != null) {
               $("a.rename-icon", incomingTable).click();
               $("span.quickedit", incomingTable).each(function() {
               var renameSpan = this;
               //setTimeout(function() {
               $("span.quickedit-edit input:first", renameSpan).width(user_data.mainTagger2.inputBoxWidth);
               //}, 1);
               });
               }*/

              if (user_data.mainTagger2.active && incomingTable.has("img[src*='attack']").size() != 0) {
                $("th:first", incomingTable).append("<input type=button value='" + trans.sp.tagger.openButton + "' id=openTaggerButton>");
                $("#openTaggerButton").click(function () {
                  $(this).hide();

                  incomingTable.click(function (e) {
                    if (e.target.nodeName === 'IMG') {
                      var direction = $(e.target).attr("direction");
                      if (direction.length > 0) {
                        var rowIndex = parseInt($(e.target).attr("rowIndex"), 10);
                        direction = direction == "up";
                        $("input.incAt", incomingTable).each( function () {
                          var rowIndexAttributeValue = parseInt($(this).attr("rowIndex"), 10);
                          if ((direction && rowIndexAttributeValue <= rowIndex) || (!direction && rowIndexAttributeValue >= rowIndex)) {
                            $(this).prop("checked", true);
                          } else {
                            $(this).prop("checked", false);
                          }
                        });
                      }
                    }
                  });

                  var rows = $("tr", incomingTable);
                  var dodgeMenu = "<tr><td>";
                  dodgeMenu += '<img src="graphic/command/support.png" alt="" id="checkSupport" title="' + trans.sp.tagger.checkAllSupport + '" />';
                  dodgeMenu += "&nbsp;";
                  dodgeMenu += '<img src="graphic/command/return.png" alt="" id="uncheckSupport" title="' + trans.sp.tagger.uncheckAllSupport + '" />';
                  dodgeMenu += "<th colspan=3>";
                  dodgeMenu += trans.sp.tagger.renameTo + "<input type=textbox size=30 id=commandInput value='" + user_data.mainTagger2.defaultDescription + "'></th>";
                  dodgeMenu += "<th>" + trans.sp.tagger.slowest + "</th>";
                  dodgeMenu += "</td>";
                  dodgeMenu += "<td colspan=1 id=slowestUnitCell>";
                  if (slowest_unit != null) {
                    dodgeMenu += "<img title='"+trans.sp.tagger.slowestTip+"' src='graphic/unit/" + slowest_unit + ".png' slowestunit='" + slowest_unit + "'>";
                  }
                  dodgeMenu += "</td></tr>";
                  incomingTable.find("tbody:first").prepend(dodgeMenu);

                  // checkbox manipulation
                  $("#uncheckSupport").click(function () {
                    $("input.incSupport", incomingTable).prop("checked", false);
                  });

                  $("#checkSupport").click(function () {
                    $("input.incSupport", incomingTable).prop("checked", true);
                  });

                  var buttonParent = $("#commandInput").parent();
                  var commandIdToCoordCache = []; // No Ajax call on multiple renames with {xy}
                  function renameCommand(commandName) {
                    var dodgeCell; // capture last cell for dodgeCell coloring

                    function getCommandIdFromDodgeCell(dodgeCell) {
                      return Number(dodgeCell.find("span.quickedit").first().attr("data-id"));
                    }

                    function getVillageCoordsFromCommandId(commandId, callback) {
                      if (server_settings.ajaxAllowed) {
                        if (commandIdToCoordCache[commandId]) {
                          callback(commandIdToCoordCache[commandId]);

                        } else {
                          ajax('screen=info_command&type=other&id='+commandId, function (overview) {
                            var originVillageLink = $(".village_anchor:first", overview).find("a[href]"),
                              originVillageDesc = originVillageLink.html(),
                              originVillage = getVillageFromCoords(originVillageDesc);

                            commandIdToCoordCache[commandId] = originVillage.coord;

                            callback(originVillage.coord);
                          });
                        }
                      }
                      callback('');
                    }

                    function executeRename(dodgeCell, commandName) {
                      function keepTwIcon(dodgeCell, commandName) {
                        var oldName = $(".quickedit-label", dodgeCell).text().toUpperCase(),
                          newName = commandName,
                          i,
                          unitName;

                        for (i = 0; i < user_data.mainTagger2.reservedWords.length; i++) {
                          unitName = user_data.mainTagger2.reservedWords[i];
                          if (oldName.indexOf(unitName.toUpperCase()) !== -1) {
                            newName = unitName + ' ' + newName;
                            return newName; // Only one icon possible
                          }
                        }
                        return newName;
                      }

                      var button = dodgeCell.find("input[type='button']"),
                        newName =  user_data.mainTagger2.keepReservedWords ? keepTwIcon(dodgeCell, commandName) : commandName;

                      button.prev().val(newName);
                      button.click();
                    }

                    $("input.taggerCheckbox", incomingTable).each(function () {
                      var openRenameButton;

                      if ($(this).is(":checked")) {
                        dodgeCell = $(this).parent().next();

                        openRenameButton = $("a.rename-icon", dodgeCell);
                        if (openRenameButton.is(":visible")) {
                          openRenameButton.click();
                        }

                        if (commandName.indexOf("{xy}") !== -1) {
                          getVillageCoordsFromCommandId(getCommandIdFromDodgeCell(dodgeCell), function(vilCoords) {
                            var nameWithCoords = commandName.replace("{xy}", vilCoords);
                            executeRename(dodgeCell, nameWithCoords);
                          });

                        } else {
                          executeRename(dodgeCell, commandName);
                        }
                      }
                    });

                    if (dodgeCell != null) {
                      var unitSpeed = $("#slowestUnitCell img").attr("slowestunit");
                      if (unitSpeed != undefined) {
                        dodgeCell = dodgeCell.parent().find("td").last().prev();
                        pers.setCookie("sanguDodge" + getQueryStringParam("village"), unitSpeed + "~" + dodgeCell.text(), user_data.mainTagger2.minutesDisplayDodgeTimeOnMap);

                        $(".dodgers", incomingTable).css("background-color", "").attr("title", "");
                        dodgeCell.css("background-color", user_data.colors.good).attr("title", trans.sp.tagger.activeDodgeTime);
                      }
                    }
                  }

                  // std tag button
                  var button = $("<input type=button title='" + trans.sp.tagger.renameTooltip + "' value='" + trans.sp.tagger.rename + "' onclick='select();'>");
                  button.click(function () {
                    trackClickEvent("MainTagger-CustomRename");
                    var tagName = $("#commandInput").val();
                    renameCommand(tagName);
                  });
                  buttonParent.append(button);

                  if (user_data.mainTagger2.otherDescs != null && user_data.mainTagger2.otherDescs != false) {
                    $.ctrl = function(key, callback, args) {
                      $(document).keydown(function(e) {
                        if(!args) args=[]; // IE barks when args is null 
                        if(e.keyCode == key.charCodeAt(0) && e.ctrlKey) {
                          e.preventDefault();
                          e.stopPropagation();
                          callback.apply(this, args);
                          return false;
                        }
                      });
                    };
                    // custom buttons
                    $.each(user_data.mainTagger2.otherDescs, function (index, val) {
                      if (val.active) {
                        var button = $("<input type=button title='" + trans.sp.tagger.renameButtonShortcutTooltip.replace("{hitkey}", val.hitKey)
                                         + "' data-rename-to='" + val.renameTo + "' value='" + val.name
                                         + "' class=\"mainTaggerButtons\">").click(
                          function () {
                            // Cannot use input:checked : this works for Firefox but there is a bug in Opera
                            trackClickEvent("MainTagger-ConfigRename");
                            renameCommand($(this).attr("data-rename-to"));
                          });

                        buttonParent.append(button);
                      }
                      $.ctrl(val.hitKey, function(s) {
                        trackClickEvent("MainTagger-ConfigRename");
                        renameCommand(val.renameTo);
                      });
                    });
                  }

                  // add checkboxes
                  var lastRowIndex = rows.size(),
                    lastSend = 0,
                    prevSendTime = 0,
                    firstNight = true,
                    amountOfAttacks = 0;

                  rows.each(function (rowIndex, rowValue) {
                    var row = $(rowValue);
                    if (rowIndex == 0) {
                      // headerrow
                      var header = "<td width=1% nowrap>";
                      header += "<img src='graphic/command/attack.png' title='" + trans.sp.tagger.checkAllAttacks + "' id=checkAll>&nbsp;<img src='graphic/command/cancel.png' title='" + trans.sp.tagger.uncheckAllAttacks + "' id=uncheckAll>";
                      header += "</td>";

                      row.replaceWith("<tr>" + header + "<th width='68%'>" + trans.sp.tagger.incomingTroops + "</th><th width='30%'>" + trans.sp.tagger.arrival + "</th><th width='10%'>" + trans.sp.tagger.arrival + "</th><th width=10% nowrap>" + trans.sp.tagger.dodgeTime + "</th><th width='1%'>&nbsp;</th>" + "</tr>");

                      $("#checkAll").click(function () {
                        $("input.incAt", incomingTable).prop("checked", true);
                      });

                      $("#uncheckAll").click( function () {
                        $("input.incAt", incomingTable).prop("checked", false);
                      });

                    } else {
                      // non header row types
                      if (row.find("th").size() != 0) {
                        // this part is only executed when attacks can be ignored
                        // select all checkbox row (right above link rows)
                        $("th:first", row).replaceWith("<th><input type=checkbox id=selectAllIgnore> " + $("th:first", row).text() + "</th>");
                        $("#selectAllIgnore").click(function () {
                          var ingoreBoxes = $("input[name^='id_']", incomingTable);
                          var isChecked = $("#selectAllIgnore").is(":checked");
                          ingoreBoxes.each(function() {
                            $(this).attr("checked", isChecked);
                          });
                        });

                        row.prepend("<td title='" + trans.sp.tagger.totalAttacksOnVillage + "' align=center><b># " + amountOfAttacks + "</b></td>").find("td:last").attr("colspan", 4);

                      } else if (row.find("td").size() == 1) {
                        // link-rows (bottom)
                        if ($("#switchModus").size() == 0) {
                          if ($("#selectAllIgnore").size() == 0) {
                            // attack hiding disabled in tw settings -> there is not yet a totalrow
                            row.prepend("<td title='" + trans.sp.tagger.totalAttacksOnVillage + "' align=center><b># " + amountOfAttacks + "</b></td>");
                          } else {
                            row.prepend("<td>&nbsp;</td>");
                          }

                          row.before("<tr><td>&nbsp;</td><td colspan=5><a href='' id=switchModus>" + trans.sp.tagger.switchModus + "</a></td></tr>");
                          $("#switchModus").click(function () {
                            trackClickEvent("MainTagger-OpenClose");
                            var editSpans = $("input.incAt", incomingTable).parent().parent().find("span.quickedit"),
                              isInDisplayMode = function (editSpan) {
                                return editSpan.find("span:first").is(":visible");
                              },
                              switchToOpen = isInDisplayMode(editSpans.first());

                            editSpans.each(function() {
                              var editSpan = $(this),
                                isDisplayMode = isInDisplayMode(editSpan);

                              if (switchToOpen && isDisplayMode) {
                                // make input form visible
                                $("a.rename-icon", editSpan).click();
                                //setTimeout(function() {
                                $("span.quickedit-edit input:first", editSpan).width(user_data.mainTagger2.inputBoxWidth);
                                //}, 1);

                              } else if (!switchToOpen && !isDisplayMode) {
                                // make label display visible
                                editSpan.find("span:first").show();
                                editSpan.find("span:last").remove();
                              }
                            });

                            return false;
                          });
                        } else {
                          row.prepend("<td>&nbsp;</td>");
                        }
                        row.find("td:last").attr("colspan", 5);
                      } else {
                        // normal incoming rows
                        var checkboxCell = "<td><input type=checkbox rowIndex=" + rowIndex + " class='taggerCheckbox ";
                        var incomingType = $("img[src*='graphic/command/support.png']", this).size() == 1 ? 'incSupport' : "incAt";
                        checkboxCell += incomingType + "'";
                        if (rowIndex == 1) {
                          checkboxCell += " id=checkFirst";
                        }

                        var currentArrivalTime = getDateFromTodayTomorrowTW($("td:eq(1)", this).text());
                        if (incomingType == 'incAt' && isDateInNightBonus(currentArrivalTime)) {
                          // nightbonus
                          row.find("td:eq(1)").css("background-color", user_data.colors.error);
                        }

                        // extra column with dodge time
                        if (incomingType == 'incAt') {
                          var dodgeTime = getTimeFromTW($("td:eq(2)", this).text());
                          row.find("td:last").before("<td class=dodgers>" + twDurationFormat(dodgeTime.totalSecs / 2 / 60) + "</td>");
                          amountOfAttacks++;
                        } else {
                          row.append("<td>&nbsp;</td>");
                        }

                        // dotted line after x hours no incomings
                        if (prevSendTime == 0 || (currentArrivalTime - prevSendTime) / 1000 / 60 > user_data.mainTagger2.minutesWithoutAttacksDottedLine) {
                          if (prevSendTime != 0) {
                            row.find("td").css("border-top", "1px dotted black");
                          }

                          prevSendTime = currentArrivalTime;
                        }

                        // black line after each nightbonus
                        if (lastSend == 0 || currentArrivalTime > lastSend) {
                          if (lastSend != 0) {
                            row.find("td").css("border-top", "1px solid black");
                            firstNight = false;
                          }

                          lastSend = new Date(currentArrivalTime);
                          if (lastSend.getHours() >= world_config.nightbonus.till) {
                            lastSend.setDate(lastSend.getDate() + 1);
                            lastSend.setHours(world_config.nightbonus.from);
                            lastSend.setMinutes(0);
                            lastSend.setSeconds(0);
                          } else if (lastSend.getHours() < world_config.nightbonus.from) {
                            lastSend.setHours(world_config.nightbonus.from);
                            lastSend.setMinutes(0);
                            lastSend.setSeconds(0);
                          } else {
                            lastSend.setHours(world_config.nightbonus.till);
                            lastSend.setMinutes(0);
                            lastSend.setSeconds(0);
                          }
                        }

                        // Automatically select?
                        if (incomingType == "incAt") {
                          if (firstNight) {
                            var isDefaultDesc = false;
                            if (!isDefaultDesc) {
                              checkboxCell += " checked=true";
                            }
                          }

                          $("span:eq(2)", row).find("input:first").click(function () {
                            $(this).select();
                          });

                          // extra buttons
                          $("td:eq(0)", row).append("<img src='graphic/oben.png' title='" + trans.sp.tagger.allAbove + "' rowIndex=" + rowIndex + " direction='up'> <img src='graphic/unten.png' title='" + trans.sp.tagger.allBelow + "' rowIndex=" + rowIndex + " direction='down'>");
                        }

                        row.prepend(checkboxCell + "></td>");

                        if (user_data.mainTagger2.colorSupport != null && incomingType != "incAt") {
                          row.find("td").css("background-color", user_data.mainTagger2.colorSupport);
                        }
                      }
                    }
                  });
                });
              }
            }

            // show tagger?
            if (user_data.mainTagger2.autoOpen) {
              $("#openTaggerButton").click();
            }

            // Show attack rename inputboxes 
            if (user_data.mainTagger2.autoOpenCommands) {
              $("#switchModus").click();
            }

            // BUG: This breaks the TW remembering of the div positions!!
            var newLayout = "<tbody><tr><td colspan=2><div class='outerBorder' id=myprettynewcell>";
            newLayout += "</div></td></tr></tbody>";
            mainTable.append(newLayout);

            var prettyCell = $("#myprettynewcell");
            prettyCell.append($("#show_incoming_units"));
            prettyCell.append($("#show_outgoing_units"));
          }
          if (user_data.overview.canHideDiv) {
            //console.time("main_overview_deletebuttons");

            /**
             * Array with domIds of the hideable divs
             * @type {Array}
             */
            var currentlyHidden = pers.get("mainvillage_hiddendivs");
            currentlyHidden = currentlyHidden ? JSON.parse(currentlyHidden) : [];

            // add the X images
            $("#leftcolumn,#rightcolumn").find("div.moveable").each(function() {
              var self = $(this),
                domId = this.id;

              if (!self.hasClass("hidden_widget")) {
                if (currentlyHidden.indexOf(domId) !== -1) {
                  self.hide();
                } else {
                  var header = self.find("h4:first");
                  header.prepend(
                      '<span class="sanguHide" '
                      + " title='" + trans.sp.main.hideDiv + "'"
                      + ' data-divid="' + domId + '"></span>');
                }
              }
            });

            // X image event
            $(".sanguHide", content_value).click(function() {
              var toHideId = $(this).attr("data-divid");
              currentlyHidden.push(toHideId);
              $("#" + toHideId).hide();
              q(currentlyHidden);

              pers.set("mainvillage_hiddendivs", JSON.stringify(currentlyHidden));
            });

            // css for X image
            var deleteImage = "data:image/png;base64,"
              + "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACx"
              + "jwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41"
              + "LjExR/NCNwAAAT5JREFUOE9jmBqv1R8uD0F9oTI9wZJdAaLI7A5fwTYv3g4fgU4/4VZ3Lgag6OYV"
              + "fUd3zj13aAkeBFQAVFZrx8DQGyIN5Nw6t+7p9W14EFABUFm9AwMD0GqgAUChDw/340FABUBljY5M"
              + "DN0BYsRrADkJ6Bs0DZe2NL68sfHN3R1XtrfCBSEaKm0YGIAeR9awoj22M1p5z+SIHX0hczI0t/fF"
              + "oGtodGJG1vD8+ubqYPXOEMnJMTI9EYqPz69E1oDFDw/PreyPUkw1YiiwYV9Z5fDq1lZkDVj8sKgh"
              + "NFiTIcdHPd5RIc2Se/eUZGQNWPwARH1VMU+vbb51akV7UQhcEKEBzQ+4EERDqRUDA9BZxGsotGBg"
              + "AMY28UkDpKHJmYX4xAfSAPQH0GXlNlAGEBVbMQAlkNn55gz5QNKCIdOUAQAxTOqhn6cegQAAAABJ"
              + "RU5ErkJggg==";

            var css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = ".sanguHide { margin-left: 2px; float: right; cursor: pointer; "
              + "background: url(" + deleteImage + "); width: 16px; height: 16px; }";
            document.body.appendChild(css);

            // show everything link
            content_value.append(
                "<br><a href='#' id='resetSanguMenu'>"
                + trans.sp.main.showHiddenDivs.replace("{amount}", currentlyHidden.length)
                + "</a>"
            );

            $("#resetSanguMenu").click(function() {
              pers.set("mainvillage_hiddendivs", "");
              location.reload();
            });



            //console.timeEnd("main_overview_deletebuttons");
          }
        }());
        break;

      case "map":
        (function() {
          //console.time("dodge_fromMainTagger");
          try {
            var isDodge = pers.getCookie("sanguDodge" + getQueryStringParam("village"));
            if (isDodge) {
              // Display dodge time and slowest unit in the village (cookied from the mainTagger)
              isDodge = isDodge.split("~");
              var header = $("h2:first", content_value);
              $("tbody:first", content_value)
                .prepend(
                  "<tr><td><table width=100% cellpadding=0 cellspacing=0><tr><td width=99% style='font-size: 18pt'><b>" + header.html()
                  + "</b></td><td nowrap width=250><div title='" + trans.sp.map.dodgeLastTagged + "' style='border: 1px solid black; padding: 2px; background-color: "
                  + (isDodge[0] == 'unit_snob' ? user_data.colors.special : user_data.colors.good) + "'><img src=graphic/unit/" + isDodge[0] + ".png> <b>" + isDodge[1]
                  + "</b></div></td></tr></table></td></tr>");
              header.remove();
            }
          } catch (e) { handleException(e, "dodge_fromMainTagger-"); }
          //console.timeEnd("dodge_fromMainTagger");
        }());
        break;

      case "report":
        if (current_page.mode === 'publish') {
          // Nice to haves when publishing a report
          (function() {
            try {
              if (location.href.indexOf('published=1') == -1 && user_data.other.reportPublish != null) {
                $.each(user_data.other.reportPublish, function (i, v) { $("#" + v).prop("checked", true); });
              } else {
                $("h3~p:nth-child(4)").each(function () {
                  var input = $("h3~p a")[0].href;
                  if (input.indexOf("?t=") != -1) {
                    input = input.substr(0, input.indexOf("?"));
                  }
                  $(this).append('<br><input type="text" size="75" onclick="this.select(); this.focus()" value="[url]' + input + '[/url]" />');
                  input = input.substr(input.lastIndexOf('/') + 1);
                  $(this).append('<br><input type="text" size="75" onclick="this.select(); this.focus()" value="[report_display]' + input + '[/report_display]" />');
                  $(this).append('<br><input type="text" size="75" onclick="this.select(); this.focus()" value="[report]' + input + '[/report]" />');
                });
              }
            } catch (e) { handleException(e, "report"); }
          }());
        }
        break;

      case "main":
        // Alternating row colors
        $("#buildings,#build_queue").find("tr:odd").addClass("row_b");
        (function() {
          //console.time("main-renamevillage");
          try {
            if (user_data.main.villageNames != null && user_data.main.villageNames.length > 0) {
              var showButtons = true;
              $.each(user_data.main.villageNames, function (i, v) { if (game_data.village.name == v) showButtons = false; });

              if (showButtons) {
                var submitButton = $("input[type='submit']:last");
                $.each(user_data.main.villageNames, function (i, v) {
                  // rename village to one of the provided villageNames options
                  var button = $("<input type=button class='btn' value='" + v + "'>")
                    .click(function () {
                             trackClickEvent("RenameVillage");
                             $("input[name='name']").val(v);
                             if (user_data.main.villageNameClick) {
                               $("input[type='submit']").click();
                             }
                           });
                  var input = submitButton.parent().append(button);
                });
              }
            }
          } catch (e) { handleException(e, "place-"); }
          //console.timeEnd("main-renamevillage");
        }());
        // show loyalty when building
        // destroy button is disabled now (but for how long?)
        if (server_settings.ajaxAllowed && user_data.main.ajaxLoyalty) {
          ajax("overview", function (overview) {
            var loyalty = $("#show_mood div.vis_item", overview);
            if (loyalty.size() == 1) {
              $(".modemenu tr:first").append("<td><b>" + trans.tw.main.loyaltyHeader + "</b> " + loyalty.html() + "</td>");
            }
          });
        }
        break;

      case "snob":
        if (current_page.mode === "train" || current_page.mode === null || current_page.mode === "produce") {
          if (user_data.other.calculateSnob && !world_config.coins) {
            // Calculate for how many nobles/snobs we've got packages
            (function() {
              try {
                //var table = $("table.vis:eq(1)", content_value);
                var table = $("table.vis[width='100%']", content_value).first();
                var cost = $("td:eq(1)", table).html();
                cost = parseInt(cost.substr(0, cost.indexOf(" ")), 10);
                var stored = $("tr:eq(1) td:eq(1)", table).html();
                stored = parseInt(stored.substr(0, stored.indexOf(" ")), 10);
                var canProduce = 0;
                while (stored > cost) {
                  stored -= cost;
                  cost++;
                  canProduce++;
                }

                var sumtable = $("table.main #content_value > table table.vis:last");
                assert(sumtable.length, "no snob sumtable");
                sumtable.append("<tr><th>" + trans.sp.snob.canProduce
                                  + "</th><td style='border: 1px solid black'><img src='/graphic/unit/unit_snob.png'><b>"
                                  + canProduce + "</b> " +
                                  "+ <img src='graphic/res.png'>"
                                  + stored + "</td></tr>");

              } catch (e) { handleException(e, "snob"); }
            }());
          }
        }
        break;

      case "info_command":
        if ($("#running_times").size() > 0) {
          // ---------------------------------------INCOMING ATTACK
          (function() {
            //console.time("info_command-incoming");
            try {
              var link = $("#contentContainer tr:eq(10) a:last");
              link.one('click', function () {
                var infoTable = $("#contentContainer");
                var table = $("#running_times");

                // convert runningtime to seconds
                // TODO: there is a function for this: getTimeFromTW
                function convertTime(cell) {
                  var time = $(cell).find("td:eq(1)").text();
                  time = time.match(/(\d+):(\d+):(\d+)/);

                  var obj = {};
                  obj.hours = parseInt(time[1], 10);
                  obj.minutes = parseInt(time[2], 10);
                  obj.seconds = parseInt(time[3], 10);
                  obj.totalSeconds = obj.hours * 3600 + obj.minutes * 60 + obj.seconds;

                  return obj;
                }

                // Sort on runningtime
                var unitRows = $("tr:gt(1)", table);
                unitRows.sortElements(function (a, b) {
                  return convertTime(a).totalSeconds > convertTime(b).totalSeconds ? 1 : -1;
                });

                // header sent times
                $("th:first", table).attr("colspan", 5);
                $("th:eq(2)", table).after("<th>" + trans.sp.tagger.sentOn + "</th><th>" + trans.sp.tagger.ago + "</th>");

                var infoCell = $("td", infoTable);
                var attacker = infoCell.eq(5).text();
                var attackerVillageName = infoCell.eq(7).text();
                var attackerVillage = getVillageFromCoords(attackerVillageName);
                var defender = infoCell.eq(10).text();
                var defenderVillage = getVillageFromCoords(infoCell.eq(12).text());
                var arrivalTime = getDateFromTW(infoCell.eq(14).text());
                var fields = parseInt(getDistance(attackerVillage.x, defenderVillage.x, attackerVillage.y, defenderVillage.y).fields, 10);

                var isNightbonus = isDateInNightBonus(arrivalTime);
                if (isNightbonus) {
                  infoCell.eq(14).css("background-color", user_data.colors.error);
                }

                var remainingRunningTime = convertTime($("tr:eq(9)", infoTable)),
                  plausibleSpeedFound = false;

                unitRows.each(function () {
                  var unit = $("img:first", this).attr("src");
                  unit = unit.substr(unit.lastIndexOf("unit_") + 5);
                  unit = unit.substr(0, unit.indexOf("."));

                  if (unit == "spear") {
                    $(this).hide();
                  } else {
                    var runningTime = convertTime(this),
                      newDate = new Date(arrivalTime.getTime() - runningTime.totalSeconds * 1000),
                      sendAt = prettyDate((new Date()).getTime() - newDate.getTime()),
                      troopsRow = this,
                      str;

                    // Extra column with time sent
                    $("td:eq(2)", troopsRow).before("<td>" + twDateFormat(newDate, true) + "</td><td>" + sendAt + "</td>");

                    // Rename default command name for each speed
                    if (user_data.incoming.renameInputTexbox) {
                      str = user_data.incoming.renameInputTexbox;

                      var attackId = $("span.quickedit", this).attr("data-id");
                      str = str.replace("{village}", attackerVillageName).replace("{c}", attackerVillage.continent()).replace("{id}", attackId);
                      str = str.replace("{player}", attacker).replace("{xy}", attackerVillage.coord).replace("{unit}", trans.tw.units.twShortNames[unit]);
                      str = str.replace("{fields}", fields);
                      if (str.indexOf("{night}") != -1) {
                        if (isNightbonus) {
                          str = str.replace("{night}", trans.sp.tagger.arrivesInNightBonus);
                        } else {
                          str = str.replace("{night}", "");
                        }
                      }

                      if (false) {
                        // don't show rename inputs, just the labels
                        $("span.quickedit-label", troopsRow).text(str).show();
                      } else {
                        // show the rename inputboxes on form load
                        $("span.quickedit-label", troopsRow).text(str);
                        setTimeout(function() {
                          $("a.rename-icon", troopsRow).click();
                          $("#focusPlaceHolder").focus();
                        }, 1);
                      }

                      if (runningTime.totalSeconds > remainingRunningTime.totalSeconds && !plausibleSpeedFound) {
                        plausibleSpeedFound = true;

                        $("table:first", content_value).prepend(
                            "<input type=submit class='btn' id=focusPlaceHolder value='"
                            + trans.sp.tagger.tagIt
                            + " (" + trans.tw.units.twShortNames[unit] + ")'"
                            + " data-command-name='" + str + "'"
                            + ">");

                        $("#focusPlaceHolder").click(function () {
                          trackClickEvent("TagDefault");
                          $("#command_comment").text($(this).attr("data-command-name"));
                          $("#command_comment+a").click();
                          setTimeout(function() {
                            $("#quickedit-rename input:last").click();
                          }, 1);
                          $(this).val(trans.sp.tagger.tagged).attr("disabled", "disabled");
                        });

                        if (unit == "snob") {
                          $("tr:last td", table).css("background-color", user_data.colors.error);
                        }
                      }
                    }

                    // Possible send times (now) in bold
                    if (runningTime.totalSeconds > remainingRunningTime.totalSeconds) {
                      $(this).css("font-weight", "bold");
                    }
                  }
                });

                // nobles can only walk so far
                var nobles = $("tr:last", table);
                if (convertTime(nobles).totalSeconds / 60 > world_config.maxNobleWalkingTime) {
                  nobles.find("td").css("text-decoration", "line-through");
                }

                if (user_data.incoming.invertSort) {
                  unitRows.sortElements(function (a, b) {
                    return convertTime(a).totalSeconds < convertTime(b).totalSeconds ? 1 : -1;
                  });
                }
              });

              // AUTO OPEN TAGGER
              if (user_data.incoming.forceOpenTagger || (user_data.incoming.autoOpenTagger && $("#labelText").text() == trans.tw.incoming.defaultCommandName)) {
                link.click();
              }

              if (user_data.proStyle && user_data.incoming.villageBoxSize != null && user_data.incoming.villageBoxSize != false) {
                $("table:first", content_value).css("width", user_data.incoming.villageBoxSize);
              }

            } catch (e) { handleException(e, "info_command-incoming"); }
            //console.timeEnd("info_command-incoming");
          }());

        } else {
          (function() {
            //console.time("info_command-command");
            try {
              // Own attack/support/return ---------------------------------------------------------------------------------- Own attack/support/return
              var infoTable = $("table.vis:first", content_value);
              var type = $("h2:first", content_value).text();
              var catapultTargetActive = infoTable.find("tr:eq(5) td:eq(0)").text() == trans.tw.command.catapultTarget;

              infoTable.width(600);

              // Add troop returntime and annulation return time
              var isSupport = type.indexOf(trans.tw.command.support) == 0;
              var offset = 5;
              if (catapultTargetActive) {
                offset += 1;
              }
              var arrivalCell = infoTable.find("tr:eq(" + (offset + 1) + ") td:last");

              if (type.indexOf(trans.tw.command.returnText) == -1
                && type.indexOf(trans.tw.command.abortedOperation) == -1) {

                var duration = getTimeFromTW(infoTable.find("tr:eq(" + offset + ") td:last").text());
                var imgType = !isSupport ? "attack" : "support";
                arrivalCell.prepend("<img src='graphic/command/" + imgType + ".png' title='" + trans.sp.command.arrival + "'>&nbsp; " + trans.tw.all.dateOn + " ").css("font-weight", "bold");
                var stillToRun = getTimeFromTW(infoTable.find("tr:eq(" + (offset + 2) + ") td:last").text());

                var cancelCell = infoTable.find("tr:last").prev();
                var canStillCancel = cancelCell.has("a").length;
                if (canStillCancel) {
                  cancelCell.find("td:first").attr("colspan", "1").attr("nowrap", "nowrap");
                  var returnTime = getDateFromTW($("#serverTime").text(), true);
                  returnTime = new Date(returnTime.valueOf() + (duration.totalSecs - stillToRun.totalSecs) * 1000);
                  cancelCell.append("<td>" + trans.sp.command.returnOn + "</td><td id=returnTimer>" + twDateFormat(returnTime, true, true).substr(3) + "</td>");

                  setInterval(function timeCounter() {
                    var timer = $("#returnTimer");
                    var newTime = new Date(getDateFromTW(timer.text()).valueOf() + 2000);
                    timer.text(twDateFormat(newTime, true, true).substr(3));
                  }, 1000);

                  cancelCell = cancelCell.prev();
                }

                if (type.indexOf(trans.tw.command.attack) == 0) {
                  var returnTimeCell = cancelCell.find("td:last");
                  returnTimeCell.html("<img src='graphic/command/return.png' title='" + cancelCell.find("td:first").text() + "'>&nbsp; <b>" + returnTimeCell.text() + "</b>");
                }
              } else {
                var imgType = type.indexOf(trans.tw.command.abortedOperation) == 0 ? imgType = "cancel" : "return";
                arrivalCell.prepend("<img src='graphic/command/" + imgType + ".png' title='" + trans.sp.command.arrival + "'>&nbsp; " + trans.tw.all.dateOn + " ").css("font-weight", "bold");
              }

              var player = infoTable.find("td:eq(7) a").text();
              var village = getVillageFromCoords(infoTable.find("td:eq(9) a").text());
              var second = infoTable.find("td:eq(" + (13 + (catapultTargetActive ? 2 : 0)) + ")").text();
              var haulDescription = "";

              if (type.indexOf(trans.tw.command.returnText) == 0) {
                infoTable = $("> table.vis:last", content_value);
                if (infoTable.find("td:first").text() == trans.tw.command.haul) {
                  haulDescription = infoTable.find("td:last").text().match(/\s(\d+)\/(\d+)$/);
                  if (haulDescription) {
                    haulDescription = formatNumber(haulDescription[1]) + " / " + formatNumber(haulDescription[2]);
                  } else {
                    assert(infoTable.find("td:last").text() + " didn't match regexp for tw.command.haul");
                  }
                  infoTable = infoTable.prev();
                }
                infoTable = infoTable.find("tr:last");
              } else {
                infoTable = $("> table.vis:last", content_value);
              }

              var unitsSent = {};
              $.each(world_data.units, function (i, val) {
                unitsSent[val] = parseInt($("td:eq(" + i + ")", infoTable).text(), 10);
              });
              var unitsCalc = calcTroops(unitsSent);
              unitsCalc.colorIfNotRightAttackType($("h2:first", content_value), !isSupport);

              if (user_data.attackAutoRename.active) {
                $.each($('.quickedit'), function(){
                  var renamed = buildAttackString(village.coord, unitsSent, player, isSupport, 0, haulDescription),
                    commandID = $(this).attr('data-id'),
                    $this = $(this);

                  if (server_settings.ajaxAllowed) {
                    $.ajax({
                             url: game_data.link_base_pure+'info_command&ajaxaction=edit_other_comment&id='+commandID+'&h='+game_data.csrf+'&',
                             method: 'post',
                             data: { text: renamed },
                             success:function() {
                               $this.find(".quickedit-label:first").text(renamed);
                             }
                           });
                  }
                });
              }

              /*if (server_settings.ajaxAllowed) {
               ajax("overview", function(overviewtext) {
               var idnumberlist = [];
               var index = 0;
               var links = $(overviewtext).find("#show_outgoing_units").find("table").find("td:first-child").find("a:first-child").find("span");
               //^enkel 'find codes, dus alles wegselecteren wat onnodig is.

               links.each(function(){
               var idgetal = $(this).attr('id').match(/\d+/);
               idnumberlist[index]=idgetal[0];
               index++;
               $.trim(idnumberlist[index]);
               });

               idthisattack= location.href.match(/id=(\d+)/);// deze aanval ophalen
               var idthisattacktrim = $.trim(idthisattack[1]); //eerste callback: Datgeen tussen haakjes dus. En gelijk maar trimmen, voor het geval dat.
               var counter=$.inArray(idthisattacktrim, idnumberlist);
               var arraylength = idnumberlist.length;
               var arraylengthminusone = arraylength -1;
               if (counter != arraylengthminusone) {
               var nextcommandID = idnumberlist[(counter +1)];}
               if (counter != 0) {
               var lastcommandID = idnumberlist[(counter - 1)];
               }
               villageid = location.href.match(/village=(\d+)/);
               //alert(villageid[1]);
               if (counter != 0) {
               content_value.find("h2").after('<table><tr><td id="lastattack" style="width:83%"><a href="/game.php?village=' + villageid + '&id=' + lastcommandID + '&type=own&screen=info_command">'+ trans.sp.command.precedingAttack + '</a></td> </tr> </table>');
               }
               else {
               content_value.find("h2").after('<table><tr><td id="lastattack" style="width:83%"><b> XX</b></td> </tr> </table>');
               }
               if (counter != arraylengthminusone){
               $("#lastattack").after('<td id="nextcommand" ><a href="/game.php?village=' + villageid + '&id=' + nextcommandID + '&type=own&screen=info_command">'+ trans.sp.command.nextAttack+ '</a></td>');
               }
               else {
               $("#lastattack").after('<td id="nextcommand"><b>XX</b></td>');
               }

               //alert("Hoi");
               }, {});
               }*/

              // When sending os, calculate how much population in total is sent
              if (isSupport) {
                var totalPop = 0;
                $.each(world_data.units, function (i, val) {
                  var amount = unitsSent[val];
                  if (amount != 0) {
                    totalPop += amount * world_data.unitsPositionSize[i];
                  }
                });

                var unitTable = $("table.vis:last", content_value);
                unitTable.find("tr:first").append('<th width="50"><span class="icon header population" title="' + trans.sp.all.population + '"></span></th>');
                unitTable.find("tr:last").append('<td>' + formatNumber(totalPop) + '</td>');
              }
            } catch (e) { handleException(e, "info_command-command"); }
            //console.timeEnd("info_command-command");
          }());
        }
        break;

      case "market":
        (function() {
          try {
            if (location.href.indexOf('try=confirm_send') > -1) {
              if (user_data.proStyle && user_data.market.autoFocus) {
                $("input[type='submit']").focus();
              }
            }
            else if (location.href.indexOf('&mode=') == -1 || location.href.indexOf('&mode=send') > -1) {
              if (location.href.indexOf('try=confirm_send') == -1) {
                // Spice up market:
                // 120 x 106 pixels: There are market images that are smaller
                // Making all images equally large results in the OK button remaining on the same place
                if (user_data.proStyle && user_data.market.resizeImage) {
                  $("img[src*='big_buildings/market']").width(120).height(106);
                }

                // New last village:
                $("input[type='submit']").click(function () {
                  var village = getVillageFromCoords($("#inputx").val() + "|" + $("#inputy").val());
                  if (village.isValid) {
                    pers.set("lastVil", village.coord);
                  }
                });

                // Add last & target
                var vilHome = getVillageFromCoords(game_data.village.coord);

                var targetLocation = $("#inputx").parent().parent().parent();
                var cookie = pers.get("lastVil");
                var coord = getVillageFromCoords(cookie);
                var htmlStr = '';
                if (coord.isValid) {
                  var dist = getDistance(coord.x, vilHome.x, coord.y, vilHome.y, 'merchant');
                  htmlStr = printCoord(coord, "&raquo; " + trans.sp.all.last + ": " + coord.x + "|" + coord.y);
                  htmlStr += "&nbsp; <span id=lastVilTime>" + dist.html + "</span>";
                }

                // Add target village
                var target = getVillageFromCoords(spTargetVillageCookie());
                if (target.isValid) {
                  var dist = getDistance(target.x, vilHome.x, target.y, vilHome.y, 'merchant');
                  if (htmlStr.length > 0) {
                    htmlStr += "<br>";
                  }
                  htmlStr += printCoord(target, "&raquo; " + trans.sp.all.target + ": " + target.x + "|" + target.y) + " &nbsp;<span id=targetVilTime>" + dist.html + "</span>";
                }

                if (htmlStr.length > 0) {
                  targetLocation.append("<tr><td colspan=2>" + htmlStr + "</td></tr>");
                }

                // Calculate total resources sent
                var table = $("table.vis:last");
                if (table.prev().text() == trans.tw.market.incomingTransports) {
                  var sent = { stone: 0, wood: 0, iron: 0 };
                  table.find("tr:gt(0)").each(function () {
                    var cell = $(this).find("td:eq(1)");
                    var resources = $.trim(cell.text().replace(/\./g, "").replace(/\s+/g, " ")).split(" ");

                    for (var i = 0; i < resources.length; i++) {
                      if (resources[i]) {
                        var restype = cell.find("span.icon:eq(" + i + ")");
                        for (var resIndex = 0; resIndex < world_data.resources_en.length; resIndex++) {
                          if (restype.hasClass(world_data.resources_en[resIndex])) {
                            sent[world_data.resources_en[resIndex]] += parseInt(resources[i], 10);
                          }
                        }
                      }
                    }
                  });

                  table.append("<tr><th>" + trans.sp.all.total + ":</th><td colspan=3><img src=graphic/holz.png> " + formatNumber(sent.wood) + "&nbsp; <img src=graphic/lehm.png> " + formatNumber(sent.stone) + "&nbsp; <img src=graphic/eisen.png> " + formatNumber(sent.iron) + "</td></tr>");
                }
              }
            }
          } catch (e) { handleException(e, "market"); }
        }());
        break;

      case "settings":
        // Add sangu to the menu
        (function() {
          var settingsMenu = $("table.vis:first", content_value);
          settingsMenu.append(
              "<tr><td>&nbsp;</td></tr><tr><th><a href='"
              + getUrlString("screen=settings&mode=sangu")
              + "'>Sangu Package</a></th></tr>");

          settingsMenu.append(
              "<tr id='sanguImportRow'><td>"
              + "<a href='#' id='sanguImport'>" + trans.sp.sp.settings.importSettings + "</a>"
              + "</td></tr>"
              + "<tr id='sanguExportRow'><td>"
              + "<a href='#' id='sanguExport'>" + trans.sp.sp.settings.exportSettings + "</a>"
              + "</td></tr>");

          settingsMenu.after(
              "<br>"
              + "<a target='_blank' href='http://"+server_settings.sangu+"'>"
              + "<div style='width: 100%; text-align: center; border: 1px solid black; background-color: yellow; padding: 10px 0 10px;'>"
              + "Sangu Website"
              + "</div>"
              + "</a>");

          /**
           * Creates the textarea (and other UI elements) for displaying the user_data
           * @param activate {string} either Import or Export
           * @param deactivate {string} either Export or Import
           * @param textAreaValue {string} the content to assign to the textarea
           */
          function importExportHandler(activate, deactivate, textAreaValue) {
            var settingsContainer = $("#sanguSettingsTextArea");
            $("#sangu"+activate+"Row").addClass("row_b");
            $("#sangu"+deactivate+"Row").hide();

            $("#sanguSettingsForm").hide();
            if (settingsContainer.length === 0) {
              //sanguConfigTitle is the h3 defined in inject.js
              $("#sanguConfigTitle").parent().append(
                  trans.sp.sp.settings.importSettingsDesc + "<br><br>"
                  + "<textarea id='sanguSettingsTextArea' style='width: 100%; height: 500px'>"
                  + textAreaValue
                  + "</textarea>");
            } else {
              if (textAreaValue.length > 0) {
                settingsContainer.val(textAreaValue);
              }
            }
          }

          $("#sanguExport").click(function() {
            importExportHandler("Export", "Import", JSON.stringify(user_data, null, 4));
            $("#sanguSettingsTextArea").select();
            return false;
          });

          $("#sanguImport").click(function() {
            var importSanguSettings = $("#importSanguSettings");
            importExportHandler("Import", "Export", "");

            if (importSanguSettings.length === 0) {
              $("#sanguSettingsTextArea")
                .after("<br><input type='button' id='importSanguSettings' value='" + trans.sp.sp.settings.importSettings + "'>");

              $("#importSanguSettings").click(function() {
                var overwriteCurrentSettings = true,
                  newUserData;

                try {
                  newUserData = JSON.parse($("#sanguSettingsTextArea").val());

                  if (typeof newUserData.proStyle === 'undefined') {
                    overwriteCurrentSettings = confirm(trans.sp.sp.settings.importError + trans.sp.sp.settings.importErrorContinueAnyway);
                  }

                  if (overwriteCurrentSettings) {
                    user_data = $.extend({}, user_data, newUserData);
                    pers.set("sangusettings", JSON.stringify(user_data));
                    alert(trans.sp.sp.settings.importSettingsSuccess);
                  }

                } catch (ex) {
                  alert(trans.sp.sp.settings.importError + "\n" + ex.message);
                }
              });
            }
            $("#sanguSettingsTextArea").focus();

            return false;
          });
        })();

        switch (current_page.mode) {
          case "vacation":
            var maxSitDays = server_settings.maxSitDays;
            var daysTable = $("table.vis:eq(1)", content_value);
            var days = $("td:last", daysTable).text();
            days = maxSitDays - parseInt(days.substr(0, days.indexOf(" ")), 10);
            if (days > 0) {
              var tillTime = new Date();
              tillTime.setDate(tillTime.getDate() + days);
              daysTable.append("<tr><td>" + trans.sp.rest.sittingAttackTill + "</td><td>" + (tillTime.getDate() + "." + pad(tillTime.getMonth() + 1, 2) + "." + tillTime.getFullYear()) + "</td></tr>");
            } else {
              daysTable.find("td:last").css("background-color", user_data.colors.error);
            }
            break;

          case "quickbar_edit":
            if (user_data.scriptbar.editBoxCols != null && user_data.scriptbar.editBoxCols != false) {
              // TODO: textareaIfy: This might be useful on other places aswell. Move to func/UI?
              function textareaIfy(element) {
                var textarea =
                  $('<textarea>')
                    .attr('cols', Math.round(user_data.scriptbar.editBoxCols / 9))
                    .attr('rows', user_data.scriptbar.editBoxRows)
                    .val($(element).val());

                textarea.change(function () {
                  element.val($(this).val());
                });

                element.before(textarea);
                $(element).hide();
              }

              var url = $("form :input[type='text']").css("width", user_data.scriptbar.editBoxCols).last();
              textareaIfy(url);
            }
            break;
        }

        // SANGU SETTING EDITOR
        if (location.href.indexOf('mode=sangu') > -1) {


          // settings.editor: : delimited: "array:string" or "required:boolean" etc

          function createArraySettingType(inputHandler, index, editor) {
            var propertyValueType = editor.split("|")[0];

            function deleter() {
              inputHandler.getValue().splice(index, 1);
            }

            switch (propertyValueType) {
              case "number":
                return new FormInputHandler(inputHandler.formConfig, {
                  getter: function() {
                    return inputHandler.getValue()[index];
                  },
                  setter: function(value) {
                    value = parseInt(value, 10);
                    if (!isNaN(value)) {
                      inputHandler.getValue()[index] = value;
                    } else {
                      inputHandler.getValue()[index] = 0;
                    }
                  },
                  deleter: deleter,
                  editor: editor
                });

              case "text":
              case "color":
                return new FormInputHandler(inputHandler.formConfig, {
                  getter: function() {
                    return inputHandler.getValue()[index];
                  },
                  setter: function(value) {
                    inputHandler.getValue()[index] = value;
                  },
                  deleter: deleter,
                  editor: editor
                });

              case "float":
                return new FormInputHandler(inputHandler.formConfig, {
                  getter: function() {
                    return inputHandler.getValue()[index];
                  },
                  setter: function(value) {
                    value = parseFloat(value.replace(",", "."));
                    if (!isNaN(value)) {
                      inputHandler.getValue()[index] = value;
                    } else {
                      inputHandler.getValue()[index] = 0;
                    }
                  },
                  deleter: deleter,
                  editor: editor
                });
            }

            alert(propertyValueType + " not supported");
          }

          /**
           * Factory for creating different representations of a property
           * @type {string}
           */
          function createSettingType(inputHandler, editors, editorIndex, arrayOptions) {
            var value = inputHandler.getValue(),
              decorators,
              inputType,
              propName;

            //array|addNew:number|delete|step=1000
            //color=color+number=stack

            //q("with -> " + editors + ". isArray: " + isArrayType);
            //q(arrayOptions);

            if (!arrayOptions.isArrayType) {
              decorators = editors.split("|");
              inputType = decorators[0];
              if (inputType.indexOf("=") > -1) {
                propName = inputType.split("=")[1];
                inputType = inputType.split("=")[0];
              }

              //q("isArray: " + propName + "=> " + inputType);
              //q(decorators);

              switch (inputType) {
                case "bool":
                  return {
                    build: function(id) {
                      //assert(typeof value === 'boolean', (typeof value) + ": not a boolean");
                      return "<input type='checkbox' id='"+id+"' "+(value ? " checked" : "")+" />";
                    },
                    bind: function(id) {
                      $("#" + id).click(function() {
                        inputHandler.setValue($(this).is(":checked"));
                      });
                    }
                  };
                case "unit":
                  return {
                    build: function(id) {
                      var i,
                        html = "<select id='"+id+"'>";

                      for (i = 0; i < world_data.units.length; i++) {
                        html += "<option "+(value == world_data.units[i] ? " selected" : "")+">"+world_data.units[i]+"</option>";
                      }
                      html += "</select>";

                      return html;
                    },
                    bind: function(id) {
                      $("#" + id).click(function() {
                        inputHandler.setValue($(this).val());
                      });
                    }
                  };
                case "text":
                case "color":
                case "number":
                case "float":
                  return (function() {
                    var htmlString = "",
                      index,
                      inputBoxSize = 13,
                      extraInputAttributes = "",
                      extraHtml = "",
                      inputTypeAttribute = inputType === "float" ? "number" : inputType;

                    switch (inputType) {
                      case "text":
                        if (typeof value === 'string') {
                          value = value.toString().replace(/'/g, "&#39;");
                        }
                        inputBoxSize = 50;
                        break;
                    }
                    if (decorators.length > 1) {
                      (function() {
                        var keyValuePair;
                        for (index = 0; index < decorators.length; index++) {
                          keyValuePair = decorators[index].split("=");
                          switch (keyValuePair[0]) {
                            case "delete":
                              extraHtml += " &nbsp;<a href='#' id='{domId}_delete'><img src='graphic/delete.png' title='"+trans.sp.sp.settings.deleteTooltip+"' /></a>";
                              break;
                            case "step":
                              assert(inputType === "float" || inputType === "number", "step only works with numeric inputs");
                              assert(keyValuePair.length === 2, "expected input: step=value");
                              extraInputAttributes += " step='"+keyValuePair[1]+"'";
                              break;
                            case "width":
                              inputBoxSize = keyValuePair[1];
                              break;
                          }
                        }
                      })();
                    }

                    htmlString +=
                      "<input type='" + inputTypeAttribute + "' id='{domId}' size='" + inputBoxSize +"' "
                      + (typeof value !== 'undefined' ? " value='"+value+"'" : "")
                      + extraInputAttributes +" />"
                      + extraHtml;

                    return {
                      build: function(id) {
                        return htmlString.replace(/\{domId\}/g, id);
                      },
                      bind: function(id) {
                        $("#" + id).change(function() {
                          var newValue = $("#" + id).val();
                          inputHandler.setValue(newValue, editorIndex);
                          return false;
                        });

                        $("#" + id + "_delete").click(function() {
                          inputHandler.deleteValue();
                          location.reload(false);
                        });
                      }
                    };
                  })();
              }

            } else {
              return (function() {
                var typesArray = [],
                  arrayIndex,
                  canAddNew = false,
                  inlineDiv = false;

                decorators = arrayOptions.decorators;

                //q(editors);
                //q(decorators);
                //q("----");

                if (decorators.length > 0) {
                  for (arrayIndex = 0; arrayIndex < decorators.length; arrayIndex++) {
                    switch (decorators[arrayIndex]) {
                      case "addNew":
                        canAddNew = true;
                        break;
                      case "inline":
                        inlineDiv = true;
                        break;
                    }
                  }
                }

                for (arrayIndex = 0; arrayIndex < value.length; arrayIndex++) {
                  (function() {
                    var fixedArrayIndex = arrayIndex;
                    //q("createArraySettingType for" + fixedArrayIndex + "=" +editors);
                    typesArray.push(createArraySettingType(inputHandler, fixedArrayIndex, editors));
                  })();
                }

                return {
                  build: function(id) {
                    var htmlString = "",
                      arrayIndex,
                      domId;

                    assert(typeof value === 'object', (typeof value) +  ": not an object (array)");

                    for (arrayIndex = 0; arrayIndex < typesArray.length; arrayIndex++) {
                      domId = id + "_" + arrayIndex;

                      htmlString += "<div" + (inlineDiv ? " style='display: inline'> &nbsp;" : ">");
                      htmlString += typesArray[arrayIndex].build(domId);
                      htmlString += "</div>";
                    }

                    if (canAddNew) {
                      htmlString += "<a href='#' id='"+id+"_new'>" + trans.sp.sp.settings.addRecord + "</a>";
                    }

                    return htmlString;
                  },
                  bind: function(id) {
                    var domId,
                      arrayIndex;

                    if (canAddNew) {
                      $("#" + id + "_new").click(function() {
                        var domId = id + "_" + typesArray.length,
                          newType;

                        newType = createArraySettingType(inputHandler, typesArray.length, editors);
                        $(this).before("<div>" + newType.build(domId) + "</div>");
                        newType.bind(domId);
                        typesArray.push(newType);

                        $("#"+domId).focus();
                        return false;
                      });
                    }

                    if (typesArray.length === 0 && canAddNew) {
                      $("#" + id + "_new").click();
                    } else {
                      for (arrayIndex = 0; arrayIndex < typesArray.length; arrayIndex++) {
                        domId = id + "_" + arrayIndex;
                        typesArray[arrayIndex].bind(domId);
                      }
                    }
                  }
                };
              })();
            }

            assert(false, editors + " is not a valid editor");
            return;
          }

          /**
           *	@constructor
           */
          function FormInputHandler(propertyFormConfig, propSettings, editorIndex) {
            var arraySplit = propSettings.editor.split(":"),
              editors,
              arrayOptions = {isArrayType: arraySplit[0].indexOf('array') === 0},
              strategy;

            assert(typeof propSettings.getter === 'function', 'getter should be a function');
            assert(typeof propSettings.setter === 'function', 'setter should be a function');

            if (arrayOptions.isArrayType) {
              editors = arraySplit[1].split("+");
            } else {
              editors = arraySplit[0].split("+");
            }

            //q(editors);

            this.formConfig = propertyFormConfig;
            if (typeof propertyFormConfig.save === 'undefined') {
              this.setValue = propSettings.setter;
              this.deleteValue = propSettings.deleter;
            } else {
              this.setValue = function(value, editorIndex) {
                propSettings.setter(value, editorIndex);
                propertyFormConfig.save();
              };

              this.deleteValue = function() {
                propSettings.deleter();
                propertyFormConfig.save();
              };
            }

            this.getValue = propSettings.getter;
            if (true) {
              //q("createSettingType for " + editors[0] + " index " + editorIndex);
              if (arrayOptions.isArrayType) {
                arrayOptions.decorators = arraySplit[0].split("|");
                arrayOptions.decorators.splice(0, 1);
              }

              strategy = createSettingType(this, editors[0], editorIndex, arrayOptions);
              this.build = strategy.build;
              this.bind = strategy.bind;
            } else {
              (function(inputHandler) {
                var handlers = [],
                  index;

                for (index = 0; index < editors.length; index++) {
                  handlers.push(new FormInputHandler(propertyFormConfig, propSettings, index));
                }

                inputHandler.build = function(id) {
                  var i, htmlString = "";
                  for (i = 0; i < handlers.length; i++) {
                    htmlString += handlers[i].build(id + '_col' + i);
                    htmlString += " &nbsp;";
                  }
                  return htmlString;
                };

                inputHandler.bind = function(id) {
                  var i;
                  for (i = 0; i < handlers.length; i++) {
                    handlers[i].bind(id + '_col' + i);
                  }
                };
              })(this);
            }
          }

          function buildConfigForm(contentPage, propertyFormConfig) {
            var config = propertyFormConfig.properties,
              prop,
              properties = [],
              propIndex,
              form = "",
              formRow,
              container;

            // show only relevant properties
            // has side-effects
            for (prop in config) {
              if (config.hasOwnProperty(prop)) {
                if (typeof config[prop].show === "undefined" || config[prop].show) {
                  config[prop].ownName = prop;
                  if (typeof config[prop].type === 'undefined') {
                    // this is a variable <-> input form mapping
                    config[prop].type = "propertyEditor";
                    config[prop].propUI = new FormInputHandler(propertyFormConfig, config[prop].propUI);

                  } else {
                    // these are other visual indications
                    // ui is handled with if / else below
                  }

                  properties.push(config[prop]);
                }
              }
            }

            // build form
            form = "<table class='vis' width='100%'>";
            form += "<tr><th colspan='2'>" + propertyFormConfig.title + "</th>";
            form += "</table>";
            form = $(form);

            container = $("<div class='propertyEditFormContainer' id='"+propertyFormConfig.id+"' style='display: none' />");
            container.append(form).append("<br>");

            contentPage.append(container);

            for (propIndex = 0; propIndex < properties.length; propIndex++) {
              var propUI = properties[propIndex];
              if (propUI.type === 'propertyEditor') {
                formRow = "<tr>";

                // label
                formRow += "<td width='25%'>";
                if (typeof propUI.tooltip !== "undefined") {
                  formRow += "<img src='graphic/questionmark.png' title='"+propUI.tooltip+"' /> &nbsp; ";
                }
                formRow += propUI.label;
                formRow += "</td>";

                //editor
                if(propUI.label == sangu_trans.mainTagger.otherButtons.hitKey) {
                  formRow += "<td width='75%'>ctrl + ";
                } else {
                  formRow += "<td width='75%'>";
                }
                formRow += propUI.propUI.build(propertyFormConfig.id+"_"+propUI.ownName);
                formRow += "</td>";

                formRow += "</tr>";

                form.append(formRow);

                // bind the form to the js variable
                if (typeof propUI.propUI.bind === 'function') {
                  propUI.propUI.bind(propertyFormConfig.id+"_"+propUI.ownName);
                }
              } else {
                switch (propUI.type) {
                  case "subtitle":
                    form.append("<tr class='row_b'><td colspan='2'><b>"+propUI.label+"</b></td></tr>");
                    break;
                }
              }
            }
          }
          /**
           * Contains all translations for the property setting editors
           */
          var sangu_trans = (function() {
            var sangu_trans = {};
            sangu_trans.nl = {
              main: {
                title: "Hoofdgebouw",
                villageNames: "Standaard dorpsnamen:",
                villageNamesTooltip: "Voeg je veelgebruikte dorpsnamen toe om een dorp met 1 klik te hernoemen.",
                villageNameClick: "Autoclick?",
                villageNameClickTooltip: "Schakel deze feature uit indien je bijvoorbeeld nog een nummer aan een standaard dorpsnaam wil toevoegen.",
                ajaxLoyalty: "Toestemming tonen?"
              },
              global: {
                title: "Op alle pagina's",
                tw_version: "Compatibiliteit met TW versie {version} afdwingen",
                tw_versionTooltip: "Dit gaat enkel de grijze Sangu bol niet meer tonen. Bugs door de TW update gaan niet op een magische manier opgelost zijn!",
                resources: {
                  title: "Met kleuren aanduiden hoe vol de opslagplaats is",
                  activate: trans.sp.sp.settings.activate,
                  blinkWhenStorageFull: "Grondstoffen knipperen wanneer de opslagplaats vol is",
                  colors: "Kleurenschakering"
                },
                incomingsTitle: "Binnenkomende aanvallen/ondersteuning links",
                incomingsEditLinks: "Linkdoelwit wijzigen",
                incomingsEditLinksTooltip: "De binnenkomende aanval/ondersteuning link wijzigen zodat de eerste 1000 bevelen getoond worden.",
                incomingsTrack: "Tijdchecker activeren",
                incomingsIndicator: "Tijdchecker tekst",
                incomingsIndicatorTooltip: "Gebruik {current} voor het huidig aantal binnenkomende aanvallen. "
                  + "{difference} voor het aantal nieuwe aanvallen. "
                  + "{saved} voor het laatst opgeslaan aantal aanvallen.",
                incomingsIndicatorTooltip2: "Tijdchecker tooltip",
                incomingsLastTimeCheckWarning: "Tijdchecker tooltip",
                incomingsLastTimeCheckWarningTooltip: "Gebruik {elapsed} voor de verstreken tijd. Gebruik {time} voor de laatste tijdcheck.",
                otherSettingsTitle: "Overige configuratie",
                visualizeFriends: "Aangeven welke vrienden momenteel online zijn",
                duplicateLogoffLink: "Voeg links onderaan een extra 'Afmelden' link toe.",
                colorsTitle: "Sangu achtergrondkleuren",
                colorsError: "Waarschuwingen",
                colorsNeutral: "Neutrale indicaties",
                colorsGood: "Positieve indicaties",
                colorsSpecial: "Speciale indicaties",
                jumperTitle: "Kaartspringer",
                jumperAutoOpen: "Het inputveld om coördinaten in te geven direct openen"
              },
              incoming: {
                title: "De standaard TW binnenkomende aanvallen tagger",
                autoOpenTagger: "De tagger direct openen indien het bevel nog niet hernoemd is",
                forceOpenTagger: "De tagger altijd openen",
                renameInputTexbox: "De standaard hernoemde bevelnaam",
                renameInputTexboxTooltip: "Legende: {unit}: korte eenheidnaam; {xy} coördinaten; {player}; {village}; {c} Continent; {fields} Afstand in velden; {night} Indicatie wanneer in nachtbonus. Maak leeg om te deactiveren.",
                invertSort: "De snelheid mogelijkheden sorteren",
                invertSortTooltip: "Vink dit aan om de traagste eenheid bovenaan te plaatsen"
              },
              overviews: {
                addFancyImagesToOverviewLinks: "Icons toevoegen aan de overzichtslinks",
                command: {
                  title: "Overzichtsscherm: Troepenoverzicht",
                  titleOwnTroopsPage: "Pagina's 'Eigen' en 'In het dorp'",
                  middleMouseClickDeletesRow: "Actie bij <img src='graphic/command/attack.png'>"
                    + " aanklikken met de middelste muisknop: Aangevinkt=rij verwijderen. Uitgevinkt: rode rand rond de \"Opdracht\" cell.",
                  middleMouseClickDeletesRowTooltip: "Dit werkt enkel in Opera. Vink dit NIET AAN in Firefox of Chrome!! (De rode rand werkt ook niet in Firefox)",
                  titleDefensePage: "Pagina's 'Verdediging' en 'Ondersteuning'",
                  changeTroopsOverviewLink: "Link wijzigen om direct 'Eigen troepen' te openen",
                  filterMinPopulation: "De standaard ingevulde waarde om te filteren op populatie",
                  filterOnUnitTypeSeperator: "Eigen/In het dorp: Filteren op aantal eenheden",
                  filterMinDefaultType: "De eenheid om te filteren die standaard geselecteerd is",
                  filterMinDefault: "Het aantal eenheden om te filteren dat standaard ingevuld is",
                  filterMinDefaultTooltip: "Dit aantal wordt ingevuld wanneer de pagina opent. Bij het selecteren van een andere eenheid worden de waarden hieronder gebruikt.",
                  filterMinOther: "De standaard waarde voor de overige eenheden",
                  filterAutoSort: "De dorpenlijst automatisch sorteren na het ingeven van een doeldorp"
                },
                troopsRestack: {
                  title: "Alle pagina's: Stack BBCodes generatie",
                  to: "Stack een dorp tot hoeveel populatie",
                  requiredDifference: "Vereist verschil in huidige populatie in het dorp en de waarde hierboven",
                  fieldsDistanceFilterDefault: "Het standaard ingevuld aantal velden waarop gefilterd wordt",
                  filterReverse: "Aangevinkt: Rijen die voldoen aan de zoekopdracht tonen. Anders de rijen verbergen.",
                  filterReverseTooltip: "Dit kan op de pagina zelf nog aangepast worden",
                  defaultPopulationFilterAmount: "Het standaard ingevuld aantal voor de populatie filter",
                  removeRowsWithoutSupport: "Bij het berekenen van de totalen dorpen zonder ondersteuning direct verbergen",
                  autohideWithoutSupportAfterFilter: "Automatisch dorpen zonder overige ondersteuning wegfilteren na het toepassen van een filter",
                  autohideWithoutSupportAfterFilterTooltip: "Bij de aanvalsfilter worden de dorpen die niet onder aanval zijn sowieso verborgen.",
                  calculateDefTotalsAfterFilter: "Automatisch de totale ondersteuning per dorp berekenen na het toepassen van een filter",
                  calculateDefTotalsAfterFilterTooltip: "Voor sommige filters moeten de totalen sowieso toch eerst berekend worden."
                },
                commands: {
                  title: "Overzichtsscherm: Bevelen",
                  sumRow: "Een scheidingsrij tussen verschillende dorpen toevoegen",
                  filterFakeMaxPop: "Een bevel met minder dan deze populatie is een fake aanval (en wordt verborgen)",
                  requiredTroopAmount: "Bij de export naar BBCodes worden bevelen met minder dan deze populatie overgeslagen."
                },
                resources: {
                  title: "Overzichtsscherm: Productie",
                  requiredResDefault: "Het aantal grondstoffen dat standaard in het invoerveld ingevuld is",
                  requiredMerchants: "Het aantal handelaren dat standaard ingevuld is",
                  filterMerchants: "Ook filteren op aantal beschikbare handelaren",
                  filterRows: "Aanvinken om rijen te verbergen. Wanneer uitgevinkt wordt achtergrondkleur van de grondstoffen gewijzigd",
                  bbcodeMinimumDiff: "Het minimum verschil in grondstoffen tussen het aantal in het dorp en het aantal waarop gefilterd wordt voordat het dorp in de BBcode export opgenomen wordt",
                  highlightColor: "De achtergrondkleur die gebruikt wordt om de grondstoffen aan te duiden die voldoen aan de filtercriteria"
                },
                buildings: {
                  title: "Overzichtsscherm: Gebouwen",
                  minMaxTitle: "Geef de laagst en hoogst aanvaardbare levels voor je gebouwen",
                  minLevel: "Min {building}",
                  maxLevel: "Max {building}"
                },
                incomings: {
                  title: "Overzichtsscherm: Aankomend",
                  attackIdTitle: "Groeperen op aanvalsid",
                  minValueTooltip: "De te tonen tekst wanneer het verschil in aanvalsid tussen de vorige binnenkomende aanval meer is dan het aangegeven verschil",
                  seperatorTitle: "Bij verschil &lt; {minValue}",
                  minValue: "Minimum verschil",
                  text: "Tekst",
                  attackIdHigherDescription: "Te tonen tekst bij groter verschil in aanvalsid"
                }
              },
              place: {
                title: "Plaats: Speciale troepen invul links",
                titleCustom: "Plaats: Extra troepen invul links",
                linkText: "Link tekst",
                link: "Link: {name}",

                scoutTitle: "Verkenner links",
                scoutVillage: "Een dorp krijgt verkenner links als er meer verkenners zijn dan dit",
                scoutPlaceLinks: "Links om zoveel verkenners in te vullen",

                fakePlaceLinkTitle: "Fake troepen link",
                fakePlaceExcludeTroops: "Type troepen te negeren bij selecteren",
                fakePlaceExcludeTroopsTooltip: "Gebruik de namen: spear, sword, axe, archer, sword, spy, light, marcher, heavy, ram, catapult",

                noblePlaceLinkTitle: "Edel links",
                noblePlaceLinkFirstTitle: "Edel link met het meeste troepen",
                noblePlaceLinkFirstNameTooltip: "Er blijven genoeg troepen thuis om voor de resterende edels nog ondersteuning te kunnen sturen. Maak leeg om deze link niet te tonen.",

                noblePlaceLinkSupportTitle: "Edel link met minimale ondersteuning",
                noblePlaceLinksForceShow: "Ook tonen wanneer er slechts 1 edel in het dorp is",
                nobleSupportOffTitle: "Edel ondersteuning voor offensief dorp",
                nobleSupportDefTitle: "Edel ondersteuning voor defensief dorp",
                nobleSupportUnit: "Eenheid",
                nobleSupportAmount: "Aantal eenheden",

                noblePlaceLinkDivideTitle: "Edel link met gelijk verdeelde ondersteuning",
                noblePlaceLinkDivideAddRam: "Rammen mee selecteren",

                customPlaceLinksTitle: "Andere links",
                customPlaceOneTimeTooltip: "Vul een getal in om zoveel te sturen. Vul een negatief getal om zoveel te laten staan.",
                customPlaceSendAlong: "Meesturen tot",
                customPlaceSendAlongTooltip: "Indien er na selectie van bovenstaande troepen minder dan zoveel troepen in het dorp zou overblijven, selecteer dan alle troepen"
              },
              profile: {
                title: "Verfraaien van het profiel van spelers en stammen",
                moveClaim: "Verplaats dorpsclaim zodat alle andere links op dezelfde plaats blijven staan",
                mapLink: {
                  title: "Kaarteigenschappen van link naar TWMaps kaart generator",
                  fill: "Achtergrondkleur",
                  zoom: 'Inzoom niveau',
                  grid: 'Continentlijnen',
                  gridContinentNumbers: "Continent nummers",
                  playerColor: 'Spelerskleur',
                  tribeColor: 'Zijn stam kleur',
                  centreX: "Centreren op X coördinaat",
                  centreY: "Centreren op Y coördinaat",
                  ownColor: 'Eigen kleur',
                  markedOnly: "Alleen gemarkeerde",
                  yourTribeColor: "Eigen stam kleur",
                  bigMarkers: "Grotere aanduidingen"
                },
                popup: {
                  title: "Overnames popup",
                  width: "Breedte van de popup",
                  height: "Hoogte van de popup",
                  left: "Horizontale positie",
                  top: "Verticale positie"
                }
              },
              mainTagger: {
                title: "Tagger op dorpsoverzicht",
                autoOpen: "De tagger automatisch openen bij binnenkomende aanvallen",
                inputBoxWidth: "De breedte van de bevel hernoemings inputvelden",
                defaultDescription: "De naam die standaard in het hernoemings inputveld geplaatst wordt",
                defaultDescriptionTooltip: "Gebruik {xy} voor de coordinaten van het herkomst dorp",
                autoOpenCommands: "De bevel hernoemings inputvelden direct tonen",
                minutesDisplayDodgeTimeOnMap: "Aantal minuten dat de laatste dodgetijd op de kaart getoond wordt",
                minutesDisplayDodgeTimeOnMapTooltip: "De laatste dodgetijd is de tijd van het laatste bevel, aangeduidt met gewijzigde achtergrondkleur na het herbenoemen van binnenkomende aanvallen.",
                minutesWithoutAttacksDottedLine: "Elke zoveel minuten zonder een tussenliggende binnenkomende aanval aanduiden met een stippelijn (180 = 3 uur)",
                colorSupport: "Binnenkomende ondersteuning een andere achtergrondkleur geven",
                keepReservedWords: "Tekst die vervangen wordt door een eenheid icon behouden bij hernoemen binnenkomende aanval",
                keepReservedWordsTooltip: "Bijvoorbeeld \"Verk.\" wordt vervangen door een verkenners icon",
                otherButtons: {
                  title: "Andere hernoemings knoppen",
                  renameTo: "Hernoemen naar",
                  button: "Tekst knop",
                  hitKey: "Sneltoets"
                }
              },
              confirm: {
                title: "Bevel comfirmatie pagina",
                addExtraOkButton: "Links bovenaan de pagina een extra OK knop toevoegen",
                replaceNightBonus: "Nachtbonus melding verwerken in de pagina titel",
                replaceTribeClaim: "Dorpsclaim melding verwerken in de pagina titel",
                addCatapultImages: "Gebouws iconen tonen om snel het katapult doelwit te wijzigen"
              },
              villageInfo: {
                title: "Extra links naar het troepenoverzicht",
                title2: "Twee extra links naar het troepenoverzicht op elke dorpsinformatie pagina toevoegen",
                icon: "Kies een icoon",
                off_title: "Extra link voor aanvallen",
                def_title: "Extra link voor verdedigen",
                linkName: "De link die toegevoegd wordt",
                group: "Binnen welk groep id openen (kies 0 voor alle groepen)",
                groupTitle: "Zodra je meer dan 1000 dorpen bezit worden enkel die eerste 1000 getoond & gefilterd. Door een groep id in te geven (vb je groep \"aanvalsdorpen\" of \"verdedigingsdorpen\") wordt de troepenlijst binnen deze groep geopend.",
                activateFilter: "Filter activeren",
                filter: {
                  title: "Direct filteren",
                  unit: "Eenheid",
                  amount: "Minimale hoeveelheid"
                },
                sort: "Dorpenlijst direct sorteren",
                changeSpeed: "Traagste eenheid snelheid wijzigen"
              },
              other: {
                title: "Overige configuratie",
                proStyle: "Pro Style?",
                proStyleTooltip: "Met deze setting worden een heleboel kleinere features aan of uitgeschakeld",
                timeDisplayTitle: "Hoe looptijden weergeven",
                displayDays: "Dagen tonen wanneer de troepen langer dan 24 uur lopen?",
                displayDaysTooltip: "Voorbeeld: toon \"1.18:01:36\" wanneer aangevinkt, zoniet wordt die looptijd als \"42:01:36\" weergegeven",
                walkingTimeDisplay: "Te tonen tekst",
                walkingTimeDisplayTooltip: "Gebruik {duration} voor het aantal uren en {arrival} voor de aankomstdatum",
                calculateSnob: "Berekenen hoeveel edels direct kunnen geproduceerd worden",
                showPlayerProfileOnVillage: "Het uitgebreide spelersprofiel tonen op een dorpsinformatie pagina",
                farmLimitTitle: "Dorpstacks achtergrondkleuren",
                farmLimitStackColors: "Kleurenschakering",
                farmLimitAcceptableOverstack: "Acceptabele overstack voor elke kleurschakering",
                farmLimitAcceptableOverstackTooltip: "Boerderijlimiet: {farmlimit}",
                farmLimitUnlimitedStack: "Aantal populatie voor elke kleurschakering",
                ajaxSeperateSupport: "Dorpsoverzicht: Visualiseer het verschil tussen eigen en ondersteunende troepen in het dorpsoverzicht",
                canHideDiv: "Dorpsoverzicht: Een extra X icon toevoegen om een info kader volledig te verwijderen",
                commandRenamer: "Bevelen automatisch hernoemen",
                commandRenamerActive: "De verzonden troepen in de bevelnaam weergeven",
                commandRenamerAddHaul: "De buit aan de bevelnaam toevoegen"
              }
            };

            //sangu_trans.de = {};

            /*sangu_trans.en = {
             main: {
             title: "Main building",
             villageNames: "Village names:",
             villageNamesTooltip: "Add village names to the village headquarters to quickly edit the village name to a preset name.",
             villageNameClick: "Autoclick?",
             villageNameClickTooltip: "true: one of the previous button clicked automatically changes the village name. false: only fills in the name in the textbox but does not click the button",
             ajaxLoyalty: "Show loyalty?",
             ajaxLoyaltyTooltip: "Get the loyalty at the building construction/destruction page"
             }
             };*/

            return sangu_trans[game_data.market];
          }());
          /**
           * Configuration array containing the metadata for generating the different
           * property editor UIs
           */
          var user_data_configs = (function() {
            /**
             * Debug bool
             */
            var showConfigs = true,
              user_data_configs = [],
              sangu_saver = function() {
                pers.set('sangusettings', JSON.stringify(user_data));
                trackEvent("ScriptUsage", "SettingEdit", "1");
              };

            if (showConfigs) {
              user_data_configs.push({
                                       id: "global",
                                       title: sangu_trans.global.title,
                                       save: sangu_saver,
                                       properties: {
                                         twVersion: {
                                           label: sangu_trans.global.tw_version.replace("{version}", game_data.majorVersion),
                                           tooltip: sangu_trans.global.tw_versionTooltip,
                                           propUI: {
                                             getter: function() { return pers.get("forceCompatibility") !== '' && pers.get("forceCompatibility") === 'true'; },
                                             setter: function(value) { pers.set("forceCompatibility", value); },
                                             editor: "bool"
                                           }
                                         },
                                         resourcesTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.global.resources.title
                                         },
                                         resourcesActivate: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.global.resources.active; },
                                             setter: function(value) { user_data.global.resources.active = value; },
                                             editor: "bool"
                                           }
                                         },
                                         resourceColors: {
                                           label: sangu_trans.global.resources.colors,
                                           propUI: {
                                             getter: function() { return user_data.global.resources.backgroundColors; },
                                             setter: function(value) { user_data.global.resources.backgroundColors = value; },
                                             editor: "array|inline:color"
                                           }
                                         },
                                         resourcesBlinkWhenFull: {
                                           label: sangu_trans.global.resources.blinkWhenStorageFull,
                                           propUI: {
                                             getter: function() { return user_data.global.resources.blinkWhenStorageFull; },
                                             setter: function(value) { user_data.global.resources.blinkWhenStorageFull = value; },
                                             editor: "bool"
                                           }
                                         },
                                         incomingsTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.global.incomingsTitle
                                         },
                                         incomingsEditLinks: {
                                           label: sangu_trans.global.incomingsEditLinks,
                                           tooltip: sangu_trans.global.incomingsEditLinksTooltip,
                                           propUI: {
                                             getter: function() { return user_data.global.incomings.editLinks; },
                                             setter: function(value) { user_data.global.incomings.editLinks = value; },
                                             editor: "bool"
                                           }
                                         },
                                         incomingsTrack: {
                                           label: sangu_trans.global.incomingsTrack,
                                           propUI: {
                                             getter: function() { return user_data.global.incomings.track; },
                                             setter: function(value) { user_data.global.incomings.track = value; },
                                             editor: "bool"
                                           }
                                         },
                                         incomingsIndicator: {
                                           label: sangu_trans.global.incomingsIndicator,
                                           tooltip: sangu_trans.global.incomingsIndicatorTooltip,
                                           propUI: {
                                             getter: function() { return user_data.global.incomings.indicator; },
                                             setter: function(value) { user_data.global.incomings.indicator = value; },
                                             editor: "text"
                                           }
                                         },
                                         incomingsIndicatorTooltip2: {
                                           label: sangu_trans.global.incomingsIndicatorTooltip2,
                                           propUI: {
                                             getter: function() { return user_data.global.incomings.indicatorTooltip; },
                                             setter: function(value) { user_data.global.incomings.indicatorTooltip = value; },
                                             editor: "text"
                                           }
                                         },
                                         lastTimeCheckWarning: {
                                           label: sangu_trans.global.incomingsLastTimeCheckWarning,
                                           tooltip: sangu_trans.global.incomingsLastTimeCheckWarningTooltip,
                                           propUI: {
                                             getter: function() { return user_data.global.incomings.lastTimeCheckWarning; },
                                             setter: function(value) { user_data.global.incomings.lastTimeCheckWarning = value; },
                                             editor: "text"
                                           }
                                         },
                                         jumperTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.global.jumperTitle
                                         },
                                         jumperActivate: {
                                           label: trans.sp.sp.settings.activate,
                                           propUI: {
                                             getter: function() { return user_data.jumper.enabled; },
                                             setter: function(value) { user_data.jumper.enabled = value; },
                                             editor: "bool"
                                           }
                                         },
                                         jumperAutoOpen: {
                                           label: sangu_trans.global.jumperAutoOpen,
                                           propUI: {
                                             getter: function() { return user_data.jumper.autoShowInputbox; },
                                             setter: function(value) { user_data.jumper.autoShowInputbox = value; },
                                             editor: "bool"
                                           }
                                         },
                                         colorsTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.global.colorsTitle
                                         },
                                         colorsError: {
                                           label: sangu_trans.global.colorsError,
                                           propUI: {
                                             getter: function() { return user_data.colors.error; },
                                             setter: function(value) { user_data.colors.error = value; },
                                             editor: "color"
                                           }
                                         },
                                         colorsGood: {
                                           label: sangu_trans.global.colorsGood,
                                           propUI: {
                                             getter: function() { return user_data.colors.good; },
                                             setter: function(value) { user_data.colors.good = value; },
                                             editor: "color"
                                           }
                                         },
                                         colorsNeutral: {
                                           label: sangu_trans.global.colorsNeutral,
                                           propUI: {
                                             getter: function() { return user_data.colors.neutral; },
                                             setter: function(value) { user_data.colors.neutral = value; },
                                             editor: "color"
                                           }
                                         },
                                         colorsSpecial: {
                                           label: sangu_trans.global.colorsSpecial,
                                           propUI: {
                                             getter: function() { return user_data.colors.special; },
                                             setter: function(value) { user_data.colors.special = value; },
                                             editor: "color"
                                           }
                                         },
                                         otherSettingsTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.global.otherSettingsTitle
                                         },
                                         visualizeFriends: {
                                           label: sangu_trans.global.visualizeFriends,
                                           propUI: {
                                             getter: function() { return user_data.global.visualizeFriends; },
                                             setter: function(value) { user_data.global.visualizeFriends = value; },
                                             editor: "bool"
                                           }
                                         },
                                         duplicateLogoffLink: {
                                           label: sangu_trans.global.duplicateLogoffLink,
                                           propUI: {
                                             getter: function() { return user_data.global.duplicateLogoffLink; },
                                             setter: function(value) { user_data.global.duplicateLogoffLink = value; },
                                             editor: "bool"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "main",
                                       title: sangu_trans.main.title,
                                       save: sangu_saver,
                                       properties: {
                                         villageNames: {
                                           tooltip: sangu_trans.main.villageNamesTooltip,
                                           label: sangu_trans.main.villageNames,
                                           propUI: {
                                             getter: function() { return user_data.main.villageNames; },
                                             setter: function(value) { user_data.main.villageNames = value; },
                                             editor: "array|addNew:text|delete"
                                           }
                                         },
                                         villageNameClick: {
                                           tooltip: sangu_trans.main.villageNameClickTooltip,
                                           label: sangu_trans.main.villageNameClick,
                                           propUI: {
                                             getter: function() { return user_data.main.villageNameClick; },
                                             setter: function(value) { user_data.main.villageNameClick = value; },
                                             editor: "bool"
                                           }
                                         },
                                         ajaxLoyalty: {
                                           label: sangu_trans.main.ajaxLoyalty,
                                           show: server_settings.ajaxAllowed,
                                           propUI: {
                                             getter: function() { return user_data.main.ajaxLoyalty; },
                                             setter: function(value) { user_data.main.ajaxLoyalty = value; },
                                             editor: "bool"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "incoming",
                                       title: sangu_trans.incoming.title,
                                       save: sangu_saver,
                                       properties: {
                                         autoOpenTagger: {
                                           label: sangu_trans.incoming.autoOpenTagger,
                                           propUI: {
                                             getter: function() { return user_data.incoming.autoOpenTagger; },
                                             setter: function(value) { user_data.incoming.autoOpenTagger = value; },
                                             editor: "bool"
                                           }
                                         },
                                         forceOpenTagger: {
                                           label: sangu_trans.incoming.forceOpenTagger,
                                           propUI: {
                                             getter: function() { return user_data.incoming.forceOpenTagger; },
                                             setter: function(value) { user_data.incoming.forceOpenTagger = value; },
                                             editor: "bool"
                                           }
                                         },
                                         renameInputTexbox: {
                                           label: sangu_trans.incoming.renameInputTexbox,
                                           tooltip: sangu_trans.incoming.renameInputTexboxTooltip,
                                           propUI: {
                                             getter: function() { return user_data.incoming.renameInputTexbox; },
                                             setter: function(value) { user_data.incoming.renameInputTexbox = value; },
                                             editor: "text"
                                           }
                                         },
                                         invertSort: {
                                           label: sangu_trans.incoming.invertSort,
                                           tooltip: sangu_trans.incoming.invertSortTooltip,
                                           propUI: {
                                             getter: function() { return user_data.incoming.invertSort; },
                                             setter: function(value) { user_data.incoming.invertSort = value; },
                                             editor: "bool"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              (function() {
                var properties = {
                  activate: {
                    label: sangu_trans.global.resources.activate,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.active; },
                      setter: function(value) { user_data.mainTagger2.active = value; },
                      editor: "bool"
                    }
                  },
                  autoOpen: {
                    label: sangu_trans.mainTagger.autoOpen,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.autoOpen; },
                      setter: function(value) { user_data.mainTagger2.autoOpen = value; },
                      editor: "bool"
                    }
                  },
                  inputBoxWidth: {
                    label: sangu_trans.mainTagger.inputBoxWidth,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.inputBoxWidth; },
                      setter: function(value) { user_data.mainTagger2.inputBoxWidth = value; },
                      editor: "number|step=5"
                    }
                  },
                  autoOpenCommands: {
                    label: sangu_trans.mainTagger.autoOpenCommands,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.autoOpenCommands; },
                      setter: function(value) { user_data.mainTagger2.autoOpenCommands = value; },
                      editor: "bool"
                    }
                  },
                  minutesDisplayDodgeTimeOnMap: {
                    label: sangu_trans.mainTagger.minutesDisplayDodgeTimeOnMap,
                    tooltip: sangu_trans.mainTagger.minutesDisplayDodgeTimeOnMapTooltip,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.minutesDisplayDodgeTimeOnMap; },
                      setter: function(value) { user_data.mainTagger2.minutesDisplayDodgeTimeOnMap = value; },
                      editor: "number"
                    }
                  },
                  minutesWithoutAttacksDottedLine: {
                    label: sangu_trans.mainTagger.minutesWithoutAttacksDottedLine,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.minutesWithoutAttacksDottedLine; },
                      setter: function(value) { user_data.mainTagger2.minutesWithoutAttacksDottedLine = value; },
                      editor: "number|step=60"
                    }
                  },
                  colorSupport: {
                    label: sangu_trans.mainTagger.colorSupport,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.colorSupport; },
                      setter: function(value) { user_data.mainTagger2.colorSupport = value; },
                      editor: "color"
                    }
                  },
                  defaultDescription: {
                    label: sangu_trans.mainTagger.defaultDescription,
                    tooltip: sangu_trans.mainTagger.defaultDescriptionTooltip,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.defaultDescription; },
                      setter: function(value) { user_data.mainTagger2.defaultDescription = value; },
                      editor: "text"
                    }
                  },
                  keepReservedWords: {
                    label: sangu_trans.mainTagger.keepReservedWords,
                    tooltip: sangu_trans.mainTagger.keepReservedWordsTooltip,
                    propUI: {
                      getter: function() { return user_data.mainTagger2.keepReservedWords; },
                      setter: function(value) { user_data.mainTagger2.keepReservedWords = value; },
                      editor: "bool"
                    }
                  },
                  otherButtonsTitle: {
                    type: "subtitle",
                    label: sangu_trans.mainTagger.otherButtons.title
                  }
                };

                for (var i = 0; i < user_data.mainTagger2.otherDescs.length; i++) {
                  (function() {
                    var otherDescription = user_data.mainTagger2.otherDescs[i];

                    properties['otherButton'+i] = {
                      type: "subtitle",
                      label: sangu_trans.mainTagger.otherButtons.title + ": " + otherDescription.name
                    }

                    properties['otherButtonActive'+i] = {
                      label: sangu_trans.global.resources.activate,
                      propUI: {
                        getter: function() { return otherDescription.active; },
                        setter: function(value) { otherDescription.active = value; },
                        editor: "bool"
                      }
                    }

                    properties['otherButtonName'+i] = {
                      label: sangu_trans.mainTagger.otherButtons.button,
                      propUI: {
                        getter: function() { return otherDescription.name; },
                        setter: function(value) { otherDescription.name = value; },
                        editor: "text|width=10"
                      }
                    }

                    properties['otherButtonHitKey'+i] = {
                      label: sangu_trans.mainTagger.otherButtons.hitKey,
                      propUI: {
                        getter: function() { return otherDescription.hitKey; },
                        setter: function(value) { otherDescription.hitKey = value; },
                        editor: "text|width=4"
                      }
                    }

                    properties['otherButtonDesc'+i] = {
                      label: sangu_trans.mainTagger.otherButtons.renameTo,
                      propUI: {
                        getter: function() { return otherDescription.renameTo; },
                        setter: function(value) { otherDescription.renameTo = value; },
                        editor: "text|width=50"
                      }
                    }
                  }());
                }


                user_data_configs.push({
                                         id: "mainTagger",
                                         title: sangu_trans.mainTagger.title,
                                         save: sangu_saver,
                                         properties: properties
                                       });
              }());
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "confirm",
                                       title: sangu_trans.confirm.title,
                                       save: sangu_saver,
                                       properties: {
                                         addExtraOkButton: {
                                           label: sangu_trans.confirm.addExtraOkButton,
                                           propUI: {
                                             getter: function() { return user_data.confirm.addExtraOkButton; },
                                             setter: function(value) { user_data.confirm.addExtraOkButton = value; },
                                             editor: "bool"
                                           }
                                         },
                                         replaceNightBonus: {
                                           label: sangu_trans.confirm.replaceNightBonus,
                                           show: world_config.nightbonus.active,
                                           propUI: {
                                             getter: function() { return user_data.confirm.replaceNightBonus; },
                                             setter: function(value) { user_data.confirm.replaceNightBonus = value; },
                                             editor: "bool"
                                           }
                                         },
                                         replaceTribeClaim: {
                                           label: sangu_trans.confirm.replaceTribeClaim,
                                           propUI: {
                                             getter: function() { return user_data.confirm.replaceTribeClaim; },
                                             setter: function(value) { user_data.confirm.replaceTribeClaim = value; },
                                             editor: "bool"
                                           }
                                         },
                                         addCatapultImages: {
                                           label: sangu_trans.confirm.addCatapultImages,
                                           propUI: {
                                             getter: function() { return user_data.confirm.addCatapultImages; },
                                             setter: function(value) { user_data.confirm.addCatapultImages = value; },
                                             editor: "bool"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "profile",
                                       title: sangu_trans.profile.title,
                                       save: sangu_saver,
                                       properties: {
                                         show: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.profile.show; },
                                             setter: function(value) { user_data.profile.show = value; },
                                             editor: "bool"
                                           }
                                         },
                                         moveClaim: {
                                           label: sangu_trans.profile.moveClaim,
                                           propUI: {
                                             getter: function() { return user_data.profile.moveClaim; },
                                             setter: function(value) { user_data.profile.moveClaim = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLink: {
                                           type: "subtitle",
                                           label: sangu_trans.profile.mapLink.title
                                         },
                                         mapLinkShow: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.show; },
                                             setter: function(value) { user_data.profile.mapLink.show = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLinkFill: {
                                           label: sangu_trans.profile.mapLink.fill,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.fill; },
                                             setter: function(value) { user_data.profile.mapLink.fill = value; },
                                             editor: "color"
                                           }
                                         },
                                         mapLinkZoom: {
                                           label: sangu_trans.profile.mapLink.zoom,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.zoom; },
                                             setter: function(value) { user_data.profile.mapLink.zoom = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         mapLinkGrid: {
                                           label: sangu_trans.profile.mapLink.grid,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.grid; },
                                             setter: function(value) { user_data.profile.mapLink.grid = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLinkGridContinentNumbers: {
                                           label: sangu_trans.profile.mapLink.gridContinentNumbers,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.gridContinentNumbers; },
                                             setter: function(value) { user_data.profile.mapLink.gridContinentNumbers = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLinkPlayerColor: {
                                           label: sangu_trans.profile.mapLink.playerColor,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.playerColor; },
                                             setter: function(value) { user_data.profile.mapLink.playerColor = value; },
                                             editor: "color"
                                           }
                                         },
                                         mapLinkTribeColor: {
                                           label: sangu_trans.profile.mapLink.tribeColor,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.tribeColor; },
                                             setter: function(value) { user_data.profile.mapLink.tribeColor = value; },
                                             editor: "color"
                                           }
                                         },
                                         mapLinkCentreX: {
                                           label: sangu_trans.profile.mapLink.centreX,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.centreX; },
                                             setter: function(value) { user_data.profile.mapLink.centreX = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         mapLinkCentreY: {
                                           label: sangu_trans.profile.mapLink.centreY,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.centreY; },
                                             setter: function(value) { user_data.profile.mapLink.centreY = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         mapLinkOwnColor: {
                                           label: sangu_trans.profile.mapLink.ownColor,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.ownColor; },
                                             setter: function(value) { user_data.profile.mapLink.ownColor = value; },
                                             editor: "color"
                                           }
                                         },
                                         mapLinkMarkedOnly: {
                                           label: sangu_trans.profile.mapLink.markedOnly,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.markedOnly; },
                                             setter: function(value) { user_data.profile.mapLink.markedOnly = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLinkBigMarkers: {
                                           label: sangu_trans.profile.mapLink.bigMarkers,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.bigMarkers; },
                                             setter: function(value) { user_data.profile.mapLink.bigMarkers = value; },
                                             editor: "bool"
                                           }
                                         },
                                         mapLinkYourTribeColor: {
                                           label: sangu_trans.profile.mapLink.yourTribeColor,
                                           propUI: {
                                             getter: function() { return user_data.profile.mapLink.yourTribeColor; },
                                             setter: function(value) { user_data.profile.mapLink.yourTribeColor = value; },
                                             editor: "color"
                                           }
                                         },
                                         popup: {
                                           type: "subtitle",
                                           label: sangu_trans.profile.popup.title
                                         },
                                         popupShow: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.profile.popup.show; },
                                             setter: function(value) { user_data.profile.popup.show = value; },
                                             editor: "bool"
                                           }
                                         },
                                         popupTop: {
                                           label: sangu_trans.profile.popup.top,
                                           propUI: {
                                             getter: function() { return user_data.profile.popup.top; },
                                             setter: function(value) { user_data.profile.popup.top = value; },
                                             editor: "number|step=25"
                                           }
                                         },
                                         popupLeft: {
                                           label: sangu_trans.profile.popup.left,
                                           propUI: {
                                             getter: function() { return user_data.profile.popup.left; },
                                             setter: function(value) { user_data.profile.popup.left = value; },
                                             editor: "number|step=25"
                                           }
                                         },
                                         popupWidth: {
                                           label: sangu_trans.profile.popup.width,
                                           propUI: {
                                             getter: function() { return user_data.profile.popup.width; },
                                             setter: function(value) { user_data.profile.popup.width = value; },
                                             editor: "number|step=25"
                                           }
                                         },
                                         popupHeight: {
                                           label: sangu_trans.profile.popup.height,
                                           propUI: {
                                             getter: function() { return user_data.profile.popup.height; },
                                             setter: function(value) { user_data.profile.popup.height = value; },
                                             editor: "number|step=25"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "placeLinks",
                                       title: sangu_trans.place.title,
                                       save: sangu_saver,
                                       properties: {
                                         scoutTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.scoutTitle
                                         },
                                         scoutPlaceLinksName: {
                                           label: sangu_trans.place.linkText,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.scoutPlaceLinksName; },
                                             setter: function(value) { user_data.place.attackLinks.scoutPlaceLinksName = value; },
                                             editor: "text|width=23"
                                           }
                                         },
                                         scoutVillage: {
                                           label: sangu_trans.place.scoutVillage,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.scoutVillage; },
                                             setter: function(value) { user_data.place.attackLinks.scoutVillage = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         scoutPlaceLinks: {
                                           label: sangu_trans.place.scoutPlaceLinks,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.scoutPlaceLinks; },
                                             setter: function(value) { user_data.place.attackLinks.scoutPlaceLinks = value; },
                                             editor: "array|addNew:number|step=10|delete"
                                           }
                                         },





                                         fakePlaceLinkTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.fakePlaceLinkTitle
                                         },
                                         fakePlaceLinkName: {
                                           label: sangu_trans.place.linkText,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.fakePlaceLinkName; },
                                             setter: function(value) { user_data.place.attackLinks.fakePlaceLinkName = value; },
                                             editor: "text|width=23"
                                           }
                                         },
                                         fakePlaceLink: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.fakePlaceLink; },
                                             setter: function(value) { user_data.place.attackLinks.fakePlaceLink = value; },
                                             editor: "bool"
                                           }
                                         },
                                         fakePlaceExcludeTroops: {
                                           label: sangu_trans.place.fakePlaceExcludeTroops,
                                           tooltip: sangu_trans.place.fakePlaceExcludeTroopsTooltip,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.fakePlaceExcludeTroops; },
                                             setter: function(value) { user_data.place.attackLinks.fakePlaceExcludeTroops = value; },
                                             editor: "array|addNew:text|delete|width=7"
                                           }
                                         },






                                         noblePlaceLinkTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.noblePlaceLinkTitle
                                         },
                                         noblePlaceLinkDivideTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.noblePlaceLinkDivideTitle
                                         },
                                         noblePlaceLinkDivideName: {
                                           label: sangu_trans.place.linkText,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLinkDivideName; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLinkDivideName = value; },
                                             editor: "text|width=23"
                                           }
                                         },
                                         noblePlaceLink: {
                                           label: sangu_trans.global.resources.activate,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLink; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLink = value; },
                                             editor: "bool"
                                           }
                                         },
                                         noblePlaceLinkDivideAddRam: {
                                           label: sangu_trans.place.noblePlaceLinkDivideAddRam,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLinkDivideAddRam; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLinkDivideAddRam = value; },
                                             editor: "bool"
                                           }
                                         },
                                         noblePlaceLinkFirstTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.noblePlaceLinkFirstTitle
                                         },
                                         noblePlaceLinkFirstName: {
                                           label: sangu_trans.place.linkText,
                                           tooltip: sangu_trans.place.noblePlaceLinkFirstNameTooltip,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLinkFirstName; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLinkFirstName = value; },
                                             editor: "text|width=23"
                                           }
                                         },
                                         noblePlaceLinkSupportTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.noblePlaceLinkSupportTitle
                                         },
                                         noblePlaceLinkSupportName: {
                                           label: sangu_trans.place.linkText,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLinkSupportName; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLinkSupportName = value; },
                                             editor: "text|width=23"
                                           }
                                         },
                                         noblePlaceLinksForceShow: {
                                           label: sangu_trans.place.noblePlaceLinksForceShow,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.noblePlaceLinksForceShow; },
                                             setter: function(value) { user_data.place.attackLinks.noblePlaceLinksForceShow = value; },
                                             editor: "bool"
                                           }
                                         },
                                         nobleSupportOffTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.nobleSupportOffTitle
                                         },
                                         nobleSupportOffUnit: {
                                           label: sangu_trans.place.nobleSupportUnit,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.nobleSupport[0].unit; },
                                             setter: function(value) { user_data.place.attackLinks.nobleSupport[0].unit = value; },
                                             editor: "unit"
                                           }
                                         },
                                         nobleSupportOffAmount: {
                                           label: sangu_trans.place.nobleSupportAmount,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.nobleSupport[0].amount; },
                                             setter: function(value) { user_data.place.attackLinks.nobleSupport[0].amount = value; },
                                             editor: "number|step=50"
                                           }
                                         },
                                         nobleSupportDefTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.place.nobleSupportDefTitle
                                         },
                                         nobleSupportDefUnit: {
                                           label: sangu_trans.place.nobleSupportUnit,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.nobleSupport[1].unit; },
                                             setter: function(value) { user_data.place.attackLinks.nobleSupport[1].unit = value; },
                                             editor: "unit"
                                           }
                                         },
                                         nobleSupportDefAmount: {
                                           label: sangu_trans.place.nobleSupportAmount,
                                           propUI: {
                                             getter: function() { return user_data.place.attackLinks.nobleSupport[1].amount; },
                                             setter: function(value) { user_data.place.attackLinks.nobleSupport[1].amount = value; },
                                             editor: "number|step=50"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              (function() {
                var i,
                  properties = {};

                for (i = 0; i < user_data.place.customPlaceLinks.length; i++) {
                  (function() {
                    var unitTypeIndex,
                      customPlaceLink = user_data.place.customPlaceLinks[i],
                      oneTimeTooltip = i == 0 ? sangu_trans.place.customPlaceOneTimeTooltip : undefined,
                      oneTimeTooltipSendAlong = i == 0 ? sangu_trans.place.customPlaceSendAlongTooltip : undefined;

                    properties['customPlaceLink'+i+'Title'] = {
                      type: "subtitle",
                      label: sangu_trans.place.link.replace("{name}", customPlaceLink.name)
                    };

                    properties['customPlaceLink'+i+'Name'] = {
                      label: sangu_trans.place.linkText,
                      propUI: {
                        getter: function() { return customPlaceLink.name; },
                        setter: function(value) { customPlaceLink.name = value; },
                        editor: "text|width=23"
                      }
                    };

                    properties['customPlaceLink'+i+'Active'] = {
                      label: sangu_trans.global.resources.activate,
                      propUI: {
                        getter: function() { return customPlaceLink.active; },
                        setter: function(value) { customPlaceLink.active = value; },
                        editor: "bool"
                      }
                    };

                    for (unitTypeIndex = 0; unitTypeIndex < world_data.units.length; unitTypeIndex++) {
                      (function() {
                        var unit = world_data.units[unitTypeIndex],
                          reallyOneTimeTooltip = unitTypeIndex == 0 && oneTimeTooltip ? oneTimeTooltip : undefined;

                        properties['customPlaceLink'+i+unit] = {
                          label: "<img src='graphic/unit/unit_"+unit+".png'/>",
                          tooltip: reallyOneTimeTooltip,
                          propUI: {
                            getter: function() { return customPlaceLink[unit]; },
                            setter: function(value) { customPlaceLink[unit] = value; },
                            editor: "number|step=100"
                          }
                        };
                      })();
                    }

                    properties['customPlaceLink'+i+'SendAlong'] = {
                      label: sangu_trans.place.customPlaceSendAlong,
                      tooltip: oneTimeTooltipSendAlong,
                      propUI: {
                        getter: function() { return customPlaceLink.sendAlong; },
                        setter: function(value) { customPlaceLink.sendAlong = value; },
                        editor: "number|step=100"
                      }
                    };
                  })();
                }

                user_data_configs.push({
                                         id: "placeLinksCustom",
                                         title: sangu_trans.place.titleCustom,
                                         save: sangu_saver,
                                         properties: properties
                                       });
              }());
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "overviewsTroops",
                                       title: sangu_trans.overviews.command.title,
                                       save: sangu_saver,
                                       properties: {
                                         changeTroopsOverviewLink: {
                                           label: sangu_trans.overviews.command.changeTroopsOverviewLink,
                                           propUI: {
                                             getter: function() { return user_data.command.changeTroopsOverviewLink; },
                                             setter: function(value) { user_data.command.changeTroopsOverviewLink = value; },
                                             editor: "bool"
                                           }
                                         },
                                         defaultPopulationFilterAmount: {
                                           label: sangu_trans.overviews.troopsRestack.defaultPopulationFilterAmount,
                                           propUI: {
                                             getter: function() { return user_data.restack.defaultPopulationFilterAmount; },
                                             setter: function(value) { user_data.restack.defaultPopulationFilterAmount = value; },
                                             editor: "number|step=1000"
                                           }
                                         },

                                         titleOwnTroopsPage: {
                                           type: "subtitle",
                                           label: sangu_trans.overviews.command.titleOwnTroopsPage
                                         },
                                         middleMouseClickDeletesRow: {
                                           label: sangu_trans.overviews.command.middleMouseClickDeletesRow,
                                           tooltip: sangu_trans.overviews.command.middleMouseClickDeletesRowTooltip,
                                           propUI: {
                                             getter: function() { return user_data.command.middleMouseClickDeletesRow2; },
                                             setter: function(value) { user_data.command.middleMouseClickDeletesRow2 = value; },
                                             editor: "bool"
                                           }
                                         },
                                         filterAutoSort: {
                                           label: sangu_trans.overviews.command.filterAutoSort,
                                           propUI: {
                                             getter: function() { return user_data.command.filterAutoSort; },
                                             setter: function(value) { user_data.command.filterAutoSort = value; },
                                             editor: "bool"
                                           }
                                         },


                                         titleDefensePage: {
                                           type: "subtitle",
                                           label: sangu_trans.overviews.command.titleDefensePage
                                         },
                                         fieldsDistanceFilterDefault: {
                                           label: sangu_trans.overviews.troopsRestack.fieldsDistanceFilterDefault,
                                           propUI: {
                                             getter: function() { return user_data.restack.fieldsDistanceFilterDefault; },
                                             setter: function(value) { user_data.restack.fieldsDistanceFilterDefault = value; },
                                             editor: "number"
                                           }
                                         },
                                         filterReverse: {
                                           label: sangu_trans.overviews.troopsRestack.filterReverse,
                                           tooltip: sangu_trans.overviews.troopsRestack.filterReverseTooltip,
                                           propUI: {
                                             getter: function() { return user_data.restack.filterReverse; },
                                             setter: function(value) { user_data.restack.filterReverse = value; },
                                             editor: "bool"
                                           }
                                         },
                                         filterMinPopulation: {
                                           label: sangu_trans.overviews.command.filterMinPopulation,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMinPopulation; },
                                             setter: function(value) { user_data.command.filterMinPopulation = value; },
                                             editor: "number|step=1000"
                                           }
                                         },
                                         removeRowsWithoutSupport: {
                                           label: sangu_trans.overviews.troopsRestack.removeRowsWithoutSupport,
                                           propUI: {
                                             getter: function() { return user_data.restack.removeRowsWithoutSupport; },
                                             setter: function(value) { user_data.restack.removeRowsWithoutSupport = value; },
                                             editor: "bool"
                                           }
                                         },
                                         autohideWithoutSupportAfterFilter: {
                                           label: sangu_trans.overviews.troopsRestack.autohideWithoutSupportAfterFilter,
                                           tooltip: sangu_trans.overviews.troopsRestack.autohideWithoutSupportAfterFilterTooltip,
                                           propUI: {
                                             getter: function() { return user_data.restack.autohideWithoutSupportAfterFilter; },
                                             setter: function(value) { user_data.restack.autohideWithoutSupportAfterFilter = value; },
                                             editor: "bool"
                                           }
                                         },
                                         calculateDefTotalsAfterFilter: {
                                           label: sangu_trans.overviews.troopsRestack.calculateDefTotalsAfterFilter,
                                           tooltip: sangu_trans.overviews.troopsRestack.calculateDefTotalsAfterFilterTooltip,
                                           propUI: {
                                             getter: function() { return user_data.restack.calculateDefTotalsAfterFilter; },
                                             setter: function(value) { user_data.restack.calculateDefTotalsAfterFilter = value; },
                                             editor: "bool"
                                           }
                                         },

                                         commandTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.overviews.command.filterOnUnitTypeSeperator
                                         },
                                         filterMinDefaultType: {
                                           label: sangu_trans.overviews.command.filterMinDefaultType,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMinDefaultType; },
                                             setter: function(value) { user_data.command.filterMinDefaultType = value; },
                                             editor: "unit"
                                           }
                                         },
                                         filterMinDefault: {
                                           label: sangu_trans.overviews.command.filterMinDefault,
                                           tooltip: sangu_trans.overviews.command.filterMinDefaultTooltip,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMinDefault; },
                                             setter: function(value) { user_data.command.filterMinDefault = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         filterMinSpear: {
                                           label: "<img src='graphic/unit/unit_spear.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.spear; },
                                             setter: function(value) { user_data.command.filterMin.spear = value; },
                                             editor: "number|step=500"
                                           }
                                         },
                                         filterMinSword: {
                                           label: "<img src='graphic/unit/unit_sword.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.sword; },
                                             setter: function(value) { user_data.command.filterMin.sword = value; },
                                             editor: "number|step=500"
                                           }
                                         },
                                         filterMinAxe: {
                                           label: "<img src='graphic/unit/unit_axe.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.axe; },
                                             setter: function(value) { user_data.command.filterMin.axe = value; },
                                             editor: "number|step=500"
                                           }
                                         },
                                         filterMinArcher: {
                                           label: "<img src='graphic/unit/unit_archer.png' />",
                                           show: world_config.hasArchers,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.archer; },
                                             setter: function(value) { user_data.command.filterMin.archer = value; },
                                             editor: "number|step=500"
                                           }
                                         },
                                         filterMinSpy: {
                                           label: "<img src='graphic/unit/unit_spy.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.spy; },
                                             setter: function(value) { user_data.command.filterMin.spy = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         filterMinLight: {
                                           label: "<img src='graphic/unit/unit_light.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.light; },
                                             setter: function(value) { user_data.command.filterMin.light = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         filterMinMarcher: {
                                           label: "<img src='graphic/unit/unit_marcher.png' />",
                                           show: world_config.hasArchers,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.marcher; },
                                             setter: function(value) { user_data.command.filterMin.marcher = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         filterMinHeavy: {
                                           label: "<img src='graphic/unit/unit_heavy.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.heavy; },
                                             setter: function(value) { user_data.command.filterMin.heavy = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         filterMinRam: {
                                           label: "<img src='graphic/unit/unit_ram.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.ram; },
                                             setter: function(value) { user_data.command.filterMin.ram = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         filterMinCatapult: {
                                           label: "<img src='graphic/unit/unit_catapult.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.catapult; },
                                             setter: function(value) { user_data.command.filterMin.catapult = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         filterMinSnob: {
                                           label: "<img src='graphic/unit/unit_snob.png' />",
                                           propUI: {
                                             getter: function() { return user_data.command.filterMin.snob; },
                                             setter: function(value) { user_data.command.filterMin.snob = value; },
                                             editor: "number"
                                           }
                                         },
                                         filterMinOther: {
                                           label: sangu_trans.overviews.command.filterMinOther,
                                           propUI: {
                                             getter: function() { return user_data.command.filterMinOther; },
                                             setter: function(value) { user_data.command.filterMinOther = value; },
                                             editor: "number|step=500"
                                           }
                                         },
                                         restackTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.overviews.troopsRestack.title
                                         },
                                         troopsRestackTo: {
                                           label: sangu_trans.overviews.troopsRestack.to,
                                           propUI: {
                                             getter: function() { return user_data.restack.to; },
                                             setter: function(value) { user_data.restack.to = value; },
                                             editor: "number|step=1000"
                                           }
                                         },
                                         requiredDifference: {
                                           label: sangu_trans.overviews.troopsRestack.requiredDifference,
                                           propUI: {
                                             getter: function() { return user_data.restack.requiredDifference; },
                                             setter: function(value) { user_data.restack.requiredDifference = value; },
                                             editor: "number|step=500"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "overviewsCommands",
                                       title: sangu_trans.overviews.commands.title,
                                       save: sangu_saver,
                                       properties: {
                                         sumRow: {
                                           label: sangu_trans.overviews.commands.sumRow,
                                           propUI: {
                                             getter: function() { return user_data.command.sumRow; },
                                             setter: function(value) { user_data.command.sumRow = value; },
                                             editor: "bool"
                                           }
                                         },
                                         filterFakeMaxPop: {
                                           label: sangu_trans.overviews.commands.filterFakeMaxPop,
                                           propUI: {
                                             getter: function() { return user_data.command.filterFakeMaxPop; },
                                             setter: function(value) { user_data.command.filterFakeMaxPop = value; },
                                             editor: "number|step=100"
                                           }
                                         },
                                         requiredTroopAmount: {
                                           label: sangu_trans.overviews.commands.requiredTroopAmount,
                                           propUI: {
                                             getter: function() { return user_data.command.bbCodeExport.requiredTroopAmount; },
                                             setter: function(value) { user_data.command.bbCodeExport.requiredTroopAmount = value; },
                                             editor: "number|step=100"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "overviewsResources",
                                       title: sangu_trans.overviews.resources.title,
                                       save: sangu_saver,
                                       properties: {
                                         requiredResDefault: {
                                           label: sangu_trans.overviews.resources.requiredResDefault,
                                           propUI: {
                                             getter: function() { return user_data.resources.requiredResDefault; },
                                             setter: function(value) { user_data.resources.requiredResDefault = value; },
                                             editor: "number|step=10000"
                                           }
                                         },
                                         requiredMerchants: {
                                           label: sangu_trans.overviews.resources.requiredMerchants,
                                           propUI: {
                                             getter: function() { return user_data.resources.requiredMerchants; },
                                             setter: function(value) { user_data.resources.requiredMerchants = value; },
                                             editor: "number|step=10"
                                           }
                                         },
                                         filterMerchants: {
                                           label: sangu_trans.overviews.resources.filterMerchants,
                                           propUI: {
                                             getter: function() { return user_data.resources.filterMerchants; },
                                             setter: function(value) { user_data.resources.filterMerchants = value; },
                                             editor: "bool"
                                           }
                                         },
                                         highlightColor: {
                                           label: sangu_trans.overviews.resources.highlightColor,
                                           propUI: {
                                             getter: function() { return user_data.resources.highlightColor; },
                                             setter: function(value) { user_data.resources.highlightColor = value; },
                                             editor: "color"
                                           }
                                         },
                                         filterRows: {
                                           label: sangu_trans.overviews.resources.filterRows,
                                           propUI: {
                                             getter: function() { return user_data.resources.filterRows; },
                                             setter: function(value) { user_data.resources.filterRows = value; },
                                             editor: "bool"
                                           }
                                         },
                                         bbcodeMinimumDiff: {
                                           label: sangu_trans.overviews.resources.bbcodeMinimumDiff,
                                           propUI: {
                                             getter: function() { return user_data.resources.bbcodeMinimumDiff; },
                                             setter: function(value) { user_data.resources.bbcodeMinimumDiff = value; },
                                             editor: "number|step=2000"
                                           }
                                         }
                                       }
                                     });
            }

            if (showConfigs) {
              // Buildingsoverview:
              (function() {
                var properties = {},
                  i;

                for (i = 0; i < world_data.buildings.length; i++) {
                  (function() {
                    var captured_index = i,
                      building_name = world_data.buildings[captured_index],
                      buildingPrettyfier = function(building) { return "<img src='graphic/buildings/"+building+".png'>"; };

                    properties[building_name+'_min'] = {
                      label: sangu_trans.overviews.buildings.minLevel.replace("{building}", buildingPrettyfier(building_name)),
                      propUI: {
                        getter: function() { return user_data.buildings[building_name][0]; },
                        setter: function(value) { user_data.buildings[building_name][0] = value; },
                        editor: "number"
                      }
                    };

                    properties[building_name+'_max'] = {
                      label: sangu_trans.overviews.buildings.maxLevel.replace("{building}", buildingPrettyfier(building_name)),
                      propUI: {
                        getter: function() { return user_data.buildings[building_name][1]; },
                        setter: function(value) { user_data.buildings[building_name][1] = value; },
                        editor: "number"
                      }
                    };
                  })();
                }

                user_data_configs.push({
                                         id: "overviewsBuildings",
                                         title: sangu_trans.overviews.buildings.title,
                                         save: sangu_saver,
                                         properties: properties
                                       });
              }());
            }

            if (showConfigs) {
              // Incomingsoverview:
              (function() {
                var properties = {},
                  i;

                properties.attackIdTitle = {
                  type: "subtitle",
                  label: sangu_trans.overviews.incomings.attackIdTitle
                };

                for (i = 0; i < user_data.incomings.attackIdDescriptions.length; i++) {
                  (function() {
                    var captured_index = i;

                    properties['incomings_attackIdDesc'+captured_index+'_title'] = {
                      type: "subtitle",
                      label: sangu_trans.overviews.incomings.seperatorTitle.replace("{minValue}", user_data.incomings.attackIdDescriptions[captured_index].minValue)
                    };

                    properties['incomings_attackIdDesc'+captured_index+'_minValue'] = {
                      label: sangu_trans.overviews.incomings.minValue,
                      tooltip: captured_index == 0 ? sangu_trans.overviews.incomings.minValueTooltip : undefined,
                      propUI: {
                        getter: function() { return user_data.incomings.attackIdDescriptions[captured_index].minValue; },
                        setter: function(value) { user_data.incomings.attackIdDescriptions[captured_index].minValue = value; },
                        editor: "number"
                      }
                    };

                    properties['incomings_attackIdDesc'+captured_index+'_text'] = {
                      label: sangu_trans.overviews.incomings.text,
                      propUI: {
                        getter: function() { return user_data.incomings.attackIdDescriptions[captured_index].text; },
                        setter: function(value) { user_data.incomings.attackIdDescriptions[captured_index].text = value; },
                        editor: "text"
                      }
                    };
                  })();
                }

                properties['incomings_attackIdDescMaxText'] = {
                  label: sangu_trans.overviews.incomings.attackIdHigherDescription,
                  propUI: {
                    getter: function() { return user_data.incomings.attackIdHigherDescription; },
                    setter: function(value) { user_data.incomings.attackIdHigherDescription = value; },
                    editor: "text"
                  }
                };

                user_data_configs.push({
                                         id: "overviewsIncomings",
                                         title: sangu_trans.overviews.incomings.title,
                                         save: sangu_saver,
                                         properties: properties
                                       });
              }());
            }

            if (showConfigs) {
              user_data_configs.push({
                                       id: "other",
                                       title: sangu_trans.other.title,
                                       save: sangu_saver,
                                       properties: {
                                         fancyImages: {
                                           label: sangu_trans.overviews.addFancyImagesToOverviewLinks,
                                           propUI: {
                                             getter: function() { return user_data.overviews.addFancyImagesToOverviewLinks; },
                                             setter: function(value) { user_data.overviews.addFancyImagesToOverviewLinks = value; },
                                             editor: "bool"
                                           }
                                         },
                                         proStyle: {
                                           tooltip: sangu_trans.other.proStyleTooltip,
                                           label: sangu_trans.other.proStyle,
                                           propUI: {
                                             getter: function() { return user_data.proStyle; },
                                             setter: function(value) { user_data.proStyle = value; },
                                             editor: "bool"
                                           }
                                         },
                                         calculateSnob: {
                                           label: sangu_trans.other.calculateSnob,
                                           show: !world_config.coins,
                                           propUI: {
                                             getter: function() { return user_data.other.calculateSnob; },
                                             setter: function(value) { user_data.other.calculateSnob = value; },
                                             editor: "bool"
                                           }
                                         },
                                         showPlayerProfileOnVillage: {
                                           label: sangu_trans.other.showPlayerProfileOnVillage,
                                           propUI: {
                                             getter: function() { return user_data.showPlayerProfileOnVillage; },
                                             setter: function(value) { user_data.showPlayerProfileOnVillage = value; },
                                             editor: "bool"
                                           }
                                         },
                                         overviewAjaxSeperateSupport: {
                                           label: sangu_trans.other.ajaxSeperateSupport,
                                           show: server_settings.ajaxAllowed,
                                           propUI: {
                                             getter: function() { return user_data.overview.ajaxSeperateSupport; },
                                             setter: function(value) { user_data.overview.ajaxSeperateSupport = value; },
                                             editor: "bool"
                                           }
                                         },
                                         canHideDiv: {
                                           label: sangu_trans.other.canHideDiv,
                                           propUI: {
                                             getter: function() { return user_data.overview.canHideDiv; },
                                             setter: function(value) { user_data.overview.canHideDiv = value; },
                                             editor: "bool"
                                           }
                                         },
                                         timeDisplayTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.other.timeDisplayTitle
                                         },
                                         walkingTimeDisplay: {
                                           label: sangu_trans.other.walkingTimeDisplay,
                                           tooltip: sangu_trans.other.walkingTimeDisplayTooltip,
                                           propUI: {
                                             getter: function() { return user_data.walkingTimeDisplay; },
                                             setter: function(value) { user_data.walkingTimeDisplay = value; },
                                             editor: "text"
                                           }
                                         },
                                         displayDays: {
                                           label: sangu_trans.other.displayDays,
                                           tooltip: sangu_trans.other.displayDaysTooltip,
                                           propUI: {
                                             getter: function() { return user_data.displayDays; },
                                             setter: function(value) { user_data.displayDays = value; },
                                             editor: "bool"
                                           }
                                         },
                                         commandRenamerTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.other.commandRenamer
                                         },
                                         commandRenamerActive: {
                                           label: sangu_trans.other.commandRenamerActive,
                                           propUI: {
                                             getter: function() { return user_data.attackAutoRename.active; },
                                             setter: function(value) { user_data.attackAutoRename.active = value; },
                                             editor: "bool"
                                           }
                                         },
                                         commandRenamerAddHaul: {
                                           label: sangu_trans.other.commandRenamerAddHaul,
                                           propUI: {
                                             getter: function() { return user_data.attackAutoRename.addHaul; },
                                             setter: function(value) { user_data.attackAutoRename.addHaul = value; },
                                             editor: "bool"
                                           }
                                         },
                                         farmLimitTitle: {
                                           type: "subtitle",
                                           label: sangu_trans.other.farmLimitTitle
                                         },
                                         farmLimitColors: {
                                           label: sangu_trans.other.farmLimitStackColors,
                                           propUI: {
                                             getter: function(propIndex) {
                                               return user_data.farmLimit.stackColors;
                                             },
                                             setter: function(value, propIndex) { user_data.farmLimit.stackColors = value; },
                                             editor: "array|addNew:color|delete"
                                           }
                                         },
                                         farmLimitAcceptableOverstack: {
                                           label: sangu_trans.other.farmLimitAcceptableOverstack,
                                           tooltip: sangu_trans.other.farmLimitAcceptableOverstackTooltip.replace("{farmlimit}", 30 * world_config.farmLimit),
                                           show: world_config.farmLimit,
                                           propUI: {
                                             getter: function() { return user_data.farmLimit.acceptableOverstack; },
                                             setter: function(value) { user_data.farmLimit.acceptableOverstack = value; },
                                             editor: "array|addNew:float|delete|step=0.01"
                                           }
                                         },
                                         farmLimitUnlimitedStack: {
                                           label: sangu_trans.other.farmLimitUnlimitedStack,
                                           show: !world_config.farmLimit,
                                           propUI: {
                                             getter: function() { return user_data.farmLimit.unlimitedStack; },
                                             setter: function(value) { user_data.farmLimit.unlimitedStack = value; },
                                             editor: "array|addNew:number|delete|step=1000"
                                           }
                                         }
                                       }
                                     });
            }




            if (showConfigs) {
              // Extra links on village info to troop overview
              (function() {
                var properties = {},
                  i;

                function addSetting(properties, index, offDef, propName, label, editor, tooltip) {
                  properties['infoPage_extra_link'+index+'_'+offDef+propName] = {
                    label: label,
                    tooltip: tooltip,
                    propUI: {
                      getter: function() { return user_data.villageInfo4[index][offDef][propName]; },
                      setter: function(value) { user_data.villageInfo4[index][offDef][propName] = value; },
                      editor: editor
                    }
                  };
                }

                // hehe
                function addSetting2(properties, index, offDef, propName, label, editor, tooltip) {
                  properties['infoPage_extra_link'+index+'_'+offDef+propName] = {
                    label: label,
                    tooltip: tooltip,
                    propUI: {
                      getter: function() { return user_data.villageInfo4[index][offDef].filter[propName]; },
                      setter: function(value) { user_data.villageInfo4[index][offDef].filter[propName] = value; },
                      editor: editor
                    }
                  };
                }

                function add2Links(captured_index, offDef) {
                  addSetting(properties, captured_index, offDef+"_link", "name", sangu_trans.villageInfo.linkName, "text");
                  addSetting(properties, captured_index, offDef+"_link", "icon", sangu_trans.villageInfo.icon, "text");
                  addSetting(properties, captured_index, offDef+"_link", "sort", sangu_trans.villageInfo.sort, "bool");
                  addSetting(properties, captured_index, offDef+"_link", "changeSpeed", sangu_trans.villageInfo.changeSpeed, "unit");
                  addSetting(properties, captured_index, offDef+"_link", "group", sangu_trans.villageInfo.group, "number", sangu_trans.villageInfo.groupTitle);

                  properties['incomings_attackIdDesc'+captured_index+offDef+'_FilterTitle'] = {
                    type: "subtitle",
                    label: sangu_trans.villageInfo.filter.title
                  };

                  addSetting2(properties, captured_index, offDef+"_link", "active", sangu_trans.villageInfo.filter.title, "bool");
                  addSetting2(properties, captured_index, offDef+"_link", "unit", sangu_trans.villageInfo.filter.unit, "unit");
                  addSetting2(properties, captured_index, offDef+"_link", "amount", sangu_trans.villageInfo.filter.amount, "number|step=100");
                }

                for (i = 0; i < user_data.villageInfo4.length; i++) {
                  (function() {
                    var captured_index = i;

                    properties['incomings_attackIdDesc'+captured_index+'_title'] = {
                      type: "subtitle",
                      label: sangu_trans.villageInfo.title2 + " " + (captured_index + 1)
                    };

                    properties['infoPage_extra_link'+captured_index+'_activate'] = {
                      label: sangu_trans.global.resources.activate,
                      propUI: {
                        getter: function() { return user_data.villageInfo4[captured_index].active; },
                        setter: function(value) { user_data.villageInfo4[captured_index].active = value; },
                        editor: "bool"
                      }
                    };

                    properties['incomings_attackIdDesc'+captured_index+"off"+'_title'] = {
                      type: "subtitle",
                      label: sangu_trans.villageInfo.off_title
                    };
                    add2Links(captured_index, "off");

                    properties['incomings_attackIdDesc'+captured_index+"def"+'_title'] = {
                      type: "subtitle",
                      label: sangu_trans.villageInfo.def_title
                    };
                    add2Links(captured_index, "def");

                  })();
                }

                user_data_configs.push({
                                         id: "villageInfoLinks",
                                         title: sangu_trans.villageInfo.title,
                                         save: sangu_saver,
                                         properties: properties
                                       });
              }());
            }

            return user_data_configs;
          }());
          (function() {
            // contentPage is the place we will add the settings menu to
            var contentPage = $("table:first td:last", content_value).attr("width", "99%"),
              sanguTitle = "<h3 id='sanguConfigTitle'>" + trans.sp.sp.configuration.replace("{version}", sangu_version) + "</h3>";

            function gimmeTheMoney() {
              function createButton(paypalCode, euroAmount, tooltip) {
                return '<div align="center">'
                  + '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">'
                  + '<input type="hidden" name="cmd" value="_s-xclick">'
                  + '<input type="hidden" name="hosted_button_id" value="' + paypalCode + '">'
                  + '<input type="image" src="https://www.paypalobjects.com/nl_NL/BE/i/btn/btn_donate_SM.gif" border="0" name="submit" title="'+tooltip+'">'
                  + '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">'
                  + '<br>' + trans.sp.sp.donate.buttonAmount.replace("{amount}", euroAmount)
                  + '</form></div>';
              }

              var html = "<h3>Contributors</h3>";
              html += "Hebben aan het Sangu Package meegewerkt: <br><b>";
              html += "De Goede Fee, cgrain, Tjeerdo, Hardcode93";
              html += "</b>";

              html += "<h3>"+trans.sp.sp.donate.title+"</h3>";
              html += trans.sp.sp.donate.whyWouldI;
              html += "<br>" + trans.sp.sp.donate.books
                .replace("{abegin}", "<a target='_blank' href='http://www.amazon.com/wishlist/1RFQ21NSF4PAI/ref=cm_wl_prev_ret?_encoding=UTF8&reveal='>")
                .replace("{aend}", "</a>");

              html += "<br><br>"
                + "<table width='100%'><tr>"
                + "<td>" + createButton("FA9MAMFAYKANL", 5, trans.sp.sp.donate.beer) + "</td>"
                + "<td>" + createButton("R9RX6XBCV6T4G", 10, trans.sp.sp.donate.food) + "</td>"
                + "<td>" + createButton("ELG8Y2GLSXAVA", 20, trans.sp.sp.donate.yaye) + "</td>"
                + "</tr>"
                + "</table>";

              return html;
            }

            // Reset sangu settings links
            var resetForm = "<a href='#' id='resetSettings'>&raquo; " + trans.sp.sp.settings.reset + "</a>";
            resetForm += "<br>";
            resetForm += "<a href='#' id='resetAllSettings'>&raquo; " + trans.sp.sp.settings.resetAll + "</a>";

            // skeleton injection
            contentPage.html(sanguTitle + "<div id='sanguSettingsForm'>" + resetForm + gimmeTheMoney() + "</div>");

            gimmeTheMoney();
            $("#sanguSettingsForm").append("<br><br>");

            $("#resetSettings").click(function() {
              if (confirm(trans.sp.sp.settings.reset)) {
                pers.set('sangusettings', '');
                location.reload(false);
              }
              return false;
            });

            $("#resetAllSettings").click(function() {
              if (confirm(trans.sp.sp.settings.resetAll)) {
                pers.clear();
                location.reload(false);
              }
              return false;
            });

            (function() {
              var sanguSettingsForm,
                configIterator,
                settingFormTogglerHtml,
                settingsFormsOpenFromPersistence,
                adornButton = function(button) { $(button).css("background-color", user_data.colors.error); };

              sanguSettingsForm = $("#sanguSettingsForm");

              settingFormTogglerHtml = "<h3>" + trans.sp.sp.settings.configuration + "</h3>";
              settingFormTogglerHtml +=
                "<table class='vis' width='100%'><tr class='row_a'><th>"
                + trans.sp.sp.settings.configurationFormTogglerTooltip
                + "</th></tr><tr class='row_b'><td>";
              for (configIterator = 0; configIterator < user_data_configs.length; configIterator++) {
                settingFormTogglerHtml +=
                  "<input type='button' value=\""
                  + user_data_configs[configIterator].title
                  + "\" id='"+user_data_configs[configIterator].id
                  + "_button' class='editFormToggler' /> &nbsp;";
              }
              settingFormTogglerHtml += "</td></tr></table><br>";
              sanguSettingsForm.append(settingFormTogglerHtml);
              $(".editFormToggler", sanguSettingsForm).click(function() {
                var openForms = "",
                  linkedDiv = $("#" + this.id.replace("_button", ""));

                if (linkedDiv.is(":visible")) {
                  linkedDiv.hide();
                  $(this).css("background-color", "");
                } else {
                  linkedDiv.fadeIn();
                  adornButton(this);
                }

                $(".propertyEditFormContainer", sanguSettingsForm).each(function() {
                  if ($(this).is(":visible")) {
                    openForms += this.id + "|";
                  }
                });
                pers.set("settingsFormsOpen", openForms);
              });

              // build the property handler editting form
              for (configIterator = 0; configIterator < user_data_configs.length; configIterator++) {
                buildConfigForm(sanguSettingsForm, user_data_configs[configIterator]);
              }

              settingsFormsOpenFromPersistence = pers.get("settingsFormsOpen");
              $(".propertyEditFormContainer", sanguSettingsForm).each(function() {
                if (settingsFormsOpenFromPersistence.indexOf(this.id+"|") > -1) {
                  adornButton($("#" + this.id + "_button"));
                  $(this).show();
                }
              });

              $('input[id*="mainTagger_otherButtonHitKey"]').on('keydown', function(e){
                e.preventDefault();
                e.stopPropagation();
                var TagNumber = $(this).attr("id").match(/\d+/);
                $(this).val('');
                $(this).val(keyCodeMap[e.which].toUpperCase());
                user_data.mainTagger2.otherDescs[TagNumber]["hitKey"] = $(this).val();
                pers.set('sangusettings', JSON.stringify(user_data));
                trackEvent("ScriptUsage", "SettingEdit", "1");
              })

            })();

            // notable contributors
            (function() {
              var notableHtml = "<u>" + trans.sp.sp.donate.notable + "</u>";
              notableHtml += "<br><br><b>sakeb</b>: Nogmaals bedankt voor 'JavaScript: The Good Parts'! :)";
              notableHtml += "<br><b>Daniel Ivanov</b>";
              notableHtml += "<br><br>";

              $("#sanguSettingsForm").append(notableHtml);
            })();
          })();
        }
        break;

      case "place":
        /**
         * {spVillage} The current village
         */
        var vilHome = getVillageFromCoords(game_data.village.coord);
        if ($("#attack_name").size() > 0) {
          // RALLYPOINT CONFIRM
          (function() {
            //console.time("confirm");
            try {
              // reorder the page
              if (user_data.proStyle) {
                $("table:first", content_value).css("width", 500);

                // Merge nightbonus & tribe claim statements (for OK button placement)
                if (user_data.proStyle && (user_data.confirm.replaceTribeClaim || user_data.confirm.replaceNightBonus)) {
                  var header = $("h2:first", content_value);
                  var claim = $("h3.error");
                  if (claim.size() != 0) {
                    claim.each(function() {
                      var $this = $(this);
                      $this.hide();
                      header.addClass("error").text(header.text() + " - " + $this.text());
                    });
                  }
                }
              }

              // extra attack button (always on the same place)
              if (user_data.confirm.addExtraOkButton) {
                $("h2:first", content_value).prepend("<input type=submit style='font-size: 10pt' id=focusPlaceHolder value='" + $("#troop_confirm_go").val() + "'><br>");
                $("#focusPlaceHolder").click(function () {
                  $(this).attr("disabled", "disabled");
                  $("#troop_confirm_go").click();
                });
              }

              // Catapult building images
              if (user_data.confirm.addCatapultImages && $("#save_default_attack_building").length == 1) {
                var dropdown = $("select[name='building']");
                var buildingImages = "";

                dropdown.find("option").each(function(index, value) {
                  buildingImages += "<img class='catapultSwitcher' title='"+trans.sp.command.catapultImageTitle+"' building='"+$(value).val()+"' src='http://cdn.tribalwars.net/graphic/buildings/" + $(value).val() + ".png'> ";
                });

                dropdown.parent().parent().before("<tr><td colspan=4>"+buildingImages+"</td></tr>");
                $("img.catapultSwitcher").click(function() {
                  dropdown.val($(this).attr("building"));
                });
              }

              var valueCells = $("table.vis:first td:odd", content_value);
              var targetVillage = valueCells.first().text();

              // remember last attack
              // saved at the confirmation page so that we can't save
              // invalid coordinates
              var village = getVillageFromCoords(targetVillage);
              if (village.isValid) {
                pers.set("lastVil", village.coord);
              }

              var isAttack = $("input[name='attack']").val() == "true";
              var isBarbarian = valueCells.eq(1).has("a").length === 0;
              var player = (isBarbarian ? '' : valueCells.eq(1).text());

              var unitsSent = {};
              $.each(world_data.units, function (i, val) {
                unitsSent[val] = parseInt($("input[name='" + val + "']", content_value).val(), 10);
              });

              // compare runtime with dodgetime
              var unitsCalc = calcTroops(unitsSent);
              var dodgeCookie = pers.getCookie("sanguDodge" + getQueryStringParam("village"));
              if (dodgeCookie) {
                dodgeCookie = dodgeCookie.split("~");
                var durationCell = $("table.vis:first td:contains('" + trans.tw.command.walkingTimeTitle + "')", content_value).next();
                var attackRunTime = getTimeFromTW(durationCell.text());
                var dodgeTime = getTimeFromTW(dodgeCookie[1]);

                var runtimeIsOk = attackRunTime.totalSecs >= dodgeTime.totalSecs;
                var diffSecs = (attackRunTime.totalSecs - dodgeTime.totalSecs);

                var dodgeCellText = "<table border=0 cellpadding=0 cellspacing=0 width='1%'><tr>";
                dodgeCellText += "<td width='25%' align=center>" + durationCell.text() + "</td>";
                dodgeCellText += "<td width='50%' align=center><b>" + (runtimeIsOk ? "&gt;&gt;&gt;" : "&lt;&lt;&lt;") + "</b></td>";
                dodgeCellText += "<td width='25%' align=center nowrap>" + dodgeCookie[1] + "&nbsp;";
                if (diffSecs > 0) {
                  dodgeCellText += trans.sp.command.dodgeMinuteReturn.replace("{minutes}", prettyDate(diffSecs * 2000, true)); // 2000 = Method expects milliseconds and distance is walked 2 times!
                }
                dodgeCellText += "</td>";

                dodgeCellText += "</tr></table>";
                durationCell.html(dodgeCellText);

                if (!runtimeIsOk) {
                  durationCell.find("table").attr("title", trans.sp.command.dodgeNotFarEnough).css("background-color", user_data.colors.error).find("td").css("background-color", user_data.colors.error);
                }

                if (dodgeCookie[0] != "unit_" + unitsCalc.getSlowest()) {
                  $("h2:first", content_value).css("background-color", user_data.colors.error);
                }
              } else {
                // If a dodgecookie is in use, nightbonus etc isn't relevant
                unitsCalc.colorIfNotRightAttackType($("h2:first", content_value), isAttack);
                var arrivalTime = getDateFromTodayTomorrowTW($.trim($("#date_arrival").text()));
                if (user_data.proStyle && user_data.confirm.replaceNightBonus && isDateInNightBonus(arrivalTime)) {
                  $("#date_arrival").css("background-color", user_data.colors.error).css("font-weight", "bold");
                }
              }

              if (user_data.attackAutoRename.active) {
                // rename attack command
                // cookie reading code in place.js
                var villageCoord = $("input[name='x']", content_value).val() + '|' + $("input[name='y']", content_value).val();
                var sent = buildAttackString(villageCoord, unitsSent, player, !isAttack);
                document.title = game_data.village.coord + " -> " + sent;

                var twInitialCommandName = (isAttack ? trans.tw.command.attackOn : trans.tw.command.supportFor) + targetVillage;
                pers.setSession("attRen_" + game_data.village.id + '_' + twInitialCommandName, sent);
              }
            } catch (e) { handleException(e, "place-confirm"); }
            //console.timeEnd("confirm");
          }());
        }
        // RALLYPOINT UNITS THERE
        else if (current_page.mode === 'units' && location.href.indexOf('try=back') == -1) {
          (function() {
            //console.time("units_back");
            try {
              var units_awayTable = $("#units_away").width("100%");
              if (units_awayTable.size() != 0) {
                // Troops in other villages
                $("tr:first", units_awayTable).append(
                    "<th>" + trans.sp.place.distance + "</th>"
                    + "<th>" + trans.sp.place.backOn + "</th>");

                units_awayTable.find("tr:gt(0):even").each(function() {
                  var row = $(this),
                    villageCoord = getVillageFromCoords(row.find("td:eq(1)").text());

                  if (!villageCoord.isValid) {
                    row.append("<th>&nbsp;</th><th>&nbsp;</th>");
                  } else {
                    var slowestUnit = null;
                    var slowestUnitName = null;
                    $.each(world_data.units, function (i, val) {
                      var amount = $("td:eq(" + (i + 2) + "), th:eq(" + (i + 1) + ")", row).text();
                      if (amount != '0') {
                        if (slowestUnit == null || slowestUnit < world_data.unitsSpeed['unit_' + val]) {
                          slowestUnitName = val;
                          slowestUnit = world_data.unitsSpeed['unit_' + val];
                        }
                      }
                    });

                    var fields = getDistance(vilHome.x, villageCoord.x, vilHome.y, villageCoord.y, slowestUnitName);
                    var extraColumns = "<td align=right>" + parseInt(fields.fields, 10) + "</td>";
                    extraColumns += "<td>" + twDateFormat(fields.arrivalTime) + "</td>";

                    row.append(extraColumns);
                  }
                });
              }

              // Calculate distance and walkingtime to the villages
              var unitsTable = $("form table:first");
              $("tr:first", unitsTable).append('<th width="50"><span class="icon header population" title="' + trans.sp.all.population + '"></span></th><th>' + trans.sp.place.distance + '</th><th>' + trans.sp.place.backOn + '</th>');
              unitsTable.find("tr:gt(0)").each(function () {
                var pop = 0;
                var row = $(this);
                var slowestUnit = null;
                var slowestUnitName = null;

                $.each(world_data.units, function (i, val) {
                  var amount = parseInt($("td:eq(" + (i + 1) + "), th:eq(" + (i + 1) + ")", row).text(), 10);
                  if (amount !== 0) {
                    pop += amount * world_data.unitsPositionSize[i];

                    if (slowestUnit == null || slowestUnit < world_data.unitsSpeed['unit_' + val]) {
                      slowestUnitName = val;
                      slowestUnit = world_data.unitsSpeed['unit_' + val];
                    }
                  }
                });

                var villageCoord = getVillageFromCoords(row.find("td:first").text());
                var color = getStackColor(pop);

                if (color !== "") {
                  $(this).append("<td align=right style='background-color: " + color + "'>" + formatNumber(pop) + "</td><td colspan=2>&nbsp;</td>");
                } else {
                  var extraColumns = '<td align=right>' + formatNumber(pop) + '</td>';
                  if (!villageCoord.isValid) {
                    extraColumns += "<td colspan=2 align=right>&nbsp;</td>";
                  } else {
                    //q(vilHome.x + ':' + slowestUnitName);
                    var dist = getDistance(vilHome.x, villageCoord.x, vilHome.y, villageCoord.y, slowestUnitName),
                      fields = parseInt(dist.fields, 10);

                    extraColumns += "<td align=right>" + fields + "</td><td>" + twDateFormat(dist.arrivalTime) + "</td>";
                    $("td:first", this).append("&nbsp; <b>" + trans.sp.all.fieldsSuffix.replace("{0}", fields) + "</b>");
                    $(this).addClass("toSort").attr("fields", fields);
                  }
                  $(this).append(extraColumns);
                }
              });

              var checkboxAmount = $("input[type='checkbox']", unitsTable);
              if (checkboxAmount.size() == 1) {
                // village has just been taken over? auto check checkbox
                checkboxAmount.attr("checked", true);
              }

              // Sort on distance
              unitsTable.find("tr.toSort").sortElements(function (a, b) {
                return parseInt($(a).attr("fields"), 10) < parseInt($(b).attr("fields"), 10) ? 1 : -1;
              });

              // are there incomings on the supporting villages?
              if (server_settings.ajaxAllowed) {
                unitsTable.find("tr.toSort").each(function() {
                  var row = $(this);
                  var villageUrl = $("a:first", this).attr("href");
                  ajax(villageUrl, function (villageDetails) {
                    var villageOwner = $("table.vis:first tr:eq(4) a", villageDetails);
                    if (villageOwner.text() != game_data.player.name) {
                      $("td:first a", row).after(" [" + villageOwner.outerHTML() + "]");
                    } else {
                      var incomingTable = $("table th:contains('" + trans.tw.overview.incomingTroops + "')", villageDetails);
                      if (incomingTable.size() > 0) {
                        incomingTable = incomingTable.parent().parent();
                        var incomingRows = $("tr:has(img[src*='attack'])", incomingTable);
                        if (incomingRows.size() > 0) {
                          var firstAttack = incomingRows.eq(0);
                          var timeLeft = $("td:eq(2)", firstAttack).text();
                          var arrivalDate = $("td:eq(1)", firstAttack).text();

                          var lastAttack = incomingRows.last();
                          var timeLeftLast = $("td:eq(2)", lastAttack).text();
                          var arrivalDateLast = $("td:eq(1)", lastAttack).text();

                          var amount = incomingRows.size();

                          var attacksDesc;
                          if (amount == 1) {
                            attacksDesc = trans.sp.place.onlyAttack
                              .replace("{timeLeftFirst}", timeLeft)
                              .replace("{arrivalDateFirst}", arrivalDate);
                          } else {
                            attacksDesc = trans.sp.place.multipleAttack
                              .replace("{timeLeftFirst}", timeLeft)
                              .replace("{arrivalDateFirst}", arrivalDate)
                              .replace("{timeLeftLast}", timeLeftLast)
                              .replace("{arrivalDateLast}", arrivalDateLast)
                              .replace("{amount}", amount);
                          }

                          $("td:first input", row).after("&nbsp; <img src='graphic/command/attack.png' title='" + attacksDesc + "'>");
                        }
                      }
                    }
                  });
                });
              }
            } catch (e) { handleException(e, "place-units_back"); }
            //console.timeEnd("units_back");
          }());
        }
        // RALLY POINT (DEFAULT)
        else {
          (function() {
            //console.time("place-place");
            try {
              // Auto rename attacks
              if (user_data.attackAutoRename.active) {
                // Less than ideal solution:
                // Does not work properly when sending many attacks (ie snobtrain)
                // In confirm.js the cookies are saved

                var hasAttackRenamingCookieNeedle = pers.getWorldKey('attRen_' + game_data.village.id + '_');
                for (var i = 0; i  <  sessionStorage.length; i++) {
                  var key = sessionStorage.key(i);
                  if (key.indexOf(hasAttackRenamingCookieNeedle) == 0) {
                    var twInitialCommandName = key.substr(hasAttackRenamingCookieNeedle.length);
                    //q("found:" + hasAttackRenamingCookieNeedle + " -> " + twInitialCommandName);

                    // ' is an invalid village name character so we don't need to escape
                    var commandLabel = $('.quickedit-label:contains("' + twInitialCommandName + '")');
                    if (commandLabel.length > 0 && server_settings.ajaxAllowed) {
                      var sanguCommandName = sessionStorage.getItem(key);

                      // Open the rename command form:
                      commandLabel.parent().next().click();

                      // Fill in new command name and click rename button
                      var commandWrapper = commandLabel.parent().parent().parent(),
                        commandForm = commandWrapper.find(".quickedit-edit");

                      commandForm.find("input:first").val(sanguCommandName);
                      commandForm.find("input:last").click();

                      pers.removeSessionItem(key);

                      if (commandLabel.closest("table").find("tr").length > 2) {
                        commandLabel.closest("td").addClass("selected");
                      }
                    }
                  }
                }
              }

              $("#inputx,#inputy").focus(function() {
                $(this).select();
              });

              // fill in coordinates? (links from troops overview page)
              if (server_settings.autoFillCoordinatesAllowed && window.location.search.indexOf("&sanguX=") != -1) {
                var match = window.location.search.match(/sanguX=(\d+)&sanguY=(\d+)/);
                if (typeof match[1] !== "undefined") {
                  $("#inputx").val(match[1]);
                  $("#inputy").val(match[2]);
                }
              }

              // Spice up rally point:
              var speedCookie = spSpeedCookie();

              (function() {
                try {

                  // Show current selected speed + ability to change active speed
                  $(".unit_link img", content_value).each(function() {
                    $(this).attr("title", trans.sp.place.changeSpeedImageTooltips.replace("{originalTitle}", $(this).attr("title")));
                  });

                  $("#units_form a img").click(function () {
                    var unit = this.src;
                    unit = unit.substr(unit.lastIndexOf('/') + 1);
                    unit = unit.substr(0, unit.lastIndexOf('.'));
                    speedCookie = spSpeedCookie(unit);
                    $("#units_form a img").css("border", "0px").filter("img[src*='" + unit + "']").css("border", "3px red solid");

                    // lastvil
                    var coord = getVillageFromCoords(pers.get("lastVil"));
                    if (coord.isValid) {
                      var dist = getDistance(coord.x, vilHome.x, coord.y, vilHome.y, speedCookie);
                      $("#lastVilTime")[0].innerHTML = dist.html;
                    }

                    // targetVillage
                    coord = getVillageFromCoords(spTargetVillageCookie());
                    if (coord.isValid) {
                      dist = getDistance(coord.x, vilHome.x, coord.y, vilHome.y, speedCookie);
                      $("#targetVilTime")[0].innerHTML = dist.html;
                    }

                  }).filter("img[src*='" + speedCookie + "']").css("border", "3px red solid");

                } catch (e) { handleException(e, "place-activespeed"); }
              }());
              (function() {
                try {
                  // sangupackage last village
                  var cookie = pers.get("lastVil"),
                    coord = getVillageFromCoords(cookie),
                    dist;

                  if (coord.isValid) {
                    dist = getDistance(coord.x, vilHome.x, coord.y, vilHome.y, speedCookie);
                    var htmlStr = printCoord(coord, "&raquo; " + trans.sp.all.last + ": " + coord.x + "|" + coord.y);
                    htmlStr += " &nbsp; <span id=lastVilTime>" + dist.html + "</span>";
                    $("#units_form").append(htmlStr);
                  }

                  // Add target village
                  var targetVillage = getVillageFromCoords(spTargetVillageCookie());
                  if (targetVillage.isValid) {
                    dist = getDistance(targetVillage.x, vilHome.x, targetVillage.y, vilHome.y, speedCookie);
                    $("#units_form").append("<br>" + printCoord(targetVillage, "&raquo; " + trans.sp.all.target + ": " + targetVillage.x + "|" + targetVillage.y) + " &nbsp;<span id=targetVilTime>" + dist.html + "</span>");
                  }
                } catch (e) { handleException(e, "place-lastandtargetvillage"); }
              }());
              (function() {
                try {
                  // Read troops available
                  var units = [];
                  units.total = 0;
                  $("#units_form .unitsInput").each(function () {
                    var amount = $(this).next().text().substr(1);
                    units[this.name] = parseInt(amount.replace(")", ""), 10);
                    units.total += units[this.name] * world_data.unitsSize['unit_'+this.name];
                  });

                  // Add extra links next to "All troops"
                  function createRallyPointScript(linksContainer, unitLoop, name, min, checkFunction, tag) {
                    send = {};
                    $.each(unitLoop, function (i, v) {
                      if (units[v] >= min) {
                        send[v] = checkFunction(units[v], v, tag);
                      }
                    });
                    linksContainer.append("&nbsp; &nbsp;<a href='#' onclick='" + fillRallyPoint(send) + "; return false'>" + name + "</a>");
                  }

                  var villageType = calcTroops(units);
                  var linksContainer = $('#selectAllUnits').parent().attr("colspan", 4);

                  // add fake attack
                  var minFake = 0;
                  if (world_config.hasMinFakeLimit) {
                    minFake = getBuildingPoints();
                    minFake *= world_config.minFake;
                    if (units.ram > 0) {
                      minFake -= world_data.unitsSize['unit_ram'];
                    }
                  }

                  if (user_data.place.attackLinks.fakePlaceLink && units['total'] >= minFake) {
                    createRallyPointScript(linksContainer, world_data.units, user_data.place.attackLinks.fakePlaceLinkName, 0, function (amount, v, tag) {
                      if ((v == 'ram' || v == 'catapult') && !tag.rammed && amount > 0) {
                        tag.rammed = true;
                        return 1;
                      }

                      if (v == 'snob' || tag.toSend <= 0 || amount == 0) {
                        return 0;
                      }

                      if (user_data.place.attackLinks.fakePlaceExcludeTroops.indexOf(v) > -1) {
                        return 0;
                      }

                      var farmSize = world_data.unitsSize['unit_' + v];
                      if (amount * farmSize > tag.toSend) {
                        amount = Math.ceil(tag.toSend / farmSize);
                      }
                      tag.toSend -= amount * farmSize;
                      if (v == 'sword' && amount > 0) {
                        tag.toSend++;
                        amount--;
                      }

                      return amount;
                    }, { toSend: minFake, rammed: false });
                  }

                  if (units['total'] > 0)
                    $.each(user_data.place.customPlaceLinks, function (i, v) {
                      if (v.active && villageType.isMatch(v.type)) {
                        // villageType: off, def, all
                        if (v.required == undefined || units[v.required[0]] >= v.required[1]) {
                          // requires certain amount of troops
                          if (v.totalPop == undefined) {
                            // work with absolute numbers
                            createRallyPointScript(linksContainer, world_data.units, v.name, 0, function (amount, unitVal, tag) {
                              //q(v + ' - SEND:' + tag[v] + '; amount=' + amount + ';');
                              var send = tag[unitVal];
                              if (send != undefined && amount > 0) {
                                //q("send: " + send + " // amount: " + amount + " // unitVal: " + unitVal);
                                if (send < 0) {
                                  send = amount + send;
                                  if (send < 0) {
                                    send = 1;
                                  }
                                }
                                if ((amount - send) * world_data.unitsSize['unit_' + unitVal] < tag.sendAlong) {
                                  send = amount;
                                }
                                if (send > 0 && !tag.ignoreNobles) {
                                  $.each(user_data.place.attackLinks.nobleSupport, function (i, val) {
                                    if (unitVal == val.unit && villageType.isMatch(val.villageType)) {
                                      send -= Math.ceil(units.snob * val.amount);
                                    }
                                  });
                                }
                                //if (unitVal == 'light') q(send);

                                if (send > amount) {
                                  return amount;
                                }
                                if (send > 0) {
                                  return send;
                                }
                              }
                              return 0;
                            }, v);

                          } else { // do automatic calculation which division of troops to select
                            ////{ active: true, type: 'def', name: 'HelftZc', totalPop: 10000, divideOver: ['spear', 'heavy'] },
                            // TODO this doesn't yet work, does it?
                            // Probably not active...
                            var totalPop = 0;
                            $.each(v.divideOver, function (i, val) { totalPop += units[val] * world_data.unitsSize['unit_' + val]; });

                            createRallyPointScript(linksContainer, world_data.units, v.name, 0, function (amount, unitVal, tag) {
                              if ($.inArray(unitVal, tag.divideOver) == -1) {
                                return 0;
                              }
                              if (totalPop < tag.totalPop) {
                                return amount;
                              }

                              var currentUnitPercentage = (amount * world_data.unitsSize['unit_' + unitVal]) / totalPop;
                              return Math.floor(amount * currentUnitPercentage);
                            }, v);
                          }
                        }
                      }
                    });

                  if (units.spy >= user_data.place.attackLinks.scoutVillage && user_data.place.attackLinks.scoutPlaceLinks != null && user_data.place.attackLinks.scoutPlaceLinks.length > 0) {
                    $.each(user_data.place.attackLinks.scoutPlaceLinks, function (i, v) {
                      if (units.spy >= v) {
                        createRallyPointScript(linksContainer, ["spy"], user_data.place.attackLinks.scoutPlaceLinksName.replace("{amount}", v), 0, function (amount, v, tag) {
                          return tag;
                        }, v);
                      }
                    });
                  }

                  if (units.snob > 0 && user_data.place.attackLinks.noblePlaceLink) {
                    if (user_data.place.attackLinks.noblePlaceLinkFirstName) {
                      createRallyPointScript(linksContainer, world_data.units, user_data.place.attackLinks.noblePlaceLinkFirstName, 0, function (amount, v, tag) {
                        if (v == 'snob') {
                          return 1;
                        }
                        if (tag > 0) {
                          var returned = null;
                          $.each(user_data.place.attackLinks.nobleSupport, function (i, val) {
                            if (v == val.unit && villageType.isMatch(val.villageType)) {
                              returned = amount - Math.ceil((tag - 1) * val.amount);
                            }
                          });
                          if (returned != null) {
                            return returned;
                          }
                        }
                        return amount;
                      }, units.snob);
                    }

                    if (user_data.place.attackLinks.noblePlaceLinkSupportName && (units.snob > 1 || user_data.place.attackLinks.noblePlaceLinksForceShow)) {
                      createRallyPointScript(linksContainer, world_data.units, user_data.place.attackLinks.noblePlaceLinkSupportName, 0, function (amount, v, tag) {
                        if (v == 'snob') {
                          return 1;
                        }
                        var returned = 0;
                        $.each(user_data.place.attackLinks.nobleSupport, function (i, val) {
                          if (v == val.unit && villageType.isMatch(val.villageType)) {
                            returned = Math.ceil(1 * val.amount);
                          }
                        });
                        return returned;
                      });
                    }

                    if (units.snob > 0 && user_data.place.attackLinks.noblePlaceLinkDivideName) {
                      createRallyPointScript(linksContainer, world_data.units, user_data.place.attackLinks.noblePlaceLinkDivideName, 0, function (amount, v, tag) {
                        if (v == 'snob') {
                          return 1;
                        }
                        if (v == 'catapult') {
                          return 0;
                        }
                        if (v == 'ram' && !user_data.place.attackLinks.noblePlaceLinkDivideAddRam) {
                          return 0;
                        }
                        return Math.floor(amount / units.snob);
                      });
                    }
                  }
                } catch (e) { handleException(e, "place-extratrooplinks"); }
              }());

            } catch (e) { handleException(e, "place-place"); }
            //console.timeEnd("place-place");
          }());
        }
        break;

      case "overview_villages":
        break;
    }

    // USERPROFIEL++ // INFO_ ALLY/PLAYER
    if ((current_page.screen === 'info_ally' || current_page.screen === 'info_player' || current_page.screen === 'info_village')
      || (current_page.screen === "ally" && current_page.mode === "profile")) {

      (function() {
        try {
          var tables = $('table.vis', content_value),
            villageInfoTable = tables.first(),
            commandsTable = villageInfoTable.next('table'),
            profile = user_data.profile,
            i;

          if (game_data.player.premium && location.href.indexOf('screen=info_village') > -1) {
            // extra links on the village overview page
            var createFilterLink = function(baseLink, settings) {
              var link = baseLink + "&group=" + settings.group + "&sort=" + settings.sort + "&changeSpeed=" + settings.changeSpeed;

              if (settings.filter.active) {
                link += "&unit=" + settings.filter.unit + "&amount=" + settings.filter.amount;
              }

              var fancyIcon = settings.icon ? "<img src='" + settings.icon + "'>" : "";
              return "<a href='" + link + "'>" + fancyIcon + settings.name + "</a>";
            };

            for (i = 0; i < user_data.villageInfo4.length; i++) {
              var currentPairInfo = user_data.villageInfo4[i];
              if (currentPairInfo.active) {
                var id = villageInfoTable.find("td:eq(2)").text(),
                  link = getUrlString(
                      "&screen=overview_villages&type=own_home&mode=units&page=-1&targetvillage="
                      + id.substr(id.lastIndexOf("=") + 1));

                commandsTable.find("tbody:first").append(
                    "<tr><td>" + createFilterLink(link, currentPairInfo.off_link) + "</td>"
                    + "<td>" + createFilterLink(link, currentPairInfo.def_link) + "</td><tr>");
              }
            }
          }

          if (user_data.profile.show && (location.href.indexOf('screen=info_village') == -1 || user_data.showPlayerProfileOnVillage)) {
            var screen;
            var mapProfile = user_data.profile.mapLink;
            var isVillage = false;
            if (current_page.screen !== 'info_ally' && current_page.screen !== "ally") {
              // player and village info page
              // Extra links and info in table at the left top
              screen = "player";
              if (user_data.proStyle) {
                $("td:first", content_value).closest('table').hasClass('modemenu')
                  ? $(content_value).find('table:has("#villages_list") td:first').css("width", "40%").next().css("width", "60%")
                  : $("td:first", content_value).css("width", "40%").next().css("width", "60%");
              }

              if (current_page.screen === 'info_player') {
                // player info page
                id = commandsTable.find("a[href*='screen=mail']").attr("href");

                if (id == undefined) {
                  id = game_data.player.id;
                } else {
                  id = id.substr(id.indexOf("&player=") + 8);
                  //alert(id);
                  if (id.indexOf("&") > -1) {
                    id = id.substr(0, id.indexOf("&"));
                  }
                }
              } else {
                // village info page
                isVillage = true;
                commandsTable = $("table.vis:first", content_value);
                id = commandsTable.find("tr:eq(3) a");
                //assert(id.size() == 1, "player id not found on info_village page");
                if (id.size() > 0) {
                  id = id.attr("href").match(/id=(\d+)/)[1];
                  assert(!!id, "player id href is not set");
                } else {
                  id = 0;
                }
              }

              // Direct link to TW Stats map
              if (id > 0 && profile.mapLink.show) {
                var link = "http://" + game_data.market + ".twstats.com/" + game_data.world + "/index.php?page=map";
                var tribeId = commandsTable.prev('table').find("td:eq(8) a");
                //assert(tribeId.size() == 1, "tribe id not found"); // Not everyone is in a tribe
                if (tribeId.size() == 1) {
                  tribeId = tribeId.attr("href").match(/id=(\d+)/)[1];
                  assert(!isNaN(tribeId), "tribe id is not a number");
                } else tribeId = 0;

                if (mapProfile.tribeColor != null) {
                  link += "&tribe_0_id=" + tribeId + "&tribe_0_colour=" + mapProfile.tribeColor.substr(1);
                }
                if (mapProfile.yourTribeColor != null && game_data.player.ally_id != tribeId && game_data.player.ally_id > 0) {
                  link += "&tribe_1_id=" + game_data.player.ally_id + "&tribe_1_colour=" + mapProfile.yourTribeColor.substr(1);
                }
                link += "&player_0_id=" + id + "&player_0_colour=" + mapProfile.playerColor.substr(1);
                link += "&grid=" + (mapProfile.grid ? 1 : 0) + "&fill=" + mapProfile.fill.substr(1) + "&zoom=" + mapProfile.zoom + "&centrex=" + mapProfile.centreX + "&centrey=" + mapProfile.centreY;
                if (mapProfile.markedOnly) {
                  link += "&nocache=1";
                }
                if (mapProfile.bigMarkers) {
                  link += "&bm=1";
                }
                if (mapProfile.gridContinentNumbers) {
                  link += "&kn=1";
                }
                if (mapProfile.ownColor != null && game_data.player.id != id) {
                  link += "&player_1_id=" + game_data.player.id + "&player_1_colour=" + mapProfile.ownColor.substr(1);
                }
                commandsTable.find("tr:last").after("<tr><td colspan=2><a href='" + link + "' target='_blank'>&raquo; " + trans.sp.profile.twStatsMap + "</a> " + trans.sp.profile.externalPage + "</td></tr>");
              }

              if (!isVillage) {
                // Amount of villages
                if (user_data.proStyle) {
                  // always show villagename on one line
                  var colWidth = $("table:eq(2) th", content_value);
                  colWidth.first().css("width", "98%");
                  colWidth.eq(1).css("width", "1%");
                  colWidth.eq(2).css("width", "1%");
                }

                var amountOfVillages = tables.eq(2).find("th:first").text();
                amountOfVillages = amountOfVillages.substr(amountOfVillages.indexOf("(") + 1);
                amountOfVillages = amountOfVillages.substr(0, amountOfVillages.length - 1);
                commandsTable.prev('table').find("tr:eq(2)").after("<tr><td>" + trans.sp.profile.villages + "</td><td>" + formatNumber(amountOfVillages) + "</td></tr>");
              }
            } else {
              screen = "tribe";
              if (current_page.screen === 'info_ally') {
                commandsTable = tables.eq(0);
              }
              id = commandsTable.find("a");
              id = id.last().attr("href").match(/id=(\d+)&/)[1];

              var link = "http://" + game_data.market + ".twstats.com/" + game_data.world + "/index.php?page=map";
              link += "&tribe_0_id=" + id + "&tribe_0_colour=" + mapProfile.tribeColor.substr(1);
              link += "&centrex=" + mapProfile.centreX + "&centrey=" + mapProfile.centreY;
              if (mapProfile.yourTribeColor != null && game_data.player.ally_id != id) {
                link += "&tribe_1_id=" + game_data.player.ally_id + "&tribe_1_colour=" + mapProfile.yourTribeColor.substr(1);
              }
              link += "&grid=" + (mapProfile.grid ? 1 : 0) + "&fill=" + mapProfile.fill.substr(1) + "&zoom=" + mapProfile.zoom
              if (mapProfile.markedOnly) {
                link += "&nocache=1";
              }
              if (mapProfile.bigMarkers) {
                link += "&bm=1";
              }
              if (mapProfile.gridContinentNumbers) {
                link += "&kn=1";
              }
              if (mapProfile.ownColor != null) {
                link += "&player_0_id=" + game_data.player.id + "&player_0_colour=" + mapProfile.ownColor.substr(1);
              }
              commandsTable.find("tr:last").before("<tr><td colspan=2><a href='" + link + "' target='_blank'>&raquo; " + trans.sp.profile.twStatsMap + "</a> " + trans.sp.profile.externalPage + "</td></tr>");
            }

            // Build graphs
            if (id > 0) {
              var html = "";

              // TWMap graphs
              var twMapGraphs;
              if (screen == "tribe") {
                twMapGraphs = [["tribe", trans.sp.profile.graphTWMap], ["p_tribe", trans.sp.profile.graphPoints], ["oda_tribe", trans.sp.profile.graphODA], ["odd_tribe", trans.sp.profile.graphODD]];
              } else {
                twMapGraphs = [["player", trans.sp.profile.graphTWMap], ["p_player", trans.sp.profile.graphPoints], ["oda_player", trans.sp.profile.graphODA], ["odd_player", trans.sp.profile.graphODD]];
              }
              for (var i = 0; i < twMapGraphs.length; i++) {
                var graphDetails = screen == "tribe" ? profile.twMapTribeGraph[twMapGraphs[i][0]] : profile.twMapPlayerGraph[twMapGraphs[i][0]];
                if (graphDetails[0]) {
                  html += createSpoiler(twMapGraphs[i][1], '<img src="http://' + game_data.world + '.tribalwarsmap.com/' + game_data.market + '/graph/' + twMapGraphs[i][0] + '/' + id + '" title="' + trans.sp.profile.graphTWMap + '">', graphDetails[1]);
                }
              }

              // TWStats graphs
              var graphs = [["points", trans.sp.profile.graphPoints], ["villages", trans.sp.profile.graphVillages], ["od", trans.sp.profile.graphOD], ["oda", trans.sp.profile.graphODA], ["odd", trans.sp.profile.graphODD], ["rank", trans.sp.profile.graphRank]];
              if (screen == "tribe") {
                graphs.push(["members", trans.sp.profile.graphMembers]);
              }
              var toShow = screen == "tribe" ? profile.tribeGraph : profile.playerGraph;
              for (var i = 0; i < graphs.length; i++) {
                if (toShow[i][1]) {
                  var graphType = toShow[i][1] == 'big' ? 'ss' : '';
                  html += createSpoiler(graphs[i][1], '<img src="http://' + game_data.market + '.twstats.com/image.php?type=' + screen + graphType + 'graph&id=' + id + '&s=' + game_data.world + '&graph=' + graphs[i][0] + '">', toShow[i][2] != undefined);
                }
              }

              // Show graphs
              if (html.length > 0) {
                var pictureTable;
                if (screen == 'player' || (isVillage && user_data.showPlayerProfileOnVillage)) {
                  pictureTable = $(content_value).find('table:has("th:first:contains(Profiel)")'); // TODO: untranslated resource Profiel
                  if (isVillage || pictureTable.html() == null) {
                    // With no info nor personal text
                    pictureTable = $("<table class='vis' width='100%'><tr><th colspan='2'>" + trans.tw.profile.title + "</th></tr></table>");
                    $("td:first", content_value).closest('table').hasClass('modemenu') ? $(content_value).find('table:has("#villages_list") td:first').next().prepend(pictureTable) : $("td:first", content_value).next().prepend(pictureTable);
                  } else if (pictureTable.find("th").text() != trans.tw.profile.title) {
                    // TODO: There is a ; after the IF, is that the intention???
                    if (pictureTable.find("th:first").text() == trans.tw.profile.awardsWon);
                    pictureTable = pictureTable.parent();

                    // If there is only the node "Personal info"
                    var temp = $("<table class='vis' width='100%'><tr><th colspan='2'>" + trans.tw.profile.title + "</th></tr></table>");
                    pictureTable.prepend(temp);
                    pictureTable = temp;
                  }

                  if (pictureTable.find("td[colspan=2]").size() > 0) {
                    pictureTable.find("tr:last").before("<tr><td colspan=2>" + html + "</td></tr>");
                  } else {
                    pictureTable.find("tr:last").after("<tr><td colspan=2>" + html + "</td></tr>");
                  }
                } else {
                  commandsTable.after("<table class=vis width='100%'><tr><th>" + trans.tw.profile.title + "</th></tr><tr><td>" + html + "</td></tr></table>");
                }
              }
            }

            // Conquers (intern)
            if (id > 0 && profile.popup.show) {
              var twLink = 'http://' + game_data.market + '.twstats.com/' + game_data.world + '/index.php?page=' + screen + '&mode=conquers&id=' + id + '&pn=1&type=1&enemy=-1&enemyt=-1&min=&max=';
              var conquers = "<tr><td colspan=2><a href=\"\" id='conquers'>&raquo; " + trans.sp.profile.conquers + "</a> " + trans.sp.profile.internalPage + "</td></tr>";
              if (screen == 'tribe') {
                commandsTable.find("tr:last").before(conquers);
              } else {
                commandsTable.find("tr:last").after(conquers);
              }
              var popupWidth = profile.popup.width;
              var popupHeight = profile.popup.height;
              commandsTable.after('<div class="messagepop pop" id="popup" style="display: none"><iframe src=' + twLink + ' width=' + popupWidth + ' height=' + popupHeight + '></div>');
              $("#popup").css({ "left": profile.popup.left, "top": profile.popup.top, "background-color": "#FFFFFF", "border": "1px solid #999999", "position": "absolute", "width": popupWidth, "height": popupHeight, "z-index": 50, "padding": "25px 25px 20px" });

              $(function () {
                $("#conquers").on('click', function (event) {
                  if ($(this).hasClass('selected')) {
                    $("#conquers").removeClass("selected");
                  } else {
                    $(this).addClass("selected");
                  }
                  $("#popup").toggle();
                  return false;
                });

                $("#popup").on('click', function () {
                  $("#popup").hide();
                  $("#conquers").removeClass("selected");
                  return false;
                });
              });
            }
          }

          if (current_page.screen === 'info_village' && user_data.proStyle && profile.moveClaim) {
            // move claim to a position that does not interfere with more important links (2-click behavior)
            if ($("td:eq(8)", commandsTable).text() == trans.tw.profile.claimedBy) {
              commandsTable.append($("tr:eq(5),tr:eq(6)", commandsTable));
            }
          }
        } catch (e) { handleException(e, "info_villageplayertribe"); }
      }());
    }
    if (current_page.screen === 'info_village') {
      //Written by hardcode
      (function() {
        var show = true;
        var head = $(".vis:contains('Aankomend')", content_value).find("tr:first");
        var text = $("th:contains('Aankomst:')", content_value).html('Aankomend: <img src="http://nlp1.tribalwars.nl/graphic/minus.png" style=" float: right;">');

        head.on("click", function () {
          if(show === true) {
            $(".no_ignored_command").hide();
            text.html('Verborgen: <img src="http://nlp1.tribalwars.nl/graphic/plus.png" style=" float: right;">');
            show = false;
          }else{
            $(".no_ignored_command").show();
            text.html('Aankomend: <img src="http://nlp1.tribalwars.nl/graphic/minus.png" style=" float: right;">');
            show = true;
          }
        });
      }());
    }

    // ALL OVERVIEW PAGES
    if (current_page.screen === 'overview_villages') {
      var overviewTable;
      //tableHandler.overviewTable

      var tableHandler;
      (function (tableHandler) {
        function init(id, options) {
          tableHandler.overviewTableName = id;
          tableHandler.overviewTable = $("#" + id);
          tableHandler.settings = {
            hasBottomTotalRow: false

          };
          tableHandler.settings = $.extend({}, tableHandler.settings, options || {});

          // do stuff on page load
          ajaxLoadNextPageSetup();
        }
        tableHandler.init = init;

        function getReplacedVillageRows(page) {
          var overviewTable = typeof page === 'undefined' ? tableHandler.overviewTable : $("#"+tableHandler.overviewTableName, page);
          if (typeof tableHandler.settings.rowReplacer === "function") {
            var newTable = "";
            var villageRows = selectVillageRows(overviewTable);
            villageRows.each(function () {
              var row = $(this);
              newTable += tableHandler.settings.rowReplacer(row);
            });
            return newTable;
          } else {
            return selectVillageRows(overviewTable);
          }
        }
        tableHandler.getReplacedVillageRows = getReplacedVillageRows;

        function selectVillageRows(page) {
          //q(tableHandler.overviewTableName);
          //q("grrrr:"+page.find("tr").not(":first").length);
          var villageRows = page.find("tr").not(":first");
          if (tableHandler.settings.hasBottomTotalRow) {
            villageRows = villageRows.not(":last");
          }
          //q(villageRows);
          return villageRows;
        }

        function ajaxLoadNextPageSetup() {
          if (server_settings.ajaxAllowed) {
            var nextPageLink = $("#paged_view_content a.paged-nav-item").first();
            if (nextPageLink.length !== 0) {
              // find all pages we can still add to the current table
              var currentPageLabel = nextPageLink.parent().find("strong");
              var nextPageLinks = [];
              currentPageLabel = currentPageLabel.next();
              while (currentPageLabel.text().match(/\d/)) {
                nextPageLinks.push(currentPageLabel);
                currentPageLabel = currentPageLabel.next();
              }

              if (nextPageLinks.length > 0) {
                nextPageLink.parent().append("&nbsp; <a href=# id=loadNextPage>"+trans.sp.overviews.loadNextPage+"</a>");

                $("#loadNextPage").click(function() {
                  // Get next page or remove link
                  var nextPageUrl = nextPageLinks[0];
                  if (nextPageLinks.length == 1) {
                    $(this).replaceWith("<strong>"+trans.sp.overviews.loadNextPage+"</strong>");
                  }
                  nextPageLinks.shift();

                  // Fetch and insert next page
                  ajax(nextPageUrl.attr("href"), function (page) {
                    var nextPageRows = getReplacedVillageRows($(page));
                    if (tableHandler.settings.hasBottomTotalRow) {
                      tableHandler.overviewTable.find("tr:last").before(nextPageRows);
                    } else {
                      tableHandler.overviewTable.append(nextPageRows);
                    }

                    nextPageUrl.replaceWith("<strong>"+nextPageUrl.text()+"</strong>");
                  });
                });
              }
            }
          }
        }
      })(tableHandler || (tableHandler = {}));

      // PRODUCTION OVERVIEW
      if (location.href.indexOf('mode=prod') > -1) {
        (function() {
          //console.time("overview-prod");
          try {
            overviewTable = $("#production_table");
            tableHandler.init("production_table");

            // Filter full storage rooms
            var resTable = $("#production_table");
            var menu = "<table class='vis' width='100%'>";
            menu += "<tr><th width='99%'>";
            menu += " <input type=checkbox id=resFilter " + (user_data.resources.filterRows ? "checked" : "") + "> " + trans.sp.prodOverview.filter + " ";
            menu += "&nbsp;<input type=button id=resStorageFull value='" + trans.sp.prodOverview.filterFullGS + "' title=''>&nbsp; &nbsp; ";
            menu += "<select id=resAmountType><option value=1>" + trans.sp.all.more + "</option>";
            menu += "<option value=-1>" + trans.sp.all.less + "</option></select>";
            menu += "<input type=text id=resAmount size=6 value=" + user_data.resources.requiredResDefault + ">";
            menu += " <input type=button class=resFilter value='" + trans.tw.all.wood + "' resIndex=0><input type=button class=resFilter value='" + trans.tw.all.stone + "' resIndex=1><input type=button class=resFilter value='" + trans.tw.all.iron + "' resIndex=2><input type=button class=resFilter value='" + trans.sp.all.all + "' resIndex=-1>";
            menu += " " + trans.sp.all.withText + " <input type=checkbox id=resMerchant " + (user_data.resources.filterMerchants ? "checked" : "") + " title='" + trans.sp.prodOverview.merchantTooltip + "'>";
            menu += "<input type=text id=resMerchantAmount size=2 value=" + user_data.resources.requiredMerchants + " title='" + trans.sp.prodOverview.merchantAmountTooltip + "'> " + trans.sp.all.merchants + " ";

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=button id=resBBCode value='" + trans.sp.prodOverview.bbCodes + "'> "
              + "<input type=checkbox id=resBBCodeImages> " + trans.sp.prodOverview.bbCodesInfo + "&nbsp; ";
            menu += "</th></tr></table>";
            resTable.before(menu);

            $("#resFilter").change(function () {
              var isCheck = $(this).is(":checked");
              $("#resFilter").attr("title", isCheck ? trans.sp.prodOverview.filterTooltip : trans.sp.prodOverview.filterTooltipReverse);
              $("#resStorageFull").attr("title", isCheck ? trans.sp.prodOverview.filterFullGSTooltip : trans.sp.prodOverview.filterFullGSTooltipReverse);
              $(".resFilter").each(function (index, value) {
                if (index == 3) {
                  $(value).attr("title", isCheck ? trans.sp.prodOverview.filterAllTooltip : trans.sp.prodOverview.filterAllTooltipReverse);
                } else {
                  $(value).attr("title", isCheck ? trans.sp.prodOverview.filter1Tooltip.replace("{0}", $(value).attr("value")) : trans.sp.prodOverview.filter1TooltipReverse.replace("{0}", $(value).attr("value")));
                }
              });
            });

            $("#resFilter").change();

            $("#resStorageFull").click(function () {
              trackClickEvent("FilterFullRes");
              filterRes('full', $("#resFilter").is(":checked"));
            });

            $("#resBBCode").click(function () {
              trackClickEvent("BBCodeOutput");
              var bbs = filterRes("bbcode", false),
                reverse = $("#resAmountType").val() == "-1",
                bbCodesTitle = reverse ? trans.sp.prodOverview.tooLittleText : trans.sp.prodOverview.tooMuchText;

              bbCodesTitle = bbCodesTitle
                .replace("{diff}", parseInt(user_data.resources.bbcodeMinimumDiff / 1000, 10))
                .replace("{min}", parseInt(parseInt($("#resAmount").val(), 10) / 1000, 10));

              if ($("#textsArea").size() == 0) {
                $(this).parent().parent().parent().append("<tr><td colspan=2 id=textsArea></td></tr>");
              } else {
                $("#textsArea").html("");
              }

              $("#textsArea").append("<b>" + bbCodesTitle + "</b>" + trans.sp.prodOverview.bbCodeExtraInfo + "<br><textarea id=bbcodeArea cols=50 rows=10 wrap=off>");
              $("#bbcodeArea").val(bbs);

              $("#textsArea").append("<br><input type=button value='" + trans.sp.all.close + "' id=closeTextsArea>");
              $("#closeTextsArea").click(function() {
                $("#textsArea").parent().remove();
              });
            });

            function filterRes(resourceIndex, hideRows) {
              var resCode = [trans.tw.all.wood, trans.tw.all.stone, trans.tw.all.iron];
              var bbcodes = '';
              var goners = $();
              var stayers = $();
              var filterMerchants = $("#resMerchant").is(":checked");
              var filterMerchantsAmount = parseInt($("#resMerchantAmount").val(), 10);
              var minAmount = parseInt($("#resAmount").val(), 10);
              var reverse = $("#resAmountType").val() == "-1";
              var bbCodeImages = $("#resBBCodeImages").is(":checked");
              var minDif = user_data.resources.bbcodeMinimumDiff;
              var bbCodesTitle;

              if (reverse) {
                bbcodes = trans.sp.prodOverview.tooLittle + "\n";
                bbCodesTitle = trans.sp.prodOverview.tooLittleText;
              } else {
                bbcodes = trans.sp.prodOverview.tooMuch + "\n";
                bbCodesTitle = trans.sp.prodOverview.tooMuchText;
              }
              bbCodesTitle = bbCodesTitle.replace("{min}", minDif).replace("{diff}", minAmount);

              function doResource(resCell, resArray, resIndex, reverse, minAmount) {
                var resAmount = parseInt(resArray[resIndex], 10);
                if ((!reverse && resAmount > minAmount) || (reverse && resAmount < minAmount)) {
                  $("span[title]:eq(" + resIndex + ")", resCell).css("font-weight", "bold")
                  return false;
                }
                return true;
              }

              var hasNotes = $("th:first", resTable).text().indexOf(trans.tw.overview.village) == -1;
              resTable.find("tr:gt(0)").each(function () {
                var isOk = true;
                var resCell;
                if (hasNotes) {
                  resCell = $(this).find("td:eq(3)");
                } else {
                  resCell = $(this).find("td:eq(2)");
                }
                var resources = $.trim(resCell.text()).replace(/\./gi, "").split(" ");

                if (resourceIndex == 'bbcode') {
                  // All resources
                  var villageBBCode = '';
                  for (var i = 0; i < 3; i++) {
                    if ((!reverse && resources[i] - minDif > minAmount) || (reverse && parseInt(resources[i], 10) + parseInt(minDif, 10) < minAmount)) {
                      if (bbCodeImages) {
                        villageBBCode += "[img]http://www.tribalwars.nl/graphic/" + world_data.resources[i] + ".png[/img] ";
                      } else {
                        villageBBCode += resCode[i] + " ";
                      }
                      villageBBCode += parseInt(Math.abs(resources[i] - minAmount) / 1000, 10) + "k ";
                    }
                  }
                  if (villageBBCode.length > 0) {
                    var villageCell = $("td:eq(" + (hasNotes ? "1" : "0") + ") span:eq(1)", this);
                    bbcodes += "[village]" + getVillageFromCoords(villageCell.text()).coord + "[/village] " + villageBBCode + "\n";
                  }
                } else if (resourceIndex == 'full') {
                  // full storage rooms
                  if ($(".warn", this).size() > 0) {
                    resCell.css("background-color", user_data.resources.highlightColor);
                    isOk = false;
                  }

                } else {
                  // One specific resource
                  $("span[title]", resCell).css("font-weight", "normal");

                  if (resourceIndex == "-1") {
                    isOk = isOk && !(!doResource(resCell, resources, 0, reverse, minAmount)
                      | !doResource(resCell, resources, 1, reverse, minAmount)
                      | !doResource(resCell, resources, 2, reverse, minAmount));
                  } else {
                    isOk = isOk && doResource(resCell, resources, resourceIndex, reverse, minAmount);
                  }

                  if (!isOk) {
                    resCell.css("background-color", user_data.resources.highlightColor);
                  } else {
                    resCell.css("background-color", "");
                  }

                  if (filterMerchants) {
                    resCell = $(this).find("td:eq(4)");
                    if (hasNotes) {
                      resCell = resCell.next();
                    }
                    var merchants = resCell.text();
                    merchants = merchants.substr(0, merchants.indexOf("/"));
                    if (merchants < filterMerchantsAmount) {
                      resCell.css("background-color", user_data.colors.error);
                    } else {
                      resCell.css("background-color", "");
                    }
                  }
                }

                if (hideRows && isOk) {
                  goners = goners.add($(this));

                  // Village rename script will not rename villages if the hidden rename inputfield is on a hidden row
                  // --> People were using our script to filter the village list and then use a mass village renamer which also renamed the hidden village rows
                  $("input:first", $(this)).val("");

                }
                else if (!$(this).is(":visible")) {
                  stayers = stayers.add($(this));
                }
              });
              if (hideRows) {
                goners.remove();
                var amountOfVillagesCell = $("tr:first th", resTable).eq(hasNotes ? 1 : 0);
                amountOfVillagesCell.text(amountOfVillagesCell.text().replace(/\d+/, $("tr", resTable).size() - 1));
              } else {
                stayers.show();
                goners.hide();
              }

              return bbcodes;
            }

            $(".resFilter").click(function () {
              trackClickEvent("FilterResource");
              filterRes($(this).attr("resIndex"), $("#resFilter").is(":checked"));
            });
          } catch (e) { handleException(e, "overview-prod"); }
          //console.timeEnd("overview-prod");
        }());
      }
      // TROOPS OVERVIEW
      else if (location.href.indexOf('mode=units') > -1
        && (location.href.indexOf('type=own_home') > -1 || location.href.indexOf('type=there') > -1)) {
        (function() {
          //console.time("overview-thereownhome");
          try {
            var villageCounter = 0;
            var rowSize = world_data.units.length + 1;
            if (world_config.hasMilitia) {
              rowSize++;
            }

            var overviewMenuRowFilter = "tr:gt(0)",
              /**
               * Page speed can be overruled by the querystring
               */
              currentPageSpeed = spSpeedCookie(),
              /**
               * {village} object from target cookie (or by url querystring set)
               */
              target;

            /**
             * Do initial filter? (based on querystring)
             */
            var doFilter = false,
              unitIndex = world_data.units.indexOf(user_data.command.filterMinDefaultType),
              unitAmount = user_data.command.filterMinDefault,
              sort = false,
              changeSpeed = false,
              i;
            var search = window.location.search.substring(1).split("&");
            for (i = 0; i < search.length; i++) {
              var item = search[i].split("=");
              switch (item[0]) {
                case 'unit':
                  doFilter = true;
                  unitIndex = world_data.units.indexOf(item[1]);
                  break;
                case 'amount':
                  doFilter = true;
                  unitAmount = parseInt(item[1], 10);
                  break;
                case 'changeSpeed':
                  changeSpeed = item[1];
                  if (changeSpeed != false) {
                    //spSpeedCookie(changeSpeed);
                    currentPageSpeed = changeSpeed;
                  }
                  break;

                case 'targetvillage':
                  var newTargetVillage = getVillageFromCoords(item[1]);
                  spTargetVillageCookie(newTargetVillage.coord);
                  break;

                case 'sort':
                  sort = item[1] == "true";
                  break;
              }
            }

            // Sangu package menu is also built in reinitialize_table
            /**
             * Creates a select box with all unit types in this world
             * @param {string} id the DOM ID
             * @param {string} select the currently selected unit
             */
            function makeUnitBox(id, select) {
              var box = "<select id=" + id + ">";
              $.each(world_data.units, function (i, v) {
                box += "<option value=" + i + (v == select ? " selected" : "") + ">" + trans.tw.units.names[v] + "</option>";
              });
              box += "</select>";
              return box;
            }

            var menu = "<table width='100%' class='vis'>";
            menu += "<tr>";
            menu += "<th nowrap width='1%'>";
            menu += "<input type=text size=5 id=filterAxeValue value='" + user_data.command.filterMinDefault + "'>";
            menu += makeUnitBox("filterAxeType", user_data.command.filterMinDefaultType);
            menu += "<input type=button id=filterAxe value='" + trans.sp.troopOverview.filterTroops + "'";
            menu += " title='" + trans.sp.troopOverview.filterTroopsTooltip + "'> ";

            menu += "</th><th nowrap width='1%'>";

            menu += "<select id=filterPopValueType><option value=1>" + trans.sp.all.more + "</option>";
            menu += "<option value=-1>" + trans.sp.all.less + "</option></select>";
            menu += "<input type=text size=5 id=filterPopValue value='" + user_data.command.filterMinPopulation + "'>";
            menu += "<input type=button id=filterPop value='" + trans.sp.troopOverview.filterPopulation + "' title='" + trans.sp.troopOverview.filterPopulationTooltip + "'> ";

            menu += "</th><th nowrap width='1%'>";
            menu += "<input type=text size=5 id=filterWalkingTimeValue>";
            menu += "<input type=button id=filterWalkingTime value='" + trans.sp.troopOverview.filterWalkingTime + "' title='" + trans.sp.troopOverview.filterWalkingTimeTooltip + "'> ";

            menu += "</th><th width='95%'>";

            menu += "<input type=button id=snobFilter value='" + trans.sp.troopOverview.filterNoble + "' title='" + trans.sp.troopOverview.filterNobleTooltip + "'> &nbsp; ";
            menu += "<input type=button id=attackFilter value='" + trans.sp.troopOverview.filterUnderAttack + "' title='" + trans.sp.troopOverview.filterUnderAttackTooltip + "'> &nbsp; ";

            menu += "</th><th width='1%'>";

            menu += "<input type=button id=calculateStack value='" + trans.sp.troopOverview.calcStack + "' title='" + trans.sp.troopOverview.calcStackTooltip + "'>";
            menu += "</th>";

            menu += "</tr></table>";

            // second row
            menu += "<table><tr><th width='1%' nowrap>";
            menu += "<input type=checkbox id=defReverseFilter title='" + trans.sp.commands.filtersReverse + "'> " + trans.sp.commands.filtersReverseInfo + ": ";

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=text size=12 id=defFilterTextValue value=''>";
            menu += "<input type=button id=defFilterText value='" + trans.sp.commands.freeTextFilter + "'>";

            menu += "</th><th width='97%' nowrap>";
            menu += "<input type=textbox size=3 id=defFilterContinentText maxlength=2><input type=button id=defFilterContinent value='" + trans.sp.commands.continentFilter + "'>";

            menu += "</th>";

            if (location.href.indexOf('type=there') > -1) {
              menu += "<th width='1%'><input type=button id=defRestack value='" + trans.sp.troopOverview.restack + "'></th>";
            }
            menu += "<th nowrap width='1%' style='padding-right: 8px; padding-top: 3px;'>";

            menu += "<input type=checkbox id=sortIt title='" + trans.sp.troopOverview.sortTooltip + "'"
              + (user_data.command.filterAutoSort ? " checked" : "") + "> "
              + trans.sp.troopOverview.sort;

            menu += "</th></tr>";
            menu += "</table>";

            // Sangu filter menu
            var sanguMenu = menu;

            // Overview table menu
            menu = "<tr id=units_table_header>";
            menu += "<th>" + trans.sp.troopOverview.village + "</th>";
            menu += "<th>" + trans.sp.troopOverview.nightBonus + "</th>";
            $.each(world_data.units, function (i, v) {
              menu += "<th><img src='/graphic/unit/unit_" + v + ".png' title=\"" + trans.sp.troopOverview.selectUnitSpeed.replace("{0}", trans.tw.units.names[v]) + "\" alt='' id=" + v + " /></th>";
            });
            if (world_config.hasMilitia) {
              menu += "<th><img src='/graphic/unit/unit_militia.png' title='" + trans.tw.units.militia + "' alt='' id=militia /></th>";
            }
            menu += "<th>" + trans.sp.troopOverview.commandTitle + "</th>";


            target = getVillageFromCoords(spTargetVillageCookie());
            menu += "<th nowrap>" + trans.sp.all.targetEx
              + " <input type=text id=targetVillage name=targetVillage size=8 value='"
              + (target.isValid ? target.coord : "") + "'>"
              + "<input type=button class='btn' id=targetVillageButton value='"
              + trans.sp.troopOverview.setTargetVillageButton + "'></th>";
            menu += "</tr>";






            // function to replace the village rows
            tableHandler.init("units_table", {
              rowReplacer: function (row) {
                //q($(row).html());
                var mod = "row_a";
                var newRow = "";
                var finalRow = "";
                var addThisRow = true;
                var cells = $("td:gt(0)", row);
                var units = {};
                var villageCell = $("td:first", row);
                var villageId = $("span.quickedit-vn", villageCell).attr("data-id");

                cells.each(function (index, element) {
                  if (doFilter && index - 1 == unitIndex && parseInt(this.innerHTML, 10) < unitAmount) {
                    //q("index:" + index + ' == '+ unitIndex + " : " + row.html() + ' * 1 < ' + unitAmount);
                    addThisRow = false;
                    return false;
                  }
                  else if (index == rowSize) {
                    //q(index + "==" + rowSize);
                    newRow += "<td>";
                    newRow += "<img src='/graphic/dots/red.png' title='" + trans.sp.troopOverview.removeVillage + "' style='margin-bottom: 2px' /> ";
                    //newRow += "<img src='http://cdn.tribalwars.net/graphic/delete_small.png' style='margin-bottom: 3px; position: relative' title='" + trans.sp.troopOverview.removeVillage + "' /> ";
                    newRow += "<a href='" + $("a", element).attr('href').replace("mode=units", "") + "&sanguX=0&sanguY=0' class='attackLinks'>";
                    newRow += "<img src='/graphic/command/attack.png' title='" + trans.sp.troopOverview.toThePlace + "' style='margin-bottom: 1px' />";
                    // Works only with leftclick onclick='this.src=\"/graphic/command/return.png\";'
                    newRow += "</a>";
                    newRow += "</td>";
                  } else {
                    //q("units:" + world_data.units[index - 1]);
                    var cellDisplay = this.innerHTML;
                    if (cellDisplay === "0") {
                      cellDisplay = "&nbsp;";
                    }
                    else if (cellDisplay.indexOf('="has_tooltip"') > -1)  {
                      cellDisplay = cellDisplay.replace('="has_tooltip"', '="has_tooltip" title="'+trans.sp.troopOverview.cheapNobles+'"');
                    }

                    newRow += "<td>" + cellDisplay + "</td>";
                    if (index > 0) {
                      units[world_data.units[index - 1]] = parseInt(element.innerHTML, 10);
                    }
                    // innerHTML can contain a + sign for the nobles: "+" indicates nobles can be rebuild cheaply
                    // The snobs are not important here
                  }
                });

                if (addThisRow) {
                  var villageType = calcTroops(units);
                  if (doFilter) {
                    mod = villageCounter % 2 == 0 ? "row_a" : "row_b";
                  } else {
                    mod = !villageType.isDef ? "row_a" : "row_b";
                  }

                  var coord = getVillageFromCoords(villageCell.text());

                  //finalRow += "<tbody>";
                  finalRow += "<tr arrival='0' data-coord-x='" + coord.x + "' data-coord-y='" + coord.y + "' "
                    + " class='row_marker " + mod + (game_data.village.id == villageId ? " selected" : "") + "'>";
                  finalRow += "<td>" + villageCell.html() + "</td>";
                  finalRow += newRow;
                  finalRow += "<td></td></tr>";
                  //finalRow += "</tbody>";

                  villageCounter++;

                  return finalRow;
                }
                return "";
              }
            });

            var newTable = tableHandler.getReplacedVillageRows();
            $("#units_table")
              .html("<table width='100%' class='vis' id='units_table' target='false'>" + menu + newTable + "</table>")
              .before(sanguMenu);


            // Tooltips
            $("#defReverseFilter").change( function () {
              var isChecked = $(this).is(":checked");
              var defTrans = trans.sp.troopOverview;

              $("#defFilterContinent").attr("title", isChecked ? defTrans.continentFilterTooltip : defTrans.continentFilterTooltipReverse);
              $("#defFilterText").attr("title", defTrans.freeTextFilterTooltip.replace("{filterType}", isChecked ? defTrans.freeTextFilterTooltipFilterTypeWith : defTrans.freeTextFilterTooltipFilterTypeWithout));
            });
            $("#defReverseFilter").change();


            // Initial focus on target inputbox
            $('#targetVillage').click(function () {
              $(this).focus().select();
            });



            // "Attacks per page" -> change to # villages in the list
            var pageSize = $("input[name='page_size']");
            var villageAmountCell = $("#units_table tr:first th:first");
            //assert(villageAmountCell.length === 1, "village cell Dorp (xxx) niet gevonden");
            villageAmountCell.text(villageAmountCell.text() + " (0)");
            function setVillageCount(amount) {
              pageSize.val(amount);
              villageAmountCell.text(villageAmountCell.text().replace(/\d+/, amount));
            }

            pageSize.parent().prev().text(trans.sp.overviews.totalVillages);
            setVillageCount(villageCounter);

            // Recalculate arrival times as the target village changes
            $("#targetVillageButton").click(function () {
              trackClickEvent("TargetVillageSet");
              var targetMatch = getVillageFromCoords($('#targetVillage').val(), true);
              $("#units_table").attr("target", targetMatch.isValid);
              if (!targetMatch.isValid) {
                spTargetVillageCookie("");
                alert(trans.sp.troopOverview.setTargetVillageButtonAlert);
                $("#targetVillage").focus();

              } else {
                $(".attackLinks", tableHandler.overviewTable).each(function() {
                  // add target coordinates to attack image href which are read in place
                  var hrefWithVillageCoords = $(this).attr("href");
                  hrefWithVillageCoords = hrefWithVillageCoords.replace(/sanguX=(\d+)&sanguY=(\d+)/, "sanguX="+targetMatch.x+"&sanguY="+targetMatch.y);
                  $(this).attr("href", hrefWithVillageCoords);
                });

                spTargetVillageCookie(targetMatch.coord);
                $("#units_table").find(overviewMenuRowFilter).each(function () {
                  var unitRow = $(this),
                    dist = getDistance(targetMatch.x, unitRow.attr("data-coord-x"), targetMatch.y, unitRow.attr("data-coord-y"), currentPageSpeed);

                  $("td:last", unitRow).html(dist.html);
                  $(this).attr("arrival", dist.travelTime);
                  if (dist.isNightBonus) {
                    $("td:eq(1)", unitRow).css("background-color", user_data.colors.error);
                  } else {
                    $("td:eq(1)", unitRow).css("background-color", '');
                  }
                });

                if ($("#sortIt").is(":checked")) {
                  $("#units_table").find(overviewMenuRowFilter).sortElements(function (a, b) {
                    return parseInt($(a).attr("arrival"), 10) > parseInt($(b).attr("arrival"), 10) ? 1 : -1;
                  });
                }
              }
            });

            // sort can be set with the querystring
            if (sort) {
              $("#targetVillageButton").click();
            }

            // delete a table row
            $("#units_table").mouseup(function (e) {
              if (e.target.nodeName === 'IMG') {
                if (e.target.title == trans.sp.troopOverview.removeVillage) {
                  setVillageCount(parseInt(pageSize.val(), 10) - 1);
                  $(e.target).parent().parent().remove();
                }
              }
            });

            // remove row or add border to command cell when middle mouse click (open in new tab)
            $(tableHandler.overviewTable).on("mousedown",".attackLinks", function(e) {
              if (e.which == 2) {
                var cell = $(e.target).parent().parent();
                if (user_data.command.middleMouseClickDeletesRow2) {
                  cell.parent().remove();
                } else {
                  cell.css("border", (parseInt(cell.css("border-width").substr(0, 1), 10) + 1) + "px red solid");
                }
              }
            });

            // Change active speed by clicking on a unit icon
            // ATTN: border style duplicated in trans.troopOverview.help
            $('#' + currentPageSpeed).parent().css("border", "2px green dotted");
            $('#' + spSpeedCookie()).parent().css("border", "3px red solid");
            $("#units_table_header").click(function (e) {
              if (e.target.nodeName === 'IMG' && e.target.id !== "militia") {
                currentPageSpeed = e.target.id;
                $("img", this).parent().css("border", "0px");
                $('#' + currentPageSpeed).parent().css("border", "2px green dotted");
                $('#' + spSpeedCookie()).parent().css("border", "3px red solid");
                $("#targetVillageButton").click();
              }
            });

            $("#units_table_header").dblclick(function (e) {
              if (e.target.nodeName === 'IMG' && e.target.id !== "militia") {
                currentPageSpeed = e.target.id;
                spSpeedCookie(e.target.id);
                $("img", this).parent().css("border", "0px");
                $('#' + currentPageSpeed).parent().css("border", "2px green dotted");
                $('#' + spSpeedCookie()).parent().css("border", "3px red solid");
                $("#targetVillageButton").click();
              }
            });
            function filterVillageRows(filterStrategy, options) {
              // return true to hidethe row; false keep row visible (without reverse filter checkbox)
              options = options || {
                allowFilter: true
              };
              var reverseFilter = options.allowFilter && $("#defReverseFilter").is(":checked"),
                goners = $(),
                villageCounter = 0;

              $("#units_table").find(overviewMenuRowFilter).each(function () {
                var self = $(this);
                if (!reverseFilter != !filterStrategy(self)) {
                  goners = goners.add(self);
                  $("input:eq(1)", self).val("");
                } else {
                  villageCounter++;
                }
              });
              goners.remove();

              // Show totals
              setVillageCount(villageCounter);
            }

            // CONTINENT FILTER
            $("#defFilterContinent").click(function () {
              trackClickEvent("FilterContinent");
              var continent = parseInt($("#defFilterContinentText").val(), 10);
              if (!isNaN(continent)) {
                filterVillageRows(function (row) {
                  var village = getVillageFromCoords(row.find("td:first").text());
                  if (!village.isValid ) {
                    return true;
                  }
                  return village.continent() != continent;
                });
              }
            });

            // TEXT FILTER
            $("#defFilterText").click(function () {
              trackClickEvent("FilterText");
              var compareTo = $("#defFilterTextValue").val().toLowerCase();
              if (compareTo.length > 0) {
                filterVillageRows(function (row) {
                  return row.text().toLowerCase().indexOf(compareTo) == -1;
                });
              }
            });

            // WALKINGTIME FILTER
            $("#filterWalkingTime").click(function () {
              var minWalkingTime = parseInt($("#filterWalkingTimeValue").val(), 10) * 60;

              if (!isNaN(minWalkingTime)) {
                trackClickEvent("WalkingTime");
                filterVillageRows(
                  function (row) {
                    return parseInt(row.attr("arrival"), 10) < minWalkingTime;
                  },
                  {
                    allowFilter: false
                  }
                );
              } else {
                alert(trans.sp.troopOverview.filterWalkingTimeTooltip);
              }
            });






            // Filter rows with less than x axemen (or another unit)
            $("#filterAxe").click(function () {
              trackClickEvent("FilterUnitAmount");
              var villageCounter = 0;
              var goners = $();
              var minAxeValue = parseInt($("#filterAxeValue").val(), 10);
              var unit = parseInt($('#filterAxeType').val(), 10);
              $("#units_table").find(overviewMenuRowFilter).each(function () {
                var val = $("td:eq(" + (unit + 2) + ")", this).html();
                if (val == '&nbsp;' || parseInt(val, 10) < minAxeValue) {
                  goners = goners.add($(this));
                  $("input:first", $(this)).val("");
                }
                else
                  villageCounter++;
              });
              goners.remove();
              setVillageCount(villageCounter);
            });
            // change by default selected unit the filter will be active for
            $("#filterAxeType").change(function () {
              var unit = world_data.units[$(this).val()];
              if (typeof user_data.command.filterMin[unit] !== 'undefined') {
                $("#filterAxeValue").val(user_data.command.filterMin[unit]);
              } else {
                $("#filterAxeValue").val(user_data.command.filterMinOther);
              }
            });



            // Filter rows without snobs/nobles
            $("#snobFilter").click(function () {
              trackClickEvent("FilterSnob");
              var villageCounter = 0;
              var goners = $();
              $("#units_table").find(overviewMenuRowFilter).each(function () {
                if ($.trim($("td:eq(" + (world_data.unitsPositionSize.length + 1) + ")", this).text()) === '') {
                  goners = goners.add($(this));
                  $("input:first", $(this)).val("");
                } else
                  villageCounter++;
              });
              goners.remove();
              setVillageCount(villageCounter);
            });

            // hide rows not under attack
            $("#attackFilter").click(function () {
              trackClickEvent("FilterUnderAttack");
              var villageCounter = 0;
              var goners = $();
              $("#units_table").find(overviewMenuRowFilter).each(function () {
                //q("'" + $(this).html() + "'");
                //q("---------------------------------------------------");
                if ($('td:first:not(:has(img[title=\'' + trans.tw.command.attack + '\']))', this).size() != 0) {
                  goners = goners.add($(this));
                  $("input:first", $(this)).val("");
                } else {
                  villageCounter++;
                }
              });
              goners.remove();
              setVillageCount(villageCounter);
            });

            // filter rows with less then x population
            $("#filterPop").click(function () {
              trackClickEvent("FilterFarm");
              $("#calculateStack").click();
              var villageCounter = 0;
              var goners = $();
              var min = parseInt($("#filterPopValue").val(), 10);
              var reverseFilter = $("#filterPopValueType").val() == "-1";
              $("#units_table").find(overviewMenuRowFilter).each(function () {
                var line = $(this);
                $("td:eq(1)", this).each(function () {
                  var amount = parseInt($(this).text().replace('.', ''), 10);
                  if ((!reverseFilter && amount < min) || (reverseFilter && amount > min)) {
                    goners = goners.add(line);
                    $("input:first", line).val("");
                  }
                  else villageCounter++;
                });
              });
              goners.remove();
              setVillageCount(villageCounter);
            });
            // One time help display
            (function() {
              if ($("#targetVillageButton").length === 0) {
                // group without villages
                return;
              }

              var position = $("#targetVillageButton").position(),
                options = {
                  left: position.left - 300,
                  top: position.top + 35
                },
                content = {
                  title: trans.sp.troopOverview.helpTitle,
                  body: trans.sp.troopOverview.help.replace("{unitIcon}", "<img src='graphic/unit/unit_ram.png'>, <img src='graphic/unit/unit_spear.png'>, ...")
                };

              createFixedTooltip("troopOverviewTooltip", content, options);
            }());

            // Calculate stack
            $("#calculateStack").click(function () {
              trackClickEvent("CalculateStack");
              if (!this.disabled) {
                this.disabled = true;
                $("#units_table").find(overviewMenuRowFilter).each(function () {
                  var total = 0;
                  $("td:gt(1)", this).each(function (i) {
                    if (!($.trim(this.innerHTML) == '' || this.innerHTML == '&nbsp;' || i >= world_data.unitsPositionSize.length)) {
                      total += this.innerHTML * world_data.unitsPositionSize[i];
                    }
                  });
                  $("td:eq(1)", this).text(formatNumber(total)).css("background-color", getStackColor(total));
                });
              }
            });
            // Calculate Restack BB codes
            if (location.href.indexOf('type=there') > -1) {
              $("#defRestack").click(function () {
                trackClickEvent("BBCodeOutput");
                $("#calculateStack").click();

                var request = "";
                $("#units_table").find(overviewMenuRowFilter).each(function () {
                  var total = parseInt($("td:eq(1)", $(this)).text().replace(/\./, ''), 10);
                  if (user_data.restack.to - total > user_data.restack.requiredDifference) {
                    var villageDesc = $(this).find("td:first span[data-text]").text(),
                      villageCoord = getVillageFromCoords(villageDesc);

                    request += "[village]" + villageCoord.coord + "[/village] (" + parseInt((user_data.restack.to - total) / 1000, 10) + "k)\n";
                  }
                });

                if ($("#textsArea").size() == 0) {
                  $(this).parent().parent().parent().append("<tr><td id=textsArea colspan=5></td></tr>");
                } else {
                  $("#textsArea").html("");
                }

                var title = trans.sp.troopOverview.restackTitle
                  .replace("{to}", parseInt(user_data.restack.to / 1000, 10))
                  .replace("{requiredDiff}", parseInt(user_data.restack.requiredDifference / 1000, 10));
                $("#textsArea").append(title + "<br><textarea cols=35 rows=10 id=defRestackArea>" + request + "</textarea>");

                $("#textsArea").append("<br><input type=button value='" + trans.sp.all.close + "' id=closeTextsArea>");
                $("#closeTextsArea").click(function() {
                  $("#textsArea").parent().remove();
                });
              });
            }

          } catch (e) { handleException(e, "overview-thereownhome"); }
          //console.timeEnd("overview-thereownhome");
        }());
      }
      // BUILDINGS OVERVIEW
      else if (location.href.indexOf('mode=buildings') > -1) {
        (function() {
          //console.time("overview-buildings");
          try {
            // Highlight everything not conform
            overviewTable = $("#buildings_table");
            tableHandler.init("buildings_table");

            var menu = "<table class='vis' width='100%'>";
            menu += "<tr><th>";
            menu += "<input type=checkbox id=buildingOpti> " + trans.sp.buildOverview.optimistic + " ";
            menu += "<input type=button id=buildingHighlight value='" + trans.sp.buildOverview.mark + "'>";
            menu += "<input type=button id=buildingFilter value='" + trans.sp.buildOverview.filter + "'>";
            menu += "</th></tr></table>";
            overviewTable.before(menu);

            function filterBuildings(cellAction, hideRows) {
              var buildings = [];
              overviewTable.find("tr:first img").each(function (i, v) {
                buildings[i] = this.src.substr(this.src.lastIndexOf('/') + 1);
                buildings[i] = buildings[i].substr(0, buildings[i].indexOf('.'));
              });

              var goners = $();
              var opti = $("#buildingOpti").is(":checked");
              overviewTable.find("tr:gt(0)").each(function () {
                var isOk = true;
                $(this).find("td:gt(3)").each(function (i, v) {
                  var range = user_data.buildings[buildings[i]];
                  if (range != undefined) {
                    var text = parseInt($(this).text(), 10);
                    if (text < range[0]) {
                      $(this).css("background-color", user_data.colors.error);
                      isOk = false;
                    } else if (text > range[1] && !opti) {
                      $(this).css("background-color", user_data.colors.good);
                      isOk = false;
                    } else
                      $(this).css("background-color", "");
                  }
                });
                if (hideRows && isOk) {
                  goners = goners.add($(this));
                  $("input:first", $(this)).val("");
                }
              });
              goners.remove();
            }

            $("#buildingHighlight").click(function () {
              trackClickEvent("TableHighlight");
              filterBuildings(function (cell, isOk) {
                cell.css("background-color", isOk ? "" : user_data.colors.neutral);
              }, false);
            });

            $("#buildingFilter").click(function () {
              trackClickEvent("TableRemove");
              filterBuildings(function (cell, isOk) {
                cell.css("background-color", isOk ? "" : user_data.colors.neutral);
              }, true);
            });
          } catch (e) { handleException(e, "overview-buildings"); }
          //console.timeEnd("overview-buildings");
        }());
      }
      // TECHS OVERVIEW // SMEDERIJ OVERVIEW // SMITHY OVERVIEW
      else if (location.href.indexOf('mode=tech') > -1) {
        (function() {
          //console.time("overview-techs");
          try {
            overviewTable = $("#techs_table");
            tableHandler.init("techs_table");

            // Highlight everything not conform usersettings
            if (world_config.smithyLevels) {
              var menu = "<table class='vis' width='100%'>";
              menu += "<tr><th>";
              menu += "<select id='groupType'>";
              $.each(user_data.smithy, function (i, v) {
                menu += "<option value=" + i + ">" + v[0] + "</option>";
              });
              menu += "</select>";
              menu += "<input type=checkbox id=buildingOpti> " + trans.sp.smithOverview.optimistic + " ";
              menu += "<input type=button id=smithyHighlight value='" + trans.sp.smithOverview.mark + "'>";
              menu += "<input type=button id=smithyFilter value='" + trans.sp.smithOverview.filter + "'>";
              menu += "</th></tr></table>";
              $("#techs_table").before(menu);

              function filterTechs(cellAction, hideRows) {
                var goners = $();
                var opti = $("#buildingOpti").is(":checked");
                var def = user_data.smithy[$("#groupType").val()][1];
                $("#techs_table").find("tr:gt(0)").each(function () {
                  var isOk = true;
                  $(this).find("td:gt(2)").each(function (i, v) {
                    var range = def[world_data.units[i]];
                    if (i < world_data.units.length && range != undefined) {
                      var text = parseInt($(this).text(), 10);
                      if (text == '') {
                        text = 0;
                      }
                      if (text < range[0]) {
                        $(this).css("background-color", user_data.colors.error);
                        isOk = false;
                      }
                      else if (text > range[1] && !opti) {
                        $(this).css("background-color", user_data.colors.good);
                        isOk = false;
                      } else {
                        $(this).css("background-color", "");
                      }
                    }
                  });
                  if (hideRows && isOk) {
                    goners = goners.add($(this));
                    $("input:first", $(this)).val("");
                  }
                });
                goners.remove();
              }

              $("#smithyHighlight").click(function () {
                trackClickEvent("TableHighlight");
                filterTechs(function (cell, isOk) {
                  cell.css("background-color", isOk ? "" : user_data.colors.neutral);
                }, false);
              });

              $("#smithyFilter").click(function () {
                trackClickEvent("TableRemove");
                filterTechs(function (cell, isOk) {
                  cell.css("background-color", isOk ? "" : user_data.colors.neutral);
                }, true);
              });
            }
          } catch (e) { handleException(e, "overview-techs"); }
          //console.timeEnd("overview-techs");
        }());
      }
      // GROUPS OVERVIEW
      else if (location.href.indexOf('mode=groups') > -1) {
        (function() {
          //console.time("overview-groups");
          try {
            overviewTable = $("#group_assign_table");
            tableHandler.init("group_assign_table", {
              hasBottomTotalRow: true
            });

            // TODO: edit groups: make div floatable and remember position
            var menu = "";
            menu += "<table class=vis width='100%'><tr><th>";

            menu += trans.sp.defOverview.village + " <input type=text size=5 id=defFilterDistVillage value=''>";
            menu += "<select id=defFilterDistType>";
            menu += "<option value=1 selected>" + trans.sp.all.closer + "</option><option value=-1>" + trans.sp.all.further + "</option></select>";
            menu += "&nbsp;F <input type=text size=3 id=defFilterDistFields value=" + user_data.restack.fieldsDistanceFilterDefault + ">";
            menu += "<input type=button id=defFilterDist value='" + trans.sp.defOverview.distFilter + "' title='" + trans.sp.defOverview.distFilterTooltip + "'>";

            menu += "&nbsp; | &nbsp;";
            menu += "<input type=button id=attackFilter value='" + trans.sp.defOverview.filterUnderAttack + "'>";

            menu += "<br>";

            menu += "<input type=checkbox id=defReverseFilter title='" + trans.sp.commands.filtersReverse + "'> " + trans.sp.commands.filtersReverseInfo + ": ";

            menu += "&nbsp; <input type=text size=12 id=defFilterTextValue value=''>";
            menu += "<input type=button id=defFilterText value='" + trans.sp.groups.villageFilter + "'>";

            menu += "&nbsp; <input type=textbox size=3 id=defFilterContinentText maxlength=2><input type=button id=defFilterContinent value='" + trans.sp.commands.continentFilter + "'>";

            menu += "&nbsp; <input type=textbox size=3 id=defFilterAmountText maxlength=2><input type=button id=defFilterAmount value='" + trans.sp.groups.amountFilter + "'>";
            menu += "&nbsp; <input type=textbox size=4 id=defFilterPointsText maxlength=5><input type=button id=defFilterPoints value='" + trans.sp.groups.pointsFilter + "'>";
            menu += "&nbsp; <input type=textbox size=5 id=defFilterFarmText maxlength=6><input type=button id=defFilterFarm value='" + trans.tw.all.farm + "'>";

            menu += "&nbsp; <input type=text size=12 id=defFilterGroupValue value=''>";
            menu += "<input type=button id=defFilterGroup value='" + trans.sp.groups.groupNameFilter + "'>";
            menu += "</th></tr></table>";

            var selectAllRow = $("#group_assign_table tr:last");
            $("#group_assign_table").before(menu).after("<table class=vis width='100%'><tr><th><input type=checkbox id=selectAllVisible> " + selectAllRow.text() + "</th></tr></table>");
            selectAllRow.remove();

            // Select all checkbox behavior
            $("#selectAllVisible").change(function () {
              var isChecked = $(this).is(":checked");
              $("#group_assign_table input:checked").prop("checked", false);
              if (isChecked) {
                $("#group_assign_table input[type='checkbox']").not(":hidden").prop("checked", true);
              }

              //$("#group_assign_table input:hidden").prop("checked", false);
              //$("#group_assign_table input:visible").prop("checked", isChecked);
            });

            // Change tooltips when clicking the reverse filter checkbox
            $("#defReverseFilter").change(function () {
              var isChecked = $(this).is(":checked");
              var defTrans = trans.sp.groups;
              $("#defFilterText").attr("title", isChecked ? defTrans.villageFilterTitle : defTrans.villageFilterTitleRev);
              $("#defFilterContinent").attr("title", isChecked ? trans.sp.commands.continentFilterTooltip : trans.sp.commands.continentFilterTooltipReverse);

              $("#defFilterAmount").attr("title", isChecked ? defTrans.amountFilterTitle : defTrans.amountFilterTitleRev);
              $("#defFilterPoints").attr("title", isChecked ? defTrans.pointsFilterTitle : defTrans.pointsFilterTitleRev);
              $("#defFilterFarm").attr("title", isChecked ? defTrans.farmFilterTitle : defTrans.farmFilterTitleRev);

              $("#defFilterGroup").attr("title", isChecked ? defTrans.groupNameFilterTitle : defTrans.groupNameFilterTitleRev);
            });
            $("#defReverseFilter").change();

            /**
             * Perform a filter on the groups table rows
             * @param {function} filterStrategy jQuery object with the row is the first parameter
             * @param {boolean} reverseFilter
             * @param {function} [keepRowStrategy]
             * @param {*} [tag] passed as second param to filterStrategy and keepRowStrategy
             */

            function filterGroupRows(filterStrategy, reverseFilter, keepRowStrategy, tag) {
              if (typeof reverseFilter === "undefined") {
                reverseFilter = !$("#defReverseFilter").is(":checked");
              }

              var goners = $();
              var totalVisible = 0;
              $("#group_assign_table tr:gt(0)").each(function () {
                var row = $(this);
                if (row.is(":visible")) {
                  if (!reverseFilter != !filterStrategy(row, tag)) {
                    goners = goners.add(row);
                    //$("input:eq(1)", row).val("");
                  } else {
                    totalVisible++;
                    if (keepRowStrategy != null) {
                      keepRowStrategy(row, tag);
                    }
                  }
                }
              });
              goners.remove();
              var firstHeaderCell = $("#group_assign_table th:first");
              var firstHeaderCellHtml = firstHeaderCell.html();
              firstHeaderCell.html(firstHeaderCellHtml.substr(0, firstHeaderCellHtml.lastIndexOf(" ")) + " (" + totalVisible + ")");
            }

            // Filter on distance to given village
            $("#defFilterDist").click(function () {
              var targetVillage = getVillageFromCoords($("#defFilterDistVillage").val(), true);
              if (!targetVillage.isValid) {
                alert(trans.sp.defOverview.distanceToVillageNoneEntered);
                return;
              }

              trackClickEvent("FilterDistance");
              var reverseFilter = !($("#defFilterDistType").val() != "-1");
              var maxDistance = parseInt($("#defFilterDistFields").val(), 10);

              var isAlreadyVisible = $("#filterContext").size() == 1;
              var distanceHeader =
                trans.sp.defOverview.distanceToVillage.replace(
                  "{0}",
                  "<a href='"
                    + getUrlString("&screen=map&x=" + targetVillage.x + "&y=" + targetVillage.y + "'>")
                    + targetVillage.coord + "</a>");

              if (isAlreadyVisible) {
                $("#filterContext").html(distanceHeader);
              } else {
                $("#group_assign_table").find("th:first").after("<th><span id=filterContext>" + distanceHeader + "</span> <img src='graphic/oben.png' class=sortDistance direction=up> <img src='graphic/unten.png' class=sortDistance direction=down></th>");
                $(".sortDistance").click(function () {
                  if ($(this).attr("direction") == "up") {
                    $("#group_assign_table").find("tr:gt(0)").filter(":visible").sortElements(function (a, b) {
                      return parseInt($(a).attr("fieldAmount"), 10) > parseInt($(b).attr("fieldAmount"), 10) ? 1 : -1;
                    });
                  } else {
                    $("#group_assign_table").find("tr:gt(0)").filter(":visible").sortElements(function (a, b) {
                      return parseInt($(a).attr("fieldAmount"), 10) < parseInt($(b).attr("fieldAmount"), 10) ? 1 : -1;
                    });
                  }
                });
              }

              filterGroupRows(
                function (row, tag) {
                  var compareVillage = getVillageFromCoords(row.find("td:first").text());
                  tag.distance = getDistance(targetVillage.x, compareVillage.x, targetVillage.y, compareVillage.y, 'ram').fields;
                  return tag.distance > maxDistance;

                }, reverseFilter,
                function (mainRow, tag) {
                  mainRow.attr("fieldAmount", tag.distance);
                  if (!isAlreadyVisible) {
                    mainRow.find("td:first").after("<td><b>" + trans.sp.defOverview.fieldsPrefix.replace("{0}", parseInt(tag.distance, 10)) + "</b></td>");
                  } else {
                    mainRow.find("td:eq(1)").html("<b>" + trans.sp.defOverview.fieldsPrefix.replace("{0}", parseInt(tag.distance, 10)) + "</b>");
                  }
                }, { distance: 0 });
            });

            // Filter on incoming attacks
            $("#attackFilter").click(function () {
              trackClickEvent("FilterUnderAttack");
              filterGroupRows(function (row) {
                return $('td:first:not(:has(img[title=\'' + trans.tw.command.attack + '\']))', row).size() == 0;
              });
            });

            // filter on village name
            $("#defFilterText").click(function () {
              trackClickEvent("FilterText");
              var compareTo = $("#defFilterTextValue").val().toLowerCase();
              if (compareTo.length > 0) {
                filterGroupRows(function (row) {
                  return row.find("td:first").text().toLowerCase().indexOf(compareTo) != -1;
                });
              }
            });

            // filter on group names
            $("#defFilterGroup").click(function () {
              trackClickEvent("FilterGroupName");
              var compareTo = $("#defFilterGroupValue").val().toLowerCase();
              if (compareTo.length > 0) {
                filterGroupRows(function (row) {
                  return row.find("td:eq(4)").text().toLowerCase().indexOf(compareTo) != -1;
                });
              }
            });

            $("#defFilterContinent").click(function () {
              trackClickEvent("FilterContinent");
              var compareTo = parseInt($("#defFilterContinentText").val(), 10);
              if (compareTo >= 0) {
                compareTo = compareTo.toString();
                filterGroupRows(function (row) {
                  var villageContinent = $.trim(row.find("td:first").text()),
                    continentStart = villageContinent.lastIndexOf(trans.tw.all.continentPrefix);

                  return villageContinent.substr(continentStart + 1) === compareTo;
                });
              }
            });

            // filter on # groups
            $("#defFilterAmount").click(function (){
              trackClickEvent("FilterGroupCount");
              var compareTo = parseInt($("#defFilterAmountText").val(), 10);
              if (compareTo >= 0) {
                if (!$("#defReverseFilter").is(":checked")) {
                  filterGroupRows(
                    function (row) {
                      return parseInt(row.find("td:eq(1)").text(), 10) > compareTo;
                    },
                    false);
                } else {
                  filterGroupRows(
                    function (row) {
                      return parseInt(row.find("td:eq(1)").text(), 10) < compareTo;
                    },
                    false);
                }
              }
            });

            $("#defFilterPoints").click(function () {
              trackClickEvent("FilterPoints");
              var compareTo = parseInt($("#defFilterPointsText").val(), 10);
              if (compareTo >= 0) {
                filterGroupRows(function (row) {
                  return parseInt(row.find("td:eq(2)").text().replace(".", ""), 10) < compareTo;
                });
              }
            });

            $("#defFilterFarm").click(function () {
              trackClickEvent("FilterFarm");
              var compareTo = parseInt($("#defFilterFarmText").val(), 10);
              if (compareTo >= 0) {
                filterGroupRows(function (row) {
                  var farmValue = row.find("td:eq(3)").text();
                  farmValue = parseInt(farmValue.substr(0, farmValue.indexOf("/")), 10);
                  return farmValue < compareTo;
                });
              }
            });
          } catch (e) { handleException(e, "overview-groups"); }
          //console.timeEnd("overview-groups");
        }());
      }
      // SUPPORT OVERVIEW
      else if (location.href.indexOf('type=support_detail') > -1
        || location.href.indexOf('type=away_detail') > -1) {

        (function() {
          //console.time("overview-supportdetail");
          try {
            overviewTable = $("#units_table");
            tableHandler.init("units_table", {
              hasBottomTotalRow: true
            });

            /**
             * true: we're on the support_detail page. false: away_detail page
             * @type {boolean}
             */
            var isSupport = location.href.indexOf('type=support_detail') > -1;

            /**
             * Sets the correct rowcount in the first header cell
             */
            function setTotalCount() {
              $("th:first", overviewTable).text(
                trans.sp.defOverview.totalVillages.replace(
                  "{0}",
                  $("tr.units_away", overviewTable).size()));
            }


            var menu = "<table class='vis' width='100%'>";
            menu += "<tr><th width='1%' nowrap>";
            menu += "<input type=button id=defTotals value='" + trans.sp.defOverview.stackButton + "' title='" + trans.sp.defOverview.stackTooltip + "'>";
            menu += "<input type=button id=defHideEmpty value='" + trans.sp.defOverview.filterNoSupport + "' title='" + trans.sp.defOverview.filterNoSupportTooltip + "'> ";

            menu += "</th><th width='96%' nowrap>";
            menu += "<input type=button id=attackFilter value='" + trans.sp.defOverview.filterUnderAttack + "'>";
            if (!isSupport) {
              menu += "&nbsp; <input type=button id=defFilterBarbarian value='" + trans.sp.defOverview.barbarianFilter + "' title='" + trans.sp.defOverview.barbarianFilterTooltip + "'>";
            } else {
              menu += "</th><th width='1%' nowrap>";
              menu += "<input type=text size=8 id=defFilterTotalPopValue value='" + user_data.restack.defaultPopulationFilterAmount + "'>";
              menu += "<select id=defFilterTotalPopComparer>";
              menu += "<option value=-1>" + trans.sp.all.less + "</option><option value=1 selected>" + trans.sp.all.more + "</option></select>";
              menu += "<input type=button id=defFilterTotalPop value='" + trans.sp.defOverview.stackFilter + "' title='" + trans.sp.defOverview.stackFilterTooltip + "'>";

              menu += "</th><th width='1%' nowrap>";
              menu += trans.sp.defOverview.village + " <input type=text size=5 id=defFilterDistVillage value=''>";
              menu += "<select id=defFilterDistType>";
              menu += "<option value=1 selected>" + trans.sp.all.closer + "</option><option value=-1>" + trans.sp.all.further + "</option></select>";
              // TODO: untranslated F(ields)
              menu += "&nbsp;F <input type=text size=3 id=defFilterDistanceValue value=" + user_data.restack.fieldsDistanceFilterDefault + ">";
              menu += "<input type=button id=defFilterDist value='" + trans.sp.defOverview.distFilter + "' title='" + trans.sp.defOverview.distFilterTooltip + "'>";

              menu += "</th><th width='1%' nowrap>";
              menu += " <input type=text size=8 id=defRestackTo value=" + user_data.restack.to + "> <input type=button id=defRestack value='" + trans.sp.defOverview.stackBBCodes + "' title='" + trans.sp.defOverview.stackBBCodesTooltip + "'>";
              //menu += "</th></tr></table>";
            }

            menu += "</th></tr></table>";
            menu += "<table class='vis' width='100%'><tr><th width='1%' nowrap>";
            menu += isSupport ? trans.sp.defOverview.extraFiltersSupport : trans.sp.defOverview.extraFiltersDefense;

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=checkbox id=defReverseFilter title='" + trans.sp.defOverview.extraFiltersReverse + "'" + (user_data.restack.filterReverse ? " checked" : "") + "> " + trans.sp.defOverview.extraFiltersInfo;

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=text size=3 id=defFilterDistanceValue value=" + user_data.restack.fieldsDistanceFilterDefault + "> <input type=button id=defFilterDistance value='" + trans.sp.defOverview.distFilter2 + "'>";

            menu += "</th><th width='1%' nowrap>";
            menu += "&nbsp; <span style='background-color: #ecd19a; border: 1px solid black' id='unitFilterBox'>";
            menu += "&nbsp; <img src='graphic/unit/unit_snob.png' id=filtersnob>&nbsp; <img src='graphic/unit/unit_spy.png' id=filterspy>";
            menu += "&nbsp; <img src='graphic/buildings/barracks.png' id=filterAttack>&nbsp;<img src='graphic/unit/def.png' id=filterDefense>&nbsp;<img id=filterSupport src='graphic/command/support.png'>&nbsp;";
            menu += "</span>&nbsp;&nbsp;";

            menu += "</th><th width='96%' nowrap>";
            menu += "<input type=text size=12 id=defFilterTextValue value=''>";
            menu += "<input type=button id=defFilterText value='" + trans.sp.defOverview.freeTextFilter + "'>";
            menu += "</th></tr></table>";

            overviewTable.before(menu);

            $("#defReverseFilter").change(function () {
              var isChecked = $(this).is(":checked");
              var defTrans = trans.sp.defOverview;
              $("#unitFilterBox").find("img:eq(0)").attr("title", isChecked ? defTrans.nobleFilter : defTrans.nobleFilterRev);
              $("#unitFilterBox").find("img:eq(1)").attr("title", isChecked ? defTrans.spyFilter : defTrans.spyFilterRev);
              $("#unitFilterBox").find("img:eq(2)").attr("title", isChecked ? defTrans.attackFilter : defTrans.attackFilterRev);
              $("#unitFilterBox").find("img:eq(3)").attr("title", isChecked ? defTrans.supportFilter : defTrans.supportFilterRev);

              $("#unitFilterBox").find("img:eq(4)").attr("title", (isSupport ? defTrans.otherPlayerFilterFrom : defTrans.otherPlayerFilterTo).replace("{action}", isChecked ? defTrans.otherPlayerFilterShow : defTrans.otherPlayerFilterHide));
              $("#defFilterText").attr("title", defTrans.freeTextFilterTooltip.replace("{villageType}", isSupport ? defTrans.filterTooltipVillageTypeSupporting : defTrans.filterTooltipVillageTypeSupported).replace("{filterType}", isChecked ? defTrans.freeTextFilterTooltipFilterTypeWith : defTrans.freeTextFilterTooltipFilterTypeWithout));
              $("#defFilterDistance").attr("title", defTrans.distanceFilterTooltip.replace("{villageType}", isSupport ? defTrans.filterTooltipVillageTypeSupporting : defTrans.filterTooltipVillageTypeSupported).replace("{filterType}", !isChecked ? defTrans.distanceFilterTooltipFilterTypeCloser : defTrans.distanceFilterTooltipFilterTypeFurther));
            });
            $("#defReverseFilter").change();
            // This file contains the filters on the FIRST row of the menu

            // UNDER ATTACK FILTER
            $("#attackFilter").click(function () {
              trackClickEvent("FilterAttack");
              var reverseFilter = true; // never reverse this filter!

              var filterStrategy =
                function (row) {
                  return $('td:first:not(:has(img[title=\'' + trans.tw.command.attack + '\']))', row).size() == 0;
                };

              var lastRow = $("tr:last", overviewTable).get(0);
              var goners = $();
              $("tr.units_away", overviewTable).each(function () {
                var self = $(this);
                if (!reverseFilter != !filterStrategy(self)) {
                  goners = goners.add(self);

                  var nextRow = self.next();
                  while (!nextRow.hasClass("units_away") && nextRow.get(0) !== lastRow) {
                    goners = goners.add(nextRow);
                    nextRow = nextRow.next();
                  }
                }
              });
              goners.remove();
              setTotalCount();

              // this is already done in the code above :)
              //$("#defHideEmpty").click();

              if (user_data.restack.calculateDefTotalsAfterFilter
                && !$("#defTotals").is(":disabled")) {

                $("#defTotals").click();
              }
            });



            /**
             * Performs a filter on the OWN villages (ie not the villages supporting the OWN villages)
             * The 'row' parameter are the rows with class grandTotal. These are the rows that get added after (below) all
             * supporting os rows when the total def is being calculated.
             * @param {function} filterStrategy return a boolean to filter all rows for the OWN away. first parameter is the (jQuery) row with the OWN village
             * @param {boolean} reverseFilter reverse the above strategy
             * @param {function} [survivorRowStrategy] execute on all rows that are not being removed (gets passed the row and optional tag)
             * @param {*} [tag] this value is passed onto filterStrategy and survivorRowStrategy as the second parameter (row is the first param)
             */
            function filterMainRows(filterStrategy, reverseFilter, survivorRowStrategy, tag) {
              if (!$("#defTotals").is(":disabled")) {
                $("#defTotals").click();
              }

              /*var goners = $();
               $("tr.grandTotal", overviewTable).each(function () {
               var self = $(this),
               prev;
               if (!reverseFilter != !filterStrategy(self, tag)) {
               goners = goners.add(self).add(self.next());

               prev = self.prev();
               while (!prev.hasClass("units_away")) {
               goners = goners.add(prev);
               prev = prev.prev();
               }

               goners = goners.add(prev);
               } else if (survivorRowStrategy != null) {
               prev = self.prev();
               while (!prev.hasClass("units_away")) {
               prev = prev.prev();
               }
               survivorRowStrategy(prev, tag);
               }
               });
               goners.remove();
               setTotalCount();*/

              var lastRow = $("tr:last", overviewTable).get(0);
              var goners = $();
              $("tr.units_away", overviewTable).each(function () {
                var self = $(this);
                if (!reverseFilter != !filterStrategy(self, tag)) {
                  goners = goners.add(self);

                  var nextRow = self.next();
                  while (!nextRow.hasClass("units_away") && nextRow.get(0) !== lastRow) {
                    goners = goners.add(nextRow);
                    nextRow = nextRow.next();
                  }
                }
                else if (survivorRowStrategy != null) {
                  /*prev = self.prev();
                   while (!prev.hasClass("units_away")) {
                   prev = prev.prev();
                   }*/
                  survivorRowStrategy(self, tag);
                }
              });
              goners.remove();
              setTotalCount();
            }



            // filter the OWN villages on less/more population (requires total calculation)
            $("#defFilterTotalPop").click(function () {
              trackClickEvent("FilterFarm");
              var reverseFilter = $("#defFilterTotalPopComparer").val() != "-1";
              var compareTo = parseInt($("#defFilterTotalPopValue").val(), 10);

              filterMainRows(
                //q(row.attr("village") + "is:" + row.attr("population"));
                function (row) { return (parseInt(row.attr("population"), 10) > compareTo); },
                reverseFilter);
            });

            // filter the OWN villages on less/more distance to given coordinates (requires total calculation)
            $("#defFilterDist").click(function () {
              var targetVillage = getVillageFromCoords($("#defFilterDistVillage").val(), true);
              if (!targetVillage.isValid) {
                alert(trans.sp.defOverview.distanceToVillageNoneEntered);
                return;
              }

              trackClickEvent("FilterDistanceToX");
              var reverseFilter = !($("#defFilterDistType").val() != "-1");
              var maxDistance = parseInt($("#defFilterDistanceValue").val(), 10);

              // Change text of th cell to 'distance to ' + given village
              overviewTable.find("th:eq(1)").html(
                trans.sp.defOverview.distanceToVillage.replace(
                  "{0}",
                  "<a href='"
                    + getUrlString("&screen=map&x=" + targetVillage.x + "&y=" + targetVillage.y + "'>")
                    + targetVillage.coord + "</a>"));

              filterMainRows(
                function (row, tag) {
                  var compareVillage = getVillageFromCoords(row.attr("village"));
                  tag.distance = getDistance(targetVillage.x, compareVillage.x, targetVillage.y, compareVillage.y, 'ram').fields;
                  return tag.distance > maxDistance;
                },
                reverseFilter,
                function (mainRow, tag) {
                  // Adds the distance between OWN village and the user given coordinates
                  mainRow.find("td:eq(1)").html("<b>" + trans.sp.defOverview.fieldsPrefix.replace("{0}", parseInt(tag.distance, 10)) + "</b>");
                },
                { distance: 0 });
            });
            // Calculate villages that don't have x population defense
            // and create BBcodes textarea for it
            $("#defRestack").click(function () {
              trackClickEvent("BBCodeOutput");
              if (!$("#defTotals").attr("disabled")) {
                $("#defTotals").click();
              }

              var restackTo = parseInt($("#defRestackTo").val(), 10);
              var counter = 0;

              var request = "";
              $("tr.grandTotal", overviewTable).each(function () {
                var self = $(this);
                var total = parseInt(self.attr('population'), 10);
                if (restackTo - total > user_data.restack.requiredDifference) {
                  var villageCoords = self.attr("village");
                  counter++;
                  request += counter + "[village]" + villageCoords + "[/village] (" + parseInt((restackTo - total) / 1000, 10) + trans.sp.defOverview.thousandSuffix + ")\n";
                }
              });

              if ($("#textsArea").size() == 0) {
                $(this).parent().parent().parent().parent().after(
                    "<table class='vis' width='100%'><tr>"
                    + "<td id=textsArea width='50%' valign='top'></td>"
                    + "<td id='extraTextsArea' width='50%' valign='top'>"
                    + trans.sp.defOverview.freeText
                    + "<br><textarea cols=50 rows=9></textarea></td>"
                    + "</tr></table>");

                $("#textsArea").parent().after("<tr><td colspan='2'><input type=button value='" + trans.sp.all.close + "' id=closeTextsArea></td></tr>");
              } else {
                $("#textsArea").html("");
              }

              var title = trans.sp.troopOverview.restackTitle
                .replace("{to}", parseInt(restackTo / 1000, 10))
                .replace("{requiredDiff}", parseInt(user_data.restack.requiredDifference / 1000, 10));

              $("#textsArea").append(title + "<br><textarea cols=50 rows=10 id=restackArea>" + request + "</textarea>");

              $("#closeTextsArea").click(function() {
                $("#textsArea").parent().parent().remove();
              });
            });
            // Check all villages checkbox replacement
            $("input.selectAll").replaceWith("<input type=checkbox id=selectAllVisible>");
            $("#selectAllVisible").change(function () {
              var isChecked = $(this).is(":checked");

              $("input.village_checkbox:hidden", overviewTable).prop("checked", false);
              $("input.village_checkbox:visible", overviewTable).prop("checked", isChecked);
            });


            // Hide all OWN rows/villages that don't have any support rows anymore
            $("#defHideEmpty").click(function () {
              trackClickEvent("FilterEmpty");
              var goners = $();
              if ($("#defTotals").is(":disabled")) {
                $("tr.units_away", overviewTable).each(function () {
                  var mainRow = $(this),
                    nextRow = mainRow.next();

                  if (nextRow.hasClass("grandTotal")) {
                    goners = goners.add(mainRow).add(nextRow.next()).add(nextRow);
                  }
                  else if (nextRow.hasClass("units_away")) {
                    goners = goners.add(mainRow);
                  }
                });
              } else {
                $("tr.units_away", overviewTable).each(function () {
                  var mainRow = $(this),
                    nextRow = mainRow.next();

                  if (nextRow.hasClass("units_away")) {
                    goners = goners.add(mainRow);
                  }
                });
              }

              goners.remove();
              setTotalCount();
            });


            // Calculate the amount of def in each village
            // Give sensible background row colors
            // Add attributes to the grandTotal class rows 'village' (coords) and 'population'
            // Add attribute 'distance' the distance between OWN and supporting villages, in fields
            $("#defTotals").click(function () {
              trackClickEvent("FilterTotalDef");
              $(this).attr("disabled", true);
              var rowColor = 0;
              var goners = $();
              overviewTable.find("tr.units_away").each(function () {
                var self = $(this);
                var firstCell = self.find("td:first");
                var villageCoord = getVillageFromCoords(firstCell.text().replace(firstCell.find(".quickedit-label").attr("data-text"), ""));

                // ensure row color swapping for each own village
                rowColor++;
                if (rowColor % 2 == 1) {
                  self.removeClass("row_a").addClass("row_b");
                } else {
                  self.removeClass("row_b").addClass("row_a");
                }

                // village attribute both to .units_away and .grandTotal rows ;)
                self.attr("village", villageCoord.coord);

                var nextRow = self.next();
                if (nextRow.hasClass("units_away")) {
                  if (user_data.restack.removeRowsWithoutSupport) {
                    goners = goners.add(self);
                  }
                } else {
                  // calculate total support
                  var grandTotal = 0;
                  var totals = [];
                  while (nextRow.hasClass("row_a") || nextRow.hasClass("row_b")) {
                    // supporting rows loop
                    var total = 0;
                    $("td:gt(0)", nextRow).each(function (i) {
                      // total support per supporting village
                      var cellSelf = $(this);
                      var cellContent = $.trim(cellSelf.text());
                      if (!(cellContent == '0' || i >= world_data.unitsPositionSize.length)) {
                        total += cellContent * world_data.unitsPositionSize[i];
                        if (totals[i] == undefined) {
                          totals[i] = parseInt(cellContent, 10);
                        } else {
                          totals[i] += parseInt(cellContent, 10);
                        }
                      }
                    });
                    grandTotal += total;
                    $("td:eq(" + (world_data.unitsPositionSize.length + 1) + ")", nextRow).text(formatNumber(total));

                    // print distance between own village
                    var supportedCell = $("td:first", nextRow);
                    var supportedVillage = getVillageFromCoords(supportedCell.text());
                    var distance = parseInt(getDistance(supportedVillage.x, villageCoord.x, supportedVillage.y, villageCoord.y, 'ram').fields, 10);
                    //supportedCell.html(supportedCell.html() + ' <b>' + trans.sp.all.fieldsSuffix.replace("{0}", distance) + '</b>');
                    supportedCell.append(' <b>' + trans.sp.all.fieldsSuffix.replace("{0}", distance) + '</b>');
                    nextRow.attr("distance", distance);

                    if (rowColor % 2 == 1) {
                      nextRow.removeClass("row_a").addClass("row_b");
                    } else {
                      nextRow.removeClass("row_b").addClass("row_a");
                    }

                    nextRow = nextRow.next();
                  }

                  // row colors for the support villages
                  if (rowColor % 2 == 1) {
                    nextRow.removeClass("row_a").addClass("row_b");
                  } else {
                    nextRow.removeClass("row_b").addClass("row_a");
                  }

                  var troopCells = "";
                  for (var i = 0; i < world_data.unitsPositionSize.length; i++) {
                    if (typeof totals[i] !== 'undefined') {
                      troopCells += "<td>" + formatNumber(totals[i]) + "</td>";
                    } else {
                      troopCells += "<td><span class=hidden>0</span></td>";
                    }
                  }

                  self.attr("population", grandTotal);
                  var color = getStackColor(grandTotal);
                  color = "<td style='background-color: " + color + "; border:1px solid black'>" + formatNumber(grandTotal) + "</td>";

                  nextRow.before("<tr class='grandTotal " + (rowColor % 2 == 1 ? "row_b" : "row_a") + "' village='" + villageCoord.coord + "' population='" + grandTotal + "'><td>&nbsp;</td><td>" + (isSupport ? trans.sp.defOverview.totalFromOtherVillages : trans.sp.defOverview.totalInOtherVillages) + "</td>" + troopCells + color + "</tr><tr height=10></tr>");
                }
              });

              goners.remove();
            });
            // This file contains the filters on the SECOND row of the menu

            /**
             * Loops over all supporting rows and removes the rows that fail the filterStrategy predicate. Where the
             * filterMainRows function loops over the OWN villages, this one loops over all the others.
             * @param {Function} filterStrategy gets each jQuery row that represents a supporting village passed as parameter
             * @param {string=after} [calcDefTotalsTime] is "before" or "after". before if it uses row attributes set by #defTotals
             */
            function filterTable(filterStrategy, calcDefTotalsTime) {
              if (typeof calcDefTotalsTime === 'undefined') {
                calcDefTotalsTime = "after";
              }
              if (calcDefTotalsTime === "before" && !$("#defTotals").is(":disabled")) {
                $("#defTotals").click();
              }
              var totalDefCalced = $("#defTotals").is(":disabled");

              var reverseFilter = $("#defReverseFilter").is(":checked");
              var goners = $();
              $("tr", overviewTable).slice(1).each(function () {
                var self = $(this);
                if ((totalDefCalced && self.attr("distance"))
                  || (!totalDefCalced && (self.hasClass("row_a") || self.hasClass("row_b")))) {

                  if (!reverseFilter != !filterStrategy(self)) {
                    goners = goners.add(self);
                  }
                }
              });
              goners.remove();
              setTotalCount();
              if (user_data.restack.autohideWithoutSupportAfterFilter) {
                $("#defHideEmpty").click();
              }

              if (user_data.restack.calculateDefTotalsAfterFilter
                && calcDefTotalsTime === "after"
                && !$("#defTotals").is(":disabled")) {

                $("#defTotals").click();
              }
            }





            // NOBLES and SCOUTS
            $("#filtersnob, #filterspy").click( function () {
              trackClickEvent("FilterSnobOrSpy");
              var position = $.inArray($(this).attr("id").substr(6), world_data.units) + 1;
              filterTable(function (row) {
                return row.find("td").eq(position).text() != "0";
              });
            });

            // OTHER PLAYERS SUPPORT
            $("#filterSupport").click( function () {
              trackClickEvent("FilterSupport");
              filterTable(function (row) {
                return row.find("td:first a").length != 2;
              });
            });

            // DEFENSIVE & OFFENSIVE UNITS
            $("#filterAttack, #filterDefense").click( function () {
              trackClickEvent("FilterOffOrDef");
              var unitArray = $(this).attr('id') == "filterDefense" ? world_data.units_def : world_data.units_off;
              filterTable(function (row) {
                var hideRow = false;
                $("td:gt(0)", row).each(function (i) {
                  if (world_data.units[i] != undefined
                    && world_data.units[i] != "heavy"
                    && parseInt($(this).text(), 10) > 0
                    && $.inArray(world_data.units[i], unitArray) > -1) {

                    hideRow = true;
                    return false;
                  }
                });

                return hideRow;
              });
            });

            /// BARBARIAN VILLAGES filter
            $("#defFilterBarbarian").click( function () {
              trackClickEvent("FilterBarbarian");
              filterTable(function (row) {
                var text = row.find("td:first").text();
                return text.match(/\(---\)\s+\(F\d+\)$/); // Unlocalized F(ields) string
              });
            });

            // TEXT FILTER
            $("#defFilterText").click( function () {
              trackClickEvent("FilterText");
              var compareTo = $("#defFilterTextValue").val().toLowerCase();
              if (compareTo.length > 0)
                filterTable(function (row) {
                  return row.text().toLowerCase().indexOf(compareTo) == -1;
                });
            });

            // DISTANCE between OWN and supporting village
            $("#defFilterDistance").click(function () {
              trackClickEvent("FilterDistance");
              var maxDistance = $("#defFilterDistanceValue").val();
              filterTable(
                function (row) {
                  var distance = $(row).attr("distance");
                  return (distance != '' && parseInt(distance, 10) < maxDistance);
                },
                "before");
            });

          } catch (e) { handleException(e, "overview-supportdetail"); }
          //console.timeEnd("overview-supportdetail");
        }());
      }
      // COMMANDS OVERVIEW
      else if (location.href.indexOf('mode=commands') > -1) {
        (function() {
          //console.time("overview-commands");
          try {
            overviewTable = $("#commands_table");
            tableHandler.init("commands_table", {
              hasBottomTotalRow: true
            });

            var commandListType = getQueryStringParam("type");

            var menu = "";
            menu += "<table class=vis width='100%'>";
            menu += "<tr>";
            if (location.href.indexOf('type=all') > -1 || location.href.indexOf('&type=') == -1) {
              menu += "<th width='1%'>";
              menu += "<input type=button id=filterReturning value='" + trans.sp.commands.filterReturn + "' title=\"" + trans.sp.commands.filterReturnTooltip + "\">";
              menu += "</th>";
            }

            menu += "<th width='1%' nowrap>";
            menu += "<input type=checkbox id=sortSum " + (user_data.command.sumRow ? "checked" : "") + "> " + trans.sp.commands.totalRows + " ";
            var isSupport = location.href.indexOf('type=support') > -1;
            menu += "<input type=button id=sortIt value='" + trans.sp.commands.group + "'>";

            menu += "</th><th width='98%'>";

            menu += "<input type=button id=BBCodeOutput value='" + trans.sp.commands.bbCodeExport + "' title='" + trans.sp.commands.bbCodeExportTooltip + "'>";

            if (commandListType !== "attack" && commandListType !== "return") {
              menu += "&nbsp; &nbsp;";
              menu += "<input type=text id=supportPlayerName size=>&nbsp;";
              menu += "<input type=button id=supportPlayerExport value='" + trans.sp.commands.supportPlayerExport + "' title='" + trans.sp.commands.supportPlayerExportTooltip + "'>";
            }

            menu += "</th></tr></table>";

            // second row
            menu += "<table><tr><th width='1%' nowrap>";
            menu += "<input type=checkbox id=defReverseFilter title='" + trans.sp.commands.filtersReverse + "'> " + trans.sp.commands.filtersReverseInfo + ": ";

            menu += "</th><th width='1%' nowrap>";
            menu += "<span style='background-color: #ecd19a; border: 1px solid black' id='unitFilterBox'>";
            menu += "&nbsp; <img src='graphic/unit/unit_snob.png' id=filtersnob>&nbsp; <img src='graphic/unit/unit_spy.png' id=filterspy>&nbsp; <img src='graphic/face.png' id=filterFake>&nbsp;";
            menu += "&nbsp; </span>";

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=text size=12 id=defFilterTextValue value=''>";
            menu += "<input type=button id=defFilterText value='" + trans.sp.commands.freeTextFilter + "'>";

            menu += "</th><th width='97%' nowrap>";
            menu += "<input type=textbox size=3 id=defFilterContinentText maxlength=2><input type=button id=defFilterContinent value='" + trans.sp.commands.continentFilter + "'>";

            menu += "</th></tr>";
            menu += "</table>";
            $("#commands_table").before(menu);

            $("#select_all").replaceWith("<input type='checkbox' id='selectAll'>");
            var selectAllCheckboxes = function() {
              var isChecked = $("#selectAll").is(":checked");
              $("#commands_table tr:visible").find(":checkbox").prop("checked", isChecked);
            };
            $("#selectAll").change(selectAllCheckboxes);

            var offsetToUnits = 3;

            $("#defReverseFilter").change( function () {
              var isChecked = $(this).is(":checked");
              var defTrans = trans.sp.commands;
              $("#unitFilterBox").find("img:eq(0)").attr("title", !isChecked ? defTrans.nobleFilter : defTrans.nobleFilterRev);
              $("#unitFilterBox").find("img:eq(1)").attr("title", isChecked ? defTrans.spyFilter : defTrans.spyFilterRev);
              $("#unitFilterBox").find("img:eq(2)").attr("title", !isChecked ? defTrans.fakeFilter : defTrans.fakeFilterRev);

              $("#defFilterContinent").attr("title", isChecked ? defTrans.continentFilterTooltip : defTrans.continentFilterTooltipReverse);

              $("#defFilterText").attr("title", defTrans.freeTextFilterTooltip.replace("{filterType}", isChecked ? defTrans.freeTextFilterTooltipFilterTypeWith : defTrans.freeTextFilterTooltipFilterTypeWithout));
            });

            $("#defReverseFilter").change();
            var hasGrouped = false;

            // generate bb code or JSON (for player os) export
            $("#BBCodeOutput,#supportPlayerExport").click(function () {
              trackClickEvent($(this).attr("id"));
              var villages = [];
              var request = {};
              var filter = hasGrouped ? "tr.command" : "tr:gt(0)";
              $("#commands_table " + filter).filter(":visible").each(function () {
                var row = $(this);
                var cells = $("td", row);
                var firstCell = cells.first();
                var commandType = firstCell.find("img:first").attr("src");

                if (typeof commandType !== 'undefined'
                  && commandType.indexOf("command/cancel.png") == -1
                  && commandType.indexOf("command/other_back.png") == -1
                  && commandType.indexOf("command/back.png") == -1
                  && commandType.indexOf("command/return.png") == -1) {

                  // We get the village coords from the description of the command
                  // Meaning if the user changes the name to "blabla" that we can't parse it
                  var village = getVillageFromCoords($.trim(firstCell.text()));
                  //assert(village.isValid, $.trim(firstCell.text()) + " could not be converted to village");
                  if (village.isValid) {
                    if (request[village.coord] == undefined) {
                      request[village.coord] = { village: village.coord, attacks: [], hasSupport: false };
                      villages.push(village.coord);
                    }

                    var unitsSent = {};
                    $.each(world_data.units,
                           function (i, val) {
                             unitsSent[val] = parseInt(cells.eq(offsetToUnits + i).text(), 10);
                           });

                    var isSupport = false;
                    if (commandListType == "support") {
                      isSupport = true;
                    }
                    else if (commandListType == "attack") {
                      isSupport = false;
                    } else {
                      isSupport = cells.first().has("img[src*='command/support.png']").size() == 1;
                    }

                    request[village.coord].hasSupport = isSupport;
                    request[village.coord].attacks.push({
                                                          isSupport: isSupport,
                                                          units: unitsSent,
                                                          unitsString: buildAttackString(null, unitsSent, null, isSupport, user_data.command.bbCodeExport.requiredTroopAmount),
                                                          commandName: isSupport ? $.trim(firstCell.text()) : "",
                                                          commandId: isSupport ? firstCell.find(":checkbox").attr("value") : null,
                                                          arrivalDate: getDateFromTodayTomorrowTW(cells.eq(2).text())
                                                        });
                  }
                }
              });

              var exportWidgets = [];
              if ($(this).attr("id") === "BBCodeOutput") {
                var requestsPer500 = [""];
                var requestComposed = "";
                for (var i = 0; i < villages.length; i++) {
                  var currentVillage = request[villages[i]];
                  var currentText = "";
                  currentText += "[spoiler][code]";
                  var attackCount = 0;
                  var supportCount = 0;
                  var lastAttack = null;
                  var largestAttack = 0;
                  var totalPop = 0;
                  for (var attackId = 0; attackId < currentVillage.attacks.length; attackId++) {
                    var currentAttack = currentVillage.attacks[attackId];
                    if (currentAttack.isSupport) {
                      supportCount++;
                      $.each(world_data.units, function (i, val) {
                        totalPop += currentAttack.units[val] * world_data.unitsPositionSize[i];
                      });
                    } else {
                      attackCount++;
                      if (lastAttack == null || lastAttack < currentAttack.arrivalDate) {
                        lastAttack = currentAttack.arrivalDate;
                      }
                    }
                    if (largestAttack < currentAttack.unitsString.length) {
                      largestAttack = currentAttack.unitsString.length;
                    }
                  }

                  for (var attackId = 0; attackId < currentVillage.attacks.length; attackId++) {
                    var currentAttack = currentVillage.attacks[attackId];
                    currentText += currentAttack.unitsString;
                    var extraTabs = (largestAttack - currentAttack.unitsString.length) / 1;
                    if (Math.ceil(extraTabs) == extraTabs) {
                      extraTabs = Math.ceil(extraTabs);
                    }
                    for (var tabs = 0; tabs < extraTabs + 1; tabs++) {
                      currentText += " ";
                    }

                    currentText += "\t" + twDateFormat(currentAttack.arrivalDate, true) + "\n";
                  }
                  currentText += "[/code][/spoiler]\n";

                  var headerTemplate;
                  if (!currentVillage.hasSupport && attackCount !== 0) {
                    headerTemplate = trans.sp.commands.exportAttackHeader;
                  }
                  else if (currentVillage.hasSupport && attackCount === 0) {
                    headerTemplate = trans.sp.commands.exportDefenseHeader;
                  } else {
                    headerTemplate = trans.sp.commands.exportCompleteHeader;
                  }

                  requestComposed +=
                    headerTemplate
                      .replace("{#}", attackCount)
                      .replace("{support#}", supportCount)
                      .replace("{totalStack}", formatNumber(totalPop))
                      .replace("{lastAttack}", lastAttack !== null ? twDateFormat(lastAttack, true) : "")
                      .replace("{village}", "[village]" + villages[i] + "[/village]")
                    + "\n " + currentText;

                  // splits per 500 [ characters (limit in TW)
                  var amountBracket = requestsPer500[requestsPer500.length - 1].match(/\[/g);
                  if (amountBracket != null && (requestComposed.match(/\[/g).length + amountBracket.length > server_settings.allowedSquareBrackets)) {
                    requestsPer500.push("");
                  }
                  requestsPer500[requestsPer500.length - 1] += requestComposed;
                  requestComposed = "";
                }

                for (i = 0; i < requestsPer500.length; i++) {
                  exportWidgets.push("<textarea cols=80 rows=10 class=restackArea>" + requestsPer500[i] + "</textarea>");
                }

              } else {
                // JSON export for player support
                var exportAttacks = [],
                  playerName = $.trim($("#supportPlayerName").val()),
                  filter = playerName.length === 0
                    ? function(attackString) { return true; }
                    : function(attackString) { return attackString.indexOf(playerName) !== -1 };

                for (var i = 0; i < villages.length; i++) {
                  var currentVillage = request[villages[i]];

                  if (currentVillage.hasSupport) {
                    for (var attackId = 0; attackId < currentVillage.attacks.length; attackId++) {
                      var currentAttack = currentVillage.attacks[attackId];
                      if (currentAttack.isSupport && filter(currentAttack.commandName)) {
                        exportAttacks.push({
                                             commandName: currentAttack.commandName,
                                             commandId: currentAttack.commandId
                                           });
                        /*q(villages[i]);
                         q(currentVillage)
                         q(currentAttack);
                         q("---------------------");*/
                      }
                    }
                  }
                }

                if (exportAttacks.length > 0) {
                  exportWidgets.push("<textarea style='width: 96%' rows=10 class=restackArea>" + JSON.stringify(exportAttacks, null, 4) + "</textarea>");
                } else {
                  alert(trans.sp.commands.exportNone);
                }
              }

              if (exportWidgets.length > 0) {
                if ($("#textsArea").size() == 0) {
                  $(this).parent().parent().parent().append("<tr><td id=textsArea colspan=3></td></tr>");
                } else {
                  $("#textsArea").html("");
                }
                for (var i = 0; i < exportWidgets.length; i++) {
                  $("#textsArea").append(exportWidgets[i]);
                }
                $("#textsArea").append("<br><input type=button value='" + trans.sp.all.close + "' id=closeTextsArea>");
                $("#closeTextsArea").click(function() {
                  $("#textsArea").parent().remove();
                });
              }
            });

            function filterCommandRows(filterStrategy) {
              // return true to hidethe row; false keep row visible (without reverse filter checkbox)
              var reverseFilter = $("#defReverseFilter").is(":checked");
              var goners = $();
              var filter = hasGrouped ? "tr.command" : "tr:gt(0)";
              $("#commands_table " + filter).filter(":visible").each(function () {
                if ($("th", this).size() != 0) {
                  // don't do anything anymore when on the total row
                  return;
                }
                if (!reverseFilter != !filterStrategy($(this))) {
                  goners = goners.add($(this));
                  $("input:eq(1)", this).val("");
                }
              });
              goners.remove();

              // Show totals
              var amountOfCommandos = $("#commands_table " + filter).size();
              if (hasGrouped) {
                $("#commands_table tr.sumLine").hide();
              } else {
                amountOfCommandos--;
              }

              $("#commands_table th:first").text(trans.sp.commands.tableTotal.replace("{0}", amountOfCommandos));
              $("#amountOfAttacks").text(amountOfCommandos);
              if ($("#amountOfAttacks").size() == 1) {
                $("#amountOfTargets").val("???");
              }

              $("#commands_table tr").not(":visible").find(":checkbox").prop("checked", false);
            }

            // Filter sent back, returning and cancelled commands
            $("#filterReturning").click(function () {
              $(this).attr("disabled", "disabled");
              trackClickEvent("FilterReturning");
              filterCommandRows( function (row) {
                var firstCellImage = $("td:first img:first", row).attr("src");
                return firstCellImage.indexOf("command/other_back.png") != -1
                  || firstCellImage.indexOf("command/back.png") != -1
                  || firstCellImage.indexOf("command/return.png") != -1
                  || firstCellImage.indexOf("command/cancel.png") != -1;
              });
            });

            $("#defFilterText").click(function () {
              trackClickEvent("FilterText");
              var compareTo = $("#defFilterTextValue").val().toLowerCase();
              if (compareTo.length > 0) {
                filterCommandRows(function (row) {
                  return row.text().toLowerCase().indexOf(compareTo) == -1;
                });
              }
            });

            $("#filterspy").click(function () {
              trackClickEvent("FilterSpy");
              var position = $.inArray($(this).attr("id").substr(6), world_data.units);
              filterCommandRows(function (row) {
                if (row.find("td").eq(position + offsetToUnits).text() == "0") {
                  return false;
                }
                var totalScout = row.find("td").eq(position + offsetToUnits).text();

                var cell = row.find("td:eq(" + (offsetToUnits - 1) + ")");
                for (var i = 0; i < world_data.units.length; i++) {
                  cell = cell.next();
                  if (totalScout < cell.text()) {
                    return false;
                  }
                }
                return true;
              });
            });

            $("#filtersnob").click(function () {
              trackClickEvent("FilterSnob");
              var position = $.inArray($(this).attr("id").substr(6), world_data.units) + offsetToUnits;
              filterCommandRows(function (row) {
                return row.find("td").eq(position).text() == "0";
              });
            });

            $("#filterFake").click(function () {
              trackClickEvent("FilterFake");
              var maxPop = user_data.command.filterFakeMaxPop;
              filterCommandRows(function (row) {
                var total = 0;
                var cell = row.find("td:eq(" + (offsetToUnits - 1) + ")");
                for (var i = 0; i < world_data.units.length; i++) {
                  cell = cell.next();
                  total += parseInt(cell.text(), 10);

                  // An attack with a noble is (almost) never a fake:
                  if (i == world_data.units.length - 1 && cell.text() != "0") {
                    return false;
                  }

                  if (total > maxPop) {
                    return false;
                  }
                }
                return true;
              });
            });

            $("#defFilterContinent").click(function () {
              trackClickEvent("FilterContinent");
              var continent = parseInt($("#defFilterContinentText").val(), 10);
              if (!isNaN(continent)) {
                filterCommandRows(function (row) {
                  var village = getVillageFromCoords(row.find("td:first").text());
                  var village2 = getVillageFromCoords(row.find("td:eq(1)").text());
                  if (!village.isValid || !village2.isValid) {
                    return true;
                  }
                  return village.continent() != continent && village2.continent() != continent;
                });
              }
            });

            // Sort/group incoming attacks
            $("#sortIt").click(function () {
              trackClickEvent("Sort");
              hasGrouped = true;
              var newTable = "";
              var targets = [];
              var amountOfCommandos = 0;
              var sum = $('#sortSum').is(':checked');
              $("#filterReturning").attr("disabled", true);

              $("#commands_table").find("tr:gt(0)").filter(":visible").each(function () {
                var target = $.trim($(".quickedit-label", this).text());
                var village = getVillageFromCoords(target);
                if (village.isValid) {
                  amountOfCommandos++;
                  if (targets[village.coord] == undefined) {
                    targets.push(village.coord);
                    targets[village.coord] = new Array();
                  }
                  targets[village.coord].push($(this));
                }
              });

              var mod = 0;
              if (isSupport) {
                $.each(targets, function (i, v) {
                  mod++;
                  var amount = 0;
                  var totalDef = new Array();
                  totalDef['pop'] = 0;
                  $.each(world_data.units, function (index, value) { totalDef[value] = 0; });

                  $.each(targets[v], function (index, value) {
                    var villageId = $("td:eq(1) a:first", value).attr("href").match(/id=(\d+)/)[1];
                    newTable += "<tr class='command nowrap row_" + (mod % 2 == 0 ? 'b' : 'a') + (villageId == game_data.village.id ? " selected" : "") + "'>" + value.html() + "</tr>";
                    amount++;

                    var unitAmounts = $("td:gt(2)", value);
                    $.each(world_data.units, function (iUnit, vUnit) {
                      var amount = parseInt(unitAmounts.eq(iUnit).html(), 10);
                      if (amount == 1) {
                        totalDef[vUnit] = amount;
                      } else {
                        totalDef[vUnit] += amount;
                      }
                      totalDef['pop'] += amount * world_data.unitsSize['unit_' + vUnit];
                    });
                  });

                  if (sum) {
                    newTable += "<tr class='sumLine'><td align=right colspan=3><b>" + trans.sp.commands.totalRowsText.replace("{0}", amount).replace("{1}", formatNumber(totalDef['pop'])) + "&nbsp;</b></td>";
                    $.each(world_data.units, function (iUnit, vUnit) {
                      newTable += "<td>" + (totalDef[vUnit] == 0 ? "&nbsp;" : formatNumber(totalDef[vUnit])) + "</td>";
                    });
                    newTable += "</tr>";
                  }
                });
              } else {
                // attacks (meaning: no support commands)
                $.each(targets, function (i, v) {
                  mod++;
                  var amount = 0;
                  var lastArrival = '';
                  $.each(targets[v], function (index, value) {
                    var villageId = $("td:eq(1) a:first", value).attr("href").match(/id=(\d+)/)[1];

                    var currentArrival = $(value).find("td:eq(2)").text();
                    if (lastArrival == currentArrival) {
                      // Don't show when it's on the same second
                      // Only practical on full second worlds really
                      newTable += "<tr class='command nowrap row_" + (mod % 2 == 0 ? 'b' : 'a') + (villageId == game_data.village.id ? " selected" : "") + "'>";
                      $(this).find("td").each(function (i) {
                        if (i == 2) {
                          newTable += "<td>&nbsp;</td>";
                        }
                        else if ($(this).text() == 0) {
                          newTable += "<td class=hidden>0</td>";
                        } else {
                          newTable += "<td>" + $(this).html() + "</td>";
                        }
                      });
                      newTable += "</tr>";
                    }
                    else {
                      newTable += "<tr class='command nowrap row_" + (mod % 2 == 0 ? 'b' : 'a') + (villageId == game_data.village.id ? " selected" : "") + "'>" + value.html() + "</tr>";
                    }
                    lastArrival = currentArrival;
                    amount++;
                  });

                  if (sum) {
                    newTable += "<tr class='sumLine'><td align=right colspan=" + (3 + world_data.units.length) + ">" + amount + "&nbsp;</td></tr>";
                  }
                });
              }

              var menu = $("#commands_table tr").first().html(),
                totalRow = $("#commands_table tr:last");
              $("#commands_table").html("<table id='commands_table' class='vis'>" + menu + newTable + totalRow.outerHTML() + "</table>");
              $("#selectAll").change(selectAllCheckboxes);

              // total number of attacks
              if ($("#amountOfAttacks").size() == 0) {
                var totalDesc = (isSupport ? trans.sp.commands.totalSupport : trans.sp.commands.totalAttack);
                var totalVillagesDesc = isSupport ? trans.sp.commands.totalVillagesSupport : trans.sp.commands.totalVillagesAttack;
                var pageSize = $("input[name='page_size']");
                if (pageSize.size() == 0) {
                  pageSize = $("input[type='submit']:last");
                  pageSize.after("<table class=vis><tr class='row_a'><th>" + totalVillagesDesc + "</th><td><input type=text size=5 value=" + targets.length + " id=amountOfTargets></td></tr><tr class='row_a'><th>" + totalDesc + ":</th><td id='amountOfAttacks'>" + amountOfCommandos + "</td></tr></table>");
                } else {
                  pageSize[0].id = "amountOfTargets";
                  pageSize.parent().prev().text(totalVillagesDesc);
                  pageSize = pageSize.val(targets.length).parent().parent().parent();
                  pageSize.append('<tr><th colspan=2>' + totalDesc + ':</th><td id="amountOfAttacks">' + amountOfCommandos + '</td></tr>');
                }
              } else {
                $("#amountOfTargets").val(targets.length);
                $("#amountOfAttacks").text(amountOfCommandos);
              }
            });
          } catch (e) { handleException(e, "overview-commands"); }
          //console.timeEnd("overview-commands");
        }());
      }
      // INCOMINGS OVERVIEW
      else if (location.href.indexOf('mode=incomings') > -1) {
        (function() {
          //console.time("overview-incomings");
          try {
            overviewTable = $("#incomings_table");
            tableHandler.init("incomings_table", {
              hasBottomTotalRow: getQueryStringParam("subtype") !== "supports"
            });

            var table = {
              /**
               * Quick sort adds extra rows with the .total class
               */
              hasTotalRows: false,
              /**
               * Some buttons add extra columns
               */
              newColumns: {
                before: 0,
                after: 0
              },
              getColspan: function() {
                return 7 + this.newColumns.before + this.newColumns.after;
              },
              /**
               * Remove the total rows so that other filters can operate again
               */
              fixTable: function() {
                if (this.hasTotalRows === true) {
                  overviewTable.find("tr.total").remove();
                  this.hasTotalRows = false;
                }
              },
              getVillageRows: function() {
                var rows = overviewTable.find("tr:gt(0)");
                if (tableHandler.settings.hasBottomTotalRow) {
                  rows = rows.not("tr:last");
                }
                return rows;
              },
              /**
               * Set the table total rows count correctly
               * @param {number} rowCount
               * @param {number} [villagesTargeted]
               */
              setTotals: function(rowCount, villagesTargeted) {
                var amountOfCommandsHeaderCell = $("tr:first", overviewTable).find("th:first"),
                  amountOfRows = $("#amountOfRows");

                assert(amountOfCommandsHeaderCell.length === 1, "couldn't find the command headercell");
                amountOfCommandsHeaderCell.html(amountOfCommandsHeaderCell.html().replace(/\(\d+\)/, "(" + rowCount + ")"));

                if (typeof villagesTargeted !== "undefined") {
                  if (amountOfRows.size() === 0) {
                    var pageSize = $("input[name='page_size']");
                    pageSize.parent().prev().text(trans.sp.commands.totalVillagesAttack);
                    pageSize = pageSize.attr("id", "villagesTargeted").parent().parent().parent();
                    pageSize.append('<tr><th colspan=2>' + trans.sp.incomings.amount + '</th><td id="amountOfRows">' + rowCount + '</td></tr>');
                  } else {
                    $("#amountOfRows").text(villagesTargeted);
                    $("#villagesTargeted").val(villagesTargeted);
                  }
                }
              }
            };

            var columnsToFilterCount = 5;

            // build sangu menu
            var menu = "";
            menu += "<table width='100%' class='vis' id='sangu_menu'>";
            menu += "<tr><th width='1%'>";
            menu += "<input type=button id=sortIt value='" + trans.sp.incomings.dynamicGrouping + "' title='" + trans.sp.incomings.dynamicGroupingTooltip + "'>";
            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=checkbox id=sortShowTotalRow " + (user_data.command.sumRow ? "checked" : "") + "> " + trans.sp.incomings.summation + " ";
            menu += "<input type=button id=sortQuick value='" + trans.sp.incomings.fastGrouping + "' title='" + trans.sp.incomings.fastGroupingTooltip + "'>";
            menu += "</th><th width='1%'>";

            menu += "<input type=button id=sortByAttackId value='" + trans.sp.incomings.sortByAttackId + "' title='" + trans.sp.incomings.sortByAttackIdTooltip + "'>";

            menu += "</th><th width='96%'>";
            menu += "<input type=button id=filterAttack value='" + trans.sp.incomings.showNewIncomings + "'>";

            menu += "</th><th width='1%' nowrap>";
            menu += "<input type=button id=commandsImport value='" + trans.sp.incomings.commandsImport + "' title='" + trans.sp.incomings.commandsImportTooltip + "'>";
            menu += "</th></tr>";
            menu += "</table>";

            // second row
            menu += "<table width='100%' class=vis>";
            menu += "<tr><th width='1%' nowrap>";

            menu += "<input type=checkbox id=defReverseFilter title='" + trans.sp.commands.filtersReverse + "'> " + trans.sp.commands.filtersReverseInfo + ": ";
            menu += "</th>";

            // generate one input field/button filter with a select for the first cells
            var defaultColumnFilters = (function() {
              var headerCells = $("tr:first th", overviewTable),
                cols = [],
                headerCellText;

              for (i = 0; i < columnsToFilterCount; i++) {
                headerCellText = headerCells.eq(i).text();
                if (headerCellText.indexOf(" ") !== -1) {
                  headerCellText = $.trim(headerCellText.substr(0, headerCellText.indexOf(" ")));
                }
                cols.push(headerCellText);
              }
              return cols;
            }());

            /**
             * builds a textinput+select+button filter that filters rows based on table column index
             */
            function buildColumnFilter() {
              var i,
                defualtIndex = pers.get("incomingsColumnFilterIndex"),
                menu = "<th width='99%' nowrap>";

              menu += "<input type='text' size='20' id='filterColumnValue'>";
              menu += "<select id='filterColumnIndex'>";
              for (i = 0; i < defaultColumnFilters.length; i++) {
                menu += "<option value='" + i + "'"
                  + (defualtIndex == i ? " selected" : "") + ">"
                  + defaultColumnFilters[i] + "</option>";
              }
              menu += "</select>";
              menu += "<input type='button' id='filterColumn' value='"
                + trans.sp.incomings.filterColumnButton + "'"
                + "'>";
              menu += "</th>";
              return menu;
            }

            menu += buildColumnFilter();

            //menu += "<th width='97%' nowrap>";
            //menu += "<input type=textbox size=3 id=defFilterContinentText maxlength=2><input type=button id=defFilterContinent value='" + trans.sp.commands.continentFilter + "'>";
            //menu += "</th></tr>";


            menu += "</table>";
            overviewTable.before(menu);

            $("#filterColumnIndex").change(function() {
              pers.set("incomingsColumnFilterIndex", $("#filterColumnIndex").val());
            });

            // switch tooltips on reverse filter checkbox change
            $("#defReverseFilter").change( function () {
              var isChecked = $(this).is(":checked"),
                overviewTrans = trans.sp.incomings;

              //$("#").attr("title", isChecked ? overviewTrans.continentFilterTooltip : overviewTrans.continentFilterTooltipReverse);

              $("#filterColumn").attr(
                "title",
                overviewTrans.filterColumnButtonTooltip.replace(
                  "{type}",
                  isChecked ? overviewTrans.filterColumnButtonTooltipHide : overviewTrans.filterColumnButtonTooltipShow));
            }).change();


            // select all checkbox
            $("#select_all").replaceWith("<input type='checkbox' id='selectAll'>");
            $("#selectAll").change(function() {
              var isChecked = $("#selectAll").is(":checked");
              $("tr", overviewTable).find(":checkbox").prop("checked", isChecked);
            });
            // IMPORT os exported by other player
            $("#commandsImport").click(function() {
              if ($("#textsArea").size() == 0) {
                $(this).parent().parent().parent().append("<tr><td id=textsArea colspan=5></td></tr>");
                $("#textsArea").append(
                    "<textarea cols=80 rows=10 id=commandImportText></textarea>"
                    + "<br>"
                    + "<input type=button value='" + trans.sp.incomings.commandsImport + "' id=commandsImportReal>"
                    + "<input type=button value='" + trans.sp.all.close + "' id=closeTextsArea>");

                $("#closeTextsArea").click(function() {
                  $("#textsArea").parent().remove();
                });

                $("#commandsImportReal").click(function() {
                  var commandsToImport;
                  try {
                    commandsToImport = JSON.parse($("#commandImportText").val());
                    var test = commandsToImport[0].commandName;
                  }
                  catch (e) {
                    alert(trans.sp.incomings.commandsImportError);
                  }

                  var amountReplaced = 0,
                    commandsSent = [],
                    i;

                  for (i = 0; i < commandsToImport.length; i++) {
                    commandsSent[commandsToImport[i].commandId] = commandsToImport[i].commandName;
                  }

                  table.getVillageRows().each(function () {
                    var firstCell = $("td:first", this),
                      commandId = firstCell.find(":input:first").attr("name");

                    //q("inputfield: " + firstCell.find(":input:first").length);
                    //q("commandId = " + commandId + " in cell: " + firstCell.text());

                    //assert(commandId, "couldn't find command id inputfield");
                    //assert(commandId.indexOf("command_ids") === 0, "inputfields have been renamed");
                    commandId = parseInt(commandId.match(/\d+/)[0], 10);
                    if (typeof commandsSent[commandId] !== 'undefined') {
                      var inputField = $(':input[id^="editInput"]', firstCell);
                      //assert(inputField.length === 1, "couldn't find the inputfield");
                      inputField.val(commandsSent[commandId]);
                      inputField.next().click();

                      amountReplaced++;
                    }
                  });

                  alert(trans.sp.incomings.commandsImportSuccess
                          .replace("{replaced}", amountReplaced)
                          .replace("{total}", commandsToImport.length));
                });
              }
            });

            // Sort by attack id (and add extra column)
            $("#sortByAttackId").click(function() {
              $(this).attr("disabled", true);
              table.fixTable();
              table.newColumns.after += 2;

              var diffGroups = user_data.incomings.attackIdDescriptions;
              function getFancyAttackIdDiffDescription(diff) {
                var i;
                for (i = 0; i < diffGroups.length; i++) {
                  if (diff < diffGroups[i].minValue) {
                    return diffGroups[i].text;
                  }
                }

                return user_data.incomings.attackIdHigherDescription;
              }

              // new column in header
              tableHandler.overviewTable.find("tr:first").append("<th>"+trans.sp.incomings.attackId+"</th><th>"+trans.sp.incomings.attackIdDifference+"</th>");

              var rows = table.getVillageRows();
              rows.sortElements(function (rowA, rowB) {
                var a = $("input:first", rowA).attr("name").match(/\d+/)[0];
                var b = $("input:first", rowB).attr("name").match(/\d+/)[0];
                //q($("input:first", rowA).attr("name") + "=>" + a);
                return parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;
              });

              var previousRowAttackId = 0;
              rows.each(function() {
                var attackId = parseInt($(this).find("input:first").attr("name").match(/\d+/)[0], 10),
                  diff = 0,
                  diffDescription = "&nbsp;";

                if (previousRowAttackId != 0) {
                  diff = Math.abs(attackId - previousRowAttackId);
                  diffDescription = getFancyAttackIdDiffDescription(diff);
                }
                previousRowAttackId = attackId;

                $(this).append("<td align=right>"+attackId+"</td><td>"+diffDescription+"</td>");
              });
            });

            // QUICK sort: performs faster but also freezes the screen (ie no countdowns)
            // --> This might also be good in case the page is refreshing too often otherwise
            $("#sortQuick").click(function () {
              trackClickEvent("SortQuick");
              table.fixTable();
              table.hasTotalRows = true;

              var newTable = "";
              var targets = [];
              var commandCounter = 0;
              var addTotalRow = $('#sortShowTotalRow').is(':checked');

              table.getVillageRows().each(function () {
                var target = $("td:eq(1)", this).text();
                var village = getVillageFromCoords(target);
                if (village.isValid) {
                  commandCounter++;
                  if (targets[village.coord] == undefined) {
                    targets.push(village.coord);
                    targets[village.coord] = [];
                  }
                  targets[village.coord].push($(this));
                }
              });

              var mod = 0;
              $.each(targets, function (i, v) {
                mod++;
                var rowColor = "row_" + (mod % 2 == 0 ? 'b' : 'a');
                var amount = 0;
                $.each(targets[v], function (index, row) {
                  var villageId = row.find("td:eq(1) a:first").attr("href").match(/village=(\d+)/)[1];
                  newTable += "<tr class='nowrap " + rowColor + "'"
                    + (villageId == game_data.village.id ? " selected" : "") + ">"
                    + row.html() + "</tr>";
                  amount++;
                });

                if (addTotalRow) {
                  if (amount === 1) {
                    newTable += "<tr class='" + rowColor + " total'><td align=right colspan=" + table.getColspan() + ">&nbsp;</td></tr>";
                  } else {
                    newTable += "<tr class='" + rowColor + " total'><td align=right colspan=" + table.getColspan() + "><b>" + trans.sp.incomings.amount + "&nbsp; " + amount + "</b>&nbsp; &nbsp;</td></tr>";
                  }
                }
              });

              var menu = $("tr:first", overviewTable).html();
              var totalRow = $("tr:last", overviewTable).html();
              overviewTable.html("<table id='incomings_table' class='vis'>" + menu + newTable + totalRow + "</table>");

              table.setTotals(commandCounter, targets.length);
            });





            // DYNAMIC sort incoming attacks
            $("#sortIt").click(function () {
              table.fixTable();
              trackClickEvent("Sort");

              var rows = table.getVillageRows();
              rows.sortElements(function (a, b) {
                a = getVillageFromCoords($("td:eq(1)", a).text());
                b = getVillageFromCoords($("td:eq(1)", b).text());

                return (a.x * 1000 + a.y) > (b.x * 1000 + b.y) ? 1 : -1;
              });

              var amountOfVillages = 0;
              var current = "";
              rows.each(function () {
                var village = $("td:eq(1)", this);
                if (current != village.text()) {
                  current = village.text();
                  amountOfVillages++;
                }
                var type = amountOfVillages % 2 == 0 ? 'row_a' : 'row_b';

                var villageId = village.find("a:first").attr("href").match(/village=(\d+)/)[1];
                this.className = "nowrap " + type + (villageId == game_data.village.id ? " selected" : "");
              });

              table.setTotals(rows.size(), amountOfVillages);
            });
            /**
             *
             * @param {function} filterStrategy return true to hidethe row; false keep row visible (without reverse filter checkbox)
             * @param {Object} options
             */
            function filterVillageRows(filterStrategy, options) {
              options = $.extend({}, {
                checkboxReverses: true
              }, options);

              var reverseFilter = options.checkboxReverses && $("#defReverseFilter").is(":checked"),
                goners = $(),
                villageCounter = 0;

              trackClickEvent(options.gaEventName);

              table.fixTable();

              table.getVillageRows().each(function () {
                var self = $(this);
                if (!reverseFilter != !filterStrategy(self)) {
                  goners = goners.add(self);
                } else {
                  villageCounter++;
                }
              });
              goners.remove();

              // Show totals
              table.setTotals(villageCounter);
            }

            // Show new attacks only
            $("#filterAttack").click(function () {
              var strategy = function(row) {
                return $.trim($("td:first", row).text()) != trans.tw.command.attack;
              };

              filterVillageRows(strategy, {
                gaEventName: "FilterNewAttacks",
                checkboxReverses: false
              });
            });


            // Filter rows on column 0 - 3 (command, target, origin, player)
            $("#filterColumn").click(function() {
              var filter = {
                index: $("#filterColumnIndex").val(),
                searchText: $.trim($("#filterColumnValue").val()).toLowerCase()
              };

              var filterStrategy = function(row) {
                return row.find("td").eq(filter.index).text().toLowerCase().indexOf(filter.searchText) === -1;
              };

              filterVillageRows(filterStrategy, {
                gaEventName: "column-" + $("#filterColumnIndex").text()
              });
            });


          } catch (e) { handleException(e, "overview-incomings"); }
          //console.timeEnd("overview-incomings");
        }());
      }

      // make the editting groups box less wide
      // and add alternating row colors
      $("#edit_group_href").click(function () {
        var groupTable = $("#group_list");
        groupTable.width(300);

        groupTable.find("th:first").attr("colspan", "3");
        var mod = 0;
        groupTable.find("tr:gt(0)").each(function () {
          mod++;
          $(this).addClass("row_" + (mod % 2 == 0 ? "a" : "b"));
        });
      });

      // change troops overview link to active sangu page
      if (user_data.command.changeTroopsOverviewLink) {
        var troopsOverviewLink = $("#overview_menu a[href*='mode=units']");
        troopsOverviewLink.attr("href", troopsOverviewLink.attr("href") + "&type=own_home");
      }

      if (user_data.overviews.addFancyImagesToOverviewLinks) {
        var overviewLinks = $("#overview_menu a");
        overviewLinks.each(function(index) {
          var overviewLink = $(this),
            imageToAdd = "";

          switch (index) {
            case 0:
              //				overviewLink.parent()
              //                    .css("background-image", 'url("http://cdn.tribalwars.net/graphic/icons/header.png")')
              //				    .css("background-repeat", "no-repeat")
              //				    .css("background-position", "-324px 0px")
              //				    .css("background-size", "200px Auto");
              //
              //				overviewLink.prepend("&nbsp; &nbsp;");
              break;
            case 1:
              imageToAdd = "graphic/buildings/storage.png";
              break;
            case 2:
              imageToAdd = "graphic/buildings/market.png";
              break;
            case 3:
              if (overviewLink.parent().hasClass("selected")) {
                $("table.modemenu:last a", content_value).each(function(index) {
                  imageToAdd = "";
                  switch (index) {
                    case 1:
                      imageToAdd = "graphic/buildings/place.png";
                      break;
                    case 2:
                      imageToAdd = "graphic/pfeil.png";
                      break;
                    case 3:
                    case 4:
                      $(this).css("opacity", "0.5");
                      break;
                    case 5:
                      imageToAdd = "graphic/command/support.png";
                      break;
                    case 6:
                      imageToAdd = "graphic/rechts.png";
                      break;
                  }

                  if (imageToAdd !== "") {
                    $(this).prepend("<img src='http://cdn.tribalwars.net/"+imageToAdd+"' title='"+overviewLink.text() + " &gt; " + $(this).text()+"' /> &nbsp;");
                  }
                });
              }

              imageToAdd = "graphic/unit/unit_knight.png";
              break;
            case 4:
              if (overviewLink.parent().hasClass("selected")) {
                $("table.modemenu:last a", content_value).each(function(index) {
                  imageToAdd = "";
                  switch (index) {
                    case 1:
                      imageToAdd = "graphic/command/attack.png";
                      break;
                    case 2:
                      imageToAdd = "graphic/command/support.png";
                      break;
                    case 3:
                      imageToAdd = "graphic/command/return.png";
                      break;
                  }

                  if (imageToAdd !== "") {
                    $(this).prepend("<img src='http://cdn.tribalwars.net/"+imageToAdd+"' title='"+overviewLink.text() + " &gt; " + $(this).text()+"' /> &nbsp;");
                  }
                });
              }

              imageToAdd = "graphic/command/attack.png";
              break;
            case 5:
              if (overviewLink.parent().hasClass("selected")) {
                $("table.modemenu:last a", content_value).each(function(index) {
                  imageToAdd = "";
                  switch (index) {
                    case 1:
                      imageToAdd = "graphic/command/attack.png";
                      break;
                    case 2:
                      imageToAdd = "graphic/command/support.png";
                      break;
                  }

                  if (imageToAdd !== "") {
                    $(this).prepend("<img src='http://cdn.tribalwars.net/"+imageToAdd+"' title='"+overviewLink.text() + " &gt; " + $(this).text()+"' /> &nbsp;");
                  }
                });
              }

              imageToAdd = "graphic/unit/att.png";
              break;
            case 6:
              imageToAdd = "graphic/buildings/main.png";
              break;
            case 7:
              imageToAdd = "graphic/buildings/smith.png";
              break;
            case 8:
              imageToAdd = "graphic/group_right.png";
              overviewLink.prepend("<img src='http://cdn.tribalwars.net/"+imageToAdd+"' title='"+overviewLink.text()+"' /> &nbsp;");
              imageToAdd = "graphic/group_left.png";
              break;
            case 9:
              imageToAdd = "graphic/premium/coinbag_14x14.png";
              overviewLink.parent().width(150);
              break;
          }
          if (imageToAdd !== "") {
            overviewLink.prepend("<img src='http://cdn.tribalwars.net/"+imageToAdd+"' title='"+overviewLink.text()+"' />&nbsp;&nbsp;");
          }
        });
      }
    }

    var logoffLink = $("#linkContainer a:last");
    if (user_data.global.duplicateLogoffLink) {
      $("#linkContainer a:first").after(" - ").after(logoffLink.clone());
    }

    logoffLink.before("<a target='_blank' title='"+trans.sp.sp.moreScriptsTooltip+"' href='"+server_settings.scriptsDatabaseUrl+"'>"+trans.sp.sp.moreScripts+"</a>")
      .before(" - <a target='_top' id='sanguPackageEditSettingsLink' href='"+getUrlString("screen=settings&mode=sangu")+"' title='" + trans.sp.sp.sanguLinkTitle + "'>Sangu Package</a> - ");

    (function() {
      var position = $("#sanguPackageEditSettingsLink").position(),
        options = {
          left: position.left,
          top: ($(window).height() - 100)
        },
        content = {
          body: trans.sp.sp.firstTimeRunEditSettings
        };

      createFixedTooltip("sanguActivatorSettingsTooltip", content, options);
    }());

    (function() {
      //console.time("resourceColoring");
      try {
        var storage = parseInt($("#storage").text(), 10);

        // Color resources based on how full the storage place is
        if (user_data.global.resources.active) {
          $("#wood,#iron,#stone").each(function () {
            var x = parseInt(this.innerHTML / storage * 10 - 1, 10);
            $(this).css("background-color", user_data.global.resources.backgroundColors[x]);
          });
        }

        // Blink full resources
        if (user_data.global.resources.blinkWhenStorageFull) {
          $("#wood,#iron,#stone").filter(function () {
            return parseInt(this.innerHTML, 10) == storage;
          }).css({ "font-weight": "bolder", "color": "black" }).fadeOut().fadeIn();
        }
      } catch (e) { handleException(e, "resourcecoloring"); }
      //console.timeEnd("resourceColoring");
    }());
    // adjust links to incoming attacks/support
    // keep track of current amount of incomings
    if (user_data.global.incomings.editLinks || user_data.global.incomings.track) {
      (function() {
        //console.time("incomingsindicator");
        try {
          var incoming = $("table.box:last"),
            incomingAttacksLinks = $("a[href*='subtype=attacks']", incoming),
            variableReplacer = function (text) {
              var difference = "";
              if (sinceLastCheckTimeNew > 0) {
                difference += "+" + sinceLastCheckTimeNew;
                if (sinceLastCheckTimeArrived > 0) {
                  difference += " ";
                }
              }
              if (sinceLastCheckTimeArrived > 0) {
                difference += "-" + sinceLastCheckTimeArrived;
              }

              return text.replace("{difference}", difference)
                .replace("{elapsed}", lastCheckTimeElapsed)
                .replace("{time}", lastCheckTime)
                .replace("{current}", currentAmountOfIncomings
                           .replace("{saved}", lastKnownAmountOfIncomings));
            };

          if (incomingAttacksLinks.size() > 0) {
            if (user_data.global.incomings.editLinks) {
              incomingAttacksLinks.attr("href", incomingAttacksLinks.attr("href") + "&page=-1&group=0");
            }
            if (user_data.global.incomings.track) {
              incomingAttacksLinks.parent().css("white-space", "nowrap");

              // Split current and new attacks in incomings link
              var incomingAttacksAmountLink = incomingAttacksLinks.last();
              var currentAmountOfIncomings = incomingAttacksAmountLink.text().match(/\d+/)[0];
              var lastKnownAmountOfIncomings = parseInt(pers.get("lastKnownAmountOfIncomings" + game_data.player.sitter), 10) || 0,
                sinceLastCheckTimeNew = parseInt(pers.get("lastKnownAmountOfIncomingsAdded" + game_data.player.sitter), 10) || 0,
                sinceLastCheckTimeArrived = parseInt(pers.get("lastKnownAmountOfIncomingsRemoved" + game_data.player.sitter), 10) || 0;

              var lastCheckTime = pers.get("lastKnownAmountOfIncomingsTime" + game_data.player.sitter);
              var lastCheckTimeElapsed;
              if (!lastCheckTime) {
                lastCheckTime = trans.sp.incomings.indicator.lastTimeCheckNotYetSet;
                lastCheckTimeElapsed = lastCheckTime;
              } else {
                lastCheckTime = new Date().getTime() - parseInt(lastCheckTime, 10);
                lastCheckTimeElapsed = prettyDate(lastCheckTime);
                lastCheckTime = twDateFormat(new Date(lastCheckTime));
              }

              if (currentAmountOfIncomings != lastKnownAmountOfIncomings || sinceLastCheckTimeNew > 0 || sinceLastCheckTimeArrived > 0) {
                var newAttacks = currentAmountOfIncomings - lastKnownAmountOfIncomings;
                if (newAttacks > 0) {
                  sinceLastCheckTimeNew += newAttacks;
                  pers.set("lastKnownAmountOfIncomingsAdded" + game_data.player.sitter, sinceLastCheckTimeNew);

                } else if (newAttacks < 0) {
                  sinceLastCheckTimeArrived -= newAttacks;
                  pers.set("lastKnownAmountOfIncomingsRemoved" + game_data.player.sitter, sinceLastCheckTimeArrived);
                }

                pers.set("lastKnownAmountOfIncomings" + game_data.player.sitter, currentAmountOfIncomings);

                $("#incomings_amount").html(variableReplacer(user_data.global.incomings.indicator));
                incomingAttacksLinks.attr("title", variableReplacer(user_data.global.incomings.lastTimeCheckWarning));
                incomingAttacksLinks.fadeOut("slow").fadeIn("slow");
              }

              // extra image to set the lastCheckTime on incomings overview page
              if (current_page.screen === "overview_villages" && current_page.mode === "incomings") {
                // Tooltip for first time users
                if (lastCheckTime == trans.sp.incomings.indicator.lastTimeCheckNotYetSet) {
                  // show info tooltip
                  var position = incomingAttacksAmountLink.position();
                  var options = {
                    left: position.left - 200,
                    top: position.top + 35,
                    width: 250
                  };
                  var content = {body: trans.sp.incomings.indicator.lastTimeCheckHintBoxTooltip.replace("{img}", "<img src='graphic/ally_forum.png'>")};
                  createFixedTooltip("incomingsIndicatorHelp", content, options);
                }

                // change last incomings-check time
                incomingAttacksLinks.last().parent().after(
                    "<td class='box-item' id='changeLastCheckTimeBox' style='white-space: nowrap'><a href='#' id='changeLastCheckTime'>&nbsp;"
                    + "<img src='graphic/ally_forum.png' style='padding-top: 5px' "
                    + "title='"+variableReplacer(user_data.global.incomings.indicatorTooltip)+"'/>&nbsp;</a></td>");

                // Set last incomings-check time
                $("#changeLastCheckTime").click(function() {
                  var newCheckTime = new Date();
                  pers.set("lastKnownAmountOfIncomingsTime" + game_data.player.sitter, newCheckTime.getTime());
                  pers.set("lastKnownAmountOfIncomings" + game_data.player.sitter, currentAmountOfIncomings);
                  pers.set("lastKnownAmountOfIncomingsAdded" + game_data.player.sitter, 0);
                  pers.set("lastKnownAmountOfIncomingsRemoved" + game_data.player.sitter, 0);

                  pers.setGlobal("fixedToolTip_incomingsIndicatorHelp", 1);
                  $("#changeLastCheckTimeBox").fadeOut();
                  window.location.href = window.location.href;
                });
              }
            }
          } else {
            // When there are no more incomings, stop tracking
            if (user_data.global.incomings.track) {
              pers.set("lastKnownAmountOfIncomings" + game_data.player.sitter, 0);
              pers.set("lastKnownAmountOfIncomingsAdded" + game_data.player.sitter, 0);
              pers.set("lastKnownAmountOfIncomingsRemoved" + game_data.player.sitter, 0);
            }
          }

          // change incoming support link
          if (user_data.global.incomings.editLinks) {
            var incomingSupport = $("a[href*='subtype=supports']", incoming);
            if (incomingSupport.size() > 0) {
              if (user_data.global.incomings.editLinks) {
                incomingSupport.attr("href", incomingSupport.attr("href") + "&page=-1&group=0");
              }
            }
          }
        } catch (e) { handleException(e, "incomingsindicator"); }
        //console.time("incomingsindicator");
      }());
    }
    if (server_settings.ajaxAllowed && user_data.global.visualizeFriends) {
      (function() {
        //console.time("friends");
        try {
          function Friends() {
            this.lastCheck = new Date().getTime();
            this.online = {
              names: "",
              amount: 0
            };
            this.offlineAmount = 0;
          }

          /**
           * Insert a 'friends' link with visual online/offline indication
           */
          function updateTWFriendsLink() {
            var friendsLink = $("<a href='" + getUrlString("&screen=buddies") + "'></a>");
            friendsLink.html(
              trans.sp.rest.friendsOnline
                .replace("{friends}", friendsLink.text())
                .replace("{onlineimg}", "<img src='graphic/dots/green.png' />")
                .replace("{online#}", friends.online.amount)
                .replace("{offlineimg}", "<img src='graphic/dots/red.png' />")
                .replace("{offline#}", friends.offlineAmount)
            );
            if (friends.online.amount > 0) {
              friendsLink.attr("title", trans.sp.rest.friendsOnlineTitle.replace("{playerNames}", friends.online.names.substr(1)));
            }
            $("#sanguPackageEditSettingsLink").before(friendsLink).before(" - ");
          }

          /**
           * Parse the #content_value and update the friends link.
           * Is called from ajax call.
           * @param {string} overview the #content_value of the friends page
           */
          function parseFriendsTable(overview) {
            var friendsTable = $("h3+table.vis:first", overview);
            if (friendsTable.size() == 1) {
              var friendRows = friendsTable.find("tr:gt(0)");
              friendRows.each(function() {
                var friendName = $.trim($("a:first", this).text());
                var statusIndicatorImage = $("img:first", this);
                if (/red\.png/.test(statusIndicatorImage.attr("src"))) {
                  friends.offlineAmount++;
                } else {
                  if (friendName != game_data.player.name) {
                    friends.online.names += ", " + friendName;
                    friends.online.amount++;
                  }
                }
              });

              // localStorage save of online friends
              pers.set("friendsOnline", JSON.stringify(friends));

              updateTWFriendsLink();
            }
          }

          var friends = pers.get("friendsOnline");

          // check friends page only every 5 minutes (or when on friends page itself)
          if ($("#village_link").val() == "/game.php?screen=buddies") {
            friends = new Friends();
            parseFriendsTable(content_value);
          }
          else {
            if (friends) {
              friends = JSON.parse(friends);
            }
            if (!friends || friends.lastCheck < new Date().getTime() - 1000 * 60 * 3) {
              friends = new Friends();
              ajax("buddies", parseFriendsTable);
            } else {
              updateTWFriendsLink();
            }
          }
        } catch (e) { handleException(e, "friends"); }
        //console.timeEnd("friends");
      }());
    }




    //var end_time = new Date();
    //console.timeEnd("SanguPackage");
    //q("" + pad(Math.abs(start_time.getTime() - end_time.getTime()), 3) + " -> " + location.search);
  }
}

if (location.href.indexOf('sangu.be') !== -1) {
  // sangu.be
  (function() {
    // Check current version with version on the sangu.be site
    var lastVersion = $("#sanguPackageVersion"),
      resultBox = $("#versionCheckResult");

    if (lastVersion.length === 1) {
      resultBox.show();
      resultBox.css("padding", "20px");
      resultBox.css("margin", "10px");
      resultBox.css("font-size", 18);
      resultBox.css("height", 30);
      resultBox.css("text-align", "center");

      if ('8.34.1'.indexOf(lastVersion.text()) === 0) {
        resultBox.css("background-color", "green");
        resultBox.text("Je hebt de laatste versie!");
      } else {
        resultBox.css("background-color", "red");
        resultBox.text("Er is een nieuwe versie beschikbaar!");
      }
    }
  }());

} else if (location.href.indexOf('tribalwars.nl') !== -1) {
  // TribalWars page
  (function (func, GM_xmlhttpRequest) {
    var lastCheck = sessionStorage.lastUpdateCheck,
      currentVersion = '8.34.1';

    function displayNewVersion() {
      var a = document.createElement('a');
      var linkText = document.createTextNode(" - Sangu Package Update!");
      a.appendChild(linkText);
      a.title = "Er is een update voor het Sangu Package beschikbaar!";
      a.href = "http://sangu.be";
      a.style.color = "black";
      a.style.fontWeight = "bolder";
      a.style.backgroundColor = "yellow";

      document.getElementById("linkContainer").appendChild(a);
    }

    if (typeof GM_xmlhttpRequest !== "undefined") {
      if (!lastCheck) {
        sessionStorage.lastUpdateCheck = "done";
        try
        {
          // GM_xmlhttpRequest didn't work when put in sangu_ready
          GM_xmlhttpRequest({
                              method: "GET",
                              url: "http://www.sangu.be/api/sangupackageversion.php",
                              synchronous: false,
                              onload: function(response) {
                                if (response.responseText !== currentVersion) {
                                  sessionStorage.lastUpdateCheck = "hasNew";
                                  displayNewVersion();
                                }
                              }
                            });
        }
        catch (e)
        {
          console.log("error fetching latest version number:");
          console.log(e);
        }
      } else if (lastCheck === "hasNew") {
        displayNewVersion();
      }
    }

    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    if (window.mozInnerScreenX !== undefined) {
      // Firefox has troubles with renaming commands, villages, ... (it works some of the time)
      // But waiting for document.ready slows down the script so only wait for this on FF
      // An optimization could be to put document.readys only around those blocks that are
      // problematic.
      script.textContent = '$(document).ready(' + func + ');';

    } else {
      script.textContent = '(' + func + ')();';
    }

    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
  }(sangu_ready, (typeof GM_xmlhttpRequest === "undefined" ? undefined : GM_xmlhttpRequest)));
}


