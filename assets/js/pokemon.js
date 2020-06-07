/**
 * Api Challenge pokemon
 * 
 * @author Daniel Martinez Sierra
 */


// HELPERS

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

let d = document;


// FUNCTIONALITY 

ready(function () {

    const pokemon = (function () {

        const DOM = {
            poke_list: d.getElementById('poke-list'),
            select_pokemon_number : d.getElementById('select-pokemon-number')
        };
            
        async function getApiPokemon(limit = 151) {
            const API_POKEMON = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

            try {
                const response = await axios.get(API_POKEMON);

                return response.data

            } catch (error) {
                console.error(error);
            }
        }

        async function getApiDetailPokemon(number) {
            const API_DETAIL_POKEMON = `https://pokeapi.co/api/v2/pokemon-species/${number}/`;

            try {
                const response = await axios.get(API_DETAIL_POKEMON);

                return response.data

            } catch (error) {
                console.error(error);
            }
        }

        async function render() {
            const numberPokemon = DOM.select_pokemon_number.options[DOM.select_pokemon_number.selectedIndex].value;
            const dataPokemon = await getApiPokemon(numberPokemon);
            const listPokemons = dataPokemon?.results;
            let items = ``;

            listPokemons.forEach((pokemon, index) => {
                items += createCardPokemon(pokemon, index + 1);
            });

            DOM.poke_list.insertAdjacentHTML('beforeend', items);

            addEvents();
        }

        function removeListPokemon(){
            DOM.poke_list.innerHTML = null;
        }

        function createCardPokemon(pokemon, number) {

            let urlImage = `https://pokeres.bastionbot.org/images/pokemon/${number}.png`;

            return `
            <div class="col-md-3 mb-2">
                <div class="card w-100" data-number="${number}" data-name="${pokemon.name}" data-img="${urlImage}">
                    <img src="${urlImage}" class="card-img img-fluid" alt="${pokemon.name}_${number}">
                    <div class="card-body">
                        <p class="card-text text-center text-capitalize">#${number}  ${pokemon.name}</p>
                        <div class="text-center">
                            <a href="#" data-open="detail" class="btn btn-block btn-primary">Ver Detalle</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        function addEvents() {
            let buttonsDetail = DOM.poke_list.querySelectorAll('a[data-open="detail"]');

            buttonsDetail.forEach((button) => {
                button.addEventListener('click', showDetailPokemon)
            });

            DOM.select_pokemon_number.addEventListener('change', showNumberPokemon )

        }

        async function showDetailPokemon(e) {
            let btn = e.target,
                card = btn.closest('div.card'),
                detailPokemon = await getApiDetailPokemon(card.dataset.number),
                description = detailPokemon.flavor_text_entries.filter(function (flavor) {
                    return flavor.language.name === 'es'
                })[0];

            Swal.fire({
                title: card.dataset.name,
                imageUrl: card.dataset.img,
                imageWidth: 300,
                imageHeight: 200,
                width: 600,
                showCloseButton: true,
                confirmButtonText: 'Aceptar',
                imageAlt: `pokemon_no_${card.dataset.number}`,
                html: `
                <p>${description.flavor_text}</p>
                <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Caracteristica</th>
                            <th scope="col">Descripción</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">envolves_from_species</th>
                            <td>${(detailPokemon.evolves_from_species) != null ? detailPokemon.evolves_from_species.name : 'n/a'}</td>
                        </tr>
                        <tr>
                            <th scope="row">generacion</th>
                            <td>${detailPokemon.generation.name}</td>
                        </tr>
                        <tr>
                            <th scope="row">habitat</th>
                            <td>${detailPokemon.habitat.name}</td>
                        </tr>
                        <tr>
                            <th scope="row">growth_rate</th>
                            <td>${detailPokemon.growth_rate.name}</td>
                        </tr>
                        </tbody>
                    </table>
                `,
            })
        }

        function showNumberPokemon(e){
            removeListPokemon();
            render();
        }

        render();
    })();
});

