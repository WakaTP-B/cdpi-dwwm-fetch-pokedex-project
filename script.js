// Variables Globales
let allPokemons = [];
let allTypes = [];
let selectedTypes = [];

// Éviter reload sur formulaire
const searchForm = document.querySelector('.search-bar');
if (searchForm) {
    searchForm.addEventListener('submit', e => e.preventDefault());
}

// Fetch pokemons
fetch("https://pokebuildapi.fr/api/v1/pokemon")
    .then(response_obj => response_obj.json())
    .then(pokemons => {
        // On stock tous les pokémons
        allPokemons = pokemons;
        const loading = document.querySelector(".loading");
        if (loading) loading.remove();

        // On affiche la liste complète au départ
        showPokemons(allPokemons);
    })

// Fetch types
fetch("https://pokebuildapi.fr/api/v1/types")
    .then(res => res.json())
    .then(types => {
        allTypes = types;
        showTypes(types);
    })
    .catch(err => {
        console.error("Erreur fetch types:", err);
    });

// Affichage des pokemons
function showPokemons(pokemons) {
    const pokemonList = document.querySelector(".pokemon-list");
    // on vide la liste avant d’ajouter les nouvelles cards
    pokemonList.innerHTML = "";

    //Aucun résultat
    if (pokemons.length === 0) {
        const noResultMsg = document.createElement("p");
        noResultMsg.classList.add("no-result");
        noResultMsg.textContent = "Aucun Pokémon correspondant.";
        pokemonList.appendChild(noResultMsg);

        showNoResultDesc(); // 
        return;
    }

    pokemons.forEach(pokemon => {

        // Création du HTML pour la liste
        // div card
        const card = document.createElement("div");
        card.classList.add("pokemon-card");

        // Pokemon ID 
        const pokemonId = document.createElement("span");
        pokemonId.textContent = '#' + pokemon.id;

        // Pokemon name 
        const pokemonName = document.createElement("span");
        pokemonName.textContent = pokemon.name;

        // Pokemon sprite
        const pokemonSprite = document.createElement("img");
        pokemonSprite.src = pokemon.sprite;
        pokemonSprite.alt = pokemon.name;

        // Formation de la card
        card.append(pokemonId, pokemonName, pokemonSprite);

        // Insértion dans la séction 
        pokemonList.append(card);

        // Affiche description au clic
        card.addEventListener("click", () => showPokemonDesc(pokemon));

    });

    // Affichage random selon filtres actifs
    if (pokemons.length > 0) {
        const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
        showPokemonDesc(randomPokemon);
    }
}

// Aucun résultat
function showNoResultDesc() {
    const detailSection = document.querySelector(".pokemon-details");
    const descriptionTemplate = document.getElementById("description-template");
    if (!detailSection || !descriptionTemplate) return;

    const clone = descriptionTemplate.content.cloneNode(true);

    clone.querySelector(".desc-id").textContent = "#???";
    const img = clone.querySelector(".desc-img");
    // Remplace <img> ===> <p>
    const noResult = document.createElement("p");
    noResult.textContent = "Aucun Pokémon correspondant";
    noResult.classList.add("no-result");
    img.replaceWith(noResult);

    clone.querySelector(".desc-name").textContent = "???";

    const typeContainer = clone.querySelector(".desc-type");
    typeContainer.innerHTML = "<span>Type : ???</span>";

    const evoContainer = clone.querySelector(".evolution");
    evoContainer.innerHTML = "<p class='no-result'>Aucune évolution correspondante</p>";

    // Nettoyage + affichage
    detailSection.querySelector(".description")?.remove();
    detailSection.appendChild(clone);
}

