
package org.placemap.entity;

import net.sf.json.*;

import java.util.ArrayList;

public class Leg {
    public double length;
    public double time;
    public String formattedTime;
    public ArrayList<Maneuver> maneuvers;

    public Leg() {
	this.maneuvers = new ArrayList<Maneuver>();
    }

}