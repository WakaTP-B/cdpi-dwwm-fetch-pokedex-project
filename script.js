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
    typeContainer.removeChild(typeTemplate);

    pokemon.apiTypes.forEach(type => {
        const typeClone = typeTemplate.content.cloneNode(true);
        typeClone.querySelector(".type-name").textContent = type.name;
        const typeImg = typeClone.querySelector(".type-img");
        typeImg.src = type.image;
        typeImg.alt = type.name;
        typeContainer.appendChild(typeClone);
    });

    // Gestion des évolutions (si dispo)
    const evoContainer = clone.querySelector(".evolution");
    const evoTemplate = evoContainer.querySelector("#evolution-template");
    evoContainer.removeChild(evoTemplate);
    if (pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0) {
        pokemon.apiEvolutions.forEach(evo => {
            const evoClone = evoTemplate.content.cloneNode(true);
            evoClone.querySelector(".evo-id").textContent = "#" + evo.pokedexId;
            evoClone.querySelector(".evo-name").textContent = evo.name;
            const evoImg = evoClone.querySelector(".evo-img");
            evoImg.src = evo.image;
            evoImg.alt = evo.name;
            evoContainer.appendChild(evoClone);
        });
    } else {
        const noEvo = document.createElement("p");
        noEvo.textContent = "Aucune évolution connue.";
        evoContainer.appendChild(noEvo);
    }

    // Remplacement du contenu précédent
    const oldDescription = detailSection.querySelector(".description");
    if (oldDescription) oldDescription.remove();
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
