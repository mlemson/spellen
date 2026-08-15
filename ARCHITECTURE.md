# Multiplayerarchitectuur 2.40

## Topologie

De multiplayerlaag blijft host-gecentreerd:

- host = autoritatieve publieke `table`-staat;
- iedere gast = één PeerJS DataConnection met de host;
- gedeelde randomuitkomsten worden door de host gemaakt;
- persoonlijke scorebladen blijven lokaal;
- na iedere publieke mutatie broadcast de host een volledige tafelsnapshot.

## Algemene tafelstaat

Belangrijke velden:

- `game` en `config`;
- `sequence`;
- `activePlayerId`;
- `roll`;
- `ready`;
- `claims` / `pendingClaims`;
- `public.qwixxLocks` / `public.sixtoClosed`;
- `ending`;
- `finished`;
- `endReason`;
- `endTriggerPlayers`;
- `results`;
- spel-specifieke substate zoals `kok`, `clever`, `sixto` en `locus`.

## Eindeprotocol

`ending` en `finished` zijn bewust verschillend.

1. Een speler meldt `publicState` met eigen resultaat en eventueel een spel-eindtrigger.
2. De host zet bij een gedeelde eindtrigger `ending=true`.
3. De huidige gezamenlijke beurt blijft open voor spelers die hem nog moeten afhandelen.
4. Iedere gereedmelding bevat tevens de actuele eindscore-samenvatting.
5. Zodra alle vereiste spelers gereed zijn, zet de host `finished=true` en blokkeert nieuwe worpen/kaartbeurten.
6. Alle clients openen dezelfde eindstand uit `table.results`.

Hierdoor wint niet de snelste netwerkclient en wordt niemand midden in een simultane roll-and-write-beurt afgekapt.

## Ranglijst

Normale puntenspellen worden aflopend op het berekende puntentotaal gesorteerd. Bij exact gelijke score blijft de positie gedeeld; 2.40 verzint geen aanvullende tiebreak die niet in het bestaande spelmodel staat.

Keer op Keer 3 is een uitzondering: `endTriggerPlayers` markeert de speler(s) die de X-fiche-winconditie in de laatste gedeelde beurt bereiken. Gelijktijdige triggers delen de eerste positie.

## Locus

`table.locus` bevat:

- `phase`;
- `seed`;
- volledige gedeelde `deck`;
- `deckIndex`;
- `revealed`;
- `blindDiscarded`;
- `activeChoice`;
- `passiveChoice`.

Fasen:

1. `await-reveal` — actieve speler mag de volgende kaartbeurt openen.
2. `choose-active` — één kaart is gesloten afgelegd en twee kaarten liggen open; actieve speler kiest eerst.
3. `play` — `activeChoice` en `passiveChoice` staan vast; iedereen speelt op zijn eigen bord.
4. `atelier` — deck leeg; alleen persoonlijke munten/bonussen worden nog afgehandeld.
5. algemene `table.finished` — alle atelier-eindscores ontvangen; scoreoverzicht beschikbaar.

### Persoonlijke Locus-staat

Niet gedeeld worden onder andere:

- geplaatste vakken;
- munten;
- rotatie/spiegeling;
- lokale bonussen;
- zonekeuzes;
- persoonlijke score.

Wel wordt de uiteindelijke score-samenvatting bij het vastzetten naar de host gestuurd.

### Netwerkvolgorde

De host bepaalt één `activeChoice`; `passiveChoice` is altijd de andere van de twee open kaarten. Hierdoor kunnen twee clients niet door timing verschillende kaarttoewijzingen krijgen.

Als de actieve speler vóór de keuze wegvalt, neemt een andere speler de reeds geopende kaartkeuze over. Valt de actieve speler tijdens de speelfase weg, dan blijven de al uitgedeelde kaarten voor de resterende spelers staan en wordt na die beurt een nieuwe actieve speler gekozen.

## Bestaande spelprotocollen

### Keer op Keer

- worp 1–3: volledig aanbod voor iedereen;
- daarna actieve keuze en passief resterend aanbod;
- claims uit dezelfde gedeelde worp worden gezamenlijk vastgelegd;
- online geen 30-beurten-sololimiet / KOK2 snelle-finish-solobonus.

### Clever

- host deelt dobbelsteenstatus en ronde/fase;
- één gezamenlijk zilveren dienblad;
- `rollVersion` voorkomt terugzetten door oudere snapshots;
- eindresultaten worden tijdens de laatste actieve/passieve afhandeling verzameld.

### Qwixx

- globale sluitingen in publieke staat;
- `baseLocks` per worp voorkomt terugwerkend blokkeren in dezelfde witte actie.

### Sixto

- `reroll-decision` vóór `play`;
- alleen actieve speler houdt/hergooit;
- gesloten kleuren zijn publiek.

## Uitval

- vertrekkende gast wordt uit gereedberekening en eindstand verwijderd;
- actieve Locus-speler vóór de keuze kan veilig worden vervangen;
- hostuitval heeft nog geen migratie: kamer eindigt.
