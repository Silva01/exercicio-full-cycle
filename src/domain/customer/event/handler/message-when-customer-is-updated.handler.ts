import EventHandlerInterface from "../../../@shared/event/event.handler.interface";
import CustomerChangedEvent from "../customer-change-event";

export default class MessageWhenCustomerIsUpdatedHandler implements EventHandlerInterface<CustomerChangedEvent> {
    handle(event: CustomerChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} 
        alterado para: ${event.eventData['address']['street']}, 
        ${event.eventData.address.number}, ${event.eventData.address.zip}, ${event.eventData.address.city}`);
    }
}