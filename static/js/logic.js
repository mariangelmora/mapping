// Store our API endpoint as url.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create a map 
const map = L.map('map', {
  center: [
    40.5, -95
  ],
  zoom: 3
});

let maplayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
})

maplayer.addTo(map);

d3.json(url).then((data)=> {
  function getMarkerSize(magnitude) {
    if (magnitude === 0){
    return 1; // Adjust multiplier for better visualization
  }
  return magnitude * 4;
}

function getMarkerColor(depth) {
  switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ea822c";
    case depth > 50:
      return "#ee9c00";
    case depth > 30:
      return "#eecc00";
    case depth > 10:
      return "#d4ee00";
    default:
      return "#98ee00";
  }
}
  function styleInfo(feature){
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor : getMarkerColor(feature.geometry.coordinates[2]),
      color: '#000000',
      radius: getMarkerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    }
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng);
    },

    style: styleInfo,

    OnEachFeature: function(feature, layer){
      layer.bindPopup(
        'Magnitude: ' + feature.properties.mag
        + '<br>Depth: '+ feature.geometry.coordinates[2]
        + '<br>Location: ' + feature.properties.place
      );
    }
  }).addTo(map);

  let legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
    
  legend.addTo(map);
});