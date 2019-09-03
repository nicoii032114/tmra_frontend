import React, {Component} from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AddPoints from './add_points.js';
//MATERIL UI TIMEPICKER
import 'date-fns';

//FOR MATERIAL TABLE
import { forwardRef } from 'react';
import MaterialTable,  { MTableToolbar} from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import CloseIcon from '@material-ui/icons/Clear';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
           
const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

var user_id = ''; //USERLOG ID
var training = '';


var EmployeePoints_data = [];
export default class IndividualPointsList extends Component{
        
    _isMounted = false
        constructor(props) {
            super(props);
                
            this.state = {

                startDate: new Date(),
                emp_tbl_id:'',
                employeeList:[],
                traineesList:[],
                deleteEmployee:[], //FOR DELETE PURPOSES
                training_id:'',
                individualpoints_data:[],
                value: '',
                suggestions: [],

                //CONSTRUCTING MONTH ARRAY
                months: [
                    {name: 'January',id: '1'}, {name: 'Febuary',id: '2'},{name: 'March',id: '3'},
                    {name: 'April',id: '4'}, {name: 'May',id: '5'},{name: 'June',id: '6'},
                    {name: 'July',id: '7'}, {name: 'August',id: '8'},{name: 'September',id: '9'},
                    {name: 'October',id: '10'}, {name: 'November',id: '11'},{name: 'December',id: '12'},
                ],
                month_value:0,

                years:[],
                year_selected:moment(new Date()).format("YYYY"),

                employeepoints_columns:[],
                };

        }

