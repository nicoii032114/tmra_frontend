import React, { Component } from 'react';
import {Link, withRouter} from "react-router-dom"; 
import axios from 'axios';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Swal from 'sweetalert2';
//import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Spinner from './spinner.js';

var user_id = ''; //USERLOG ID

class Signin extends Component{
  _isMounted = false;
  constructor(props, context) {
    super(props, context);
        this.state = {
            userList_data:[],
            username: '',
            password: '',
            submitted: false,
            signedin:true,
            loading:false,

            firstname:'',
            lastname:'',
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
      })

        if(localStorage.length > 0){
          this.props.history.push("/")
        }else{
          //this.props.callBackParent(this.state.signedin)
        }
      }

      componentWillUnmount() {
        this._isMounted = false;
    }

    //Adding data to each states name == input field name
    onChange = e => {
      this.setState({ [e.target.name]: e.target.value });
    }
        

    onSignin = (e) =>{
      e.preventDefault()
      var expirationDate = new Date(new Date().getTime() + 3600 * 1000)
      var accounts = [];
      this.state.userList_data.map((data) => {
          if(data.username == this.state.username && data.password == this.state.password){
            user_id = data.id
            this.setState({
              loading:true,
              firstname:data.employee_id.firstname,
              lastname:data.employee_id.lastname,
            })
            localStorage.setItem('token', data.token)
            localStorage.setItem('expiration', expirationDate)
            if(data.user_type == 3){
              this.props.history.push("/employeeform")
            }else{
              this.props.history.push("/")
            }
            this.props.callBackParent(this.state.signedin)
            accounts.push(1)
          }
      })
      if(accounts.length > 0){
        this.onUserLog()
        Swal.fire('Welcome!',this.state.firstname+' '+this.state.lastname,'success')
      }else{
        Swal.fire('Invalid!','Username or password is invalid!','error')
      }

    }

    onUserLog(){
      const data = new FormData();
      data.set('username', user_id)
      data.set('user', user_id)
      data.set('description', "User log-in")
      data.set('date', moment(this.state.selectedDate).format("YYYY-MM-DD h:mm a"))
      data.set('action', "LOG-IN")
      axios.post('http://'+window.location.hostname+':8000/userlogs/',data)
      .then(res => {
          console.log(res.data)
      })
    }
    

    render(){
 
        return (
        
            <Container component="main" maxWidth="xs">
              <br/>
              <br/>
           
              <CssBaseline />
          <form onSubmit={this.onSignin}>
             <div>
                <center>  
                  <b><h3>Team Monitoring</h3> <h4>and</h4> <h3>Reporting Ap</h3></b>
                  <br/>
                    <div> 
                        <Avatar>
                        {this.state.loading ? <Spinner/>: <LockOutlinedIcon />} 
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                    </div> 
                </center>  
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Company ID"
                    name="username"
                    autoFocus
                    onChange = {this.onChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange = {this.onChange}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick = {this.onSignin}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      {/*<Link href="#" variant="body2" onClick={this.props.logout}>
                        Forgot password?
        </Link>*/}
                    </Grid>
                    
                  </Grid>
              
              </div>
            </form>
              <Box mt={5}>
               
                  
              </Box>
            </Container>
          );
    }
    
}

export default withRouter(Signin)