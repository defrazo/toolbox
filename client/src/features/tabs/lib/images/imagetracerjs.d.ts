declare module 'imagetracerjs' {
	const ImageTracer: {
		imagedataToSVG(
			image: ImageData,
			options: {
				ltres: number;
				qtres: number;
				pathomit: number;
				roundcoords: number;
				numberofcolors: number;
				colorsampling: number;
				colorquantcycles: number;
				layering: number;
				strokewidth: number;
				viewbox: boolean;
			}
		): string;
	};
	export default ImageTracer;
}
