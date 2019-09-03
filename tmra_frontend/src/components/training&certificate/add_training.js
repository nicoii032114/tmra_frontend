import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import DatePicker from 'react-datepicker';  
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'
import ExpensesList from './expenseslist.js';
import EmployeeList from './employeelist.js';
//MATERIL UI TIMEPICKER
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
//ICONS
import AddIcon from '@material-ui/icons/AddBox';
import ResetIcon from '@material-ui/icons/Autorenew';
import UpdateIcon from '@material-ui/icons/Update';
import SearchIcon from '@material-ui/icons/Search';

var user_id = ''; //USERLOG ID

export default class AddTraining extends Component{
    
        _isMounted = false
        constructor(props) {
            super(props);
                
            this.state = {
                startDate: new Date(),
                training_data:[],
                training_id:'',
                name:'',
                date:moment(new Date()).format("YYYY-MM-DD"),
                time:'',
                speaker:'',
                venue:1,
                address:'',

                id:[],
                newAdded_id:[], //ID after adding new training
                emp_tbl_id:'',
                employeeList:[],
                employee_data:[],
                firstname:'',
                middlename:'',
                lastname:'',
                
                trainingList:[],

                showDropdown:false,
                showUpdateBtn:false,
                showAddress:false,
                showList:false,

                selectedDate:new Date(),
            };
        }

