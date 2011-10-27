
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
	this();

	this.latitude = latitude;
	this.longitude = longitude;
    }

}