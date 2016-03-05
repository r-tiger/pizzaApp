Meteor.startup(function(){
    Accounts.loginServiceConfiguration.remove({"service": "google"});
    Accounts.loginServiceConfiguration.insert({
        "service": "google",
        "clientId" : "482827760768-ke5qiqg219ds91slo2tatk7b2himhmdp.apps.googleusercontent.com",
        "secret" : "xLkbYs1us1Hlp1ERgWQ00liV",
        "loginStyle" : "popup"
    });
    //email config
    process.env.MAIL_URL = "smtp://postmaster%40sandbox790d991ef53047d9824428b664ae2c14.mailgun.org:613a6ba22af1e553378ef76f758d0bd9@smtp.mailgun.org:587";
});