import { ObjectId } from 'bson';

export interface ITour {
	_id?: ObjectId;
	name: string;
	type: string;
	description: string;
	address: {
		city: string;
		region: string;
		country: string;
		fullAddress: string;
		_id?: ObjectId;
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
		icon?: string;
	}[];
	images: string[];
	minPrice: number;
	seaType: string;
	documentName: string[];
	tours: IHotelRoomInfo[];
}

export interface IHotelRoomInfo {
	type?: string;
	roomName?: string;
	beds?: number;
	description?: string;
	availability?: IDatesAndPrices[];
}

export interface IDatesAndPrices {
	startDate?: Date | string;
	endDate?: Date | string;
	pricePerPerson?: number;
	_id?: ObjectId;
}
