import EventInterface from "../@shared/event.interface";

export default class ProductCreatedEvent implements EventInterface { 
    dateTimeOccurred: Date;
    eventData: any;
    eventName: string;

    constructor(eventData: any) {
        this.dateTimeOccurred = new Date();
        this.eventData = eventData;
        this.eventName = "ProductCreated";
    }
}