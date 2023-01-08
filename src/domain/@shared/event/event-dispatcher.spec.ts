import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created-event";
import EventDispatcher from "./event-dispatcher";
import CustomerCreatedEvent from "../../customer/event/customer-created-event";
import CustomerChangedEvent from "../../customer/event/customer-change-event";

describe("Domain events tests", () => {
    it("shouldt register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers()["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers()["ProductCreatedEvent"]).toHaveLength(1);
        expect(eventDispatcher.getEventHandlers()["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("shouldt unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers()["ProductCreatedEvent"]).toHaveLength(0);
    });

    it("shouldt unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers()).toMatchObject({});
    });

    it("shouldt notify an event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandle = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandle).toHaveBeenCalled();        
    });
    
    it("shouldt notify customer created event with 2 handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();

        const spyEventHandle = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEventHandle2 = jest.spyOn(enviaConsoleLog2Handler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            address: {
                number: "1",
                street: "Rua 1",
                neighborhood: "Bairro 1",
                city: "Cidade 1",
                state: "Estado 1",
                zip: "00000-000",
            }
            
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandle).toHaveBeenCalled();
        expect(spyEventHandle2).toHaveBeenCalled();
    });

    it("shouldt notify customer created event with 2 handlers and unregister one", () => {
        const eventDispatcher = new EventDispatcher();
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();

        const spyEventHandle = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEventHandle2 = jest.spyOn(enviaConsoleLog2Handler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

        eventDispatcher.unregister("CustomerCreatedEvent", enviaConsoleLog1Handler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            address: {
                number: "1",
                street: "Rua 1",
                neighborhood: "Bairro 1",
                city: "Cidade 1",
                state: "Estado 1",
                zip: "00000-000",
            }
            
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandle).not.toHaveBeenCalled();
        expect(spyEventHandle2).toHaveBeenCalled();
        expect(eventDispatcher.getEventHandlers()["CustomerCreatedEvent"]).toHaveLength(1);
    });

    it("shouldt notify customer created event with 2 handlers and unregister all", () => {
        const eventDispatcher = new EventDispatcher();
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();

        const spyEventHandle = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEventHandle2 = jest.spyOn(enviaConsoleLog2Handler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

        eventDispatcher.unregisterAll();

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            address: {
                number: "1",
                street: "Rua 1",
                neighborhood: "Bairro 1",
                city: "Cidade 1",
                state: "Estado 1",
                zip: "00000-000",
            }
            
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandle).not.toHaveBeenCalled();
        expect(spyEventHandle2).not.toHaveBeenCalled();
        expect(eventDispatcher.getEventHandlers()).toMatchObject({});
    });

    it("shouldt notify when change customer address", () => {
        const eventDispatcher = new EventDispatcher();
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();

        const spyEventHandle = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEventHandle2 = jest.spyOn(enviaConsoleLog2Handler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            address: {
                number: "1",
                street: "Rua 1",
                neighborhood: "Bairro 1",
                city: "Cidade 1",
                state: "Estado 1",
                zip: "00000-000",
            }
            
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandle).toHaveBeenCalled();
        expect(spyEventHandle2).toHaveBeenCalled();

        const customerAddressChangedEvent = new CustomerChangedEvent({
            id: "1",
            name: "Customer 1",
            address: {
                number: "2",
                street: "Rua 2",
                neighborhood: "Bairro 2",
                city: "Cidade 2",
                state: "Estado 2",
                zip: "00000-000",
            }
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandle).toHaveBeenCalled();
        expect(spyEventHandle2).toHaveBeenCalled();
    });
});