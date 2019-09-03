import React, {Component} from 'react';
import { render } from "react-dom";
import NumberFormat from 'react-number-format';
import axios from 'axios'
import moment from 'moment';
import Swal from 'sweetalert2'

var user_id = ''; //USERLOG ID
var training ='';

export default class AddExpenses extends Component{
                state = {
                    rows: [{}],
                    
                    training_id:'',
                    reference_number:[],
                    description:[],
                    date:[],
                    amount:[],

                    training_data:[],
                    expense_data:[],
                    row_amount:''
                };

                componentDidMount(){
                    this.setState({training_id:this.props.training_id})
                  
                    axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
                    .then(res => {
                        res.data.map((id)=>{
                            user_id = id.id
                        })
                        axios.get('http://'+window.location.hostname+':8000/training/'+this.props.training_id+'/')
                        .then(res => {
                          this.setState({
                            training_data:res.data
                          })
                          training = this.state.training_data.training
                        })
                    })
                }
                componentWillReceiveProps({training_id}) {
                    this.setState({
                      training_id:training_id
                    })
                  }

                handleChangeReferenceNumber = index => e => {
                    const { name, value } = e.target;
                    const rows = [...this.state.rows];
                    rows[index] = {
                    [name]: value
                    };
                    this.setState({
                    rows
                    });
                    
                    const reference_number = [...this.state.reference_number]
                    reference_number[index] = {
                    [name]: value
                    };
                    this.setState({
                    reference_number
                    });

                };
                
                handleChangeDescription = index => e => {
                    const { name, value } = e.target;
                    const rows = [...this.state.rows];
                    rows[index] = {
                    [name]: value
                    };
                    this.setState({
                    rows
                    });
                    
                    const description = [...this.state.description]
                    description[index] = {
                    [name]: value
                    };
                    this.setState({
                    description
                    });

                };

                handleChangeDate = index => e => {
                    const { name, value } = e.target;
                    const rows = [...this.state.rows];
                    rows[index] = {
                    [name]: value
                    };
                    this.setState({
                    rows
                    });
                    
                    const date = [...this.state.date]
                    date[index] = {
                    [name]: value
                    };
                    this.setState({
                    date
                    });

                };

                handleChangeAmount = index => e => {
                    
                    const { name, value } = e.target;
                    const rows = [...this.state.rows];
                    rows[index] = {
                    [name]: value
                    };
                    this.setState({
                    rows
                    });
                    
                    const amount = [...this.state.amount]
                    amount[index] = {
                    [name]: value.substr(1)
                    };
                    this.setState({
                    amount
                    });
                };

                handleAddRow = () => {
                    const item = {
                    reference_number: "",
                    description: "",
                    date: "",
                    amount: "",
                    };
                    this.setState({
                    rows: [...this.state.rows, item]
                    });
                };
                handleRemoveRow = () => {
                    this.setState({
                    rows: this.state.rows.slice(0, -1)
                    });
                };
                handleAddExpenses = (index) => () => {
    
                  if(this.state.reference_number[0] == undefined || this.state.description[0] == undefined ||
                      this.state.date[0]== undefined || this.state.amount[0]== undefined){
                        Swal.fire('Oops...','Fields may not be blank','error') 
                    }else{
                      var itemList = [];
                      this.state.rows.map((item, index) =>{
                        if(item.reference_number == "" || item.description == "" || item.date == "" || item.amount == ""){
                          itemList.push(1)
                        }else if(this.state.reference_number[index] == undefined || this.state.description[index] == undefined 
                                || this.state.date[index] == undefined || this.state.amount[index] == undefined){
                          itemList.push(1)
                        }else if(this.state.reference_number.some(item => item.reference_number == "") == true 
                                || this.state.description.some(item => item.description == "") == true
                                || this.state.date.some(item => item.date == "") == true 
                                || this.state.amount.some(item => item.amount == "") == true){
                          itemList.push(1)
                        }

                      })
                        if(itemList.length > 0){
                          Swal.fire('Oops...','Fields may not be blank','error') 
                        }else{
                            this.state.rows.map((item,index) =>{
                              this.state.expense_data.push({
                                index:index,
                                reference_number: this.state.reference_number[index].reference_number,
                                description:this.state.description[index].description,
                                date:this.state.date[index].date,
                                amount:this.state.amount[index].amount
                              })
                            })
                          this.onSubmitExpenses();
                        }
                    }   
                }
                handleRemoveSpecificRow = (index) => () => {
                    const rows = [...this.state.rows]
                    rows.splice(index, 1)
                    this.setState({ rows })
                }

