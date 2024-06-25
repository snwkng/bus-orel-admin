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

	async post(url: string, body?: any): Promise<JSON | Error> {
		try {
			const res = await fetch(`${this.baseUrl}:${this.port}${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			if (res.ok) {
				return res.json();
			} else {
				throw new Error(res.statusText);
			}
		} catch (err: unknown) {
			throw new Error(err as string);
		}
	}

	async delete(url: string) {
		const res = await fetch(`${this.baseUrl}:${this.port}${url}`, {
			method: 'DELETE',
		});
		return res.json();
	}

	async uploadFiles(url: string, formData: FormData) {
		const res = await fetch(`${this.baseUrl}:${this.port}${url}`, {
			method: 'POST',
			body: formData
		});
		return res.json();
	}

	async getFiles(url: string,dir: 'docs' | 'images', type: 'excursions' | 'hotels') {
		const res = await fetch(`${this.baseUrl}:${this.port}${url}` +
		new URLSearchParams({
			dir,
			type
		}));
		return res;
	}
}

export const fetchApi = new FetchApi();
