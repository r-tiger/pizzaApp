Template.event.events({
    'click #buttonYes':function (e) {
        e.preventDefault();
        var eventId=  Router.current().params.eventId;
        Meteor.call("takePart", eventId, true, function (err) {
            if (!err) {
                toastr.success("Success");
            } else {
                toastr.error(JSON.stringify(err))
            }
        });
    },
    'click #buttonNo':function (e) {
        e.preventDefault();
        var eventId=  Router.current().params.eventId;
        Meteor.call("takePart", eventId, false, function (err) {
            if (!err) {
                toastr.success("Success");
            } else {
                toastr.error(JSON.stringify(err))
            }
        });
    }
});

Template.event.helpers({
    isTakePart: function () {
       var order= Events.findOne({},{fields:{'order.userId': 1, 'order.isTake':1}}).order;
        var user;
        if (order) {
            var res = order.some(function (elem) {
                if (elem.userId == Meteor.userId()) {
                    return user = elem;
                }
                return false;
            });
        }
        if (user&&user.isTake) {
            return user;
        }else if(user.isTake==undefined){
            return false;
        }else return res;
    }
});

Template.userOrder.events({
    'click #addItem': function (e) {
        e.preventDefault();
        openAddItemDialog();
    },
    'click .addCoupon': function (e) {
        e.preventDefault();
        openAddCouponDialog();
    },
    'click #removeDiscount': function (e) {
        var eventId=  Router.current().params.eventId;
        Events.update({_id: eventId}, {$pull: {discount:{itemId: this.itemId}}});
    },

    'click .purchaseOrder': function (e) {
        e.preventDefault();
        var arr = [];
        var productChecked = $('#purchasingList tbody tr');
        productChecked.each(function () {
            var id = $(this).find(".checkbox-order input:checked:enabled").attr('id');
            var qty = $(this).find(".qty input").val();
            if (id && qty) {
                arr.push({
                    itemId: id,
                    qty: qty
                });
            }
        });
        if(arr==0){
            toastr.info("Check items please!!!");
        }
        else{
            var eventId = Router.current().params.eventId;
            Meteor.call("addUserOrder", arr, eventId, function (err) {
                if (!err) {
                    toastr.success("Success");
                } else {
                    toastr.error(JSON.stringify(err))
                }
            });
        }
    },
    'click .changeStatus': function (e) {
        e.preventDefault();
        var eventId =  Router.current().params.eventId;
        var event = Events.findOne(eventId);
        var status = $('select[name=statusOrder] option:selected').val();
        Events.update({_id:eventId},{$set:{status:status}},function (err) {
            if (err) {
                toastr.error(err);
            } else {
                for(var i=0; i<event.order.length; i++){
                    Notifications.insert({
                        text: "Your event "+event.name+ " now in status: " + status,
                        owner: event.order[i].userId
                    });
                }
                toastr.success("Success");
            }
        })
    }
});


Template.userOrder.helpers({
    items: function () {
        var items = Items.find();
        if (items) {
            return items;
        }
        else return [];
    },
    itemsSettings: function () {
        return {
            rowsPerPage: 10,//settings for table
            showFilter: false,
            showNavigation: 'auto',
            //table data
            fields: [
                {
                    key: 'checkbox-order', label: function () {
                    return new Spacebars.SafeString("Check");
                }, fn: function (value, object) {
                    return new Spacebars.SafeString('<input type="checkbox" class="checkboxElement" id=' + object._id + '> ');
                }
                },
                {
                    key: 'qty', label: 'Qty', fn: function (value, obj) {
                    return new Spacebars.SafeString('<input type="number" min="0"> ');
                }
                },
                {key: 'name', label: 'Name'},
                {key: 'price', label: 'Price'}
            ]
        };
    },
    discount: function () {
        var event = Events.findOne();

        if (event && event.discount) {
            var discount =event.discount;
            for(var i=0; i<discount.length; i++){
                discount[i].name= Items.findOne(discount[i].itemId).name;
            }
                return discount;
        }
        else return [];
    },
    isUserOrdered: function(){
        var order= Events.findOne().order;
        var user;
        if (order) {
            order.some(function (elem) {
                if (elem.userId == Meteor.userId()) {
                    return user = elem;
                }
                return false;
            });
        }
        if (user && user.items) {
            return user;}
        else return false;
    },
    isAllOrdered: function(){
        var order= Events.findOne();
        if (order.status != Events.status.ordering){
            return true;
        }
    },
    isOwner: function () {
        var group = Groups.findOne();
        return Meteor.userId() == group.owner;
    },
    orderResult: function() {
        var order= Events.findOne().order;
        var result = order.filter(function (obj) {
            return obj.userId == Meteor.userId();
        })[0];
        return result;
    },
    eventResult: function(){
        var event = Events.findOne();
        var order = event.order;
        var arr = [];
        for (var i =0; i<order.length; i++){
            if (order[i].isTake){
                order[i].name= Meteor.users.findOne(order[i].userId).username;
                arr.push(order[i])
            }
        }
        event.order=arr;
        return event;
    },
    status:function(){
        return [
            {name:Events.status.delivering},
            {name:Events.status.delivered}
        ];
    }
});


Template.addCoupon.helpers({
    items: function () {
        var items = Items.find();
        if (items) {
            return items;
        }
        else return [];
    }
});

function openAddItemDialog() {

    var shareDialogInfo = {
        template: Template.addNewItem,
        title: "Add new Item",
        removeOnHide: true, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Add'
            }

        }
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function (button) {
        var group = Groups.findOne();
        var name = $("#inputNameItem").val();
        var price = $("#inputPriceItem").val();
        if (name && price) {
            var item = {
                name: name,
                price: price,
                groupId: group._id
            };
            Meteor.call("addNewItem", item, function (err) {
                if (!err) {
                    toastr.success("Success");
                } else {
                    toastr.error(JSON.stringify(err))
                }
            });
        }
    });
    rd.show();
}

function openAddCouponDialog() {

    var shareDialogInfo = {
        template: Template.addCoupon,
        title: "Add new Item",
        removeOnHide: true, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Add'
            }

        }
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function (button) {
        var itemId = $('select[name=item] option:selected').attr("id");
        var percent = $("#inputDiscount").val();
        var eventId = Router.current().params.eventId;
        if(itemId && percent){
            Events.update({_id:eventId},{$push:{discount:{itemId:itemId, percent:percent}}});
        }

    });
    rd.show();
}