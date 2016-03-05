Meteor.methods({
    setUserData: function (userData) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        if (userData) {
            if (userData.userName) {
                Meteor.users.update(this.userId, {
                    $set: {
                        'username': userData.userName,
                        'profile.name': userData.userName
                    }
                });
            }
            if (userData.email) {
                Meteor.users.update(this.userId,
                    {
                        $set: {'emails.0.address': userData.email}
                    });
            }
        }
    },
    addNewItem: function (item) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        if (item) {
            Items.insert({
                    name: item.name,
                    price: item.price,
                    groupId: item.groupId
                }
            );
        }
    },
    addUserOrder: function (userOrder, eventId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        if (userOrder && eventId) {
            Events.update({
                    _id: eventId, 'order': {$elemMatch: {'userId': Meteor.userId()}}
                },
                {$set: {'order.$.items': userOrder}})
        }
    },
    takePart: function (eventId, isTake) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(500, 'Error 500: Authorization needed', 'Authorization needed');
        }
        Events.update({
                _id: eventId, 'order.userId': Meteor.userId()
            },
            {$set: {'order.$.isTake': isTake}});
    }
});



