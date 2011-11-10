
package org.placemap.entity;


import java.util.ArrayList;

public class Route {
    public Location startLocation;
    public Location endLocation;

    public ArrayList<Leg> legs;
    public ArrayList<Location> locations;

    public Route() {
	this.locations = new ArrayList<Location>();
	this.legs = new ArrayList<Leg>();
    }
}