// Fonction affichage des pokémons
function showPokemonDesc(pokemon) {
    const detailSection = document.querySelector(".pokemon-details");
    const descriptionTemplate = document.getElementById("description-template");

    // Clone du template
    const clone = descriptionTemplate.content.cloneNode(true);

    // Remplissage du template
    clone.querySelector(".desc-id").textContent = "#" + pokemon.id;
    clone.querySelector(".desc-img").src = pokemon.image || pokemon.sprite || "";
    clone.querySelector(".desc-img").alt = pokemon.name;
    clone.querySelector(".desc-name").textContent = pokemon.name;

    // Type
    const typeContainer = clone.querySelector(".desc-type");
    const typeTemplate = typeContainer.querySelector("#type-template");

    pokemon.apiTypes.forEach(type => {
        const typeClone = typeTemplate.content.cloneNode(true);
        const typeImg = typeClone.querySelector(".type-img");
        typeClone.querySelector(".type-name").textContent = type.name;
        typeImg.src = type.image;
        typeImg.alt = type.name;
        typeContainer.appendChild(typeClone);
    });

    // Gestion des évolutions (si dispo)
    const evoContainer = clone.querySelector(".evolution");
    const evoTemplate = evoContainer.querySelector("#evolution-template");
    const preEvoContainer = evoContainer.querySelector(".pre-evo");
    const postEvoContainer = evoContainer.querySelector(".evo");
    const preEvoMsg = evoContainer.querySelector(".no-pre-evo");
    const postEvoMsg = evoContainer.querySelector(".no-evo");

    // Clean card évolution
    preEvoContainer.querySelectorAll(".evo-card").forEach(el => el.remove());
    postEvoContainer.querySelectorAll(".evo-card").forEach(el => el.remove());

    // Reset message
    if (preEvoMsg) preEvoMsg.textContent = "Pas de pré-évolution";
    if (postEvoMsg) postEvoMsg.textContent = "Aucune évolution connue";

    // Pré-évolution
    if (pokemon.apiPreEvolution && pokemon.apiPreEvolution !== "none") {

        if (preEvoMsg) preEvoMsg.textContent = "";

        const prePokemonId = pokemon.apiPreEvolution.pokedexIdd;
        fetch(`https://pokebuildapi.fr/api/v1/pokemon/${prePokemonId}`)
            .then(res => res.json())
            .then(prePokemon => {
                const preClone = evoTemplate.content.cloneNode(true);
                preClone.querySelector(".evo-info").textContent = "Pré-évolution";
                preClone.querySelector(".evo-id").textContent = "#" + prePokemon.id;
                preClone.querySelector(".evo-name").textContent = prePokemon.name;
                preClone.querySelector(".evo-img").src = prePokemon.sprite;
                preEvoContainer.appendChild(preClone);

            })
    }

    // Évolution
    if (pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0) {
        if (postEvoMsg) postEvoMsg.textContent = "";

        pokemon.apiEvolutions.forEach(evo => {
            fetch(`https://pokebuildapi.fr/api/v1/pokemon/${evo.pokedexId}`)
                .then(res => res.json())
                .then(postPokemon => {
                    const evoClone = evoTemplate.content.cloneNode(true);
                    evoClone.querySelector(".evo-info").textContent = "Évolution";
                    evoClone.querySelector(".evo-id").textContent = "#" + postPokemon.id;
                    evoClone.querySelector(".evo-name").textContent = postPokemon.name;
                    evoClone.querySelector(".evo-img").src = postPokemon.sprite;
                    postEvoContainer.appendChild(evoClone);
                })
        });
    }
    // Nettoyage et affichage
    detailSection.querySelector(".description")?.remove();
    detailSection.appendChild(clone);
}

// Affichage Types
function showTypes(types) {
    const typeContainer = document.querySelector(".type-filter");
    typeContainer.innerHTML = "";

    types.forEach(type => {
        const img = document.createElement("img");
        img.src = type.image;
        img.alt = type.name;
        img.title = type.name;
        img.classList.add("type-icon");
        img.dataset.type = type.name.toLowerCase();

        //img.addEventListener("click", function () {
        img.addEventListener("click", () => {
            const typeLower = type.name.toLowerCase();
            if (selectedTypes.includes(typeLower)) {

                // selectedTypes = selectedTypes.filter(function(type) {
                //     return typeCourant !== typeLower;
                // });
                selectedTypes = selectedTypes.filter(type => type !== typeLower);
                img.classList.remove("selected");
            } else {
                selectedTypes.push(typeLower);
                img.classList.add("selected");
            }
            applyFilters();
        });

        typeContainer.appendChild(img);
    });
}

// Filtre
const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

function applyFilters() {
    // String venant du formulaire
    const searchStr = searchInput.value.toLowerCase();

    const filteredPokemons = allPokemons.filter(pokemon => {
        const matchNameOrId =
            pokemon.name.toLowerCase().includes(searchStr) ||
            pokemon.id.toString().includes(searchStr);

        const allTypes = pokemon.apiTypes;
        const matchType =
            selectedTypes.length === 0 ||
            selectedTypes.every(filterType =>
                allTypes.some(type => type.name.toLowerCase() === filterType));

        return matchNameOrId && matchType;
    });

    // Affiche uniquement les pokémons filtrés
    showPokemons(filteredPokemons);
}
