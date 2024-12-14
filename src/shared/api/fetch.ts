class FetchApi {
	private readonly baseUrl = process.env.NODE_ENV === 'development' ? import.meta.env.VITE_DEV_BASE_URL + '/api' : import.meta.env.VITE_BASE_URL + '/api';
	private headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${localStorage.getItem('token')}`
	};

	errorHandler(err: unknown): Error {
		if ((err as any)?.status === 401) {
			localStorage.removeItem('token');
			location.replace(location.host + '/login');
		}
		return err as Error;
	}

	async get(url: string, params?: any) {
		try {
			const res = await fetch(
				`${this.baseUrl}${url}` +
				new URLSearchParams({
					...params
				}),
				{
					method: 'GET',
					headers: new Headers(this.headers),
				}

			);
			if (!res.ok) {
				throw res;
			}
			return res.json();
		} catch (err: unknown) {
			throw this.errorHandler(err);
		}
	}

	async post(url: string, body?: any): Promise<void | JSON | Error> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				throw res;
			}
			const textData = await res.text();
			if (textData.length) {
				return JSON.parse(textData);
			}
		} catch (err: unknown) {
			throw this.errorHandler(err);
		}
	}

	async put(url: string, body?: any): Promise<JSON | Error> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'PUT',
				headers: this.headers,
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				throw res;
			}
			return res.json();
		} catch (err: unknown) {
			throw this.errorHandler(err);
		}
	}

	async delete(url: string) {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'DELETE',
				headers: this.headers,
			});
			if (!res.ok) {
				throw res;
			}
			return res.json();
		} catch (err: unknown) {
			throw this.errorHandler(err);
		}
	}

	async upload(url: string, formData: FormData) {
		const res = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST',
			headers: {
				'Authorization': this.headers['Authorization']
			},
			body: formData
		});
		return res.text();
	}

	async download(url: string, fileName: string) {
		try {
			const res: Response = await fetch(
				`${this.baseUrl}${url}${fileName}`,
				{
					headers: {
						'Authorization': this.headers['Authorization']
					},
				}
			);
			if (!res.ok) {
				throw res;
			}
			const blob = await res.blob();
			return new File([blob], fileName);
		} catch (err: unknown) {
			throw this.errorHandler(err);
		}
	}

	setToken() {
		this.headers = {
			...this.headers,
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		};
	}
}

export const fetchApi = new FetchApi();
