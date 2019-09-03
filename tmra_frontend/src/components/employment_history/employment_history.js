import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import Swal from 'sweetalert2'
//FOR MATERIAL TABLE
import { forwardRef } from 'react';
import MaterialTable from 'material-table';
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

export default class Roles_Responsibility extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
 
            employmenthistory_data:[],
            employmenthistoryList:[],
            //TABLE COLUMNS
            columns: [
                { title: 'Department', field: 'department'},
                { title: 'Date Employed', field: 'date_employed'},
                { title: 'Date Effective' , field: 'date_effective'},
                { title: 'Position', field: 'position'},
                { title: 'Quota', field: 'quota'},
                { title: 'Salary Base' , field: 'salary_base'},
                { title: 'Basic Rate', field: 'basic_rate'},
                { title: 'Incentive', field: 'incentive'},
                { title: 'Challenge Quota' , field: 'challenge_quota'},
                { title: 'Designation', field: 'designation'},
                { title: 'Assignment', field: 'assignment'},
                { title: 'Status' , field: 'status'},
                { title: 'Employment Status', field: 'employment_status'},
                { title: 'Resignation Date', field: 'resignation_date'},
                { title: 'End of Contract', field: 'end_of_contract'},
                { title: 'Remarks', field: 'remarks'},
                { title: 'Flexi', field: 'flexi'},
                { title: 'Work Schedule' , field: 'work_schedule'},
                { title: 'Date Updated' , field: 'date_updated'},
              ],
        };
     
    }
        //retrieving all values
    componentDidMount() {
        console.log(this.props.emp_tbl_id)
        axios.get('http://'+window.location.hostname+':8000/employmenthistory/?id='+this.props.emp_tbl_id)
        .then(res => {
                this.setState({
                    employmenthistoryList:res.data
                })
                var historyList = [];
                var designation = null;
                var status = null;
                var employment_status = null;
                var flexi = null;
                this.state.employmenthistoryList.map((history)=>{
                    if(history.designation == 1){
                        var designation = "Project Base"
                    }else{
                        var designation = "Dedicated"
                    }
                    if(history.employee_type == 1){
                        var status= "With Contract"
                    }else{
                        var status= "Open Contract"
                    }
                    if(history.employment_status == 1){
                        var employment_status = "Trainee"
                    }else if(history.employment_status == 2){
                        var employment_status = "Regular"
                    }else if(history.employment_status == 3){
                        var employment_status = "Resigned"
                    }else if(history.employment_status == 4){
                        var employment_status = "End of Contract"
                    }
                    if(history.flexi == 1){
                        var flexi = "No"
                    }else{
                        var flexi = "Yes"
                    }
                    
                    historyList.push({department:history.department_id.department_name, date_employed:history.date_employed,
                                    date_effective:history.date_effective, position:history.roles_responsibilities_id.position,
                                    quota:history.quota, salary_base:history.salary_base, basic_rate:history.basic_rate,
                                    incentive: history.incentive, challenge_quota:history.challenge_quota, designation:designation,
                                    assignment:history.assignment, status:status, employment_status:employment_status,
                                    resignation_date:history.resignation_date, end_of_contract:history.end_of_contract, 
                                    remarks:history.remarks_for_resignation_termination, flexi:flexi, 
                                    work_schedule:history.schedule_id.login+'-'+history.schedule_id.logout, date_updated:history.date_updated})
                })
                this.setState({
                    employmenthistory_data:historyList
                })
            })
    }

    render(){
        return(

        <div className="container">
            <div className="row">  
                <div className="container-fluid">
      
                                <MaterialTable
                                title=""
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={this.state.employmenthistory_data}
                                style={{maxWidth:900}}
                                />
                    </div>
                </div>
            </div>
  

        );
    }
}