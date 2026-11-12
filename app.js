const API_URL = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 12;
const MAX_TEAM_SIZE = 6;
const FAVORITES_KEY = "pokedex-lab-team-v2";

const TYPE_NAMES = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terrestre",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

const STAT_NAMES = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidade",
};

const TYPE_ADVANTAGES = {
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  grass: ["water", "ground", "rock"],
  electric: ["water", "flying"],
  ice: ["grass", "ground", "flying", "dragon"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  poison: ["grass", "fairy"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  flying: ["grass", "fighting", "bug"],
  psychic: ["fighting", "poison"],
  bug: ["grass", "psychic", "dark"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["psychic", "ghost"],
  dragon: ["dragon"],
  dark: ["psychic", "ghost"],
  steel: ["ice", "rock", "fairy"],
  fairy: ["fighting", "dragon", "dark"],
};

const TYPE_RESISTANCES = {
  fire: ["water", "rock", "dragon", "fire"],
  water: ["grass", "dragon", "water"],
  grass: ["fire", "flying", "bug", "poison", "steel", "dragon", "grass"],
  electric: ["ground", "grass", "dragon", "electric"],
  ice: ["fire", "water", "steel", "ice"],
  fighting: ["flying", "psychic", "fairy", "ghost", "poison", "bug"],
  poison: ["ground", "rock", "ghost", "steel", "poison"],
  ground: ["grass", "bug", "flying"],
  flying: ["electric", "rock", "steel"],
  psychic: ["dark", "steel", "psychic"],
  bug: ["fire", "fighting", "flying", "ghost", "steel", "fairy"],
  rock: ["fighting", "ground", "steel"],
  ghost: ["dark", "normal"],
  dragon: ["steel", "fairy"],
  dark: ["fighting", "dark", "fairy"],
  steel: ["fire", "water", "electric", "steel"],
  fairy: ["fire", "poison", "steel"],
};

const TYPE_MOVES = {
  normal: ["Investida Rápida", "Hiper Raio", "Corte Duplo"],
  fire: ["Lança-Chamas", "Explosão de Fogo", "Presas Ígneas"],
  water: ["Jato d'Água", "Hidro Bomba", "Onda Gigante"],
  electric: ["Choque do Trovão", "Relâmpago", "Esfera Elétrica"],
  grass: ["Folha Navalha", "Raio Solar", "Chicote de Vinha"],
  ice: ["Raio Congelante", "Nevasca", "Soco de Gelo"],
  fighting: ["Soco Dinâmico", "Chute Baixo", "Esfera de Aura"],
  poison: ["Bomba de Lodo", "Picada Tóxica", "Onda Venenosa"],
  ground: ["Terremoto", "Lama Explosiva", "Fissura"],
  flying: ["Ataque de Asa", "Vendaval", "Golpe Aéreo"],
  psychic: ["Confusão Mental", "Raio Psíquico", "Premonição"],
  bug: ["Tesoura X", "Zumbido", "Picada Múltipla"],
  rock: ["Deslizamento", "Gume de Pedra", "Lançamento de Rocha"],
  ghost: ["Bola Sombria", "Garra Fantasma", "Assombração"],
  dragon: ["Garra do Dragão", "Sopro Dracônico", "Meteoro"],
  dark: ["Mordida Sombria", "Pulso Noturno", "Golpe Furtivo"],
  steel: ["Cauda de Ferro", "Canhão Flash", "Garra Metálica"],
  fairy: ["Brilho Mágico", "Explosão Lunar", "Vento Encantado"],
};

const TYPE_FX = {
  normal:   { icon: "💥", color: "#e5e7eb", glow: "#9ca3af" },
  fire:     { icon: "🔥", color: "#f97316", glow: "#ef4444" },
  water:    { icon: "💧", color: "#38bdf8", glow: "#2563eb" },
  electric: { icon: "⚡", color: "#fde047", glow: "#eab308" },
  grass:    { icon: "🍃", color: "#4ade80", glow: "#16a34a" },
  ice:      { icon: "❄️", color: "#67e8f9", glow: "#06b6d4" },
  fighting: { icon: "👊", color: "#f87171", glow: "#dc2626" },
  poison:   { icon: "☠️", color: "#c084fc", glow: "#9333ea" },
  ground:   { icon: "🪨", color: "#fbbf24", glow: "#b45309" },
  flying:   { icon: "🌪️", color: "#a5b4fc", glow: "#6366f1" },
  psychic:  { icon: "🔮", color: "#f472b6", glow: "#db2777" },
  bug:      { icon: "🕸️", color: "#a3e635", glow: "#65a30d" },
  rock:     { icon: "⛰️", color: "#d6d3d1", glow: "#78716c" },
  ghost:    { icon: "👻", color: "#818cf8", glow: "#4338ca" },
  dragon:   { icon: "🐉", color: "#60a5fa", glow: "#1d4ed8" },
  dark:     { icon: "🌑", color: "#6b7280", glow: "#111827" },
  steel:    { icon: "⚙️", color: "#cbd5e1", glow: "#475569" },
  fairy:    { icon: "✨", color: "#f9a8d4", glow: "#ec4899" },
};

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#pokemon-input"),
  searchButton: document.querySelector("#search-button"),
  randomButton: document.querySelector("#random-button"),
  searchStatus: document.querySelector("#search-status"),
  filterButtons: [...document.querySelectorAll(".filter-chip")],
  quickSearchButtons: [...document.querySelectorAll("[data-quick-search]")],
  catalogStatus: document.querySelector("#catalog-status"),
  catalogCaption: document.querySelector("#catalog-caption"),
  clearSearch: document.querySelector("#clear-search"),
  grid: document.querySelector("#pokemon-grid"),
  pagination: document.querySelector("#pagination"),
  previousPage: document.querySelector("#previous-page"),
  nextPage: document.querySelector("#next-page"),
  pageIndicator: document.querySelector("#page-indicator"),
  detail: document.querySelector("#pokemon-detail"),
  favoritesList: document.querySelector("#favorites-list"),
  favoritesCount: document.querySelector("#favorites-count"),
  comparison: document.querySelector("#comparison-result"),
};

const detailCache = new Map();
const speciesDescriptions = new Map();
const evolutionChains = new Map();
const evolutionMarkup = new Map();

let catalogItems = [];
let pagePokemon = [];
let catalogTotal = 0;
let currentPage = 0;
let currentType = "";
let searchMode = false;
let selectedPokemon = null;
let isShinyMode = false;
let favorites = readFavorites();
let comparison = [];
let catalogRequestId = 0;
let detailRequestId = 0;
let battleTimer = null;
let arenaTab = "field";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((p) => p && Number.isInteger(p.id) && typeof p.name === "string").slice(0, MAX_TEAM_SIZE)
      : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    setSearchStatus("Não foi possível salvar sua equipe neste navegador.", true);
  }
}

