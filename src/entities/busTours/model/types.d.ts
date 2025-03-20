import { ObjectId } from 'bson';

export interface ITour {
	_id: ObjectId;
	name: string;
	type: string;
	locationDescription: string;
	images?: string[];
	tours: {
		type: string;
		roomName: string;
		capacity: number;
		inRoom: string;
		datesAndPrices: {
			startDate: Date;
			endDate: Date;
			price: number;
		}[];
	}[];
	food: string;
	beach: string;
	distanceToBeach: string;
	checkInConditions: string;
	address: string;
	price: number;
	thePriceIncludes: string[];
	city: SelectItem;
	region: string;
	seaType: string;
	documentName: string;
}
