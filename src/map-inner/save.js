import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { STYLES_MAPPING } from ".";

export default function Save({ attributes }) {
	const {
		zoom_level,
		center_lat,
		center_lng,
		map_height,
		map_theme,
		show_zoom_controls,
		map_markers,
	} = attributes;

	const blockProps = useBlockProps.save({
		styles: {
			height: map_height,
		},
	});

	return (
		<div {...blockProps}>
			<div
				data-zoom-level={zoom_level}
				data-center-latitude={center_lat}
				data-center-longitude={center_lng}
				data-map-theme={JSON.stringify(STYLES_MAPPING[map_theme].styles)}
				data-show-zoom-controls={show_zoom_controls}
				data-map-markers={JSON.stringify(map_markers)}
				className="j0w0-google-map"
				style={{ height: map_height + "px" }}
			></div>
		</div>
	);
}
