package org.placemap.tests;

import java.util.Scanner;

import org.placemap.datasource.MapQuest;
import org.placemap.Configuration;


// prints total distance between two places
public class TextUI {
    
    // ui loop
    public void mainLoop() {
	String city1;
	String city2;

	MapQuest m = new MapQuest(Configuration.mapQuestApiKey);
	Scanner scan = new Scanner(System.in);

	System.out.printf(":: Test Text UI ::\n");
	System.out.printf("Enter start point and end point.\n");
	while (true) {
	    System.out.printf("Enter start city and state \"City, State\": ");
	    city1 = scan.nextLine();
	    System.out.printf("Enter end city and state \"City, State\": ");
	    city2 = scan.nextLine();
	    double distance = m.getDistance( city1, city2 );
	    System.out.printf("Distance: %f\n",distance);
	}

    }

    public static void main(String[] args) {
	TextUI t = new TextUI();
	t.mainLoop();
    }



}