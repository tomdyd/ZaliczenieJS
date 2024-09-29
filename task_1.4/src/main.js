import L from 'leaflet';
import 'leaflet-routing-machine';

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var startMarker, endMarker, routeControl;

map.on('click', function(e) {
    if (!startMarker) {
        startMarker = L.marker(e.latlng).addTo(map).bindPopup('Początek trasy').openPopup();
    } else if (!endMarker) {
        endMarker = L.marker(e.latlng).addTo(map).bindPopup('Koniec trasy').openPopup();
    }
});

document.getElementById('generate-route').addEventListener('click', function() {
    if (startMarker && endMarker) {
        if (routeControl) {
            map.removeControl(routeControl);
        }
        routeControl = L.Routing.control({
            waypoints: [
                startMarker.getLatLng(),
                endMarker.getLatLng()
            ],
            routeWhileDragging: true
        }).addTo(map);

        routeControl.on('routesfound', function(e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            document.getElementById('route-info').innerHTML = `
                <h2>Parametry trasy</h2>
                <p>Długość: ${(summary.totalDistance / 1000).toFixed(2)} km</p>
                <p>Czas: ${(summary.totalTime / 60).toFixed(2)} min</p>
            `;
        });
    } else {
        alert('Proszę ustawić oba markery.');
    }
});