async function requestJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error("not-found");
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function formatId(id) {
  return `#${String(id).padStart(3, "0")}`;
}

function pokemonImage(pokemon, shiny = false) {
  const artwork = pokemon.sprites?.other?.["official-artwork"];
  if (shiny) {
    return artwork?.front_shiny || pokemon.sprites?.front_shiny || artwork?.front_default || pokemon.sprites?.front_default || "";
  }
  return artwork?.front_default || pokemon.sprites?.front_default || "";
}

function typeLabel(type) {
  return TYPE_NAMES[type] || type;
}

function typeMarkup(type) {
  return `<span class="type-badge type-${escapeHTML(type)}">${escapeHTML(typeLabel(type))}</span>`;
}

function setSearchStatus(message = "", isError = false) {
  elements.searchStatus.textContent = message;
  elements.searchStatus.classList.toggle("is-error", isError);
}

function setSearchBusy(isBusy) {
  elements.searchButton.disabled = isBusy;
  elements.randomButton.disabled = isBusy;
  elements.input.disabled = isBusy;
}

function showCatalogMessage(message, isError = false) {
  elements.grid.setAttribute("aria-busy", "false");
  elements.grid.innerHTML = `
    <div class="catalog-message${isError ? " is-error" : ""}" role="${isError ? "alert" : "status"}">
      ${isError
        ? `<strong>${escapeHTML(message)}</strong><span>Tente buscar outro nome ou número.</span>`
        : `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHTML(message)}</span>`}
    </div>`;
}

function cardMarkup(pokemon) {
  const types = pokemon.types.map(({ type }) => type.name);
  const image = pokemonImage(pokemon, false);
  const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return `
    <button
      class="pokemon-card${selectedPokemon?.id === pokemon.id ? " is-selected" : ""}"
      type="button"
      data-pokemon-id="${pokemon.id}"
      aria-label="Inspecionar ${escapeHTML(pokemon.name)}"
    >
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span class="card-number">⚡ ${totalStats}</span>
        <span class="card-number">${formatId(pokemon.id)}</span>
      </div>
      <span class="card-image-wrap">
        ${image ? `<img class="card-image" src="${escapeHTML(image)}" alt="" loading="lazy">` : '<span aria-hidden="true">◉</span>'}
      </span>
      <span class="card-name">${escapeHTML(pokemon.name)}</span>
      <span class="card-types">${types.map(typeMarkup).join("")}</span>
    </button>`;
}

function renderCatalog() {
  const totalPages = Math.max(1, Math.ceil(catalogTotal / PAGE_SIZE));
  elements.grid.setAttribute("aria-busy", "false");
  elements.grid.innerHTML = pagePokemon.map(cardMarkup).join("");
  elements.catalogStatus.textContent = searchMode
    ? `${catalogItems.length} espécime localizado`
    : `${catalogTotal.toLocaleString("pt-BR")} espécies registradas`;
  elements.pageIndicator.textContent = searchMode
    ? "Resultado do rastreio"
    : `Página ${currentPage + 1} de ${totalPages}`;
  elements.previousPage.disabled = searchMode || currentPage === 0;
  elements.nextPage.disabled = searchMode || currentPage >= totalPages - 1;
  elements.pagination.hidden = searchMode;
  elements.clearSearch.hidden = !searchMode;
}

async function getPokemon(identifier) {
  const key = String(identifier).toLowerCase();
  if (!detailCache.has(key)) {
    const pending = requestJSON(`${API_URL}/pokemon/${encodeURIComponent(key)}`)
      .then((pokemon) => {
        detailCache.set(String(pokemon.id), Promise.resolve(pokemon));
        detailCache.set(pokemon.name, Promise.resolve(pokemon));
        return pokemon;
      })
      .catch((error) => {
        detailCache.delete(key);
        throw error;
      });
    detailCache.set(key, pending);
  }
  return detailCache.get(key);
}

async function loadCatalog() {
  searchMode = false;
  elements.catalogCaption.textContent = "Selecione uma carta para inspecionar ou enviar para a Arena.";
  elements.pagination.hidden = false;
  const offset = currentPage * PAGE_SIZE;

  if (currentType) {
    await loadType(currentType);
    return;
  }

  const requestId = ++catalogRequestId;
  showCatalogMessage("Carregando cartas da PokéAPI…");
  elements.previousPage.disabled = true;
  elements.nextPage.disabled = true;

  try {
    const response = await requestJSON(`${API_URL}/pokemon?offset=${offset}&limit=${PAGE_SIZE}`);
    if (requestId !== catalogRequestId) return;
    catalogTotal = response.count ?? 0;
    catalogItems = response.results || [];
    pagePokemon = await Promise.all(catalogItems.map((item) => getPokemon(item.name)));
    if (requestId !== catalogRequestId) return;
    renderCatalog();
  } catch {
    if (requestId !== catalogRequestId) return;
    elements.catalogStatus.textContent = "Falha na conexão.";
    showCatalogMessage("Não foi possível carregar o catálogo.", true);
  }
}

