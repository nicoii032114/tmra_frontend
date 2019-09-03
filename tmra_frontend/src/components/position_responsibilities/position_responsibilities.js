import React, {Component} from 'react';
import axios from 'axios';
import { Checkbox } from '@material-ui/core';
import Swal from 'sweetalert2';
import AddPositionRespon from './add_position_responsibilities.js'
import moment from 'moment'
//FOR MATERIAL TABLE
import { forwardRef } from 'react';
import MaterialTable,  { MTableToolbar} from 'material-table';
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
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
           
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

export default class PositionResponsibilities extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {

            position_id:'',
            positionresponsibilities_data:[],
            positionresponsibilitiesList:[],
            positionList:[],

            position:0,

            positions_columns: [
                { title: 'Name', field: 'position'},
                { title: 'Resposibilities', field: 'responsibilities'},
            ],

            myAction:''
        };

    }

        componentDidMount() {
            axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
            .then(res => {
                this.setState({
                    positionresponsibilities_data:res.data
                })
                var newList = []
                this.state.positionresponsibilities_data.map((position)=>{
                    newList.push({id:position.id, position:position.position,
                                    responsibilities:position.responsibilities})
                })
                this.setState({
                    positionList:newList.sort((a,b) => a["id"]>b["id"]?-1:1), //DATA FOR DROPDOWN LIST
                })
                var responsibilities = [];
                this.state.positionresponsibilities_data.map((position)=>{
                        responsibilities.push({id:position.id, position:position.position,
                                        responsibilities:position.responsibilities})
                })
                this.setState({
                    positionresponsibilitiesList:responsibilities //DATA FOR MATERIAL TABLE
                })
            }) 
            
            axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                res.data.map((id)=>{
                    user_id = id.id
                })
            })
            
        }
      
        //Adding data to each states name == input field name
        onChange = e => {
            this.setState({
                position_id:'',
                [e.target.name]: e.target.value
            });
            var newList = [];
            if(e.target.value == 0){
                this.state.positionresponsibilities_data.map((position)=>{
                        newList.push({id:position.id, position:position.position,
                                        responsibilities:position.responsibilities})
                })
            }else{
                this.state.positionresponsibilities_data.map((position)=>{
                    if(position.id == e.target.value){
                        newList.push({id:position.id, position:position.position,
                                        responsibilities:position.responsibilities})
                    }
                })
            }
            this.setState({
                positionresponsibilitiesList:newList
            })
        }

          //CALL BACK FROM ADD POSITION
        myPositionCallback = (dataFromChild, action) => {
            if(dataFromChild){
                this.getPositionData();
                this.onEdit(this.state.positionresponsibilitiesList);
            }
            this.setState({myAction:action})
        }

        getPositionData(){
            axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
            .then(res => {
                this.setState({
                    positionresponsibilities_data:res.data
                })
                var newList = []
                this.state.positionresponsibilities_data.map((position)=>{
                    newList.push({id:position.id, position:position.position,
                                    responsibilities:position.responsibilities})
                })
                this.setState({
                    positionList:newList.sort((a,b) => a["id"]>b["id"]?-1:1),
                })
                
                if(this.state.myAction == "submit"){
                    axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
                    .then(res => {
                            var responsibilities=[]
                            res.data.map((position)=>{
                                    responsibilities.push({id:position.id, position:position.position,
                                            responsibilities:position.responsibilities})
                            })
                            this.setState({
                                positionresponsibilitiesList:responsibilities
                            })
                        })
                }else if(this.state.myAction == "update"){
                    axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
                    .then(res => {
                        if(this.state.position == 0){
                            var responsibilities = [];
                            res.data.map((position)=>{
                                        responsibilities.push({id:position.id, position:position.position,
                                                        responsibilities:position.responsibilities})
                            })
                            this.setState({
                                positionresponsibilitiesList:responsibilities
                            })
                        }else{
                                var responsibilities = [];
                                res.data.map((position)=>{
                                        if(position.id == this.state.position){
                                            responsibilities.push({id:position.id, position:position.position,
                                                            responsibilities:position.responsibilities})
                                        }
                                })
                                this.setState({
                                    positionresponsibilitiesList:responsibilities
                                })
                            }
                        })
                    }else{
                    axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
                    .then(res => {
                            var responsibilities = [];
                            res.data.map((position)=>{
                                        responsibilities.push({id:position.id, position:position.position,
                                                        responsibilities:position.responsibilities})
                            })
                            this.setState({
                                positionresponsibilitiesList:responsibilities,
                                position:0
                            })
                        })
                    }
                })
            }

        //DELETING DATA
        onDelete(e){
            axios.delete('http://'+window.location.hostname+':8000/positionresponsibilities/'+e)
            .then(res => {
                const data = new FormData();
                data.set('user', user_id)
                data.set('description', "Deleted Position and Responsibilities (Position: "+this.state.position_name+")")
                data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
                data.set('action', "DELETE")
                axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
                .then(res => {
                })
                Swal.fire('Deleted!','Position has been deleted.','success')
                axios.get('http://'+window.location.hostname+':8000/positionresponsibilities/')
                .then(res => {
                    if(this.state.position == 0){
                        var newList = []
                        res.data.map((position)=>{
                            newList.push({id:position.id, position:position.position,
                                            responsibilities:position.responsibilities})
                        })
                        this.setState({
                            positionList:newList.sort((a,b) => a["id"]>b["id"]?-1:1), //DATA FOR DROPDOWN LIST
                        })
                        var responsibilities = [];
                        res.data.map((position)=>{
                                    responsibilities.push({id:position.id, position:position.position,
                                                    responsibilities:position.responsibilities})
                        })
                        this.setState({
                            positionresponsibilitiesList:responsibilities // DATA FOR MATERTIAL TABLE
                        })
                    }else{
                            this.setState({position:0})
                            var newList = [];
                            res.data.map((position)=>{
                                newList.push({id:position.id, position:position.position,
                                                responsibilities:position.responsibilities})
                            })
                            this.setState({
                                positionList:newList.sort((a,b) => a["id"]>b["id"]?-1:1), //DATA FOR DROPDOWN LIST
                            })
                            var responsibilities = [];
                            res.data.map((position)=>{
                                        responsibilities.push({id:position.id, position:position.position,
                                                        responsibilities:position.responsibilities})
                            })
                            this.setState({
                                positionresponsibilitiesList:responsibilities
                            })
                        }
                    })
            }) 
        }
    

        onEdit(id){
            this.scrollToTop();
            this.setState({
                position_id:id,
            })
        }

        scrollToTop(){
            var element = document.getElementById("top");
            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
          }

        
    render(){
        return(

        <div className="container">
             <div className="row">
                <div className="container-fluid">
                    <div id="top"></div>
                    <AddPositionRespon callBackParent={this.myPositionCallback} position_data={this.state.position_id} position={this.state.position}/>
                    {this.state.position==0?
                        <MaterialTable
                            title="Position and Responsibilities"
                            columns={this.state.positions_columns}
                            data={this.state.positionresponsibilitiesList.sort((a,b) => a["id"]>b["id"]?-1:1)}
                            editable={{
                                onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    {
                                        let data = this.state.positionresponsibilitiesList;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({}, () => resolve());
                                        this.onDelete(oldData.id)//calling delete function
                                    }
                                    resolve()
                                }, 1000)
                                }),
                            }}
                            options={{
                                    actionsColumnIndex: -1
                                }}
                                components={{
                                    Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{padding: '0px 10px',marginTop:20}}>
                                            <h5 style={{float:"left",marginTop:8}}>Position:&nbsp;</h5>
                                            <select style={{float:"left"}} onChange={this.onChange} name="position" value={this.state.position}
                                                className="form-control dropdown-toggle" style={{width:250,marginBottom:5}}>
                                                <option value="0">ALL POSITION</option>
                                               {this.state.positionList.map((position) => 
                                                <option key={position.id} value={position.id}>{position.position}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    ),
                                }}
                                
                            />:
                            <MaterialTable
                            title="Position and Responsibilities"
                            columns={this.state.positions_columns}
                            data={this.state.positionresponsibilitiesList.sort((a,b) => a["id"]>b["id"]?-1:1)}
                            actions={[
                                {
                                  icon: 'edit',
                                  tooltip: 'Edit',
                                  onClick: (event, rowData) => this.onEdit(rowData)
                                }
                              ]}
                                editable={{
                                onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    {
                                        let data = this.state.positionresponsibilitiesList;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({}, () => resolve());
                                        this.onDelete(oldData.id)//calling delete function
                                    }
                                    resolve()
                                }, 1000)
                                }),
                            }}
                            options={{
                                    actionsColumnIndex: -1
                                }}
                                components={{
                                    Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <div style={{padding: '0px 10px',marginTop:20}}>
                                            <h5 style={{float:"left",marginTop:8}}>Position:&nbsp;</h5>
                                            <select style={{float:"left"}} onChange={this.onChange} name="position" value={this.state.position}
                                                className="form-control dropdown-toggle" style={{width:250,marginBottom:5}}>
                                                <option value="0">ALL POSITION</option>
                                               {this.state.positionList.map((position) => 
                                                <option key={position.id} value={position.id}>{position.position}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    ),
                                }}  
                            />}
                    </div>
                </div>
            </div>
        );
    }
}
