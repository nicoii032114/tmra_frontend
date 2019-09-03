import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import axios from 'axios';
import moment from 'moment';

var newQuota = [];
var newPoints = [];
var newRating = [];
var graphLabel = [];

export default class ChartsPage extends React.Component {
      constructor(props, context) {
        super(props, context);
          this.state = {
       
            //CONSTRUCTING MONTH ARRAY
            months: ['January', 'Febuary','March','April', 'May','June','July',
                      'August','September','October','November','December'],
            employmentdetails_data:[],
            individualpoints_data:[],      
            monthFrom:'',
            monthTo:'',
            yearFrom:'',
            yearTo:'',
            name:'',
          }
        };

      componentDidMount() {
       
          this.setState({
            monthFrom: this.props.monthFrom,
            monthTo: this.props.monthTo,
            yearFrom: this.props.yearFrom,
            yearTo: this.props.yearTo,
            name: this.props.graph.name,
          })
          axios.get('http://'+window.location.hostname+':8000/employmenthistory/')
          .then(res => {
            this.setState({employmentdetails_data:res.data});
                axios.get('http://'+window.location.hostname+':8000/individualpoints/')
                .then(res => {
                    this.setState({individualpoints_data:res.data,})
                    var reportArray= [];
                      this.state.employmentdetails_data.map((employment)=>{
                        this.state.individualpoints_data.map((individualpoints)=>{
                            if(parseInt(moment(employment.date_updated).format("MM")) == parseInt(moment(individualpoints.date).format("MM"))
                                && employment.employee == this.props.graph.emp_tbl_id && individualpoints.employee == this.props.graph.emp_tbl_id){
                                reportArray.push({
                                    points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                                    name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                                    quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                                    productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                                    })
                                }
                            })
                        })
                       
                      newQuota = [];
                      newPoints = [];
                      newRating = [];
                      var id = 0;
                      for(var i = this.state.monthFrom; i <= this.state.monthTo; i++){
                        if(reportArray.some(data => i == moment(data.date).format("MM"))){
                          newQuota.push(reportArray[id].quota)
                          newPoints.push(reportArray[id].productivity_points)
                          newRating.push(reportArray[id].productivity_rating)
                          id = id+1
                        }else{
                          newQuota.push(0)
                          newPoints.push(0)
                          newRating.push(0)
                        }
                      }
                      this.setState({refresh:1})
                })
              })

          
        }
      
      componentWillReceiveProps({graph,monthFrom,monthTo,yearFrom,yearTo}) {
        this.setState({
          monthFrom:monthFrom,
          monthTo:monthTo,
          yearFrom:yearFrom,
          yearTo:yearTo,
          name:graph.name
        })

        graphLabel = [];
        
        if(monthFrom == undefined){
          var reportArray= [];
          this.state.employmentdetails_data.map((employment)=>{
              this.state.individualpoints_data.map((individualpoints)=>{
                  if(parseInt(moment(employment.date_updated).format("YYYY")) == parseInt(moment(individualpoints.date).format("YYYY")) &&
                    moment(employment.date_updated).format("MM") == moment(individualpoints.date).format("MM") &&    
                    employment.employee == graph.emp_tbl_id && individualpoints.employee == graph.emp_tbl_id){
                      reportArray.push({
                          points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                          name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                          quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                          productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                          })
                      }
                  })
              })
              console.log(reportArray)
              newQuota = [];
              newPoints = [];
              newRating = [];
              var id = 0;
              for(var i = yearFrom; i <= yearTo; i++){
                if(reportArray.some(data => i == moment(data.date).format("YYYY"))){
                  newQuota.push(reportArray[id].quota)
                  newPoints.push(reportArray[id].productivity_points)
                  newRating.push(reportArray[id].productivity_rating)
                  id = id+1
                }else{
                  newQuota.push(0)
                  newPoints.push(0)
                  newRating.push(0)
                }
              }
          }else{
            var reportArray= [];
              this.state.employmentdetails_data.map((employment)=>{
                this.state.individualpoints_data.map((individualpoints)=>{
                    if(parseInt(moment(employment.date_updated).format("MM")) == parseInt(moment(individualpoints.date).format("MM"))
                        && employment.employee == graph.emp_tbl_id && individualpoints.employee == graph.emp_tbl_id){
                        reportArray.push({
                            points_id:individualpoints.id,employment_id:employment.id,emp_tbl_id:employment.employee, 
                            name:employment.employee_id.firstname+' '+employment.employee_id.lastname, 
                            quota:employment.quota, date:individualpoints.date, productivity_points:individualpoints.points,
                            productivity_rating:Number((individualpoints.points/employment.quota).toFixed(2)),
                            })
                        }
                    })
                })
                newQuota = [];
                newPoints = [];
                newRating = [];
                var id = 0;
                for(var i = monthFrom; i <= monthTo; i++){
                  if(reportArray.some(data => i == moment(data.date).format("MM"))){
                    newQuota.push(reportArray[id].quota)
                    newPoints.push(reportArray[id].productivity_points)
                    newRating.push(reportArray[id].productivity_rating)
                    id = id+1
                  }else{
                    newQuota.push(0)
                    newPoints.push(0)
                    newRating.push(0)
                  }
                }
          }    
      }
  
