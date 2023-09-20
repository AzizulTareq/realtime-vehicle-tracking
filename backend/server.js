const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const app = express();
const port = 80;

app.use("/", express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var markerData = [
  { id: 1, lat: 23.8103, lng: 90.4125, distance: 58, status: "moving" },
  { id: 2, lat: 23.8103, lng: 90.4125, distance: 58, status: "moving" },
  { id: 3, lat: 23.8103, lng: 90.4125, distance: 58, status: "idle" },
  { id: 4, lat: 23.8759, lng: 90.3904, distance: 25, status: "moving" },
  { id: 5, lat: 23.7465, lng: 90.3760, distance: 42, status: "idle" },
]

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
  });

  var interval = setInterval(function () {
    markerData = markerData.map((marker) => {
      if (marker.status === "moving") {
        return {
          ...marker,
          lat: marker.lat + (Math.random() - 0.5) * 0.01,
          lng: marker.lng + (Math.random() - 0.5) * 0.01,
        };
      } else {
        return marker;
        3;
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
