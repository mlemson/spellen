/* Speelveldstudio spelkast: enkel UI. Bestaande engine handelt spelacties af. */
(function () {
  'use strict';
  const root = document.querySelector('.app-shell');
  const nav = document.querySelector('.app-nav');
  const selector = document.getElementById('game-select');
  if (!root || !nav || !selector || document.getElementById('studio-home')) return;
  const icons = {
    play:'<path d="m8 5 12 7-12 7z"/>',
    dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8" cy="8" r=".8" fill="currentColor"/><circle cx="16" cy="8" r=".8" fill="currentColor"/><circle cx="12" cy="12" r=".8" fill="currentColor"/><circle cx="8" cy="16" r=".8" fill="currentColor"/><circle cx="16" cy="16" r=".8" fill="currentColor"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    star:'<path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.35l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M2.6 19v-1c0-3 2.9-5.2 6.4-5.2s6.4 2.2 6.4 5.2v1M16 5.1a3 3 0 0 1 0 5.8M17.5 13.6c2.4.5 3.9 2.2 3.9 4.4v1"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    check:'<path d="M3 7h18M3 12h18M3 17h18"/><path d="m7 12 2 2 4-5"/>',
    rail:'<path d="M3 12h18M12 3v18M4 4l16 16M20 4 4 20"/><circle cx="12" cy="12" r="3"/>',
    cards:'<rect x="6" y="4" width="14" height="17" rx="2"/><path d="M6 8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2m7-12 1.5 2.5L17 13l-2.5 1.5L13 17l-1.5-2.5L9 13l2.5-1.5z"/>',
    flame:'<path d="M12 21c-4.2 0-7-2.8-7-6.6 0-2.3 1.2-4.4 3-6.3-.2 3 1 3.8 2 4.3 2-2.6 2.6-5.4 2.3-9.3 4.4 3.2 6.8 7.3 6.8 11.1A7 7 0 0 1 12 21Z"/>',
    board:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
    book:'<path d="M12 6c-2.6-2-6-2.2-9-1.4V19c3-.8 6.4-.5 9 1 2.6-1.5 6-1.8 9-1V4.6c-3-.8-6.4-.6-9 1.4ZM12 6v14"/>',
    print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 2.1 2 1 2-.9 2 3.4-1.6 1.6v2.3l1.6 1.6-2 3.4-2-.9-2 1L14 20h-4l-.5-2.4-2-1-2 .9-2-3.4 1.6-1.6V10l-1.6-1.6 2-3.4 2 .9 2-1z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 0 1 5 .8c0 2-2.5 2.4-2.5 4.4m0 3h.01"/>',
    edit:'<path d="m4 17-.8 4 4-.8L19.7 7.5a2.1 2.1 0 0 0-3-3L4 17ZM14 7l3 3"/>'
  };
  const svg = function (name) { return '<svg class="studio-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#studio-icon-'+name+'"></use></svg>'; };
  const sprite = document.createElementNS('http://www.w3.org/2000/svg','svg');
  sprite.setAttribute('width','0'); sprite.setAttribute('height','0');
  sprite.setAttribute('aria-hidden','true'); sprite.style.cssText='position:absolute;overflow:hidden;pointer-events:none;';
  sprite.innerHTML = '<defs>'+Object.keys(icons).map(function(name){return '<symbol id="studio-icon-'+name+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</symbol>';}).join('')+'</defs>';
  root.insertBefore(sprite,root.firstChild);
  const catalog = [
    {id:'clever',first:'clever1',name:'Clever',short:'Slimme kettingreacties met gekleurde dobbelstenen.',icon:'dice',category:'dice',tag:'Dobbelspel · meerdere edities'},
    {id:'qwixx',first:'qwixx',name:'Qwixx',short:'Kruis getallen aan en sluit de juiste kleurenrijen.',icon:'check',category:'dice',tag:'Dobbelspel · varianten in spel'},
    {id:'kok',first:'kok1',name:'Keer op Keer',short:'Vul aaneengesloten kleurgebieden en complete kolommen.',icon:'grid',category:'dice',tag:'Dobbelspel · deel 1, 2 en 3'},
    {id:'railroad',first:'railroad',name:'Railroad Ink',short:'Teken wegen en spoorlijnen tot een verbonden netwerk.',icon:'rail',category:'dice',tag:'Dobbelspel · routes'},
    {id:'knister',first:'knister',name:'Knister',short:'Vul het raster en combineer de getallen slim.',icon:'flame',category:'dice',tag:'Dobbelspel · 5 × 5'},
    {id:'sixto',first:'sixto',name:'Sixto',short:'Kies tactisch waar je je worpen aankruist.',icon:'board',category:'dice',tag:'Dobbelspel · kleuren'},
    {id:'locus',first:'locus',name:'Locus',short:'Plaats vormkaarten en scoor in vijf zones.',icon:'cards',category:'card',tag:'Kaartspel · zones'}
  ];
  let favorites = [];
  try { const saved = JSON.parse(localStorage.getItem('studio-favourites-v1') || '[]'); favorites = Array.isArray(saved) ? saved.filter(function(n){return catalog.some(function(c){return c.id===n;});}) : []; } catch (_) {}
  const cards = function(id) {
    const rows = id==='qwixx'?4:id==='railroad'||id==='locus'?0:5;
    if(id==='knister') return '<div class="studio-plate knister">'+[3,5,2,6,4,1,4,3,5,2,6,2,5,3,1,4,3,6,2,5,1,5,4,2,6].map(function(n){return '<span>'+n+'</span>';}).join('')+'</div>';
    if(id==='railroad') return '<div class="studio-plate railroad">'+svg('rail')+'</div>';
    if(id==='locus') return '<div class="studio-plate locus"><span>✦</span><span>⌁</span></div>';
    return '<div class="studio-plate '+id+'">'+Array.from({length:rows},function(){return '<div class="studio-plate-row">'+Array.from({length:id==='kok'?9:8},function(){return '<i></i>';}).join('')+'</div>';}).join('')+'</div>';
  };
  const gameCard = function(game) {
    return '<article class="studio-game-card" data-family="'+game.id+'" data-category="'+game.category+'">'+
      '<div class="studio-card-top"><div class="studio-card-icon">'+svg(game.icon)+'</div>'+
      '<button class="studio-favourite" type="button" data-studio-fav="'+game.id+'" aria-label="'+game.name+' als favoriet instellen" aria-pressed="false" title="Favoriet">'+svg('star')+'</button></div>'+
      '<div class="studio-card-illustration" aria-hidden="true">'+cards(game.id)+'</div>'+
      '<div class="studio-card-copy"><h2>'+game.name+'</h2><p>'+game.short+'</p></div>'+
      '<div class="studio-card-variant" data-studio-variants="'+game.id+'"></div>'+
      '<div class="studio-card-bottom"><span class="studio-card-tag">'+game.tag+'</span><button type="button" class="studio-play" data-studio-play="'+game.id+'">'+svg('play')+' Spelen</button></div></article>';
  };
  const homepage = document.createElement('section');
  homepage.id='studio-home'; homepage.hidden=true; homepage.setAttribute('aria-labelledby','studio-home-heading');
  homepage.innerHTML = '<div class="studio-home-layout"><div class="studio-home-main">'+
    '<div class="studio-hero"><div class="studio-hero-copy"><span class="studio-eyebrow">De digitale spellenkast</span>'+
    '<h1 id="studio-home-heading">Een spelletje spelen?<br><em>Kies je favoriet.</em></h1>'+
    '<p>Je vertrouwde scorebladen, samen op één plek. Speel lokaal, gebruik je eigen dobbelstenen of maak een online kamer met vrienden.</p>'+
    '<div class="studio-hero-actions"><button class="studio-cta primary" type="button" data-studio-action="explore">'+svg('grid')+' Bekijk spellen</button>'+
    '<button class="studio-cta" type="button" data-studio-action="online">'+svg('people')+' Online spelen</button></div></div>'+
    '<div class="studio-hero-art" aria-hidden="true"><div class="studio-mini-board">'+Array.from({length:5},function(){return '<div class="studio-mini-row">'+Array.from({length:7},function(){return '<span></span>';}).join('')+'</div>';}).join('')+'</div><div class="studio-art-dice">• •</div><div class="studio-art-dice second">• •</div></div></div>'+
    '<div class="studio-home-toolbar" id="studio-catalog"><div class="studio-filter-list" aria-label="Spellen filteren">'+
    '<button class="studio-filter" type="button" data-studio-filter="all" aria-pressed="true">Alle spellen · 7</button>'+
    '<button class="studio-filter" type="button" data-studio-filter="dice" aria-pressed="false">Dobbelspellen · 6</button>'+
    '<button class="studio-filter" type="button" data-studio-filter="card" aria-pressed="false">Kaartspellen · 1</button>'+
    '<button class="studio-filter" type="button" data-studio-filter="favorites" aria-pressed="false">Favorieten <span id="studio-fav-count">0</span></button></div>'+
    '<label class="studio-search">'+svg('search')+'<input id="studio-search-games" type="search" autocomplete="off" aria-label="Spellen zoeken" placeholder="Zoek een spel..."></label></div>'+
    '<div class="studio-games" id="studio-game-grid">'+catalog.map(gameCard).join('')+'</div>'+
    '<p class="studio-home-footer">Je spelvoortgang en favorieten worden lokaal in deze browser bewaard. Online kamers werken rechtstreeks tussen spelers.</p></div>'+
    '<aside class="studio-home-aside" aria-label="Spelmogelijkheden">'+
    '<section class="studio-panel"><span class="studio-aside-kicker">Je huidige spel</span><h2>Verder spelen</h2><strong class="studio-continue-name" id="studio-current-name">Speelveld</strong>'+
    '<p>Je bestaande partij en scoreblad blijven behouden wanneer je naar de spellenkast teruggaat.</p>'+
    '<button class="studio-cta primary" type="button" data-studio-action="continue">'+svg('play')+' Ga verder met mijn spel</button></section>'+
    '<section class="studio-panel"><span class="studio-aside-kicker">Samen spelen</span><h2>Een partij met vrienden</h2>'+
    '<p>Start een privékamer of sluit je aan met een kamercode. Er is geen openbare spelerslijst nodig.</p>'+
    '<div class="studio-aside-actions"><button class="studio-cta" type="button" data-studio-action="online">'+svg('people')+' Online kamer openen</button>'+
    '<button class="studio-cta" type="button" data-studio-action="continue">'+svg('dice')+' Lokaal spelen</button></div></section>'+
    '<section class="studio-panel"><span class="studio-aside-kicker">Alle hulpmiddelen</span><h2>Meer dan scorebladen</h2>'+
    '<button class="studio-help-link" type="button" data-studio-view="editor">'+svg('edit')+' Zelf een speelveld maken '+svg('arrow')+'</button>'+
    '<button class="studio-help-link" type="button" data-studio-view="generator">'+svg('grid')+' Speelveld genereren '+svg('arrow')+'</button>'+
    '<button class="studio-help-link" type="button" data-studio-view="printstudio">'+svg('print')+' Printstudio openen '+svg('arrow')+'</button>'+
    '<button class="studio-help-link" type="button" data-studio-action="help">'+svg('book')+' Speluitleg bekijken '+svg('arrow')+'</button></section></aside></div>';
  const main = root.querySelector('main');
  if (!main) return;
  root.insertBefore(homepage,main);
  const homeTab = document.createElement('button');
  homeTab.className='tab-btn studio-home-nav';
  homeTab.type='button'; homeTab.setAttribute('data-studio-action','home');
  homeTab.setAttribute('aria-selected','false');
  homeTab.innerHTML=svg('grid')+' Spellenkast';
  nav.insertBefore(homeTab,nav.firstElementChild);

  /* Bestaande #game-select blijft de enige bron van spelvarianten. */
  const familyIds = {clever:/^clever/i,kok:/^kok/i};
  function syncVariants() {
    catalog.forEach(function(game) {
      const slot=homepage.querySelector('[data-studio-variants="'+game.id+'"]');
      if(!slot) return;
      const ids=Array.from(selector.options).filter(function(o){return o.value===game.first || (familyIds[game.id] && familyIds[game.id].test(o.value));});
      slot.textContent='';
      if(ids.length<=1) return;
      const label=document.createElement('label');label.textContent='Kies editie';
      const select=document.createElement('select');select.setAttribute('aria-label',game.name+' editie kiezen');select.setAttribute('data-studio-variant',game.id);
      ids.forEach(function(opt){const option=document.createElement('option');option.value=opt.value;option.textContent=opt.textContent;select.appendChild(option);});
      if(ids.some(function(o){return o.value===selector.value;})) select.value=selector.value;
      slot.appendChild(label);slot.appendChild(select);
    });
  }
  function currentFamily(id) {
    if(id==='locus')return 'locus';if(/^clever/.test(id))return 'clever';if(/^kok/.test(id))return 'kok';
    return ['qwixx','knister','sixto','railroad'].includes(id)?id:'kok';
  }
  function updateCurrent() {
    const option=selector.selectedOptions[0];
    const title=homepage.querySelector('#studio-current-name');
    if(title) title.textContent=option?option.textContent:'Je scoreblad';
    document.body.dataset.studioGame=currentFamily(selector.value);
  }
  function setHome(visible) {
    homepage.hidden=!visible;
    document.body.classList.toggle('studio-home-active',visible);
    homeTab.setAttribute('aria-selected',String(visible));
    if(visible) {
      nav.querySelectorAll('[data-view]').forEach(function(el){el.setAttribute('aria-selected','false');});
      syncVariants(); updateCurrent(); updateFilters(); window.scrollTo(0,0);
    }
  }
  function openPlaying(gameId) {
    setHome(false);
    const selectId=gameId && Array.from(selector.options).some(function(o){return o.value===gameId;})?gameId:selector.value;
    if(gameId && selector.value!==selectId) {
      selector.value=selectId;
      selector.dispatchEvent(new Event('change',{bubbles:true}));
    } else {
      const playTab=nav.querySelector('[data-view="game"]');
      if(playTab)playTab.click();
    }
    updateCurrent();
    window.scrollTo(0,0);
  }
  function saveFavs(){try{localStorage.setItem('studio-favourites-v1',JSON.stringify(favorites));}catch(_){}}
  let filter='all';
  function updateFilters() {
    const q=(homepage.querySelector('#studio-search-games').value||'').trim().toLocaleLowerCase('nl');
    let count=0;
    homepage.querySelectorAll('.studio-game-card').forEach(function(card) {
      const game=catalog.find(function(g){return g.id===card.dataset.family;});
      const keep=!!game && (!q || (game.name+' '+game.short+' '+game.tag).toLocaleLowerCase('nl').includes(q)) &&
        (filter==='all' || filter==='favorites' && favorites.includes(game.id) || filter===game.category);
      card.hidden=!keep; if(keep)count++;
      const fav=card.querySelector('[data-studio-fav]');
      fav.setAttribute('aria-pressed',String(favorites.includes(card.dataset.family)));
      fav.setAttribute('aria-label',(favorites.includes(card.dataset.family)?'Verwijder ':'Voeg ')+game.name+(favorites.includes(card.dataset.family)?' uit favorieten':' toe aan favorieten'));
    });
    homepage.querySelector('#studio-fav-count').textContent=String(favorites.length);
    homepage.querySelectorAll('[data-studio-filter]').forEach(function(button) { button.setAttribute('aria-pressed',String(button.dataset.studioFilter===filter)); });
    let empty=homepage.querySelector('.studio-empty');
    if(!count) {
      if(!empty){empty=document.createElement('div');empty.className='studio-empty';empty.setAttribute('role','status');homepage.querySelector('#studio-game-grid').appendChild(empty);}
      empty.textContent=filter==='favorites' && !favorites.length?'Je hebt nog geen favorieten. Klik op de ster bij een spel om het hier te bewaren.':'Geen spellen gevonden. Probeer een andere zoekterm of filter.';
    } else if(empty) empty.remove();
  }
  homepage.addEventListener('click',function(event) {
    const fav=event.target.closest('[data-studio-fav]');
    if(fav){const id=fav.dataset.studioFav;favorites=favorites.includes(id)?favorites.filter(function(v){return v!==id;}):favorites.concat(id);saveFavs();updateFilters();return;}
    const filterButton=event.target.closest('[data-studio-filter]');
    if(filterButton){filter=filterButton.dataset.studioFilter;updateFilters();return;}
    const play=event.target.closest('[data-studio-play]');
    if(play){const family=play.dataset.studioPlay;const info=catalog.find(function(x){return x.id===family;});const variant=homepage.querySelector('[data-studio-variant="'+family+'"]');if(info)openPlaying(variant?variant.value:info.first);return;}
    const view=event.target.closest('[data-studio-view]');
    if(view){setHome(false);const original=nav.querySelector('[data-view="'+view.dataset.studioView+'"]');if(original && !original.hidden) original.click();else openPlaying();return;}
    const action=event.target.closest('[data-studio-action]');
    if(!action)return;
    switch(action.dataset.studioAction){
      case 'explore': homepage.querySelector('#studio-catalog').scrollIntoView({behavior:'smooth',block:'start'});break;
      case 'continue': openPlaying();break;
      case 'online': setHome(false);openPlaying();document.getElementById('online-button')?.click();break;
      case 'help': setHome(false);openPlaying();document.querySelector('[data-action="help"]')?.click();break;
    }
  });
  homepage.querySelector('#studio-search-games').addEventListener('input',updateFilters);
  homeTab.addEventListener('click',function(){setHome(true);});
  document.querySelector('.brand')?.addEventListener('click',function(){setHome(true);});
  document.querySelector('.brand')?.setAttribute('title','Terug naar spellenkast');
  document.querySelector('.brand')?.setAttribute('role','button');
  document.querySelector('.brand')?.setAttribute('tabindex','0');
  document.querySelector('.brand')?.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();setHome(true);}});
  document.addEventListener('click',function(event){
    if(event.target.closest('.app-nav [data-view]')||event.target.closest('.app-header [data-action="online"]')||event.target.closest('.app-header [data-action="print"]')){
      if(!homepage.hidden)setHome(false);
      updateCurrent();
    }
  },true);
  selector.addEventListener('change',function(){updateCurrent();});
  updateCurrent(); syncVariants();updateFilters();
  /* Gedeelde uitnodigingen krijgen voorrang op de spellenkast. */
  const invitation=Boolean(location.search||location.hash||document.querySelector('dialog[open]'));
  if(!invitation)setHome(true);
})();