import { ObjectId } from 'bson';

interface IExcursion {
	_id: ObjectId;
	name: string;
	description: string[];
	images: string[];
	duration: number;
	price: number;
	documentName: string[];
	excursionStartDates: string[];
	cities: string[];
	hotelName: string;
	thePriceIncludes: string[];
}

export type CreateExcursionDto = Omit<IExcursion, 'id'>;
export type EditExcursionDto = Omit<IExcursion>;
