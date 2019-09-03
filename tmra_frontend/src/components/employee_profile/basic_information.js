import React, { Component } from 'react';
import {Link, Redirect} from "react-router-dom";
import DatePicker from 'react-datepicker';  
import axios from 'axios';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import EmploymentInfo from './employment_info.js';
import EmploymentHistory from '../employment_history/employment_history.js';
import Training from '../training&certificate/traininglist_employee.js';
import Evaluation from '../evaluation/display_evaluation.js';
import Swal from 'sweetalert2'
import NumberFormat from 'react-number-format';
import Autosuggest from 'react-autosuggest';
//ICONS
import AddIcon from '@material-ui/icons/AddBox'
import ResetIcon from '@material-ui/icons/Autorenew';
import UpdateIcon from '@material-ui/icons/Update'
import SearchIcon from '@material-ui/icons/Search'
import Logo from './addimage.png';

var user_id = ''; //USERLOG ID
var employee_id = '';
var user_type = 3;
//AUTO SUGGESTION AREA
var nameList = [];
var employeeID = '';
var employee_tbl_id = '';

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
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}


export default class Basic_Information extends Component{
   
    _isMounted = false;

        constructor(props) {
            super(props);
                
            this.state = {
            startDate: new Date(),
            emp_tbl_id:'',
            employeeID:'',
            firstname: '',
            middlename: '',
            lastname: '',
            address: '',
            contact_number:'',
            gender:0,
            birthday:'',
            age:'',
            citizenship:'',
            height:'',
            weight:'',
            blood_type:0,
            status:0,
            images: [],
            selectedFile: null,

            employee:[],
            employee_data:[],
            employee_list:[],
            employmentdetails:[],
            employmentRolesResponsID:'',
            

            selectedID_employee:[],

            showNav:false,
            showBtmNav:false,
            showUpdateBtn:false,
            showDropdown:false,

            showEmploymentInfo:false,
            showPosition:false,
            showTraining:false,
            showEvaluation:false,

            imageSelected:false,
            LogoConverted: null,

            //AUTOSUGGEST VARIABLES
            value:'',
            suggestions:[],

            };
            this.handleChangeAge = this.handleChangeAge.bind(this);
        
        }
        
