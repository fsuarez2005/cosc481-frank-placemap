/* placemap -- google maps frontend */

function PlaceMap () {
    /* constructor */
    var infowindow = new google.maps.InfoWindow();

    var googleMap;
    var googleMapOptions = {
	zoom: 12,
	center: new google.maps.LatLng(40,-83),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	overviewMapControl: true
    }
    // ----------------------------------------------------------
    // load necessary libraries
    function loadLibrary() {}


    function getMap () {
	return googleMap;
    }
    this.getMap = getMap;

    function addOption(k,v) {
	googleMapOptions[k] = v;
    }
    this.addOption = addOption;

    // ----------------------------------------------------------

    function loadMap() {

	googleMap = new google.maps.Map(document.getElementById("map_canvas"),
				  googleMapOptions);


	//google.maps.event.addListener(googleMap, 'click', function(event) {
	//placeMarker(event.latLng);
	//});

	findPlaces();


    }
    this.loadMap = loadMap;

    // ----------------------------------------------------------

    
    function placeMarker(location) {
	var marker = new google.maps.Marker({
	    position: location, 
	    map: googleMap
	});
	
	googleMap.setCenter(location);
    }
    this.placeMarker = placeMarker;

    // ----------------------------------------------------------

    function findPlaces() {
	// find places from center of map
	var request = {
	    location: googleMapOptions['center'], 
	    // new google.maps.LatLng(-33.8665433,151.1956316),
	    radius: '1500',
	    types: ['store']
	};

	service = new google.maps.places.PlacesService(googleMap);
	service.search(request, callback_placeSearch);

    }
    

    // ==========================================================
    // callbacks
    function callback_placeSearch(results,status) {
	
	if (status ==
	    google.maps.places.PlacesServiceStatus.OK) {

	    for (var i = 0; i < results.length; i++) {
		var loc = results[i].geometry.location;
		var m = new google.maps.Marker({
		    map: googleMap,
		    position: loc
		});


	
	    }
	}

    }


    // ----------------------------------------------------------

 

}


function Directions (origin,destination) {
    var requestObject = {
	origin: origin,
	destination: destination,
	travelMode: google.maps.TravelMode.DRIVING
    }



    function sendRequest() {
	var dirSrv = new google.maps.DirectionsService();
	dirSrv.route(requestObject,callback_directions);

    }
    this.sendRequest = sendRequest;

    function callback_directions(results,status) {

	switch (status) {
	case google.maps.DirectionsStatus.OK:
	    alert('good directions');
	    // render route on map
	    // don't know where this came from so have to use default map
	    //alert(results.routes[0]);
	    
	    
	    var dirRenderer = new google.maps.DirectionsRenderer({
		map: defaultPlaceMap.getMap(),
		directions: results
	    });
	    alert(dirRenderer);

	    break;
	default:
	    break;


	}


    }


}

