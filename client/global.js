Meteor.subscribe('GroupImages');
Meteor.subscribe('Notifications');

getImageUrl = function(img, thumbnail){
    if (!img){
        return '/image/noImage.jpg';
    }
    if (typeof img === 'object'){
        try{
            var url = img.url();

            if (!url || url === '/undefined'){
                return '/image/noImage.jpg';
            }
            if (thumbnail){
                return img.url({store:'profile_thumbs'});
            }
            return img.url();
        }
        catch(err) {
            return '/image/noImage.jpg';
        }
    }else{
        if(img === 'undefined'){
            return '/image/noImage.jpg';
        }

        return '/'+img;
    }
};

Handlebars.registerHelper('getImageUrl', function (img) {
    return getImageUrl(img);
});