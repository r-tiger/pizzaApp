
Template.profile.helpers({
    currentUser:function(){
        var currentUser = Meteor.user();
        if(currentUser) return currentUser;
    }
});

Template.profile.events({
    'click #save':function(){
        var user={};
        var userName = $('#userName').val();
        var email = $('#email').val();

        if(userName) user.userName=userName;
        if(email) user.email=email;

        Meteor.call("setUserData", user, function (err) {
            if (!err) {
                toastr.success("Success");
            } else {
                toastr.error(JSON.stringify(err))
            }
        })
    }
});

