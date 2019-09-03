import React, {Component} from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'
import Autosuggest from 'react-autosuggest';
import ReactTable from "react-table";
import moment from "moment";
//MATERIL UI TIMEPICKER
import 'date-fns';

//ICONS
import AddBox from '@material-ui/icons/AddBox';

var user_id = ''; //USERLOG ID
var training = '';

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

export default class EmployeeList extends Component{
        
    _isMounted = false
        constructor(props) {
            super(props);
                
            this.state = {
                employeeList:[],
                traineesList:[],
                materialdataEmployee:[],
                deleteEmployee:[], //FOR DELETE PURPOSES
                training_id:'',

                value: '',
                suggestions: []
            };
        }

        componentDidMount(){

            this.setState({training_id:this.props.training_id})
            if(this.props.training_id !== undefined){
                this.getEmployeeList()
            }
            axios.get('http://'+window.location.hostname+':8000/employee/')
            .then(res => {
                if(this._isMounted){
                    this.setState({
                        employeeList:res.data
                    })
                    nameList = [];
                    this.state.employeeList.map((employee)=>{
                        nameList.push({id:employee.id, employeeID:employee.employeeID, name:employee.firstname+' '+employee.lastname})
                    })
                }
         
            })
            this._isMounted=true

            axios.get('http://'+window.location.hostname+':8000/training/'+this.props.training_id+'/')
            .then(res => {
                training = res.data.training
            })  

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            })  

        }

            onChange = (event, { newValue, method }) => {
            this.setState({
              value: newValue
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

        componentWillReceiveProps({training_id}) {
            if(this._isMounted){
                this.setState({
                training_id:training_id
                })
            }
            if(training_id !== undefined){
                this.getEmployeeList()
            }
          }

        componentWillUnmount() {
            this._isMounted = false;
          }
          

        getEmployeeList(){
            var newList = [];
            axios.get('http://'+window.location.hostname+':8000/trainees/?id='+this.state.training_id)
            .then(res => {
                if(this._isMounted){
                    this.setState({
                        traineesList:res.data
                    })   
                    this.state.traineesList.map((employee) =>{
                        newList.push({id:employee.id,employeeID:employee.employee.employeeID, name: employee.employee.firstname + ' ' +employee.employee.lastname})
                    })
                    this.setState({
                        materialdataEmployee:newList,
                    })
                }
            })
        }

        onSubmitEmployee = e => {
            if (this.state.traineesList.some(item => employee_tbl_id == item.employee_id) == true){
                Swal.fire('Oops...','This Employee is already added!','error')
            }else{        
                    const data = new FormData();
                    data.set('training_id',this.state.training_id)
                    data.set('employee_id', employee_tbl_id)
                    axios.post('http://'+window.location.hostname+':8000/trainees/',data)
                    .then(res => {
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Added Employee (Employee ID: "+employeeID+") on Training: "+ training)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "ADD")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })
                        Swal.fire('Added!','Employee has been added.','success')
                        this.setState({value:''})
                        employeeID = ''
                        employee_tbl_id = ''
                        axios.get('http://'+window.location.hostname+':8000/trainees/?id='+this.state.training_id)
                        .then(res => {
                            var newList = [];
                            this.setState({traineesList:res.data})
                            this.state.traineesList.map((employee) =>{
                                newList.push({id:employee.id,employeeID:employee.employee.employeeID, name: employee.employee.firstname + ' ' +employee.employee.lastname})
                            })
                            this.setState({
                                materialdataEmployee:newList
                            })
                        })
                    })
                    .catch(error => {
                        if(error.response.data.employee_id){
                            Swal.fire('Oops...','Please select an Employee!','error')
                        }else{
                            Swal.fire('Oops...','Something went wrong!','error')
                        }
                })
            }
        }

        onDeleteEmployee(e, employeeID){
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
                axios.delete('http://'+window.location.hostname+':8000/trainees/'+e)
                .then(res => {
                        const data = new FormData();
                        data.set('user', user_id)
                        data.set('description', "Deleted Employee (Employee ID: "+employeeID+") on Training: "+ training)
                        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                        data.set('action', "DELETE")
                        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                        .then(res => {
                        })
                    Swal.fire('Deleted!','Employee has been deleted.','success')
                    var newList = [];
                    axios.get('http://'+window.location.hostname+':8000/trainees/?id='+this.state.training_id)
                    .then(res => {
                                this.setState({
                                    traineesList:res.data
                                })   
                                this.state.traineesList.map((employee) =>{
                                    newList.push({id:employee.id,employeeID:employee.employee.employeeID, name: employee.employee.firstname + ' ' +employee.employee.lastname})
                                })
                                this.setState({
                                    materialdataEmployee:newList,
                                })
                        })
                    })
                }
            })   
        }

       onReset = e =>{
        this.props.history.push('/trainingform')
        this.setState({
            name:'',
            speaker:'',
            venue:'',
            address:'',
            showAddress:false,
        })
       }
    
    render(){

        return(
            <div className="container">
                <div className="row">                 
                    <div className="container-fluid"> 
                       <center><div>
                            <label>
                                Name:
                                <Autosuggest 
                                    suggestions={this.state.suggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                        placeholder: "Search...",
                                        value:this.state.value,
                                        onChange: this.onChange
                                    }} />
                                    </label>{" "}
                                    <label>
                                    Employee ID:
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={employeeID}
                                        readOnly
                                        className="form-control"
                                        style={{height:40,textAlign:"center"}}
                                        />
                                        </label>
                                        {"   "}
                                    <button type="submit" value="Add" onClick={this.onSubmitEmployee} className="btn btn-primary"><AddBox/>ADD</button>
                                
                                <ReactTable
                                    data={this.state.materialdataEmployee}
                                    columns={[
                                    {
                                        Header: "Employee ID",
                                        accessor: "employeeID",
                                        id: "employeeID",
                                        Cell: this.renderEditable
                                    },
                                    {
                                        Header: "Name",
                                        accessor: "name",
                                        Cell: this.renderEditable,
                                    },
                                    {
                                        Header: "Action",
                                        id:'delete',
                                        accessor: str => "delete",
                                    
                                        Cell: (row)=> (
                                        <button className="btn btn-danger"
                                            onClick={() => {
                                                this.onDeleteEmployee(row.original.id, row.original.employeeID)
                                                }}>
                                                Delete
                                                </button> 
                                        )},
                                    ]}
                                    defaultPageSize={5}
                                    className="-striped -highlight"
                                    style={{textAlign:"center"}}
                                />             
                        </div></center> 
                    </div> 
                </div>
            </div>
        );
    }
}   