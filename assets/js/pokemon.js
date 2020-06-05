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

        const API_POKEMON = 'https://pokeapi.co/api/v2/pokemon?limit=10';

        const DOM = {
            app_pokemon: d.getElementById('app-pokemon')
        };

        async function getApiPokemon() {
            try {
                const response = await axios.get(API_POKEMON);

                return response.data

            } catch (error) {
                console.error(error);
            }
        }

        async function render() {
            const dataPokemon = await getApiPokemon();
            const listPokemons = dataPokemon?.results;
            let items = ``;

            listPokemons.forEach((pokemon,index) => {                
                items += createCardPokemon(pokemon,index + 1);
            });

            DOM.app_pokemon.insertAdjacentHTML('beforeend', items);

            addEvents();
        }

        function createCardPokemon(pokemon,number) {

            let urlImage = `https://pokeres.bastionbot.org/images/pokemon/${number}.png`;

            return `
            <div class="col-md-4 mb-3">
                <div class="card" data-number="${number}" data-name="${pokemon.name}" data-img="${urlImage}">
                    <img src="${urlImage}" class="card-img img-fluid" alt="${pokemon.name}_${number}">
                    <div class="card-body">
                        <p class="card-text text-center">${pokemon.name}</p>
                        <a href="#" data-open="detail" class="btn btn-primary">Abrir</a>
                        <a href="#" data-attack="attack" class="btn btn-danger">Ataques</a>
                    </div>
                </div>
            </div>
            `;
        }

        function addEvents(){
            let buttonsDetail = DOM.app_pokemon.querySelectorAll('a[data-open="detail"]');
            let buttonsAttack = DOM.app_pokemon.querySelectorAll('a[data-open="attack"]');
            
            buttonsDetail.forEach( (button) => {
                button.addEventListener('click',function(e){
                    let btn = e.target,
                              card = btn.closest('div.card');

                    Swal.fire({
                        title: card.dataset.name,
                        text: 'Modal with a custom image.',
                        imageUrl: card.dataset.img,
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                      })
                })
            });


            buttonsAttack.forEach((button) => {
                buttonsAttack.addEventListener('click',function(e){
                    Swal.fire({
                        title: '',
                        text: 'Modal with a custom image.',
                        imageUrl: 'https://unsplash.it/400/200',
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                      })
                })
            });

        }

        render();
    })();
});

