// API code for GooglePlaces


package org.placemap.datasource;

// include JSON-lib in classpath
import net.sf.json.*;



public class GooglePlaces {
    private String apiURL = "https://maps.googleapis.com/maps/api/place/search/json";
    private String apiKey;
    // =================================================================
    public GooglePlaces ( String apiKey ) {
	this.apiKey = apiKey;
    }

    public GooglePlaces () {}
    // =================================================================
    public void getPlaces(double lng, double lat, double miles) {
	// build URL
	String u = apiURL + "?location=" + lng + "," + lat + "&radius=" + miles + "&sensor=false&key="+apiKey;
	// send request
	String resp = URL2String.get( u );

	// convert to JSONObject
	JSONObject jsonResp = JSONObject.fromObject( resp );

	// array of results
	JSONArray results = jsonResp.getJSONArray("results");
	for(int n = 0; n < results.size(); n++) {
	    System.out.printf("%s\n",results.getJSONObject(n).getString("name"));
	}
    }
}
