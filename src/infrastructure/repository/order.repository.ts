
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order.repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
            })),
        }, {
            include: [{ model: OrderItemModel }],
        });
    }

    async update(entity: Order): Promise<void> {
        const order = await OrderModel.findOne(
            { 
                where: { id: entity.id }, 
                include: [{ model: OrderItemModel }], 
                rejectOnEmpty: true 
            });

        const destroyItems = order.items.map( (item: OrderItemModel) => OrderItemModel.destroy({ where: { id: item.id } }));
        await Promise.all(destroyItems);

        const createItems = entity.items.map( (item) => OrderItemModel.create({
            id: item.id,
            order_id: entity.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
        }));

        await Promise.all(createItems);

        await OrderModel.update({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
        }, { where: { id: entity.id } });
    }

    async find(id: string): Promise<Order> {
        const order = await OrderModel.findOne(
            {
                where: { id },
                include: [{ model: OrderItemModel }],
                rejectOnEmpty: true,
            });

        const order_item = order.items.map( (item: OrderItemModel) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));

        return new Order(order.id, order.customer_id, order_item);
    }

    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

        return orders.map(order => {
            const order_item = order.items.map( (item: OrderItemModel) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
            return new Order(order.id, order.customer_id, order_item);
        });
    }

}