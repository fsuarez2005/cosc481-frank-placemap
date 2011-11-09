/* placemap -- google maps frontend */

function Dict () {
    var _data = {}
    var _length = 0;
    var _keys = new Array();

    function add(key,value) {
	// only increase size if new key and value
	if (has_key(key) == false) {
	    _length = _length + 1;
	    _keys.push(key);
	}

	_data[key] = value;

    }
    this.add = add;
    
    function remove(key) {
	if (has_key(key) == true) {
	    _length = _length - 1;
	}

	delete _data[key];
    }
    this.remove = remove;


    function length() {
	return _length;
    }
    this.length = length;

    function has_key(key) {
	return (typeof(_data[key]) != 'undefined');

    }
    this.has_key = has_key;

    function get(key) {
	return _data[key];
    }
    this.get = get;
    
    function keys() {
	return _keys;
    }
    this.keys = keys;


}

var placeCache = new Dict();



function PlaceMap (id) {
    // register map id callbacks can work
    currentMaps[id] = this;

    this.pid = id;

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

	/*
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

	*/
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
	try {

	    var function_body = 'currentMaps[\''+id+'\'].callback_placeSearch(results,status);';
	    var callback_eval = new Function('results','status',function_body);
	
	    service.search(request,callback_eval);

	} catch (err) {
	    alert(err);

	}


    }
    this.findPlaces = findPlaces;
    

    // ==========================================================
    // callbacks
    function callback_placeSearch(results,status) {
	var d = document.getElementById('leftcol');
	//d.appendChild(document.createTextNode(status));
	//alert(this);

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

		placeCache.add(place.reference,place);

		var place_text_node = document.createTextNode(place.name);
		d.appendChild(place_text_node);
		d.appendChild(document.createElement('br'));
		


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
	try {
	    //var callback1 = 'function (results,status) {currentMaps[\''+id+
		'\'].route_callback(results,status);}';
	    //alert(callback1);
	    //var callback1_eval = eval(callback1);
	    
	    var function_body = 'currentMaps[\''+id+'\'].route_callback(results,status);'
	    alert(function_body);
	    callback1_eval = new Function('results','status',function_body);
	    alert(callback1_eval);
	    dirSrv.route(requestObject,callback1_eval);

	} catch (err) {
	    alert(err);

	}


    }
    this.plotRoute = plotRoute;

    function route_callback(results,status) {
	// this is available
	//alert(this.pid);
	

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

		    findPlaces(loc,[]);

			/*
			'amusement_park',
			'aquarium',
			'art_gallery',
			'campground',
			'casino',
			'museum'
		    ]);

*/

		}
	    }



	    break;
	default:
	    break;


	}


    }
    this.route_callback = route_callback;


}
