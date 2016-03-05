Groups = new Mongo.Collection("groups");
Groups.attachSchema(Schemas.Groups);

Notifications =  new Mongo.Collection("notifications");
Notifications.attachSchema(Schemas.Notifications);

Items =  new Mongo.Collection("items");
Items.attachSchema(Schemas.Items);

Events = new Mongo.Collection("events");
Events.attachSchema(Schemas.Events);

Events.status = {
    ordering: 'Ordering',
    ordered: 'Ordered',
    delivering: 'Delivering',
    delivered: 'Delivered'
};

