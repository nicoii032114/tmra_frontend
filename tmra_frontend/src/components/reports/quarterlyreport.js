import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
import moment from 'moment';
import Swal from 'sweetalert2'
//FOR MATERIAL TABLE
import { forwardRef } from 'react';
import MaterialTable, { MTableToolbar} from 'material-table';
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
import BarGraph from '../graphs/bargraph.js';
import OtherDetails from '../graphs/OtherDetails.js';
           
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

  var graphData = '';
  var otherdetails_data=[];

export default class QuarterlyReport extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            startDate: new Date(),
            date: moment(new Date()).format("YYYY-MM-DD"),

            employmentdetails_data:[],
            employmentdetails_filtered:[],
            employee_data:[],
            rr_data:[],
            department_data:[],
            individualpoints_data:[],
            selected_employee_points:[],

            employee_id:0,
            department:1,
            reporttype:1,
            position:0,
            designation:3,

            years:[],
            monthFrom_selected:1,
            yearFrom_selected:moment(new Date()).format("YYYY"),
            monthTo_selected:1,
            yearTo_selected:moment(new Date()).format("YYYY"),

            employeeisselected:false, //for department options
            dateisselected:false, //for date options

            showBarGraph:false,

            showOtherDetails:true,
            
            //TABLE COLUMNS
            columns: [
                { title: 'Name', field: 'name'},
                { title: 'Quota', field: 'quota'},
                { title: 'Productivity Points', field: 'productivity_points'},
                { title: 'Productivity Rating', field: 'productivity_rating',},
              ],
            //CONSTRUCTING MONTH ARRAY
            months: [
                {name: 'First Quarter',id: 1}, {name: 'Second Quarter',id: 6},
                {name: 'Third Quarter',id: 9},{name: 'Fourth Quarter',id: 12},
            ],
              
        };

        const { to, staticContext, ...rest } = this.props;
    }

    componentDidMount() {

        axios.get('http://'+window.location.hostname+':8000/employmenthistory/')
        .then(res => {
            this.setState({
                employmentdetails_data:res.data
            });
            var reportArray=[];
            axios.get('http://'+window.location.hostname+':8000/individualpoints/')
            .then(res => {
                this.setState({individualpoints_data:res.data})
                if(this.state.designation == 3){
                    for(var i = this.state.monthFrom_selected; i <= this.state.monthTo_selected; i++){
                        this.state.employmentdetails_data.map((employment)=>{
                            this.state.individualpoints_data.map((individualpoints)=>{
                                if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                                    moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                                    moment(employment.date_updated).format("YYYY") == this.state.yearFrom_selected && 
                                    moment(individualpoints.date).format("YYYY") == this.state.yearFrom_selected){
                                    reportArray.push({
                                        points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                        name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                        quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                        productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                                    })
                                }
                            })
                        })
                    }
                }

                var o = {};
                reportArray.forEach((i) => {
                var id = i.emp_tbl_id;
                
                if (!o[id]) {
                    return o[id] = i
                }
                return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
                        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
                        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
                })

                var total = []
                Object.keys(o).forEach((key) => {
                total.push(o[key])
                })

                this.setState({
                    employmentdetails_filtered:total
                })
                otherdetails_data = total;
            })    
        })

        axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
        .then(res => {
            this.setState({
                rr_data: res.data
                });
  
            })

        axios.get('http://'+window.location.hostname+':8000/department/')
            .then(res => {
                this.setState({
                    department_data: res.data
                    })
            })

        axios.get('http://'+window.location.hostname+':8000/employee/')
        .then(res => {
                this.setState({
                    employee_data: res.data
                    })
            })

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
    onChangeDate = date => {
        this.setState({date:date})
        var dateformat = moment(date).format("YYYY-MM-DD")
        this.setState({
            startDate:date,         //updating the date picker(modal add)
            date:dateformat
        })
    }

    onChangeDepartment = e => {
        this.setState({ 
            department: e.target.value,
            designation:3,
            position:0,
            employmentdetails_filtered:[],
            employee_id:0,
            employeeisselected:false,
            dateisselected:false,
            monthFrom_selected:1,
            monthTo_selected:1,
            showOtherDetails:false,
            yearFrom_selected: moment(new Date()).format("YYYY"),
            yearTo_selected: moment(new Date()).format("YYYY"),
        });
        var newList=[];
        for(var i = 1; i <= 1; i++){
            this.state.employmentdetails_data.map((employment)=>{
                this.state.individualpoints_data.map((individualpoints)=>{
                    if(employment.department == e.target.value && employment.employee == individualpoints.employee &&
                        moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                        moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                        moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                        newList.push({
                            points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                            name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                            quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                            productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                        })
                    }
                })
            })
        }
        var o = {};
        newList.forEach((i) => {
        var id = i.emp_tbl_id;
        if (!o[id]) {
            return o[id] = i
        }
        return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
        })
        var total = []
        Object.keys(o).forEach((key) => {
        total.push(o[key])
        })
        this.setState({employmentdetails_filtered:total})
    }

    onChangeReportType = e => {
        this.setState({ 
            reporttype: e.target.value,
            designation:3,
            employee_id:0,  
            department:1,
            position:0,
            yearFrom_selected:moment(new Date()).format("YYYY"),
            yearTo_selected:moment(new Date()).format("YYYY"),
        });
        var newList=[];
        var startDate = '';
        if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
        }else{
            startDate = parseInt(this.state.monthFrom_selected + 1)
        }
        for(var i = startDate; i <= this.state.monthTo_selected; i++){
            this.state.employmentdetails_data.map((employment)=>{
                this.state.individualpoints_data.map((individualpoints)=>{
                    if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                        moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                        moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                        moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                        newList.push({
                            points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                            name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                            quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                            productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                        })
                    }
                })
            })
        }
        var o = {};
        newList.forEach((i) => {
        var id = i.emp_tbl_id;
        if (!o[id]) {
            return o[id] = i
        }
        return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
        })
        var total = []
        Object.keys(o).forEach((key) => {
        total.push(o[key])
        })
        this.setState({employmentdetails_filtered:total})
        otherdetails_data = total
    }

    onChangeDesignation = e => {
        this.setState({
            designation:e.target.value,
            employmentdetails_filtered:[],
            //employee_id:0,
            position:0,
            yearFrom_selected:moment(new Date()).format("YYYY"),
            yearTo_selected:moment(new Date()).format("YYYY")
        })
        var newList = [];
        var startDate = '';
        if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
        }else{
            startDate = parseInt(this.state.monthFrom_selected + 1)
        }
        if(e.target.value == 3){
            newList=[];
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
        }else{
            newList=[];
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.designation == e.target.value && employment.department == this.state.department 
                            && employment.employee == individualpoints.employee &&     
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }      
        }
            
        var o = {};
        newList.forEach((i) => {
        var id = i.emp_tbl_id;
        if (!o[id]) {
            return o[id] = i
        }
        return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
        })
        var total = []
        Object.keys(o).forEach((key) => {
        total.push(o[key])
        })
        this.setState({employmentdetails_filtered:total})
        otherdetails_data = total
    }

    onChangePosition = e => {
        var val = e.target.value
        this.setState({
            position: e.target.value,
            //employee_id:0,
            yearFrom_selected:moment(new Date()).format("YYYY"),
            yearTo_selected:moment(new Date()).format("YYYY")
        })
        var newList=[];
        var startDate = '';
        if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
        }else{
            startDate = parseInt(this.state.monthFrom_selected + 1)
        }
        if(e.target.value == 0){
            newList = [];
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.department == this.state.department && employment.designation == this.state.designation
                            && employment.employee == individualpoints.employee &&
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
        }else{
            newList=[];
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
            this.state.employmentdetails_data.map((employment)=>{
                this.state.individualpoints_data.map((individualpoints)=>{
                    if(employment.department == this.state.department && employment.designation == this.state.designation &&
                        employment.employee == individualpoints.employee && employment.roles_responsibilities == e.target.value &&
                        moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                        moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                        moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                        newList.push({
                            points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                            name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                            quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                            productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
        }
        if(this.state.designation == 3 && val == 0){
            newList = [];
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
        }else if(this.state.designation == 3){
            newList = []
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.department == this.state.department && employment.roles_responsibilities == val &&
                            employment.employee == individualpoints.employee &&
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
        }
        var o = {};
        newList.forEach((i) => {
        var id = i.emp_tbl_id;
        if (!o[id]) {
            return o[id] = i
        }
        return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
        })
        var total = []
        Object.keys(o).forEach((key) => {
        total.push(o[key])
        })
        this.setState({employmentdetails_filtered:total})
    }

    onChangeEmployee = e => {
        this.setState({
            employee_id:e.target.value,
            department:0,
            employeeisselected:true,
            showBarGraph:false,
            yearFrom_selected:moment(new Date()).format("YYYY"),
            yearTo_selected:moment(new Date()).format("YYYY")
        })
        var newList = []
        var employee_department = '';
        var employee_designation = '';
        var employee_position = '';
        var startDate = '';
        if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
        }else{
            startDate = parseInt(this.state.monthFrom_selected + 1)
        }
        for(var i = startDate; i <= this.state.monthTo_selected; i++){
            this.state.employmentdetails_data.map((employment)=>{
                this.state.individualpoints_data.map((individualpoints)=>{
                    if(employment.employee == e.target.value && employment.employee == individualpoints.employee &&
                        moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                        moment(employment.date_updated).format("YYYY") == moment(new Date()).format("YYYY") && 
                        moment(individualpoints.date).format("YYYY") == moment(new Date()).format("YYYY")){
                        newList.push({
                            points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                            name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                            quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                            productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                        })
                    }
                    if(employment.employee == e.target.value && individualpoints.employee == e.target.value){
                        employee_department = employment.department;
                        employee_designation = employment.designation;
                        employee_position = employment.roles_responsibilities;
                    }
                })
            })
        }
        this.setState({
            employmentdetails_filtered:newList,
            selected_employee_points:newList,
            department:employee_department,
            designation:employee_designation,
            position:employee_position
        })

        if(e.target.value == "00"){
            this.setState({
                showTabular:true,
                showOtherDetails:true,
                showBarGraph:false,
                department:this.state.department_data[0].id,
                designation:3,
                position:0
            })
            var sumArray = [];
            for(var i = this.state.monthFrom_selected; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.employee == individualpoints.employee && employment.department == this.state.department_data[0].id &&
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i &&
                            moment(employment.date_updated).format("YYYY") ==  moment(new Date()).format("YYYY") && 
                            moment(individualpoints.date).format("YYYY") ==  moment(new Date()).format("YYYY")){
                            sumArray.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
            }
            
            var o = {};
            sumArray.forEach((i) => {
            var id = i.emp_tbl_id;
            if (!o[id]) {
                return o[id] = i
            }
            return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
            o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
            o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
            })
            var total = []
            Object.keys(o).forEach((key) => {
            total.push(o[key])
            })
            this.setState({
                employmentdetails_filtered:total,
                })
            otherdetails_data = total
        }else{
            this.setState({showOtherDetails:false})
        }
    }
     
    onMonthFrom = e => {
        if(e.target.value > parseInt(this.state.monthTo_selected) && this.state.yearFrom_selected == this.state.yearTo_selected){
            Swal.fire('Invalid!','Date selected is invalid.','error')
        }else if(this.state.designation != 3){
            var newList =[];
            this.setState({monthFrom_selected:e.target.value})
            var startDate = '';
            if(e.target.value == 1 || this.state.monthFrom_selected == 12){
            }else{
                startDate = parseInt(e.target.value + 1)
            }
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                            employment.designation == this.state.designation &&
                            parseInt(moment(employment.date_updated).format("MM")) == i && parseInt(moment(individualpoints.date).format("MM")) == i){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:individualpoints.points/employment.quota,
                            })
                        }
                    })
                })
            }
     
            var reportArray = []
            for(var i = this.state.yearFrom_selected; i <= this.state.yearTo_selected; i++){
                newList.map((data)=>{
                    if(moment(data.date).format("YYYY") == i){
                            reportArray.push({
                                points_id:data.points_id,employment_id:data.employment_id,emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                productivity_rating:data.productivity_rating
                            })
                        }
                })
                
            }
            var o = {};
            reportArray.forEach((i) => {
            var id = i.emp_tbl_id;
            
            if (!o[id]) {
                return o[id] = i
            }
            return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
                    o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
                    o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
            })
            
            var total = []
            Object.keys(o).forEach((key) => {
            total.push(o[key])
            })

            this.setState({
                employmentdetails_filtered:total
            })
            otherdetails_data = total
        }else if(this.state.employee_id == "00"){
            var newList =[];
            var startDate = '';
            this.setState({monthFrom_selected:e.target.value})
            if(e.target.value == 1 || this.state.monthFrom_selected == 12){
            }else{
                startDate = parseInt(e.target.value + 1)
            }
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.employee == individualpoints.employee && 
                            moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:individualpoints.points/employment.quota,
                            })
                        }
                    })
                })
            }
            var reportArray = []
            for(var i = this.state.yearFrom_selected; i <= this.state.yearTo_selected; i++){
                newList.map((data)=>{
                    if(moment(data.date).format("YYYY") == i){
                            reportArray.push({
                                points_id:data.points_id,employment_id:data.employment_id, emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                productivity_rating:data.productivity_rating
                            })
                        }
                })
                
            }
            var o = {};
            reportArray.forEach((i) => {
            var id = i.emp_tbl_id;
            if (!o[id]) {
                return o[id] = i
            }
            return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
                    o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
                    o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
            })
            var total = []
            Object.keys(o).forEach((key) => {
            total.push(o[key])
            })
            this.setState({employmentdetails_filtered:total})
            otherdetails_data = total
        }else{
            var newList =[];
            var startDate = '';
            this.setState({monthFrom_selected:e.target.value})
            if(e.target.value == 1 || this.state.monthFrom_selected == 12){
            }else{
                startDate = parseInt(e.target.value + 1)
            }
            for(var i = startDate; i <= this.state.monthTo_selected; i++){
                this.state.employmentdetails_data.map((employment)=>{
                    this.state.individualpoints_data.map((individualpoints)=>{
                        if(employment.employee == this.state.employee_id && this.state.employee_id == individualpoints.employee &&
                            parseInt(moment(employment.date_updated).format("MM")) == i && parseInt(moment(individualpoints.date).format("MM")) == i){
                            newList.push({
                                points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                productivity_rating:individualpoints.points/employment.quota,
                            })
                        }
                    })
                })
            }
            var reportArray = []
            for(var i = this.state.yearFrom_selected; i <= this.state.yearTo_selected; i++){
                newList.map((data)=>{
                    if(moment(data.date).format("YYYY") == i){
                            reportArray.push({
                                points_id:data.points_id,employment_id:data.employment_id, emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                productivity_rating:Number((data.productivity_rating).toFixed(2))
                            })
                        }
                })
                
            }
            this.setState({employmentdetails_filtered:reportArray})
        }
}

    onYearFrom = e => {
        if(e.target.value > this.state.yearTo_selected){
            Swal.fire({
            title: 'Invalid Year selected!',
            text: "YearTo must be greater than YearFrom!",
            type:'error'})
        }else{
            this.setState({
                yearFrom_selected:e.target.value,
                monthFrom_selected:0,
                monthTo_selected:0,
                employmentdetails_filtered:[],
            })
        }
    }

    onMonthTo = e => {
            if(parseInt(this.state.monthFrom_selected) > e.target.value && this.state.yearFrom_selected == this.state.yearTo_selected){
                Swal.fire('Invalid!','Date selected is invalid.','error')
            }else if(this.state.designation != 3){
                var newList =[];
                var startDate = '';
                this.setState({monthTo_selected:e.target.value})
                if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
                }else{
                    startDate = parseInt(this.state.monthFrom_selected + 1)
                }
                for(var i = startDate; i <= e.target.value; i++){
                    this.state.employmentdetails_data.map((employment)=>{
                        this.state.individualpoints_data.map((individualpoints)=>{
                            if(employment.department == this.state.department && employment.employee == individualpoints.employee &&
                                parseInt(moment(employment.date_updated).format("MM")) == i && parseInt(moment(individualpoints.date).format("MM")) == i){
                                newList.push({
                                    points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                    name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                    quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                    productivity_rating:individualpoints.points/employment.quota,
                                })
                            }
                        })
                    })
                }
                var reportArray = []
                for(var i = startDate; i <= this.state.yearTo_selected; i++){
                    newList.map((data)=>{
                        if(moment(data.date).format("YYYY") == i){
                                reportArray.push({
                                    points_id:data.points_id,employment_id:data.employment_id, emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                    productivity_rating:data.productivity_rating
                                })
                            }
                    })
                    
                }
                var o = {};
                reportArray.forEach((i) => {
                var id = i.emp_tbl_id;
                if (!o[id]) {
                    return o[id] = i
                }
                return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
                        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
                        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
                })
                
                var total = []
                Object.keys(o).forEach((key) => {
                total.push(o[key])
                })

                this.setState({
                    employmentdetails_filtered:total
                })
                otherdetails_data = total
            }else if(this.state.employee_id == "00"){
                var startDate = '';
                var newList =[];
                this.setState({monthTo_selected:e.target.value})
                if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
                }else{
                    startDate = parseInt(this.state.monthFrom_selected + 1)
                }
                for(var i = startDate; i <= e.target.value; i++){
                    this.state.employmentdetails_data.map((employment)=>{
                        this.state.individualpoints_data.map((individualpoints)=>{
                            if(employment.employee == individualpoints.employee &&
                                moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i){
                                newList.push({
                                    points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                    name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                    quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                    productivity_rating:individualpoints.points/employment.quota,
                                })
                            }
                        })
                    })
                }
                var reportArray = []
                for(var i = this.state.yearFrom_selected; i <= this.state.yearTo_selected; i++){
                    newList.map((data)=>{
                        if(moment(data.date).format("YYYY") == i){
                                reportArray.push({
                                    points_id:data.points_id, employment_id:data.employment_id, emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                    productivity_rating:data.productivity_rating
                                })
                            }
                    })
                }
                var o = {};
                reportArray.forEach((i) => {
                var id = i.emp_tbl_id;
                if (!o[id]) {
                    return o[id] = i
                }
                return o[id].quota = parseFloat(o[id].quota) + parseFloat(i.quota),
                        o[id].productivity_points = parseFloat(o[id].productivity_points) + parseFloat(i.productivity_points),
                        o[id].productivity_rating = Number(parseFloat(o[id].productivity_points/o[id].quota).toFixed(2)) 
                })
                
                var total = []
                Object.keys(o).forEach((key) => {
                total.push(o[key])
                })

                this.setState({
                    employmentdetails_filtered:total
                })
                otherdetails_data = total
            }else{
                this.setState({monthTo_selected:e.target.value})
                var newList =[];
                var startDate = '';
                if(this.state.monthFrom_selected == 1 || this.state.monthFrom_selected == 12){
                }else{
                    startDate = parseInt(this.state.monthFrom_selected + 1)
                }
                for(var i = startDate; i <= e.target.value; i++){
                    this.state.employmentdetails_data.map((employment)=>{
                        this.state.individualpoints_data.map((individualpoints)=>{
                            if(employment.employee == this.state.employee_id && this.state.employee_id == individualpoints.employee &&
                                moment(employment.date_updated).format("MM") == i && moment(individualpoints.date).format("MM") == i){
                                newList.push({
                                    points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                    name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                    quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                    productivity_rating:individualpoints.points/employment.quota,
                                })
                            }
                        })
                    })
                }
                var reportArray = []
                for(var i = this.state.yearFrom_selected; i <= this.state.yearTo_selected; i++){
                    newList.map((data)=>{
                        if(moment(data.date).format("YYYY") == i){
                            reportArray.push({
                                points_id:data.points_id, employment_id:data.employment_id, emp_tbl_id:data.emp_tbl_id, name:data.name, date:data.date, quota:data.quota, productivity_points:data.productivity_points, 
                                productivity_rating:Number((data.productivity_rating).toFixed(2))
                            })
                        }
                    })
                    
                }
                this.setState({employmentdetails_filtered:reportArray})
                otherdetails_data = reportArray
            }  
    }
    
    onYearTo = e => {   
        if(this.state.yearFrom_selected > e.target.value){
            Swal.fire({
            title: 'Invalid Year selected!',
            text: "YearTo must be greater than YearFrom!",
            type:'error'})
        }else{
            this.setState({
                yearTo_selected:e.target.value,
                monthFrom_selected:0,
                monthTo_selected:0,
                employmentdetails_filtered:[],
            })
        }
    }
    scrollToBottom(){
        var element = document.getElementById("bottom");
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
      }

    onShowGraph(e){
        if(this.state.yearFrom_selected > this.state.yearTo_selected){
            Swal.fire('Invalid!','Date selected is invalid.','error')
        }else if(this.state.yearFrom_selected === this.state.yearTo_selected
                && this.state.monthFrom_selected > this.state.monthTo_selected){
                    Swal.fire('Invalid!','Date selected is invalid.','error') 
        }else if(this.state.yearFrom_selected == this.state.yearTo_selected
            && this.state.monthFrom_selected == this.state.monthTo_selected){
                Swal.fire('Invalid!','Date must not be the same.','error') 
        }else{
            this.setState({showBarGraph:true})
                graphData = e
                this.scrollToBottom();
        }
    }

    render(){

        return(

        <div className="container">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:"#db3d44",color:'white'}}>Division</span>
                                    </div>
                                        <select value={this.state.department} onChange={this.onChangeDepartment} name="department" className="form-control dropdown-toggle" >
                                            {this.state.employeeisselected ?<option value="0">Employee is Selected</option>: null }     
                                            {this.state.department_data.map((department) => 
                                                <option key={department.id} value={department.id}>{department.department_name}</option>)}
                                        </select>
                                    </div>
                                
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:"#db3d44", color:'white'}}>Type of Report</span>
                                    </div>
                                        <select value={this.state.reporttype} onChange={this.onChangeReportType} name="reporttype" className="form-control dropdown-toggle">
                                        <option value="1">By Average</option>
                                        <option value="2">By Actual</option>
                                        </select>
                                    </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:"#db3d44",color:'white'}}>Designation</span>
                                    </div>
                                        <select value={this.state.designation} onChange={this.onChangeDesignation} name="designation" className="form-control dropdown-toggle">
                                            <option value="1">Project Based</option>
                                            <option value="2">Dedicated</option>
                                            <option value="3">All</option>
                                        </select>
                                    </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:"#db3d44",color:'white'}}>Position</span>
                                    </div>
                                        <select value={this.state.position} onChange={this.onChangePosition} name="position" className="form-control dropdown-toggle" >
                                            <option value="0">All</option>
                                            {this.state.rr_data.map((position) => 
                                            <option key={position.id} value={position.id}>{position.position}</option>)}
                                        </select>
                                    </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:150,background:"#db3d44",color:'white'}}>Employee Name</span>
                                        </div>
                                        <select onChange={this.onChangeEmployee} name="employee" value={this.state.employee_id} className="form-control dropdown-toggle">
                                                <option value="0">SELECT EMPLOYEE</option>
                                                <option value="00">All</option>
                                            {this.state.employee_data.map((employee) => 
                                                <option key={employee.id} value={employee.id}>{employee.firstname + ' ' + employee.lastname}</option>)}
                                        </select>
                                    </div>
                                    
                                    </div>
                                    <div className="col-md-6">
                                        <p style={{marginTop:-5}}>Month and Year From:</p>
                                        <select onChange={this.onMonthFrom} name="monthFrom" value={this.state.monthFrom_selected} className="form-control dropdown-toggle"style={{marginTop:-15}}>   
                                            <option value="0">Select Month</option>   
                                            {this.state.months.map((month) => 
                                                <option key={month.id} value={month.id}>{month.name}</option>)}
                                        </select>
                                    
                                        <p style={{marginTop:10,paddingBottom:0}}>Month and Year To:</p>
                                        <select onChange={this.onMonthTo} name="monthTo" value={this.state.monthTo_selected} className="form-control dropdown-toggle" style={{marginTop:-15}}>
                                                <option value="0">Select Month</option>
                                            {this.state.months.map((month) => 
                                                <option key={month.id} value={month.id}>{month.name}</option>)}
                                        </select>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <p> </p>
                                       <select onChange={this.onYearFrom} name="yearFrom" value={this.state.yearFrom_selected} className="form-control dropdown-toggle" style={{marginTop:20}}>
                                            {this.state.years.map((year) => 
                                                <option key={year.id} value={year.year}>{year.year}</option>)}
                                        </select>
                                        <p> </p>
                                        <select onChange={this.onYearTo} name="yearTo" value={this.state.yearTo_selected} className="form-control dropdown-toggle" style={{marginTop:35}}>
                                            {this.state.years.map((year) => 
                                                <option key={year.id} value={year.year}>{year.year}</option>)}
                                        </select>
                                    </div>
                                    </div>
                            
                        </div>
                  </div>
                  <br/>
                        <div>
  
                            <MaterialTable
                                title="Monthly Productivity Points Report"
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={this.state.employmentdetails_filtered}
                                actions={[
                                    {
                                      icon: 'assessment',
                                      tooltip: 'Assessment',
                                      onClick: (event, rowData) => this.onShowGraph(rowData)
                                    }
                                  ]}
                                  options={{
                                    actionsColumnIndex: -1
                                }}
                                />
                        </div>
                        {this.state.showOtherDetails ? <OtherDetails data={otherdetails_data}/> : null}
                        {this.state.showBarGraph ? <BarGraph graph={graphData} monthFrom={this.state.monthFrom_selected} monthTo={this.state.monthTo_selected}/> : null}    
                        <div id="bottom"></div>

                </div>
            </div>
  

        );
    }
}
