// Shared Remotion Studio browser URL (preview). Not the internal REMOTION_URL Docker hostname.
(function () {
	let studioBaseUrl = 'http://localhost:3000';
	let studioReachable = null;
	let studioHint = '';

	function notify(message, type) {
		if (typeof showToast === 'function') {
			showToast(message, type || 'warning');
			return;
		}
		window.alert(message);
	}

	async function loadRemotionStudioInfo() {
		try {
			const response = await fetch('/api/system-info');
			const info = await response.json();
			studioBaseUrl = info.remotionStudioUrl || 'http://localhost:3000';
			studioReachable = Boolean(info.remotionStudioReachable);
			studioHint = info.remotionStudioStartHint || '';
			return info;
		} catch (error) {
			console.warn('[remotion-studio] Could not load system info:', error);
			studioReachable = null;
			return null;
		}
	}

	function buildRemotionStudioUrl(moduleNumber, courseId) {
		const mod = moduleNumber || 1;
		const params = new URLSearchParams({
			composition: `module-${mod}`,
			t: String(Date.now()),
		});
		if (courseId) {
			params.set('course', courseId);
		}
		return `${studioBaseUrl}?${params.toString()}`;
	}

	async function openRemotionStudio(moduleNumber, courseId) {
		if (studioReachable === null) {
			await loadRemotionStudioInfo();
		}
		if (studioReachable === false) {
			notify(studioHint || 'Remotion Studio is not running. Start it with npm start.');
			return false;
		}

		const url = buildRemotionStudioUrl(moduleNumber, courseId);
		const remotionWindow = window.open(url, 'remotion-studio');
		if (remotionWindow) {
			try {
				remotionWindow.location.replace(url);
			} catch (error) {
				console.warn('[remotion-studio] Could not reload existing Remotion tab:', error);
			}
			return true;
		}

		notify('Popup blocked. Open Remotion manually: ' + url, 'warning');
		return false;
	}

	window.loadRemotionStudioInfo = loadRemotionStudioInfo;
	window.buildRemotionStudioUrl = buildRemotionStudioUrl;
	window.openRemotionStudioPreview = openRemotionStudio;
})();
