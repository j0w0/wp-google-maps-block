import { registerBlockType } from "@wordpress/blocks";
import { blueWaterTheme } from "./styles/blue-water";
import { midnightCommanderTheme } from "./styles/midnight-commander";
import { grassIsGreener } from "./styles/grass-is-greener";
import "./style.scss";

import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	edit: Edit,
	save: Save,
});

export const STYLES_MAPPING = {
	blueWater: {
		name: "blueWater",
		label: "Blue Water",
		styles: blueWaterTheme,
	},
	midnightCommander: {
		name: "midnightCommander",
		label: "Midnight Commander",
		styles: midnightCommanderTheme,
	},
	grassIsGreener: {
		name: "grassIsGreener",
		label: "Grass is Greener",
		styles: grassIsGreener,
	},
	default: {
		name: "default",
		label: "Default",
		styles: [],
	},
};
