import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
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
import AccountSettings from '@material-ui/icons/AccountCircle'

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

 

export default class UserList extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
    
            user_data:[],
            userList:[],

            //TABLE COLUMNS
            columns: [
                { title: 'ID Number/Username', field: 'employeeID'},
                { title: 'Name', field: 'name'},
            
              ],

              
        };

    }

        componentDidMount() {
            axios.get('http://'+window.location.hostname+':8000/users/')
            .then(res => {
                this.setState({
                    user_data: res.data
                })
                var newList = [];
                this.state.user_data.map((user)=>{
                    newList.push({id:user.id,employeeID:user.employee_id.employeeID, 
                                    name:user.employee_id.firstname+' '+user.employee_id.lastname
                                })
                })
               this.setState({userList:newList})
            })
        }

        addUser = e =>{
            this.props.history.push('/adminsettings/usersettings/createuser/')
        }

    render(){
  
        return(

        <div className="container">
                <div className="container-fluid">
                <Link to="/adminsettings/usersettings/accountsettings/" onClick={this.accountSettings}style={{float:"right",marginTop:5}}><AccountSettings/>Account Settings</Link>
                       <br/>
                       <br/>
                       <button onClick={this.addUser} type="submit" className="btn btn-primary" style={{marginBottom:5,background:"#6495ED"}}><AddBox/>ADD ACCOUNT</button>

                        <br/>
                        <div>
                            <MaterialTable
                                title="List of Users"
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={this.state.userList}
                                actions={[
                                    {
                                      icon: 'edit',
                                      tooltip: 'Update Account',
                                      onClick: (event, rowData) => this.props.history.push('/adminsettings/usersettings/createuser/'+rowData.id+'/')
                                    }
                                  ]}
                                options={{
                                    actionsColumnIndex: -1
                                }}
                                />
                        </div>
                </div>
            </div>
  

        );
    }
}
