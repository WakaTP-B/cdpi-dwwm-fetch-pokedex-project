
fetch("https://pokebuildapi.fr/api/v1/pokemon")
    .then(response_obj => response_obj.json())
    .then(allPokemons => {
        const loading = document.querySelector(".loading");
        loading.remove();

        const pokemonList = document.querySelector(".pokemon-list");

        allPokemons.forEach(pokemon => {

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
    });
