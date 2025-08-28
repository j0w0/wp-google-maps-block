import { __ } from "@wordpress/i18n";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

export default function Edit({}) {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<InnerBlocks template={[["j0w0/map-inner"]]} templateLock="all" />
		</div>
	);
}
