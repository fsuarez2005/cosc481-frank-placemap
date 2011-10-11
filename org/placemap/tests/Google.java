// Google API test


package org.placemap.tests;
import org.placemap.datasource.*;


import java.util.Scanner;
//import java.util.Arrays;
//import java.io.IOException;

public class Google {
    public void mainLoop() {
	double lat;
	double longitude;
	double radius;

	GooglePlaces gp = new GooglePlaces("AIzaSyDkGX_KSZsT27e8EOROcFw8IE7P_5VAbiA");
	

	Scanner scan = new Scanner(System.in);


	System.out.printf(":: Test Google Places ::\n");
	System.out.printf("Enter start point and end point.\n");
	while (true) {
	    
	    System.out.printf("Enter latitude: ");
	    lat = scan.nextDouble();
	    System.out.printf("Enter longitude: ");
	    longitude = scan.nextDouble();
	    System.out.printf("Enter radius: ");
	    radius = scan.nextDouble();

	    System.out.printf("Looking for places...\n");
	    gp.getPlaces(lat,longitude,radius);

	}

    }

    public static void main(String[] args) {
	Google g = new Google();
	g.mainLoop();
    }
}