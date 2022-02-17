import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    getProduct():object{
        const tornillo = {
            name: "Tornillo",
            price: 150,
            qty: 1000
        }
        return tornillo
    }
}
