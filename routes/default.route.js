const express = require('express');
const app = express();
const defaultRoute = express.Router();


// Defined get data(index or listing) route
defaultRoute.route('/').get(function (req, res) {
    
   res.send('This API provides Generic Report Framework. <br>\
   Available methods: <br>\
   * List of reports : http://localhost:4000/report <br>\
   * Reports config: http://localhost:4000/report/config <br>\
   * Add Config(post request): http://0.0.0.0:4000/report/add <br>\
        Sample Body Format {"report_name": "UserReport","datasource_api": "https://jsonplaceholder.typicode.com/users","attributes_to_display": "id,name,phone,address.street,address.suite,address.city,address.zipcode", "filter_by_attribute": "name"}<br>\
   * Generate report as per config. Report name is mandatory. Count and filter parameters are optional<br>\
   http://localhost:4000/report/generate/UserReport/15/Ervin <br>\
   http://localhost:4000/report/generate/IncidentReport<br>\
   System also dumps report in project folder<br>\
   <br>\
   For more please check video to get instructions.');

});


module.exports = defaultRoute;