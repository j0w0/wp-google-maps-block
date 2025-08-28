window.initMap = () => {
	const maps = document.querySelectorAll(".j0w0-google-map");

	if (maps.length > 0) {
		maps.forEach((map) => {
			j0w0GoogleMapsInit(map);
		});
	}
};

const j0w0GoogleMapsInit = (map) => {
	const lat = parseFloat(map.dataset.centerLatitude);
	const lng = parseFloat(map.dataset.centerLongitude);
	const zoom = parseInt(map.dataset.zoomLevel, 10);
	const theme = JSON.parse(map.dataset.mapTheme || "[]");
	const showZoomControls = map.dataset.showZoomControls;
	const mapMarkers = JSON.parse(map.dataset.mapMarkers);

	const googleMap = new google.maps.Map(map, {
		center: { lat, lng },
		zoom,
		styles: theme,
		disableDefaultUI: showZoomControls === "true" ? false : true,
	});

	if (mapMarkers.length > 0) {
		mapMarkers.forEach((marker) => {
			new google.maps.Marker({
				// icon: {
				// 	path: google.maps.SymbolPath.CIRCLE,
				// 	scale: 10,
				// },
				label: marker.label,
				map: googleMap,
				position: marker.position,
				title: marker.label,
			});
		});
	}
};
