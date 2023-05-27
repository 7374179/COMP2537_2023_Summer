var pokemons = [];

const CARD_NUMBERS  = 10;
// var numPages = 0;
let currentPage = 1;

const updatePaginationDiv = (currentPage, numPages) => {
  const numPageBtn = 5;

  var startI, endI;

  if (numPages <= numPageBtn) {
    startI = 1;
    endI = numPages;
  } else {
    if (currentPage <= Math.ceil(numPageBtn / 2)) {
      startI = 1;
      endI = numPageBtn;
    } else if (currentPage >= numPages - Math.floor(numPageBtn / 2)) {
      startI = numPages - numPageBtn + 1;
      endI = numPages;
    } else {
      startI = currentPage - Math.floor(numPageBtn / 2);
      endI = currentPage + Math.floor(numPageBtn / 2);
    }
  }

  $('#pagination').empty();

  if (currentPage > 1) {
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="pagefirst" pageNum="1">First</button> 
    `);
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="pageprev" pageNum="${currentPage - 1}">Prev</button> 
    `);
  }

  for (let i = startI; i <= endI; i++) {
    var active = "";
    if (i == currentPage) {
      active = "active";
    }
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn ${active}" id="page${i}" pageNum="${i}">${i}</button>
    `);
  }

  if (currentPage < numPages) {
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="pagenext" pageNum="${currentPage + 1}">Next</button> 
    `);
    $('#pagination').append(`
      <button type="button" class="btn btn-primary pageBtn" id="pagelast" pageNum="${numPages}">Last</button> 
    `);
  }
}




const paginate = async (currentPage, CARD_NUMBERS , pokemons) => {

  const typeFilters = Array.from($('.typeFilter:checked')).map((checkbox) => checkbox.value);
  
  let filteredPokemons = pokemons;
  if (typeFilters.length > 0) {
    filteredPokemons = await Promise.all(pokemons.map(async (pokemon) => {
      const res = await axios.get(pokemon.url);
      const types = res.data.types.map((type) => type.type.name);
      if (typeFilters.every((filter) => types.includes(filter))) {
        return pokemon;
      }
      return null;
    }));
    filteredPokemons = filteredPokemons.filter((pokemon) => pokemon !== null);
  }


  const updatePokeCardsHeader = (currentPage, CARD_NUMBERS, totalPokemons) => {
    const startPokemon = (currentPage - 1) * CARD_NUMBERS + 1;
    const endPokemon = Math.min(currentPage * CARD_NUMBERS, totalPokemons);
    const pokeCardsHeader = `
      <div id="pokeCardsHeader">
        <h3>Showing ${startPokemon} - ${endPokemon} of ${totalPokemons} pokemons</h3>
      </div>
    `;
    $('#pokeCardsHeader').html(pokeCardsHeader);
  };

  updatePokeCardsHeader(currentPage, CARD_NUMBERS, filteredPokemons.length);

  $('#pokeCards').empty()
  

    if (filteredPokemons.length > 0) {

    for (let i = (currentPage - 1) * CARD_NUMBERS; i < currentPage * CARD_NUMBERS && i < filteredPokemons.length; i++) {

      let innerResponse = await axios.get(`${filteredPokemons[i].url}`);

    let thisPokemon = innerResponse.data;
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${thisPokemon.name}   >
      <h3>${thisPokemon.name}</h3> 
      <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
      More</button>
      </div>  
     `);
    }
  }

  const numOfPokemon = filteredPokemons.length;

  const numOfPokemonInPage = (currentPage - 1) * CARD_NUMBERS + 1;
  const endPokemonInPage = Math.min(currentPage * CARD_NUMBERS, numOfPokemon);
  $('#numOfPokemon').html(`<p>You are watching ${numOfPokemonInPage} - ${endPokemonInPage} pokemons out of total ${numOfPokemon} pokemons</p>`);
}

const setup = async () => {
  // $('#pokeCards').empty()
  
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');

  // pokemons = response.data.results;

  // paginate(currentPage, CARD_NUMBERS , pokemons)

  // numPages = Math.ceil(pokemons.length / CARD_NUMBERS );
  // console.log("numPages: ", numPages);

  // updatePaginationDiv(currentPage, numPages)


  
  pokemons = response.data.results;

  numPages = Math.ceil(pokemons.length / CARD_NUMBERS);

  const typeAPI = await axios.get('https://pokeapi.co/api/v2/type');
  const types = typeAPI.data.results;

  types.forEach((type) => {
    $('#typeFilters').append(`
      <div class="form-check form-check-inline">
        <input class="form-check-input typeFilter" type="checkbox" value="${type.name}" id="${type.name}">
        <label class="form-check-label" for="${type.name}">
          ${type.name}
        </label>
      </div>
    `);
  });

  $('body').on('change', '.typeFilter', async function (e) {
    currentPage = 1;

    const typeFilters = Array.from($('.typeFilter:checked')).map((checkbox) => checkbox.value);

    let filteredPokemons = pokemons;
    if (typeFilters.length > 0) {
      filteredPokemons = await Promise.all(pokemons.map(async (pokemon) => {
        const res = await axios.get(pokemon.url);
        const types = res.data.types.map((type) => type.type.name);
        if (typeFilters.every((filter) => types.includes(filter))) {
          return pokemon;
        }
        return null;
      }));
      filteredPokemons = filteredPokemons.filter((pokemon) => pokemon !== null);
    }

    numPages = Math.ceil(filteredPokemons.length / CARD_NUMBERS);
    updatePaginationDiv(currentPage, numPages);
    paginate(currentPage, CARD_NUMBERS, filteredPokemons);
  });

  updatePaginationDiv(currentPage, numPages);
  paginate(currentPage, CARD_NUMBERS, pokemons);

  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const types = res.data.types.map((type) => type.type.name)
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  });

  // add event listener to pagination buttons
  $('body').on('click', '.pageBtn', async function (e) {

    const pageNum = parseInt($(this).attr('pageNum'));
    currentPage = pageNum;
    paginate(currentPage, CARD_NUMBERS, pokemons);

    updatePaginationDiv(currentPage, numPages)
  });

        // const typeAPI = await axios.get('https://pokeapi.co/api/v2/type');
        // const types = typeAPI.data.results;
      
        // types.forEach((type) => {
        //   $('#typeFilters').append(`
        //     <div class="form-check form-check-inline">
        //       <input class="form-check-input typeFilter" type="checkbox" value="${type.name}" id="${type.name}">
        //       <label class="form-check-label" for="${type.name}">
        //         ${type.name}
        //       </label>
        //     </div>
        //   `);
        // });

        $('body').on('change', '.typeFilter', async function (e) {
          currentPage = 1;
          paginate(currentPage, CARD_NUMBERS , pokemons);
      
          const numPages = Math.ceil(pokemons.length / CARD_NUMBERS );
          updatePaginationDiv(currentPage, numPages);
        });

  console.log("end of setup");
};

$(document).ready(setup)