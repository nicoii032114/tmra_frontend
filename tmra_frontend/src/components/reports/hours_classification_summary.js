import React, {Component} from 'react';
import ReactTable from "react-table";
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
import moment from 'moment';
import Swal from 'sweetalert2'
import Pagination from "./Pagination.js";
import "./style.css";

var individualpoints = []
var quarterFrom = [];
var quarterTo = [];
export default class HoursClassification extends Component{
   
    
    constructor(props, context) {
        super(props, context);
        this.state = {
            startDate: new Date(),
            performance_rating:'',

            years:[],
            employmentdetails_data:[],
            individualpoints_data:[],
            pointsData:[],
            
            position_data:[],
            position:0,
            filter:1,
            title:"Annual",
            selectfrom:"Year From",
            selectto:"Year To",
            
            selectedAnnual:true,
            selectedQuarter:false,
            selectedMonth:false,

            yearFrom_value:moment(new Date()).format("YYYY"),
            yearTo_value:moment(new Date()).format("YYYY"),

            year_selected:moment(new Date()).format("YYYY"),
            quarterFrom_value:'',
            quarterTo_value:'',
            monthFrom_value:'',
            monthTo_value:'',

             //CONSTRUCTING MONTH ARRAY
             months: [
                {name: 'January',id: '1'}, {name: 'Febuary',id: '2'},{name: 'March',id: '3'},
                {name: 'April',id: '4'}, {name: 'May',id: '5'},{name: 'June',id: '6'},
                {name: 'July',id: '7'}, {name: 'August',id: '8'},{name: 'September',id: '9'},
                {name: 'October',id: '10'}, {name: 'November',id: '11'},{name: 'December',id: '12'},
            ],
            
              quarters:[
                {name: 'First Quarter',id: '1'}, {name: 'Second Quarter',id: '2'},
                {name: 'Third Quarter',id: '3'}, {name: 'Fourth Quarter',id: '4'}
              ],

        };

        const { to, staticContext, ...rest } = this.props;
    }

    componentDidMount() {
        axios.get('http://'+window.location.hostname+':8000/individualpoints/')
        .then(res => {
            this.setState({
                individualpoints_data:res.data
            });
            individualpoints = [];
            for(var i = this.state.yearFrom_value; i <= this.state.yearTo_value; i++){
              res.data.map((points)=>{
                if(moment(points.date).format("YYYY") == i)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
                })
            }
            this.setState({pointsData:individualpoints})
          });

        axios.get('http://'+window.location.hostname+':8000/employmentdetails/')
        .then(res => {
          this.setState({
              employmentdetails_data:res.data
          });
        });

        axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
        .then(res => {
            this.setState({
                position_data:res.data
            });
          });


        //GETTING THE 10 YEARS BACKWARD FROM THE CURRENT YEAR
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
    }

