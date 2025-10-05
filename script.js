// --- VARIABLES GLOBALES ---
// Création array pour tous all pokémons
let allPokemons = [];

// --- FETCH DES DONNÉES ---
fetch("https://pokebuildapi.fr/api/v1/pokemon")
    .then(response_obj => response_obj.json())
    .then(pokemons => {
        // On stock tous les pokémons
        allPokemons = pokemons;
        const loading = document.querySelector(".loading");
        loading.remove();

        // On affiche la liste complète au départ
        afficherPokemons(allPokemons);
    });

// --- FONCTION POUR AFFICHER LES POKÉMONS ---
function afficherPokemons(pokemons) {
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
        pokemonId.textContent = pokemon.id;

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
    });
}

// --- FILTRAGE EN TEMPS RÉEL ---
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", (event) => {
    // String venant du formulaire
    const searchTerm = event.target.value.toLowerCase();
    const filtered = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    // On affiche uniquement les pokémons filtrés
    afficherPokemons(filtered);
});
