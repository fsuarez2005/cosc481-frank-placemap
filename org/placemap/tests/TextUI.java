package org.placemap.tests;

import java.io.Console;
import java.util.Arrays;
import java.io.IOException;

import org.placemap.datasource.MapQuest;

// prints total distance between two places
public class TextUI {
    Console cons;


    
    // ui loop
    public void mainLoop() {
	String city1;
	String city2;

	MapQuest m = new MapQuest("Fmjtd%7Cluu2nu6znd%2Cb2%3Do5-h0805");
	
	cons = System.console();
        if (cons == null) {
            System.err.println("No console.");
            System.exit(1);
        }

	

	cons.format(":: Test Text UI ::\n");
	cons.format("Enter start point and end point.\n");
	while (true) {
	    cons.format("  Enter start city and state \"City, State\": ");
	    city1 = cons.readLine();
	    cons.format("  Enter end city and state \"City, State\": ");
	    city2 = cons.readLine();
	    double distance = m.getDistance( city1, city2 );
	    cons.format("  Distance: %f\n",distance);
	    //cons.format(" (%s) (%s) \n",city1,city2);


	}



    }

    public static void main(String[] args) {
	TextUI t = new TextUI();
	t.mainLoop();
    }



}