    onChangePosition = e =>{
      this.setState({ [e.target.name]: e.target.value });
      var employee_data = [];
      var hours_data = [];
      this.state.employmentdetails_data.map((details)=>{
          if(details.roles_responsibilities == e.target.value){
              employee_data.push({emp_tbl_id:details.employee})
          }else{
           
          }
      })
      var newData = []
      newData = this.state.pointsData
        newData.map((points)=>{
          employee_data.map((employee)=>{
            if(points.id == employee.emp_tbl_id){
                hours_data.push({name:points.name,date:points.date,paid:points.paid,
                notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                sales:points.sales,})
            }else{

            }
          })
      })
      individualpoints = hours_data;

      if(e.target.value == "0"){
        individualpoints = [];
        for(var i = this.state.yearFrom_value; i <= this.state.yearTo_value; i++){
          this.state.individualpoints_data.map((points)=>{
            if(moment(points.date).format("YYYY") == i)
            individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
              notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
              training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
              sales:points.sales})
            })
        }
      }
    }

    onFilter = e =>{
        this.setState({
          filter: e.target.value,
          monthFrom_value:1,
          monthTo_value:1
        })
        if(e.target.value == 1){
          this.setState({
            title:"Annual",
            selectfrom:"Year From",
            selectto:"Year To",
            selectedAnnual:true,
            selectedQuarter:false,
            selectedMonth:false,
            position:0
          })
            individualpoints = [];

            this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("YYYY") == moment(new Date()).format("YYYY")){
                  individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
                }
            }) 
        }else if(e.target.value == 2){
          this.setState({
            title:"Quarterly",
            selectfrom:"Quarter From",
            selectto:"Quarter To",
            selectedAnnual:false,
            selectedQuarter:true,
            selectedMonth:false,
            position:0
          })
            individualpoints = [];

            var quarter = [1,2,3];
            quarterFrom.push(1,2,3)
            for(var i = 0; i < quarter.length; i++){
              this.state.individualpoints_data.map((points)=>{
                  if(moment(points.date).format("YYYY") == moment(new Date()).format("YYYY") && moment(points.date).format("MM") == quarter[i]){
                    individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                    notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                    training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                    sales:points.sales})
                  }
              })    
            }
        }else{
          this.setState({
            title:"Monthly",
            selectfrom:"Month From",
            selectto:"Month To",
            selectedAnnual:false,
            selectedQuarter:false,
            selectedMonth:true,
            position:0,
          })
          individualpoints = []
          for(var i = 1; i <= 1; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("MM") == i && moment(points.date).format("YYYY") == this.state.year_selected)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
      }

      onYearFrom = e =>{
        if(e.target.value > this.state.yearTo_value){
          Swal.fire('Invalid!','Year selected is invalid!','error')
        }else{
          this.setState({yearFrom_value:e.target.value})
          individualpoints = []
          for(var i = e.target.value; i <= this.state.yearTo_value; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("YYYY") == i)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
      }
  
      onYearTo = e =>{
        if(this.state.yearFrom_value > e.target.value){
          Swal.fire('Invalid!','Year selected is invalid!','error')
        }else{
          this.setState({yearTo_value:e.target.value})
          individualpoints = []
          for(var i = this.state.yearFrom_value; i <= e.target.value; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("YYYY") == i)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
        
      }

      onYearSelected = e =>{
        this.setState({year_selected:e.target.value})
        if(this.state.title === "Quarterly"){

            individualpoints=[];
            var totalQuarters = [];
            totalQuarters = [...quarterFrom, ...quarterTo];
            for(var i = 0; i < totalQuarters.length; i++){
              this.state.individualpoints_data.map((points)=>{
                if(this.state.title === "Quarterly" && moment(points.date).format("YYYY") == e.target.value && moment(points.date).format("MM") == totalQuarters[i]){
                  individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
                }
            })
          }
        }else if(this.state.title === "Monthly"){
          individualpoints = []
          for(var i = this.state.monthFrom_value; i <= this.state.monthTo_value; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("MM") == i && moment(points.date).format("YYYY") == e.target.value)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
          
      }

      onQuarterFrom = e =>{
        if(e.target.value > this.state.quarterTo_value){
          Swal.fire('Invalid!','Quarter selected is invalid!','error')
        }else{
          this.setState({quarterFrom_value:e.target.value})
          if(e.target.value == 1){
            quarterFrom = []
            quarterFrom.push(1,2,3)
          }else if(e.target.value == 2){
            quarterFrom = []
            quarterFrom.push(1,2,3,4,5,6)
          }else if(e.target.value == 3){
            quarterFrom = []
            quarterFrom.push(4,5,6,7,8,9)
          }else{
            quarterFrom = []
            quarterFrom.push(4,5,6,7,8,9,10,11,12)
          }
          this.QuarterFromHours();
        }
      }
                     QuarterFromHours(){
          
                      individualpoints=[];
                      var totalQuarters = [];
                      totalQuarters = [...quarterFrom, ...quarterTo];
                      console.log(Array.from(new Set([...quarterFrom, ...quarterTo])))
                      for(var i = 0; i < totalQuarters.length; i++){
                        this.state.individualpoints_data.map((points)=>{
                          if(this.state.title === "Quarterly" && moment(points.date).format("YYYY") == this.state.year_selected && moment(points.date).format("MM") == totalQuarters[i]){
                            individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                            notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                            training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                            sales:points.sales})
                          }
                      })
                    }
                  }
  
      onQuarterTo = e =>{
        if(this.state.quarterFrom_value > e.target.value){
          Swal.fire('Invalid!','Quarter selected is invalid!','error')
        }else{
          this.setState({quarterTo_value:e.target.value})
          if(e.target.value == 1){
            quarterTo = []
            quarterTo.push(1,2,3)
          }else if(e.target.value == 2){
            quarterTo = []
            quarterTo.push(1,2,3,4,5,6)
          }else if(e.target.value == 3){
            quarterTo = []
            quarterTo.push(4,5,6,7,8,9)
          }else{
            quarterTo = []
            quarterTo.push(4,5,6,7,8,9,10,11,12)
          }
          this.QuarterToHours();
        }
      }

              QuarterToHours(){
      
                  individualpoints=[];
                  var totalQuarters = [];
                  totalQuarters = [...quarterFrom, ...quarterTo];
                  for(var i = 0; i < Array.from(new Set([...quarterFrom, ...quarterTo])).length; i++){
                    this.state.individualpoints_data.map((points)=>{
                      if(this.state.title === "Quarterly" && moment(points.date).format("YYYY") == this.state.year_selected && moment(points.date).format("MM") == totalQuarters[i]){
                        individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                        notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                        training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                        sales:points.sales})
                      }
                  })
                }
              }
  
      onMonthFrom = e =>{
        if(e.target.value > this.state.monthTo_value){
          Swal.fire('Invalid!','Month selected is invalid!','error')
        }else{
          this.setState({monthFrom_value:e.target.value})
          individualpoints = [];
          for(var i = e.target.value; i <= this.state.monthTo_value; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("MM") == i && moment(points.date).format("YYYY") == this.state.year_selected)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
      }
  
      onMonthTo = e =>{
        if(this.state.monthFrom_value > e.target.value){
          Swal.fire('Invalid!','Month selected is invalid!','error')
        }else{
          this.setState({monthTo_value:e.target.value})
          individualpoints = [];
          for(var i = this.state.monthFrom_value; i <= e.target.value; i++){
              this.state.individualpoints_data.map((points)=>{
                if(moment(points.date).format("MM") == i && moment(points.date).format("YYYY") == this.state.year_selected)
                individualpoints.push({id:points.employee,name:points.employee_id.firstname+' '+points.employee_id.lastname,date:points.date,paid:points.paid,
                  notpaid_billable:points.notpaid_billable,extra_workload:points.extra_workload,management:points.management,
                  training:points.training,admin:points.admin,investment:points.investment,non_billable:points.non_billable,
                  sales:points.sales})
              })
          }
        }
       

      }
          
    render(){

        return(
            <div className="container" >
                <div className="row">  
                     <div className="container-fluid">
                        <center><div className="col-md-6">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44",color:'white'}}>Filter</span>
                                    </div>
                                        <select onChange={this.onFilter} name="month" value={this.state.filter} className="form-control dropdown-toggle">
                                        <option value="1">Annual</option>
                                        <option value="2">Quarterly</option>
                                        <option value="3">Monthly</option>
                                        </select>
                                    </div>

                                    {this.state.selectedQuarter ?  <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>Year</span>
                                            </div>
                                         <select onChange={this.onYearSelected} value={this.state.year_selected} className="form-control dropdonw-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                </select>
                                            </div>
                                        </div>:null}

                                    {this.state.selectedMonth?  <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>Year</span>
                                            </div>
                                         <select onChange={this.onYearSelected} value={this.state.year_selected} className="form-control dropdonw-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                </select>
                                            </div>
                                        </div>:null}

                                    <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>{this.state.selectfrom}</span>
                                            </div>
                                                {this.state.selectedAnnual ? <select onChange={this.onYearFrom} name="year" value={this.state.yearFrom_value} className="form-control dropdown-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                    </select>: null}
                                
                                                {this.state.selectedQuarter ? <select onChange={this.onQuarterFrom} name="quarter" value={this.state.quarterFrom_value}className="form-control dropdown-toggle">
                                                            {this.state.quarters.map((quarters) => 
                                                                <option key={quarters.id} value={quarters.id}>{quarters.name}</option>)}
                                                    </select> : null}         
                                                
                                                {this.state.selectedMonth ? <select onChange={this.onMonthFrom} name="month" value={this.state.monthFrom_value}className="form-control dropdown-toggle">
                                                            {this.state.months.map((months) => 
                                                                <option key={months.id} value={months.id}>{months.name}</option>)}
                                                    </select> : null} 
                                            </div>
                                        </div>

                                    <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44",color:'white'}}>{this.state.selectto}</span>
                                            </div>
                                                {this.state.selectedAnnual ? <select onChange={this.onYearTo} name="year" value={this.state.yearTo_value} className="form-control dropdown-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                    </select>: null}

                                                {this.state.selectedQuarter ? <select onChange={this.onQuarterTo} name="quarter" value={this.state.quarterTo_value}className="form-control dropdown-toggle">
                                                            {this.state.quarters.map((quarters) => 
                                                                <option key={quarters.id} value={quarters.id}>{quarters.name}</option>)}
                                                    </select> : null}         
                                                
                                                {this.state.selectedMonth ? <select onChange={this.onMonthTo} name="month" value={this.state.monthTo_value}className="form-control dropdown-toggle">
                                                            {this.state.months.map((months) => 
                                                                <option key={months.id} value={months.id}>{months.name}</option>)}
                                                    </select> : null}    
                                            </div>
                                        </div>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44",color:'white'}}>Position</span>
                                        </div>
                                          <select value={this.state.position} onChange={this.onChangePosition} name="position" className="form-control dropdown-toggle" >
                                              <option value = "0">All</option>
                                              {this.state.position_data.map((position) => 
                                              <option key={position.id} value={position.id}>{position.position}</option>)}
                                          </select>
                                        </div>
                        </div></center>  
                        <div>
                              <ReactTable
                              style={{
                                  background: '#F5F5F5',
                                  borderRadius: '5px',
                                  overflow: 'hidden',
                                  padding: '5px',
                                  textAlign:"center",
                                  marginBottom:20
                                }}
                              PaginationComponent={Pagination}
                              defaultPageSize={10}
                              showPageSizeOptions={true}
                              data={individualpoints}
                              pageSizeOptions={[1, 2, 3, 100, 200, 500]}
                              columns={[
                              {
                                  Header: "Names",
                                  accessor: "name",
                                  columns: [{Header:'',accessor:'name', width:200}]
                              },
                              {
                                  Header: "Hours Classification Summary",
                                  accessor: "hours",
                                  minWidth: 300,
                                  columns: [
                                      {Header: 'Date', accessor: 'date',width:150},
                                      {Header: 'Paid', accessor: 'paid',width:150},
                                      {Header: 'Not Paid-Billable', accessor: 'notpaid_billable',width:150},
                                      {Header: 'Extra Workload', accessor: 'extra_workload',width:150},
                                      {Header: 'Management', accessor: 'management',width:150},
                                      {Header: 'Training', accessor: 'training',width:150},
                                      {Header: 'Admin', accessor: 'admin',width:150},
                                      {Header: 'Investment', accessor: 'investment',width:150},
                                      {Header: 'Non-Billable', accessor: 'non_billable',width:150},
                                      {Header: 'Sales', accessor: 'sales',width:150},
                                  ]
                              },
                              ]}
                          />
                        </div>
                    </div>
                </div>
        </div>

        );
    }
}