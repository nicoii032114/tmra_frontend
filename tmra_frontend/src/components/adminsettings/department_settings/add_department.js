import React, {Component} from 'react';
import { render } from "react-dom";
import NumberFormat from 'react-number-format';
import axios from 'axios'
import moment from 'moment';
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker';
import Autosuggest from 'react-autosuggest';
//ICONS
import AddBox from '@material-ui/icons/AddBox';
import SaveAlt from '@material-ui/icons/SaveAlt';

var user_id = ''; //USERLOG ID


export default class AddDepartment extends Component{      
        _isMounted=false;
                state = {
                    department_id:'',
                    department_name:'',
                    classification:'',
                    updateeeeeeeeeee:false, // FOR TO SAVE BTN FROM UPDATES
                    addnew:false, //CHANGING SAVE BTN TO ADD NEW AFTER ADDING DONE
                    last_tbl_id:'',

                };

                componentDidMount(){
                    axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
                    .then(res => {
                        res.data.map((id)=>{
                            user_id = id.id
                        })
                    })
                }

                componentWillReceiveProps({department_data,department}) {
                    if(department_data.id !== undefined){
                        this.setState({
                            last_tbl_id:'',
                            department_id:department_data.id,
                            department_name:department_data.department,
                            classification:department_data.classification,
                            update:true,  
                        })
                     
                    }
                    if(department == 0){
                        this.setState({
                            last_tbl_id:'',
                            department_id:'',
                            department_name:'',
                            classification:'',
                            update:false,  
                        })
                    }
                   
                  }

                onChange = e => {
                    this.setState({[e.target.name]: e.target.value});
                }

                onSubmit = e =>{
                    if(this.state.department_name == '' || this.state.classification == ''){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else{
                        const data = new FormData();
                        data.set('department_name', this.state.department_name)
                        data.set('classification', this.state.classification)
                        axios.post('http://'+window.location.hostname+':8000/department/',data)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', "Added Department and Classification (Department: "+this.state.department_name+")")
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "ADD")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Added!','Department and Classifcation has been added.','success')
                                this.setState({update:true})
                                this.props.callBackParent(true,"submit")

                                var arrayID=[]
                                axios.get('http://'+window.location.hostname+':8000/department/')
                                .then(res => {
                                        res.data.map((ids)=>{
                                            arrayID.push(ids.id)
                                        })
                                        this.setState({
                                            last_tbl_id:Math.max(...arrayID)
                                        })
                                    })
                        })
                        .catch(error => {
                             if(error){
                                Swal.fire('Oops...','Department already added!','error')
                            }
                        });
                    }
                }

                onUpdate = e =>{
                    if(this.state.department_name == '' || this.state.classification == ''){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else{
                        var id = this.state.last_tbl_id?this.state.last_tbl_id:this.state.department_id
                        const data = new FormData();
                        data.set('department_name', this.state.department_name)
                        data.set('classification', this.state.classification)
                        axios.put('http://'+window.location.hostname+':8000/department/'+id+'/',data)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', "Updated Department and Classification (Department: "+this.state.department_name+")")
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "UPDATE")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Updated!','Department and Classification has been updated.','success')
                                this.setState({update:true})
                                this.props.callBackParent(true,"update")
                        })
                        .catch(error => {
                             if(error){
                                Swal.fire('Oops...','Department already added!','error')
                            }
                        });
                    }
                }
            
            onUpdateClicked = e => {
                this.setState({
                    department_name:'',
                    classification:'',
                    update:false,
                    addnew:false,
                })
                this.props.callBackParent(true,"new")
            }

  render() {

    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
                {this.state.update || this.state.addnew?<button className="btn btn-primary" style={{float:"left",marginBottom:5}} onClick={this.onUpdateClicked}><AddBox/>ADD NEW</button>
                                    :<button className="btn btn-primary" style={{float:"left",marginBottom:5}} onClick={this.onSubmit}><SaveAlt/>SAVE</button>}

                {this.state.update?<button className="btn btn-primary" style={{float:"left",marginBottom:5,marginLeft:5}} onClick={this.onUpdate}><SaveAlt/>SAVE</button>
                                    :null}
                <br/>
                <div className="table-responsive text-nowrap" > 
                    <table className="table table-striped" id="tab_logic">
                        <thead>
                            <tr>
                                <th className="text-center" style={{border:"1px solid Black",width:250}}>
                                    <div style={{paddingBottom:24}}>
                                        Department* 
                                        <input type="text" name="department_name" className="form-control text-center" 
                                                value={this.state.department_name} onChange={this.onChange} placeholder="Department Name"/>
                                    </div>
                                </th>
                                <th className="text-center" style={{border:"1px solid Black"}}> 
                                    Classification* 
                                    <textarea name="classification" className="form-control" value={this.state.classification}
                                        onChange={this.onChange} placeholder="Description"/>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <br/>
               
            </div>
          </div>
        </div>
      </div>
    );
  }
}
