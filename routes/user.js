//---------------------------------------------register_final page call------------------------------------------------------
const bcrypt = require('bcryptjs');
exports.register = function(req, res) {
    message = '';
    if (req.method == "POST") {
        var post = req.body;

        const { email, password, first_name, last_name, mob_no } = req.body;
        db.query('Select email FROM users where email = ? ', [email], async(error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('register_final', {
                    message: "Email already registered"
                })
            }

            let hashpassword = await bcrypt.hash(password, 8);
            // console.log(hashpassword);
            var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`email`, `password`) VALUES ('" + first_name + "','" + last_name + "','" + mob_no + "','" + email + "','" + hashpassword + "')";

            var query = db.query(sql, function(err, result) {

                message = 'Succesfully Registered! Your account has been created. Please Login Here';
                res.render('login_final.ejs', { message: message });
            })
        });

    } else {
        res.render('register_final');
    }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res) {
    var message = '';
    var sess = req.session;

    if (req.method == "POST") {
        var post = req.body;
        var email = post.email;
        var password = post.password;
        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
            // console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                message = 'Wrong Credentials.';
                res.render('login_final.ejs', { message: message });
            } else {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                // console.log(results[0].id);
                res.redirect('/home/profile');
            }
        });

    } else {
        res.render('login_final.ejs', { message: message });
    }

};

//------------------------------------logout functionality----------------------------------------------
exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/login");
    })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res) {

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function(err, result) {
        message = "";
        res.render('profile.ejs', { data: result });
    });
};

//---------------------------------------------Donation page call------------------------------------------------------
exports.donation = function(req, res) {
    message = '';
    var user = req.session.user,
        userId = req.session.userId;
    if (req.method == "POST") {
        var post = req.body;
        var amount = post.amount;

        // console.log(amount);

        var sql1 = "SELECT * from users where id='" + userId + "'";
        var query = db.query(sql1, function(err, result) {
            // console.log(result[0].amount);
            var amount1 = Number(result[0].amount) + Number(amount);
            // console.log(amount1);
            var sql = "UPDATE users SET amount='" + amount1 + "' WHERE id='" + userId + "'";
            var query = db.query(sql, function(err, result) {
                // res.redirect('/home/profile');
            });
            var sql2 = "SELECT * from users where id='" + userId + "'";
            var query = db.query(sql2, function(err, result_data) {
                message = 'Thank You So Much For Your Donation.';

                res.render('profile.ejs', { data: result_data, message: message });
            });

        });
    } else {
        res.render('register_final');
    }
};