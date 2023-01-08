import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 4", 3, "00000-111", "Brasilia");

        customer.Address = address;
        customer.activate();
        
        await customerRepository.create(customer);
        
        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel).not.toBeNull();
        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "customer 1",
            street: "Rua 4",
            number: 3,
            zipCode: "00000-111",
            city: "Brasilia",
            active: true,
            rewardPoints: 0,
        });
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();
        
        expect(async () => {
            await customerRepository.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 4", 3, "00000-111", "Brasilia");
        customer.Address = address;
        customer.addRewardPoints(10);
        customer.activate();

        await customerRepository.create(customer);

        customer.changeName("customer 1 updated");

        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

        expect(customerModel).not.toBeNull();
        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: "customer 1 updated",
            street: "Rua 4",
            number: 3,
            zipCode: "00000-111",
            city: "Brasilia",
            active: true,
            rewardPoints: 10,
        });
    });

    it("should find a customer by id", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "customer 1");
        const address = new Address("Rua 4", 3, "00000-111", "Brasilia");
        customer.Address = address;
        customer.activate();

        await customerRepository.create(customer);

        const customerFound = await customerRepository.find("1");

        expect(customerFound).not.toBeNull();
        expect(customerFound).toStrictEqual(customer);
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("1", "customer 1");
        const address1 = new Address("Rua 4", 3, "00000-111", "Brasilia");
        customer1.Address = address1;
        customer1.activate();

        const customer2 = new Customer("2", "customer 2");
        const address2 = new Address("Rua 5", 3, "00000-111", "Brasilia");
        customer2.Address = address2;
        customer2.activate();

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();
        const customersArray = [customer1, customer2]

        expect(customers).not.toBeNull();
        expect(customers).toEqual(customersArray);
    });
});