async function loadType(type) {
  currentType = type;
  currentPage = 0;
  searchMode = false;

  elements.filterButtons.forEach((button) => {
    const isActive = button.dataset.type === type;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (!type) {
    await loadCatalog();
    return;
  }

  elements.catalogCaption.textContent = `Filtrando espécimes do tipo ${typeLabel(type)}.`;
  const requestId = ++catalogRequestId;
  showCatalogMessage(`Buscando Pokémon do tipo ${typeLabel(type)}…`);

  try {
    const response = await requestJSON(`${API_URL}/type/${encodeURIComponent(type)}`);
    if (requestId !== catalogRequestId) return;
    catalogItems = response.pokemon.map(({ pokemon }) => pokemon);
    catalogTotal = catalogItems.length;
    await renderCurrentPage(requestId);
  } catch {
    if (requestId !== catalogRequestId) return;
    showCatalogMessage("Erro ao filtrar por este tipo.", true);
  }
}

async function renderCurrentPage(requestId = ++catalogRequestId) {
  const pageItems = catalogItems.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  showCatalogMessage("Carregando cartas…");
  try {
    const pokemon = await Promise.all(
      pageItems.map((item) => (typeof item === "string" ? getPokemon(item) : getPokemon(item.name)))
    );
    if (requestId !== catalogRequestId) return;
    pagePokemon = pokemon;
    renderCatalog();
  } catch {
    if (requestId !== catalogRequestId) return;
    showCatalogMessage("Não foi possível carregar esta página.", true);
  }
}

async function runSearch(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    setSearchStatus("Digite o nome ou número de um Pokémon.", true);
    elements.input.focus();
    return;
  }
  if (!/^[a-z0-9-]+$/.test(query)) {
    setSearchStatus("Use apenas letras, números ou hífen (ex.: mr-mime).", true);
    elements.input.focus();
    return;
  }

  const requestId = ++catalogRequestId;
  setSearchBusy(true);
  setSearchStatus("Rastreando na PokéAPI…");
  showCatalogMessage("Escaneando espécime…");

  try {
    const pokemon = await getPokemon(query);
    if (requestId !== catalogRequestId) return;
    catalogItems = [pokemon];
    pagePokemon = [pokemon];
    catalogTotal = 1;
    currentPage = 0;
    currentType = "";
    searchMode = true;

    elements.filterButtons.forEach((button) => {
      const active = button.dataset.type === "";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    elements.catalogCaption.textContent = `Espécime localizado: ${pokemon.name.toUpperCase()}.`;
    renderCatalog();
    setSearchStatus(`✓ ${pokemon.name.toUpperCase()} encontrado!`);
    await selectPokemon(pokemon);
  } catch (error) {
    if (requestId !== catalogRequestId) return;
    if (error.message === "not-found") {
      setSearchStatus("Nenhum Pokémon encontrado com esse nome ou número.", true);
      showCatalogMessage("Espécime não encontrado.", true);
      elements.catalogStatus.textContent = "0 resultados";
      elements.pagination.hidden = true;
    } else {
      setSearchStatus("Erro de conexão com a PokéAPI.", true);
      showCatalogMessage("Falha na busca.", true);
    }
  } finally {
    setSearchBusy(false);
  }
}

async function loadRandomPokemon() {
  const randomId = 1 + Math.floor(Math.random() * 1025);
  elements.input.value = String(randomId);
  await runSearch(String(randomId));
}

async function selectPokemon(pokemonOrId) {
  const requestId = ++detailRequestId;
  const pokemon = typeof pokemonOrId === "object" ? pokemonOrId : await getPokemon(pokemonOrId);
  if (requestId !== detailRequestId) return;

  selectedPokemon = pokemon;
  isShinyMode = false;
  renderCatalog();
  renderDetail(pokemon, null);

  try {
    const species = await requestJSON(pokemon.species.url);
    if (requestId !== detailRequestId) return;
    const description =
      species.flavor_text_entries.find((entry) => entry.language.name === "pt") ||
      species.flavor_text_entries.find((entry) => entry.language.name === "en");
    const flavorText = description?.flavor_text.replace(/[\n\f]/g, " ") || "";
    speciesDescriptions.set(pokemon.id, flavorText);
    renderDetail(pokemon, flavorText);
    await loadEvolutionChain(species.evolution_chain.url, pokemon, requestId);
  } catch {
    if (requestId !== detailRequestId) return;
    renderDetail(pokemon, "");
  }
}

function evolutionCondition(details) {
  const condition = details?.[0];
  if (!condition) return "Evolução";
  if (condition.min_level) return `Nível ${condition.min_level}`;
  if (condition.item?.name) return `Item: ${condition.item.name.replaceAll("-", " ")}`;
  if (condition.trigger?.name === "trade") return "Troca";
  if (condition.min_happiness) return "Amizade Alta";
  if (condition.time_of_day) return condition.time_of_day === "day" ? "Durante o dia" : "À noite";
  if (condition.known_move?.name) return `Golpe ${condition.known_move.name.replaceAll("-", " ")}`;
  return "Condição especial";
}

async function prepareEvolutionNode(node) {
  const pokemon = await getPokemon(node.species.name);
  const children = await Promise.all(node.evolves_to.map(prepareEvolutionNode));
  return { pokemon, children, details: node.evolution_details };
}

function evolutionNodeMarkup(node, depth, selectedId) {
  const pokemon = node.pokemon;
  const image = pokemonImage(pokemon, false);
  const isSelected = pokemon.id === selectedId;
  const condition = depth > 0 ? evolutionCondition(node.details) : "";
  const children = node.children.map((child) => evolutionNodeMarkup(child, depth + 1, selectedId)).join("");

  return `
    <li class="evolution-branch">
      <div class="evolution-stop">
        ${depth > 0 ? `<span class="evolution-condition">${escapeHTML(condition)}</span>` : ""}
        <button class="evolution-card${isSelected ? " is-current" : ""}" type="button" data-evolution-id="${pokemon.id}">
          <span class="evolution-stage">${depth === 0 ? "BASE" : `FASE ${depth + 1}`}</span>
          ${image ? `<img class="evolution-image" src="${escapeHTML(image)}" alt="" loading="lazy">` : ""}
          <span class="evolution-name">${escapeHTML(pokemon.name)}</span>
          <span class="evolution-number">${formatId(pokemon.id)}</span>
          ${isSelected ? '<span class="evolution-current">ATUAL</span>' : ""}
        </button>
      </div>
      ${children ? `<ul class="evolution-branches">${children}</ul>` : ""}
    </li>`;
}

async function loadEvolutionChain(url, pokemon, requestId) {
  const initialTree = document.querySelector("#evolution-tree");
  if (!initialTree || selectedPokemon?.id !== pokemon.id) return;

  try {
    if (!evolutionChains.has(url)) {
      const chainPromise = requestJSON(url)
        .then((response) => prepareEvolutionNode(response.chain))
        .catch((error) => {
          evolutionChains.delete(url);
          throw error;
        });
      evolutionChains.set(url, chainPromise);
    }

    const root = await evolutionChains.get(url);
    if (requestId !== detailRequestId || selectedPokemon?.id !== pokemon.id) return;

    const hasEvolutions = root.children.length > 0;
    const markup = `
      <ul class="evolution-tree-list">${evolutionNodeMarkup(root, 0, pokemon.id)}</ul>
      <p class="evolution-hint">${
        hasEvolutions ? "Clique em qualquer estágio para inspecionar." : "Espécime de estágio único (sem evoluções)."
      }</p>`;
    evolutionMarkup.set(pokemon.id, markup);

    const currentTree = document.querySelector("#evolution-tree");
    if (currentTree) currentTree.innerHTML = markup;
  } catch {
    const currentTree = document.querySelector("#evolution-tree");
    if (currentTree) {
      currentTree.innerHTML = '<p class="evolution-hint evolution-error">Linha evolutiva indisponível.</p>';
    }
  }
}

function renderDetail(pokemon, description) {
  const flavorText = description || speciesDescriptions.get(pokemon.id) || "";
  const image = pokemonImage(pokemon, isShinyMode);
  const typeNames = pokemon.types.map(({ type }) => type.name);
  const abilities = pokemon.abilities.map(({ ability, is_hidden }) =>
    `${ability.name.replaceAll("-", " ")}${is_hidden ? " ★" : ""}`
  );
  const favorite = favorites.some((item) => item.id === pokemon.id);
  const compared = comparison.some((item) => item.id === pokemon.id);

  const stats = pokemon.stats
    .map(({ base_stat: value, stat }) => {
      const label = STAT_NAMES[stat.name] || stat.name;
      const percentage = Math.min(100, Math.round((value / 180) * 100));
      return `
        <div class="stat-row">
          <span class="stat-name">${escapeHTML(label)}</span>
          <span class="stat-value">${value}</span>
          <span class="stat-track"><span class="stat-fill" style="display:block;width:${percentage}%"></span></span>
        </div>`;
    })
    .join("");

  const height = (pokemon.height / 10).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const weight = (pokemon.weight / 10).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const total = pokemon.stats.reduce((sum, item) => sum + item.base_stat, 0);

  elements.detail.innerHTML = `
    <div class="detail-hero">
      <span class="detail-number">${formatId(pokemon.id)}</span>
      <div style="position:absolute;top:0.75rem;left:0.85rem;">
        <button
          type="button"
          class="button-quiet"
          data-action="toggle-shiny"
          title="Alternar forma Shiny"
          style="padding:0.25rem 0.6rem;border-radius:999px;font-size:0.75rem;${isShinyMode ? "background:rgba(34,197,94,0.2);border-color:#22c55e;color:#4ade80;" : ""}"
        >
          ${isShinyMode ? "✨ Shiny ON" : "✧ Shiny"}
        </button>
      </div>

      ${image ? `<img class="detail-image" src="${escapeHTML(image)}" alt="${escapeHTML(pokemon.name)}" style="margin-top:0.85rem;">` : ""}
      <h3 class="detail-name">${escapeHTML(pokemon.name)} ${isShinyMode ? "✨" : ""}</h3>
      <div class="detail-types">${typeNames.map(typeMarkup).join("")}</div>
    </div>

    ${flavorText ? `<p class="detail-description">${escapeHTML(flavorText)}</p>` : ""}

    <div class="detail-facts">
      <div class="fact"><span class="fact-label">Altura</span><span class="fact-value">${height} m</span></div>
      <div class="fact"><span class="fact-label">Peso</span><span class="fact-value">${weight} kg</span></div>
      <div class="fact" style="grid-column:1 / -1;"><span class="fact-label">Habilidades (★ Oculta)</span><span class="fact-value">${escapeHTML(abilities.join(", ") || "—")}</span></div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.65rem;">
      <h4 class="stats-title" style="margin-bottom:0;">Atributos Base</h4>
      <span style="font-family:var(--font-display);font-size:0.78rem;font-weight:700;color:var(--text-muted);">BST ${total}</span>
    </div>
    ${stats}

    <div class="detail-actions">
      <button class="detail-action${favorite ? " is-active" : ""}" type="button" data-action="favorite" data-pokemon-id="${pokemon.id}">
        ${favorite ? "★ Favoritado" : "☆ Favoritar"}
      </button>
      <button class="detail-action${compared ? " is-active" : ""}" type="button" data-action="compare" data-pokemon-id="${pokemon.id}">
        ${compared ? "✓ Na Arena" : "⚔ Enviar p/ Arena"}
      </button>
    </div>

    <section class="evolution-section" aria-label="Linha evolutiva">
      <div class="evolution-heading">
        <span class="evolution-orbit" aria-hidden="true">✦</span>
        <div><p class="eyebrow">LINHA EVOLUTIVA</p><h4>Estágios da Espécie</h4></div>
      </div>
      <div class="evolution-tree" id="evolution-tree">
        ${evolutionMarkup.get(pokemon.id) || '<div class="evolution-loading"><span class="loading-spinner" aria-hidden="true"></span>Mapeando evoluções…</div>'}
      </div>
    </section>`;
}

function toggleFavorite(pokemon) {
  if (favorites.some((item) => item.id === pokemon.id)) {
    favorites = favorites.filter((item) => item.id !== pokemon.id);
    setSearchStatus(`${pokemon.name.toUpperCase()} foi removido da equipe.`);
  } else {
    if (favorites.length >= MAX_TEAM_SIZE) {
      setSearchStatus(`Sua equipe já está cheia (${MAX_TEAM_SIZE}/${MAX_TEAM_SIZE}). Libere um espaço primeiro!`, true);
      return;
    }
    favorites = [pokemon, ...favorites];
    setSearchStatus(`${pokemon.name.toUpperCase()} entrou para sua equipe!`);
  }
  saveFavorites();
  renderFavorites();
  renderDetail(pokemon, null);
}

function renderFavorites() {
  elements.favoritesCount.textContent = `${favorites.length}/${MAX_TEAM_SIZE}`;
  if (favorites.length === 0) {
    elements.favoritesList.innerHTML = '<li class="empty-message">Capture até 6 Pokémon favoritos para montar seu time.</li>';
    return;
  }
  elements.favoritesList.innerHTML = favorites
    .map((pokemon) => {
      const image = pokemonImage(pokemon, false);
      return `
        <li class="favorite-item">
          <button class="favorite-button" type="button" data-favorite-id="${pokemon.id}">
            <span class="favorite-info">
              ${image ? `<img class="favorite-thumb" src="${escapeHTML(image)}" alt="" loading="lazy">` : ""}
              <span>
                <span class="favorite-name">${escapeHTML(pokemon.name)}</span>
                <span class="favorite-number">${formatId(pokemon.id)} · ${pokemon.types.map((t) => typeLabel(t.type.name)).join(" / ")}</span>
              </span>
            </span>
            <span class="remove-favorite" title="Inspecionar">→</span>
          </button>
        </li>`;
    })
    .join("");
}

// ==========================================================================
// ARENA DE BATALHA VISUAL COM PESQUISA DIRETA & PODERES ELEMENTAIS
// ==========================================================================
function stopActiveBattle() {
  if (battleTimer) {
    clearInterval(battleTimer);
    battleTimer = null;
  }
}

function toggleComparison(pokemon, feedbackMsg = "") {
  stopActiveBattle();
  if (comparison.some((item) => item.id === pokemon.id)) {
    comparison = comparison.filter((item) => item.id !== pokemon.id);
  } else if (comparison.length < 2) {
    comparison = [...comparison, pokemon];
    setSearchStatus(`${pokemon.name} selecionado como Lutador ${comparison.length}!`);
  } else {
    comparison = [comparison[1], pokemon];
    setSearchStatus(`${pokemon.name} entrou na Arena!`);
  }
  arenaTab = "field";
  renderComparison(feedbackMsg);
  if (selectedPokemon) renderDetail(selectedPokemon, null);
}

async function addFighterBySearch(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  const feedbackEl = document.querySelector("#arena-search-feedback");
  const submitBtn = document.querySelector("#arena-search-btn");
  const inputEl = document.querySelector("#arena-search-input");

  if (!query) {
    if (feedbackEl) {
      feedbackEl.textContent = "Digite o nome ou número do Pokémon.";
      feedbackEl.classList.add("is-error");
    }
    inputEl?.focus();
    return;
  }

  if (!/^[a-z0-9-]+$/.test(query)) {
    if (feedbackEl) {
      feedbackEl.textContent = "Use apenas letras, números ou hífen.";
      feedbackEl.classList.add("is-error");
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Buscando…";
  }

  try {
    const pokemon = await getPokemon(query);
    if (comparison.some((p) => p.id === pokemon.id)) {
      renderComparison(`⚠️ ${pokemon.name.toUpperCase()} já está na Arena!`, true);
      return;
    }

    stopActiveBattle();
    if (comparison.length < 2) {
      comparison = [...comparison, pokemon];
    } else {
      comparison = [comparison[1], pokemon];
    }
    arenaTab = "field";
    renderComparison(`✓ ${pokemon.name.toUpperCase()} entrou na Arena!`);
    if (selectedPokemon) renderDetail(selectedPokemon, null);
  } catch {
    renderComparison("Pokémon não encontrado. Verifique o nome ou número.", true);
  }
}

async function startQuickRandomDuel() {
  stopActiveBattle();
  const id1 = 1 + Math.floor(Math.random() * 151);
  let id2 = 1 + Math.floor(Math.random() * 151);
  if (id2 === id1) id2 = (id1 % 151) + 1;

  const [p1, p2] = await Promise.all([getPokemon(id1), getPokemon(id2)]);
  comparison = [p1, p2];
  arenaTab = "field";
  renderComparison();
  if (selectedPokemon) renderDetail(selectedPokemon, null);
}

function getStatValue(pokemon, statName) {
  return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 50;
}

function getEffectiveness(attackerType, defenderTypes) {
  let mult = 1;
  defenderTypes.forEach((defType) => {
    if ((TYPE_ADVANTAGES[attackerType] || []).includes(defType)) mult *= 1.5;
    if ((TYPE_RESISTANCES[attackerType] || []).includes(defType)) mult *= 0.65;
  });
  return mult;
}

function buildFighter(pokemon) {
  const types = pokemon.types.map((t) => t.type.name);
  const maxHp = getStatValue(pokemon, "hp") * 2 + 52;
  const atk = Math.max(getStatValue(pokemon, "attack"), getStatValue(pokemon, "special-attack"));
  const def = Math.max(getStatValue(pokemon, "defense"), getStatValue(pokemon, "special-defense"));
  const spd = getStatValue(pokemon, "speed");

  return {
    id: pokemon.id,
    name: pokemon.name,
    types,
    maxHp,
    hp: maxHp,
    atk,
    def,
    spd,
  };
}

function spawnPowerEffect(attackerIdx, moveType, damage, isCrit, mult) {
  const ground = document.querySelector(".battle-ground");
  if (!ground) return;

  const fx = TYPE_FX[moveType] || TYPE_FX.normal;
  const fromSide = attackerIdx === 1 ? "from-left" : "from-right";
  const targetSide = attackerIdx === 1 ? "on-right" : "on-left";

  const projectile = document.createElement("span");
  projectile.className = `power-projectile ${fromSide}`;
  projectile.textContent = fx.icon;
  projectile.style.setProperty("--fx-color", fx.color);
  projectile.style.setProperty("--fx-glow", fx.glow);
  ground.appendChild(projectile);

  setTimeout(() => {
    projectile.remove();

    const impact = document.createElement("span");
    impact.className = `power-impact ${targetSide}`;
    impact.style.setProperty("--fx-color", fx.color);
    ground.appendChild(impact);

    const dmgBadge = document.createElement("span");
    dmgBadge.className = `floating-damage ${targetSide}`;
    dmgBadge.style.setProperty("--fx-color", fx.color);
    const badgeTag = isCrit ? " CRÍTICO!" : mult > 1.1 ? " 2x!" : "";
    dmgBadge.textContent = `-${damage} PS${badgeTag}`;
    ground.appendChild(dmgBadge);

    ground.classList.remove("is-shaking");
    void ground.offsetWidth;
    ground.classList.add("is-shaking");

    setTimeout(() => {
      impact.remove();
      dmgBadge.remove();
    }, 850);
  }, 380);
}

function runVisualBattle(first, second) {
  stopActiveBattle();

  const f1 = buildFighter(first);
  const f2 = buildFighter(second);

  const hpText1 = document.querySelector("#hud-hp-text-1");
  const hpText2 = document.querySelector("#hud-hp-text-2");
  const hpFill1 = document.querySelector("#hud-hp-fill-1");
  const hpFill2 = document.querySelector("#hud-hp-fill-2");
  const sprite1 = document.querySelector("#fighter-sprite-1");
  const sprite2 = document.querySelector("#fighter-sprite-2");
  const dialogText = document.querySelector("#battle-dialog-text");
  const fightBtn = document.querySelector('[data-action="start-battle"]');

  if (!dialogText) return;

  if (fightBtn) {
    fightBtn.disabled = true;
    fightBtn.textContent = "Lutando…";
  }

  function updateHud() {
    const pct1 = Math.max(0, Math.round((f1.hp / f1.maxHp) * 100));
    const pct2 = Math.max(0, Math.round((f2.hp / f2.maxHp) * 100));
    const color = (p) => (p > 50 ? "#22c55e" : p > 20 ? "#f59e0b" : "#ef4444");

    if (hpText1) hpText1.textContent = `${f1.hp}/${f1.maxHp}`;
    if (hpText2) hpText2.textContent = `${f2.hp}/${f2.maxHp}`;
    if (hpFill1) {
      hpFill1.style.width = `${pct1}%`;
      hpFill1.style.backgroundColor = color(pct1);
    }
    if (hpFill2) {
      hpFill2.style.width = `${pct2}%`;
      hpFill2.style.backgroundColor = color(pct2);
    }
  }

  function triggerAnim(attackerIdx) {
    const atkEl = attackerIdx === 1 ? sprite1 : sprite2;
    const defEl = attackerIdx === 1 ? sprite2 : sprite1;
    const atkClass = attackerIdx === 1 ? "is-attacking-left" : "is-attacking-right";

    if (atkEl) {
      atkEl.classList.remove(atkClass);
      void atkEl.offsetWidth;
      atkEl.classList.add(atkClass);
    }
    if (defEl) {
      setTimeout(() => {
        defEl.classList.remove("is-hit");
        void defEl.offsetWidth;
        defEl.classList.add("is-hit");
      }, 360);
    }
  }

  updateHud();
  dialogText.textContent = `${f1.name.toUpperCase()} vs ${f2.name.toUpperCase()} · Começou!`;

  let turn = 1;
  battleTimer = setInterval(() => {
    const order = f1.spd >= f2.spd ? [[f1, f2, 1], [f2, f1, 2]] : [[f2, f1, 2], [f1, f2, 1]];
    const [attacker, defender, idx] = order[(turn - 1) % 2];

    const chosenType = attacker.types[Math.floor(Math.random() * attacker.types.length)] || "normal";
    const moves = TYPE_MOVES[chosenType] || TYPE_MOVES.normal;
    const moveName = moves[Math.floor(Math.random() * moves.length)];
    const mult = getEffectiveness(chosenType, defender.types);
    const crit = Math.random() < 0.15;

    const damage = Math.max(
      10,
      Math.round(((attacker.atk / Math.max(35, defender.def)) * 32 + 14) * mult * (crit ? 1.35 : 1))
    );

    triggerAnim(idx);
    spawnPowerEffect(idx, chosenType, damage, crit, mult);

    const extra = mult > 1.1 ? " Super efetivo!" : crit ? " Golpe crítico!" : "";
    dialogText.textContent = `${attacker.name} lançou ${moveName}!${extra}`;

    setTimeout(() => {
      defender.hp = Math.max(0, defender.hp - damage);
      updateHud();

      if (defender.hp <= 0) {
        stopActiveBattle();
        dialogText.textContent = `🏆 ${attacker.name.toUpperCase()} venceu a batalha!`;
        if (fightBtn) {
          fightBtn.disabled = false;
          fightBtn.textContent = "↻ Revanche";
        }
      }
    }, 400);

    turn += 1;
  }, 1350);
}

function renderComparison(feedbackMessage = "", isFeedbackError = false) {
  const headerControls = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.65rem;">
      <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);">MODO ARENA</span>
      <div class="arena-header-actions">
        <button type="button" class="btn-quick-duel" data-action="quick-duel">⚡ Duelo Rápido</button>
        ${comparison.length > 0 ? `<button type="button" class="btn-clear-arena" data-action="clear-arena">Limpar</button>` : ""}
      </div>
    </div>
    <form class="arena-search-form" id="arena-search-form">
      <input
        id="arena-search-input"
        class="arena-search-input"
        type="search"
        placeholder="Pesquisar lutador (ex.: Mewtwo, 6)…"
        autocomplete="off"
      >
      <button type="submit" id="arena-search-btn" class="btn-arena-add">+ Lutador</button>
    </form>
    <p id="arena-search-feedback" class="arena-search-feedback${isFeedbackError ? " is-error" : ""}">${escapeHTML(feedbackMessage)}</p>`;

  if (comparison.length === 0) {
    elements.comparison.innerHTML = `
      ${headerControls}
      <p class="empty-message">Pesquise 2 Pokémon acima, escolha nas cartas ou clique em <strong>⚡ Duelo Rápido</strong>.</p>`;
    return;
  }

  const p1 = comparison[0];
  const p2 = comparison[1];

  const fightersBar = `
    <div class="arena-fighters-bar">
      <div class="fighter-pill">
        <div class="fighter-pill-info">
          <img src="${escapeHTML(pokemonImage(p1, false))}" alt="">
          <div>
            <span class="fighter-pill-label">Lutador 1</span>
            <span class="fighter-pill-name">${escapeHTML(p1.name)}</span>
          </div>
        </div>
        <button class="compare-remove" type="button" data-remove-compare="${p1.id}" title="Remover">×</button>
      </div>

      <button type="button" class="btn-swap-fighters" data-action="swap-fighters" title="Inverter lados" ${!p2 ? "disabled" : ""}>⇄</button>

      ${
        p2
          ? `<div class="fighter-pill">
              <div class="fighter-pill-info">
                <img src="${escapeHTML(pokemonImage(p2, false))}" alt="">
                <div>
                  <span class="fighter-pill-label">Lutador 2</span>
                  <span class="fighter-pill-name">${escapeHTML(p2.name)}</span>
                </div>
              </div>
              <button class="compare-remove" type="button" data-remove-compare="${p2.id}" title="Remover">×</button>
            </div>`
          : `<div class="fighter-pill" style="justify-content:center;border-style:dashed;color:var(--text-muted);font-size:0.78rem;">
              + Lutador 2
            </div>`
      }
    </div>`;

  if (!p2) {
    elements.comparison.innerHTML = `
      ${headerControls}
      ${fightersBar}
      <p class="empty-message">Pesquise ou selecione mais 1 Pokémon para liberar o campo de batalha!</p>`;
    return;
  }

  const f1 = buildFighter(p1);
  const f2 = buildFighter(p2);

  const tabsHtml = `
    <div class="arena-tabs">
      <button type="button" class="arena-tab${arenaTab === "field" ? " is-active" : ""}" data-arena-tab="field">⚔ Campo de Batalha</button>
      <button type="button" class="arena-tab${arenaTab === "stats" ? " is-active" : ""}" data-arena-tab="stats">📊 Radar & Status</button>
    </div>`;

  let bodyHtml = "";
  if (arenaTab === "field") {
    bodyHtml = `
      <div class="battle-stage-card">
        <div class="battle-hud-row">
          <div class="hud-box">
            <div class="hud-top">
              <span class="hud-name">${escapeHTML(p1.name)}</span>
              <span class="hud-level">NV.50</span>
            </div>
            <div class="hud-hp-bar"><div id="hud-hp-fill-1" class="hud-hp-fill" style="width:100%;"></div></div>
            <div class="hud-bottom">
              <span>${p1.types.map((t) => typeLabel(t.type.name)).join("/")}</span>
              <span id="hud-hp-text-1">${f1.maxHp}/${f1.maxHp}</span>
            </div>
          </div>

          <div class="hud-box">
            <div class="hud-top">
              <span class="hud-name">${escapeHTML(p2.name)}</span>
              <span class="hud-level">NV.50</span>
            </div>
            <div class="hud-hp-bar"><div id="hud-hp-fill-2" class="hud-hp-fill" style="width:100%;"></div></div>
            <div class="hud-bottom">
              <span>${p2.types.map((t) => typeLabel(t.type.name)).join("/")}</span>
              <span id="hud-hp-text-2">${f2.maxHp}/${f2.maxHp}</span>
            </div>
          </div>
        </div>

        <div class="battle-ground">
          <div class="fighter-spot">
            <img id="fighter-sprite-1" class="fighter-sprite is-left" src="${escapeHTML(pokemonImage(p1, false))}" alt="${escapeHTML(p1.name)}">
            <span class="fighter-platform"></span>
          </div>

          <span class="vs-medallion">VS</span>

          <div class="fighter-spot">
            <img id="fighter-sprite-2" class="fighter-sprite" src="${escapeHTML(pokemonImage(p2, false))}" alt="${escapeHTML(p2.name)}">
            <span class="fighter-platform"></span>
          </div>
        </div>

        <div class="battle-dialog-box">
          <span id="battle-dialog-text" class="battle-dialog-text">${escapeHTML(p1.name)} vs ${escapeHTML(p2.name)} · Pronto para lutar!</span>
          <button type="button" class="btn-fight-trigger" data-action="start-battle">▶ Lutar</button>
        </div>
      </div>`;
  } else {
    const firstStats = new Map(p1.stats.map(({ stat, base_stat: value }) => [stat.name, value]));
    const secondStats = new Map(p2.stats.map(({ stat, base_stat: value }) => [stat.name, value]));

    const rows = Object.entries(STAT_NAMES)
      .map(([key, label]) => {
        const v1 = firstStats.get(key) || 0;
        const v2 = secondStats.get(key) || 0;
        return `
          <tr>
            <th>${escapeHTML(label)}</th>
            <td style="${v1 > v2 ? "font-weight:800;color:#4ade80;" : ""}">${v1}</td>
            <td style="${v2 > v1 ? "font-weight:800;color:#4ade80;" : ""}">${v2}</td>
          </tr>`;
      })
      .join("");

    bodyHtml = `
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Atributo</th>
              <th>${escapeHTML(p1.name)}</th>
              <th>${escapeHTML(p2.name)}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  elements.comparison.innerHTML = `${headerControls}${fightersBar}${tabsHtml}${bodyHtml}`;
}

function restoreCatalog() {
  elements.input.value = "";
  currentType = "";
  currentPage = 0;
  elements.filterButtons.forEach((button) => {
    const active = button.dataset.type === "";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  setSearchStatus("");
  loadCatalog();
}

// ==========================================================================
// EFEITO HOLOGRÁFICO 3D INTERATIVO NAS CARTAS
// ==========================================================================
elements.grid.addEventListener("mousemove", (event) => {
  const card = event.target.closest(".pokemon-card");
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = `perspective(700px) rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) translateY(-4px)`;
});

elements.grid.addEventListener("mouseleave", () => {
  elements.grid.querySelectorAll(".pokemon-card").forEach((card) => {
    card.style.transform = "";
  });
});

elements.grid.addEventListener("mouseout", (event) => {
  const card = event.target.closest(".pokemon-card");
  if (card && !card.contains(event.relatedTarget)) {
    card.style.transform = "";
  }
});

// ==========================================================================
// EVENTOS PRINCIPAIS
// ==========================================================================
elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(elements.input.value);
});

elements.quickSearchButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    elements.input.value = btn.dataset.quickSearch;
    runSearch(btn.dataset.quickSearch);
  });
});

