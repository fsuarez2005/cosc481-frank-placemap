/* placemap -- google maps frontend */

function get_selected_list(select_node) {
    var x = new Array();
    for(var n = 0; n < select_node.options.length; n++){
	var opt = select_node.options[n];
	if (opt.selected) {
	    x.push(opt.value);
	}

    }

    return x;

}


function tag(tagname,attrObject,childNodes) {
        //
        // create a node and its contents in a functional way
        //
        try {  
                // check for valid tags
                var node = document.createElement(tagname);
        } catch (err) {
                alert(err+'\n'+tagname+' is an invalid tag.');
        }
        for (var a in attrObject) {
                /*
                class is a keyword in IE. using class as an identifier causes errors in IE.
                putting an _ infront lets me use class as an identifier. I just have to remove                                      
                the _
                */
                attr = a;
                if (a.substr(0,1) == '_') {
                        //alert(a.substring(1))
                        attr = a.substring(1);
                }
                node.setAttribute(attr,attrObject[a]);
        }
        for (var n in childNodes) {
                node.appendChild(childNodes[n]);
        }
        return node;
}
function text( s ) {
        //
        // create a text node
        //
        return document.createTextNode( s );
}


function clearNode( node ) {
    //
    // remove all child nodes from a node
    //
    while (node.childNodes.length > 0) {
        node.removeChild(node.firstChild);
    }
}


var currentMaps = {};

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

// =============================================================

var placeCache = new Dict();


// examples
// key: (-42.0000030,80.000000)
// value: (marker: [marker object], place: [place object]}
var latLngCache = new Dict();





function PlaceMap (id) {
    var numPlaces = 0;


    // register map id callbacks can work
    currentMaps[id] = this;

    this.options = {
	placeListNode: null,
	originNode: null,
	destinationNode: null,
	placeTypes: [],
	placeRadius: 2000,
	placeInterval: 100,
	id: id,
	node: document.getElementById( id ),
	drivingStyle: google.maps.TravelMode.DRIVING,
	marker_onclick: null, // marker callback function
	maxPlaces:2000
    };
    
    // may not exist
    var node = document.getElementById( id );
    

    /* constructor */
    var infowindow = new google.maps.InfoWindow();
    var routeRenderer = new google.maps.DirectionsRenderer();


    // default info window callback
    function openInfo(lat,lng) {


	var latLng = new google.maps.LatLng(lat,lng);



	var m = latLngCache.get(latLng.toString());


	var content_node = tag('div',{'font-size':'14px'},[text(m.place.name)]);

	
	infowindow.setContent(content_node);

	


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

    function stats () {
	var s = '';
	s += this+'\n';
	s += placeCache.length() + ' places.\n';
	s += this.recentRoute.routes[0].legs[0].steps[1].path.length+' path length for steps[1]\n';
	alert(s);

    }
    this.stats = stats;

    // load necessary libraries
    function loadLibrary() {}


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
	
	googleMap = new google.maps.Map(node,googleMapOptions);

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

    function findPlaces(requestObject) {
	service = new google.maps.places.PlacesService(googleMap);

	var function_body = 'currentMaps[\''+id+'\'].callback_placeSearch(results,status);';
	var callback_func = new Function('results','status',function_body);
	
	service.search(requestObject,callback_func);

    }
    this.findPlaces = findPlaces;
    

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
		    position: loc,
		    title: place.name
		    // animation: google.maps.Animation.DROP // too slow
		});

		// XXX may overlap
		latLngCache.add(loc.toString(),{marker:m,place:place});


		placeCache.add(place.reference,place);

		if (this.options['marker_onclick'] != null) {
		    google.maps.event.addListener(m,'click',this.options['marker_onclick']);
		}
		
		if (placeListNode != null) {
		    //var c = 'alert(latLngCache.get("'+loc.toString()+'").place.name)';
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
    this.recentRoute = null;

    function plotRoute(origin,destination) {
	// XXX should delete the nodes, but this is easier to write
	//this.options['placeListNode'].innerHTML = '';

	clearNode( this.options['placeListNode'] );

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
		for(var path_n = 0; path_n < path.length; path_n += this.options['placeInterval']) {

		    if (numPlaces >= this.options['maxPlaces']) {
			return;
		    }

		    //alert(this.options['placeTypes']);
		    var loc = path[path_n];
		    var pOptions = {
			types: this.options['placeTypes'],
//			types: document.getElementById("cat").value.split(","),
			radius: this.options['placeRadius'],
			location: loc
		    };

		    findPlaces(pOptions);




		}
	    }

	    

	    break;
	default:
	    break;


	}


    }
    this.route_callback = route_callback;




}


// ==========================================




function setupUI() {
    // set up onload


}

function body_onload() {




}



