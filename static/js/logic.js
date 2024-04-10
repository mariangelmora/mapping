// Store our API endpoint as url.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create a map 
const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

fetch(url)
  .then(response => response.json())
  .then(data => {
    function getMarkerSize(magnitude) {
      if (magnitude === 0){
      return 1; // Adjust multiplier for better visualization
    }
    return magnitude * 4;
  }

    function getMarkerColor(depth) {
      if (depth < 30) {
        return 'green';
      } else if (depth < 70) {
        return 'yellow';
      } else if (depth < 150) {
        return 'orange';
      } else {
        return 'red';
      }
    }

    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
      const size = getMarkerSize(magnitude);
      const color = getMarkerColor(depth);

      L.circleMarker([coordinates[1], coordinates[0]], {
        radius: size,
        color: 'black', 
        fillColor: color,
        fillOpacity: 1,
        stroke: true,
        weight: 0.5
      }).addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 30, 70, 150];
      const colors = ['green', 'yellow', 'orange', 'red'];
      let labels = [];

      // Loop through depths and colors to create legend labels
      for (let i = 0; i < depths.length; i++) {
        labels.push(
          `<i style="background:${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+'}`
        );
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(map);
  });
