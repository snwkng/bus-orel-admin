class FetchApi {
	private readonly baseUrl = import.meta.env.VITE_BASE_URL;
	private headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${localStorage.getItem('token')}`
	};
	async get(url: string, params?: any) {
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
		return res.json();
	}

	async post(url: string, body?: any): Promise<JSON | Error> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'POST',
				headers: this.headers,
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

	async put(url: string, body?: any): Promise<JSON | Error> {
		try {
			const res = await fetch(`${this.baseUrl}${url}`, {
				method: 'PUT',
				headers: this.headers,
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
		const res = await fetch(`${this.baseUrl}${url}`, {
			method: 'DELETE',
			headers: this.headers,
		});
		return res.json();
	}

	async uploadFiles(url: string, formData: FormData) {
		const res = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST',
			headers: this.headers,
			body: formData
		});
		return res.json();
	}

	async getFile(url: string, fileName: string, dir: FileDir, type: FileType) {
		try {
			const res: Response = await fetch(
				`${this.baseUrl}${url}?` +
					new URLSearchParams({
						fileName,
						dir,
						type
					}),
					{
						headers: this.headers,
					}
			);
			if (res.ok) {
				const blob = await res.blob();
				return new File([blob], fileName);
			} else {
				throw new Error(res.statusText);
			}
		} catch (err: unknown) {
			throw new Error(err as string);
		}
	}

	setToken() {
		this.headers = {
			...this.headers,
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		}
	}
}

export const fetchApi = new FetchApi();
