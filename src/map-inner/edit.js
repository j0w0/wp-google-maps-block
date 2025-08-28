import { useState, useEffect, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	// Button,
	PanelBody,
	RangeControl,
	ResizableBox,
	TextControl,
	ToggleControl,
	RadioControl,
} from "@wordpress/components";
// import { MediaUpload } from "@wordpress/block-editor";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { STYLES_MAPPING } from ".";

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const {
		zoom_level,
		center_lat,
		center_lng,
		map_height,
		map_theme,
		show_zoom_controls,
		map_markers,
	} = attributes;

	const [zoomLevel, setZoomLevel] = useState(zoom_level);
	const [mapCenter, setMapCenter] = useState({
		lat: center_lat,
		lng: center_lng,
	});
	const [showControls, setShowControls] = useState(show_zoom_controls);
	const [mapMarkers, setMapMarkers] = useState(map_markers);

	useEffect(() => {
		setAttributes({
			zoom_level: zoomLevel,
			center_lat: mapCenter.lat,
			center_lng: mapCenter.lng,
			show_zoom_controls: showControls,
		});
	}, [zoomLevel, mapCenter, showControls]);

	useEffect(() => {
		setZoomLevel(zoom_level);
		setMapCenter({ lat: center_lat, lng: center_lng });
		setShowControls(show_zoom_controls);
	}, [zoom_level, center_lat, center_lng, show_zoom_controls]);

	const handleZoomLevelChange = useCallback((value) => {
		setZoomLevel(value);
	});

	const handleMapCenterChange = useCallback((value) => {
		if (value !== "") {
			const coordinates = value.split(",");
			const lat = Number(coordinates[0]);
			const lng = Number(coordinates[1]);

			if (!isNaN(lat) && !isNaN(lng)) {
				setMapCenter({
					lat,
					lng,
				});
			}
		} else {
			setMapCenter({
				lat: center_lat,
				lng: center_lng,
			});
		}
	});

	const handleZoomControlsToggle = useCallback((checked) => {
		setShowControls(checked);
	});

	// const handleAddMarker = () => {
	// 	setMapMarkers((previousMarkers) => {
	// 		const newMapMarkers = [...previousMarkers];

	// 		newMapMarkers.push({
	// 			title: "new marker",
	// 			latLng: "",
	// 			image: {},
	// 		});

	// 		setAttributes({ map_markers: newMapMarkers });
	// 		return newMapMarkers;
	// 	});
	// };

	const handleMapCameraChange = useCallback((event) => {
		setZoomLevel(event.detail.zoom);
		setMapCenter({
			lat: event.detail.center.lat,
			lng: event.detail.center.lng,
		});
	});

	const handleBlockResize = useCallback(
		(_event, _direction, _element, objectSize) => {
			const newHeight = map_height + objectSize.height;
			setAttributes({ map_height: newHeight });
		},
	);

	const handleMapThemeChange = useCallback((value) => {
		setAttributes({ map_theme: value });
	});

	const getThemeOptions = () => {
		const optionsArray = [];

		Object.entries(STYLES_MAPPING).map(([_key, values]) => {
			optionsArray.push({
				label: values.label,
				value: values.name,
			});
		});

		return optionsArray;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Themes">
					<RadioControl
						onChange={handleMapThemeChange}
						options={getThemeOptions()}
						selected={map_theme}
					/>
				</PanelBody>

				<PanelBody title="Map Settings">
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						help="Please select zoom level for map"
						initialPosition={10}
						label="Zoom Level"
						max={20}
						min={1}
						value={zoomLevel}
						onChange={handleZoomLevelChange}
					/>

					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						help="Center map at these coordinates"
						label="Map Center"
						value={`${mapCenter.lat},${mapCenter.lng}`}
						required={true}
						onChange={handleMapCenterChange}
						readOnly
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label="Show zoom controls"
						checked={show_zoom_controls}
						onChange={handleZoomControlsToggle}
					/>
				</PanelBody>

				<PanelBody title="Marker">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Title"
						onChange={(value) => {
							setMapMarkers((previousMarkers) => {
								const newMarkers = [...previousMarkers];
								newMarkers[0].label = value;
								setAttributes({ map_markers: newMarkers });
								return newMarkers;
							});
						}}
						placeholder={"Marker title"}
						value={mapMarkers[0].label}
					/>
				</PanelBody>

				{/* <PanelBody title="Markers">
					{mapMarkers.length > 0 && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								marginBottom: "24px",
								gap: "24px",
							}}
						>
							{mapMarkers.map((marker, index) => {
								return (
									<div key={index}>
										<legend
											style={{
												weight: 900,
												marginBottom: "8px",
												padding: "0px",
											}}
										>
											Marker {++index}
										</legend>

										<TextControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											label="Title"
											onChange={() => {}}
											placeholder={"Marker title"}
											value={marker.title}
										/>

										<TextControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											label="Position"
											onChange={() => {}}
											placeholder={"Marker position"}
											value={marker.latLng}
										/>

										<MediaUpload
											title="Select marker image"
											allowedTypes={["image/jpeg", "image/png", "image/svg"]}
											value={marker.image.id}
											onSelect={(image) =>
												setMapMarkers((previousMarkers) => {
													const newMapMarkers = [...previousMarkers];
													const markerIndex = newMapMarkers.findIndex(
														(item) => item.image.id === marker.image.id,
													);
													if (markerIndex !== -1) {
														newMapMarkers[markerIndex] = {
															...newMapMarkers[markerIndex],
															image: {
																id: image.id,
																url: image.url,
															},
														};
													}
													setAttributes({ map_markers: newMapMarkers });
													return newMapMarkers;
												})
											}
											render={({ open }) => (
												<>
													{!marker.image.id && (
														<Button variant="secondary" onClick={open}>
															Select image
														</Button>
													)}
													{!!marker.image.id && marker.image.id && (
														<>
															<img src={marker.image.url} onClick={open} />
															<Button
																variant="link"
																isDestructive
																onClick={() => console.log("delete")}
															>
																Remove marker image
															</Button>
														</>
													)}
												</>
											)}
										/>
									</div>
								);
							})}
						</div>
					)}

					<Button
						__next40pxDefaultSize
						onClick={handleAddMarker}
						variant="secondary"
						disabled={mapMarkers.length > 2}
					>
						Add Marker
					</Button>
				</PanelBody> */}
			</InspectorControls>

			<div {...blockProps}>
				<ResizableBox
					enable={{ bottom: true }}
					onResizeStop={handleBlockResize}
					size={{ height: map_height }}
				>
					<APIProvider apiKey={googleMap.apiKey}>
						<Map
							center={mapCenter}
							zoom={zoomLevel}
							onCameraChanged={handleMapCameraChange}
							controlled={false}
							gestureHandling="greedy"
							disableDefaultUI={!showControls}
							styles={STYLES_MAPPING[map_theme].styles}
						>
							{mapMarkers.map((marker, idx) => {
								return (
									<Marker
										draggable
										label={marker.label}
										position={marker.position}
										onDragEnd={(event) => {
											const markerCenter = event.latLng;

											setMapMarkers((previousMarkers) => {
												const newMarkers = [...previousMarkers];

												newMarkers[idx] = {
													...newMarkers[idx],
													position: markerCenter,
												};

												setAttributes({ map_markers: newMarkers });

												return newMarkers;
											});
										}}
									/>
								);
							})}
						</Map>
					</APIProvider>
				</ResizableBox>
			</div>
		</>
	);
}
