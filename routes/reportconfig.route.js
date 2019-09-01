const express = require('express');
const app = express();
const reportconfigRoutes = express.Router();
//var Request = require("request"); //npm install request --save // Can also be used for API call
const axios = require('axios'); //npm install axios --save // API calls
var query = require('jsonSQL');//npm install jsonsql --save // Json Query
var fs = require('fs'); //read/write file

// Require Course model in our routes module
let ReportConfig = require('../models/ReportConfig');

// Route for adding config
//Test post with http://0.0.0.0:4000/report/add
// Sample Body Format {"report_name": "UserReport","datasource_api": "https://jsonplaceholder.typicode.com/users","attributes_to_display": "id,name,phone,address.street,address.suite,address.city,address.zipcode", "filter_by_attribute": "name"}
reportconfigRoutes.route('/add').post(function (req, res) {
  let reportconfig = new ReportConfig(req.body);
  reportconfig.save()
    .then(reportconfig => {
      res.status(200).json({'reportconfig': 'Report config in added successfully'});
    })
    .catch(err => {
    res.status(400).send("Unable to save to database");
    });
});

// Route to get list of reports
// Test with http://localhost:4000/report
reportconfigRoutes.route('/').get(function (req, res) {
  ReportConfig.find(function (err, reportconfig){
    if(err){
      console.log(err);
      res.send('Error.');
    }
    else {
      reportconfig = JSON.parse(JSON.stringify(reportconfig));
      let reports = query(reportconfig, 'report_name where report_name!= ');
      //console.log(reports);
      res.json(reports);
    }
  });
});

// Route to get list of reports and there config
// Test with http://localhost:4000/report/config
reportconfigRoutes.route('/config').get(function (req, res) {
  ReportConfig.find(function (err, reportconfig){
    if(err){
      console.log(err);
    }
    else {
      res.json(reportconfig);
    }
  });
});

// Route to generate report as per config. Report name is mandatory. Count and filter parameters are optional
reportconfigRoutes.route('/generate/:name/:count?/:filter?').get(function (req, res) {
  let name = req.params.name;
  let count = 10; // default count
  let filter = null;
  if(req.params.count > 0)
  {
    count = req.params.count;
    filter = req.params.filter;
  }

  ReportConfig.find({ 'report_name': name }, function (err, reportconfig){
    if(err){
      console.log(err);
    }
    else {
      console.log(reportconfig);
      let parsed = JSON.parse(JSON.stringify(reportconfig));
      //console.log("len"+parsed.length);
      let length = parsed.length;
      let api = "";
      let columns = "";
      let filtercolumn = "";
      if(length > 0)
      {
        api = parsed[0]['datasource_api'];
        console.log('API = '+api);
        columns = parsed[0]['attributes_to_display'];
        console.log('Columns = '+columns); 
        filtercolumn = parsed[0]['filter_by_attribute'];
      }
      else{
        console.log("No record found for =" + name);
        res.json("No record found.");
      }

//Make API call
axios.get(api)
  .then(response => {
    console.log('API Response');
    //Quary JSON response
    let dataSource = JSON.parse(JSON.stringify(response.data));
    //Ideally query should go in api url. In this case we don't know API capabalities to supporting queries
    var rootkeys = Object.keys(dataSource).length;
    if(dataSource != null && rootkeys == 2) // to check if items are at root level or child level
    {
        dataSource = dataSource[Object.keys(dataSource)[1]];
    }

    let result;
    if(typeof filter == 'undefined' || filter == null)
    {
      let col = columns.split(',');
      result = query(dataSource, columns+' where  '+col[0]+'!= '); // Assuming first column id and not blank to be report meaningful
    }
    else
      result = query(dataSource, columns+' where '+filtercolumn+'~'+filter); // contains(~) check for filter
    
      result = result.slice(0, count);
      result = concatinateChildColumns(result);

      writeToFile(result)//write to disk.
    //console.log('======RESULT 1\n', result);
    res.json(result);
  })
  .catch(error => {
    console.log('API='+error);
  });

//End API
      
    }
  });
});

//format first level child columns concatenate under parent column. e.g. address 
var concatinateChildColumns = function (data) {
  let arrCol = Object.keys(data[0]);
    //console.log('arr col='+arrCol);
    
    let outputJson = [];
    for (var i = 0, l = data.length; i < l; i++){
        let output = {};
        for (col in arrCol) {
            val = arrCol[col].trim();
            let cellval = data[i][val];
            
            if(val.indexOf('.') > 0)
            {
                let newgroupcol = val.split('.')[0].trim();
                //console.log('address col= '+ newgroupcol)
                //console.log('address val= '+output[newgroupcol]);
                if(typeof output[newgroupcol] === 'undefined')
                {
                  //console.log('undifined');
                  output[newgroupcol] = cellval;
                }
                else
                {
                  //console.log('not undifined');
                  output[newgroupcol] = output[newgroupcol] + ' ' + cellval;
                }
            }
            else
            {
                output[val] = cellval;
            }
            
            //console.log('Column name = '+JSON.stringify(data[i]));
        }
        outputJson.push(output);     
  }
  return outputJson;
}

var writeToFile = function (data) {
  var today = new Date();
  let json = JSON.stringify(data);
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + '-' +today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  console.log(date);
  fs.writeFile('myreportfile_'+date+'.json', json, 'utf8', function(err) {
    if (err) throw err;
    console.log('File written to disk successfully.');
    }
);
}

module.exports = reportconfigRoutes;