elements.randomButton.addEventListener("click", loadRandomPokemon);

elements.filterButtons.forEach((button) => {
  button.addEventListener("click", () => loadType(button.dataset.type));
});

elements.previousPage.addEventListener("click", () => {
  if (currentPage === 0) return;
  currentPage -= 1;
  if (currentType) renderCurrentPage();
  else loadCatalog();
});

elements.nextPage.addEventListener("click", () => {
  const totalPages = Math.ceil(catalogTotal / PAGE_SIZE);
  if (currentPage >= totalPages - 1) return;
  currentPage += 1;
  if (currentType) renderCurrentPage();
  else loadCatalog();
});

elements.clearSearch.addEventListener("click", restoreCatalog);

elements.grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-pokemon-id]");
  if (card) selectPokemon(Number(card.dataset.pokemonId));
});

elements.detail.addEventListener("click", async (event) => {
  const evolutionButton = event.target.closest("[data-evolution-id]");
  if (evolutionButton) {
    const pokemon = await getPokemon(evolutionButton.dataset.evolutionId);
    elements.input.value = pokemon.name;
    setSearchStatus(`Explorando evolução: ${pokemon.name.toUpperCase()}.`);
    await selectPokemon(pokemon);
    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "toggle-shiny" && selectedPokemon) {
    isShinyMode = !isShinyMode;
    renderDetail(selectedPokemon, null);
    return;
  }

  const pokemon = await getPokemon(button.dataset.pokemonId);
  if (button.dataset.action === "favorite") toggleFavorite(pokemon);
  if (button.dataset.action === "compare") toggleComparison(pokemon);
});

