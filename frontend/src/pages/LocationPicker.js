import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

function LocationPicker({ setLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [marker, setMarker] = useState({ lat: 19.076, lng: 72.8777 }); // Mumbai default

  const getAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: { lat, lon: lng, format: "json" },
          headers: { "Accept-Language": "en" },
        }
      );
      if (response.data?.display_name) setLocation(response.data.display_name);
      else setLocation(`${lat},${lng}`);
    } catch {
      setLocation(`${lat},${lng}`);
    }
  };

  const handleMarkerDrag = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      getAddress(lat, lng);
    },
    [setLocation]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarker({ lat, lng });
        getAddress(lat, lng);
      },
      () => alert("Failed to get current location")
    );
  }, [setLocation]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="gmaps-container">
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        style={{ marginBottom: "10px", padding: "8px 12px", cursor: "pointer" }}
      >
        Use Current Location
      </button>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={marker}
        zoom={15}
      >
        <Marker position={marker} draggable onDragEnd={handleMarkerDrag} />
      </GoogleMap>
    </div>
  );
}

export default LocationPicker;