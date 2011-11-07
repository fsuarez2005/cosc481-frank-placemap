/* placemap -- google maps frontend */

function PlaceMap (id) {
    /* constructor */
    var infowindow = new google.maps.InfoWindow();
    var routeRenderer = new google.maps.DirectionsRenderer();


    var googleMap;
    var googleMapOptions = {
	zoom: 11,
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

    function setOption(k,v) {
	googleMapOptions[k] = v;
    }
    this.setOption = setOption;

    // ----------------------------------------------------------

    function loadMap() {

	googleMap = new google.maps.Map(document.getElementById("map_canvas"),
					googleMapOptions);


	google.maps.event.addListener(googleMap, 'click', function(event) {
	    //placeMarker(event.latLng);
	    var infowin = new google.maps.InfoWindow({
		content: "hi",
		disableAutoPan: true,
		position:event.latLng

	    });

	    infowin.open(defaultPlaceMap.getMap());

	    //alert(event.latLng);
	});




    }
    this.loadMap = loadMap;

    // ----------------------------------------------------------

    
    function placeMarker(location) {
	var marker = new google.maps.Marker({
	    position: location, 
	    map: googleMap
	});
    }
    this.placeMarker = placeMarker;

    // ----------------------------------------------------------

    function findPlaces(location,types) {
	if (types == null) { types = [] }
	// find places from center of map
	var request = {
	    //location: googleMapOptions['center'], 
	    location: location,
	    radius: '1000', // meters
	    types: types
	};

	service = new google.maps.places.PlacesService(googleMap);
	service.search(request,
		       eval('function (results,status) {currentMaps[\''+id+
			    '\'].callback_placeSearch(results,status);}'));

    }
    this.findPlaces = findPlaces;
    

    // ==========================================================
    // callbacks
    function callback_placeSearch(results,status) {


	switch (status) {
	case google.maps.places.PlacesServiceStatus.OK:

	    for (var i = 0; i < results.length; i++) {
		var place = results[i];
		var loc = place.geometry.location;
		var m = new google.maps.Marker({
		    map: googleMap,
		    position: loc,
		    title: place.name
		    // animation: google.maps.Animation.DROP // too slow
		});

		google.maps.event.addListener(m,'click',function (event) {
		    alert(event.latLng);

		});

	    }	
	    break;

	default:
	    break;
	    
	}

    }
    this.callback_placeSearch = callback_placeSearch;


    // ----------------------------------------------------------



    function plotRoute(origin,destination) {
	var requestObject = {
	    origin: origin,
	    destination: destination,
	    travelMode: google.maps.TravelMode.DRIVING
	}

	var dirSrv = new google.maps.DirectionsService();
	
	// hack to tell which map to put the points
	dirSrv.route(requestObject,eval('function (results,status) {currentMaps[\''+id+
					'\'].route_callback(results,status);}'));
	


    }
    this.plotRoute = plotRoute;

    function route_callback(results,status) {
	
	

	switch (status) {
	case google.maps.DirectionsStatus.OK:

	    // render route on map
	    // don't know where this came from so have to use default map




	    // render route
	    var dirRenderer = new google.maps.DirectionsRenderer({
		map: googleMap,
		directions: results
	    });

	    // place POI along route
	    var steps = results.routes[0].legs[0].steps;

	    for(var n = 0; n < steps.length; n++) {
		var path = steps[n].path;
		for(var path_n = 0; path_n < path.length; path_n += 100) {

		    var loc = path[path_n];

		    findPlaces(loc,[
			'amusement_park',
			'aquarium',
			'art_gallery',
			'campground',
			'casino',
			'museum'
		    ]);

		}
	    }



	    break;
	default:
	    break;


	}


    }
    this.route_callback = route_callback;


}
