import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "./event-dispatcher";

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
        eventDispatcher.notify({ dateTimeOccurred: new Date(), eventData: {}, eventName: "ProductCreatedEvent" });

        expect(spyEventHandle).toHaveBeenCalled();        
    });
});