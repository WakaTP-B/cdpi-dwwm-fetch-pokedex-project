// Création array pour tous all pokémons
let allPokemons = [];

// Fetch
fetch("https://pokebuildapi.fr/api/v1/pokemon")
    .then(response_obj => response_obj.json())
    .then(pokemons => {
        // On stock tous les pokémons
        allPokemons = pokemons;
        const loading = document.querySelector(".loading");
        loading.remove();

        // On affiche la liste complète au départ
        showPokemons(allPokemons);
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

    // Affichage random par default
    const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    showPokemonDesc(randomPokemon);

}

// Fonction affichage des pokémons
function showPokemonDesc(pokemon) {
    const detailSection = document.querySelector(".pokemon-details");
    const descriptionTemplate = document.getElementById("description-template");

    // Clone du template
    const clone = descriptionTemplate.content.cloneNode(true);

    // Remplissage du template
    clone.querySelector(".desc-id").textContent = "#" + pokemon.id;
    clone.querySelector(".desc-img").src = pokemon.image;
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

    let evoFound = false;

    // Pré-évolution
    if (pokemon.apiPreEvolution) {
        evoFound = true;
        const prePokemonId = pokemon.apiPreEvolution.pokedexIdd;
        fetch(`https://pokebuildapi.fr/api/v1/pokemon/${prePokemonId}`)
            .then(res => res.json())
            .then(prePokemon => {
                const preClone = evoTemplate.content.cloneNode(true);
                preClone.querySelector(".evo-id").textContent = "#" + prePokemon.id;
                preClone.querySelector(".evo-name").textContent = prePokemon.name;
                preClone.querySelector(".evo-img").src = prePokemon.sprite;
                evoContainer.appendChild(preClone);
            });
    }

    // Évolution
    if (pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0) {
        evoFound = true;
        const evo = pokemon.apiEvolutions[0];
        fetch(`https://pokebuildapi.fr/api/v1/pokemon/${evo.pokedexId}`)
            .then(res => res.json())
            .then(postPokemon => {
                const evoClone = evoTemplate.content.cloneNode(true);
                evoClone.querySelector(".evo-id").textContent = "#" + postPokemon.id;
                evoClone.querySelector(".evo-name").textContent = postPokemon.name;
                evoClone.querySelector(".evo-img").src = postPokemon.sprite;
                evoContainer.appendChild(evoClone);
            });
    }

    // Aucune évolution
    if (!pokemon.apiPreEvolution && (!pokemon.apiEvolutions || pokemon.apiEvolutions.length === 0)) {
        const noEvo = document.createElement("p");
        noEvo.textContent = "Aucune évolution connue.";
        evoContainer.appendChild(noEvo);
    }

    // Nettoyage et affichage
    detailSection.querySelector(".description")?.remove();
    detailSection.appendChild(clone);
}


// Filtre
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", (event) => {
    // String venant du formulaire
    const searchStr = event.target.value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchStr) ||
        pokemon.id.toString().includes(searchStr)
    );

    // On affiche uniquement les pokémons filtrés
    showPokemons(filteredPokemons);
});
