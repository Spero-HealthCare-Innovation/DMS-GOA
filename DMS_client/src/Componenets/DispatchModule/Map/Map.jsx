import React, { useEffect } from "react";

const Map = () => {



      // initStorageLogoutSync.js
window.addEventListener('storage', (e) => {
  if (e.key === 'logout') {
    // token to already delete ho chuka hoga, ab page hatao
    location.href = '/login';     // ya location.reload()
  }
});
  
      useEffect(() => {
    document.title = "DMS|Map";
  }, []);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.windy.com/embed2.js";
    script.async = true;
    script.onload = () => {
      // Windy script loaded
    };
    document.getElementById("windy-widget").appendChild(script);
  }, []);

  return (
    <div
      id="windy-widget"
      style={{ width: "1280px", height: "85vh", marginLeft: "-70px"}}
    >
      <iframe
        title="Windy"
        width="100%"
        height="100%"
        src="https://embed.windy.com/embed2.html?lat=28.61&lon=77.23&detailLat=28.61&detailLon=77.23&width=1000&height=1000&zoom=5&level=surface&overlay=wind&menu=&message=true&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
        frameBorder="1"
      ></iframe>
    </div>
  );
};

export default Map;
