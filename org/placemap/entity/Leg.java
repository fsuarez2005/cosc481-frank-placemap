
package org.placemap.entity;

import net.sf.json.*;

public class Leg {
    public double length;
    public double time;
    public String formattedTime;
    public Maneuver[] maneuvers;

    public Leg() {}
    public Leg(JSONObject respJson) {
	


    }



}