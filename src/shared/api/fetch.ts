import { handleError } from './errorHandler';
class FetchApi {
	private headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${localStorage.getItem('token')}`
	};
	private urlWithParams(url: string, params?: Record<string, string>) {
		let search = ''
		if (params && Object.keys(params).length) search = new URLSearchParams(params).toString();
		if (search) {
			return `${url}${search}`
		} else {
			return url
		}
	}

	async get<T>(url: string, params?: any): Promise<T> {
		try {
			const res = await fetch(this.urlWithParams(url, params),
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
			const res = await fetch(url, {
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
			const res = await fetch(url, {
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

	async patch<T>(url: string, body?: any): Promise<JSON | Error | T> {
		try {
			const res = await fetch(url, {
				method: 'PATCH',
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
			const res = await fetch(url, {
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
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Authorization': this.headers['Authorization']
				},
				body: formData
			});
			return res.text();
		} catch (err: unknown) {
			handleError(err);
		}
	}

	async download(url: string, fileName: string) {
		try {
			const res: Response = await fetch(
				`${url}${fileName}`,
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

export const fetchApi = new FetchApi();
