//ROUTER CONFIGURATION file
Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function () {
    this.route('index', {
        path: '/',
        waitOn: function () {
            if (Meteor.userId()) {
                return Meteor.subscribe('Groups');
            }
        }
    });

});


Router.onBeforeAction(function () {
    if (this.route.getName() === 'index') {
        this.next();
        return;
    }
    var currUser = Meteor.user();
    if (currUser == null) {
        currUser = undefined;
    }

    if (!currUser) {
        this.redirect('index');
        this.next();
    }
    else {
        this.next();
    }
});

Router.map(function () {
    this.route('profile', {
        path: '/profile'
    });
    this.route('room', {
        path: '/group/:id',
        waitOn: function () {
            return Meteor.subscribe('group', this.params.id);
        }
    });
    this.route('event', {
        path: '/group/:id/:eventId',
        waitOn: function () {
            return Meteor.subscribe('event', this.params.id, this.params.eventId);
        }
    });

});
