export const getTtl = (createdAtIso: string, now: number) => {
	const createdMs = Date.parse(createdAtIso);
	if (Number.isNaN(createdMs)) return null;

	const diffMs = createdMs + 86400000 - now;
	if (diffMs <= 0) return null;

	const hours = Math.floor(diffMs / 3600000);
	const minutes = Math.floor((diffMs % 3600000) / 60000);

	return hours > 0 ? `${hours} ч ${minutes} м` : `${minutes} м`;
};
