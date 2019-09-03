import React, {Component} from 'react';
import axios from 'axios';

export default class AverageAnalytics extends Component{

    constructor(props, context) {

        super(props, context);
        
        this.state = {
            employmentdetails_data:[],
            individualpoints_data:[],
            actualnoofstaff:'',
            noofbillablestaff:'',
            totalquota:'',
            totalproductivity:'',
            averageproductivitypoints:'',
            averageproductivityrating:'',

            OtherDetails_data:[],
        };

        const { to, staticContext, ...rest } = this.props;
        
    }

    componentDidMount() {
        this.setState({OtherDetails_data:this.props.data})
        //console.log(data)
        const totalQuota = this.props.data.reduce((quotaTotal, quota) => parseInt(quotaTotal) + parseInt(quota.quota), 0);
        const totalPoints= this.props.data.reduce((pointsTotal, points) => parseInt(pointsTotal) + parseInt(points.productivity_points), 0);

        this.setState({
            actualnoofstaff:this.props.data.length,
            totalquota:totalQuota,
            totalproductivity:totalPoints,
            averageproductivitypoints:Number((totalPoints/this.props.data.length).toFixed(2)),
            averageproductivityrating:Number((totalPoints/totalQuota).toFixed(2))
        })
        //console.log(totalQuota);
    }

    componentWillReceiveProps({data}) {
        this.setState({OtherDetails_data:data})
        //console.log(data)
        const totalQuota = data.reduce((quotaTotal, quota) => parseInt(quotaTotal) + parseInt(quota.quota), 0);
        const totalPoints= data.reduce((pointsTotal, points) => parseInt(pointsTotal) + parseInt(points.productivity_points), 0);

        this.setState({
            actualnoofstaff:data.length,
            totalquota:totalQuota,
            totalproductivity:totalPoints,
            averageproductivitypoints:Number((totalPoints/data.length).toFixed(2)),
            averageproductivityrating:Number((totalPoints/totalQuota).toFixed(2))
        })
        //console.log(totalQuota);
      }
    
    render(){
        
       
        return(

        <div className="container">
              <div className="row">
                <div className="container-fluid">
                    <br/>
                        <div className="row">
                            <div className="col-md-6" >
                                <h3>Other Details</h3>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:155,background:"#db3d44",color:'white'}}>Actual No. of Staff</span>
                                        </div>
                                        <input type="text" className="form-control" defaultValue = {this.state.actualnoofstaff} readOnly style={{textAlign:"center"}}/>
                                    </div>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:155,background:"#db3d44",color:'white'}}>No. of Billable Staff</span>
                                        </div>
                                        <input type="text" className="form-control" readOnly style={{textAlign:"center"}}/>
                                    </div>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:155,background:"#db3d44",color:'white'}}>Total Quota</span>
                                        </div>
                                        <input type="text" className="form-control" value = {this.state.totalquota} readOnly style={{textAlign:"center"}}/>
                                    </div>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:155,background:"#db3d44",color:'white'}}>Total Productivity</span>
                                        </div>
                                        <input type="text" className="form-control" defaultValue = {this.state.totalproductivity} readOnly style={{textAlign:"center"}}/>
                                    </div>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:215,background:"#db3d44",color:'white'}}>Average Productivity Points</span>
                                        </div>
                                        <input type="text" className="form-control" defaultValue ={isNaN(this.state.averageproductivitypoints)?0:this.state.averageproductivitypoints} readOnly style={{textAlign:"center"}}/>
                                    </div>
                                <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:215,background:"#db3d44",color:'white'}}>Average Productivity Rating</span>
                                        </div>
                                        <input type="text" className="form-control" defaultValue ={isNaN(this.state.averageproductivityrating)?0:this.state.averageproductivityrating} readOnly style={{textAlign:"center"}}/>
                                    </div>
                            </div>
                        </div>
                  </div>            
                </div>
            </div>
  

        );
    }
}
