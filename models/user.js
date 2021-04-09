const mongoose = require("mongoose"),
    { Schema } = require("mongoose"),
    Subscriber = require("./subscriber"),
    Course = require("./course"),
    userSchema = new Schema(

    {
        name: {
            first: {
                type: String,
                required: true
            },
            last: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        zipCode: {
            type: Number,
            min: [10000, "Zip code too short"],
            max: 99999
        },
        password: {
            type: String,
            required: true
        },
        courses: [{type: Schema.Types.ObjectId, ref: Course}],
        subcribedAccount: {type: Schema.Types.ObjectId, ref: Subscriber}

    },
    {
        timestamps: true
    }

    )

userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) {
    let user = this;
    if(user.subcribedAccount == undefined) {
        Subscriber.findOne({
            email: user.email
        })
        .then(subscriber => {
            user.subcribedAccount = subscriber;
            next();
        })
        .catch(error => {
            console.log(`error in associated subscriber: ${error.message}`);
            next(error);
        })   
    }
    else {
        next();
    }
});

module.exports = mongoose.model("User", userSchema);