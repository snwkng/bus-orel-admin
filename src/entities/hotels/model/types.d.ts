export interface IHotel {
	_id: string;
	name: string;
	type: string;
	registryNumber: string;
	description: string;
	address: {
		city: string;
		region: string;
		country: string;
		fullAddress: string;
		_id?: string;
	};
	additionalInfo: {
		food: {
			included: boolean;
			type: string;
		};
		beach: {
			type: string;
			distanceMinutes?: number;
		};
		checkInOut: {
			checkIn: string;
			checkOut: string;
		};
	};
	includedInThePrice: {
		serviceName: string;
		iconForService?: string;
	}[];
	images: string[];
	minPrice: number;
	seaType: string;
	documentName: string[];
	rooms: IHotelRoomInfo[];
	published: boolean;
}

export type CreateHotelDto = Omit<IHotel, '_id'>;
export type EditHotelDto = IHotel;

export interface IHotelRoomInfo {
	type: string;
	name: string;
	capacity: number;
	inRoom?: string;
}

export interface IDatesAndPrices {
	startDate?: Date | string;
	endDate?: Date | string;
	pricePerPerson?: number;
	_id?: string;
}
