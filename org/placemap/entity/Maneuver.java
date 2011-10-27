

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

    public Maneuver() {
	this.streets = new ArrayList<String>();
    }

}
