GroupImages.allow({
    insert: function (userId, doc) {
        if (userId)
            return true;
    },
    update: function (userId, doc) {
        if (userId)
            return true;
    },
    download: function (userId, doc) {
        if (userId)
            return true;
    },
    remove: function (userId, doc) {
        if (userId)
            return true;
    }
});

Groups.allow({
    insert: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    },
    update: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    },
    remove: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    }
});

Events.allow({
    insert: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    },
    update: function () {
            return true;
    },
    remove: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    }
});

Notifications.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function (userId, doc) {
        if (doc.owner == userId)
            return true;
    }
});

