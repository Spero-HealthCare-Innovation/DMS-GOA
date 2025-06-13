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
 
 
// browser and tab close autologout functionality
//   let isPageReloaded = false;
 
// // When page loads, mark it as reloaded in sessionStorage
// window.addEventListener('load', () => {
//   sessionStorage.setItem('isReloaded', 'true');
// });
// console.log(isPageReloaded,"refresh");
 
// // In beforeunload, detect if it's a refresh
// window.addEventListener('beforeunload', (event) => {
//   const navEntries = performance.getEntriesByType('navigation');
//   const navType = navEntries.length > 0 ? navEntries[0].type : null;
 
//   // Detect reload via performance API or sessionStorage flag
//   isPageReloaded = navType === 'reload' || sessionStorage.getItem('isReloaded') === 'true';
 
//   if (!isPageReloaded) {
//     // It's a tab/browser close → perform logout logic
//     localStorage.setItem('logout', Date.now().toString());
//     // Optionally: Clear sessionStorage/localStorage/cookies if needed
//     // sessionStorage.clear();
//     // localStorage.clear();
//     // document.cookie = ""; // example to clear cookies
//   }
 
//   // Clean up the sessionStorage flag (optional)
//   sessionStorage.removeItem('isReloaded');
// });let isPageReloaded = false;
 
// // When page loads, mark it as reloaded in sessionStorage
// window.addEventListener('load', () => {
//   sessionStorage.setItem('isReloaded', 'true');
// });
// console.log(isPageReloaded,"refresh");
 
// // In beforeunload, detect if it's a refresh
// window.addEventListener('beforeunload', (event) => {
//   const navEntries = performance.getEntriesByType('navigation');
//   const navType = navEntries.length > 0 ? navEntries[0].type : null;
 
//   // Detect reload via performance API or sessionStorage flag
//   isPageReloaded = navType === 'reload' || sessionStorage.getItem('isReloaded') === 'true';
 
//   if (!isPageReloaded) {
//     // It's a tab/browser close → perform logout logic
//     localStorage.setItem('logout', Date.now().toString());
//     // Optionally: Clear sessionStorage/localStorage/cookies if needed
//     // sessionStorage.clear();
//     // localStorage.clear();
//     // document.cookie = ""; // example to clear cookies
//   }
 
//   // Clean up the sessionStorage flag (optional)
//   sessionStorage.removeItem('isReloaded');
// });
 
  return (
    <div
      id="windy-widget"
      style={{ width: "100vw", height: "85vh", marginLeft: "0px", position: 'fixed'}}
    >
      <iframe
        title="Windy"
        width="100%"
        height="100%"
        src="https://embed.windy.com/embed2.html?lat=18.53&lon=73.82&detailLat=28.61&detailLon=77.23&width=1000&height=1000&zoom=15&level=surface&overlay=wind&menu=&message=true&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
        frameBorder="1"
      ></iframe>
    </div>
  );
};
 
export default Map;
 