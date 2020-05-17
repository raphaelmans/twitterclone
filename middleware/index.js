var User = require('../models/user');


var middlewareObj ={


};



middlewareObj.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("err","Please Login First");
    res.redirect('/');
}



module.exports = middlewareObj;
