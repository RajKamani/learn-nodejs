const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    const token  =  req.headers["auth-token"];
    if(!token) return res.status(400).json({err:"Not Authorized Login first."});

    try {
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) res.status(403).json({err: "token not matched."});
            req.user = user; 
            console.log(req.user)
           
        })
    } catch (error) {
        if(err) res.status(403).json({err: "invalid token"});
    
    }
    next();

}