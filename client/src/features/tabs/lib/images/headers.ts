type Dimensions = {
	width: number;
	height: number;
};

const HEADER_LIMIT = 256 * 1024;

const readUint24 = (bytes: Uint8Array, offset: number): number =>
	bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);

const readAscii = (bytes: Uint8Array, offset: number, length: number): string =>
	String.fromCharCode(...bytes.subarray(offset, offset + length));

const readPngDimensions = (bytes: Uint8Array, view: DataView): Dimensions | undefined => {
	if (
		bytes.length < 33 ||
		bytes[0] !== 0x89 ||
		readAscii(bytes, 1, 7) !== 'PNG\r\n\x1a\n' ||
		readAscii(bytes, 12, 4) !== 'IHDR'
	) {
		return;
	}

	return {
		width: view.getUint32(16),
		height: view.getUint32(20),
	};
};

const readJpegDimensions = (bytes: Uint8Array, view: DataView): Dimensions | undefined => {
	let offset = 2;

	while (offset + 4 <= bytes.length) {
		if (bytes[offset++] !== 0xff) return;

		while (offset < bytes.length && bytes[offset] === 0xff) {
			offset++;
		}

		const marker = bytes[offset++];

		if (marker === 0xda || marker === 0xd9) return;
		if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
		if (offset + 2 > bytes.length) return;

		const length = view.getUint16(offset);
		if (length < 2 || offset + length > bytes.length) return;

		const isFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
		if (isFrame && length >= 8) return { width: view.getUint16(offset + 5), height: view.getUint16(offset + 3) };

		offset += length;
	}
};

const readWebpDimensions = (bytes: Uint8Array, view: DataView): Dimensions | undefined => {
	let canvas: Dimensions | undefined;

	for (let offset = 12; offset + 8 <= bytes.length;) {
		const type = readAscii(bytes, offset, 4);
		const length = view.getUint32(offset + 4, true);
		const start = offset + 8;

		let frame: Dimensions | undefined;

		if (type === 'VP8X' && length >= 10 && start + 10 <= bytes.length) {
			canvas = { width: readUint24(bytes, start + 4) + 1, height: readUint24(bytes, start + 7) + 1 };
		}

		if (
			type === 'VP8 ' &&
			length >= 10 &&
			start + 10 <= bytes.length &&
			readAscii(bytes, start + 3, 3) === '\x9d\x01\x2a'
		) {
			frame = {
				width: view.getUint16(start + 6, true) & 0x3fff,
				height: view.getUint16(start + 8, true) & 0x3fff,
			};
		}

		if (type === 'VP8L' && length >= 5 && start + 5 <= bytes.length && bytes[start] === 0x2f) {
			const bits = view.getUint32(start + 1, true);

			frame = { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
		}

		if (frame) {
			if (canvas && (canvas.width !== frame.width || canvas.height !== frame.height))
				throw new Error('outputDimensions');
			return frame;
		}

		offset = start + length + (length % 2);
	}

	return canvas;
};

export const readImageDimensions = async (blob: Blob): Promise<Dimensions | undefined> => {
	const bytes = new Uint8Array(await blob.slice(0, HEADER_LIMIT).arrayBuffer());
	const view = new DataView(bytes.buffer);

	if (bytes.length >= 33 && bytes[0] === 0x89) return readPngDimensions(bytes, view);
	if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return readJpegDimensions(bytes, view);
	if (bytes.length >= 20 && readAscii(bytes, 0, 4) === 'RIFF' && readAscii(bytes, 8, 4) === 'WEBP')
		return readWebpDimensions(bytes, view);
};
