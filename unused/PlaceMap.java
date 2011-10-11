//
// PlaceMap uses external location data sources to get a route and find nearby places.
//

package placemap;

public class PlaceMap {
    // dictionary of api keys 
    //String[] keys;
    public void setApiKey(String service, String apiKey) {
    }

}


// a place of interest
class Place {
    String businessName;
    Address placeAddress;
    String category;
}

class Road {
    String name;
    String roadType;
}

class Route {
    // roads that the route uses
    // needs to be more exact
    Road[] roads;
}

class City {
    String name;
    double latitude;
    double longitude;
    // return a list of nearby places
    //public Place[] getNearByPlaces();
}

class Address {
    int number;
    String street;
    City city;
    String state;
    String zipcode;
}

class Trip {
    Address start;
    Address end;
    
    // a trip could have multiple routes but a driver can only take one route at a time
    Route currentRoute;
}
