
package org.placemap.entity.mapquest;

import org.junit.*;
import org.junit.Assert.*;


public class RouteTest {


    @Test public void testConstructorString() {
	String jsonString = "{}";
	Route r = new Route(jsonString);
	org.junit.Assert.assertNotNull( r.locations );
    }

}
