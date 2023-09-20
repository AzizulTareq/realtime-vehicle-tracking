# Mini Vehicle Tracking Dashboard

Welcome to the Mini Vehicle Tracking Dashboard repository! This project aims to create a simple web-based dashboard that provides real-time information about multiple vehicles. You can use the following instructions to run the project on your machine.

## Getting Started

To run the repository locally, follow these steps:

1. Clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/AzizulTareq/realtime-vehicle-tracking.git
   ```
2. Navigate to the project directory:
    ```bash
    cd vehicle-tracking-dashboard
    ```
3. Install the project dependencies using npm:
    ```bash
    npm install
    ```
4. Start the project:
    ```bash
    npm start
    ```
5. Open the below file with browser
    ```bash
    public/index.html
    ```

## Completed Features

### Objective

Create a simple web-based dashboard that can display real-time information about multiple vehicles. You can mock the data or use any public API for demonstration purposes.

### ✔️ Front-end
- Use HTML, CSS, and JavaScript to design the user interface.
- Show a map with vehicle markers.
- Display a list of vehicles and their current status (moving, idle, etc.).

### ✔️ Back-end (Node.js)
- Create mock APIs that the frontend can call to update vehicle positions and statuses.

### ✔️ Real-time Updates
- Use Websockets or any real-time technology to update vehicle markers and statuses on the map.

### ✔️ Filters
- Add filters to only show vehicles that meet certain conditions (e.g., moving, idle). Both table and vehicles on the map are filterable.

### ✔️ Bonus
- Include a simple graph or chart to show metrics like distance covered by each vehicle over time.

### ✔️ Extra
- Vehicles goes out of screen, so by clicking on the table row, a vehicle's location could be centered on the screen.
