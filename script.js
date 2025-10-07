// Variables Globales
let allPokemons = [];
let allTypes = [];
let selectedTypes = [];

// Fetch pokemons
fetch("https://pokebuildapi.fr/api/v1/pokemon")
    .then(response_obj => response_obj.json())
    .then(pokemons => {
        // On stock tous les pokémons
        allPokemons = pokemons;
        const loading = document.querySelector(".loading");
        if (loading) loading.remove(); // guard ajouté

        // On affiche la liste complète au départ
        showPokemons(allPokemons);
    })
    .catch(err => {
        console.error("Erreur fetch pokemons:", err);
    });

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

    // --- Affichage random selon filtres actifs ---
    if (pokemons.length > 0) {
        const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
        showPokemonDesc(randomPokemon);
    } else {
        // si aucun résultat
        const detailSection = document.querySelector(".pokemon-details");
        if (detailSection) {
            detailSection.innerHTML = "<p>Aucun Pokémon trouvé.</p>";
        }
    }
}

// Fonction affichage des pokémons
function showPokemonDesc(pokemon) {
    const detailSection = document.querySelector(".pokemon-details");
    const descriptionTemplate = document.getElementById("description-template");
    if (!detailSection || !descriptionTemplate) {
        console.warn("Élément .pokemon-details ou #description-template introuvable");
        return;
    }

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
    // typeTemplate.remove();

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
    // evoTemplate.remove();
    const preEvoContainer = evoContainer.querySelector(".pre-evo");
    const postEvoContainer = evoContainer.querySelector(".evo");
    const preEvoMsg = evoContainer.querySelector(".no-pre-evo");
    const postEvoMsg = evoContainer.querySelector(".no-evo");

    // Clean card évolution
    preEvoContainer.querySelectorAll(".evo-card").forEach(el => el.remove());
    postEvoContainer.querySelectorAll(".evo-card").forEach(el => el.remove());

    // Reset message
    if (preEvoMsg) preEvoMsg.textContent = "Pré-évolution non disponible";
    if (postEvoMsg) postEvoMsg.textContent = "Aucune évolution connue";

    // Pré-évolution
    if (pokemon.apiPreEvolution && pokemon.apiPreEvolution !== "none") {
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
                if (preEvoMsg) preEvoMsg.textContent = "";
            })
            .catch(err => console.error("Erreur fetch pré-évolution:", err));
    } else {
        if (preEvoMsg) preEvoMsg.textContent = "Aucune pré-évolution.";
    }

    // Évolution
    if (pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0) {
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
                    if (postEvoMsg) postEvoMsg.textContent = "";
                })
                .catch(err => console.error("Erreur fetch évolution:", err));
        });
    } else {
        if (postEvoMsg) postEvoMsg.textContent = "Aucune évolution connue.";
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
        img.dataset.type = type.name
        img.dataset.type = type.name.toLowerCase();
        img.classList.add("type-icon");

        img.addEventListener("click", () => {
            const tLower = type.name.toLowerCase();
            if (selectedTypes.includes(tLower)) {
                selectedTypes = selectedTypes.filter(t => t !== tLower);
                img.classList.remove("selected");
            } else {
                selectedTypes.push(tLower);
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
} else {
    console.warn("#search-input introuvable — le filtre par texte est désactivé");
}

function applyFilters() {
    // String venant du formulaire
    const searchStr = (searchInput && searchInput.value) ? searchInput.value.toLowerCase() : "";

    const filteredPokemons = allPokemons.filter(pokemon => {
        const matchNameOrId =
            (pokemon.name && pokemon.name.toLowerCase().includes(searchStr)) ||
            (pokemon.id && pokemon.id.toString().includes(searchStr));

        const types = pokemon.apiTypes || [];
        const matchType = selectedTypes.length === 0 ||
            selectedTypes.every(sel => types.some(t => (t.name || "").toLowerCase() === sel));

        return matchNameOrId && matchType;
    });

    const pokemonList = document.querySelector(".pokemon-list");
    const detailSection = document.querySelector(".pokemon-details");

    if (!filteredPokemons.length) {

        if (detailSection) {
            detailSection.innerHTML = '<p class="no-result">Aucun Pokémon correspondant.</p>';
        }
        return;
    }


    // Affiche uniquement les pokémons filtrés
    showPokemons(filteredPokemons);
}
