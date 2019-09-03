import React, {Component} from 'react';
import axios from 'axios';
import { Checkbox } from '@material-ui/core';
import Swal from 'sweetalert2';
import moment from 'moment';

var user_id = '';
export default class AccountSettings extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {

            user_type:1,

            employeeProfile:false,
            individualPoints:false,
            trainingSeminar:false,
            positionResponsibilities:false,
            reports:false,
            adminSettings:false,
            departmentSettings:false,
            userSettings:false,
            userLogs:false,

            accountSettings_data:[],
            accountSettings_id:1,
        };

    }

        componentDidMount() {
            axios.get('http://'+window.location.hostname+':8000/accountsettings/?id=1')
            .then(res => {
                this.setState({
                    accountSettings_data:res.data
                })
                this.state.accountSettings_data.map((settings)=>{
                    this.setState({
                        employeeProfile:settings.employeeProfile,
                        individualPoints:settings.individualPoints,   
                        trainingSeminar:settings.trainingSeminar,  
                        positionResponsibilities:settings.positionResponsibilities,     
                        reports:settings.reports,          
                        adminSettings:settings.adminSettings,
                        departmentSettings:settings.departmentSettings,
                        userSettings:settings.userSettings,     
                        userLogs:settings.userLogs,
                    })
                })
            })

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            }) 

        }
        handleCheckBoxChange(e, status) {

            //EMPLOYEE PROFILE , LIST , FORM
            if (status === "employeeProfile") {
                this.setState({
                  employeeProfile: !this.state["employeeProfile"],
                });
              }

            // INDIVIDUAL POINTS
            if (status === "individualPoints") {
                this.setState({
                  individualPoints: !this.state["individualPoints"],
                });
              }


            // TRAINING AND SEMINAR
            if (status === "trainingSeminar") {
                this.setState({
                  trainingSeminar: !this.state["trainingSeminar"],
                });
              }

            // POSITION AND RESPONSIBILITIES
            if (status === "positionResponsibilities") {
                this.setState({
                  positionResponsibilities: !this.state["positionResponsibilities"],
                });
              }

            // REPORTS
            if (status === "reports") {
                this.setState({
                  reports: !this.state["reports"],
                });
              }


            // ADMING SETTINGS , DEPARTMENT SETTINGS , USER SETTINGS
            if(status === "adminSettings"){
                this.setState({
                    departmentSettings: !this.state["adminSettings"],
                    userSettings: !this.state["adminSettings"]
                  });
            }
            if(this.state.departmentSettings && status === "userSettings" || status === "departmentSettings" && this.state.userSettings){
                this.setState({
                    adminSettings: true
                });
            }
            if(status === "departmentSettings" && this.state.adminSettings || status === "userSettings" && this.state.adminSettings){
                this.setState({
                    adminSettings: false
                });
            }

            // USER LOGS
            if (status === "userLogs") {
                this.setState({
                  userLogs: !this.state["userLogs"],
                });
              }

              this.setState({ [status]: !this.state[status] });
           
        }

        //Adding data to each states name == input field name
        onChange = e => {
            this.setState({ [e.target.name]: e.target.value });

            axios.get('http://'+window.location.hostname+':8000/accountsettings/?id='+e.target.value)
            .then(res => {
                this.setState({
                    accountSettings_data:res.data
                })
                this.state.accountSettings_data.map((settings)=>{
                    this.setState({
                        accountSettings_id:settings.id,
                        employeeProfile:settings.employeeProfile,
                        individualPoints:settings.individualPoints,   
                        trainingSeminar:settings.trainingSeminar,  
                        positionResponsibilities:settings.positionResponsibilities,    
                        reports:settings.reports,          
                        adminSettings:settings.adminSettings,
                        departmentSettings:settings.departmentSettings,
                        userSettings:settings.userSettings,     
                        userLogs:settings.userLogs,
                    })
                })
            })
        }

        onSave = e =>{
            const data = new FormData();
            data.set("user_type", this.state.user_type)
            data.set("employeeProfile", this.state.employeeProfile)
            data.set("individualPoints ", this.state.individualPoints)
            data.set("trainingSeminar", this.state.trainingSeminar)
            data.set("positionResponsibilities", this.state.positionResponsibilities)
            data.set("reports", this.state.reports)
            data.set("adminSettings", this.state.adminSettings)
            data.set("departmentSettings", this.state.departmentSettings)
            data.set("userSettings", this.state.userSettings)
            data.set("userLogs", this.state.userLogs)
            axios.put('http://'+window.location.hostname+':8000/accountsettings/'+this.state.accountSettings_id+'/',data)
            .then(res => {
                if(this.state.user_type == 1){
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Updated Administrator Accounts")
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "UPDATE")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })
                    Swal.fire('Updated!','Administrator accounts has been updated.','success')
                }else if(this.state.user_type == 2){
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Updated Supervisor Accounts")
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "UPDATE")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })
                    Swal.fire('Updated!','Supervisor accounts has been updated.','success')
                }else{
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Updated Staff Accounts")
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "UPDATE")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })
                    Swal.fire('Updated!','Staff accounts has been updated.','success')
                }
                
            })
        }
        
    render(){
        return(

        <div className="container">
             <div className="row">
                <div className="container-fluid">
                    <center>
                        <div className="col-md-4">
                            <select onChange={this.onChange} value={this.state.user_type} name="user_type" className="browser-default custom-select">
                                <option value="1">Administrator</option>
                                <option value="2">Supervisor</option>
                                <option value="3">Staff</option>
                            </select>
                        </div>
                        <br/>
                        <div className="col-md-6 table-responsive text-nowrap" style={{border:"2px solid Black",textAlign:"center",height:430}}>
                            <br/>
                           <ul style={{listStyle:"none", textAlign:"left"}}>
                                    <label>
                                        <Checkbox checked={this.state.employeeProfile} onChange={e => this.handleCheckBoxChange(e,"employeeProfile")}/>
                                        <span>Employee Profile</span>
                                    </label>
                                <li>
                                    <label>
                                    <Checkbox checked={this.state.individualPoints} onChange={e => this.handleCheckBoxChange(e,"individualPoints")}/>
                                    <span>Individual Points</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <Checkbox checked={this.state.trainingSeminar} onChange={e => this.handleCheckBoxChange(e,"trainingSeminar")}/>
                                        <span>Trainings and Seminars</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <Checkbox checked={this.state.positionResponsibilities} onChange={e => this.handleCheckBoxChange(e,"positionResponsibilities")}/>
                                        <span>Position and Responsibilities</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <Checkbox checked={this.state.reports} onChange={e => this.handleCheckBoxChange(e,"reports")}/>
                                        <span>Reports</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <Checkbox checked={this.state.adminSettings} onChange={e => this.handleCheckBoxChange(e,"adminSettings")}/>
                                        <span>Adming Settings</span>
                                    </label>
                                    <ul style={{listStyle:"none",textAlign:"left", marginTop:-20}}>
                                        <label>
                                            <Checkbox checked={this.state.departmentSettings} onChange={e => this.handleCheckBoxChange(e,"departmentSettings")}/>
                                            <span>Department Settings</span>
                                        </label>
                                        <label>
                                            <Checkbox checked={this.state.userSettings} onChange={e => this.handleCheckBoxChange(e,"userSettings")}/>
                                            <span>User Settings</span>
                                        </label>
                                    </ul>
                                </li>
                                <li>
                                    <label>
                                        <Checkbox checked={this.state.userLogs} onChange={e => this.handleCheckBoxChange(e,"userLogs")}/>
                                        <span>User Logs</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4" style={{marginBottom:20,marginTop:5}}>
                            <button className="btn btn-primary form-control" onClick={this.onSave}>Save</button>
                        </div>
                    </center> 
                </div>
            </div>
        </div>
  

        );
    }
}
