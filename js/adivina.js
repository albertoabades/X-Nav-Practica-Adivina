var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
var map;
var placecoords;
var coords;
var myVar;
var numPhotos;
var dist;
var puntuacion;
var juego;
var nivel;
var marcado = 0;
var marker1;
var marker2;
var currstate = 0;
var partidasjugadas = 0;
var state;
var marcadores = [];

$(document).ready(function(){ 

	map = L.map('mapa').setView([0,0], 2);
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

    $("#startGame").click(function(){
    	if (name != " " && nivel != " "){
			resetear();
	        startGame();
    	}
    });

    $("#stopGame").click(function(){
    	clearTimeout(myVar);
    });

    $("#continuar").click(function(){
		showPics(placetag);
    });

    $("#abortGame").click(function(){
		resetear();
		$("#juegoelegido").val("");
		$("#level").val("");
		partidasjugadas--;
    	clearTimeout(myVar);
    	document.getElementById("fotos").innerHTML = "";
    });

    $("#capitales").click(function(){
    	juego = "Capitales";
    	$("#juegoelegido").val(juego);
    });

    $("#paises").click(function(){
    	juego = "Paises";
    	$("#juegoelegido").val(juego);
    });

    $("#facil").click(function(){
    	nivel = 1;
    	$("#level").val("Facil");
    });

    $("#medio").click(function(){
    	nivel = 2;
    	$("#level").val("Medio");
    });

    $("#dificil").click(function(){
    	nivel = 3;
    	$("#level").val("Dificil");
    });

    window.onpopstate= function(event) {
       	nivel=event.state.difficulty;
		juego=event.state.name;
		$("#juegoelegido").val(juego);
		if(nivel == 1){$("#level").val("Facil")};
		if(nivel == 2){$("#level").val("Medio")};
		if(nivel == 3){$("#level").val("Dificil")};
		borrarMarcadores();
		startGame();
    };

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function resetear(){
	$("#selectCoords").val("");
	$("#correctCoords").val("");
	$("#name").val("");
	$("#distance").val("");
	$("#photos").val("");
	$("#points").val("");
}

function startGame(){
	resetear();
	borrarMarcadores();
	partidasjugadas++;
	if (marcado == 1){
		map.removeLayer(marker1);
		map.removeLayer(marker2);
	}	
	numPhotos = 0;
	i=0;
	$.getJSON("juegos/"+juego+".json", function(datos){
		var place = datos.features[Math.floor(Math.random()*datos.features.length)];
       	placecoords=place.geometry.coordinates;
	    placetag=place.properties.Name;
	    showPics(placetag);
	    map.on('click', onMapClick);
	});
}

function showPics(placetag){
    $.getJSON(flickerAPI,{
		tags:placetag,
		tagmode:"any",
		format:"json"
	}).done(function(data){
		data = data.items.splice(0,30);
		myVar = setInterval(function () {myTimer()}, 1000/nivel);
		function myTimer() {
			document.getElementById("fotos").innerHTML = "";
			html = '<img src="' + data[i].media.m + '"width="500px" height="280px">';
			document.getElementById("fotos").innerHTML = html;
			i++;
			numPhotos++;
			$("#photos").val(numPhotos);
		}
	});
}

function calcularPuntuacion(){
    var puntuacion = dist*numPhotos;
    $("#points").val(puntuacion.toFixed(3));
}

function onMapClick(e) {
	var marker = "";
	var lat = e.latlng.toString();
	coords = lat.substring(6);
	marker1 = L.marker(e.latlng).addTo(map);
	$("#selectCoords").val(coords);
	dist=e.latlng.distanceTo(L.latLng(placecoords[1], placecoords[0]))/1000;
	$("#distance").val(dist.toFixed(3));
	$("#correctCoords").val("("+placecoords+")");
	$("#name").val(placetag);
	marker2 = L.marker(L.latLng(placecoords[1], placecoords[0])).addTo(map);
	marcadores.push(marker1);
	marcadores.push(marker2);
	clearTimeout(myVar);
	calcularPuntuacion();
	if(partidasjugadas > currstate)
		saveHistory();
}

function saveHistory(){
	var stateObj={
		name:juego,
		date:new Date(),
		difficulty:nivel
	}
	currstate++;
	var html= '<a href="javascript:goTo('+currstate+')">'+juego+'Fecha:'+stateObj.date+'</a>'+'<br>';
	$('#historial').append(html);
	var ruta = "?"+juego+nivel;
	history.pushState(stateObj,'Historial',ruta);
}

function goTo(State){
	state= State - currstate;
	if(state==0){
		startGame();
	}else{
		history.go(state);
	}
}

function borrarMarcadores(){
    $.each (marcadores, function(i, marker){
        map.removeLayer(marker)        
    });
    marcadores = []
    map.setView([0, 0], 2);
}
