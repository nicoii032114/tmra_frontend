import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
import moment from 'moment';
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
  var employeeID = '';
  var user_type = 3;

export default class EvaluationList extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            evaluation_data: [],
            startDate: new Date(),
            id:'',
            employee_id:'',
            date: moment(new Date()).format("YYYY-MM-DD"),
            description:'',
            certifiedby:'',
            performance_rating:'',

            add_data:[],
            new_data:[], //array for updated data

            //TABLE COLUMNS
            columns: [
                { title: 'Date', field: 'date',type:'date'},
                { title: 'Description', field: 'description'},
                { title: 'Certified by', field: 'certified_by'},
                { title: 'Performance Rating', field: 'performance_rating', type: 'numeric'},
              ],

              
        };

        const { to, staticContext, ...rest } = this.props;
    }

    componentDidMount() {
        this.setState({
            employee_id:this.props.emp_tbl_id,
        })
        axios.get('http://'+window.location.hostname+':8000/employeeevaluation/?id='+this.props.emp_tbl_id)
        .then(res => {
            this.setState({
                evaluation_data: res.data
            });
        })
        

        axios.get('http://'+window.location.hostname+':8000/employee/'+this.props.emp_tbl_id+'/')
        .then(res => {
            employeeID = res.data.employeeID
        })

        axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
            res.data.map((id)=>{
                user_id = id.id
                user_type = id.user_type
            })
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
    //Adding data to each states name == input field name
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

       onSubmit = e => {
        var int = parseInt(this.state.add_data.performance_rating)
        //e.preventDefault();
        const data = new FormData();
        data.set('employee_id', this.state.employee_id)
        data.set('date', moment(this.state.add_data.date).format("YYYY-MM-DD"))
        data.set('description', this.state.add_data.description)
        data.set('certified_by', this.state.add_data.certified_by)
        data.set('performance_rating', int)
        axios.post('http://'+window.location.hostname+':8000/employeeevaluation/',data)
            .then(res => {
                    const data = new FormData();
                    data.set('user', user_id)
                    data.set('description', "Added Evaluation to Employee ID: "+employeeID)
                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                    data.set('action', "ADD")
                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                    .then(res => {
                    })

                Swal.fire('Added!','Evaluation has been added.','success')
                    //GETTING ALL DATA FROM BUDGET WHERE TRAINING ID = PARAMS
                    axios.get('http://'+window.location.hostname+':8000/employeeevaluation/?id='+this.state.employee_id)
                    .then(res => {
                            this.setState({
                                evaluation_data:res.data,
                            })
                    })
        })
        .catch(error => {
            if(error.response.data.description || error.response.data.performance_rating){
                Swal.fire('Oops...','Fields may not be blank!','error')
            }else{

            }
        }); 
    }

        //UPDATING  DATA
        onUpdate = e => {
            const data = new FormData();
            data.set('employee_id', this.state.new_data.employee_id)
            data.set('date', moment(this.state.new_data.date).format("YYYY-MM-DD"))
            data.set('description', this.state.new_data.description)
            data.set('certified_by', this.state.new_data.certified_by)
            data.set('performance_rating', this.state.new_data.performance_rating)
            axios.put('http://'+window.location.hostname+':8000/employeeevaluation/'+this.state.id+'/',data)
                .then(res => {
                        const data = new FormData();
                        data.set('user', user_id)
                        data.set('description', "Updated Evaluation of Employee ID: "+employeeID)
                        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                        data.set('action', "UPDATE")
                        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                        .then(res => {
                        })
                    Swal.fire('Updated!','Evaluation has been updated.','success')
                        //GETTING ALL DATA FROM BUDGET WHERE TRAINING ID = PARAMS
                        axios.get('http://'+window.location.hostname+':8000/employeeevaluation/?id='+this.state.employee_id)
                        .then(res => {
                                this.setState({
                                    evaluation_data:res.data,
                                    showModal:false,
                                })
                        })
            })
            .catch(error => {
                if(error.response.data.description || error.response.data.certified_by || error.response.data.performance_rating){
                     Swal.fire('Oops...','Fields may not be blank!','error')
                }else{
    
                }
            }); 
        }

        //DELETING DATA
        onDelete(){
                axios.delete('http://'+window.location.hostname+':8000/employeeevaluation/'+this.state.id)
                .then(res => {
                        const data = new FormData();
                        data.set('user', user_id)
                        data.set('description', "Deleted Evaluation of Employee ID: "+employeeID)
                        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                        data.set('action', "DELETE")
                        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                        .then(res => {
                        })
                    Swal.fire('Deleted!','Evaluation has been deleted.','success')
                        //alert("Successful")GETTING ALL DATA FROM BUDGET WHERE TRAINING ID = PARAMS
                        axios.get('http://'+window.location.hostname+':8000/employeeevaluation/?id='+this.state.employee_id)
                        .then(res => {
                                this.setState({
                                    evaluation_data:res.data
                                })
                                
                        })
        
                }) 
            }

    

    render(){

        return(

        <div className="container">
                <h3 style={{float:"left"}}>Evaluation</h3>
                <br/>
                <br/> 
                <div className="container-fluid">
                  
                        <div>
            {user_type === 3? <MaterialTable
                                title="List of Evaluation"
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={this.state.evaluation_data}
                                options={{
                                    actionsColumnIndex: -1
                                }}
                                />
                                :
                                <MaterialTable
                                title="List of Evaluation"
                                icons={tableIcons}
                                columns={this.state.columns}
                                data={this.state.evaluation_data}
                                editable={{
                                    onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                    if(newData.date && newData.description && newData.certified_by && newData.performance_rating){
                                            setTimeout(() => {
                                                {
                                                    const data = this.state.add_data;
                                                    this.setState({ add_data:newData }, () => resolve());
                                                    this.onSubmit()
                                                }
                                                resolve();
                                            }, 1000)
                                        }else{
                                            Swal.fire('Oops...','Fields may not be blank!','error')
                                            console.log(newData)
                                            reject();
                                            
                                        }
                                    }),
                                    onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                    if(newData.date === null || newData.description === '' || newData.certified_by === '' || newData.performance_rating === ''){
                                            Swal.fire('Oops...','Fields may not be blank!','error')
                                            reject();
                                    }else{
                                    setTimeout(() => {
                                        {
                                        const data = this.state.evaluation_data;
                                        const index = data.indexOf(oldData);
                                        data[index] = newData;
                                        this.setState({ new_data:newData, id:oldData.id }, () => resolve());
                                        this.onUpdate()//calling update function
                                        }
                                        resolve()
                                    }, 1000)
                                }
                                    }),
                                    onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                        let data = this.state.evaluation_data;
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
                                />} 
                        </div>
                </div>
            </div>
  

        );
    }
}
