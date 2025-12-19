import { ObjectId } from 'bson';

interface IHotel {
	_id: ObjectId;
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
	rooms: IHotelRoomInfo[];
	published: boolean;
}

export type CreateHotelDto = Omit<ITour, 'id'>;
export type EditHotelDto = Omit<ITour>;

export interface IHotelRoomInfo {
	type: string;
	roomName: string;
	capacity: number;
	inRoom?: string;
}

export interface IDatesAndPrices {
	startDate?: Date | string;
	endDate?: Date | string;
	pricePerPerson?: number;
	_id?: ObjectId;
}
