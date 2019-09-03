import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
import TimePicker from 'react-time-picker';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import 'react-times/css/material/default.css';
import 'react-times/css/classic/default.css';
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
  var user_type = '';
  var training = '';
export default class EmployeeList extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            //for adding and updating datas
            training: [],
            startDate: new Date(),
            name:'',
            date: moment(new Date()).format("YYYY-MM-DD"),
            time: '13:00',
            speaker:'',
            venue:'',
            training_duration:'',


             //TABLE COLUMNS FOR EXPENSES
             training_columns: [
                { title: 'Training Name', field: 'training',},
                { title: 'Date', field: 'date', type:'date'},
                { title: 'Time', field: 'time'},
                { title: 'Speaker', field: 'speaker'},
                { title: 'Venue', field: 'venue'},
                { title: 'Training Duration', field: 'training_duration', type: 'numeric'},
              ],
 
     
        };
        this.onDelete = this.onDelete.bind(this);
        
    }

    componentDidMount() {
        axios.get('http://'+window.location.hostname+':8000/training/')
        .then(res => {
            this.setState({
                training: res.data
            })
        })

        axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                    user_type = id.user_type
                })
            })   
    }

        //DELETING DATA
      onDelete(e){
            axios.get('http://'+window.location.hostname+':8000/training/'+this.state.id+'/')
            .then(res => {
                training = res.data.training
            })
            axios.delete('http://'+window.location.hostname+':8000/training/'+this.state.id)
            .then(res => {
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Deleted Training Name: "+ training)
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "Delete")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })
                Swal.fire('Deleted!','Training has been deleted.','success')
                axios.get('http://'+window.location.hostname+':8000/training/')
                .then(res => {
                   this.setState({
                        training: res.data 
                   })
                })
            }) 
           
       }

               
       onAdd = e =>{
        this.props.history.push('/trainingform');
        }

        onEdit(e){
            this.props.history.push('/trainingform/'+e+'/');
        }

    render(){
   
        return(

                <div className="container">
                    <div className="row">   
                            <div className="container-fluid">
                                <br/>
                                    <div>
                                    <h5><Link to="/trainingcertificate">List</Link> / <Link to="/trainingform">Form</Link></h5>
                                           <br/>
                                           <br/>
                                            <MaterialTable
                                                title="List of Training"
                                                icons={tableIcons}
                                                columns={this.state.training_columns}
                                                data={this.state.training}
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
                                                            let data = this.state.training;
                                                            const index = data.indexOf(oldData);
                                                            data.splice(index, 1);
                                                            this.setState({ new_data:data, id:oldData.id  }, () => resolve());
                                                            this.onDelete()//calling delete function
                                                        }
                                                        resolve()
                                                      }, 1000)
                                                    }),
                                                  }}
                                                  options={{
                                                    actionsColumnIndex: -1
                                                  }}
                                            />
                                            <br/>
                                            <br/>
                                    <div className="form-group">
                                        <Button variant="primary" onClick={this.onAdd} style={{float:"right",marginTop:-30}}><AddBox/>&nbsp;ADD</Button>
                                    </div>
                            </div>  
                        </div>
                    </div>
                </div>
    

        );
    }
}
