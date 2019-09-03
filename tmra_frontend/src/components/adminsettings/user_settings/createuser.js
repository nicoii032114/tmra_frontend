import React, { Component } from 'react'
import {Link, withRouter} from "react-router-dom";
import axios from 'axios';
import Logo from './addimage.png';
import Swal from 'sweetalert2';
import Autosuggest from 'react-autosuggest';
import moment from 'moment';
//ICONS
import ViewIcon from '@material-ui/icons/RemoveRedEye'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import BackIcon from '@material-ui/icons/ArrowBack'

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

var user_id = ''; //USERLOG ID

//AUTO SUGGESTION AREA
var nameList = [];
var employeeID = '';
var employee_tbl_id = '';
var image = '';
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return nameList.filter(names => regex.test(names.name));
}

function getSuggestionValue(suggestion) {
    employeeID = suggestion.employeeID
    employee_tbl_id = suggestion.id
    image = suggestion.image
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class CreateUser extends Component {

    _isMounted = false;

    constructor(props, context) {
        super(props, context);
        this.state = {
            user_tbl_id:'',
            user_data:[],
            user_ids:[],
            last_id:'',

            emp_tbl_id:'',
            employeeID:'',
            firstname:'',
            middlename:'',
            lastname:'',

            position_id:'',
            position:'',

            id:'',
            password:'',
            confirmpassword:'',
            token:'',
            prevToken:'',
            user_type:3,

            selected:'',

            showBtnSubmit:true,
            showBtnUpdate:false,

            hiddenPass:true, //SHOW HIDE PASSWORD
            hiddenConfirm:true,

            images:[],
            imageBol:false,

            handleError:'',

            employee_data:[],
            value:'',
            suggestions:[],
        };
        this.showPassword = this.showPassword.bind(this);
        this.onChange = this.onChange.bind(this);
    }

        //ON LOAD
        componentDidMount() {
            console.log(this.props.match.params.id)
            this.setState({user_tbl_id:this.props.match.params.id})
            if(this.props.match.params.id !== undefined){
                image = ''
                this.onGetuserdata();
            }
            this._isMounted = true;
            axios.get('http://'+window.location.hostname+':8000/employee/')
            .then(res => {
                    this.setState({
                        employee_data: res.data
                    })
                    nameList = [];
                    this.state.employee_data.map((employee)=>{
                        nameList.push({id:employee.id, employeeID:employee.employeeID, name:employee.firstname+' '+employee.lastname, image: employee.image})
                    })
                })
            
            axios.get('http://'+window.location.hostname+':8000/users/')
            .then(res => {
                    this.setState({
                        user_ids: res.data
                    })
                        var idList=[];
                        this.state.user_ids.map((ids)=>{
                            idList.push(ids.id)
                        })
                        this.setState({
                            last_id:idList.slice(-1)[0]+1
                        })                
                        console.log(this.state.last_id)
                })
            // Async with callback
            uidgen.generate((err, uid) => {
                if (err) throw err;
                this.setState({token:uid})
                console.log(uid)
            });
            
            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            }) 

        }

        componentWillUnmount() {
            this._isMounted = false;
            employee_tbl_id = ''
            employeeID = ''
            
          }

          onGetuserdata = e =>{
            axios.get('http://'+window.location.hostname+':8000/users/'+this.props.match.params.id)
            .then(res => {
                    this.setState({
                        user_data: res.data,
                        imageBol: true
                    })
                    this.setState({
                        showBtnSubmit:false,
                        showBtnUpdate:true,

                        images: this.state.user_data.employee_id.image,
                        employeeID: this.state.user_data.employee_id.employeeID,
                        emp_tbl_id: this.state.user_data.employee_id.id,
                        id: this.state.user_data.id,
                        password: this.state.user_data.password,
                        confirmpassword: this.state.user_data.password,
                        prevToken: this.state.user_data.token,
                        user_type: this.state.user_data.user_type
                    })
            })
          }

            //Adding data to each states name == input field name
            onChange = e => {
                this.setState({ [e.target.name]: e.target.value });
            }

            //AUTOSUGGEST AREA
            onSuggest = (event, { newValue, method }) => {
                this.setState({
                  value: newValue,
                    });
                };
              
                onSuggestionsFetchRequested = ({ value }) => {
                this.setState({
                  suggestions: getSuggestions(value)
                    });
                };
            
                onSuggestionsClearRequested = () => {
                this.setState({
                  suggestions: []
                    });
                };

                   
            onSubmit = e => {
                if (this.state.user_ids.some(item => employee_tbl_id == item.employee) == true){
                    Swal.fire('Oops...','User already taken!','error')
                }else{        
                    const data = new FormData();
                    data.set('employee', employee_tbl_id? employee_tbl_id:this.state.emp_tbl_id)
                    data.set('username', employeeID? employeeID:this.state.employeeID)
                    data.set('password', this.state.password)
                    data.set('token', this.state.token)
                    data.set('user_type', this.state.user_type)
                        if(this.state.password.length < 6 || this.state.confirmpassword.length < 6){
                            Swal.fire('Oops...','Password must be atleast 6 characters!','error')
                        }else if(this.state.password != this.state.confirmpassword){
                            Swal.fire('Oops...','Password did not match!','error')
                        }else{
                        axios.post('http://'+window.location.hostname+':8000/users/',data)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', employeeID? "Created User Account for Employee ID: "+employeeID:"Created User Account for Employee ID: "+this.state.employeeID)
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "CREATE")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Created!','User successfully created!','success')
                                    employeeID = '';
                                    employee_tbl_id = '';
                                    image = '';
                                this.props.history.push('/adminsettings/usersettings/createuser/'+this.state.last_id+'/')
                        })
                    
                    }
                }
            }

        onUpdate = e => {
            //e.preventDefault();
            if(this.state.password.length < 6 || this.state.confirmpassword.length < 6){
                Swal.fire('Oops...','Password must be atleast 6 characters!','error')
            }else if(this.state.password != this.state.confirmpassword){
                Swal.fire('Oops...','Password did not match!','error')
            }else{
                    const data = new FormData();
                    data.set('employee', this.state.emp_tbl_id)
                    data.set('username', this.state.employeeID)
                    data.set('password', this.state.password)
                    data.set('token', this.state.prevToken)
                    data.set('user_type', this.state.user_type)
                    axios.put('http://'+window.location.hostname+':8000/users/'+this.state.user_tbl_id+'/',data)
                        .then(res => {
                            axios.get('http://'+window.location.hostname+':8000/users/?id='+this.state.emp_tbl_id)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', "Updated User Account of Employee ID: "+this.state.employeeID)
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "UPDATE")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Updated!','User account has been updated.','success')
                                this.setState({
                                selectedID_useraccount: res.data,
                                }) 
                                        {this.state.selectedID_useraccount.map((users) => {
                                            this.setState({
                                                id:users.id,
                                                password:users.password,
                                                confirmpassword:users.password,
                                                user_type:users.user_type
                                            })
                                        })
                                    } 
                            })
                    })
                    .catch(error => {
                        if(error.response.data.name){
                            Swal.fire('Oops...','User already exist!','error')
                        }
                    }); 
                }
            }

            //DELETING DATA
            onDelete = e =>{
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                  }).then((result) => {
                    if (result.value) {
                        axios.delete('http://'+window.location.hostname+':8000/users/'+this.state.user_tbl_id)
                        .then(res => {
                                const data = new FormData();
                                data.set('username', user_id)
                                data.set('user', user_id)
                                data.set('description', "Deleted User Account of Employee ID: "+this.state.employeeID)
                                data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                data.set('action', "DELETE")
                                axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                .then(res => {
                                })
                            Swal.fire('Deleted!','Account has been deleted.','success')
                            this.props.history.push('/adminsettings/usersettings/')               
                        }) 
                    }
                  })    
            }

        showPassword = e =>{
            if(this.state.hiddenPass == true){
                this.setState({hiddenPass:false})
            }else{
                this.setState({hiddenPass:true})
            }
           
        }

        showConfirm = e =>{
            if(this.state.hiddenConfirm == true){
                this.setState({hiddenConfirm:false})
            }else{
                this.setState({hiddenConfirm:true})
            }
           
        }

    render(){
        if(this.state.handleError === 1){
            
        }else{
            if(this.props.error) {
                if(this.props.error.password1 !== undefined){
                    Swal.fire('Oops...',''+this.props.error.password1,'error')
                    this.setState({handleError:1})
                }else if(this.props.error.username !== undefined){
                    Swal.fire('Oops...',''+this.props.error.username,'error')
                    this.setState({handleError:1})
                }else{
                    Swal.fire('Oops...','Password did not match!','error')
                    this.setState({handleError:1})
                }
              }
        }
        return (
            <div className="container" >
                <div className="row">  
                        <div className="container-fluid">
                            <center>
                                <div className="col-md-6">
                                        <Link to="/adminsettings/usersettings/" style={{float:"left",marginTop:5}}><BackIcon/>Back</Link>
                                            <h3>Creating User Credentials</h3>
                                            <div className="row">
                                                <center><div className="col-md-6">
                                                    <div className="col-sm-8" style={{margin:0,textAlign:"center",marginLeft:80}} >
                                                     {this.state.imageBol?
                                                    <img alt='none' className="rounded-circle" style={{maxHeight:120,height:120,maxWidth:150,marginBottom:-30,border:"2px solid Black"}} src={this.state.images? this.state.images:Logo}/>:
                                                    <img alt='none' className="rounded-circle" style={{maxHeight:120,height:120,maxWidth:150,marginBottom:-30,border:"2px solid Black"}} src={image?image:Logo}/>
                                                    }      
                                                    </div>
                                                </div></center>
                                            </div>
                                        </div>
                                    </center>
                                        <br/>
                                        
                                    <center>
                                            <div className="col-md-6">
                                               {this.props.match.params.id? null:<div className="input-group mb-3" style={{marginTop:10}}>
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:100,background:'#db3d44',color:'white'}}>Name</span>
                                                        </div>
                                                        <Autosuggest 
                                                            suggestions={this.state.suggestions}
                                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                            getSuggestionValue={getSuggestionValue}
                                                            renderSuggestion={renderSuggestion}
                                                            inputProps={{
                                                                placeholder: "Search...",
                                                                value:this.state.value,
                                                                onChange: this.onSuggest
                                                            }}
                                                            className="form-control" />
                                                    </div>}
                                                <div className="input-group mb-3" style={{marginTop:10}}>
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:100,background:'#db3d44',color:'white'}}>Username</span>
                                                    </div>
                                                    <input type="text" name="username" value={this.state.employeeID?this.state.employeeID:employeeID} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" readOnly/>
                                                </div>

                                                <div className="input-group mb-3" style={{marginTop:10}}>
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:100,background:'#db3d44',color:'white'}}>Password</span>
                                                    </div>
                                                    <input type={this.state.hiddenPass ? "password" : "text"} name="password" onChange={this.onChange} value={this.state.password} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:50}}><a href="#" onClick={this.showPassword}>{this.state.hiddenPass?<ViewIcon/>:<VisibilityOffIcon/>}</a></span>
                                                        </div>
                                                </div>

                                                <div className="input-group mb-3" style={{marginTop:10}}>
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:100,background:'#db3d44',color:'white'}}>Confirm</span>
                                                    </div>
                                                    <input type={this.state.hiddenConfirm ? "password" : "text"} name="confirmpassword" onChange={this.onChange} value={this.state.confirmpassword} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:50}}><a href="#" onClick={this.showConfirm}>{this.state.hiddenConfirm?<ViewIcon/>:<VisibilityOffIcon/>}</a></span>
                                                            </div>
                                               </div>

                                                <div className="input-group mb-3" style={{marginTop:10}}>
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:100,background:'#db3d44',color:'white'}}>User type</span>
                                                    </div>
                                                    <select onChange={this.onChange} value={this.state.user_type} name="user_type" className="browser-default custom-select">
                                                                <option value="1">Administrator</option>
                                                                <option value="2">Supervisor</option>
                                                                <option value="3">Staff</option>
                                                    </select>
                                                </div>
                                                {this.state.showBtnSubmit ? <button onClick={this.onSubmit} type="submit" className="btn btn-primary form-control" style={{marginTop:20,background:"#6495ED"}}>CREATE</button>: null }
                                                {this.state.showBtnUpdate ?<button onClick={this.onUpdate} type="submit" className="btn btn-primary form-control" style={{marginTop:20,background:"#6495ED"}}>UPDATE</button> : null }
                                                {this.state.showBtnUpdate ?<button onClick={this.onDelete} type="submit" className="btn btn-danger form-control" style={{marginTop:5,background:"#db3d44"}}>DELETE</button> : null }
                                             

                                            </div>
                                        </center>
                                </div>
                        </div>
                </div>
        );
    }
}

export default withRouter(CreateUser)