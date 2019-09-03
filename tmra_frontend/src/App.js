import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import axios from 'axios'
import './css/bootstrap.min.css';
import './css/icon.css';
import './css/sweetalert.css';
import './css/react-sidenav.css';
import './css/bottomnav.css';
import './css/autosuggest.css';
import './css/datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import "react-table/react-table.css";
import EmployeeList from './components/employee_profile/employee_list.js';
import BasicInformation from './components/employee_profile/basic_information.js';
import EmploymentInfo from './components/employee_profile/employment_info.js';
import DisplayEvaluation from './components/evaluation/display_evaluation.js';
import EmploymentHistory from './components/employment_history/employment_history.js';
import DisplayTraining from './components/training&certificate/traininglist.js';
import AddTraining from './components/training&certificate/add_training.js';
import TrainingCertificateofEmployee from './components/training&certificate/traininglist_employee.js';
import IndividualPointsList from './components/individual_points/individual_points_list.js';
import Header from './components/header/header.js';
import MonthlyReport from './components/reports/monthlyreport.js';
import QuarterlyReport from './components/reports/quarterlyreport.js';
import AnnualReport from './components/reports/annualreport.js';
import AverageAnalytics from './components/reports/averageanalytics.js';
import QuotaActualProductivity from './components/reports/quota_actual_productivity.js';
import HoursClassification from './components/reports/hours_classification_summary';
import UserList from './components/adminsettings/user_settings/userlist.js';
import CreateUser from './components/adminsettings/user_settings/createuser.js';
import AccountSettings from './components/adminsettings/user_settings/accountsettings.js';
import DepartmentSettings from './components/adminsettings/department_settings/departmentlist.js';
import Signin from './components/signin/signin.js';
import Sidebar from './components/sidebar/sidebar.js';
import UserLogs from './components/adminsettings/userlogs/userlogs.js';
import PageError from './components/pagenotfound/errorpage.js';
import PositionResponsibilities from './components/position_responsibilities/position_responsibilities.js';


var isOn=false
class App extends Component {
    _isMounted = false;
        constructor(props) {
            super(props);
            this.state = {
                expanded: true,
                selected:'',
                signedin:true,

                employeeProfile:'',
                employeeList:'',
                employeeForm:'',
                employmentInfo:'',
                employmentHistory:'',
                trainingEmployee:'',
                evaluation:'',
                individualPoints:'',
                trainingSeminar:'',
                reports:'',
                adminSettings:'',
                departmentSettings:'',
                userSettings:'',
                userLogs:false,

                user_type:'',
                accountSettings_data:[],
                refresh:false,


                time: 0,

                start: 0

            }
                this.startTimer = this.startTimer.bind(this)
                this.stopTimer = this.stopTimer.bind(this)
                this.resetTimer = this.resetTimer.bind(this)
        }


