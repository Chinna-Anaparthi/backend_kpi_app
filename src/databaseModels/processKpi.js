const mongoose = require('mongoose');

const processKpi = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: String,
    processKpi: [],
    empTime: { type: Date, default: Date.now }
});

const processKpischema = mongoose.model('processKpi', processKpi);

module.exports = processKpischema;
