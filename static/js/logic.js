//geojson url all earthquakes in the past 7 days
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

//Starting coordinates for a United States map, using Denver Colorado
let starterCoordinates = [39.7392, -104.9849];

//initialize map zoom level
let mapZoomLevel = 5;

//function for creating the map
function createMap(earthquakeLayer) {

    //create the tile layer
    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    //create basemaps object
    let baseMaps = {
        Tilelayer: tileLayer
    };

    //create the overlayMaps object with the earthquake markers
    let overlayMaps = {
        'Earthquake Markers': L.layerGroup(earthquakeLayer)
    };

  //create the map object
    let map = L.map("map", {
        center: starterCoordinates,
        zoom: mapZoomLevel
    });

    //create the layer control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    //create the legend
    //legend code found at
    //https://codepen.io/haakseth/pen/KQbjdO
    let legend = L.control({ position: "bottomleft" });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Earthquake Depth</h4>";
        div.innerHTML += '<i style="background: #f4cccc"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #ea9999"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #e06666"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #cc0000"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #990000"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #660000"></i><span>90+</span><br>';
        return div;
    };

    legend.addTo(map);
    
}

//create the earthquake visualization
function createMarkers(response) {
    
    let features = response.features;
    console.log(features);
    //empty array for markers
    let earthquakeMarkerArray = [];
    for (let i = 0; i < features.length; i++) {
        //Create marker
        earthquakeMarkerArray.push(
          L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: setColor(features[i].geometry.coordinates[2]),
            fillColor: setColor(features[i].geometry.coordinates[2]),
            radius: markerSize(features[i].properties.mag)
          }).bindPopup(`<h3>Location: ${features[i].properties.place}</h3> <h3>Magnitude: ${features[i].properties.mag}</h3> <h3>Depth: ${features[i].geometry.coordinates[2]}</h3>`)
        );
    };
    createMap(earthquakeMarkerArray);
}

//make the markers visible
function markerSize(magnitude) {
    return magnitude * 20000;
}

//set the color of the circles, shade of red gets darker as depth increases
//hex codes found at the following link:
//https://www.color-hex.com/
function setColor(depth) {
    if (depth <= 10) {
        return '#f4cccc';
    }
    else if (depth <= 30) {
        return '#ea9999'
    }
    else if (depth <= 50) {
        return '#e06666'
    }
    else if (depth <= 70) {
        return '#cc0000'
    }
    else if (depth <= 90) {
        return '#990000'
    }
    else  {
        return '#660000'
    };
}

//use d3 to get a response from the api and then build the map
d3.json(url).then(createMarkers);