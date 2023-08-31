// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (earthquakeData) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(earthquakeData.features);
});

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 50000;
};

//color depth
function markerColor(depth) {
  if (depth < 10) return "#00ffff";
  else if (depth < 30) return "#00ffff";
  else if (depth < 50) return "#00ffff";
  else if (depth < 70) return "#00ffff";
  else if (depth < 90) return "#00ffff";
  else return "#00ffff";

}

function createFeatures(earthquakeData) {
    //popup showimg place and time of earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
    </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }


  //Geojson layer
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {

            // Determine the style of markers based on properties
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                color: "black",
                stroke: true,
                weight: 1
            }
            return L.circle(latlng, markers);
        }
  });

   // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
} 

function createMap(earthquakes) {
    // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let sat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Satellite Map": sat
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


//Creating a legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    depth = [-10, 10, 30, 50, 70, 90];

    for (let i =0; i < depth.length; i++) {
        div.innerHTML += 
        '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
          }
          return div;
          };

          legend.addTo(myMap);

}
  
 