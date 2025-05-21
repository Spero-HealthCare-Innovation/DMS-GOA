import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
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

const MapView = ({ data }) => {
  console.log('Data', data)
  const position = [15.414965044599617, 74.0364962305364]; // Goa
  const [stateData, setStateData] = useState();
  const [triggeredData, setTriggeredData] = useState();
  console.log("State", stateData)

  useEffect(() => {
    setTriggeredData(data)
  }, [data]);

  useEffect(() => {
    fetch('/Boundaries/Goa_State.geojson')
      .then(res => res.json())
      .then(data => {
        setStateData(data);
      });
  }, []);

  const geoJsonStyle = {
    weight: 2,
    color: 'Orange',
    fillOpacity: 0.1,
  };

  const markerPosition = triggeredData?.latitude && triggeredData?.longitude
    ? [triggeredData.latitude, triggeredData.longitude]
    : position;

  const popupContent = triggeredData ? (
    <div>
      <strong>Latitude:</strong> {triggeredData.latitude}<br />
      <strong>Longitude:</strong> {triggeredData.longitude}<br />
      <strong>Elevation:</strong> {triggeredData.elevation}<br />
      <strong>Precipitation:</strong> {triggeredData.precipitation}<br />
      <strong>Rain:</strong> {triggeredData.rain}<br />
      <strong>Temperature 2m:</strong> {triggeredData.temperature_2m}<br />
      <strong>Time:</strong> {new Date(triggeredData.time).toLocaleString()}<br />
    </div>
  ) : "No data";

  return (
    <MapContainer center={position} zoom={9} style={{ height: "80vh", width: "100%" }}>
      <TileLayer
        url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=e2c62012ab834665b043fe5b2a6c67a4"
        attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
      />
      {stateData && <GeoJSON data={stateData} style={geoJsonStyle} />}
      {data && (
        <Marker position={markerPosition} icon={customIcon}>
          <Popup>{popupContent}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
