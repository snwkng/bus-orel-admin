import { handleError } from './errorHandler';
class FetchApi {
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	private headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${localStorage.getItem('token')}`
	};

	async get<T>(url: string, params?: any): Promise<T> {
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
			if (!res.ok) throw handleError(res);
			return res.json();
		} catch (err: unknown) {
			handleError(err);
		}
	}

	async post<T>(url: string, body?: any): Promise<void | JSON | Error | T> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(body)
			});
			if (!res.ok) throw handleError(res);
			const textData = await res.text();
			if (textData.length) {
				return JSON.parse(textData);
			}
		} catch (err: unknown) {
			handleError(err);
		}
	}

	async put<T>(url: string, body?: any): Promise<JSON | Error | T> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'PUT',
				headers: this.headers,
				body: JSON.stringify(body)
			});
			if (!res.ok) throw handleError(res);
			return res.json();
		} catch (err: unknown) {
			handleError(err);
		}
	}

	async delete(url: string) {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'DELETE',
				headers: this.headers,
			});
			if (!res.ok) throw handleError(res);
			return res.json();
		} catch (err: unknown) {
			handleError(err);
		}
	}

	async upload(url: string, formData: FormData) {
		try {
			if (!(formData instanceof FormData)) {
				throw new Error('Invalid FormData object');
			}
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'POST',
				headers: {
					'Authorization': this.headers['Authorization']
				},
				body: formData
			});
			return res.text();
		} catch(err: unknown) {
			handleError(err)
		}
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
			if (!res.ok) throw handleError(res);
			const blob = await res.blob();
			return new File([blob], fileName);
		} catch (err: unknown) {
			handleError(err);
		}
	}

	updateToken(token: string): void {
		this.headers['Authorization'] = `Bearer ${token}`;
	}
}

export const fetchApi = new FetchApi(
	process.env.NODE_ENV === 'development'
		? import.meta.env.VITE_DEV_BASE_URL + '/api'
		: import.meta.env.VITE_BASE_URL + '/api'
);
