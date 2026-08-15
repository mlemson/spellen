# Speelveldstudio 2.40 Online

Deze map kan rechtstreeks op GitHub Pages worden gepubliceerd. `index.html` bevat de bestaande Speelveldstudio plus de online tafelmodus.

## Nieuw in 2.40

2.40 voegt twee grote onderdelen toe bovenop 2.39:

1. **Een gezamenlijke partij-einde en eindstand voor alle online spellen.**
2. **Volledige online Locus-kaarttafel** met één gedeelde deck, twee open kaarten en een actieve speler die als eerste kiest.

Persoonlijke scorebladen blijven lokaal op het apparaat van iedere speler. De host bewaart de autoritatieve tafelstaat: worpen/kaarten, actieve speler, beurtfase, globale claims/sluitingen, gereedstatus, eindconditie en de uiteindelijke score-samenvattingen.

## Gezamenlijk einde en scoreoverzicht

Wanneer een speler of de gezamenlijke tafel een eindvoorwaarde activeert, stopt de partij niet midden in dezelfde gedeelde worp. De huidige gezamenlijke beurt wordt eerst door de overige spelers afgehandeld. Daarna:

- worden verdere worpen/kaartbeurten geblokkeerd;
- levert iedere client zijn berekende eindscore aan de host;
- zet de host de partij op `finished`;
- verschijnt bij iedereen hetzelfde eindscherm met ranglijst, score en een korte spel-specifieke samenvatting;
- kan de host vanuit de kamer een nieuwe online partij starten.

Bij een gelijke puntenscore wordt geen zelfbedachte tiebreak toegepast: spelers delen dezelfde positie. Bij **Keer op Keer 3** is het bereiken van alle X-fiches de winconditie; spelers die dit in dezelfde laatste gedeelde beurt bereiken kunnen gezamenlijk eerste worden.

### Eindcondities die online worden gevolgd

- **Keer op Keer 1 / 2:** tweede complete kleur activeert het einde; de lopende gedeelde beurt wordt afgemaakt. De 30-beurten-sololimiet en de snelle-finish-solobonus van Keer op Keer 2 worden online niet toegepast.
- **Keer op Keer 3:** alle X-fiches weggespeeld activeert het einde.
- **Clever-edities:** einde na het online aantal rondes (6 / 5 / 4 bij 2 / 3 / 4 spelers).
- **Qwixx:** vier mislukte worpen bij een speler of de tweede globale rijsluiting.
- **Knister:** na 25 gedeelde worpen.
- **Sixto:** drie globaal gesloten kleuren; een speler die persoonlijk niet meer verder kan, kan individueel klaar raken zonder de andere spelers direct af te kappen.
- **Railroad Ink:** na ronde 7.
- **Locus:** nadat de volledige gedeelde deck is verwerkt en daarna iedere speler het muntenatelier heeft afgerond.

## Locus online

De online Locus-flow gebruikt dezelfde 48 kaarten en dezelfde persoonlijke plaatsings-, bonus-, munt- en scoringslogica als de lokale versie, maar de kaarttafel is nu gedeeld.

Per kaartbeurt:

1. de actieve speler opent de kaartbeurt;
2. de host legt automatisch **1 kaart gesloten** uit de gezamenlijke deck af;
3. de volgende **2 kaarten worden voor iedereen opengelegd**;
4. de actieve speler kiest als eerste één van die twee kaarten;
5. de andere speler(s) krijgen de andere open kaart toegewezen;
6. iedereen verwerkt de toegewezen kaart op het eigen scoreblad;
7. de bestaande optie om voor **3 munten ook de andere kaart** te spelen blijft beschikbaar;
8. zodra iedereen gereed is, roteert de actieve speler;
9. na 48 kaarten start voor iedereen de atelierfase;
10. iedere speler besteedt desgewenst resterende munten en kiest daarna **Mijn eindscore vastzetten**;
11. als iedereen dat heeft gedaan verschijnt de gezamenlijke eindstand.

Met 48 kaarten zijn dit precies 16 gedeelde kaartbeurten van telkens 3 verwerkte kaarten.

## Andere online spellen

De bestaande 2.39-synchronisatie blijft aanwezig:

- Keer op Keer 1/2/3: tafelworp, actieve/passieve keuze en race-vrije first-claims;
- Clever: gedeelde worp en zilveren dienblad;
- Qwixx: witte actie voor iedereen, kleuractie alleen actief en globale rijsluitingen;
- Knister: dezelfde som voor iedereen;
- Sixto: actieve beslissing houden/hergooien en globale gesloten kleuren;
- Railroad Ink: dezelfde routeworp voor iedereen.

## Publiceren op GitHub Pages

Voor deze repository (`mlemson/spellen`) staat de site direct in de root:

1. Zorg dat `index.html` en `.nojekyll` in `main` in de hoofdmap staan.
2. Open **Settings → Pages**.
3. Kies **Deploy from a branch**.
4. Kies `main` en `/(root)`.
5. Sla op en open daarna `https://mlemson.github.io/spellen/`.

Er is geen buildstap nodig.

## Online spelen

1. Eén speler opent **Online → Kamer maken**.
2. Deel de link of de 6-teken kamercode.
3. Andere spelers kiezen **Online → Deelnemen**.
4. De host kiest het spel.
5. De actieve speler start de gedeelde worp/kaartbeurt.
6. Iedereen verwerkt zijn eigen scoreblad.
7. Bij het spel-einde verschijnt automatisch de gezamenlijke eindstand.

## Techniek

- Statische GitHub Pages-site.
- PeerJS 1.5.5 via een vastgepinde jsDelivr-URL met Subresource Integrity.
- PeerJS/WebRTC DataConnections voor de browser-naar-browserverbindingen.
- Hostbrowser is autoritatief voor de publieke tafelstaat.
- Online protocolversie is in 2.40 verhoogd naar **2**. Een 2.39-client kan daardoor niet stilzwijgend deelnemen aan een 2.40-kamer.

De hostpagina moet open blijven. Een refresh van de host beëindigt de huidige kamer. Op sterk afgeschermde bedrijfs-/schoolnetwerken kan WebRTC geblokkeerd worden; voor maximale betrouwbaarheid zou later een eigen PeerServer/TURN-opzet nodig zijn.

## Vertrouwensmodel

Dit blijft bewust een vrienden-/tafelspelmodel. De host bepaalt de gedeelde tafelstaat, maar een persoonlijke score wordt op het apparaat van die speler berekend en bij het einde aan de host gemeld. Een aangepaste kwaadwillende client zou dus over zijn score kunnen liegen. Voor publiek competitief spel is server-side validatie nodig.

## Testen

Zie `TESTPLAN.md`. Voor deze build zijn de JavaScript-syntax en de nieuwe Locus/eindstand-state-machines automatisch gecontroleerd. Doe vóór breed gebruik nog een echte test met minimaal twee apparaten/netwerken.
