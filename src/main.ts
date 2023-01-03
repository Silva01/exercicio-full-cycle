import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

let customer = new Customer("123", "Daniel Silva");
const address = new Address("Rua 4", 3, "12345-678", "Distrito Federal");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "item 1", 10);
const item2 = new OrderItem("2", "item 2", 15);
const order = new Order("1", "123", [item1, item2]);