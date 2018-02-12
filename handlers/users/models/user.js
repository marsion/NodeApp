const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const hash = require('../libs/hash');

const userSchema = new Schema({
    login: {
        type: String,
        required: 'Login is required!',
        unique: 'Login is already taken!',
        trim: true,
        validate: [
            {
                validator: value => {
                    return /^[a-zA-Z0-9_-]{4,20}$/.test(value);
                },
                msg: 'Login can only contain 4-20 alphanumeric characters, "-" and "_"!'
            }
        ]
    },
    displayName: {
        type: String,
        required: 'Display name is required!',
        trim: true,
        validate: [
            {
                validator: value => {
                    return /^.{4,20}$/.test(value);
                },
                msg: 'Display name can contain any 4-20 characters!'
            }
        ]
    },
    email: {
        type: String,
        required: 'Email is required!',
        unique: 'Email is already taken!',
        lowercase: true,
        trim: true,
        validate: [
            {
                validator: value => {
                    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
                },
                msg: 'Invalid email!'
            }
        ]
    },
    gender: {
        type: String,
        enum: {
            values:  ['M', 'F'],
            message: 'Unknown value for gender!'
        }
    },
    state: {
        type: String,
        validate: [
            {
                validator: value => {
                    return /^[a-zа-яA-ZА-Я -]{2,30}$/.test(value);
                },
                msg: 'State must contain only 2-30 alphabetic characters, whitespaces and "-"!'
            }
        ]
    },
    city: {
        type: String,
        validate: [
            {
                validator: value => {
                    return /^[a-zа-яA-ZА-Я -]{2,30}$/.test(value);
                },
                msg: 'City must contain only 2-30 alphabetic characters, whitespaces and "-"!'
            }
        ]
    },
    role: {
        type: String,
        enum: {
            values: ['Admin', 'User', 'Moderator'],
            message: 'Unknown value for role!'
        },
        default: 'User',
        required: 'Role is required!'
    },
    isConfirmed: {
        type: Boolean,
        required: 'Email confirmation status is required!'
    },
    confirmEmailToken: {
        type: String
    },
    confirmEmailTokenExpiresAt: {
        type: Date
    },
    changePasswordToken: {
        type: String
    },
    changePasswordTokenExpiresAt: {
        type: Date
    },
    passwordHash: {
        type: String
    },
    salt: {
        type: String
    },
    providers : [{
        providerName: String,
        providerId:  {
            type:  String,
            index: true
        },
        profile: {}
    }]
}, {
    timestamps: true
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

userSchema
    .virtual('password')
    .get(function() { return this._realPassword })
    .set(function(password) {
        if(!password) { this.invalidate('password', 'Password must not be empty!'); }
        if(password.length < 4) { this.invalidate('password', 'Password must not be less than 4 characters!'); }

        this._realPassword = password;
        
        this.salt = hash.getSalt();
        this.passwordHash = hash.getPasswordHash(password, this.salt);
    });

userSchema.methods.checkPassword = function(password) {
    if(!password) return false;
    if(!this.passwordHash) return false;

    return this.passwordHash == hash.getPasswordHash(password, this.salt);
};

userSchema.methods.getPublicFields = function() {
    return {
        login: this.login,
        displayName: this.displayName,
        email: this.email,
        gender: this.gender,
        state: this.state,
        city: this.city,
        role: this.role,
        isConfirmed: this.isConfirmed
    }
};

userSchema.methods.isAdmin = function() {
    return this.role === 'Admin';
};

userSchema.plugin(beautifyUnique);

userSchema.statics.publicFields = ['login', 'displayName', 'email', 'gender', 'state', 'city', 'role', 'isConfirmed'];

module.exports = mongoose.model('User', userSchema);
