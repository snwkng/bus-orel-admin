import { ObjectId } from 'bson';

export interface IExcursion {
	_id: ObjectId;
	name: string;
	description: string[];
	images: string[];
	duration: number;
	price: number;
	documentName: string;
	excursionStart: string;
	city: string;
	hotelName: string;
	thePriceIncludes: string[];
}
