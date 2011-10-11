

// what a location interface is required to do
interface ApiInterface {
    public String getZipCode(String place1);
    public double getDistance(String place1, String place2);
    public void getRoute(String place1, String place2);
    
}