elements.favoritesList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;
  const pokemon = favorites.find((item) => item.id === Number(button.dataset.favoriteId));
  if (pokemon) await selectPokemon(pokemon);
});

elements.comparison.addEventListener("submit", (event) => {
  if (event.target.id === "arena-search-form") {
    event.preventDefault();
    const input = event.target.querySelector("#arena-search-input");
    if (input) addFighterBySearch(input.value);
  }
});

elements.comparison.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-compare]");
  if (removeBtn) {
    stopActiveBattle();
    comparison = comparison.filter((p) => p.id !== Number(removeBtn.dataset.removeCompare));
    renderComparison();
    if (selectedPokemon) renderDetail(selectedPokemon, null);
    return;
  }

  const tabBtn = event.target.closest("[data-arena-tab]");
  if (tabBtn) {
    stopActiveBattle();
    arenaTab = tabBtn.dataset.arenaTab;
    renderComparison();
    return;
  }

  const actionBtn = event.target.closest("[data-action]");
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  if (action === "quick-duel") {
    startQuickRandomDuel();
  } else if (action === "clear-arena") {
    stopActiveBattle();
    comparison = [];
    renderComparison();
    if (selectedPokemon) renderDetail(selectedPokemon, null);
  } else if (action === "swap-fighters" && comparison.length === 2) {
    stopActiveBattle();
    comparison = [comparison[1], comparison[0]];
    renderComparison();
  } else if (action === "start-battle" && comparison.length === 2) {
    runVisualBattle(comparison[0], comparison[1]);
  }
});

renderComparison();
renderFavorites();
loadCatalog();