Meteor.publish('GroupImages', function(){
    if (!this.userId) {
        return [];
    }
    return GroupImages.find();
});

Meteor.publish('Notifications', function(){
    if (!this.userId) {
        return [];
    }
    return Notifications.find({owner:this.userId});
});

Meteor.publish('Groups', function(){
    if (!this.userId) {
        return [];
    }
    return Groups.find({usersId:this.userId});
});

Meteor.publish('group', function(id){
    if (!this.userId) {
        return [];
    }
    var items = Items.find({groupId:id});
    var events = Events.find({groupId:id});
    return [Groups.find(id), Meteor.users.find({},{fields:{username:1}}), items, events];
});

Meteor.publish('event', function(groupId, eventId){
    if (!this.userId) {
        return [];
    }
    var items = Items.find({groupId:groupId});
    var events = Events.find({_id:eventId});

    return [Groups.find(groupId), Meteor.users.find({},{fields:{username:1}}), items, events];
});
