const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        unique: true
    },
    mobileNo: {
        type: String,
        required: true,
        match: /^[6-9][0-9]{9}$/ 
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
},
{
    timestamps: true 
});

userSchema.pre('save', function(next) {
    let self = this;
    bcrypt.hash(self.password, 10)
    .then((password) => {
        self.password = password;
        next();
    })
    .catch(err => next(err));    
})
userSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate(); 
    const errors = {};
    Object.keys(update.$set || {}).forEach(key => {
        const fieldValue = update.$set[key];
        const schemaPath = this.schema.paths[key];
        if (!schemaPath) {
            errors[key] = `Field '${key}' does not exist in the schema.`;
        }
        if (schemaPath.instance === 'String' && schemaPath.isRequired) {
            if (!fieldValue || fieldValue.trim() === '') {
                errors[key] = `Field '${key}' is required.`;
            }
        }
        if (schemaPath.options.match instanceof RegExp) {
            if (!schemaPath.options.match.test(fieldValue)) {
                errors[key] = `Field '${key}' does not match the required pattern.`;
            }
        }
    });
    if (Object.keys(errors).length > 0) {
        return next({ errors });
    }
    if (Object.keys(update.$set).includes('password') && update.$set.password) {
        return bcrypt.hash(10, update.$set.password)
        .then((hashedPassword) => {
            update.$set.password = hashedPassword;
            return next();
        })
        .catch(err => {
            return next(err);
        })
    }

    next();
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
    .then((isMatch) => {
        return isMatch;
    })
    .catch(err => {
        return err;
    })
}

module.exports = mongoose.model('User', userSchema)