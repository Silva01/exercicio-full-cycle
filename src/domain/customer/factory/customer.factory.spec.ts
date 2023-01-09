import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit tests", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("John");
        expect(customer.name).toBe("John");
        expect(customer.id).toBeDefined();
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with address", () => {
        const address = new Address("Rua 2", 3, "00000-00", "São Paulo");
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer.name).toBe("John");
        expect(customer.id).toBeDefined();
        expect(customer.address).toBe(address);
        expect(customer.address.street).toBe("Rua 2");
        expect(customer.address.number).toBe(3);
        expect(customer.address.city).toBe("São Paulo");
        expect(customer.address.zip).toBe("00000-00");        
    });
});