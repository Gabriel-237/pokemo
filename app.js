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
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidade",
};

const TYPE_COLORS = {
  normal: "#e7e9ef",
  fire: "#ffe3d6",
  water: "#d8ecff",
  grass: "#dcf5dc",
  electric: "#fff3c4",
  ice: "#d6f6fc",
  fighting: "#ffd9d9",
  poison: "#f2d9ff",
  ground: "#f7e5c6",
  flying: "#e2e6ff",
  psychic: "#ffd9eb",
  bug: "#ebf7cf",
  rock: "#ebe6df",
  ghost: "#e1e0ff",
  dragon: "#dce0ff",
  dark: "#dfe3eb",
  steel: "#e3e9f0",
  fairy: "#ffe0f0",
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
  const firstType = types[0] || "normal";
  const image = pokemonImage(pokemon, false);
  const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return `
    <button
      class="pokemon-card${selectedPokemon?.id === pokemon.id ? " is-selected" : ""}"
      type="button"
      data-pokemon-id="${pokemon.id}"
      aria-label="Inspecionar ${escapeHTML(pokemon.name)}"
      style="--card-tint:${TYPE_COLORS[firstType] || "#e6e9ff"}"
    >
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <span class="card-number" style="background:rgba(255,255,255,0.85);">⚡ ${totalStats}</span>
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
  elements.catalogCaption.textContent = "Selecione dois Pokémon e clique em Duelar para iniciar uma batalha!";
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
  const firstType = typeNames[0] || "normal";
  const abilities = pokemon.abilities.map(({ ability }) => ability.name.replaceAll("-", " "));
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
    <div class="detail-hero" style="background: linear-gradient(180deg, ${TYPE_COLORS[firstType] || "#f1f5f9"} 0%, #ffffff 100%);">
      <span class="detail-number">${formatId(pokemon.id)}</span>
      <div style="position:absolute;top:0.75rem;left:0.85rem;">
        <button
          type="button"
          class="button-quiet"
          data-action="toggle-shiny"
          title="Alternar forma Shiny"
          style="padding:0.25rem 0.6rem;border-radius:999px;font-size:0.75rem;${isShinyMode ? "background:#fef3c7;border-color:#f59e0b;color:#92400e;" : ""}"
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
      <div class="fact"><span class="fact-label">Habilidade</span><span class="fact-value">${escapeHTML(abilities[0] || "—")}</span></div>
      <div class="fact"><span class="fact-label">Poder Total</span><span class="fact-value">${total} pts</span></div>
    </div>

    <h4 class="stats-title">Atributos de Combate</h4>
    ${stats}

    <div class="detail-actions">
      <button class="detail-action${favorite ? " is-active" : ""}" type="button" data-action="favorite" data-pokemon-id="${pokemon.id}">
        ${favorite ? "★ Na Equipe" : "☆ Capturar"}
      </button>
      <button class="detail-action${compared ? " is-active" : ""}" type="button" data-action="compare" data-pokemon-id="${pokemon.id}">
        ${compared ? "✓ Na Arena" : "⚔ Duelar"}
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
    setSearchStatus(`${pokemon.name.toUpperCase()} foi liberado da equipe.`);
  } else {
    if (favorites.length >= MAX_TEAM_SIZE) {
      setSearchStatus(`Sua equipe já está cheia (${MAX_TEAM_SIZE}/${MAX_TEAM_SIZE}). Libere um espaço primeiro!`, true);
      return;
    }
    favorites = [pokemon, ...favorites];
    setSearchStatus(`Pokébola vai! ${pokemon.name.toUpperCase()} entrou para sua equipe!`);
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

function stopActiveBattle() {
  if (battleTimer) {
    clearInterval(battleTimer);
    battleTimer = null;
  }
}

function toggleComparison(pokemon) {
  stopActiveBattle();
  if (comparison.some((item) => item.id === pokemon.id)) {
    comparison = comparison.filter((item) => item.id !== pokemon.id);
  } else if (comparison.length < 2) {
    comparison = [...comparison, pokemon];
  } else {
    comparison = [comparison[1], pokemon];
  }
  renderComparison();
  renderDetail(pokemon, null);
}

// ==========================================================================
// SISTEMA DE BATALHA POR TURNOS NA ARENA
// ==========================================================================
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
  const maxHp = getStatValue(pokemon, "hp") * 3 + 60;
  const atk = Math.max(getStatValue(pokemon, "attack"), getStatValue(pokemon, "special-attack"));
  const def = Math.max(getStatValue(pokemon, "defense"), getStatValue(pokemon, "special-defense"));
  const spd = getStatValue(pokemon, "speed");

  return {
    id: pokemon.id,
    name: pokemon.name.toUpperCase(),
    types,
    maxHp,
    hp: maxHp,
    atk,
    def,
    spd,
  };
}

function startTurnBattle(first, second) {
  stopActiveBattle();

  const arenaBox = document.querySelector("#battle-arena-box");
  const startBtn = document.querySelector('[data-action="start-battle"]');
  if (!arenaBox) return;

  const f1 = buildFighter(first);
  const f2 = buildFighter(second);
  let turn = 1;
  const logs = [];

  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = "⚔ Batalha em andamento…";
  }

  function updateArenaUI(winner = null) {
    const p1Pct = Math.max(0, Math.round((f1.hp / f1.maxHp) * 100));
    const p2Pct = Math.max(0, Math.round((f2.hp / f2.maxHp) * 100));

    const barColor = (pct) => (pct > 50 ? "#22c55e" : pct > 20 ? "#f59e0b" : "#ef4444");

    arenaBox.hidden = false;
    arenaBox.innerHTML = `
      <div style="background:var(--bg-surface-soft);border:1px solid var(--border-color);border-radius:14px;padding:0.9rem;display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;margin-bottom:0.25rem;">
            <span>${escapeHTML(f1.name)}</span>
            <span>${Math.max(0, f1.hp)} / ${f1.maxHp} HP</span>
          </div>
          <div class="stat-track"><span class="stat-fill" style="display:block;width:${p1Pct}%;background:${barColor(p1Pct)};"></span></div>
        </div>

        <div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:700;margin-bottom:0.25rem;">
            <span>${escapeHTML(f2.name)}</span>
            <span>${Math.max(0, f2.hp)} / ${f2.maxHp} HP</span>
          </div>
          <div class="stat-track"><span class="stat-fill" style="display:block;width:${p2Pct}%;background:${barColor(p2Pct)};"></span></div>
        </div>

        <div style="max-height:165px;overflow-y:auto;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:0.65rem;font-size:0.8rem;display:flex;flex-direction:column;gap:0.4rem;">
          ${logs.map((entry) => `<div>${entry}</div>`).join("")}
        </div>

        ${
          winner
            ? `<div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:0.65rem 0.8rem;border-radius:10px;font-weight:700;font-size:0.86rem;text-align:center;">
                🏆 ${escapeHTML(winner.name)} venceu a batalha no turno ${turn}!
              </div>`
            : ""
        }
      </div>`;
  }

  function executeAttack(attacker, defender) {
    const chosenType = attacker.types[Math.floor(Math.random() * attacker.types.length)] || "normal";
    const moves = TYPE_MOVES[chosenType] || TYPE_MOVES.normal;
    const moveName = moves[Math.floor(Math.random() * moves.length)];

    const effectiveness = getEffectiveness(chosenType, defender.types);
    const isCrit = Math.random() < 0.15;
    const variance = 0.88 + Math.random() * 0.24;

    const rawDamage = ((attacker.atk / Math.max(35, defender.def)) * 34 + 14) * effectiveness * (isCrit ? 1.4 : 1) * variance;
    const damage = Math.max(8, Math.round(rawDamage));
    defender.hp = Math.max(0, defender.hp - damage);

    let tag = "";
    if (effectiveness > 1.1) tag += ' <strong style="color:#16a34a;">(Super efetivo!)</strong>';
    else if (effectiveness < 0.9) tag += ' <span style="color:#6b7280;">(Pouco efetivo)</span>';
    if (isCrit) tag += ' <strong style="color:#dc2626;">⚡ Crítico!</strong>';

    logs.unshift(
      `<strong>[T${turn}]</strong> ${escapeHTML(attacker.name)} usou <em>${escapeHTML(moveName)}</em> e causou <strong>${damage} de dano</strong>!${tag}`
    );
  }

  logs.unshift(`🔥 <strong>${escapeHTML(f1.name)}</strong> vs <strong>${escapeHTML(f2.name)}</strong> — A batalha começou!`);
  updateArenaUI();

  battleTimer = setInterval(() => {
    const [firstAttacker, secondAttacker] = f1.spd >= f2.spd ? [f1, f2] : [f2, f1];

    executeAttack(firstAttacker, secondAttacker);
    if (secondAttacker.hp <= 0) {
      stopActiveBattle();
      updateArenaUI(firstAttacker);
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "🔄 Batalhar Novamente";
      }
      return;
    }

    executeAttack(secondAttacker, firstAttacker);
    if (firstAttacker.hp <= 0) {
      stopActiveBattle();
      updateArenaUI(secondAttacker);
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "🔄 Batalhar Novamente";
      }
      return;
    }

    updateArenaUI();
    turn += 1;
  }, 1100);
}

function renderComparison() {
  if (comparison.length === 0) {
    elements.comparison.innerHTML = '<p class="empty-message">Adicione 2 Pokémon pelo scanner para iniciar a batalha.</p>';
    return;
  }

  const slots = comparison
    .map((pokemon) => {
      const image = pokemonImage(pokemon, false);
      return `
        <div class="compare-slot">
          ${image ? `<img class="compare-slot-image" src="${escapeHTML(image)}" alt="" loading="lazy">` : ""}
          <span class="compare-slot-name">
            ${escapeHTML(pokemon.name)}
            <span class="compare-slot-number">${formatId(pokemon.id)} · ${pokemon.types.map((t) => typeLabel(t.type.name)).join(" / ")}</span>
          </span>
          <button class="compare-remove" type="button" data-remove-compare="${pokemon.id}" aria-label="Remover ${escapeHTML(pokemon.name)}">×</button>
        </div>`;
    })
    .join("");

  let battleSection = "";
  if (comparison.length === 2) {
    const [first, second] = comparison;
    const firstStats = new Map(first.stats.map(({ stat, base_stat: value }) => [stat.name, value]));
    const secondStats = new Map(second.stats.map(({ stat, base_stat: value }) => [stat.name, value]));

    const rows = Object.entries(STAT_NAMES)
      .map(([key, label]) => {
        const v1 = firstStats.get(key) || 0;
        const v2 = secondStats.get(key) || 0;
        return `
          <tr>
            <th>${escapeHTML(label)}</th>
            <td style="${v1 > v2 ? "font-weight:800;color:#16a34a;" : ""}">${v1}</td>
            <td style="${v2 > v1 ? "font-weight:800;color:#16a34a;" : ""}">${v2}</td>
          </tr>`;
      })
      .join("");

    battleSection = `
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Atributo</th>
              <th>${escapeHTML(first.name)}</th>
              <th>${escapeHTML(second.name)}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <button class="button button-primary" type="button" data-action="start-battle" style="width:100%;margin-top:0.35rem;">
        ⚔ Iniciar Batalha por Turnos
      </button>
      <div id="battle-arena-box" hidden></div>`;
  }

  elements.comparison.innerHTML = `${slots}${battleSection}`;
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

elements.comparison.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-compare]");
  if (removeBtn) {
    stopActiveBattle();
    comparison = comparison.filter((pokemon) => pokemon.id !== Number(removeBtn.dataset.removeCompare));
    renderComparison();
    if (selectedPokemon) renderDetail(selectedPokemon, null);
    return;
  }

  const battleBtn = event.target.closest('[data-action="start-battle"]');
  if (battleBtn && comparison.length === 2) {
    startTurnBattle(comparison[0], comparison[1]);
  }
});

renderFavorites();
renderComparison();
loadCatalog();