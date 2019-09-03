import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
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

export default class EmployeeTrainingList extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            training: [],
            startDate: new Date(),
            showModal: false,
            
            employee_id:'',
            trainees_data:[], 
            training_data:[],

            
             //TABLE COLUMNS
             columns: [
                { title: 'Name', field: 'name'},
                { title: 'Date', field: 'date', type:'date'},
                { title: 'Time', field: 'time'},
                { title: 'Speaker', field: 'speaker'},
                { title: 'Venue', field: 'venue'},
                { title: 'Address', field: 'address'},
             ],
        };

    }

    componentDidMount() {
        this.setState({employee_id:this.props.emp_tbl_id})
        axios.get('http://'+window.location.hostname+':8000/trainees/')
        .then(res => {
            this.setState({
                trainees_data: res.data
            })
            var trainingList = [];
            var venue = null;
            var address = null;
            this.state.trainees_data.map((data)=>{
                if(data.employee.id == this.props.emp_tbl_id){
                    if(data.training.venue == 1){
                        venue = "In Company"
                        address = "Company Premises"
                    }else{
                        venue = "Outside"
                        address = data.training.address
                    }
                    trainingList.push({name:data.training.training, date:data.training.date,
                                        time:data.training.time, speaker:data.training.speaker,
                                        venue:venue, address:address})
                }
            })
            this.setState({
                training_data:trainingList
            })
        })
    }

 
    

    render(){
  
        return(

        <div className="container">
            <h3 style={{float:"left"}}>Training</h3> 
                    <br/>
                    <br/>
                <div className="container-fluid">
                        <div className="form-group">
                        <MaterialTable
                            title="List of Training"
                            icons={tableIcons}
                            columns={this.state.columns}
                            data={this.state.training_data}
                            />

                        </div>
                </div>

            </div>
  

        );
    }
}
