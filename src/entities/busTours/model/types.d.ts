import { ObjectId } from 'bson';

export interface ITour {
	_id: ObjectId;
	name: string;
	type: string;
	locationDescription: string;
	images?: string[];
	food: string;
	beach: string;
	distanceToBeach: string;
	checkInConditions: string;
	address: string;
	price: number;
	thePriceIncludes: string[];
	city: SelectItem | null;
	region: string;
	seaType: string;
	documentName: string;
	tours: IHotelRoomInfo[];
}

export interface IHotelRoomInfo {
	type?: string;
	roomName?: string;
	capacity?: number;
	inRoom?: string;
	datesAndPrices?: IDatesAndPrices[];
}

export interface IDatesAndPrices {
	startDate?: Date | string;
	endDate?: Date | string;
	price?: number;
}
