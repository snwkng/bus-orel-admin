class FetchApi {
	private baseUrl = import.meta.env.VITE_BASE_URL;
	private port = import.meta.env.VITE_BACKEND_PORT;
	async get(url: string, params?: any) {
		const res = await fetch(
			`${this.baseUrl}:${this.port}${url}` +
				new URLSearchParams({
					...params
				})
		);
		return res.json();
	}

	async post(url: string, body?: any) {
		const res = await fetch(`${this.baseUrl}:${this.port}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		return res.json();
	}
}

export const fetchApi = new FetchApi();
