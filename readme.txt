Oppgave 2 – Teknisk kompetanse
    I denne oppgaven har jeg sørget for at disse hovedpunktene er implementert:

        1. Et brukersystem må være på plass, med andre ord må brukerne av appen ha mulighet til å
        registrere seg, logge inn og logge ut.
        2. Kun innloggede brukere skal kunne legge til nye annonser. Gjester (ikke-innloggede brukere) - ved bruk av auth-token og router-guard
        skal kunne se publiserte annonser.
        3. Presentere en oversikt over alle annonser som er tilgjengelig. Dette kan for eksempel være i
        liste- eller grid-format.
        4. Hver annonse må det gå an å trykke seg inn på for å få mer informasjon

    Jeg har kjørt appen i både iOS og Android simulator.
    Men jeg har hovedsaklig benyttet meg av Android siden jeg har en android telefon. Hos meg fungerer appen fint på begge simulatorene.
    Opptaket er tatt opp fra min telefon.


    Kilder for hjelp og insperasjon legges ved på slutten av dette dokumentet.

Ekstra funksjonalitet:

• Innslag av eget design med retro(spill)-tema:

    For mitt innslag av eget design, har jeg lagt til et retroGame font, i tillegg til orangsje knapper og border på kort og bilder som var ment for passe sammen med svart bakgrunn.
    Men siden implementering av capacitor sitt google-maps krever at jeg har hvit bakgrunn, så er det ikke helt som jeg ønsket. Men kortene er svarte og passer med
    de lyse fargene som jeg har lagt til.

    Jeg har også valgt å bruke en lyse-blå hakkete progress-bar som feedback til brukeren, mer om det lengere nede.

• Gi brukeren mulighet til å søke i- og/eller filtrere annonser på markedsplassen:

    I hjemme siden har jeg lagt til et søke felt fra Ionic sitt dokumentasjon som gjør et nytt kall til directus ved at jeg filtrer for hvert input som blir tastet inn.
    Hvis queryen innholder inputet kommer resultatet opp. I tillegg har jeg lagt til en if-sjekk hvis inputet er tomt, så fetcher den alle annonsene

• Kommunikasjon mellom brukere, f.eks. meldingssystem mellom selger og mulig kjøper:

    Jeg har lagt til en chat side hvor brukeren kan sende melding til eieren av annonsen. Kommentarene på PostChatPage forklarer hvordan det fungerer
    Som det er lagt opp nå, kan brukeren se meldingene som eieren sender og sitt eget.
    Jeg hadde tenkt å gjøre den mer opptimal, men mtp. flere pågående eksamener, var dette det beste jeg kunne få til for nå.

• «Spørsmål og svar»-seksjon / kommentarfelt inne på enkelt-annonse:

    Jeg har lagt til et kommentar felt for hver annonse ved at den tar imot id-en som et fremmed nøkkel for riktig relasjon

• Kamera (Capacitor Camera) for å ta bilder av salgsobjektet:

    Kamera funksjonalitet er lagt til både når man skal legge til et nytt annonse eller profilbilde

• Mer enn ett bilde per annonse hvor man enten kan sveipe gjennom bilder, eller se bildene i et «galleri» i annonsen:

    Man kan legge til flere enn et bilde, når man lager et nytt annonse, så bilr bildene lagt til i et ion-row med ion-col for hvert bilde for å lage en grid av bildet. (Mer detaljer i kommentarer på koden)
    RetroGamePostCard har en ion-slides i seg med en løkke med ion-slide for hvert bilde, slik at man kan sveipe gjennom bildene.

• Fillagring via Directus, for lagring av blant annet bilder:

    For å kunne lagre flere bilder så måtte jeg benytte meg av files feltet på directus, alle filene har sitt eget id som jeg brukte for legge til bilder og vise de

• GPS (Capacitor Geolocation) for å hente ut hvor selger befinner seg i landet:

    Jeg har brukt geolocation i NewPostPage. Når brukeren går inn i siden, registrer den kordinantene til brukeren, som blir da lagt til i annonsen når den blir lagt ut.
    Hvert annonse har kordinater fra da man går inn i siden. Om man ikke vil dele lokasjonen sin, blir kordinatene 0 og man må oppgi addressen i beskrivelse feltet.

