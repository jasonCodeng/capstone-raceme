var mongoose = require('mongoose'),
    moment = require('moment');

var healthSchema = mongoose.Schema({
    bloodType: String,
    biologicalSex: String,
    totalFlights: Number,
    incrementsOfFlightsForEachDay: [String],
    totalFlightsForEachDayOfYear: [String],
    totalWalkRunDistance: Number,
    incrementsOfWalkRunDistanceForEachDay: [String],
    totalWalkRunDistanceForEachDayOfYear: [String],
    totalSteps: Number,
    incrementsOfStepsForEachDay: [String],
    totalStepsForEachDayOfYear: [String],
    created: Number
});

module.exports = mongoose.model("Health", healthSchema);
