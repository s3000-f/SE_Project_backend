var firebase = require('../firebase-config');
var {User} = require('../models/users.model')
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
exports.notification = async function (user, message, title) {
    let token = (await User.findOne({name: user})).firebase_token
    console.log(token);
    if(token){
        var msg = {
            "webpush": {
                "notification": {
                    title: title,
                    message: message,
                    "actions": [
                        {
                            action: "proposalUpdated",
                            title: "Go to URL"
                        }
                    ]
                },
            },
            token: token
        };
        return firebase.admin.messaging().send(msg)
        const options = notification_options

        firebase.admin.messaging().sendToDevice(token, msg, options)
            .then((response) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    }else{
        return false;
    }

};
