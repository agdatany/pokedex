var listaPokemons = [];
var barraAberta = false;

async function pegarListaPokemons(){
    await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10000")
        .then(response => response.json())
        .then(data => {
            todosPokemons = data;

            for(let i = 0; i < data.count; i++){
                if(data.results[i].url.split('/')[data.results[i].url.split('/').length - 2] < 10000){
                    listaPokemons.push(data.results[i].name);
                }
            }
        })
        .catch(erro => console.log(erro));
}

async function pegarPokemonInfo(pokemon){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
    return response.json();
}

async function pegarSuperEfetivo(url){
    const response = await fetch(url);
    return response.json();
}

async function inserirInfos(nomePokemon){
    let infoPokemon = await pegarPokemonInfo(nomePokemon);

    // Setando imagem
    $('#foto-pokemon').attr('src', infoPokemon.sprites.other["official-artwork"].front_default);

    // Setando nome e número
    $('#nome-pokemon').text(capitalize(infoPokemon.species.name));
    $('#numero-pokemon').text(`No. ${completaZeroEsquerda(infoPokemon.id)}`);

    // Pegando o tipo, super efetivo e fraqueza do pokemon
    $('.tipos-pokemon .tipos .tipo').remove();
    $('.superefetivo .tipos .tipo').remove();
    $('.fraco-contra .tipos .tipo').remove();
    
    let superEfetivos = [];
    let fracoContra = [];

    for(let i = 0; i < infoPokemon.types.length; i++){
        let tipo = await pegarSuperEfetivo(infoPokemon.types[i].type.url);

        $('.tipos-pokemon .tipos').append(`<div class="tipo tipo-${tipo.name}">${capitalize(tipo.name)}</div>`);

        for(let index = 0; index < tipo.damage_relations.double_damage_to.length; index++){
            let tipoSuperEfetivo = tipo.damage_relations.double_damage_to[index].name;

            if(!superEfetivos.includes(tipoSuperEfetivo)){
                superEfetivos.push(tipoSuperEfetivo);
                $('.superefetivo .tipos').append(`<div class="tipo tipo-${tipoSuperEfetivo}">${capitalize(tipoSuperEfetivo)}</div>`);
            }
        }
        
        for(let index = 0; index < tipo.damage_relations.double_damage_from.length; index++){
            let tipoFracoContra = tipo.damage_relations.double_damage_from[index].name;

            if(!fracoContra.includes(tipoFracoContra)){
                fracoContra.push(tipoFracoContra);
                $('.fraco-contra .tipos').append(`<div class="tipo tipo-${tipoFracoContra}">${capitalize(tipoFracoContra)}</div>`);
            }
        }
    }
}

async function pegarFracoContra(tipoPokemon){

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

function sortearNumeros(quantidade){
    let numeros_aleatorios = [];
    for(let i = 0; i < quantidade; i++){
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
    let numeros_aleatorios = sortearNumeros(5);

    for(let i = 0; i < 5; i++){
        $('.itens-pesquisa').append(`<div class="item-pesquisa">${capitalize(listaPokemons[numeros_aleatorios[i]])}</div>`);
    }
    
    barraAberta = true;
});

// Evento de teclado na barra de pesquisa
$('#inputSearchPokemon').on('keyup', function(){
    let listaFiltrada = [];
    let inputFiltro = $('#inputSearchPokemon').val();

    limparPesquisa();

    if(inputFiltro.length == 0){
        let numeros_aleatorios = sortearNumeros(5);
        for(let i = 0; i < 5; i++){
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
    
    for(let i = 1; i < 6; i++){
        if(i <= listaFiltrada.length){
            $('.itens-pesquisa').append(`<div class="item-pesquisa">${listaFiltrada[i - 1]}</div>`);
        }
    }
});

// Colocar seleção por teclado depois para pesquisar o selecionado caso haja
$('#btnSearchPokemon').on('click', function(e){
    e.preventDefault();
});

function completaZeroEsquerda(numero){
    numero = String(numero);
    if(numero.length < 3){
        for (let index = 0; index <= 3 - numero.length; index++){
            numero = [numero.slice(0, 0), '0', numero.slice(0)].join('');
        }
    }

    return numero;
}

// Clicou em um pokemon da barra de pesquisa
$('.pesquisa').on('click', async function(event){
    if($(event.target).hasClass('item-pesquisa')){
        inserirInfos($(event.target).text());
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

// Pegando informação no início
$(document).ready(async function(){
    if(listaPokemons.length == 0){
        await pegarListaPokemons();
        
        let numeros_aleatorios = sortearNumeros(1);

        await inserirInfos(listaPokemons[numeros_aleatorios[0]]);
    }
});