• Bruk av Google Maps, Mapbox eller annen kartleverandør for å vise selgers lokasjon:

    I PostMapPage har jeg lagt til et kart fra Capacitro sitt googlemaps dokumentasjon. Den viser alle annonsene som er lagt ut, hvis man trykker på en av marøkrene så blir man sendt til siden for den gjeldene markøeren

• Tilbakemeldinger/feedback ved bruker-interaksjon (feilmeldinger, loading-spinnere, m.m.):

    For feilmeldinger så har jeg tatt lagt til en gul alert boks som dukker opp når noe galt skjer.
    De feilmeldingene som jeg antok at en vanlig bruker ikke forstår har jeg gjort om til mine egne feilmeldinger på norsk.

    For feedback har jeg valgt å bruke ion-progress-bar med hakkete linjer som innslag av retro-game desing. Den dukker opp på alle siden som bruker api kall.

• Egen profilside for innlogget bruker:

    En egen profilside har blitt lagt til hvor man kan se profilbilde, brukernavn og email.
    I tillegg har jeg lagt til at man kan endre på navn og email, endring av bilde var mulig å til, men har ikke hatt nok tid til å ta det med.

    Brukeren kan også slette sin egen bruker og alle annosner, kommentarer og chatmeldinger som tilhører dem.

• Bruk av npm-moduler (npm install [pakkenavn] –-save):

    Dette er alle moduler/pakker jeg har benyttet meg av.
    IDE-en min har auto install av pakker jeg bruker, så trengte å kjøre npm install kun en gang for både directus og capacitor pakker

      "@capacitor/android": "4.4.0",
      "@capacitor/app": "4.1.0",
      "@capacitor/camera": "^4.1.3",
      "@capacitor/core": "4.4.0",
      "@capacitor/geolocation": "^4.0.1",
      "@capacitor/google-maps": "^4.3.0",
      "@capacitor/haptics": "4.0.1",
      "@capacitor/keyboard": "4.0.1",
      "@capacitor/status-bar": "4.0.1",
      "@directus/sdk": "^10.1.4",



• Bruk av relevante eksterne API-er (REST/GraphQL):

    API-ene jeg har benyttet meg av er graphql spørringer mot directus sitt API

• Implementasjon av accessibility-prinsipper:

    Siden brukeren mest sannsylig kommer mest til å logge in/ut og legge til nye poster, har jeg lagt til en ion-fab knapp som gir enkel tilgang til disse funksjonalitetene.
    Knappen ligger nederst på siden så den er enkel komme fram til, og lett å forstå. Siden kart og profil siden ikke blir brukt ofte, ligger de øverst sammen med headeren.
    Søkefeltet har blitt lagt opp slik at søkingen skjer med engang noen taster noe så man slipper å trykke på en søk knapp.
    Kommentarer og meldinger har blitt satt opp med enkle og tydlige tegn og instrukkser hvis man ønsker å benytte seg av de.
    Til slutt har jeg lagt til en modal for å enkelt kunne endre brukerens navn eller email. Om brukeren ønsler å slette brukeren sin, så kommer en poppup for å bekrefte at brukeren og innholdet blir slettet.


Referanse og Kilder:
    https://forum.ionicframework.com/t/fab-labels-in-ionic-4/139823/11 - LABEL FOR FAB
    https://www.youtube.com/watch?v=-Qm-tG4Kt9s - ION-SLIDES - OGSÅ FRA IONIC DOKUMENTASJON
    https://capacitorjs.com/docs/apis/google-maps - GOOGLE MAPS, NPM MODULER
    https://ionicframework.com/docs/api/grid - ion grid
    (
    https://distancematrix.ai/geocoding-api#reverse_geocoding,
    https://stackoverflow.com/questions/19511597/how-to-get-address-location-from-latitude-and-longitude-in-google-map,
    https://softauthor.com/google-maps-api-geocode-javascript/
    ) -> GEOCODING FOR Å KUNNE HENTE ADDRESSE FRA KORDINATER
    https://v2.vuejs.org/v2/guide/conditional.html - v-if
    https://www.onlinewebfonts.com/download/4c19fc875e7ba1e6831129de3ab5ac0b - Retro game font
    https://ionicframework.com/docs/api/select#object-value-references - ion-select
    https://docs.directus.io/reference/system/users.html - SLETTING OG ENDRING AV BRUKER