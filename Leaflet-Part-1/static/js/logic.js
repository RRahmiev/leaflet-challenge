// STORE ENDPOINT INSIDE VARIABLE
var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

//  GET REQUEST TO QUERY URL + CREATE FUNCTION
d3.json(url1, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // CREATE POPUPS WITH ERTHQUAKE DETAILS 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // GeoJSON LAYER WITH FEATURES OF THE EARTHQUAKEDATA OBJECT 
  
  var trembler = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color1;
      var r = 255;
      var g = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color1= "red("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 5*feature.properties.mag,
        fillColor: color1,
        color1: "blue",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // PROCESSING LAYERS TO CREATEMAP 
  createMap(trembler);
  
}

function createMap(trembler) {

  // STREETMAP LAYERS 
    var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  // BASEMAPS
  var baseMaps = {
    "Street Map": openstreetmap
  };

  // OVERLAYMAPS
  var overlayMaps = {
    Earthquakes: trembler
  };

  // CREATING MAP AND ADDING LAYERS
  var map1 = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [openstreetmap, trembler]
  });

  function getColor(d) {
     return d < 1 ? 'rgb(30, 254, 51)':
      d < 2  ? 'rgb(116, 236, 0)':
      d < 3  ? 'rgb(155, 218, 0)':
      d < 4  ? 'rgb(183, 198, 0)':
      d < 5  ? 'rgb(206, 177, 0)':
      d < 6  ? 'rgb(223, 154, 0)':
      d < 7  ? 'rgb(236, 130, 0)':
      d < 8  ? 'rgb(245, 103, 0)':
      d < 9  ? 'rgb(249, 72, 0)':
      'rgb(210, 23, 23)';
  }

  // LEGEND
  var legend = L.control({position: 'topright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // LOOPING AND CREATING LABELS
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(map1);

}