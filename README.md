# Generic Report Framework in NodeJS

## Project Requirement
Design and implement a generic framework for running custom reports. A report entails retrieving data from somewhere, and processing it in some way to create output data. The framework should be designed such that it is easy to add support for new report types. Each report type should be able to support its own custom config settings.
Create a driver application that accepts a config file defining which reports shall be ran, runs them, and then saves the results to disk. It should be possible to define running the same report type multiple times (eg. with different config settings)
For the purposes of demonstrating the framework, lets implement 2 report modules.
1. Incident Report
GET https://kyyfz4489y7m.statuspage.io/api/v2/incidents.json can be used to obtain a list of the 50 recent service incidents
From this data, the report should extract and output a set of incidents. For each incident, we only want the following properties: id, name, created_at, resolved_at
The report should support accepting a config of the max number of records to return.
2. User Report
GET https://jsonplaceholder.typicode.com/users can be used to obtain a list of users.
From this data, the report should extract and output a list of users. For each user, we only want the following properties: id, name, phone, address (a single string formatted as “%STREET% %SUITE% %CITY% %ZIPCODE%”)
The report should accept a config of the max number of records to return, and a name filter string to be able to filter the output to only include users where the user’s name contains the filter string.
Examples of other reports that could be added into such generic report framework would be:
- AWS EC2 Instances Report: Generates a report of all the running EC2 instances in a particular account 
- AWS S3 Buckets Report: Generates a report of all the S3 buckets in a particular account
- GCP GCE Instance Report: Generates a report of all running GCP machines in a particular GCP Project 
- Transcode Jobs Report: Generates a report of # of successful vs failed jobs grouped by user

## Architecture Diagram:
![System Architecture](https://github.com/manojknit/GenericReportFramework-api/raw/master/images/architecture.png)

## Database: generic-report-framework
Following table is intended to store report configuration
* Table: ReportConfig
    * report_name : String
    * datasource_api : String
    * attributes_to_display : String
    * filter_by_attribute : String

## API
reportconfig.route: has the Api logic
ReportConfig: model maps to mongodb table to store report configuration

## How to Run
Run `node server.js` for a api server. Navigate to `http://localhost:4000/`. The app will automatically reload if you change any of the source files by running `nodemon server` insted.
Docker file is included for docker deployment.

## Available methods: <br>
   * List of reports : http://localhost:4000/report <br>
   * Reports config: http://localhost:4000/report/config <br>
   * Add Config(post request): http://0.0.0.0:4000/report/add <br>
        Sample Body Format {"report_name": "UserReport","datasource_api": "https://jsonplaceholder.typicode.com/users","attributes_to_display": "id,name,phone,address.street,address.suite,address.city,address.zipcode", "filter_by_attribute": "name"}<br>
        ![UserReport](https://github.com/manojknit/GenericReportFramework-api/raw/master/images/UserReport.png)
        ![IncidentReport](https://github.com/manojknit/GenericReportFramework-api/raw/master/images/IncidentReport.png)

   * Generate report as per config. Report name is mandatory. Count and filter parameters are optional<br>
        http://localhost:4000/report/generate/UserReport/15/Ervin <br>
        http://localhost:4000/report/generate/IncidentReport<br>
   * System also dumps report in project folder<br>
   <br>
   For more please check video to get instructions.;



## 