        componentDidMount() {
            this.setState({refresh:true})
            this._isMounted = true;
            const expirationDate = new Date(localStorage.getItem('expiration'));
            if(this._isMounted){
                if(localStorage.length > 0){
                    this.setState({signedin:true})               
                }else{
                    this.setState({signedin:false})
                }

                if(expirationDate <= new Date()){
                    localStorage.removeItem('token')
                    localStorage.removeItem('expiration')
                    this.setState({signedin:false})
                }
            }

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                    res.data.map((user)=>{
                        axios.get('http://'+window.location.hostname+':8000/accountsettings/?user_type='+user.user_type)
                        .then(res => {
                            this.setState({
                                accountSettings_data:res.data
                            })
                            this.state.accountSettings_data.map((settings)=>{
                                this.setState({
                                    employeeProfile:settings.employeeProfile,
                                    employeeList:settings.employeeList,
                                    employeeForm:settings.employeeForm,
                                    employmentInfo:settings.employmentInfo,
                                    employmentHistory:settings.employmentHistory,
                                    trainingEmployee:settings.trainingEmployee,
                                    evaluation:settings.evaluation,
                                    individualPoints:settings.individualPoints,   
                                    trainingSeminar:settings.trainingSeminar,
                                    trainingList:settings.trainingList,
                                    trainingForm:settings.trainingForm,         
                                    reports:settings.reports,          
                                    adminSettings:settings.adminSettings,
                                    departmentSettings:settings.departmentSettings,
                                    userSettings:settings.userSettings,     
                                    userLogs:settings.userLogs,
                                })
                            })
                        })
                    })
            })

            this.startTimer();
        }

        //CALL BACK FROM SIDEBAR
        mySidebarCallback = (dataFromChild) => {
           
                this.setState({ expanded: dataFromChild });
         
            this.checkToken();
        }

         //CALL BACK FROM SIGN-IN
         mySigninCallback = (dataFromChild) => {
            this.setState({signedin:dataFromChild})
        }

         //CALL BACK FROM HEADER
         myHeaderCallback = (dataFromChild) => {
            this.setState({signedin:dataFromChild})
        }


        componentWillUnmount() {
            this._isMounted = false;
        }

        startTimer() {
            isOn= true
            this.setState({
              time: this.state.time,
              start: Date.now() - this.state.time
            })
            this.timer = setInterval(() => this.setState({
              time: Date.now() - this.state.start
            }), 1);
          }
          stopTimer() {
            isOn=false
            clearInterval(this.timer)
          }
          resetTimer() {
            this.setState({time: 0, isOn: false})
          }

        checkToken(){
            const expirationDate = new Date(localStorage.getItem('expiration'));
            if(this._isMounted){
                if(localStorage.length > 0){
                    this.setState({signedin:true})               
                }else{
                    this.setState({signedin:false})
                }

                if(expirationDate <= new Date()){
                    localStorage.removeItem('token')
                    localStorage.removeItem('expiration')
                    this.setState({signedin:false})
                }
            }
        }

        componentDidUpdate(){
            
        }

    render() {

        return (
       
            <Router>
              
               {this.state.time > 10000?this.stopTimer():null}
                {this.state.signedin? null:<Redirect to="/signin"/>}
                
                {this.state.signedin?<div className="wrapper" style={{}}>

                      <Header callBackParent={this.myHeaderCallback} expand={this.state.expanded}/>
                      <Sidebar callBackParent ={this.mySidebarCallback}/>
                      <div className="main-panel"style={{marginLeft: this.state.expanded? 250:50 , marginRight:this.state.expanded?10:0, marginTop:10}}>
                            <Route exact path="/" component={EmployeeList}/>
                            <Route path="/employeelist" component={EmployeeList}/>
                            <Route exact path="/employeeform" component={BasicInformation}/>
                            <Route path="/employeeform/:id/" component={BasicInformation}/>                   
                            <Route path="/employmentinfo/:id/" component={EmploymentInfo} />
                            <Route path="/rolesresponsibilities/:id/" component={EmploymentHistory} />
                            <Route path="/trainingcertificateofemployee/:id/" component={TrainingCertificateofEmployee} />
                            <Route path="/evaluation/:id/" component={DisplayEvaluation} />
                            <Route exact path="/trainingcertificate" component={DisplayTraining} />
                            <Route path="/individualpoints" component={IndividualPointsList}/>
                            <Route path="/traininglist" component={DisplayTraining} />
                            <Route exact path="/trainingform/" component={AddTraining} />
                            <Route path="/trainingform/:id" component={AddTraining} />
                            <Route path="/positionresponsibilities" component={PositionResponsibilities}/>
                            <Route path="/reports/monthlypoints" component={MonthlyReport}/>
                            <Route path="/reports/quarterlypoints" component={QuarterlyReport}/>
                            <Route path="/reports/annualpoints" component={AnnualReport}/>
                            <Route path="/reports/averageanalytics" component={AverageAnalytics}/>
                            <Route path="/reports/quotaactualproductivity" component={QuotaActualProductivity}/>
                            <Route path="/reports/hoursclassification" component={HoursClassification}/>
                            <Route path="/adminsettings/departmentsettings" component={DepartmentSettings}/>
                            <Route exact path="/adminsettings/usersettings" component={UserList}/>
                            <Route path="/adminsettings/usersettings/createuser/:id" component={CreateUser} />
                            <Route exact path="/adminsettings/usersettings/createuser/" component={CreateUser} />
                            <Route path="/adminsettings/usersettings/accountsettings/" component={AccountSettings}/>
                            <Route exact path="/signin" component={() => <Signin callBackParent={this.mySigninCallback}/>}/>
                            <Route exact path="/userlogs" component={() => <UserLogs/>}/>
                    </div>
            </div>:<Signin callBackParent={this.mySigninCallback}/>} 
        </Router>
        );
    }
}


export default App