        componentDidMount(){
            this.setState({training_id:this.props.match.params.id})
            this._isMounted = true;
            if(this.props.match.params.id !== undefined){
                this.getTrainingData()
                this.setState({
                    showDropdown:true
                })
            }

            axios.get('http://'+window.location.hostname+':8000/training/')
            .then(res => {
                if(this._isMounted){
                    this.setState({
                        trainingList:res.data
                    })
                }
            }) 
            
            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            })

        }
        
        componentWillUnmount() {
            this._isMounted = false;
          }

        scrollToBottom(){
            var element = document.getElementById("bottom");
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
          }

        getTrainingData(){
            this.scrollToBottom();
            axios.get('http://'+window.location.hostname+':8000/training/'+this.props.match.params.id+'/')
            .then(res => {
                if (this._isMounted) {
                this.setState({
                    training_data:res.data,
                    showAddBtn:false,
                    showUpdateBtn:true,
                    showList:true,
                })
            }

                this.setState({
                    name:this.state.training_data.training,
                    date:this.state.training_data.date,
                    selectedDate:this.state.training_data.timeDisplay,
                    speaker:this.state.training_data.speaker,
                    venue:this.state.training_data.venue,
                    address:this.state.training_data.address
                })
                if(this.state.venue == 2){
                    this.setState({showAddress:true})
                }else{
                    this.setState({showAddress:false})
                }

    
                  var dateEmpTokens = this.state.date.split("-");
                  //creating date object from specified year, month, and day
                  var dateDisplay = new Date(dateEmpTokens[0],dateEmpTokens[1]-1,dateEmpTokens[2]);
                  this.setState({startDate:dateDisplay})
  
            })
        }

        onChangeDate = date => {
            this.setState({date:date})
            var dateformat = moment(date).format("YYYY-MM-DD")
            this.setState({
                startDate:date,         //updating the date picker(modal add)
                date:dateformat
            })
        }
        
        handleDateChange = date => {
            this.setState({
                selectedDate:date
            })
        }

        onChange = e => {
            this.setState({ [e.target.name]: e.target.value });

            if(e.target.name === "venue"){
                if(e.target.value === "2"){
                    this.setState({showAddress:true})
                }else{
                    this.setState({showAddress:false})
                }
            }
        }

        onSubmitTraining = e => {
             //e.preventDefault();
             const data = new FormData();
             data.set('training', this.state.name)
             data.set('date', this.state.date)
             data.set('time', moment(this.state.selectedDate).format("h:mm a"))
             data.set('timeDisplay', this.state.selectedDate)
             data.set('speaker', this.state.speaker)
             data.set('venue', this.state.venue)
             data.set('address', this.state.address)
             if(this.state.showAddress === true && this.state.address === ''){
                Swal.fire('Oops...','Fields may not be blank!','error')
             }else{
             axios.post('http://'+window.location.hostname+':8000/training/',data)
                 .then(res => {
                        const data = new FormData();
                        data.set('user', user_id)
                        data.set('description', "Added Training Name: "+ this.state.name)
                        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                        data.set('action', "ADD")
                        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                        .then(res => {
                        })
                    Swal.fire('Added!','Training has been added.','success')
                    this.setState({
                        showAddBtn:false, 
                        showUpdateBtn:true, 
                        showList:true,
                    })
                    var arrayID=[]
                    axios.get('http://'+window.location.hostname+':8000/training/')
                    .then(res => {
                            this.setState({
                                trainingList:res.data
                            })
                            this.state.trainingList.map((ids)=>{
                                arrayID.push(ids.id)
                            })
                            this.props.history.push('/trainingform/'+Math.max(...arrayID)+'/')
                            this.scrollToBottom();
                        })
             })
                .catch(error => {
                    if(error.response.data.speaker || error.response.data.training_duration || error.response.data.venue){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else if(error.response.data.training){
                        Swal.fire('Oops...','Training name already exist!','error')
                    }else{
                        Swal.fire('Oops...','Something went wrong!','error')
                    }
                }); 
            }
        }

        //UPDATING  DATA
       onUpdateTraining = e => {
             const data = new FormData();
             data.set('training', this.state.name)
             data.set('date', this.state.date)
             data.set('time', moment(this.state.selectedDate).format("h:mm a"))
             data.set('timeDisplay', this.state.selectedDate)
             data.set('speaker', this.state.speaker)
             data.set('venue', this.state.venue)
             
             if(this.state.showAddress === true && this.state.address === ''){
                Swal.fire('Oops...','Fields may not be blank!','error')
             }else{
                if(this.state.showAddress === true){
                    data.set('address', this.state.address)
                }else{
                    data.set('address', '')
                }
                axios.put('http://'+window.location.hostname+':8000/training/'+this.state.training_id+'/',data)
                    .then(res => {
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Updated Training Name: "+ this.state.name)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "UPDATE")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })
                        Swal.fire('Updated!','Training has been updated!','success')
                        axios.get('http://'+window.location.hostname+':8000/training/')
                        .then(res => {
                                this.setState({
                                    trainingList:res.data
                                })
                            })
                    })
            }
     }

       onUpdateClicked = e =>{
        this.setState({
            showDropdown:true,
            showUpdateBtn:true,
            training_id:false,
            })
        }

        onChangeTraining = e =>{
            this.setState({
                training_id:e.target.value,
                showList:true,
            })
            axios.get('http://'+window.location.hostname+':8000/training/'+e.target.value+'/')
            .then(res => {
                if(this._isMounted){
                    this.setState({
                        training_data:res.data,
                    })
                }
                this.setState({
                    name:this.state.training_data.training,
                    date:this.state.training_data.date,
                    selectedDate:this.state.training_data.timeDisplay,
                    speaker:this.state.training_data.speaker,
                    venue:this.state.training_data.venue,
                    address:this.state.training_data.address
                })
                if(this.state.venue == 2){
                    this.setState({showAddress:true})
                }else{
                    this.setState({showAddress:false})
                }

    
                var dateEmpTokens = this.state.date.split("-");
                //creating date object from specified year, month, and day
                var dateDisplay = new Date(dateEmpTokens[0],dateEmpTokens[1]-1,dateEmpTokens[2]);
                this.setState({startDate:dateDisplay})
                //this.props.history.push("/trainingform/"+this.state.training_id+"/")
            })
        }

        onSubmitClicked = e =>{
            this.setState({
                showDropdown:false,
                showUpdateBtn:false,
                showList:false,
                name:'',
                startDate:new Date(),
                selectedDate:new Date(),
                speaker:'',
                venue:'',
                address:''
            })
            this.props.history.push("/trainingform")
        }

    render(){
        return(
            <div className="container" id="bottom">
                <div className="row">                 
                    <div className="container-fluid">
                      <center><div style={{width:700}}>
                      <h3 style={{marginTop:20,}}><b>TRAINING</b></h3>
                      <h5 style={{float:"left"}}><Link to="/trainingcertificate">List</Link> / <Link to="/trainingform">Form</Link></h5>
                        <br/>
                        <br/>
                {this.state.showDropdown ? <button onClick={this.onSubmitClicked} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10}}><b><AddIcon/>ADD</b></button>:
                                        <button onClick={this.onSubmitTraining} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10}}><b><AddIcon/>ADD</b></button>}
                {this.state.showUpdateBtn ?<button onClick={this.onUpdateTraining} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10,marginLeft:10}}><b><UpdateIcon/>UPDATE</b></button>:
                                            <button onClick={this.onUpdateClicked} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10,marginLeft:10}}><b><UpdateIcon/>UPDATE</b></button>}
                                    
                                    
                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Seminar/Event ID *</span>
                                            </div>
                    {this.state.showDropdown ? <select value="0" onChange={this.onChangeTraining} name="blood_type" className="form-control dropdown-toggle" >
                                                    {this.state.training_id?<option>{this.state.name}</option>:<option value="0">SELECT TRAINING</option>}
                                                    {this.state.trainingList.map((training)=>
                                                        <option value={training.id} key={training.id}>{training.training}</option>
                                                    )}
                                                </select>:<input type="text" name="name" value={this.state.name} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>}
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Date</span>
                                            </div>
                                                <DatePicker selected={this.state.startDate} onChange={this.onChangeDate} timeFormat="HH:mm" className="form-control"/>  
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Time</span>
                                            </div>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <Grid container style={{width:600,marginTop:-50,marginLeft:-15}} justify="space-around">
                                                        <KeyboardTimePicker
                                                        margin="normal"
                                                        id="mui-pickers-time"
                                                        value={this.state.selectedDate}
                                                        onChange={this.handleDateChange}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change time',
                                                        }}
                                                        />
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
                                        </div>
                                    
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Speaker *</span>
                                            </div>
                                            <input type="text" name="speaker" value={this.state.speaker} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Venue</span>
                                            </div>
                                            <select value={this.state.venue} onChange={this.onChange} name="venue" className="form-control dropdown-toggle">
                                                <option value="1">In Company</option>
                                                <option value="2">Outside</option>
                                            </select>
                                        </div>

                                     {this.state.showAddress?  <div className="input-group-prepend" style={{marginBottom:12}}>
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Complete Address *</span>
                                            <textarea name="address" value={this.state.address} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>:null} 
                        </div></center> 
                        <br/>
                        <br/>
                        <br/>
                        {this.state.showList ? <div>
                                                    <h3>Employee List</h3>
                                                    <EmployeeList training_id={this.state.training_id}/>
                                                    <br/>
                                                    <br/>
                                                    <br/>
                                                    <h3>Expenses List</h3>
                                                    <ExpensesList training_id={this.state.training_id}/>
                                        </div>:null}
                            <div id="bottom"></div>
                                        
                    </div> 
             </div>
    </div>
        );
    }
}   