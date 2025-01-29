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
	cities: SelectItem[];
	hotelName: string;
	thePriceIncludes: string[];
}
