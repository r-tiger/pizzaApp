Accounts.onCreateUser(function (options, user) {
    if (user.services) {
        if (options.profile) {
            user.profile = options.profile
        }
        if (user.services.google){
            user.emails = [{address: user.services.google.email, verified: true}];
            user.username = user.services.google.name;
        }

        var service = _.keys(user.services)[0];
        var email = user.services[service].email;
        if (!email) {
            if (user.emails) {
                email = user.emails.address;
            }
        }
        if (!email) {
            email = options.email;
        }
        if (!email) {
            // if email is not set, there is no way to link it with other accounts
            return user;
        }

        // see if any existing user has this email address, otherwise create new
        var existingUser = Meteor.users.findOne({'emails.address': email});
        if (!existingUser) {
            // check for email also in other services
            var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});
            var doesntExist = !existingGoogleUser;
            if (doesntExist) {
                // return the user as it came, because there he doesn't exist in the DB yet
                return user;
            } else {
                existingUser = existingGoogleUser;
                if (existingUser) {
                    if (user.emails) {
                        // user is signing in by email, we need to set it to the existing user
                        existingUser.emails = user.emails;
                    }
                }
            }
        }

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services) {
            existingUser.services = { resume: { loginTokens: [] }};
        }

        // copy accross new service info
        existingUser.services[service] = user.services[service];
        if (user.services.resume && user.services.resume.loginTokens[0]){
            existingUser.services.resume.loginTokens.push(
                user.services.resume.loginTokens[0]
            );
        }

        Meteor.users.remove({_id: existingUser._id}); // remove existing record
        return existingUser;                  // record is re-inserted
    }
});
