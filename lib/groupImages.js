
var groupImageStore = new FS.Store.GridFS("group_images");

var createThumb = function(fileObj, readStream, writeStream) {
    // Transform the image into a 10x10px thumbnail
    gm(readStream, fileObj.name()).resize('100', '100').stream().pipe(writeStream);
};

//Product images collection
GroupImages = new FS.Collection("group_images", {
    stores: [
        groupImageStore,
        new FS.Store.GridFS("profile_thumbs", {transformWrite: createThumb})
    ],
    filter: {
        allow: {
            contentTypes: ['image/*'] //allow only images in this FS.Collection
        }
    }
});

