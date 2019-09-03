import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  
import Swal from 'sweetalert2'
import {withRouter, Link} from "react-router-dom"; 
import moment from "moment";
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
import CloseIcon from '@material-ui/icons/Clear';
           
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
  var employeeID ='';
  
class EmployeeList extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            
            id:'',
            employeelist_data:[],
            employment_details:[],
            position_data:[],

            tableEmployeeData:[],
            newtableEmployeeData:[],
            new_data:[], //for delete purposes
             //TABLE COLUMNS
             columns: [
                { title: 'Employee ID', field: 'employeeID'},
                { title: 'Name', field: 'name'},
                { title: 'Position', field: 'position'},
             ],

             arrayID:[],
        };

    }

    componentDidMount() {
        axios.get('http://'+window.location.hostname+':8000/employmentdetails/')
        .then(res => {
            this.setState({
                employment_details: res.data
                })
                var newList = [];
                this.state.employment_details.map((employee)=>{
                        newList.push({id:employee.employee_id.id, employeeID:employee.employee_id.employeeID,
                            name:employee.employee_id.firstname+' '+employee.employee_id.lastname,position:employee.roles_responsibilities_id.position,
                            date:employee.date_employed})
                        this.state.arrayID.push({id:employee.employee_id.id})
                })
                this.setState({tableEmployeeData:newList})

                axios.get('http://'+window.location.hostname+':8000/employee/')
                .then(res => {
                    this.setState({
                        employeelist_data: res.data
                        })
                            var newList = [];
                            this.state.employeelist_data.map((employee)=>{
                                newList.push({id:employee.id, employeeID:employee.employeeID ,name:employee.firstname + ' ' + employee.lastname})
                            })

                            this.state.arrayID.map((id) => {
                                newList.map((data)=>{
                                    if(data.id === id.id){
                                        newList.splice(newList.indexOf(data),1)
                                    }
                                })
                            })
                            this.setState({
                                newtableEmployeeData: newList.concat(this.state.tableEmployeeData)
                            })
                        })
                })
             
            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            })   
              
        }

    onAdd = e =>{
        this.props.history.push('/employeeform');
    }

    onEdit(e){
        this.props.history.push('/employeeform/'+e+'/');
    }

 //DELETING DATA
 onDelete(e){
    axios.get('http://'+window.location.hostname+':8000/employee/'+e+'/')
    .then(res => {
        employeeID = res.data.employeeID
    })
    axios.delete('http://'+window.location.hostname+':8000/employee/'+e)
    .then(res => {
        Swal.fire('Deleted!','Employee has been deleted.','success')
            const data = new FormData();
            data.set('user', user_id)
            data.set('description', "Deleted Employee ID: "+employeeID)
            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
            data.set('action', "DELETE")
            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
            .then(res => {
            })
        axios.get('http://'+window.location.hostname+':8000/employmentdetails/')
        .then(res => {
            this.setState({
                employment_details: res.data
                })
                this.state.employment_details.map((employee)=>{
                    this.state.tableEmployeeData.push({id:employee.employee_id.id, employeeID:employee.employee_id.employeeID,
                        name:employee.employee_id.firstname+' '+employee.employee_id.lastname,position:employee.roles_responsibilities_id.responsibilities})
                })
                console.log(this.state.employment_details)

                axios.get('http://'+window.location.hostname+':8000/employee/')
                .then(res => {
                    this.setState({
                        employeelist_data: res.data
                        })
                       
                        this.state.employeelist_data.map((employee)=>{
                            this.state.tableEmployeeData.push({id:employee.id, employeeID:employee.employeeID,
                                name:employee.firstname+' '+employee.lastname,})
                            })
                       
                       
                })
              
        })
    }) 
}
    

    render(){

        return(

        <div className="container">
             <div className="row"> 
                <div className="container-fluid">
                <h5><Link to="/employeelist">List</Link> / <Link to="/employeeform">Form</Link></h5>
                            <br/>
                            <br/>
                            <MaterialTable
                            title="Employee List"
                            icons={tableIcons}
                            columns={this.state.columns}
                            data={this.state.newtableEmployeeData.sort((a,b) => a["id"]>b["id"]?-1:1)}
                            actions={[
                                {
                                  icon: 'edit',
                                  tooltip: 'Edit',
                                  onClick: (event, rowData) => this.onEdit(rowData.id)
                                }
                              ]}
                              editable={{
                                onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                  setTimeout(() => {
                                    {
                                        let data = this.state.newtableEmployeeData;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({ deleteEmployee:data, id:oldData.id  }, () => resolve());
                                        this.onDelete(oldData.id)//calling delete function
                                    }
                                    resolve()
                                  }, 1000)
                                }),
                              }}
                              options={{
                                actionsColumnIndex: -1
                            }}
                            />
                             <button onClick={this.onAdd} className= "btn btn-primary" style={{float:'right',marginTop:10}}><AddBox/>ADD</button>
                                 
                    </div>
                </div>
            </div>
  

        );
    }
}

export default withRouter(EmployeeList)