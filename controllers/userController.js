
const user = require('../models/user');
const generateToken = require('../middlewares/token')
const Joi = require('joi');

module.exports.signUp = (req, res, next) => {
    const newUser = new user(req.body);
    newUser.save()
    .then((userData) => {
        res.status(201).json(userData);
    })
    .catch(err => {
        return next(err);
    })
}
module.exports.login = (req, res, next) => {
    const {email, password} = req.body;
    user.findOne({email})
    .then((memData) => {
        if (!memData) {
           return  res.status(404).send({"message": "Member not found ", "stausCode": 401})
        }
        memData.comparePassword(password)
        .then((isMatch) => {
            if (!isMatch) {
               return res.status(401).send({message: "Invalid password"})
            }
            memData.token = generateToken.generateToken(memData._id)
            res.json({token: memData.token, memberId: memData._id})
           
        })   
    })
    .catch(err => {
        return next(err);
    })

}
module.exports.updateUser = (req, res, next) => {
    const{memberId} = req.params;
    user.findById(memberId)
    .then((memData) => {
        if (!memData) {
            return res.status(404).send({"message": `Member not found with ${memberId}` , "stausCode": 400})
        }
        user.findOneAndUpdate({_id:memberId},{$set: req.body}, {new: true})
        .then((updatedData) => {
            return res.json(updatedData)
            })
            .catch(err => {
                return next(err);
            })
    })
    .catch(err => {
        return next(err);
    })
}
module.exports.deleteUser = (req, res, next) => {
    const{memberId} = req.params;
    user.findByIdAndDelete(memberId)
    .then((memData) => {
        return res.send({"message": "deleted successfully"})
    })
    .catch(err =>  {return next(err)});

}
