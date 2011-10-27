
package org.placemap.entity;

import net.sf.json.*;

public class Location {
    public Double latitude;
    public Double longitude;
    public String street;
    public String city;
    public String county;
    public String state;





    public Location() {}
    public Location(Double latitude, Double longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
    }


    // used for MapQuest requests
    public JSONObject getJSONObject() {
	JSONObject r = new JSONObject();
	if (latitude != null)
	    r.element("lat",latitude);
	if (longitude != null)
	    r.element("lng",longitude);
	if (city != null)
	    r.element("city",city);
	if (county != null)
	    r.element("county",county);
	if (state != null)
	    r.element("state",state);
	return r;
    }

}