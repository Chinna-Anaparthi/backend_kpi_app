const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    empId: Number,
    firstName : String,
    lastName : String,
    email: String,
    phone:Number,
    role : String,
    userName:String,
    practice:String,
    password:String,
    location:String,
    managerName:String,
    directorName:String,
    hrName:String,
    profileImag:String,
    team:[],
    quater: [],
    empTime: { type: Date, default: Date.now }
});

const employeeSchemakpi = mongoose.model('Employee', employeeSchema);

module.exports = employeeSchemakpi;
