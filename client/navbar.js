Template.navbar.events({
    'click #menu-toggle': function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click #createGroup':function (e) {
        e.preventDefault();
        openGroupDialog();
    }
});

Template.groupEdit.onCreated(function () {
    Session.set('uploadedFile',undefined);
});

Template.groupEdit.onDestroyed(function () {
    Session.set('uploadedFile',undefined);
});

Template.groupEdit.events({
'change .FileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
        file.date	= new Date();
        file.owner = Meteor.userId();
        GroupImages.insert(file, function (err, fileObj) {
            if (err){
                toastr.error(err);
            } else {
                // handle success depending what you need to do
               Session.set('uploadedFile',fileObj);
            }
        });
    });
}
});


Template.notifications.helpers({
    notifications:function(){
        return Notifications.find();
    }
});

Template.notifications.events({
    'click .remove-notification': function (e) {
        e.preventDefault();
        Notifications.remove(this._id, function (err) {
            if (err) toastr.error(err);
        })
    }

});




function openGroupDialog() {

    var shareDialogInfo = {
        template: Template.groupEdit,
        title: "Group",
        removeOnHide: true, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            }
        }
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function (button) {
        // what needs to be done after click ok.

        var name = $("#inputName").val();
        var img = Session.get('uploadedFile');
        if (name && img) {
            var file = {
                name:name,
                logo:img,
                owner: Meteor.userId(),
                usersId:[Meteor.userId()]
            };
            Groups.insert(file, function (err) {
                if (err){
                    toastr.error(err);
                } else {
                    toastr.success("Success");            }
            })
        }

    });
    rd.show();

}