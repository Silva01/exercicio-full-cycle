import Product from "./product";

describe("Product unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let product = new Product("", "123", 100);
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let product = new Product("123", "", 100);
        }).toThrowError("Name is required");
    });

    it("should throw error when price is 0", () => {
        expect(() => {
            let product = new Product("123", "123", 0);
        }).toThrowError("Price must be greater than 0");
    });

    it("should calculate total", () => {
        const product = new Product("p1", "product 1", 100);
        const total = product.total();

        expect(total).toBe(100);
    });

    it("should validate product", () => {
        const product = new Product("p1", "product 1", 100);
        const isValid = product.validate();

        expect(isValid).toBe(true);
    });

    it("should change product name", () => {
        const product = new Product("p1", "product 1", 100);
        product.changeName("product 2");

        expect(product.name).toBe("product 2");
    });

    it("should change price", () => {
        const product = new Product("p1", "product 1", 100);
        product.changePrice(200);

        expect(product.price).toBe(200);
    });
});