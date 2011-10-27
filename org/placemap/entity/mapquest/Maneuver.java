

package org.placemap.entity.mapquest;

import java.util.ArrayList;

import net.sf.json.*;

// currently only for MapQuest, but should be generalized
public class Maneuver extends org.placemap.entity.Maneuver {
    public Maneuver() {
	super();
    }
    public Maneuver(JSONObject respJson) {
	this();
	/*
	  JSONObject startPointJson = ((JSONObject) respJson).getJSONObject("startPoint");
	startPoint = new Location( startPointJson.getDouble("lat"), startPointJson.getDouble("lng") );

	JSONArray streetsJsonArray = respJson.getJSONArray("streets");
	for(Object s : streetsJsonArray) {
	    streets.add((String)s);
	}
	*/
    }
}
