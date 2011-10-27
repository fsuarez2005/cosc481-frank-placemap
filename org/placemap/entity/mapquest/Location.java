
package org.placemap.entity.mapquest;

import net.sf.json.*;

public class Location extends org.placemap.entity.Location {

    public Location() {
	super();
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