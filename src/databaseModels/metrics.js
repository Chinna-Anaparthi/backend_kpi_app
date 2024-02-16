const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: [],
    subCategory: [],
    metrics: [],
    empTime: { type: Date, default: Date.now }
});

const metrics = mongoose.model('Metrics', metricsSchema);

module.exports = metrics;
