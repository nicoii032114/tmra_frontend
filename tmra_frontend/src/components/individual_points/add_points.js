import React, {Component} from 'react';
import { render } from "react-dom";
import NumberFormat from 'react-number-format';
import axios from 'axios'
import moment from 'moment';
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker';
import Autosuggest from 'react-autosuggest';
//ICONS
import AddBox from '@material-ui/icons/AddBox';
import SaveAlt from '@material-ui/icons/SaveAlt';
//CSS
//import './datepicker.css'

var user_id = ''; //USERLOG ID
var training ='';

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

var firstname = '';
export default class AddPoints extends Component{      
        _isMounted=false;
                state = {
                    id:'',
                    
                    //FOR DATE PICKERS
                    startDate: new Date(),
                    date:moment(new Date()).format("YYYY-MM-DD"),
                    paidDate: new Date(),
                    notpaid_billableDate: new Date(),
                    extra_workloadDate: new Date(),
                    managementDate: new Date(),
                    trainingDate: new Date(),
                    adminDate: new Date(),
                    investmentDate: new Date(),
                    non_billableDate: new Date(),
                    salesDate: new Date(),
                    points:'',

                    //STORAGE FOR TIME
                    paid:"00:00:00",
                    notpaid_billable:"00:00:00",
                    extra_workload:"00:00:00",
                    management:"00:00:00",
                    training:"00:00:00",
                    admin:"00:00:00",
                    investment:"00:00:00",
                    non_billable:"00:00:00",
                    sales:"00:00:00",

                    //STORAGE FOR CONVERTED TIME TO POINTS
                    paidValue:0,notpaid_billableValue:0,extra_workloadValue:0,managementValue:0,trainingValue:0,
                    adminValue:0,investmentValue:0,non_billableValue:0,salesValue:0, totalPoints:0,

                    employee_data:[],

                    //AUTO SUGGESTION
                    value:'',
                    suggestions:[],

                    update:false, // FOR TO SAVE BTN FROM UPDATES
                    addnew:false, //CHANGING SAVE BTN TO ADD NEW AFTER ADDING DONE

                    monthStatus:false, //FOR MONTH CHECKING PURPOSES
                };

                componentDidMount(){
                    axios.get('http://'+window.location.hostname+':8000/employee/')
                    .then(res => {
                        this.setState({
                           employee_data:res.data
                        })
                        nameList = [];
                        this.state.employee_data.map((employee)=>{
                            nameList.push({id:employee.id, employeeID:employee.employee, name:employee.firstname+' '+employee.lastname})
                        })
                    })

                    axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
                    .then(res => {
                        res.data.map((id)=>{
                            user_id = id.id
                        })
                    })
                }

                componentWillReceiveProps({points_data}) {
                    if(points_data.id !== undefined){
                        employee_tbl_id = points_data.id
                        this.onPropsReceived(points_data);
                    }
                  }

                onPropsReceived = (points_data) =>{
                    employee_tbl_id = points_data.emp_tbl_id
                    employeeID = points_data.employeeID
                    //CONVERTING TIME TO POINTS
                    var arr = points_data.paid.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.paidValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.notpaid_billable.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.notpaid_billableValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.extra_workload.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.extra_workloadValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.management.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.managementValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.training.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.trainingValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.admin.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.adminValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.investment.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.investmentValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.non_billable.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.non_billableValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                    var arr = points_data.sales.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.salesValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)

