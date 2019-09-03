import React, {Component} from 'react';
import axios from 'axios';
import ReactTable from "react-table";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2'
import NumberFormat from 'react-number-format';
import AddExpenses from './add_expenses.js';
//MATERIL UI TIMEPICKER
import 'date-fns';

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

var amount = null;
  
var user_id = ''; //USERLOG ID
var employeeID = '';
var training = '';

export default class ExpensesList extends Component{
    
        _isMounted=false;
        constructor(props) {
            super(props);
                
            this.state = {

                expensesList:[],
                expensesData:[],//FOR ADDING EXPENSES
                expensesUpdate:[],
                expensesID:'',

                selectedDate:new Date(),
                training_id:'',

                 //TABLE COLUMNS FOR EXPENSES
                 expenses_columns: [
                    { title: 'Reference Number', field: 'reference_number',},
                    { title: 'Description', field: 'description'},
                    { title: 'Date', field: 'date', type:'date'},
                    {
                        title: 'Amount', field: 'amount',
                        editComponent: props => (
                            <NumberFormat 
                            value={amount}
                            thousandSeparator={true}
                            prefix={'₱'}
                            onValueChange={(values) => {
                                const {formattedValue, value} = values;
                                amount = value
                            }}
                            style={{textAlign:"right"}}
                            className="form-control"
                            placeholder='₱'/>
                        )
                    }
                ],
            };
        }

        //CALL BACK FROM ADD EXPENSES
         myExpenseCallback = (dataFromChild) => {
            if(dataFromChild){
                this.getExpensesData()
            }
        }

        componentDidMount(){
            this.setState({training_id:this.props.training_id})
            this._isMounted = true;
            
            if(this.props.training_id !== undefined){
                this.getExpensesData()
            }

            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            })  
        }

        componentWillReceiveProps({training_id}) {
            this.setState({
              training_id:training_id
            })
            this._isMounted = true
            this.getExpensesData()
          }

        componentWillUnmount() {
            this._isMounted = false;
          }

        getExpensesData(){
            axios.get('http://'+window.location.hostname+':8000/budgets/?id='+this.state.training_id)
            .then(res => {
                if(this._isMounted){
                    this.setState({
                        expensesList:res.data
                    })
                }

                axios.get('http://'+window.location.hostname+':8000/training/'+this.state.training_id+'/')
                .then(res => {
                    training = res.data.training
                })
            })
        }

       //UPDATING  DATA
       onUpdateExpenses = e => {
                const data = new FormData();
                data.set('training_id', this.state.training_id)
                data.set('reference_number', this.state.expensesUpdate.reference_number)
                data.set('description', this.state.expensesUpdate.description)
                data.set('date', moment(this.state.expensesUpdate.date).format("YYYY-MM-DD"))
                data.set('amount', amount)
                axios.put('http://'+window.location.hostname+':8000/budgets/'+this.state.expensesID+'/',data)
                    .then(res => {
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Updated Expense (Reference# "+this.state.expensesUpdate.reference_number+") on Training: "+ training)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "UPDATE")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })
                        Swal.fire('Updated!','Expense has been updated.','success')
                        axios.get('http://'+window.location.hostname+':8000/budgets/?id='+this.state.training_id)
                        .then(res => {
                            this.setState({
                                expensesList:res.data
                            })
                        })
                })
                .catch(error => {
                    if(error.response.data.reference_number || error.response.data.description || error.response.data.date || error.response.data.amount){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else{

                    }
            })
        }

        onDeleteExpenses(e){
                    var reference_number = '';
                    axios.get('http://'+window.location.hostname+':8000/budgets/'+e+'/')
                    .then(res => {
                        reference_number = res.data.reference_number
                    })

                    axios.delete('http://'+window.location.hostname+':8000/budgets/'+e)
                    .then(res => {
                            const data = new FormData();
                            data.set('user', user_id)
                            data.set('description', "Deleted Expense (Reference# "+reference_number+") on Training: "+ training)
                            data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                            data.set('action', "DELETE")
                            axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                            .then(res => {
                            })
                        Swal.fire('Deleted!','Expense has been deleted.','success')
                        axios.get('http://'+window.location.hostname+':8000/budgets/?id='+this.state.training_id)
                        .then(res => {
                            this.setState({
                                expensesList:res.data
                            })
                        })
                    })        
       }
  
    render(){
        return(
            <div className="container">
                <div className="row">                 
                    <div className="container-fluid">
                        <AddExpenses training_id={this.state.training_id} callBackParent={this.myExpenseCallback}/>
                        <br/>
                        <center><div>    
                            <MaterialTable
                                title="List of Expenses"
                                icons={tableIcons}
                                columns={this.state.expenses_columns}
                                data={this.state.expensesList}
                                editable={{
                                    onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        if(newData.reference_number === '' || newData.description === '' || newData.date === null || newData.amount === '' || amount === null){
                                            Swal.fire('Oops...','Fields may not be blank!','error') 
                                            reject();
                                        }else{
                                        setTimeout(() => {
                                            {
                                                const data = this.state.expensesList;
                                                const index = data.indexOf(oldData);
                                                data[index] = newData;           
                                                this.setState({ expensesUpdate:newData,expensesID:oldData.id }, () => resolve());
                                                this.onUpdateExpenses()
                                            }
                                            resolve();
                                        }, 1000);
                                    }
                                    }),
                                    onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            let data = this.state.expensesList;
                                            const index = data.indexOf(oldData);
                                            data.splice(index, 1);
                                            this.setState({}, () => resolve());
                                            this.onDeleteExpenses(oldData.id)//calling delete function
                                        }
                                        resolve()
                                    }, 1000)
                                    }),
                                }}
                                options={{
                                    actionsColumnIndex: -1
                                }}
                            />
                        </div></center> 
                    </div> 
             </div>
    </div>
        );
    }
}   