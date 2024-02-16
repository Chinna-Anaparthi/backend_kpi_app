const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    empId: Number,
    firstName : String,
    lastName : String,
    email: String,
    role : String,
    practice:String,
    password:String,
    location:String,
    managerName:String,
    directorName:String,
    hrName:String,
    profileImag:String,
    Quater: [],
    empTime: { type: Date, default: Date.now }
});

const employeeSchemakpi = mongoose.model('employeeCollection', employeeSchema);

module.exports = employeeSchemakpi;
