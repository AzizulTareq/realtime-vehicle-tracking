// Dear Hiring Manager, this one should be in .env file, still I added this here.
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppenVsdGFyZXEiLCJhIjoiY2xtbjkzaTRrMHBvczJsdGJzMjUzbGZseCJ9.yGpY5oLk2F64sUBUmuVXuQ";

const markers = {};
let status = "all";
let centerLat = 23.8103;
let centerLng = 90.406;
let barChart;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [centerLng, centerLat],
  zoom: 12,
});

// creates markers (car signs)
const createMarkers = (data) => {
  data
    .filter((car) => car.status !== status)
    .forEach((marker) => {
      if (markers[marker.id]) {
        markers[marker.id].remove();
      }

      const carMarker = document.createElement("div");
      carMarker.className = "custom-marker";

      const markerImage = document.createElement("img");
      markerImage.src = "images/redcar.png";
      markerImage.className = "custom-marker-img";

      carMarker.appendChild(markerImage);
      const textContainer = document.createElement("div");
      textContainer.className = "custom-marker-text";

      if (marker.status === "Idle") {
        textContainer.innerText = "I";
      } else {
        textContainer.innerText = "M";
      }

      carMarker.appendChild(textContainer);

      const newMarker = new mapboxgl.Marker({ element: carMarker })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      markers[marker.id] = newMarker;
    });
};

// generates the rows of table
const generateMarkerTable = (data) => {
  const tableBody = document.getElementById("markerTableBody");
  tableBody.innerHTML = "";
  data
    .filter((car) => car.status !== status)
    .forEach((marker) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${marker.id}</td>
    <td>${marker.lat.toFixed(4)}</td>
    <td>${marker.lng.toFixed(4)}</td>
    <td>${marker.distance.toFixed(2)} Km</td>
    <td>${marker.status}</td>
`;
      tableBody.appendChild(row);
      row.onclick = function () {
        map.setCenter([marker.lng, marker.lat]);
      };
    });
};

const radioButtons = document.querySelectorAll('input[name="status-filter"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("change", function () {
    status = this.value;
  });
});

// Initialize chart, used chart.js, chart.js cdn added in the html file
const createInitialChart = () => {
  const canvas = document.getElementById("acquisitions");
  const ctx = canvas.getContext("2d");

  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Acquisitions by Distance",
        data: [],
        backgroundColor: "#B7A8E9",
      },
    ],
  };

  barChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
  });
};

// chart update
function updateChart(data) {
  const chartData = barChart.data;
  chartData.labels = data.map((row) => row.id);
  chartData.datasets[0].data = data.map((row) => row.distance);
  barChart.update();
}

createInitialChart([]);

// websocket connection, getting the realtime data from backend
const connection = new WebSocket("ws://tareq-vehicle-tracking.onrender.com:80");

connection.onmessage = (e) => {
  const markerData = JSON.parse(e.data);

  Object.values(markers).forEach((marker) => {
    marker.remove();
  });
  generateMarkerTable(markerData);
  createMarkers(markerData);
  updateChart(markerData);
};