              onSubmitExpenses = e =>{
                    this.state.expense_data.map((expense)=>{
                        if(expense.reference_number == undefined || expense.description == undefined || expense.date == undefined || expense.amount == undefined){
                            Swal.fire('Oops...','Fields may not be blank at index '+expense.index,'error')
                        }else{
                        const data = new FormData();
                        data.set('training_id', this.state.training_id)
                        data.set('reference_number', expense.reference_number)
                        data.set('description', expense.description)
                        data.set('date', moment(expense.date).format("YYYY-MM-DD"))
                        data.set('amount', expense.amount)
                        axios.post('http://'+window.location.hostname+':8000/budgets/',data)
                        .then(res => {
                              const data = new FormData();
                              data.set('user', user_id)
                              data.set('description', "Added Expense (Reference# "+expense.reference_number+") on Training: "+ training)
                              data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                              data.set('action', "ADD")
                              axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                              .then(res => {
                              })
                            Swal.fire('Added!','Expense has been added.','success')
                              this.setState({
                                rows: [],
                                reference_number:[],
                                description:[],
                                date:[],
                                amount:[],
                                expense_data:[],
                                row_amount:''
                              })
                              this.props.callBackParent(true)
                            })
                          }
                        })
                    
                    }
  render() {
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
                <button className="btn btn-primary float-left" onClick={this.handleAddExpenses()} style={{marginBottom:5}}>
                    ADD ALL DATA
                </button>
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Reference Number </th>
                    <th className="text-center"> Description </th>
                    <th className="text-center"> Date </th>
                    <th className="text-center"> Amount </th>
                    <th className="text-center"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, index) => (
                    <tr id="addr0" key={index}>
                      <td>{index}</td>
                      <td>
                            <input
                            type="text"
                            name="reference_number"
                            defaultValue={this.state.rows[index].reference_number}
                            onChange={this.handleChangeReferenceNumber(index)}
                            className="form-control"
                            />
                      </td>
                      <td>
                            <input
                            type="text"
                            name="description"
                            defaultValue={this.state.rows[index].description}
                            onChange={this.handleChangeDescription(index)}
                            className="form-control"
                            />
                      </td>
                      <td>
                            <input
                            type="date"
                            name="date"
                            defaultValue={this.state.rows[index].date}
                            onChange={this.handleChangeDate(index)}
                            className="form-control"
                            />
                      </td>
                      <td>
                        <NumberFormat 
                            value={this.state.rows[index].amount}
                            thousandSeparator={true}
                            prefix={'₱'}
                            onValueChange={(values) => {
                                const {formattedValue, value} = values;
                                this.setState({row_amount: value})
                            }}
                            onChange={this.handleChangeAmount(index)}
                            style={{textAlign:"right"}}
                            className="form-control"
                            placeholder="₱"
                            name="amount"/>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={this.handleRemoveSpecificRow(index)}
                        >
                          Remove
                        </button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={this.handleRemoveRow}className="btn btn-danger float-right" style={{marginLeft:5}}>
                    Delete Last Row
                </button>
                <button onClick={this.handleAddRow} className="btn btn-info float-right" >
                    Add Row
                </button>
                
            </div>
          </div>
        </div>
      </div>
    );
  }
}
