const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var dailyExerciseEventSchema = new mongoose.Schema({
    ex_name: {
        type: String
    },
    date: {
        type: String
    },
    isComplete: {
        type: Boolean,
        default: true
    },
    calender: {
        type: ObjectId,
        ref: "Calender"
    },
    exercise: [{
        type: ObjectId,
        ref: "Exercise"
    }]
});

module.exports = mongoose.model("DailyExerciseEvent", dailyExerciseEventSchema);