// Google API test

package org.placemap.tests;
import org.placemap.datasource.*;

import java.util.Scanner;

public class Google {
    public void mainLoop() {
	GooglePlaces gp = new GooglePlaces("AIzaSyDkGX_KSZsT27e8EOROcFw8IE7P_5VAbiA");
	Scanner scan = new Scanner(System.in);
	String city;
	double radius;

	System.out.printf(":: Test Google Places ::\n");
	while (true) {
	    System.out.printf("Enter city: ");
	    city = scan.next();
	    System.out.printf("Enter radius: ");
	    radius = scan.nextDouble();

	    System.out.printf("Looking for places...\n");
	    gp.getPlaces(city,radius);
	}

    }

    public static void main(String[] args) {
	Google g = new Google();
	g.mainLoop();
    }
}
