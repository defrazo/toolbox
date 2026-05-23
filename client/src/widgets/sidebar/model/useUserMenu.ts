import { useRef, useState } from 'react';

export const useUserMenu = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const toggle = () => setIsMenuOpen((prev) => !prev);

	return { isMenuOpen, setIsMenuOpen, buttonRef, toggle };
};
