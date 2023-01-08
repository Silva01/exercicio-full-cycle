import ProductFactory from "./product.factory";

describe("Product factory unit tests", () => {
    it("shouldt create a product type a", () => {
        const product = ProductFactory.create("a", "Product A", 100);

        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product A");
        expect(product.price).toBe(100);
        expect(product.constructor.name).toBe("Product");
    });

    it("shouldt create a product type a", () => {
        const product = ProductFactory.create("b", "Product B", 1);

        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product B");
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe("ProductB");
    });

    it("shouldt throw an error when create a product with invalid type", () => {
        expect(() => ProductFactory.create("c", "Product C", 1)).toThrowError("Invalid type");
    });
});