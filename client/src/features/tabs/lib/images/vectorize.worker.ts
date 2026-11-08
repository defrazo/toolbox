import ImageTracer from 'imagetracerjs';

import { IMAGES } from '../../model/constants';
import type { VectorTraceRequest } from '../../model/types';

// const DETAILS = {
// 	low: { ltres: 3, qtres: 3, pathomit: 24, roundcoords: 1 },
// 	medium: { ltres: 1, qtres: 1, pathomit: 8, roundcoords: 1 },
// 	high: { ltres: 0.25, qtres: 0.25, pathomit: 0, roundcoords: 2 },
// };

const DETAILS = {
	low: {
		ltres: 2,
		qtres: 2,
		pathomit: 20,
		roundcoords: 1,
		blurradius: 2,
	},
	medium: {
		ltres: 1,
		qtres: 1,
		pathomit: 12,
		roundcoords: 2,
		blurradius: 2,
	},
	high: {
		ltres: 0.5,
		qtres: 0.5,
		pathomit: 4,
		roundcoords: 2,
		blurradius: 1,
	},
};

self.onmessage = ({ data }: MessageEvent<VectorTraceRequest>) => {
	try {
		const svg = ImageTracer.imagedataToSVG(data.image, {
			...DETAILS[data.settings.detail],
			numberofcolors: data.settings.colors,
			colorsampling: 0,
			colorquantcycles: 5,
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
