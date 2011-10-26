
package org.placemap.entity;




import java.util.ArrayList;

public class Route {
    public ArrayList<Location> locations;
    public Location startLocation;
    public Location endLocation;

    public Route() {
	this.locations = new ArrayList<Location>();

    }

}