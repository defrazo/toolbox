import { useEffect, useRef, useState } from 'react';
import type { PercentCrop } from 'react-image-crop';
import { saveAs } from 'file-saver';

import {
	cropAspect,
	cropPixels,
	decodeImage,
	detectFormat,
	exportCrop,
	fitCrop,
	orientedSize,
	planCropOutput,
} from '../lib';
import { IMAGES } from './constants';
import type { CropAspect, CropError, CropFormat, CropSource } from './types';

type CropCustom = {
	width: string;
	height: string;
};

type CropResult = {
	blob: Blob;
	name: string;
	width: number;
	height: number;
};

export const useCrop = (notify: (error: CropError) => void) => {
	const [file, setFile] = useState<File | null>(null);
	const [source, setSource] = useState<CropSource | null>(null);
	const [loading, setLoading] = useState(false);
	const [transform, setTransform] = useState(IMAGES.CROP.DEFAULT);
	const [crop, setCrop] = useState<PercentCrop>({ ...IMAGES.CROP.FULL });
	const [aspect, setAspectState] = useState<CropAspect>('free');
	const [custom, setCustomState] = useState<CropCustom>({ width: '1', height: '1' });
	const [zoom, setZoom] = useState(100);
	const [format, setFormatState] = useState<CropFormat>('png');
	const [quality, setQualityState] = useState(90);
	const [exporting, setExporting] = useState(false);
	const [result, setResult] = useState<CropResult | null>(null);

	const generation = useRef(0);
	const notifyRef = useRef(notify);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	notifyRef.current = notify;

	const invalidate = () => {
		generation.current++;
		setResult(null);
		setExporting(false);
	};

	useEffect(() => {
		let current = true;
		let image: HTMLImageElement | undefined;

		invalidate();
		setSource(null);

		if (!file) {
			setLoading(false);
			return;
		}

		setLoading(true);

		void (async () => {
			try {
				if (file.size > IMAGES.MAX_BYTES) throw new Error('size');

				const imageFormat = await detectFormat(file);
				if (imageFormat === 'ico') throw new Error('unsupported');

				if (!current) return;

				image = await decodeImage(file, imageFormat);

				if (!current) {
					image.src = '';
					return;
				}

				setTransform({ ...IMAGES.CROP.DEFAULT });
				setAspectState('free');
				setCustomState({ width: '1', height: '1' });
				setZoom(100);
				setCrop({ ...IMAGES.CROP.FULL });

				setSource({ image, format: imageFormat, name: file.name, bytes: file.size });
			} catch (error) {
				if (current) {
					const code = error instanceof Error ? error.message : '';

					notifyRef.current(
						['unsupported', 'size', 'pixels'].includes(code) ? (code as CropError) : 'decode'
					);

					setFile(null);
				}
			} finally {
				if (current) setLoading(false);
			}
		})();

		return () => {
			current = false;
			generation.current++;

			if (image) image.src = '';
		};
	}, [file]);

	const size = source
		? orientedSize(source.image.naturalWidth, source.image.naturalHeight, transform.rotation)
		: { width: 1, height: 1 };

	const ratio = cropAspect(aspect, size.width, size.height, custom);
	const selection = cropPixels(crop, size.width, size.height);
	const outputPlan = planCropOutput(selection);

	const addFiles = (files: File[]) => {
		if (files.length !== 1) {
			notify('single');
			return;
		}

		invalidate();
		setFile(files[0]);
		setFormatState('png');
		setQualityState(90);
	};

	const setCropValue = (value: PercentCrop) => {
		invalidate();
		setCrop(value);
	};

	const setAspect = (value: string) => {
		if (!IMAGES.CROP.ASPECTS.includes(value as CropAspect)) return;

		const next = value as CropAspect;

		invalidate();
		setAspectState(next);
		setCrop(fitCrop(cropAspect(next, size.width, size.height, custom), size.width, size.height));
	};

	const setCustom = (side: 'width' | 'height', value: string) => {
		invalidate();

		const next = { ...custom, [side]: value };
		setCustomState(next);

		const aspectRatio = cropAspect('custom', size.width, size.height, next);
		if (aspectRatio) setCrop(fitCrop(aspectRatio, size.width, size.height));
	};

	const rotate = (direction: -1 | 1) => {
		invalidate();

		const rotation = (transform.rotation + direction * 90 + 360) % 360;
		const next = source ? orientedSize(source.image.naturalWidth, source.image.naturalHeight, rotation) : size;

		setTransform({ ...transform, rotation });
		setCrop(fitCrop(cropAspect(aspect, next.width, next.height, custom), next.width, next.height));
	};

	const flip = (side: 'flipX' | 'flipY') => {
		invalidate();
		setTransform({ ...transform, [side]: !transform[side] });
	};

	const setFormat = (value: string) => {
		if (!IMAGES.CROP.FORMATS.includes(value as CropFormat)) return;

		invalidate();
		setFormatState(value as CropFormat);
	};

	const setQuality = (value: number) => {
		if (!Number.isFinite(value)) return;

		invalidate();
		setQualityState(Math.min(100, Math.max(1, Math.round(value))));
	};

	const reset = () => {
		invalidate();
		setTransform({ ...IMAGES.CROP.DEFAULT });
		setAspectState('free');
		setCustomState({ width: '1', height: '1' });
		setCrop({ ...IMAGES.CROP.FULL });
		setZoom(100);
	};

	const clear = () => {
		setFile(null);
		setSource(null);
		reset();
	};

	const prepare = async () => {
		const canvas = canvasRef.current;

		if (
			!source ||
			!canvas ||
			exporting ||
			outputPlan.error ||
			(aspect === 'custom' && !ratio) ||
			crop.width <= 0 ||
			crop.height <= 0
		) {
			return;
		}

		const operation = ++generation.current;

		setExporting(true);
		setResult(null);

		try {
			const blob = await exportCrop(canvas, selection, outputPlan, format, quality);

			if (operation !== generation.current) return;

			const base = source.name.replace(/\.[^.]+$/, '') || 'Image';
			setResult({ blob, name: `${base}_crop.${format}`, width: outputPlan.width, height: outputPlan.height });
		} catch {
			if (operation === generation.current) notifyRef.current('encode');
		} finally {
			if (operation === generation.current) setExporting(false);
		}
	};

	const download = () => {
		if (!result) return;

		try {
			saveAs(result.blob, result.name);
		} catch {
			notify('encode');
		}
	};

	return {
		canvasRef,
		source,
		loading,
		size,
		selection,
		crop,
		setCrop: setCropValue,
		aspect,
		setAspect,
		ratio,
		custom,
		setCustom,
		zoom,
		setZoom,
		transform,
		rotate,
		flip,
		outputPlan,
		format,
		setFormat,
		quality,
		setQuality,
		result,
		exporting,
		prepare,
		download,
		reset,
		addFiles,
		clear,
		hasWork: !!file || loading,
	};
};
