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

export default class AddPositionResponsibilities extends Component{      
        _isMounted=false;
                state = {
                    position_id:'',
                    position_name:'',
                    responsibilities:'',
                    update:false, // FOR TO SAVE BTN FROM UPDATES
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

                componentWillReceiveProps({position_data,position}) {
                    if(position_data.id !== undefined){
                            this.setState({
                                last_tbl_id:'',
                                position_id:position_data.id,
                                position_name:position_data.position,
                                responsibilities:position_data.responsibilities,
                                update:true,  
                            })
                         
                    }
                    if(position == 0){
                        this.setState({
                            last_tbl_id:'',
                            position_id:'',
                            position_name:'',
                            responsibilities:'',
                            update:false,  
                        })
                    }
                  }

                onChange = e => {
                    this.setState({[e.target.name]: e.target.value});
                }

                onSubmit = e =>{
                    if(this.state.position_name == '' || this.state.responsibilities == ''){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else{
                        const data = new FormData();
                        data.set('position', this.state.position_name)
                        data.set('responsibilities', this.state.responsibilities)
                        axios.post('http://'+window.location.hostname+':8000/positionresponsibilities/',data)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', "Added Position and Responsibilities (Position: "+this.state.position_name+")")
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "ADD")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Added!','Position and Responsibilities has been added.','success')
                                this.setState({update:true})
                                this.props.callBackParent(true,"submit")

                                var arrayID=[]
                                axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
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
                                Swal.fire('Oops...','Position already added!','error')
                            }
                        });
                    }
                }

                onUpdate = e =>{
                    if(this.state.position_name == '' || this.state.responsibilities == ''){
                        Swal.fire('Oops...','Fields may not be blank!','error')
                    }else{
                        var id = this.state.last_tbl_id?this.state.last_tbl_id:this.state.position_id
                        const data = new FormData();
                        data.set('position', this.state.position_name)
                        data.set('responsibilities', this.state.responsibilities)
                        axios.put('http://'+window.location.hostname+':8000/positionresponsibilities/'+id+'/',data)
                            .then(res => {
                                    const data = new FormData();
                                    data.set('user', user_id)
                                    data.set('description', "Updated Position and Responsibilities (Position: "+this.state.position_name+")")
                                    data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                                    data.set('action', "UPDATE")
                                    axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                                    .then(res => {
                                    })
                                Swal.fire('Updated!','Position and Responsibilities has been updated.','success')
                                this.setState({update:true})
                                this.props.callBackParent(true,"update")
                        })
                        .catch(error => {
                             if(error){
                                Swal.fire('Oops...','Position already added!','error')
                            }
                        });
                    }
                }
            
            onUpdateClicked = e => {
                this.setState({
                    position_name:'',
                    responsibilities:'',
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
                                        Position* 
                                        <input type="text" name="position_name" className="form-control text-center" 
                                                value={this.state.position_name} onChange={this.onChange} placeholder="Position Name"/>
                                    </div>
                                </th>
                                <th className="text-center" style={{border:"1px solid Black"}}> 
                                    Responsibilities* 
                                    <textarea name="responsibilities" className="form-control" value={this.state.responsibilities}
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
