const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const app = express();
const port = 80;

app.use("/", express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var markerData = [
  { id: 1, lat: 23.8103, lng: 90.4125, distance: 0, status: "Moving" },
  { id: 2, lat: 23.8103, lng: 90.4125, distance: 0, status: "Moving" },
  { id: 3, lat: 23.8103, lng: 90.4125, distance: 0, status: "Idle" },
  { id: 4, lat: 23.8759, lng: 90.3904, distance: 0, status: "Moving" },
  { id: 5, lat: 23.7465, lng: 90.376, distance: 0, status: "Idle" },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  var interval = setInterval(function () {
    markerData = markerData.map((marker) => {
      if (marker.status === "Moving") {
        const newLat = marker.lat + (Math.random() - 0.5) * 0.01;
        const newLng = marker.lng + (Math.random() - 0.5) * 0.01;
        const distanceMoved = calculateDistance(
          marker.lat,
          marker.lng,
          newLat,
          newLng
        );

        return {
          ...marker,
          lat: newLat,
          lng: newLng,
          distance: marker.distance + distanceMoved, 
        };
      } else {
        return marker;
      }
    });

    const jsonData = JSON.stringify(markerData);
    ws.send(jsonData);
  }, 1000);

  ws.on("close", function close() {
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
