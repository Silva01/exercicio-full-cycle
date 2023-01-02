import Product from "../entity/product";

export default class ProductService {
    static increasePrices(products: Product[], percentage: number): Product[] {
        products.forEach((product) => {
            product.changePrice(product.price + product.price * percentage / 100);
        });

        return products;
    }
}