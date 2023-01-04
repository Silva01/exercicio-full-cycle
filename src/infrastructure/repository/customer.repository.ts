import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer.repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActivate(),
            rewardPoints: entity.rewardPoints,
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipCode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActivate(),
            rewardPoints: entity.rewardPoints,
        }, {
            where: { id: entity.id },
        });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;

        try {
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }

        const address = new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city);

        const customer = new Customer(customerModel.id, customerModel.name);
        customer.Address = address;
        customer.addRewardPoints(customerModel.rewardPoints);
        
        if(customerModel.active) {
            customer.activate();
        }

        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        return customerModels.map(customerModel => {
            const address = new Address(customerModel.street, customerModel.number, customerModel.zipCode, customerModel.city);
            const customer = new Customer(customerModel.id, customerModel.name);
            customer.Address = address;
            customer.addRewardPoints(customerModel.rewardPoints);

            if(customerModel.active) {
                customer.activate();
            }

            return customer;
        });
    }
}