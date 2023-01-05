import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([OrderModel, CustomerModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order" , async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "customer 1");
        const address = new Address("street 1", 12, "state 1", "country 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderCreated = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        console.log(orderCreated);

        expect(orderCreated).not.toBeNull();
        
        expect(orderCreated.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    order_id: "123",
                    product_id: "123",
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                }
            ]
        });
    });

    it("should update an order" , async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "customer 1");
        const address = new Address("street 1", 12, "state 1", "country 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        
        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderCreated = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderCreated).not.toBeNull();

        const product2 = new Product("456", "product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 3);
        order.addItem(orderItem2);

        await orderRepository.update(order);

        const orderUpdated = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });

        expect(orderUpdated).not.toBeNull();

        expect(orderUpdated.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    order_id: "123",
                    product_id: "123",
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                },
                {
                    id: orderItem2.id,
                    order_id: "123",
                    product_id: "456",
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                }
            ]
        });
    });

    it("shouldt find an order" , async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "customer 1");
        const address = new Address("street 1", 12, "state 1", "country 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderFound = await orderRepository.find(order.id);

        expect(orderFound).not.toBeNull();

        expect(orderFound).toStrictEqual(order);
    });

    it("should find all orders" , async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "customer 1");
        const address = new Address("street 1", 12, "state 1", "country 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);


        const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);
        const order2 = new Order("456", customer.id, [orderItem2]);
        await orderRepository.create(order2);

        const ordersFound = await orderRepository.findAll();

        expect(ordersFound).not.toBeNull();

        expect(ordersFound).toHaveLength(2);
        expect(ordersFound).toStrictEqual([order, order2]);
    });
});