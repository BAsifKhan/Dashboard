require('dotenv').config();
const axios = require ('axios');
//const Axioslogger = require ('axios-logger');

const projects = require('../projects.json');
const api = axios.create({
    baseURL : process.env.TESTRAIL_API,
    auth: {
        username: process.env.TESTRAIL_USER,
        password: process.env.TESTRAIL_KEY

    }
});
const project = projects[process.env.PROJECT];
console.log(project);

//const limit = 250;
//var offset = 0;
//var done = false;
var automated = 0, manual =0;

const getNumbers =() => {
    return api.get(`get_cases/${project.suites[0].projectId}&suite_id=${project.suites[0].suiteId}&limit=250&offset=0`)
    .then((response) => {
        if (!response.data){
            throw 'response.data missing';
        }
        else if (!response.data.cases){
            throw 'cases are missing';
        }
        if( project ==process.env.PROJECT){
            automated += response.data.cases.map(x => x.type_id).filter(x => project.automated_jsonID.includes( x)).length;
            manual += response.data.cases.map(x => x.type_id).filter(x => project.manual_jsonID.includes( x)).length;
        }else{
            automated += response.data.cases.map(x => x.custom_automation_type).filter(x => project.automated_jsonID.includes( x)).length;
            manual += response.data.cases.map(x => x.custom_automation_type).filter(x => project.manual_jsonID.includes( x)|| x == null).length;
        }
        console.log(`update: automated[${automated}]not[${manual}]`);
    })
}
getNumbers()