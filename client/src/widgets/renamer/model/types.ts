export type AddFilesResult = {
	added: number;
	rejectedByLimit: number;
	rejectedBySize: File[];
};

export type PreviewFile = {
	oldName: string;
	newName: string;
};
