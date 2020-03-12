//creating the model for username
var Schema = mongoose.Schema;

var userInit = new Schema({
    username: {
        type: String, 
        required: true
    },
    userId: Number
});

var exerciseLog = new Schema({
    userId: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },  
    duration: {
        type: Number,
        required: true
    },
    date: Number
});

module.exports = mongoose.model("new user", userSchema);
module.exports = mongoose.model("add exercise", addExerciseSchema);
