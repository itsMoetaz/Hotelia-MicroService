export interface HotelService {
    id?: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
    openingTime: string;
    closingTime: string;
  }