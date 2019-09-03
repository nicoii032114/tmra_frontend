import React, { Component } from 'react'
import axios from 'axios'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText, } from '@trendmicro/react-sidenav';

//MATERIAL ICONS
import HomeIcon from '@material-ui/icons/Home';
import TrainingIcon from '@material-ui/icons/NaturePeople';
import IndividualPointsIcon from '@material-ui/icons/PlusOne';
import SettingsIcon from '@material-ui/icons/Settings';
import PositionIcon from '@material-ui/icons/Accessibility';
import UserlogsIcon from '@material-ui/icons/History';
import MonthlyIcon from '@material-ui/icons/Today';
import QuarterlyIcon from '@material-ui/icons/EventNote';
import AnnualIcon from '@material-ui/icons/Description';
import ReportsIcon from '@material-ui/icons/Assignment';
import DepartmentIcon from '@material-ui/icons/LocationCity';
import UserSettingsIcon from '@material-ui/icons/Wc';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class Sidebar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expanded:true,
            prevScrollpos: window.pageYOffset,

            employeeProfile:false,
            individualPoints:false,
            trainingSeminar:false,
            positionresponsibilities:false,
            reports:false,
            adminSettings:false,
            departmentSettings:false,
            userSettings:false,
            userLogs:false,

            user_type:'',
            accountSettings_data:[],
        };
    }

    componentDidMount() {
        axios.get('http://'+window.location.hostname+':8000/users/?id='+localStorage.getItem("token"))
            .then(res => {
                    res.data.map((user)=>{
                        axios.get('http://'+window.location.hostname+':8000/accountsettings/?id='+user.user_type)
                        .then(res => {
                            this.setState({
                                accountSettings_data:res.data
                            })
                            this.state.accountSettings_data.map((settings)=>{
                                this.setState({
                                    employeeProfile:settings.employeeProfile,
                                    individualPoints:settings.individualPoints,   
                                    trainingSeminar:settings.trainingSeminar,
                                    positionresponsibilities:settings.positionResponsibilities,
                                    trainingList:settings.trainingList,
                                    trainingForm:settings.trainingForm,         
                                    reports:settings.reports,          
                                    adminSettings:settings.adminSettings,
                                    departmentSettings:settings.departmentSettings,
                                    userSettings:settings.userSettings,     
                                    userLogs:settings.userLogs,
                                })
                            })
                        })
                    })
            })
      }
      componentWillUnmount() {
      }


    render() {
        return (
            <div>
               <Route render={({ location, history }) => (
                    <React.Fragment>
                        <SideNav
                            onSelect={(selected) => {
                                const to = '/' + selected;
                                this.setState({selected:selected})

                                if (location.pathname !== to) {
                                    history.push(to);
                                 
                                }
                                this.props.callBackParent(this.state.expanded)
                            }}
                            expanded={this.state.expanded}
                            onToggle={(expanded) => {
                                this.setState({expanded});
                                this.props.callBackParent(expanded)
                            }}
                            >
                        <SideNav.Toggle />
                        <SideNav.Nav selected={this.state.selected}>
                            {this.state.employeeProfile?<NavItem eventKey="employeeform">
                                <NavIcon>
                                    <HomeIcon/>
                                </NavIcon>
                                    <NavText>
                                        Employee Profile
                                    </NavText>
                            </NavItem>:null}

                            {this.state.individualPoints?<NavItem eventKey="individualpoints">
                                <NavIcon>
                                    <IndividualPointsIcon />
                                </NavIcon>
                                    <NavText>
                                        IndividualPoints
                                    </NavText>
                            </NavItem>:null}

                            {this.state.trainingSeminar?<NavItem eventKey="trainingform">
                                <NavIcon>
                                    <TrainingIcon />
                                </NavIcon>
                                    <NavText>
                                        Training
                                    </NavText>
                                </NavItem>:null}

                            {this.state.positionresponsibilities?<NavItem eventKey="positionresponsibilities">
                                <NavIcon>
                                    <PositionIcon/>
                                </NavIcon>
                                    <NavText>
                                        Position and Responsibilities
                                    </NavText>
                                </NavItem>:null}

                            {this.state.reports?<NavItem eventKey="reports">
                                <NavIcon>
                                    <ReportsIcon/>
                                </NavIcon>
                                    <NavText style={{ paddingRight: 32 }} title="Reports">
                                        Reports
                                    </NavText>
                                <NavItem eventKey="reports/monthlypoints">
                                    <NavText title="Month Productivity Points">
                                        <MonthlyIcon/>
                                        &nbsp; Month Points
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reports/quarterlypoints">
                                    <NavText title="Quarterly Productivity Points">
                                        <QuarterlyIcon/>
                                        &nbsp; Quarterly Points
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reports/annualpoints">
                                    <NavText title="Annual Productivity Points">
                                        <AnnualIcon/>
                                        &nbsp; Annual Points
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reports/averageanalytics">
                                    <NavText title="Average Analytics">
                                        <ReportsIcon/>
                                        &nbsp; Average Analytics
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reports/quotaactualproductivity">
                                    <NavText title="Quota vs Actual vs Productivity">
                                        <ReportsIcon/>
                                        &nbsp; Quota vs Actual vs Productivity
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="reports/hoursclassification">
                                    <NavText title="Hours Classification Summary">
                                        <ReportsIcon/>
                                        &nbsp; Hours Classification Summary
                                    </NavText>
                                </NavItem>
                            </NavItem>:null}

                            {this.state.departmentSettings || this.state.userSettings?<NavItem eventKey="settings">
                                <NavIcon>
                                    <SettingsIcon/>
                                </NavIcon>
                                    <NavText style={{ paddingRight: 32 }} title="Admin Settings">
                                       Admin Settings
                                    </NavText>

                                {this.state.departmentSettings?<NavItem eventKey="adminsettings/departmentsettings">
                                    <NavText title="Department Settings">
                                        <DepartmentIcon/>
                                        &nbsp; Department Settings
                                    </NavText>
                                </NavItem>:null}

                                {this.state.userSettings?<NavItem eventKey="adminsettings/usersettings">
                                    <NavText title="User Settings">
                                        <UserSettingsIcon/>
                                        &nbsp; User Settings
                                    </NavText>
                                </NavItem>:null}

                            </NavItem>:null}

                            {this.state.userLogs?<NavItem eventKey="userlogs">
                                <NavIcon>
                                    <UserlogsIcon/>
                                </NavIcon>
                                    <NavText>
                                        User Logs
                                    </NavText>
                                </NavItem>:null}


                            </SideNav.Nav>
                        </SideNav>     
                    </React.Fragment>
                )}
                />
            </div>

                );
            }
}