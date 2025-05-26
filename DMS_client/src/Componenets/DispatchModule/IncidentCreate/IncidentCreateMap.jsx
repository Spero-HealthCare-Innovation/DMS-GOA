import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import customIconUrl from '../../../assets/Rectangle.png';

const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: null
});

const HERE_API_KEY = 'FscCo6SQsrummInzClxlkdETkvx5T1r8VVI25XMGnyY'; // 🔁 Replace with your actual HERE API Key

const PanToLocation = ({ position }) => {
  const map = useMap();
  if (position) map.panTo(position, 14);
  return null;
};

const IncidentCreateMap = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([15.414965044599617, 74.0364962305364]); // Default: Goa
  const [popupText, setPopupText] = useState();
  const mapRef = useRef();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) return;

    const response = await axios.get('https://autosuggest.search.hereapi.com/v1/autosuggest', {
      params: {
        apiKey: 'FscCo6SQsrummInzClxlkdETkvx5T1r8VVI25XMGnyY',
        q: value,
        at: `${selectedPosition[0]},${selectedPosition[1]}`,
        limit: 5
      }
    });

    setSuggestions(response.data.items.filter(item => item.position));
  };

  const handleSelectSuggestion = async (item) => {
    const { position, address } = item;
    setSelectedPosition([position.lat, position.lng]);
    setPopupText(address.label);
    setQuery('');
    setSuggestions([]);
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    const response = await axios.get('https://revgeocode.search.hereapi.com/v1/revgeocode', {
      params: {
        apiKey: 'FscCo6SQsrummInzClxlkdETkvx5T1r8VVI25XMGnyY',
        at: `${lat},${lng}`,
      }
    });

    const label = response.data.items[0]?.address?.label || 'No address found';
    setSelectedPosition([lat, lng]);
    setPopupText(label);
  };

  return (
  <div style={{ position: "relative", width: "100%", height: "92.5vh" }}>
    {/* Search input & suggestions */}
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 10,
        zIndex: 1000,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 0,
        width: 300,
        boxShadow: "0px 2px 6px rgba(249, 246, 246, 1)"
      }}
    >
      <input
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={handleSearchChange}
        style={{ width: "100%", padding: "8px" }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, background: 'white' }}>
          {suggestions.map((item, idx) => (
            <li key={idx} onClick={() => handleSelectSuggestion(item)} style={{ padding: '5px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
              {item.address.label}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Leaflet Map */}
    <MapContainer
      center={selectedPosition}
      zoom={10}
      style={{ height: "100%", width: "100%", borderRadius: 10 }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
      onClick={handleMapClick}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PanToLocation position={selectedPosition} />
      <Marker
        position={selectedPosition}
        draggable={true}
        icon={customIcon}
        eventHandlers={{
          dragend: async (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setSelectedPosition([position.lat, position.lng]);

            try {
              const response = await axios.get(
                "https://revgeocode.search.hereapi.com/v1/revgeocode",
                {
                  params: {
                    apiKey: HERE_API_KEY,
                    at: `${position.lat},${position.lng}`,
                  },
                }
              );

              const label =
                response.data.items[0]?.address?.label || "No address found";
              setPopupText(label);
              setQuery(label);
            } catch (error) {
              console.error("Reverse geocoding failed:", error);
              setPopupText("Failed to fetch address");
            }
          },
        }}
      >
        <Popup>{popupText}</Popup>
      </Marker>
    </MapContainer>
  </div>
);

};

export default IncidentCreateMap;
