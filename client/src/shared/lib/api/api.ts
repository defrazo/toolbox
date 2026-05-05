import axios from 'axios';

export const api = axios.create({
	baseURL: '/',
	withCredentials: true,

	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
	},

	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
});