        componentDidMount(){
        
            this._isMounted=true 
            this.getIndividualPointsData();
            axios.get('http://'+window.location.hostname+':8000/individualpoints/')
            .then(res => {
                    this.setState({
                        individualpoints_data:res.data
                    })
            })

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            }) 

              //GETTING THE 5 YEARS BACKWARD FROM THE CURRENT YEAR
              var year =this.state.startDate.getFullYear()
              var yearArray = []
              for(var i = 0; i < 10; i++){
                  var yearTotal = this.state.startDate.getFullYear() - i
                  yearArray.push({id:i, year:yearTotal});
              }
              
              this.setState({
                  years:yearArray,
                  year_selected:year
              })

              var points_columns= [
                { title: 'Name', field: 'name'},
                { title: 'Date', field: 'date',type:'date'},
                { title: 'Paid', field: 'paid'},
                { title: 'Not Paid-Billable', field: 'notpaid_billable'},
                { title: 'Extra Workload', field: 'extra_workload'},
                { title: 'Management', field: 'management'},
                { title: 'Training', field: 'training'},
                { title: 'Admin', field: 'admin'},
                { title: 'Investment', field: 'investment'},
                { title: 'Non-Billable', field: 'non_billable'},
                { title: 'Sales',field: 'sales'},
                { title: 'Points', field: 'points'},
                ]

           this.setState({
               employeepoints_columns:points_columns
           })

        }

        componentWillUnmount() {
            this._isMounted = false;
          }
        
        getIndividualPointsData(){
            axios.get('http://'+window.location.hostname+':8000/individualpoints/')
            .then(res => {
                    EmployeePoints_data = []
                    res.data.map((points)=>{
                        EmployeePoints_data.push({id:points.id,emp_tbl_id:points.employee, employeeID:points.employee_id.employeeID, name:points.employee_id.firstname + ' ' + points.employee_id.lastname,
                                    date:points.date, paid:points.paid, notpaid_billable:points.notpaid_billable,
                                    extra_workload:points.extra_workload, management:points.management, training:points.training,
                                    admin:points.admin, investment:points.investment, non_billable:points.non_billable, sales:points.sales, points:points.points})

                    })
                    this.setState({refresh:true})
                }) 
        }

        //FILTERING BY MONTH
        onMonth = e =>{
            if(e.target.value == 0){
                    EmployeePoints_data = []
                    this.setState({month_value:e.target.value})
                    this.state.individualpoints_data.map((points) => {
                        if(moment(points.date).format("YYYY") === this.state.year_selected){
                            EmployeePoints_data.push({id:points.employee, employeeID:points.employee, name:points.employee_id.firstname + ' ' + points.employee_id.lastname,
                            date:points.date, paid:points.paid, notpaid_billable:points.notpaid_billable,
                            extra_workload:points.extra_workload, management:points.management, training:points.training,
                            admin:points.admin, investment:points.investment, non_billable:points.non_billable, sales:points.sales, points:points.points})
                        }
                    })
            }else{
                    var month;
                    if(e.target.value < 10){
                        month = "0"+e.target.value
                    }else{
                        month = e.target.value
                    }
                    EmployeePoints_data = []
                    this.setState({month_value:e.target.value})
                    this.state.individualpoints_data.map((points) => {
                            if(moment(points.date).format("YYYY") == this.state.year_selected && moment(points.date).format("MM") == month){
                                    EmployeePoints_data.push({id:points.employee, employeeID:points.employee, name:points.employee_id.firstname + ' ' + points.employee_id.lastname,
                                    date:points.date, paid:points.paid, notpaid_billable:points.notpaid_billable,
                                    extra_workload:points.extra_workload, management:points.management, training:points.training,
                                    admin:points.admin, investment:points.investment, non_billable:points.non_billable, sales:points.sales, points:points.points})
                            }
                    })
            }
            
        }

        //FILTERING BY YEAR
        onYear = e =>{
                this.setState({
                    year_selected:e.target.value,
                    month_value:0
                })
                EmployeePoints_data = []
                this.state.individualpoints_data.map((points) => {
                        if(moment(points.date).format("YYYY") === e.target.value){
                            EmployeePoints_data.push({id:points.employee, employeeID:points.employee, name:points.employee_id.firstname + ' ' + points.employee_id.lastname,
                            date:points.date, paid:points.paid, notpaid_billable:points.notpaid_billable,
                            extra_workload:points.extra_workload, management:points.management, training:points.training,
                            admin:points.admin, investment:points.investment, non_billable:points.non_billable, sales:points.sales, points:points.points})
                        }
                })
    
        }

         //CALL BACK FROM ADD POINTS
         myIndividualPointsCallback = (dataFromChild) => {
             console.log(dataFromChild)
            if(dataFromChild){
                this.getIndividualPointsData();
            }
        }

        onEdit(id){
            this.scrollToTop();
            this.setState({
                emp_tbl_id:id,
            })
        }

        scrollToTop(){
            var element = document.getElementById("top");
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
          }

    
    render(){
        return(
            
            <div className="container">
                <div id="top"></div>
                <AddPoints callBackParent={this.myIndividualPointsCallback} points_data={this.state.emp_tbl_id}/>:
                
                <div className="row">                 
                    <div className="container-fluid"> 
                        <div>
                            <MaterialTable
                            title="Individual Points List"
                            columns={this.state.employeepoints_columns}
                            data={EmployeePoints_data.sort((a,b) => a["id"]>b["id"]?-1:1)}
                            actions={[
                                {
                                  icon: 'edit',
                                  tooltip: 'Edit',
                                  onClick: (event, rowData) => this.onEdit(rowData)
                                }
                              ]}
                            editable={{
                                onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    {
                                        let data = this.state.individualpoints_data;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({}, () => resolve());
                                        this.onDelete(oldData.id)//calling delete function
                                    }
                                    resolve()
                                }, 1000)
                                }),
                            }}
                            options={{
                                    actionsColumnIndex: -1
                                }}
                                components={{
                                    Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{padding: '0px 10px'}}>
                                        <select onChange={this.onMonth} name="month" value={this.state.month_value}
                                            className="form-control dropdown-toggle" style={{width:250,marginBottom:5}}>
                                            <option value="0">SELECT MONTH</option>
                                            {this.state.months.map((month) => 
                                            <option key={month.id} value={month.id}>{month.name}</option>)}
                                        </select>
                                        <select onChange={this.onYear} name="year" value={this.state.year_selected}
                                            className="form-control dropdown-toggle" style={{width:250,marginBottom:5}}>
                                            {this.state.years.map((year) => 
                                            <option key={year.id} value={year.year}>{year.year}</option>)}
                                        </select>
                                        <center><h6>Hours Classification</h6></center>
                                        </div>
                                    </div>
                                    ),
                                }}
                                
                            />
                            <div id="bottom"></div>
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}   