package org.placemap.tests;

import java.util.Scanner;

import org.placemap.datasource.*;
import org.placemap.entity.*;
import org.placemap.Configuration;

import net.sf.json.*;

// prints total distance between two places
public class PlacesOnRoute {
    
    // ui loop
    public void mainLoop() {
	String city1;
	String city2;

	System.out.printf("////////////////////////\n");
	System.out.printf("// Places Along Route //\n");
	System.out.printf("////////////////////////\n\n");

	// configuration should be in a user directory
	MapQuest m = new MapQuest( Configuration.mapQuestApiKey );
	GooglePlaces gp = new GooglePlaces( Configuration.googlePlacesApiKey );

	Scanner scan = new Scanner(System.in);

	System.out.printf("Enter start city and state \"City, State\": ");
	city1 = scan.nextLine();
	System.out.printf("Enter end city and state \"City, State\": ");
	city2 = scan.nextLine();

	Route route_array = m.getRoute(city1,city2);

	for(int n = 0; n < route_array.locations.size(); n++) {
	    Location loc = route_array.locations.get(n);
	    double lat = loc.latitude;
	    double lng = loc.longitude;

	    System.out.printf("Location: %f, %f\n",lat,lng);
	    JSONArray streets = loc.maneuver.getJSONArray("streets");
	    for(int st_count = 0; st_count < streets.size(); st_count++){
		System.out.printf("Street: %s\n",streets.get(st_count));

	    }


	    gp.getPlaces(lat,lng,50);
	    System.out.printf("===============================\n");
	}

    }

    public static void main(String[] args) {
	PlacesOnRoute t = new PlacesOnRoute();
	t.mainLoop();
    }
}

