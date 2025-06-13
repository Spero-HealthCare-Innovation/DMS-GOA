import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import customIconUrl from '../../../assets/Rectangle.png';

const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: null
});

// Component to handle flyTo when triggeredData updates
const FlyToLocation = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom);
    }
  }, [position, zoom, map]);
  return null;
};

const MapView = ({ data }) => {
  const position = [18.51956674674116, 73.85536020335581]; // Default location (Goa)
  const [stateData, setStateData] = useState();
  const [triggeredData, setTriggeredData] = useState(null);
  const [mapZoom, setMapZoom] = useState(11);

  useEffect(() => {
    setTriggeredData(data);
  }, [data]);

  useEffect(() => {
    fetch('/Boundaries/pune-2022-wards.geojson')
      .then(res => res.json())
      .then(data => setStateData(data));
  }, []);

  // Determine marker position
  const markerPosition =
    triggeredData?.latitude && triggeredData?.longitude
      ? [triggeredData.latitude, triggeredData.longitude]
      : position;

  // Update zoom if triggeredData is available
  useEffect(() => {
    if (triggeredData?.latitude && triggeredData?.longitude) {
      setMapZoom(13); // Zoom in on update
    } else {
      setMapZoom(11); // Default zoom
    }
  }, [triggeredData]);

  const geoJsonStyle = {
    weight: 2,
    color: 'Orange',
    fillOpacity: 0.1,
  };

  const popupContent = triggeredData ? (
    <div>
      <strong>Latitude:</strong> {triggeredData.latitude}<br />
      <strong>Longitude:</strong> {triggeredData.longitude}<br />
      <strong>Elevation:</strong> {triggeredData.elevation}<br />
      <strong>Precipitation:</strong> {triggeredData.precipitation}<br />
      <strong>Rain:</strong> {triggeredData.rain}<br />
      <strong>Temperature:</strong> {triggeredData.temperature_2m}<br />
      <strong>Time:</strong> {new Date(triggeredData.alert_datetime).toLocaleString()}<br />
    </div>
  ) : "No data";

  return (
    <MapContainer
      center={markerPosition}
      zoom={mapZoom}
      style={{ height: "80vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=e2c62012ab834665b043fe5b2a6c67a4"
        attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
      />
      {stateData && <GeoJSON data={stateData} style={geoJsonStyle} />}
      <FlyToLocation position={markerPosition} zoom={mapZoom} />
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>{popupContent}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
