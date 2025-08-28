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
			const contentString = `<div class="j0w0-gm-info-window">
				${marker.label}
			</div>`;

			const infoWindow = new google.maps.InfoWindow({
				ariaLabel: marker.label,
				content: contentString,
				headerDisabled: true,
				maxWidth: 200,
			});

			const mapMarker = new google.maps.Marker({
				map: googleMap,
				position: marker.position,
				title: marker.label,
			});

			infoWindow.open({
				anchor: mapMarker,
				map: googleMap,
			});
		});
	}
};