                        this.setState({
                            id:points_data.id,
                            value:points_data.name,
                            date:points_data.date,
                            paid:points_data.paid,
                            notpaid_billable:points_data.notpaid_billable,
                            extra_workload:points_data.extra_workload,
                            management:points_data.management,
                            training:points_data.training,
                            admin:points_data.admin,
                            investment:points_data.investment,
                            non_billable:points_data.non_billable,
                            sales:points_data.sales,
                            update:true,
                        })
                }

                 //FOR AUTO SUGGESTION
                onChangeSuggestion = (event, { newValue, method }) => {
                    this.setState({value: newValue});
                    firstname = newValue.replace(/ .*/,''); //GETTING THE FIRSTNAME FROM AUTOSUGGESTION
                    axios.get('http://'+window.location.hostname+':8000/employee/?firstname='+firstname)
                    .then(res => {
                            res.data.map((employee)=>{
                            this.setState({emp_tbl_id:employee.id}) 
                            axios.get('http://'+window.location.hostname+':8000/individualpoints/?id='+employee.id)
                            .then(res => {
                                    if(res.data.length == 0){
                                        this.setState({monthStatus:false})
                                    }
                                    res.data.map((employee)=>{
                                        if(moment(employee.date).format("MM") == moment(new Date()).format("MM")){
                                            this.setState({monthStatus:true})

                                        }else{
                                        }
                                    })
                            })
                        })

                    })
                };        
                onSuggestionsFetchRequested = ({ value }) => {
                this.setState({suggestions: getSuggestions(value)});
                };
            
                onSuggestionsClearRequested = () => {
                this.setState({suggestions: []});
                };

                onChangeDate = date => {
                    this.setState({date:date})
                    var dateformat = moment(date).format("YYYY-MM-DD")
                    this.setState({
                        startDate:date,         //updating the date picker(modal add)
                        date:dateformat
                    })
                    axios.get('http://'+window.location.hostname+':8000/employee/?firstname='+firstname)
                    .then(res => {
                        res.data.map((employee)=>{
                            this.setState({emp_tbl_id:employee.id}) 
                            axios.get('http://'+window.location.hostname+':8000/individualpoints/?id='+employee.id)
                            .then(res => {
                                    res.data.map((employee)=>{
                                        if(moment(employee.date).format("MM") == moment(date).format("MM")){
                                            this.setState({monthStatus:true})
                                        }else{
                                            this.setState({monthStatus:false})
                                        }
                                    })
                            })
                        })

                    })
                }

                handlePaidChange = time =>{
                    this.setState({paidDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({paid:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.paidValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleNotpaid_BillableChange = time =>{
                    this.setState({notpaid_billableDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({notpaid_billable:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.notpaid_billableValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleExtra_WorkloadChange = time =>{
                    this.setState({extra_workloadDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({extra_workload:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.extra_workloadValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleManageChange = time =>{
                    this.setState({managementDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({management:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.managementValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleTrainingChange = time =>{
                    this.setState({trainingDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({training:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.trainingValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleAdminChange = time =>{
                    this.setState({adminDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({admin:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.adminValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleInvestmentChange = time =>{
                    this.setState({investmentDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({investment:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.investmentValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleNon_BillableChange = time =>{
                    this.setState({non_billableDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({non_billable:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.non_billableValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                }
                handleSalesChange = time =>{
                    this.setState({salesDate:time});
                    var timeformat = moment(time).format("HH:mm:ss")
                    this.setState({sales:timeformat})
                    //CONVERTING TIME TO POINTS
                    var arr = timeformat.split(':');
                    var dec = parseInt((arr[1]/6)*10, 10);
                    this.state.salesValue = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
                    console.log(time)
                }

        //ADDING INDIVIDUAL POINTS
        onSubmit = e => {
                //e.preventDefault();
                if(this.state.monthStatus === true){
                    Swal.fire('Oops...','You already added points to this Employee this month!\nPlease change the selected date','error')
                }else{
                if(employee_tbl_id === ''){
                    Swal.fire('Oops...','Please select an Employee!','error')
                }else if(this.state.paidValue === 0 || this.state.notpaid_billableValue === 0 || this.state.extra_workloadValue === 0
                    || this.state.managementValue === 0 || this.state.trainingValue === 0 || this.state.admin === 0 || this.state.investmentValue === 0
                    || this.state.non_billableValue === 0 || this.state.salesValue === 0)
                {
                    Swal.fire('Oops...','Fields may not be blank!','error')
                }else{
                    const data = new FormData();
                    data.set('employee', employee_tbl_id)
                    data.set('date', this.state.date)
                    data.set('paid', this.state.paid)
                    data.set('notpaid_billable', this.state.notpaid_billable)
                    data.set('extra_workload', this.state.extra_workload)
                    data.set('management', this.state.management)
                    data.set('training', this.state.training)
                    data.set('admin', this.state.admin)
                    data.set('investment', this.state.investment)
                    data.set('non_billable', this.state.non_billable)
                    data.set('sales', this.state.sales)
                    data.set('points', this.state.totalPoints)
                    axios.post('http://'+window.location.hostname+':8000/individualpoints/',data)
                        .then(res => {
                                const data = new FormData();
                                data.set('user', user_id)
                                data.set('description', "Added Individual Points of Employee ID: "+employeeID)
                                data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                data.set('action', "ADD")
                                axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                .then(res => {
                                })
                            Swal.fire('Added!','Points has been added.','success')
                            this.setState({addnew:true})
                            this.props.callBackParent(true)
                    })
                    .catch(error => {
                        if(error.response.data.points || error.response.data.hours_classification){
                            Swal.fire('Oops...','Fields may not be blank!','error')
                        }else if(error.response.data.employee){
                            Swal.fire('Oops...','Please select an Employee!','error')
                        }
                    });
                }
            }
        }

        //UPDATING INDIVIDUAL POINTS
        onUpdate = e => {
            //e.preventDefault();
            if(this.state.paidValue === null || this.state.notpaid_billableValue === null || this.state.extra_workloadValue === null
                || this.state.managementValue === null || this.state.trainingValue === null || this.state.admin === null || this.state.investmentValue === null
                || this.state.non_billableValue === null || this.state.salesValue === null)
            {
                Swal.fire('Oops...','Fields may not be invalid!','error')
            }else{
                const data = new FormData();
                data.set('employee', employee_tbl_id)
                data.set('date', this.state.date)
                data.set('paid', this.state.paid)
                data.set('notpaid_billable', this.state.notpaid_billable)
                data.set('extra_workload', this.state.extra_workload)
                data.set('management', this.state.management)
                data.set('training', this.state.training)
                data.set('admin', this.state.admin)
                data.set('investment', this.state.investment)
                data.set('non_billable', this.state.non_billable)
                data.set('sales', this.state.sales)
                data.set('points', this.state.totalPoints)
                axios.put('http://'+window.location.hostname+':8000/individualpoints/'+this.state.id+'/',data)
                    .then(res => {
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Updated Individual Points of Employee ID: "+employeeID)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "UPDATE")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })
                        Swal.fire('Updated!','Points has been updated.','success')
                        this.props.callBackParent(true)
                })
                .catch(error => {
                    if(error.response){
                        Swal.fire('Oops...','Fields may not be blank1!','error')
                    }
                });
            } 
        }

        onUpdateClicked = e =>{
            employeeID = ''
            employee_tbl_id = ''
            this.setState({
                id:'',
                value:'',
                startDate: new Date(),
                date:moment(new Date()).format("YYYY-MM-DD"),
                paid:"00:00:00",
                notpaid_billable:"00:00:00",
                extra_workload:"00:00:00",
                management:"00:00:00",
                training:"00:00:00",
                admin:"00:00:00",
                investment:"00:00:00",
                non_billable:"00:00:00",
                sales:"00:00:00",
                
                paidValue:0,
                notpaid_billableValue:0,
                extra_workloadValue:0,
                managementValue:0,
                trainingValue:0,
                adminValue:0,
                investmentValue:0,
                non_billableValue:0,
                salesValue:0,

                update:false,
                addnew:false,
            })
        }

  render() {
       //CALCULATING TOTAL POINTS
       this.state.totalPoints = this.state.paidValue + this.state.notpaid_billableValue + this.state.extra_workloadValue + this.state.managementValue +
       this.state.trainingValue + this.state.adminValue + this.state.investmentValue + this.state.non_billableValue + this.state.salesValue
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
                {this.state.update || this.state.addnew?<button className="btn btn-primary" style={{float:"left",marginBottom:5}} onClick={this.onUpdateClicked}><AddBox/>ADD NEW</button>
                                    :<button className="btn btn-primary" style={{float:"left",marginBottom:5}} onClick={this.onSubmit}><SaveAlt/>SAVE</button>}

                {this.state.update?<button className="btn btn-primary" style={{float:"left",marginBottom:5,marginLeft:5}} onClick={this.onUpdate}><SaveAlt/>SAVE</button>
                                    :null}
                <br/>
                <div className="table-responsive text-nowrap"  style={{border:"1px solid Black",textAlign:"center",height:170}}> 
                    <table className="table table-striped" id="tab_logic">
                        <thead>
                            <tr>
                                <th className="text-center"> Name* </th>
                                <th className="text-center"> Date </th>
                                <th className="text-center"> Paid* </th>
                                <th className="text-center"> Not Paid-Billable* </th>
                                <th className="text-center"> Extra Workload* </th>
                                <th className="text-center"> Management* </th>
                                <th className="text-center"> Training* </th>
                                <th className="text-center"> Admin* </th>
                                <th className="text-center"> Investment*</th>
                                <th className="text-center"> Non-Billable* </th>
                                <th className="text-center"> Sales* </th>
                                <th className="text-center"> Points </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="timepicker">
                                <td>
                                    {this.state.update ? <input type="text" value={this.state.value} className="form-control" 
                                                            style={{width:200,textAlign:"center"}} readOnly/>
                                                        :<Autosuggest 
                                                            suggestions={this.state.suggestions}
                                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                            getSuggestionValue={getSuggestionValue}
                                                            renderSuggestion={renderSuggestion}
                                                            inputProps={{
                                                                placeholder: "Search...",
                                                                value:this.state.value,
                                                                onChange: this.onChangeSuggestion
                                                            }} />}
                                </td>
                                <td>
                                    <DatePicker selected={this.state.startDate}
                                        onChange={this.onChangeDate}/>  
                                </td>
                                <td className="timepicker">
                                    <DatePicker selected={this.state.paid ? this.state.paidDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.paid}
                                        onChange={this.handlePaidChange} 
                                        timeCaption="Time"
                                        inputStyle={{ textAlign: "center" }}
                                        className="timepicker"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.notpaid_billable ? this.state.notpaid_billableDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.notpaid_billable}
                                        onChange={this.handleNotpaid_BillableChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.extra_workload ? this.state.extra_workloadDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.extra_workload}
                                        onChange={this.handleExtra_WorkloadChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.management ? this.state.managementDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.management}
                                        onChange={this.handleManageChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.training ? this.state.trainingDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.training}
                                        onChange={this.handleTrainingChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.admin ? this.state.adminDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.admin}
                                        onChange={this.handleAdminChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.investment ? this.state.investmentDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.investment}
                                        onChange={this.handleInvestmentChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.non_billable ? this.state.non_billableDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.non_billable}
                                        onChange={this.handleNon_BillableChange} 
                                        timeCaption="Time"/>
                                </td>
                                <td>
                                    <DatePicker selected={this.state.sales ? this.state.salesDate : null}
                                        showTimeSelect 
                                        showTimeSelectOnly 
                                        dateFormat="HH:mm:ss" 
                                        timeIntervals={30}
                                        value={this.state.sales}
                                        onChange={this.handleSalesChange} 
                                        timeCaption="Time"
                                        inputStyle={{ textAlign: 'center' }}/>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={this.state.totalPoints}
                                        readOnly
                                        style={{textAlign:"center"}}
                                        />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
               
            </div>
          </div>
        </div>
      </div>
    );
  }
}
