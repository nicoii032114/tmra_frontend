import React, { Component } from 'react';
import {Link} from "react-router-dom";
import DatePicker from 'react-datepicker';  
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2'
import NumberFormat from 'react-number-format';
//ICONS
import AddIcon from '@material-ui/icons/AddBox'
import UpdateIcon from '@material-ui/icons/Update'

var user_id = ''; //USERLOG ID
var employeeID = '';
var props_id = '';

export default class Employment_Info extends Component{

    _isMounted = false;

        constructor(props) {
            super(props);
            this.state = {
                lastID:'',
                emp_tbl_id:'',
                employment_tbl_id:'',
                department:1,
                date_employed:moment(new Date).format("YYYY-MM-DD"),
                date_effective:moment(new Date).format("YYYY-MM-DD"),
                position:'',
                quota:'',
                salary_base:'',
                basic_rate:'',
                incentive:'',
                challenge_quota:'',
                designation:1,
                assignment:'',
                employee_type:1,
                employment_status:1,
                resignation_date:moment(new Date).format("YYYY-MM-DD"),
                end_of_contract:moment(new Date).format("YYYY-MM-DD"),
                remarks:'',
                flexi:1,
                schedule_id:1,

                schedule_data:[],
                schedule_format:[],

                rr_data:[],
                department_data:[],

                employee_data:[],
                employmentdetails:[],

                //FOR DATE PICKERS
                Start_DateEmployed:new Date(),
                Start_DateEffective:new Date(),
                Start_DateResignation:new Date(),
                Start_DateEndOfContract:new Date(),

                changePosition:false,

                Checkresigned:false,
                Checkendofcontract:false,

                user_type:3,

            };

 
        }
         //ON LOAD
         componentDidMount() {

            axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
            .then(res => {
                this.setState({
                    rr_data: res.data
                    });
                    var arrayID = [];
                    res.data.map((ids)=>{
                        arrayID.push(ids.id)
                    })
                    this.setState({
                        position:arrayID[0]
                    })
                })
            axios.get('http://'+window.location.hostname+':8000/department/')
                .then(res => {
                    this.setState({
                        department_data: res.data
                        })
                        var arrayID = [];
                        res.data.map((ids)=>{
                            arrayID.push(ids.id)
                        })
                        this.setState({
                            department:arrayID[0]
                        })
                })
                  //GETTING ALL SCHEDULE DATA
            axios.get('http://'+window.location.hostname+':8000/schedule/')
                  .then(res => {
                      this.setState({
                          schedule_data:res.data
                      })
                      var format = [];

                      this.state.schedule_data.map((schedule) =>{
                          if(schedule.id === 1){
                            format.push({id: 1, schedule:"06:00 AM - 02:00 PM"})
                          }else if(schedule.id === 2){
                            format.push({id: 2, schedule:"02:00 PM - 10:00 PM"})
                          }else if(schedule.id === 3){
                            format.push({id: 3, schedule:"08:00 AM - 05:00 PM"})
                          }
                      })
                      this.setState({
                          schedule_format:format
                      })
                })
            this.setState({emp_tbl_id:this.props.emp_tbl_id})
            this._isMounted = true;

            if(this.props.emp_tbl_id !== undefined){
                this.getEmploymentData()
            }else{
                
            }

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                    res.data.map((id)=>{
                        user_id = id.id
                        this.setState({user_type:id.user_type})
                    })
            })

            axios.get('http://'+window.location.hostname+':8000/employee/'+this.props.emp_tbl_id+'/')
            .then(res => {
                employeeID = res.data.employeeID
            })
        }

        componentWillReceiveProps({emp_tbl_id}) {
           
            if(emp_tbl_id != undefined){
                this._isMounted = true
                props_id = emp_tbl_id
                this.getEmploymentData()
                this.setState({
                  emp_tbl_id:emp_tbl_id
                })
            }else{
                
            }
          }

        componentWillUnmount() {
            this._isMounted = false;
          }

        getEmploymentData = e =>{
            axios.get('http://'+window.location.hostname+':8000/employmentdetails/?id='+props_id)
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                    employmentdetails:res.data
                    })
                }
                if(this.state.employmentdetails.length > 0){
                    this.setState({
                        showUpdateBtn: true,
                        showAddBtn: false
                    })
                    
                
                }else{
                    this.onReset();
                }
                this.state.employmentdetails.map((employee) => {
                    this.setState({
                        employment_tbl_id: employee.id,
                        department:employee.department,
                        date_employed:employee.date_employed,
                        date_effective:employee.date_effective,
                        position:employee.roles_responsibilities,
                        quota:employee.quota,
                        salary_base:employee.salary_base,
                        basic_rate:employee.basic_rate,
                        incentive:employee.incentive,
                        challenge_quota:employee.challenge_quota,
                        designation:employee.designation,
                        assignment:employee.assignment,
                        employee_type:employee.employee_type,
                        employment_status:employee.employment_status,
                        resignation_date:employee.resignation_date,
                        end_of_contract:employee.end_of_contract,
                        remarks:employee.remarks_for_resignation_termination,
                        flexi:employee.flexi,
                        schedule_id:employee.schedule_id
                    })  
                        //DATE EMPLOYED
                        var dateEmpTokens = this.state.date_employed.split("-");
                        //creating date object from specified year, month, and day
                        var dateEmp = new Date(dateEmpTokens[0],dateEmpTokens[1]-1,dateEmpTokens[2]);
                        this.setState({Start_DateEmployed:dateEmp})//CHANGING DATE ON DATEPICKER INTO DATE EMPLOYED
                        //DATE EFFECTIVE
                        var dateEffecTokens = this.state.date_effective.split("-");
                        //creating date object from specified year, month, and day
                        var dateEffect = new Date(dateEffecTokens[0],dateEffecTokens[1]-1,dateEffecTokens[2]);
                        this.setState({Start_DateEffective:dateEffect})//CHANGING DATE ON DATEPICKER INTO DATE EMPLOYED

                        //DATE RESIGNED
                        var dateResignTokens = this.state.resignation_date.split("-");
                        //creating date object from specified year, month, and day
                        var dateResign = new Date(dateResignTokens[0],dateResignTokens[1]-1,dateResignTokens[2]);
                        this.setState({Start_DateResignation:dateResign})//CHANGING DATE ON DATEPICKER INTO DATE EMPLOYED
                        //DATE END OF CONTRACT
                        var dateEndTokens = this.state.end_of_contract.split("-");
                        //creating date object from specified year, month, and day
                        var dateEnd = new Date(dateEndTokens[0],dateEndTokens[1]-1,dateEndTokens[2]);
                        this.setState({Start_DateEndOfContract:dateEnd})//CHANGING DATE ON DATEPICKER INTO DATE EMPLOYED       
                })
                
            })
        }
     

        onChangeDate_employed = date => {
            var dateformat = moment(date).format("YYYY-MM-DD")
            this.setState({
                Start_DateEmployed:date,         //updating the date picker
                date_employed:dateformat
            })
            console.log(this.state.date)
        }

        onChangeDate_effective = date => {
            var dateformat = moment(date).format("YYYY-MM-DD")
            this.setState({
                Start_DateEffective:date,         //updating the date picker
                date_effective:dateformat
            })
            console.log(this.state.date)
        }

        onChangeDate_resignation = date => {
            var dateformat = moment(date).format("YYYY-MM-DD")
            this.setState({
                Start_DateResignation:date,         //updating the date picker
                resignation_date:dateformat
            })
            console.log(this.state.date)
        }

        onChangeDate_end_of_contract = date => {
            var dateformat = moment(date).format("YYYY-MM-DD")
            this.setState({
                Start_DateEndOfContract:date,         //updating the date picker
                end_of_contract:dateformat
            })
            console.log(this.state.date)
        }



        onChange = e => {
            this.setState({ [e.target.name]: e.target.value });
        }

        onChangePosition = e =>{
            this.setState({ [e.target.name]: e.target.value });
            this.setState({
                changePosition:true,
                Start_DateEmployed:new Date(),
                Start_DateEffective:new Date(),
                date_employed:moment(new Date).format("YYYY-MM-DD")
            })
        }


         //ADDING EMPLOYMENT DETAILS DATA
         onSubmit = e => {
            //e.preventDefault();
            console.log(this.state.position)
            const data = new FormData();
            data.set('employee', this.state.emp_tbl_id)
            data.set('department', this.state.department)
            data.set('date_employed', moment(this.state.date_employed).format("YYYY-MM-DD"))
            data.set('date_effective', moment(this.state.date_effective).format("YYYY-MM-DD"))
            data.set('roles_responsibilities', this.state.position)
            data.set('quota', this.state.quota)
            data.set('salary_base', this.state.salary_base)
            data.set('basic_rate', this.state.basic_rate)
            data.set('incentive', this.state.incentive)
            data.set('challenge_quota', this.state.challenge_quota)
            data.set('designation', this.state.designation)
            data.set('assignment', this.state.assignment)
            data.set('employee_type', this.state.employee_type)
            data.set('employment_status', this.state.employment_status)
            data.set('resignation_date', this.state.Checkresigned?moment(this.state.resignation_date).format("YYYY-MM-DD"):"1950-01-01")
            data.set('end_of_contract', this.state.Checkendofcontract?moment(this.state.end_of_contract).format("YYYY-MM-DD"):"1950-01-01")
            data.set('remarks_for_resignation_termination', this.state.remarks)
            data.set('flexi', this.state.flexi)
            data.set('schedule', this.state.schedule_id)
            axios.post('http://'+window.location.hostname+':8000/employmentdetails/',data)
            .then(res => {
                this.getEmploymentData()
                    const data = new FormData();
    
                    data.set('user', user_id)
                    data.set('description', "Added Employment details of Employee ID: "+employeeID)
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "ADD")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })

                Swal.fire('Added!','Employment details has been added.','success')
                this.addHistory();
            })
            .catch(error => {
                if(error.response.data.quota || error.response.data.salary_base || error.response.data.basic_rate || error.response.data.incentive
                    || error.response.data.challenge_quota || error.response.data.designation || error.response.data.assignment
                    || error.response.data.remarks_for_resignation_termination){
                Swal.fire('Oops...','Fields may not be blank!','error')
                }else {

                }
            });
        }

          //UPDATE EMPLOYMENT DETAILS DATA
          onUpdate= e => {
                    const data = new FormData();
                    data.set('employee', this.props.emp_tbl_id)
                    data.set('department', this.state.department)
                    data.set('date_employed', moment(this.state.date_employed).format("YYYY-MM-DD"))
                    data.set('date_effective', moment(this.state.date_effective).format("YYYY-MM-DD"))
                    data.set('roles_responsibilities', this.state.position)
                    data.set('quota', this.state.quota)
                    data.set('salary_base', this.state.salary_base)
                    data.set('basic_rate', this.state.basic_rate)
                    data.set('incentive', this.state.incentive)
                    data.set('challenge_quota', this.state.challenge_quota)
                    data.set('designation', this.state.designation)
                    data.set('assignment', this.state.assignment)
                    data.set('employee_type', this.state.employee_type)
                    data.set('employment_status', this.state.employment_status)
                    data.set('resignation_date', this.state.Checkresigned?moment(this.state.resignation_date).format("YYYY-MM-DD"):"1950-01-01")
                    data.set('end_of_contract', this.state.Checkendofcontract?moment(this.state.end_of_contract).format("YYYY-MM-DD"):"1950-01-01")
                    data.set('remarks_for_resignation_termination', this.state.remarks)
                    data.set('flexi', this.state.flexi)
                    data.set('schedule', this.state.schedule_id.id)
                    axios.put('http://'+window.location.hostname+':8000/employmentdetails/'+this.state.employment_tbl_id+'/',data)
                    .then(res => {
                        const data = new FormData();
        
                        data.set('user', user_id)
                        data.set('description', "Updated Employment details of Employee ID: "+employeeID)
                        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                        data.set('action', "UPDATE")
                        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                        .then(res => {
                        })
                        Swal.fire('Updated!','Employment details has been updated.','success')
                        this.addHistory();
                    })
                    .catch(error => {
                        if(error.response.data.quota || error.response.data.salary_base || error.response.data.basic_rate || error.response.data.incentive
                            || error.response.data.challenge_quota || error.response.data.designation || error.response.data.assignment
                            || error.response.data.remarks_for_resignation_termination){
                                Swal.fire('Oops...','Fields may not be blank!','error')
                        }else {
            
                    }
                })
            }

        //UPDATE EMPLOYMENT DETAILS DATA
        addHistory= e => {
                const data = new FormData();
                data.set('employee', this.props.emp_tbl_id)
                data.set('department', this.state.department)
                data.set('date_employed', moment(this.state.date_employed).format("YYYY-MM-DD"))
                data.set('date_effective', moment(this.state.date_effective).format("YYYY-MM-DD"))
                data.set('roles_responsibilities', this.state.position)
                data.set('quota', this.state.quota)
                data.set('salary_base', this.state.salary_base)
                data.set('basic_rate', this.state.basic_rate)
                data.set('incentive', this.state.incentive)
                data.set('challenge_quota', this.state.challenge_quota)
                data.set('designation', this.state.designation)
                data.set('assignment', this.state.assignment)
                data.set('employee_type', this.state.employee_type)
                data.set('employment_status', this.state.employment_status)
                data.set('resignation_date', this.state.Checkresigned?moment(this.state.resignation_date).format("YYYY-MM-DD"):"1950-01-01")
                data.set('end_of_contract', this.state.Checkendofcontract?moment(this.state.end_of_contract).format("YYYY-MM-DD"):"1950-01-01")
                data.set('remarks_for_resignation_termination', this.state.remarks)
                data.set('flexi', this.state.flexi)
                data.set('schedule', this.state.schedule_id.id?this.state.schedule_id.id:this.state.schedule_id)
                data.set('date_updated',moment(new Date()).format("YYYY-MM-DD"))
                axios.post('http://'+window.location.hostname+':8000/employmenthistory/',data)
                .then(res => {
                })
                .catch(error => {
                    if(error.response.data.quota || error.response.data.salary_base || error.response.data.basic_rate || error.response.data.incentive
                        || error.response.data.challenge_quota || error.response.data.designation || error.response.data.assignment
                        || error.response.data.remarks_for_resignation_termination){
                            Swal.fire('Oops...','Fields may not be blank!','error')
                    }else {
        
                }
            })
        }

        onCheckResigned = e =>{
            this.setState({
                Checkresigned: !this.state.Checkresigned // flip boolean value
              })
        }
    
        onCheckEndofContract = e =>{
            this.setState({
                Checkendofcontract: !this.state.Checkendofcontract // flip boolean value
              })
        }

        onCheckQuota = e =>{
            this.setState({
                Checkquota: !this.state.Checkquota // flip boolean value
              })
              
        }

        onReset = e => {
            axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
            .then(res => {
                this.setState({
                    rr_data: res.data
                    });
                    var arrayID = [];
                    res.data.map((ids)=>{
                        arrayID.push(ids.id)
                    })
                    this.setState({
                        position:arrayID[0]
                    })
                })
            axios.get('http://'+window.location.hostname+':8000/department/')
                .then(res => {
                    this.setState({
                        department_data: res.data
                        })
                        var arrayID = [];
                        res.data.map((ids)=>{
                            arrayID.push(ids.id)
                        })
                        this.setState({
                            department:arrayID[0]
                        })
                })
            this.setState({
                showAddBtn:true,
                showUpdateBtn:false,
                date_employed:moment(new Date).format("YYYY-MM-DD"),
                date_effective:moment(new Date).format("YYYY-MM-DD"),
                quota:'',
                salary_base:'',
                basic_rate:'',
                incentive:'',
                challenge_quota:'',
                designation:1,
                assignment:'',
                employee_type:1,
                employment_status:1,
                resignation_date:moment(new Date).format("YYYY-MM-DD"),
                end_of_contract:moment(new Date).format("YYYY-MM-DD"),
                remarks:'',
                flexi:1,
                schedule_id:1,
            })
        }

    render(){
        return(
            <div className="container">   
                    <h3 style={{float:"left"}}>Employment Information</h3> 
                    <br/>
                    <br/>
                <div className="row">
                    <div className="col-md-6">
                    {this.state.user_type === 3? null:<div>
                            {this.state.showUpdateBtn?
                            <button onClick={this.onUpdate} type="submit" 
                            className="btn btn-primary" 
                            style={{float:"left",marginBottom:15}}><UpdateIcon/>SAVE</button> :

                            <button onClick={this.onSubmit} type="submit" 
                            className="btn btn-primary" 
                            style={{float:"left",marginBottom:15}}><AddIcon/>ADD</button>}
                        </div>}

                            <div className="input-group mb-3" style={{marginTop:20}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Department *</span>
                                    </div>
                                        <select value={this.state.department} onChange={this.onChange} name="department" className="form-control dropdown-toggle" >
                                            {this.state.department_data.map((department) => 
                                            <option key={department.id} value={department.id}>{department.department_name}</option>)}
                                        </select>
                                </div>

                            <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Date Employed</span>
                                    </div>
                                        <DatePicker
                                            selected={this.state.Start_DateEmployed}
                                            onChange={this.onChangeDate_employed}
                                            className="form-control"
                                            name="date_employed"
                                        />
                                </div>
                            
                             <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Date Effective</span>
                                    </div>
                                        <DatePicker
                                            selected={this.state.Start_DateEffective}
                                            onChange={this.onChangeDate_effective}
                                            className="form-control"
                                            name="date_effective"
                                        />  
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Position</span>
                                    </div>
                                        <select value={this.state.position} onChange={this.onChangePosition} name="position" className="form-control dropdown-toggle" >
                                            {this.state.rr_data.map((position) => 
                                            <option key={position.id} value={position.id}>{position.position}</option>)}
                                        </select>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Quota *</span>
                                    </div>
                                         <NumberFormat 
                                            value={this.state.quota}
                                            thousandSeparator={true}
                                            suffix={'%'}
                                            onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                                                this.setState({quota: value})
                                            }}
                                            style={{textAlign:"right"}}
                                            className="form-control"
                                            placeholder="%"/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Salary Base *</span>
                                    </div>
                                            <NumberFormat 
                                                value={this.state.salary_base}
                                                thousandSeparator={true}
                                                prefix={'₱'}
                                                suffix={'.00'}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value} = values;
                                                    this.setState({salary_base: value})
                                                  }}
                                                 style={{textAlign:"right"}}
                                                 className="form-control"
                                                 placeholder="₱"/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Basic Rate *</span>
                                    </div>
                                            <NumberFormat 
                                                value={this.state.basic_rate}
                                                thousandSeparator={true}
                                                prefix={'₱'}
                                                suffix={'.00'}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value} = values;
                                                    this.setState({basic_rate: value})
                                                  }}
                                                 style={{textAlign:"right"}}
                                                 className="form-control"
                                                 placeholder="₱"/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Incentive *</span>
                                    </div>
                                            <NumberFormat 
                                                value={this.state.incentive}
                                                thousandSeparator={true}
                                                prefix={'₱'}
                                                suffix={'.00'}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value} = values;
                                                    this.setState({incentive: value})
                                                  }}
                                                 style={{textAlign:"right"}}
                                                 className="form-control"
                                                 placeholder="₱"/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Challenge Quota</span>
                                    </div>
                                            <NumberFormat 
                                                value={this.state.challenge_quota}
                                                thousandSeparator={true}
                                                suffix={'%'}
                                                onValueChange={(values) => {
                                                    const {formattedValue, value} = values;
                                                    this.setState({challenge_quota: value?value:0})
                                                  }}
                                                 style={{textAlign:"right"}}
                                                 className="form-control"
                                                 placeholder="%"/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:20}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Designation</span>
                                    </div>
                                        <select value={this.state.designation} onChange={this.onChange} name="designation" className="form-control dropdown-toggle" >
                                            <option value="1">Project Base</option>
                                            <option value="2">Dedicated</option>
                                        </select>
                                    </div>
                    </div>
                        
                    <div className="col-md-6">
                        <br/>
                                <div className="input-group mb-3" style={{marginTop:19}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Assignment *</span>
                                    </div>
                                    <input 
                                        onChange={this.onChange}
                                        className="form-control"
                                        type="text"
                                        name="assignment"
                                        value={this.state.assignment}/>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Status</span>
                                        </div>
                                        <select value={this.state.employee_type} onChange={this.onChange} name="employee_type" className="form-control dropdown-toggle" >
                                            <option value="1">With Contract</option>
                                            <option value="2">Open Contract</option>
                                        </select>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{background:'#db3d44',color:'white'}}>Employment Status</span>
                                        </div>
                                        <select value={this.state.employment_status} onChange={this.onChange} name="employment_status" className="form-control dropdown-toggle" >
                                            <option value="1">Trainee</option>
                                            <option value="2">Regular</option>
                                            <option value="3">Resigned</option>
                                            <option value="4">End of Contract</option>
                                        </select>
                                    </div>

                                    <div className="form-check form-check-inline" style={{float:"left"}}>
                                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="1" onChange={this.onCheckResigned} checked={this.state.Checkresigned}/>
                                        <label className="form-check-label">Resigned</label>
                                    </div>
                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Resignation Date</span>
                                    </div>
                                    {this.state.Checkresigned ? 
                                        <DatePicker
                                            selected={this.state.Start_DateResignation}
                                            onChange={this.onChangeDate_resignation}
                                            className="form-control"
                                            name="resignation_date"
                                        />
                                        :
                                        <input type="text" className="form-control" style={{maxWidth:204}} readOnly/>}
                                    </div>

                                    <div className="form-check form-check-inline" style={{float:"left"}}>
                                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="1" onChange={this.onCheckEndofContract} checked={this.state.Checkendofcontract}/>
                                        <label className="form-check-label">End of Contract</label>
                                    </div>
                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>End of Contract</span>
                                    </div>
                                    {this.state.Checkendofcontract ?
                                            <DatePicker
                                            selected={this.state.Start_DateEndOfContract}
                                            onChange={this.onChangeDate_end_of_contract}
                                            className="form-control"
                                            name="end_of_contract"
                                            />
                                            :
                                            <input type="text" className="form-control" style={{maxWidth:204}}readOnly/>}
                                    </div> 


                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:220,width:150, background:'#db3d44',color:'white'}}>Remarks</span>
                                        <textarea
                                            onChange={this.onChange}
                                            className="form-control"
                                            name="remarks"
                                            value={this.state.remarks}
                                            aria-label="Default" 
                                            aria-describedby="inputGroup-sizing-default"/>
                                            </div>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Flexi</span>
                                    </div>
                                        <select value={this.state.flexi} onChange={this.onChange} name="flexi" className="form-control dropdown-toggle" >
                                            <option value="1">No</option>
                                            <option value="2">Yes</option>
                                        </select>
                                    </div>

                                <div className="input-group mb-3" style={{marginTop:10}}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150, background:'#db3d44',color:'white'}}>Work Schedule</span>
                                    </div>
                                        <select value={this.state.schedule_id} onChange={this.onChange} name="schedule_id" className="form-control dropdown-toggle" >
                                                {this.state.schedule_format.map((schedule)=>
                                                    <option key={schedule.id} value={schedule.id}>{schedule.schedule}</option>
                                                )}
                                        </select>
                            </div>
                            
                    </div>        
            </div>
        </div> 

        );
    }
}