        componentDidMount() {
            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                    res.data.map((id)=>{
                        user_id = id.id
                        user_type=id.user_type
                        employee_id = id.employee_id.id
                    })
                    if(user_type === 3){
                        this.getStaffData(employee_id)
                    }else{

                    }

            })
            
            //CONVERTING THE LOGO into UPLOADABLE FILE
            var image = document.getElementById("imageto")
            fetch(image.src)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'default.png', blob)
                this.setState({LogoConverted:file})
            })
            this.setState({emp_tbl_id:this.props.match.params.id, showEmploymentInfo:true,})
            this._isMounted = true;
            if(this.props.match.params.id !== undefined){
                this.setState({showBtmNav:true})
                this.getEmployeeData();
            }

            axios.get('http://'+window.location.hostname+':8000/employee/')
            .then(res => {
                this.setState({
                    employee_list:res.data
                })
                nameList = [];
                this.state.employee_list.map((employee)=>{
                    nameList.push({id:employee.id, employeeID:employee.employeeID, name:employee.firstname})
                })
            })

            
        }

        componentWillUnmount() {
            this._isMounted = false;
          }

                //AUTOSUGGEST AREA
                onChangeFirstname = (event, { newValue, method }) => {
                    this.setState({
                    value: newValue
                        })
                        axios.get('http://'+window.location.hostname+':8000/employee/?firstname='+newValue)
                        .then(res => {
                            if (this._isMounted) {
                                this.setState({
                                    showUpdateBtn:true,
                                    showAddBtn:false,
                                    showNav:true,
                                    showEmploymentInfo:true,
                                    showDropdown:true,
                                })
                                res.data.map((employee)=>{
                                    this.setState({
                                        emp_tbl_id:employee.id,
                                        employeeID:employee.employeeID,
                                        firstname:employee.firstname,
                                        middlename:employee.middlename,
                                        lastname:employee.lastname,
                                        address:employee.address,
                                        contact_number:employee.contact_number,
                                        gender:employee.gender,
                                        citizenship:employee.citizenship,
                                        height:employee.height,
                                        weight:employee.weight,
                                        blood_type:employee.blood_type,
                                        status:employee.status,
                                        birthday: employee.birthday,
                                        age:employee.age,
                                        images:employee.image,
                    
                                        imageSelected:true
                                       
                                    })
                                    var dateTokens = employee.birthday.split("-")
                                    //creating date object from specified year, month, and day
                                    var bdate = new Date(dateTokens[0],dateTokens[1]-1,dateTokens[2]);
                                    this.setState({startDate:bdate}) //CHANGING STARTDATE ON DATEPICKER INTO BIRTHDATE
                                    this.props.history.push("/employeeform/"+employee.id+"/")
                                })
                               
                            }
                        })
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

        
        scrollToBottom(){
            var element = document.getElementById("bottom");
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
          }

        getEmployeeData(){
            this.scrollToBottom();
            axios.get('http://'+window.location.hostname+':8000/employee/'+this.props.match.params.id+'/')
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                        employee:res.data,
                        showUpdateBtn:true,
                        showAddBtn:false,
                        showNav:true,
                        showEmploymentInfo:true,
                        showDropdown:true,
                    });
                }
               
                this.setState({
                    employeeID:this.state.employee.employeeID,
                    firstname:this.state.employee.firstname,
                    value:this.state.employee.firstname, //autosuggest variable
                    middlename:this.state.employee.middlename,
                    lastname:this.state.employee.lastname,
                    address:this.state.employee.address,
                    contact_number:this.state.employee.contact_number,
                    gender:this.state.employee.gender,
                    citizenship:this.state.employee.citizenship,
                    height:this.state.employee.height,
                    weight:this.state.employee.weight,
                    blood_type:this.state.employee.blood_type,
                    status:this.state.employee.status,
                    birthday: this.state.employee.birthday,
                    age:this.state.employee.age,
                    images:this.state.employee.image,

                    imageSelected:true
                   
                })
                var dateTokens = this.state.employee.birthday?this.state.employee.birthday.split("-"):moment(new Date()).format("YYYY-MM-DD");
                //creating date object from specified year, month, and day
                var bdate = new Date(dateTokens[0],dateTokens[1]-1,dateTokens[2]);
                this.setState({startDate:bdate}) //CHANGING STARTDATE ON DATEPICKER INTO BIRTHDATE
            })
        }

     //AGE CALCULATION AREA
      handleChangeAge(date) {
            if(date === null){

            }else{
                var ageDifMs = Date.now() - date.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                var total = Math.abs(ageDate.getUTCFullYear() - 1970);
                var dateformat = moment(date).format("YYYY-MM-DD")
                this.setState({
                startDate: date,
                age: total,
                birthday: dateformat,
                });
            }
        }

      //FILE HANDLING AREA AND IMAGE VALIDATION
      fileSelectedHandler = event =>{
        var file = event.target.files[0];
        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        const files = Array.from(event.target.files)
        const formData = new FormData()
        const types = ['image/png', 'image/jpeg', 'image/gif']
        files.forEach((file, i) => {
            if (types.every(type => file.type !== type)) {
            alert(`'${file.type}' is not a supported format`)
                event.target.value=null;
                this.setState({
                    images: null,
                    showButton: false,
                })
            }else if (file.size > 1500000) {
                alert(`'${file.name}' is too large, please pick a smaller file`)
                event.target.value=null;
                this.setState({
                    images: null,
                    showButton: false,
                })
            }else{
            formData.append(i, file)
            reader.onloadend = () => {
                this.setState({
                imageSelected:true,
                images: [reader.result],
                selectedFile: file
                });
            
                console.log(this.state.selectedFile)
                }

             }
         })
     }
        
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onPick = e => {
        if(e.target.value === "1"){
            this.setState({
                showEmploymentInfo:true,
                showPosition:false,
                showTraining:false,
                showEvaluation:false,
            })
        }else if(e.target.value === "2"){
            this.setState({
                showEmploymentInfo:false,
                showPosition:true,
                showTraining:false,
                showEvaluation:false,
            })
        }else if(e.target.value === "3"){
            this.setState({
                showEmploymentInfo:false,
                showPosition:false,
                showTraining:true,
                showEvaluation:false,
            })
        }else{
            this.setState({
                showEmploymentInfo:false,
                showPosition:false,
                showTraining:false,
                showEvaluation:true,
            })
        }
    }
  
         //ADDING EMPLOYEE DATA
        onSubmit = e => {
            //e.preventDefault();
            if(this.state.employee_list.some(item => this.state.employeeID == item.employeeID) == true){
                Swal.fire('Oops...','Employee ID is already taken!','error')
            }else{
            const data = new FormData();
            data.set('employeeID', this.state.employeeID)
            data.set('firstname', this.state.firstname)
            data.set('middlename', this.state.middlename)
            data.set('lastname', this.state.lastname)
            data.set('address', this.state.address)
            data.set('contact_number', this.state.contact_number)
            data.set('gender', this.state.gender)
            data.set('birthday', this.state.birthday)
            data.set('age', this.state.age)
            data.set('citizenship', this.state.citizenship)
            data.set('height', this.state.height)
            data.set('weight', this.state.weight)
            data.set('blood_type', this.state.blood_type)
            data.set('status', this.state.status)
            data.set('image',this.state.selectedFile?this.state.selectedFile:this.state.LogoConverted)
          
                axios.post('http://'+window.location.hostname+':8000/employee/',data)
                .then(res => {
                    Swal.fire('Added!','Employee has been added.','success')
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Added Employee ID: "+this.state.employeeID)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "ADD")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })

                            var arrayID = []
                            axios.get('http://'+window.location.hostname+':8000/employee/')
                                .then(res => {
                                    this.setState({
                                        employee_data:res.data,
                                    })
                                    this.state.employee_data.map((employee)=>{
                                        arrayID.push(employee.id)
                                    })
                                    
                                    this.props.history.push('/employeeform/'+arrayID.slice(-1)[0]+'/');
                                    this.scrollToBottom();

                                })    
                })
                .catch(error => {
                    if(error.response.data.employeeID || error.response.data.firstname || error.response.data.middlename
                        || error.response.data.lastname || error.response.data.address || error.response.data.contact_number
                        || error.response.data.gender || error.response.data.citizenship){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else if(error.response.data.birthday){ 
                        Swal.fire("Oops...", "Select your birthdate.", "error");
                    }else{
                        Swal.fire('Oops...','Something went wrong!','error')
                    }
                })
            
        }
    }

            //UPDATING EMPLOYEE DATA
            onUpdate = e => {
                //e.preventDefault();
                const data = new FormData();
                data.set('employeeID', this.state.employeeID)
                data.set('firstname', this.state.firstname)
                data.set('middlename', this.state.middlename)
                data.set('lastname', this.state.lastname)
                data.set('address', this.state.address)
                data.set('contact_number', this.state.contact_number)
                data.set('gender', this.state.gender)
                data.set('birthday', this.state.birthday)
                data.set('age', this.state.age)
                data.set('citizenship', this.state.citizenship)
                data.set('height', this.state.height)
                data.set('weight', this.state.weight)
                data.set('blood_type', this.state.blood_type)
                data.set('status', this.state.status)
                if(this.state.selectedFile === null){
                }else{
                data.append('image', this.state.selectedFile)
                }
                axios.put(this.state.employee.id?'http://'+window.location.hostname+':8000/employee/'+this.state.employee.id+'/':'http://'+window.location.hostname+':8000/employee/'+this.state.emp_tbl_id+'/',data)
                .then(res => {
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Updated Employee ID: "+this.state.employeeID)
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "UPDATE")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })
                    Swal.fire('Updated!','Employee has been updated.','success')
                })
                .catch(error => {
                    if(error.response.data.employeeID || error.response.data.firstname || error.response.data.middlename
                        || error.response.data.lastname || error.response.data.address || error.response.data.contact_number
                        || error.response.data.gender || error.response.data.citizenship){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else if(error.response.data.birthday){
                        Swal.fire("Oops...", "Select your birthdate.", "error");
                    }else{
                        Swal.fire('Oops...','Something went wrong!','error')
                    }
                });
        }

        onUpdateClicked = e =>{
                this.setState({
                    showDropdown:true,
                    showUpdateBtn:true,
                })
           }
        
        onChangeEmployee = e =>{
            axios.get('http://'+window.location.hostname+':8000/employee/'+e.target.value+'/')
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                        employee: res.data,
                        showNav:true,
                        showBtmNav:true,
                        showEmploymentInfo:true,
                    });
                    this.setState({
                        emp_tbl_id:this.state.employee.id,
                        employeeID:this.state.employee.employeeID,               
                        firstname:this.state.employee.firstname,
                        value:this.state.employee.firstname, //autosuggestion variable
                        middlename:this.state.employee.middlename,
                        lastname:this.state.employee.lastname,
                        address:this.state.employee.address,
                        contact_number:this.state.employee.contact_number,
                        gender:this.state.employee.gender,
                        citizenship:this.state.employee.citizenship,
                        height:this.state.employee.height,
                        weight:this.state.employee.weight,
                        blood_type:this.state.employee.blood_type,
                        status:this.state.employee.status,
                        birthday: this.state.employee.birthday,
                        age:this.state.employee.age,
                        images:this.state.employee.image,
                        imageSelected:true
                    })
                    var dateTokens = this.state.employee.birthday.split("-");
                    //creating date object from specified year, month, and day
                    var bdate = new Date(dateTokens[0],dateTokens[1]-1,dateTokens[2]);
                    this.setState({startDate:bdate}) //CHANGING STARTDATE ON DATEPICKER INTO BIRTHDATE
                   // this.props.history.push("/employeeform/"+this.state.emp_tbl_id+"/")
                }   
            })
        }

        getStaffData(e){
            axios.get('http://'+window.location.hostname+':8000/employee/'+e+'/')
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                        employee: res.data,
                        showNav:true,
                        showBtmNav:true,
                        showEmploymentInfo:true,
                    });
                    this.setState({
                        emp_tbl_id:this.state.employee.id,
                        employeeID:this.state.employee.employeeID,               
                        firstname:this.state.employee.firstname,
                        value:this.state.employee.firstname, //autosuggestion variable
                        middlename:this.state.employee.middlename,
                        lastname:this.state.employee.lastname,
                        address:this.state.employee.address,
                        contact_number:this.state.employee.contact_number,
                        gender:this.state.employee.gender,
                        citizenship:this.state.employee.citizenship,
                        height:this.state.employee.height,
                        weight:this.state.employee.weight,
                        blood_type:this.state.employee.blood_type,
                        status:this.state.employee.status,
                        birthday: this.state.employee.birthday,
                        age:this.state.employee.age,
                        images:this.state.employee.image,
                        imageSelected:true
                    })
                    var dateTokens = this.state.employee.birthday.split("-");
                    //creating date object from specified year, month, and day
                    var bdate = new Date(dateTokens[0],dateTokens[1]-1,dateTokens[2]);
                    this.setState({startDate:bdate}) //CHANGING STARTDATE ON DATEPICKER INTO BIRTHDATE
                   // this.props.history.push("/employeeform/"+this.state.emp_tbl_id+"/")
                }   
            })
        }

        onSubmitClicked = e =>{
            this.setState({
                showDropdown:false,
                showUpdateBtn:false,
                emp_tbl_id:false,
                employeeID:'',
                firstname: '',
                middlename: '',
                lastname: '',
                address: '',
                contact_number:'',
                gender:0,
                birthday:'',
                age:'',
                citizenship:'',
                height:'',
                weight:'',
                blood_type:0,
                status:0,
                images: [],
                selectedFile: null,
                imageSelected:false,
                showBtmNav:false,
                value:''
            })
            this.props.history.push("/employeeform")
        }

    render(){
        var {images} = this.state;
        var $imagePreview = null;
        if({images} != null) {
          $imagePreview = (<center><img alt="" className="rounded-circle" style={{maxHeight:100,maxWidth:100,marginBottom:-60, marginTop:60,marginRight:this.state.showUpdateBtn?112:170}} src={images}/></center>);
        }
        return(  
    <div className="container">
                    <div className="row">                 
                        <div className="col-md-6">
        {user_type === 3 ? null:<h5><Link to="/employeelist">List</Link> / <Link to="/employeeform">Form</Link></h5>}
        {user_type === 3 ? null:<h3 style={{marginTop:10,marginBottom:-10}}>
        {this.state.showDropdown ? <button onClick={this.onSubmitClicked} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10}}><b><AddIcon/>ADD</b></button>:
                                    <button onClick={this.onSubmit} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10}}><b><AddIcon/>SAVE</b></button>}
        
        {this.state.showUpdateBtn ? <button onClick={this.onUpdate} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10,marginLeft:10}}><b><UpdateIcon/>UPDATE</b></button>:
                                    <button onClick={this.onUpdateClicked} type="submit" className="btn btn-primary" style={{float:"left",marginBottom:10,marginLeft:10}}><b><UpdateIcon/>UPDATE</b></button>}      
                                </h3>}
                                        {$imagePreview}
                                        <input style={{display:'none'}} type="file" onChange = {this.fileSelectedHandler} name="image" id=""ref={fileInput => this.fileInput = fileInput}/>
                                        <br/><br/>
                                         {this.state.imageSelected? <br/>:<center><img alt="upload" onClick={() => this.fileInput.click()} className=".img-rounded" src={Logo} style={{height:100}} id="imageto"/></center>}
                                            <center><p onClick={() => this.fileInput.click()} style={{marginBottom:-5}}><b>CHOOSE PICTURE</b></p></center>
                                        

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Employee ID *</span>
                                            </div>
                    {this.state.showDropdown ? <select value={this.state.emp_tbl_id?this.state.emp_tbl_id:"0"} onChange={this.onChangeEmployee} name="employeeID" className="form-control dropdown-toggle" >
                                                     {this.state.emp_tbl_id ?<option value="0">{this.state.employeeID}</option>:<option value="0">SELECT ID</option>}
                                                    {this.state.employee_list.sort((a,b) => a["id"]>b["id"]?1:1).map((employee)=>
                                                        <option value={employee.id} key={employee.id}>{employee.employeeID}</option>
                                                        
                                                    )}
                                                </select>:<input type="text" name="employeeID" value={this.state.employeeID} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>}
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>First Name *</span>
                                            </div>
                                            {this.state.showDropdown ? 
                                                <Autosuggest 
                                                    suggestions={this.state.suggestions}
                                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                    getSuggestionValue={getSuggestionValue}
                                                    renderSuggestion={renderSuggestion}
                                                    inputProps={{
                                                        placeholder: "Search...",
                                                        value:this.state.value,
                                                        onChange: this.onChangeFirstname
                                                }} />
                                            :<input type="text" name="firstname" value={this.state.firstname} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>}
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Middle Name *</span>
                                            </div>
                                            <input type="text" name="middlename" value={this.state.middlename} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>
                                       
                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Last Name *</span>
                                            </div>
                                            <input type="text" name="lastname" value={this.state.lastname} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Address *</span>
                                            </div>
                                            <textarea name="address" value={this.state.address} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Contact Number *</span>
                                            </div>
                                                <NumberFormat 
                                                    value={this.state.contact_number}
                                                    format="+63 ###-####-###"
                                                    onValueChange={(values) => {
                                                        const {formattedValue, value} = values;
                                                        this.setState({contact_number: value})
                                                    }}
                                                    className="form-control"
                                                    placeholder="+63 ###-####-###"/>
                                        </div>
                            </div>
                                  
                            <div className="col-md-6">          
                                <h2 style={{marginTop:0, float:"right"}}>Employee Profile</h2>
                                <br/><br/>
                                <br/><br/><br/>

                                        <div className="input-group mb-3" style={{marginTop:20}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Gender</span>
                                            </div>
                                            <select value={this.state.gender} onChange={this.onChange} name="gender" className="form-control dropdown-toggle">
                                                <option value="0"></option>
                                                <option value="1">Male</option>
                                                <option value="2">Female</option>
                                            </select>
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Citizenship *</span>
                                            </div>
                                            <input type="text" name="citizenship" value={this.state.citizenship} onChange={this.onChange}  className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Height (cm) *</span>
                                            </div>
                                                <NumberFormat 
                                                    value={this.state.height}
                                                    suffix={' cm'}
                                                    onValueChange={(values) => {
                                                        const {formattedValue, value} = values;
                                                        this.setState({height: value})
                                                    }}
                                                    className="form-control"
                                                    placeholder="cm"/>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Weight (kg) *</span>
                                            </div>
                                                <NumberFormat 
                                                    value={this.state.weight}
                                                    suffix={' kg'}
                                                    onValueChange={(values) => {
                                                        const {formattedValue, value} = values;
                                                        this.setState({weight: value})
                                                    }}
                                                    className="form-control"
                                                    placeholder="kg"/>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Blood type</span>
                                            </div>
                                                <select value={this.state.blood_type} onChange={this.onChange} name="blood_type" className="form-control dropdown-toggle" >
                                                    <option value="0"></option>
                                                    <option value="1">A-Positive</option>
                                                    <option value="2">A-Negative</option>
                                                    <option value="3">B-Positive</option>
                                                    <option value="4">B-Negative</option>
                                                    <option value="5">AB-Positive</option>
                                                    <option value="6">AB-Negative</option>
                                                    <option value="7">O-Positive</option>
                                                    <option value="8">O-Negative</option>
                                                </select>
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Status</span>
                                            </div>
                                                <select value={this.state.status} onChange={this.onChange} name="status" className="form-control dropdown-toggle" >
                                                    <option value="1">Active</option>
                                                    <option value="2">Inactive</option>
                                                </select>
                                        </div>
                                        
                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Birthday *</span>
                                            </div>
                                                <DatePicker selected={this.state.startDate} onChange={this.handleChangeAge} className="form-control"/>  
                                        </div>

                                        <div className="input-group mb-3" style={{marginTop:10}}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:'#db3d44',color:'white'}}>Age</span>
                                            </div>
                                               <input type="text" value={this.state.age+" years old"} readOnly style={{textAlign:"center"}} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>  
                                        </div>
                            </div>
                                                
             {this.state.showBtmNav ? <center><div className="card-body">
                            <center><div className="card-header" style={{flexGrow:1,justifyContent:'center'}}>
                            <center> <ul className="nav" style={{float:"center"}}>
                                            <div>
                                                <li className="li">
                                                <button onClick={this.onPick} value="1" className="li" style={{width:230,backgroundColor:"#FF6347"}}>Employment Info</button>
                                                </li>
                                            </div>
                                            <div>
                                                <li className="li">
                                                <button onClick={this.onPick} value="2" className="li" style={{width:230,backgroundColor:"#FF6347"}}>Employment History</button>
                                                </li>
                                            </div>
                                            <div>
                                                <li className="li">
                                                <button onClick={this.onPick} value="3" className="li" style={{width:230,backgroundColor:"#FF6347"}}>Training</button>
                                                </li>
                                            </div>
                                            <div>
                                                <li className="li">
                                                <button onClick={this.onPick} value="4" className="li" style={{width:230,backgroundColor:"#FF6347"}}>Evaluation</button>
                                                </li>
                                            </div>
                                
                                            </ul></center>
                                            <br/>
                                            {this.state.showEmploymentInfo?<EmploymentInfo emp_tbl_id={this.state.emp_tbl_id?this.state.emp_tbl_id:this.state.employee.id}/>:null}
                                            {this.state.showPosition?<EmploymentHistory emp_tbl_id={this.state.emp_tbl_id?this.state.emp_tbl_id:this.state.employee.id}/>:null}
                                            {this.state.showTraining?<Training emp_tbl_id={this.state.emp_tbl_id?this.state.emp_tbl_id:this.state.employee.id}/>:null}
                                            {this.state.showEvaluation?<Evaluation emp_tbl_id={this.state.emp_tbl_id?this.state.emp_tbl_id:this.state.employee.id}/>:null}
                            </div></center>
                         </div></center> : null} 
                         <div id="bottom"></div>
                     </div> 
            </div>
                                       


        );
    }
}