Schemas = function(){};

Schemas.Groups = new SimpleSchema({
    name: {
        type: String,
        label: 'Group Name'
    },
    logo: {
        type: FS.File,
        label: 'Logo'
    },
    owner: {
        type: String,
        label: 'Owner'
    },
    usersId:{
        type:[String],
        label:'Users',
        optional:true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});

Schemas.Notifications = new SimpleSchema({
    text: {
        type: String,
        label: 'Text'
    },
    owner: {
        type: String,
        label: 'Owner'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});


Schemas.Items = new SimpleSchema({
    name: {
        type: String,
        label: 'Name'
    },
    price: {
        type: String,
        label: 'Price'
    },
    groupId:{
        type: String,
        label: 'Group'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});

Schemas.Events = new SimpleSchema({
    name: {
        type: String,
        label: 'Name'
    },
    groupId:{
        type: String,
        label: 'Group'
    },
    order:{
        type:[Object],
        label: 'Order',
        blackbox: true,
        optional:true
    },
    discount:{
        type:[Object],
        label: 'Discount',
        blackbox: true,
        optional:true
    },
    status: {
        type: String,
        label: 'Status'
    },
    total: {
        type: String,
        label: 'Total',
        optional:true
    },
    owner: {
        type: String,
        label: 'Owner'
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});


