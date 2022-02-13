var listaPokemons = [];
var barraAberta = false;

async function pegarListaPokemons(){
    await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10000")
        .then(response => response.json())
        .then(data => {
            todosPokemons = data;

            for(var i = 0; i < data.count; i++){
                listaPokemons.push(data.results[i].name);
            }
        })
        .catch(erro => console.log(erro));
}

async function pegarPokemonInfo(pokemon){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
    return response.json();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function abrirPesquisa(){
    $("#inputSearchPokemon").css('border-radius', '7px 0 0 0');
    $("#btnSearchPokemon").css('border-radius', '0 7px 0 0');
}

function fecharPesquisa(){
    $("#inputSearchPokemon").css('border-radius', '7px 0 0 7px');
    $("#btnSearchPokemon").css('border-radius', '0 7px 7px 0');
}

function limparPesquisa(){
    $('.item-pesquisa').remove();
}

function sortearNumeros(){
    let numeros_aleatorios = [];
    for(var i = 0; i < 5; i++){
        numeros_aleatorios.push(Math.floor(Math.random() * (listaPokemons.length)));
    }

    return numeros_aleatorios;
}

// Abrir barra de pesquisa clicando nela
$('#inputSearchPokemon').on('click', async function(){
    if(listaPokemons.length == 0){
        await pegarListaPokemons();
    }

    if(barraAberta){
        return false;
    }
    
    abrirPesquisa();

    $('.barra-de-pesquisa').after('<div class="itens-pesquisa"></div>');

    // Colocando as divs da barra da pesquisa
    var numeros_aleatorios = sortearNumeros();

    for(var i = 0; i < 5; i++){
        $('.itens-pesquisa').append(`<div class="item-pesquisa">${capitalize(listaPokemons[numeros_aleatorios[i]])}</div>`);
    }
    
    barraAberta = true;
});

// Evento de teclado na barra de pesquisa
$('#inputSearchPokemon').on('keyup', function(){
    var listaFiltrada = [];
    let inputFiltro = $('#inputSearchPokemon').val();

    limparPesquisa();

    if(inputFiltro.length == 0){
        var numeros_aleatorios = sortearNumeros();
        for(var i = 0; i < 5; i++){
            $('.itens-pesquisa').append(`<div class="item-pesquisa">${capitalize(listaPokemons[numeros_aleatorios[i]])}</div>`);
        }
        return false;
    }

    listaPokemons.forEach(item => {
        if(item.toLowerCase().startsWith(inputFiltro.toLowerCase())){
            listaFiltrada.push(capitalize(item));
        }
    });

    if(listaFiltrada.length == 0){
        $('.itens-pesquisa').append(`<div class="item-pesquisa sem-resultado">Nenhum resultado encontrado</div>`);
    }
    
    for(var i = 1; i < 6; i++){
        if(i <= listaFiltrada.length){
            $('.itens-pesquisa').append(`<div class="item-pesquisa">${listaFiltrada[i - 1]}</div>`);
        }
    }
});

// Colocar seleção por teclado depois para pesquisar o selecionado caso haja
$('#btnSearchPokemon').on('click', function(e){
    e.preventDefault();
});

// Clicou em um pokemon da barra de pesquisa
$('.pesquisa').on('click', async function(event){
    if($(event.target).hasClass('item-pesquisa')){
        let infoPokemon = await pegarPokemonInfo($(event.target).text());
    }
});

// Fechar a barra de pesquisa quando clica fora dela
$(document).on('click', function(event){
    if(barraAberta && !$(event.target).closest('.pesquisa').length){
        $('.itens-pesquisa').remove();
        
        fecharPesquisa();
    
        barraAberta = false;
    }
});