// API code for GooglePlaces

package org.placemap.datasource;

// include JSON-lib in classpath
import net.sf.json.*;
import java.sql.*;
// include postgresql code
import org.postgresql.Driver;


public class GooglePlaces {
    private String apiURL = "https://maps.googleapis.com/maps/api/place/search/json";
    private String apiKey;
    // =================================================================
    public GooglePlaces ( String apiKey ) {
	this.apiKey = apiKey;
    }

    public GooglePlaces () {}
    // =================================================================
    public void getPlaces(String city, double radius){
	Connection db;
	Statement sql;
	DatabaseMetaData dbmd;
	ResultSet results;

	try{
	    db = DriverManager.getConnection("jdbc:postgresql://192.168.1.73/school","nmentley","");
	    dbmd = db.getMetaData();

	    sql = db.createStatement();
	    results = sql.executeQuery("SELECT longitude, latitude FROM cities WHERE name = '" + city + "'");

	    db.close();
	    while(results.next()){
		this.getPlaces(results.getFloat("latitude"),results.getFloat("longitude"), radius);
	    }
	}catch (SQLException e){
	    System.out.println("Postgresql error.");
	    e.printStackTrace();
	    return;
	}
    }
    public void getPlaces(double lng, double lat, double radius){
	// build URL
	String u = apiURL + "?location=" + lng + "," + lat + "&radius=" + radius + "&sensor=false&key="+apiKey;
	// send request
	String resp = URL2String.get(u);

	// convert to JSONObject
	JSONObject jsonResp = JSONObject.fromObject(resp);

	// array of results
	JSONArray reponse = jsonResp.getJSONArray("results");
	for(int n = 0; n < reponse.size(); n++) {
	    System.out.printf("%s\n",reponse.getJSONObject(n).getString("name"));
        }
    }
}
