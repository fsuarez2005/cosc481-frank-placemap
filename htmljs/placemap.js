/* placemap -- google maps frontend */

var currentMaps = {};
var placeCache = new util.Dict();


// examples
// key: (-42.0000030,80.000000)
// value: (marker: [marker object], place: [place object]}
var latLngCache = new util.Dict();

var nSteps=0;



function PlaceMap(parentNode) {

    // check for Google Maps library
    if (typeof(google) != 'object') {
	throw 'PlaceMap needs Google Maps library';
    }

    var numPlaces = 0;
    var markers = new Array();
    this.recentRoute = null;


    var mapNode = null;
    var inputNode = null;
    var placelistNode = null;

    var id = parentNode.getAttribute('id');

    // register map id callbacks can work
    currentMaps[id] = this;

    this.options = {
	placeListNode: null,
	originNode: null,
	destinationNode: null,
	directionNode: null,
	placeTypes: [],
	placeRadius: 2000,
	placeInterval: 100,
	id: id,
	node: document.getElementById( id ),
	drivingStyle: google.maps.TravelMode.DRIVING,
	marker_onclick: null, // marker callback function
	maxPlaces:2000
    };
    

    /* constructor */
    var infowindow = new google.maps.InfoWindow();
    var routeRenderer = new google.maps.DirectionsRenderer();


    // =======================================================
    // public methods

    function marker_onclick(event) {

	openInfo(event.latLng.lat(),event.latLng.lng());

    }
    this.marker_onclick = marker_onclick;

    function inputSubmit(event) {

	var inputElements = document.getElementById(id).childNodes[0].childNodes[0].childNodes[0];
	var origin = inputElements.childNodes[2];
	var destination = inputElements.childNodes[5];

	this.plotRoute(origin.value,destination.value);



    }
    this.inputSubmit = inputSubmit;

    // loads initial user interface
    function load() {
	this.options['marker_onclick'] = new Function('event','currentMaps[\''+id+'\'].marker_onclick(event)');


	inputNode = tag('div',{'class':'inputdiv'},[
	    tag('div',{'style':'width:700px'},[
		tag('h1',{'class':'maptitle'},[text('PlaceMap')]),
		tag('label',{},[text('Origin')]),
		tag('input',{'type':'text','value':'Port Huron,MI'},[]),
		tag('br',{},[]),
		tag('label',{},[text('Destination')]),
		tag('input',{'type':'text','value':'Ypsilanti,MI'},[]),
		tag('br',{},[]),
		tag('input',{'type':'button','onclick':'currentMaps[\''+id+'\'].inputSubmit(event)','value':'Go'},[])
	    ])
	]);



	placelistNode = tag('div',{'class':'placelistdiv'},[]);
	this.options['placeListNode'] = placelistNode;

	mapNode = tag('div',{'class':'mapdiv'},[]);


	var n = tag('div',{'class':'contentdiv'},[
	    inputNode,
	    placelistNode,
	    mapNode
	]);


	inputNode.setAttribute('border','5');

	parentNode.appendChild(n);
    }
    this.load = load;

    // default info window callback
    function openInfo(lat,lng) {
	var latLng = new google.maps.LatLng(lat,lng);

	var m = latLngCache.get(latLng.toString());

	var content_node = tag('div',{},[
	    tag('a',{'href':'http://www.google.com'},[
		text(m.place.name)
	    ])

	]);
	
	infowindow.setContent(content_node);
	//infowindow.setContent(m.place.name);

	infowindow.setPosition(latLng);
	infowindow.open(googleMap,m.marker);
    }
    this.openInfo = openInfo;

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
    function getMap () {
	return googleMap;
    }
    this.getMap = getMap;

    function setGoogleMapOption(k,v) {
	googleMapOptions[k] = v;
    }
    this.setGoogleMapOption = setGoogleMapOption;
    // ----------------------------------------------------------
    function loadMap() {
	// use place map id as div id for map
	googleMap = new google.maps.Map(mapNode,googleMapOptions);
    }
    this.loadMap = loadMap;

    function clearMap() {


    }

    // ----------------------------------------------------------
    function placeMarker(location) {
	var marker = new google.maps.Marker({
	    position: location, 
	    map: googleMap
	});
    }
    this.placeMarker = placeMarker;
    // ----------------------------------------------------------
    function findPlaces(requestObject) {
	service = new google.maps.places.PlacesService(googleMap);

	var function_body = 'currentMaps[\''+id+'\'].callback_placeSearch(results,status);';
	var callback_func = new Function('results','status',function_body);
	
	service.search(requestObject,callback_func);

    }
    this.findPlaces = findPlaces;

    // ----------------------------------------------------------

    function displayDirections(results) {
	    // place POI along route
	    var steps = results.routes[0].legs[0].steps;
	   
	    var directionNode = this.options['directionNode'];

	    directionNode.innerHTML = "";
	    for(var n = 0; n < steps.length; n++) {
		directionNode.innerHTML += steps[n].instructions + "<br />";
	    }
    }
    this.displayDirections = displayDirections;
    

    // ==========================================================
    // callbacks
    function callback_placeSearch(results,status) {


	var placeListNode = this.options['placeListNode'];

	switch (status) {
	case google.maps.places.PlacesServiceStatus.OK:

	    for (var i = 0; i < results.length; i++) {
		// stop at maximum
		if (numPlaces >= this.options['maxPlaces']) {
		    return;
		}		

		numPlaces++;
		var place = results[i];
		var loc = place.geometry.location;
		var m = new google.maps.Marker({
		    map: googleMap,
		    position: loc
		    //title: place.name // use infowindow for info instead of tooltip
		    // animation: google.maps.Animation.DROP // too slow
		});

		// XXX may overlap
		latLngCache.add(loc.toString(),{marker:m,place:place});


		placeCache.add(place.reference,place);

		if (this.options['marker_onclick'] != null) {
		    google.maps.event.addListener(m,'click',this.options['marker_onclick']);
		}
		
		if (placeListNode != null) {

		    var c = 'currentMaps["'+id+'"].openInfo('+loc.lat()+','+loc.lng()+')';
		    var t = tag('div',{onclick:c,'class':'placeitem'},[text(place.name)]);
		    placeListNode.appendChild(t);

		}


	    }	
	    break;

	default:
	    break;
	    
	}

    }
    this.callback_placeSearch = callback_placeSearch;

    
    // ----------------------------------------------------------


    function plotRoute(origin,destination) {
	// XXX should delete the nodes, but this is easier to write
	//this.options['placeListNode'].innerHTML = '';

	if (this.options['placeListNode'] != null) {
	    clearNode( this.options['placeListNode'] );
	}

	try {
	    var requestObject = {
		origin: origin,
		destination: destination,
		travelMode: this.options['drivingStyle']
	    }

	    var dirSrv = new google.maps.DirectionsService();
	    
	    // hack to tell which map to put the points

	    var function_body = 'currentMaps[\''+id+'\'].route_callback(results,status);'


	    var callback_func = new Function('results','status',function_body);

	    dirSrv.route(requestObject,callback_func);
	} catch (err) {
	    alert('Error: '+err);

	}


    }
    this.plotRoute = plotRoute;

    function route_callback(results,status) {
	// object method
	switch (status) {
	case google.maps.DirectionsStatus.OK:
	    this.recentRoute = results;
	    
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

		nSteps++;

		for(var path_n = 0; path_n < path.length; path_n += this.options['placeInterval']) {

		    //step++;

		    if (numPlaces >= this.options['maxPlaces']) {
			return;
		    }

		    var loc = path[path_n];
		    var pOptions = {
			types: this.options['placeTypes'],
//			types: document.getElementById("cat").value.split(","),
			radius: this.options['placeRadius'],
			location: loc
		    };

		    findPlaces(pOptions);
		    this.displayDirections(results);
		}
	    }

	    

	    break;
	default:
	    break;


	}

	alert(nSteps);

    }
    this.route_callback = route_callback;




}


// ==========================================




function setupUI() {
    // set up onload


}

function body_onload() {




}









