Events.after.update(function (userId, doc) {
    if (doc.status == Events.status.ordering) {
        var order = doc.order;
        var isOrdered = true;
        order.forEach(function (user) {
            if (!user.items && user.isTake === undefined ) isOrdered = false;
        });
        if (isOrdered) {
            var discount = doc.discount;
            var total = 0;
            order.forEach(function (user) {
                if (user.isTake) {
                    var userTotal = 0;
                    var items = user.items;
                    for (var i = 0; i < items.length; i++) {
                        var itemDb = Items.findOne(items[i].itemId);
                        var price = itemDb.price;
                        var result = discount.filter(function (obj) {
                            return obj.itemId == items[i].itemId;
                        });
                        //for calculate discount
                        var prc = 0;
                        if (result != 0) {
                            prc = result[0].percent;
                        }
                        items[i].price = Math.round(price * (100 - prc) * items[i].qty) / 100;
                        items[i].name = itemDb.name;
                        userTotal += items[i].price;
                    }
                    user.total = Math.round(userTotal * 100) / 100;
                    total += userTotal;
                }
            });
            Events.update({
                    _id: doc._id
                },
                {
                    $set: {
                        'status': Events.status.ordered,
                        total: Math.round(total * 100) / 100,
                        order: order
                    }
                });
            //send emails
            for (var i = 0; i < order.length; i++) {
                if (order[i].isTake) {
                    sendEmailTemplate(doc.groupId, doc._id, order[i].userId);
                }
            }
        }
    }
});

function sendEmailTemplate(groupId, eventId, userId) {
    var email = Meteor.users.findOne(userId).emails[0].address;
    SSR.compileTemplate('emailText', Assets.getText('html-email.html'));
    Template.emailText.helpers({
        orderResult: function () {
            var order = Events.findOne(eventId).order;
            var result = order.filter(function (obj) {
                return obj.userId == userId;
            })[0];
            return result;
        },
        isOwner: function () {
            var group = Groups.findOne(groupId);
            return userId == group.owner;
        },
        eventResult: function () {
            var event = Events.findOne(eventId);
            var order = event.order;
            var arr = [];
            for (var i = 0; i < order.length; i++) {
                if (order[i].isTake) {
                    order[i].name = Meteor.users.findOne(order[i].userId).username;
                    arr.push(order[i])
                }
            }
            event.order = arr;
            return event;
        }
    });
    Email.send({
        to: email,
        from: "r-tiger@mail.ru",
        subject: "PizzaApp",
        html: SSR.render("emailText")
    });
}