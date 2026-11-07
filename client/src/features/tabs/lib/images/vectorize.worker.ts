import ImageTracer from 'imagetracerjs';

import { IMAGES, type VectorTraceRequest } from '../../model';

const DETAILS = {
	low: { ltres: 3, qtres: 3, pathomit: 24, roundcoords: 1 },
	medium: { ltres: 1, qtres: 1, pathomit: 8, roundcoords: 1 },
	high: { ltres: 0.25, qtres: 0.25, pathomit: 0, roundcoords: 2 },
};

self.onmessage = ({ data }: MessageEvent<VectorTraceRequest>) => {
	try {
		const svg = ImageTracer.imagedataToSVG(data.image, {
			...DETAILS[data.settings.detail],
			numberofcolors: data.settings.colors,
			colorsampling: 2,
			colorquantcycles: 3,
			layering: 0,
			strokewidth: 0,
			viewbox: true,
		});

		const paths = svg.slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'));

		if (!/<path\b/.test(paths)) throw new Error('vectorEmpty');
		if (/<image\b|data:|base64/i.test(paths)) throw new Error('encode');

		const scaleX = data.width / data.image.width;
		const scaleY = data.height / data.image.height;

		const output = [
			`<svg xmlns="http://www.w3.org/2000/svg" width="${data.width}" height="${data.height}" viewBox="0 0 ${data.width} ${data.height}">`,
			`<g transform="scale(${scaleX} ${scaleY})">`,
			paths,
			'</g></svg>',
		].join('');

		const buffer = new TextEncoder().encode(output).buffer;

		if (buffer.byteLength > IMAGES.VECTOR.MAX_BYTES) throw new Error('vectorSize');

		self.postMessage({ buffer }, { transfer: [buffer] });
	} catch (error) {
		self.postMessage({ error: error instanceof Error ? error.message : 'encode' });
	}
};
