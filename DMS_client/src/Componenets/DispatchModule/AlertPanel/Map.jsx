import {useState,useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup,GeoJSON } from 'react-leaflet';
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

const MapView = () => {
  const position = [15.414965044599617, 74.0364962305364]; // Goa
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    fetch('/Goa_State.geojson')
      .then(res => res.json())
      .then(data => {
        setStateData(data);
      });
  }, []);

  const geoJsonStyle = {
    weight: 2,
    color: 'blue',
    fillOpacity: 0.05,
  };

  return (
    <MapContainer center={position} zoom={9} style={{ height: "80vh", width: "100%" }}>
    <TileLayer
  url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=e2c62012ab834665b043fe5b2a6c67a4"
  attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
/>
    {stateData && <GeoJSON data={stateData} style={geoJsonStyle} />}
      <Marker position={position} icon={customIcon}>
        <Popup>You're here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
