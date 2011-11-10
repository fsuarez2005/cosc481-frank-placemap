
package org.placemap.tests;

import org.placemap.datasource.*;
import org.placemap.entity.mapquest.*;


public class Test1 {
    public static void main(String[] args) {
	MapQuest m = new MapQuest("Fmjtd%7Cluu2nu6znd%2Cb2%3Do5-h0805");
	Route r = m.getRoute("Lancaster,PA","York,PA");
    }
}


