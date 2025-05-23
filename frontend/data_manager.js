
var mymap = L.map('mapid').setView([45.780, 4.871], 18);

// Add base map layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


async function loadRooms() {
    // Add all rooms on the map
    var roomStyle = {
        "color": "#003366",
        "weight": 5,
        "opacity": 0.65
    };
    var roomsFeature = []
    axios.get('http://innovatinsa.piwio.fr:3004/rooms')
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
        .then(console.log("rooms loaded"))
}

async function loadBuildings() {
    // get buildings
    var buildingStyle = {
        "color": "#FFFF00",
        "weight": 5,
        "opacity": 0.65
    };
    var buildingsFeature = []
    axios.get('http://innovatinsa.piwio.fr:3004/buildings')
        .then(function (response) {
            response.data.forEach(element => {
                if (element.geom !== null) {
                    var geometry = JSON.parse(element.geom)
                    var feature = {
                        "type": "Feature",
                        "properties": {
                            "name": "building " + element.id,
                        },
                        "geometry": geometry
                    };
                    buildingsFeature.push(feature)
                    buildingLayer = L.geoJSON(feature, { "style": buildingStyle });
                    buildingLayer.addTo(mymap)

                }
            });
        })
        .then(console.log("buildings loaded"))
}

loadBuildings()
loadRooms()
