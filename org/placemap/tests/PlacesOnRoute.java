package org.placemap.tests;

import java.util.Scanner;

import org.placemap.datasource.*;
import java.util.ArrayList;

// prints total distance between two places
public class PlacesOnRoute {
    
    // ui loop
    public void mainLoop() {
	String city1;
	String city2;

	System.out.printf("////////////////////////\n");
	System.out.printf("// Places Along Route //\n");
	System.out.printf("////////////////////////\n\n");


	MapQuest m = new MapQuest("Fmjtd%7Cluu2nu6znd%2Cb2%3Do5-h0805");
	GooglePlaces gp = new GooglePlaces("AIzaSyDkGX_KSZsT27e8EOROcFw8IE7P_5VAbiA");

	Scanner scan = new Scanner(System.in);

	System.out.printf("Enter start city and state \"City, State\": ");
	city1 = scan.nextLine();
	System.out.printf("Enter end city and state \"City, State\": ");
	city2 = scan.nextLine();

	ArrayList<Double[]> route_array = m.getRoute(city1,city2);
	for(int n = 0; n < route_array.size(); n++) {
	    double lat = route_array.get(n)[0].doubleValue();
	    double lng = route_array.get(n)[1].doubleValue();

	    System.out.printf("Location: %f, %f\n",lat,lng);
	    gp.getPlaces(lat,lng,50);
	    System.out.printf("===============================\n");
	}

    }

    public static void main(String[] args) {
	PlacesOnRoute t = new PlacesOnRoute();
	t.mainLoop();
    }
}
