import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
//ICONS
import Logout from '@material-ui/icons/ExitToApp';
import AccountSettings from '@material-ui/icons/AccountCircle'

var user_id = ''; //USERLOG ID

class Header extends Component {
    _isMounted = false;
    constructor(props, context) {
        super(props, context);
        this.state = {
            signedin:false,
            userList_data:[],
            firstname:'',
            lastname:'',
            image:[],
            expand:true,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('http://'+window.location.hostname+':8000/users/')
        .then(res => {
            if(this._isMounted){
                this.setState({
                    userList_data: res.data
                })
            }
            this.state.userList_data.map((user)=>{
                if(user.token == localStorage.getItem('token')){
                    this.setState({
                        firstname:user.employee_id.firstname,
                        lastname:user.employee_id.lastname,
                        image:user.employee_id.image,
                    })
                }
            })
        })

        axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
        .then(res => {
            res.data.map((id)=>{
                user_id = id.id
            })
        })   

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps({expand}) {
        this.setState({expand:expand})
    }

    onLogout = e => {
        const data = new FormData();
        data.set('username', user_id)
        data.set('user', user_id)
        data.set('description', "User log-out")
        data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
        data.set('action', "LOG-OUT")
        axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
        .then(res => {
        })

        localStorage.removeItem('token')
        localStorage.removeItem('expiration')
        this.props.history.push('/signin')
        this.props.callBackParent(this.state.signedin)
    }
    render() {
        
        return (
            <div>
                <nav className="border" style={{backgroundColor:"#FFFFFF",height:60,}}>
                    <img alt='none' style={{float:'left',maxHeight:60,height:60,maxWidth:200,marginLeft:this.state.expand?250:100}} 
                    src={"https://www.syntacticsinc.com/wp-content/uploads/2018/04/logo.svg"}
                    />
                    <Link to="/signin" style={{float:'right',marginTop:15, marginRight:20}} 
                        onClick={this.onLogout}><Logout/><b>Logout</b>
                    </Link>
                    <p style={{float:'right',marginTop:15, marginRight:10}}>
                        {this.state.firstname + ' ' + this.state.lastname }
                    </p>
                    <img alt='none' className="rounded-circle" 
                        style={{float:'right',maxHeight:50,height:50,maxWidth:50,marginTop:5,marginRight:5,border:"1px solid Black"}} 
                        src={this.state.image}
                    />
                </nav>
            </div>

                );
            }
}



export default withRouter(Header)