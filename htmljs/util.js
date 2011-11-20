

var util = util || {};
util.module_name = 'util';

util.options = util.options || {};
util.options['script_node'] = document.head;


util.object_properties = function anonymous( o ) {
    var props = new Array();
    for( p in o ) {
	props.push(p);
    }
    return props;
}

// loads a script
util.loadfile = function anonymous( filename, onload_callback ) {
    var script = document.createElement('script');
    script.setAttribute('type','text/javascript');

    if (typeof(onload_callback) != null) {
	script.onreadystatechange = onload_callback;
	script.onload = onload_callback;
	
    }
    
    script.src = filename;

    if (typeof(util.options['script_node']) != null) {
	util.options['script_node'].appendChild(script);
    }
}

// XXX broken
// brings namespace into current space
util.import_namespace = function (namespace_string, include_array) {
    var ns = eval(namespace_string);
    for(n in ns) {
	s = 'window.'+n+' = '+namespace_string+'[\''+n+'\'];';
	alert(s);

    }
}


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



util.Dict = function anonymous() {
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





