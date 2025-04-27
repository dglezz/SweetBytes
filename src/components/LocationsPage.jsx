import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function LocationsPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/getAllStores") 
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);


  return (
    <div className="location">
      <h1>Locations</h1>
      <p>Check out all of our locations!</p>

      {/* Display locations array for debugging */}

      <div className="locations-grid">
        {locations.length === 0 ? (
          <p>No locations found.</p>
        ) : (
          locations.slice(0, 10).map((location) => (
            <div key={location.StoreID} className="review-card">
            <h3>
             {location.Address}
            </h3>
            <p>{location.StartTime} {location.EndTime} </p>
          </div>
          ))
          
        )}
      </div>
    </div>
  );
}

export default LocationsPage;
