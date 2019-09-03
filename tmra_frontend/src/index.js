import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorPage from './components/pagenotfound/errorpage.js';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios'


console.log(window.location.pathname)
axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
.then(res => {
var pageNotfound = false;
var accountsettings_data=[];
var employeeProfile=false;
var employeeList=false;
var employeeForm=false;
var employmentInfo=false;
var employmentHistory=false;
var trainingEmployee=false;
var evaluation=false;
var individualPoints=false;
var trainingSeminar=false;
var positionResponsibilities=false;
var reports=false;
var departmentSettings=false;
var userSettings=false;
var userLogs=false;
        res.data.map((user)=>{
            axios.get('http://'+window.location.hostname+':8000/accountsettings/?id='+user.user_type)
            .then(res => {
                 accountsettings_data = res.data
                 accountsettings_data.map(function(settings){
                    employeeProfile = settings.employeeProfile;
                    employeeList= settings.employeeList;
                    employeeForm= settings.employeeForm;
                    employmentInfo = settings.employmentInfo;
                    employmentHistory = settings.employmentHistory;
                    trainingEmployee = settings.trainingEmployee;
                    evaluation = settings.trainingSeminar;
                    individualPoints = settings.individualPoints;
                    trainingSeminar = settings.trainingSeminar;
                    positionResponsibilities = settings.positionResponsibilities
                    reports = settings.reports;
                    departmentSettings = settings.departmentSettings;
                    userSettings = settings.userSettings;
                    userLogs = settings.userLogs;
                 })
                 
          
                var pathnameArray = ["/","/signin","/employeelist","/employeeform","/individualpoints","/trainingform","/positionresponsibilities","/reports/monthlypoints",
                    "/reports/quarterlypoints","/reports/annualpoints","/reports/averageanalytics","/reports/quotaactualproductivity",
                    "/reports/hoursclassification","/adminsettings/departmentsettings","/adminsettings/usersettings",
                    "/adminsettings/usersettings/accountsettings/","/userlogs"]

                if( window.location.pathname == "/employeelist" && employeeList == false 
                || window.location.pathname == "/" && employeeList == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/employeeform" && employeeForm == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/individualpoints" && individualPoints == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/trainingform" && trainingSeminar == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/positionresponsibilities" && positionResponsibilities == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/monthlypoints" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/quarterlypoints" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/annualpoints" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/averageanalytics" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/quotaactualproductivity" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/reports/hoursclassification" && reports == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/adminsettings/departmentsettings" && departmentSettings == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/adminsettings/usersettings" && userSettings == false){
                    pageNotfound = true
                }else if(window.location.pathname == "/userlogs" && userLogs == false){
                    pageNotfound = true
                }
                ReactDOM.render(pageNotfound?<ErrorPage/>:<App />, document.getElementById('root'));
                // If you want your app to work offline and load faster, you can change
                // unregister() to register() below. Note this comes with some pitfalls.
                // Learn more about service workers: https://bit.ly/CRA-PWA
                serviceWorker.unregister();

                
            })
            
        })
    
    if(localStorage.getItem("token") == null){
        ReactDOM.render(<App />, document.getElementById('root'));
        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.unregister();
    }else{
        
    }
})



