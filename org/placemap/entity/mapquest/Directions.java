
package org.placemap.entity.mapquest;

import net.sf.json.*;


public class Directions {
    public Route r;


    public Directions() {}


    // parses json object and creates object heirarchy
    public Directions(JSONObject json) {
	this.r = new Route(json);
    }

}