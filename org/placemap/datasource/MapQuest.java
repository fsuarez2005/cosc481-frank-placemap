// API code for MapQuest


package org.placemap.datasource;

// include JSON-lib in classpath
import net.sf.json.*;

import java.net.URLEncoder;
import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.ArrayList;

public class MapQuest {
    private String apiURL = "http://www.mapquestapi.com/directions/v1/route";
    private String apiKey;
    // =================================================================
    public MapQuest ( String apiKey ) {
	this.apiKey = apiKey;
    }

    public MapQuest () {}
    // =================================================================
    public double getDistance(String city1, String city2) {
	JSONObject j = this.getDirectionJSON(city1,city2);
	JSONObject route = j.getJSONObject("route");
	double distance = route.getDouble("distance");
	return distance;
    }

    public ArrayList<Double[]> getRoute(String city1, String city2) {
	ArrayList<Double[]> route_array = new ArrayList<Double[]>();

	JSONObject j = this.getDirectionJSON(city1,city2);
	JSONObject route = j.getJSONObject("route");
	JSONArray legs = route.getJSONArray("legs");

	for(Object leg : legs) {
	    JSONArray manuvs = ((JSONObject)leg).getJSONArray("maneuvers");
	    for(Object manuv : manuvs) {
		JSONObject startPoint = ((JSONObject)manuv).getJSONObject("startPoint");
		double latitude = startPoint.getDouble("lat");
		double longitude = startPoint.getDouble("lng");
		//System.out.printf("%s\n",startPoint);
		
		Double[] v = {latitude,longitude};

		route_array.add(v);

	    }
	  

	}
	    

	return route_array;
    }


    // returns a JSONObject for the directions
    public JSONObject getDirectionJSON(String city1, String city2) {
	String encoding = "UTF-8";

	try {
	    city1 = URLEncoder.encode(city1,encoding);
	    city2 = URLEncoder.encode(city2,encoding);
	} catch (UnsupportedEncodingException e) {
	    e.printStackTrace();
	}
	// build URL
	String u = apiURL + "?key="+apiKey+"&from="+city1+"&to="+city2;
	u += "&narrativeType=none&maxLinkId=1000000&";
	// send request
	String resp = URL2String.get( u );

	// convert to JSONObject
	JSONObject jsonResp = JSONObject.fromObject( resp );
	return jsonResp;
    }


}

class Location {
    public double latitude;
    public double longitude;
}