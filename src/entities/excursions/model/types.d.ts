import { ObjectId } from 'bson';

export interface IExcursion {
	_id?: ObjectId;
	name: string;
	description: string[];
	images: { name: string; _id?: ObjectId }[];
	duration: number;
	price: number;
	documentName: string;
	excursionStart: Date;
	city: string;
	hotelName: string;
	thePriceIncludes: string[];
}
