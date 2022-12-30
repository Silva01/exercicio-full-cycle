import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    
    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Daniel Silva");
        }).toThrowError("Id is required")
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required")
    });

    it("should change name", () => {

        const customer = new Customer("123", "John");

        customer.changeName("Jane");

        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {

        const customer = new Customer("1", "Customer 1");
        const address = new Address("street 1", 123, "13330-250", "Brasília");
        customer.Address = address;

        customer.activate();

        expect(customer.isActivate()).toBe(true);
    });

    it("should deactivate customer", () => {

        const customer = new Customer("1", "Customer 1");
        customer.desactivate();

        expect(customer.isActivate()).toBe(false);
    });

    it("should throw error when addrees is undefined when you activate a customer", () => {

        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
        
    });

});