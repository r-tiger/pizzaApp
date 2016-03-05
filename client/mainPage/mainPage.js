Template.mainPage.helpers({
   groups:function(){
       return Groups.find().fetch();
   },
    isOwner:function(id){
        return Meteor.userId()===id;
    }
});

Template.mainPage.events({
    'click .list-group-image':function (e) {
        e.preventDefault();
        if (e.target.className == "fa fa-lg fa-trash-o fa-group-remove") {
            openGroupDelDialog(this);
            return false;
        }
        var url = "/group/" + this._id;
       Router.go(url);
    }
});

Template.mainPage.onRendered(function () {
    $('[data-toggle="tooltip"]').tooltip();
});



function openGroupDelDialog(doc) {

    var shareDialogInfo = {
        template: Template.delGroup,
        title: "Group:"+doc.name,
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

        },
        doc: doc
    };

    var rd = ReactiveModal.initDialog(shareDialogInfo);

    rd.buttons.ok.on('click', function (button) {
        // what needs to be done after click ok.
            Groups.remove(doc._id, function (err) {
                if (err){
                    toastr.error(err);
                } else {
                    toastr.success("Success removed");
                }
            })
    });

    rd.show();

}