const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Report Config
let ReportConfig = new Schema({
  report_name: { 
    type: String
  },
  datasource_api: {
    type: String
  },
  attributes_to_display: { // comma separated attribute to display
    type: String
  },
  filter_by_attribute: {
    type: String
  }
},{
    collection: 'ReportConfig'
});

module.exports = mongoose.model('ReportConfig', ReportConfig);