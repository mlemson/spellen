# Testplan Speelveldstudio 2.40 Online

Gebruik voor de eindtest bij voorkeur twee echte apparaten of twee aparte browserprofielen. Test minstens één keer via verschillende verbindingen (bijvoorbeeld wifi + mobiele hotspot).

## Automatisch gecontroleerd tijdens bouw

- [x] Uiteindelijke inline JavaScript door `node --check` zonder syntaxfouten.
- [x] Locus-state-machine getest met exact uit `index.html` geëxtraheerde functies: 48 kaarten, 1 gesloten + 2 open, actieve keuze, passieve kaart, spelerrotatie, atelier en gezamenlijke finish.
- [x] Algemene gedeelde eindflow getest met meerdere spelers: laatste beurt blijft open, alle resultaten worden verzameld en pas daarna `finished=true`.
- [x] Keer op Keer 3-ranglijst getest op gelijktijdige wintrigger: beide spelers kunnen positie 1 delen.

Een volledige echte WebRTC-test met twee browserinstanties kon in de bouwomgeving niet worden uitgevoerd doordat browsernavigatie daar administratief geblokkeerd is. Daarom blijft onderstaande apparaat-test belangrijk.

## Basisverbinding

- [ ] Host maakt kamer en ziet 6-teken code.
- [ ] Gast gebruikt link/code en verschijnt bij beide spelers.
- [ ] Alleen host kan een nieuwe gezamenlijke partij starten.
- [ ] Alleen de actieve speler kan de relevante gedeelde worp/kaartbeurt starten.
- [ ] Vertrekkende gast blokkeert de beurt niet.
- [ ] Host sluiten geeft gasten een begrijpelijke verbindingsmelding.
- [ ] Een 2.39-client wordt geweigerd door een 2.40-kamer (protocolversie verschilt).

## Gezamenlijk einde en eindstand

- [ ] Eindtrigger stopt een spel niet midden in de reeds gestarte gedeelde beurt.
- [ ] Spelers die de laatste beurt nog niet hebben verwerkt kunnen die afmaken.
- [ ] Daarna kan niemand een nieuwe worp/kaartbeurt starten.
- [ ] Eindstand opent bij alle spelers automatisch.
- [ ] Namen en scores staan bij iedereen in dezelfde volgorde.
- [ ] Gelijke puntentotalen delen een positie.
- [ ] `Eindstand` in de online balk opent het overzicht opnieuw.
- [ ] Alleen de host ziet/kan `Nog een online partij` gebruiken.
- [ ] Nieuwe online partij sluit de oude eindstand en wist de nieuwe partijstaat correct.

## Keer op Keer 1 / 2

- [ ] Worp 1–3: iedereen ziet alle dobbelstenen.
- [ ] Worp 4+: actieve speler kiest eerst, anderen krijgen restant.
- [ ] Tweede complete kleur activeert de laatste gezamenlijke beurt.
- [ ] Online partij stopt niet automatisch bij 30 beurten.
- [ ] KOK2 krijgt online geen solobonus voor ongebruikte beurten.
- [ ] Gelijktijdige first-claims binnen dezelfde worp blijven race-vrij.

## Keer op Keer 3

- [ ] Bereiken van alle X-fiches activeert het einde.
- [ ] Andere spelers ronden diezelfde gedeelde beurt nog af.
- [ ] Twee spelers die in dezelfde slotbeurt alle X-fiches bereiken delen positie 1.

## Clever

- [ ] Maximaal vier spelers.
- [ ] Eén gedeeld zilveren dienblad.
- [ ] Rondeaantal 6/5/4 bij 2/3/4 spelers.
- [ ] In de laatste ronde wordt zowel actieve als passieve eindscore ontvangen.
- [ ] Eindstand verschijnt pas na alle laatste keuzes.

## Locus — gedeelde deck

- [ ] Startfase toont geen verschillende lokale decks meer.
- [ ] Alleen actieve speler kan `Open de volgende twee kaarten` gebruiken.
- [ ] Daarna is op alle apparaten exact hetzelfde kaartpaar zichtbaar.
- [ ] Deckteller daalt per beurt met 3 kaarten: 1 gesloten, 2 open.
- [ ] Alleen actieve speler kan in de keuzefase een van de twee kaarten kiezen.
- [ ] Na keuze ziet actieve speler zijn gekozen kaart als toegewezen.
- [ ] Alle andere spelers zien exact de andere kaart als toegewezen.
- [ ] Andere kaart kan niet gratis worden gekozen/gesleept.
- [ ] 3 munten maakt de andere open kaart wel speelbaar via de bestaande muntenactie.
- [ ] Kaart afleggen levert 2 munten en meldt de speler daarna gereed.
- [ ] Bonussen moeten eerst worden geplaatst voordat gereed melden mogelijk is.
- [ ] Volgende kaartbeurt start pas als iedereen gereed is.
- [ ] Actieve speler roteert na iedere kaartbeurt.
- [ ] Na 16 kaartbeurten / 48 kaarten verschijnt bij iedereen de atelierfase.
- [ ] In atelier kunnen resterende munten nog in vrije vakken worden omgezet.
- [ ] `Mijn eindscore vastzetten` blokkeert verdere persoonlijke wijzigingen voor die speler.
- [ ] Partij eindigt pas wanneer iedereen de atelier-eindscore heeft vastgezet.
- [ ] Eindoverzicht toont de correcte Locus-totaalscore en laagste-zone-informatie.

## Locus — uitval

- [ ] Actieve speler valt vóór openen weg: andere speler wordt actief.
- [ ] Actieve speler valt weg terwijl twee kaarten open liggen: nieuwe actieve speler kiest uit hetzelfde paar.
- [ ] Actieve speler valt weg nadat kaarten zijn toegewezen: andere spelers houden hun huidige toegewezen kaart en kunnen de beurt afronden.

## Qwixx

- [ ] Iedereen verwerkt eerst de witte actie.
- [ ] Alleen actieve speler krijgt kleuractie.
- [ ] Tweede globale rijsluiting activeert einde na de huidige gezamenlijke actie.
- [ ] Vier mislukte worpen bij een speler activeert eveneens het einde.
- [ ] Eindstand bevat de actuele Qwixx-score van alle spelers.

## Knister

- [ ] Zelfde som bij iedereen.
- [ ] Na de 25e plaatsing kan iedereen de laatste som verwerken.
- [ ] Daarna verschijnt gezamenlijke eindstand.

## Sixto

- [ ] Alleen actieve speler beslist houden/hergooien.
- [ ] Pas daarna is de worp voor iedereen speelbaar.
- [ ] Drie globale sluitingen activeren einde na de huidige worp.
- [ ] De solo-regel `minder dan twee dobbelstenen gebruikt` beëindigt een online tafelpartij niet per ongeluk.

## Railroad Ink

- [ ] Zelfde routes bij iedereen.
- [ ] Na ronde 7 verwerkt iedereen zijn laatste routes.
- [ ] Daarna verschijnt gezamenlijke eindstand.

## Regressie lokaal

- [ ] Zonder online kamer blijft Locus solo/echte-kaartenmodus werken.
- [ ] Lokale Locus-atelierfase blijft werken.
- [ ] Keer op Keer-solospel stopt nog wel na de bestaande sololimiet.
- [ ] Editors, generatoren en drukstudio openen.
- [ ] Donkere modus, mobiele layout en zoom blijven bruikbaar.
