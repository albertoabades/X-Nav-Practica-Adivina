var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";


$(document).ready(function(){ 
	$("#selectCoords").val("");

    var map = L.map('mapa').setView([40.2838, -3.8215], 2);
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

 	//var popup = L.popup();
	//function onMapClick(e) {
    //	popup
    //    .setLatLng(e.latlng)
    //    .setContent("You clicked the map at " + e.latlng.toString())
    //    .openOn(map);
	//}
	//map.on('click', onMapClick);

	function onMapClick2(e) {
		var marker = "";
		var lat = e.latlng.toString();
		var coords = lat.substring(6);
		var marker = L.marker(e.latlng).addTo(map);
		$("#selectCoords").val(coords);
	}
	map.on('click', onMapClick2);

	function startGame(){
		$.getJSON("juegos/Capitales.json", function(datos){
			console.log("SSSSSSS");
		});
	}

    $("#startGame").click(function(){
    	console.log("!!!!!!");
        startGame();
        console.log("ªªªªªªªªªªª");
    });


	/*
	function showPics(tag,coords){
		$.getJSON(flickerAPI,{
			tags:tag,
			tagmode:"any",
			format:"json"
		})
		.done(function(data){
	        data = data.items.splice(0,10);
	        for(i=0; i<10 ; i++){
	            var html;
	            if(i===0){
	                html='<div class="item active">'
	                    html+='<img id="carousel0" src="'+data[i].media.m+'"width="100%" "height="360px">'
	                html+='</div>'
	            }else{
	                html='<div class="item">'
	                    html+='<img id="carousel'+i+'" src="'+data[i].media.m+'"width="100%" "height="360px">'
	                html+='</div>'
	            }
	            $(".carousel-inner").append(html);
	        } 
	    });
	}
	*/

});