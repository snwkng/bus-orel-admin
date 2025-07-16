import { ObjectId } from 'bson';

export interface IExcursion {
	_id: ObjectId;
	name: string;
	description: string[];
	images: string[];
	duration: number;
	price: number;
	documentName: string;
	excursionStartDates: string[];
	cities: string[];
	hotelName: string;
	thePriceIncludes: string[];
}
