

package org.placemap.entity;

import java.util.ArrayList;

import net.sf.json.*;

// currently only for MapQuest, but should be generalized
public class Maneuver {
    public String mapUrl;
    //narrative
    //maneuverNotes
    //ruleId
    //direction
    public ArrayList<String> streets;
    //attributes
    //turnType
    public Location startPoint;

    


    public Maneuver() {}
    public Maneuver(JSONObject respJson) {
	JSONObject startPointJson = ((JSONObject) respJson).getJSONObject("startPoint");
	startPoint = new Location( startPointJson.getDouble("lat"), startPointJson.getDouble("lng") );

	JSONArray streetsJsonArray = respJson.getJSONArray("streets");
	for(Object s : streetsJsonArray) {
	    streets.add((String)s);
	}
    }
}
