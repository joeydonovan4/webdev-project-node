var User = require('../models/user');

var sessionController = {};

sessionController.login = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username}, (err, user) => {
        if (err) console.log(err);
        if (!user) {
            res.status(404)
                .send({error: 'Username not found'});
        } else {
            user.comparePassword(password, (err, isMatch) => {
                if (err) console.log(err);
                if (isMatch) {
                    req.session['user'] = user;
                    res.send(user);
                } else {
                    res.status(404)
                        .send({error: 'Incorrect password'});
                }
            }); 
        }
    })
};

sessionController.logout = (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.sendStatus(200);
    }
};

sessionController.getCurrentUser = (req, res) => {
    if (req.session['user']) {
        res.send(req.session['user']);
    } else {
        res.sendStatus(401);
    }
};

module.exports = sessionController;