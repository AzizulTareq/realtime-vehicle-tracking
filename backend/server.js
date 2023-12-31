const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const app = express();
const port = 80;
const handleCalculateDistance = require("./utils/distanceCalculator");

app.use("/", express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// data which changes after every 3 seconds
var markerData = [
  { id: 1, lat: 23.8103, lng: 90.4125, distance: 0, status: "Moving" },
  { id: 2, lat: 23.8103, lng: 90.4125, distance: 0, status: "Moving" },
  { id: 3, lat: 23.8103, lng: 90.4125, distance: 0, status: "Idle" },
  { id: 4, lat: 23.8759, lng: 90.3904, distance: 0, status: "Moving" },
  { id: 5, lat: 23.7465, lng: 90.376, distance: 0, status: "Idle" },
];

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  // randomizing the status and latitude and longitude
  var interval = setInterval(function () {
    markerData = markerData.map((marker) => {
      const newStatus = Math.random() < 0.5 ? "Idle" : "Moving";
      // calculating distance and randomizing lat, lng only if vehicle is moving.
      if (newStatus === "Moving") {
        const newLat = marker.lat + (Math.random() - 0.5) * 0.01;
        const newLng = marker.lng + (Math.random() - 0.5) * 0.01;
        // calculating distance using handleCalculateDistance function
        const distanceMoved = handleCalculateDistance(
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
          status: newStatus,
        };
      } else {
        return {
          ...marker,
          status: newStatus,
        };
      }
    });

    const jsonData = JSON.stringify(markerData);
    ws.send(jsonData);
  }, 3000);

  ws.on("close", function close() {
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
