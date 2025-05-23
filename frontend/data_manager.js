
var mymap = L.map('mapid').setView([45.780, 4.871], 18);

// Add base map layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

// Add all rooms on the map
var roomStyle = {
    "color": "#003366",
    "weight": 5,
    "opacity": 0.65
};
var roomsFeature = []
axios.get('http://localhost:3000/rooms')
    .then(function (response) {
        response.data.forEach(element => {
            if (element.geom !== null) {
                var geometry = JSON.parse(element.geom)
                var feature = {
                    "type": "Feature",
                    "properties": {
                        "name": "room " + element.id,
                    },
                    "geometry": geometry
                };
                roomsFeature.push(feature)
                roomLayer = L.geoJSON(feature, { "style": roomStyle });
                roomLayer.addTo(mymap)

            }
        });
    })