  render() {
    if(this.state.monthFrom == null && this.props.yearFrom == null){
        for(var i = this.props.monthFrom-1; i <= this.props.monthTo-1; i++){
          graphLabel.push(this.state.months[i])
        }
    }else{
        for(var e = this.state.monthFrom-1; e <= this.state.monthTo-1; e++){
          if(e !== -1){
          graphLabel.push(this.state.months[e])
          }
      }
    }

  if(this.state.yearFrom == null){
      for(var c = this.props.yearFrom; c <= this.props.yearTo; c++){
        graphLabel.push(c)
      }
  }else{
      for(var a = this.state.yearFrom; a <= this.state.yearTo; a++){
          if(a !== -1){
          graphLabel.push(a)
        }
    }
  }
    return (
      <MDBContainer>
        <h3 className="mt-5">{this.state.name}</h3>
        <Line data={{
                  labels: graphLabel,
                  datasets: [
                    {
                      label: "Quota",
                      fill: true,
                      lineTension: 0.3,
                      backgroundColor: "rgba(225, 204,230, .3)",
                      borderColor: "#1E90FF",
                      borderCapStyle: "butt",
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: "miter",
                      pointBorderColor: "#1E90FF",
                      pointBackgroundColor: "rgb(255, 255, 255)",
                      pointBorderWidth: 10,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgb(0, 0, 0)",
                      pointHoverBorderColor: "rgba(220, 220, 220,1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: newQuota
                    },
                    {
                      label: "Productivity Points",
                      fill: true,
                      lineTension: 0.3,
                      backgroundColor: "rgba(184, 185, 210, .3)",
                      borderColor: "#DC143C",
                      borderCapStyle: "butt",
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: "miter",
                      pointBorderColor: "#DC143C",
                      pointBackgroundColor: "rgb(255, 255, 255)",
                      pointBorderWidth: 10,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgb(0, 0, 0)",
                      pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: newPoints
                    },
                    {
                      label: "Productivity Rating",
                      fill: true,
                      lineTension: 0.3,
                      backgroundColor: "rgba(184, 185, 210, .3)",
                      borderColor: "#FFFF00",
                      borderCapStyle: "butt",
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: "miter",
                      pointBorderColor: "#FFFF00",
                      pointBackgroundColor: "rgb(255, 255, 255)",
                      pointBorderWidth: 10,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: "rgb(0, 0, 0)",
                      pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                      pointHoverBorderWidth: 2,
                      pointRadius: 1,
                      pointHitRadius: 10,
                      data: newRating
                    }
                  ]
                }} 
        options={{ responsive: true }} />
      </MDBContainer>
    );
  }
}
