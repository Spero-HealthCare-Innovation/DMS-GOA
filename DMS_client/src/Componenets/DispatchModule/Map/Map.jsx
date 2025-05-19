import React, { useEffect } from "react";

const Map = () => {
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
      style={{ width: "100%", height: "600px" }}
    >
      <iframe
        title="Windy"
        width="100%"
        height="100%"
        src="https://embed.windy.com/embed2.html?lat=28.61&lon=77.23&detailLat=28.61&detailLon=77.23&width=650&height=450&zoom=5&level=surface&overlay=wind&menu=&message=true&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default Map;
