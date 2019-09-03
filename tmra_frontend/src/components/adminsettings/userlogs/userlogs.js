import React, { Component } from 'react';
import axios from 'axios';
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

  export default class UserLogs extends Component{
            _isMounted = false;
            constructor(props, context) {
                super(props, context);
                    this.state = {
                        userlogs_data:[],
                        userList:[],

                         //TABLE COLUMNS
                        columns: [
                            { title: 'Username', field: 'username'},
                            { title: 'User Type', field: 'user_type'},
                            { title: 'Description', field: 'description'},
                            { title: 'Action', field: 'action'},
                            { title: 'Date', field: 'date',},
                        ],
                    };

                }

                componentDidMount() {
                this._isMounted = true;
                axios.get('http://'+window.location.hostname+':8000/userlogs/')
                .then(res => {
                    var newList = [];
                    if(this._isMounted){
                        this.setState({
                        userlogs_data: res.data
                        })
                     this.state.userlogs_data.map((logs)=>{
                         var user_type
                         if(logs.user_id.user_type == "1"){
                            user_type = "Administrator"
                         }else if(logs.user_id.user_type == "2"){
                             user_type = "Supervison"
                         }else{
                             user_type = "Staff"
                         }
                         newList.push({username:logs.user_id.username, user_type:user_type,
                                description:logs.description, action:logs.action, date:logs.date})
                     })
                     this.setState({
                         userList:newList
                     })

                    }
                })
                }

                componentWillUnmount() {
                    this._isMounted = false;
                }
                
    render(){
 
        return (
        
            <div className="container">
                <div className="row">
                    <div className="container-fluid">
                                <MaterialTable
                                    title="User Logs"
                                    icons={tableIcons}
                                    columns={this.state.columns}
                                    data={this.state.userList}
                                    />
                            </div>
                    </div>
            </div>
  

          );
    }
    
}
