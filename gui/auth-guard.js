(function () {
	const TOKEN_KEY = 'gui_auth_token';

	async function ensureAuth() {
		try {
			const response = await fetch('/api/auth/status');
			const data = await response.json();
			if (!data.authRequired) {
				return;
			}
			const token = sessionStorage.getItem(TOKEN_KEY);
			if (!token) {
				window.location.href = '/login.html';
				return;
			}
			// Confirm token is still valid (e.g. after password change / container recreate)
			const probe = await fetch('/api/system-info');
			if (probe.status === 401) {
				sessionStorage.removeItem(TOKEN_KEY);
				window.location.href = '/login.html';
			}
		} catch (error) {
			console.warn('[auth-guard] status check failed:', error);
		}
	}

	const originalFetch = window.fetch.bind(window);
	window.fetch = async function (url, options) {
		const opts = options || {};
		const headers = new Headers(opts.headers || {});
		const token = sessionStorage.getItem(TOKEN_KEY);
		if (token) {
			headers.set('X-Gui-Token', token);
		}
		const response = await originalFetch(url, { ...opts, headers });
		if (response.status === 401) {
			const path = String(url);
			if (!path.includes('/api/auth/')) {
				sessionStorage.removeItem(TOKEN_KEY);
				window.location.href = '/login.html';
			}
		}
		return response;
	};

	if (!window.location.pathname.endsWith('/login.html')) {
		ensureAuth();
	}
})();
