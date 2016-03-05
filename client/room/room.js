Template.room.events({
    'click #addUserMenu': function (e) {
        e.preventDefault();
        openAddUsersDialog();
    },
    'click #addEventMenu': function (e) {
        e.preventDefault();
        openAddEventDialog();
    },
    'click .eventMenu': function (e) {
        e.preventDefault();
        var url = "/group/" + this.groupId+'/'+this._id;
        Router.go(url);
    }
});

Template.room.helpers({
    isOwner: function () {
        var group = Groups.findOne();
        return Meteor.userId() == group.owner;
    },
    eventsGroup: function () {
        var events = Events.find();
        return events;
    }
});


Template.addUsers.helpers({
    users: function () {
        var group = Groups.findOne();
        var ids = [];
        if (group.usersId) ids = group.usersId;
        var users = Meteor.users.find({_id: {$nin: ids}}).fetch();
        return users;
    },
    usersInGroup: function () {
        var ids = Groups.findOne().usersId;
        if (ids) return Meteor.users.find({_id: {$in: ids}}).fetch();
    }
});

Template.addUsers.events({
    'click #removeUser': function (e) {
        e.preventDefault();
        var self =this;
        var group = Groups.findOne();
        Groups.update({_id: group._id}, {$pull: {usersId: this._id}}, function (err) {
            if (err) {
                toastr.error(err);
            } else {
                Notifications.insert({
                    text: 'You removed from group: ' + group.name,
                    owner: self._id
                });
                toastr.success("Success");
            }
        })
    }
});

Template.mainRoom.events({
    'click .list-group-item': function (e) {
        e.preventDefault();
        var url = "/group/" + this.groupId+'/'+this._id;
        Router.go(url);
    }
});

Template.mainRoom.helpers({
    eventsGroup: function () {
        var events = Events.find();
        return events;
    }
});

function openAddUsersDialog(doc) {

    var shareDialogInfo = {
        template: Template.addUsers,
        title: "Select user You want to add to the group",
        removeOnHide: true, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Close'
            },
            "ok": {
                closeModalOnClick: false, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Add'
            }

        },
        doc: doc
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function (button) {
        // what needs to be done after click ok.
        var userId = $('select[name=users] option:selected').attr("id");
        var group = Groups.findOne();
        Groups.update({_id: group._id}, {$push: {usersId: userId}}, function (err) {
            if (err) {
                toastr.error(err);
            } else {
                Notifications.insert({
                    text: 'You now in group: ' + group.name,
                    owner: userId
                });
                toastr.success("Success");
            }
        })
    });
    rd.show();
}

function openAddEventDialog() {

    var shareDialogInfo = {
        template: Template.addEvent,
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
        var name = $("#inputNameEvent").val();
        if (name) {
            var order =[];
            for(var i=0; i<group.usersId.length; i++){
                order.push({userId:group.usersId[i]})
            }
            Events.insert({name: name, groupId: group._id, owner: Meteor.userId(), status:Events.status.ordering, order:order}, function (err) {
                if (err) {
                    toastr.error(err);
                } else {
                    toastr.success("Success");
                    for(var i=0; i<group.usersId.length; i++){
                        Notifications.insert({
                            text: 'You can take part in new event: ' + name,
                            owner: group.usersId[i]
                        });
                    }

                }
            })
        }
    });
    rd.show();
}