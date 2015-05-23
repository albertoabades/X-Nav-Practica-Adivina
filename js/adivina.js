var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
var map;
var placecoords;
var myVar;
var numPhotos;

$(document).ready(function(){ 
	$("#selectCoords").val("");
	$("#correctCoords").val("");
	$("#name").val("");
	$("#distance").val("");
	$("#photos").val("");

	map = L.map('mapa').setView([40.2838, -3.8215], 2);
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var popup = L.popup();
	var popup2 = L.popup();
	function onMapClick(e) {
		var marker = "";
		var lat = e.latlng.toString();
		var coords = lat.substring(6);
		var marker = L.marker(e.latlng).addTo(map);
		$("#selectCoords").val(coords);
		var dist=e.latlng.distanceTo(L.latLng(placecoords[0], placecoords[1]))/1000;
		$("#distance").val(dist.toFixed(3));
		$("#correctCoords").val("("+placecoords+")");
	    $("#name").val(placetag);
	    var marker = L.marker(L.latLng(placecoords[0], placecoords[1])).addTo(map);
	    clearTimeout(myVar);
	}
	//map.on('click', onMapClick);

	function startGame(){
		numPhotos = 0;
		$.getJSON("juegos/Capitales.json", function(datos){
			var place = datos.features[Math.floor(Math.random()*datos.features.length)];
	        placecoords=place.geometry.coordinates;
	        placetag=place.properties.Name;
	        showPics(placetag);
	        map.on('click', onMapClick);
		});
	}

    $("#startGame").click(function(){
        startGame();
    });

    $("#stopGame").click(function(){
    	clearTimeout(myVar);
    });

    $("#abortGame").click(function(){
    	$("#selectCoords").val("");
		$("#correctCoords").val("");
		$("#name").val("");
		$("#distance").val("");
		$("#photos").val("");
    	clearTimeout(myVar);
    	document.getElementById("fotos").innerHTML = "";
    });

    function showPics(placetag){
    	i=0;
    	$.getJSON(flickerAPI,{
			tags:placetag,
			tagmode:"any",
			format:"json"
		}).done(function(data){
			data = data.items.splice(0,20);
			myVar = setInterval(function () {myTimer()}, 1000);
			function myTimer() {
				document.getElementById("fotos").innerHTML = "";
				html = '<img src="' + data[i].media.m + '"width="500px" "height="330px">';
				document.getElementById("fotos").innerHTML = html;
				i++;
				numPhotos++;
				$("#photos").val(numPhotos);
			}
		});
    }

});