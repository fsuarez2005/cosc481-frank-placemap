/* placemap -- google maps frontend */

function PlaceMap () {
    /* constructor */
    var infowindow = new google.maps.InfoWindow();

    var googleMap;
    var googleMapOptions = {
	zoom: 12,
	center: new google.maps.LatLng(42.25104295126321,-83.62424351776122), // EMU campus
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	overviewMapControl: true,
	rotateControl: true,
	streetViewControl: true
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


	google.maps.event.addListener(googleMap, 'click', function(event) {
	    //placeMarker(event.latLng);

	    alert(event.latLng);
	});

	//findPlaces();


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

    function findPlaces(location) {
	// find places from center of map
	var request = {
	    //location: googleMapOptions['center'], 
	    location: location,
	    radius: '1000' // meters
	    //types: ['store']
	};

	service = new google.maps.places.PlacesService(googleMap);
	service.search(request, callback_placeSearch);

    }
    this.findPlaces = findPlaces;
    

    // ==========================================================
    // callbacks
    function callback_placeSearch(results,status) {
	var map = defaultPlaceMap.getMap();
	if (status ==
	    google.maps.places.PlacesServiceStatus.OK) {

	    for (var i = 0; i < results.length; i++) {
		var place = results[i];
		var loc = place.geometry.location;
		var m = new google.maps.Marker({
		    map: map,
		    position: loc,
		    title: place.name
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

	    // render route on map
	    // don't know where this came from so have to use default map




	    // render route
	    var dirRenderer = new google.maps.DirectionsRenderer({
		map: defaultPlaceMap.getMap(),
		directions: results
	    });

	    // place POI along route
	    var steps = results.routes[0].legs[0].steps;

	    for(var n = 0; n < steps.length; n++) {
		var path = steps[n].path;
		for(var path_n = 0; path_n < path.length; path_n += 100) {

		    var loc = path[path_n];

		    defaultPlaceMap.findPlaces(loc);
		}
	    }



	    break;
	default:
	    break;


	}


    }


}

