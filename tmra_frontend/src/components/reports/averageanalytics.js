import React, {Component} from 'react';
import axios from 'axios';
import moment, { relativeTimeThreshold } from 'moment';
import Swal from 'sweetalert2'
import toPDF from './topdf.jpg';
import toEXCEL from './toexcel.jpg';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CSVLink, CSVDownload } from "react-csv";


export default class AverageAnalytics extends Component{

    constructor(props, context) {

        super(props, context);
        
        this.state = {
            startDate: new Date(),
            id:'',
            employee_id:'',
            date: moment(new Date()).format("YYYY-MM-DD"),
            years:[],
            year_selected:'',
            row_data:[],

            filter:1,
            title:"Annual",
            selectfrom:"Year From",
            selectto:"Year To",
            
            selectedAnnual:true,
            selectedQuarter:false,
            selectedMonth:false,

            yearFrom_value:moment(new Date()).format("YYYY"),
            yearTo_value:moment(new Date()).format("YYYY"),
            quarterFrom_value:'',
            quarterTo_value:'',
            monthFrom_value:'',
            monthTo_value:'',

            employment_data:[],
            averageStaffFrom:[],
            averageStaffTo:[],

            quota_data:[],
            averageQuotaFrom:'',
            averageQuotaTo:'',

            productivity_data:[],
            averageProductivityFrom:[],
            averageProductivityTo:[],

            productivityrate_data:[],
            productivityRateFrom:[],
            productivityRateTo:[],

            //CONSTRUCTING MONTH ARRAY
            months: [
              {name: 'January',id: '01'}, {name: 'Febuary',id: '02'},{name: 'March',id: '03'},
              {name: 'April',id: '04'}, {name: 'May',id: '05'},{name: 'June',id: '06'},
              {name: 'July',id: '07'}, {name: 'August',id: '08'},{name: 'September',id: '09'},
              {name: 'October',id: '10'}, {name: 'November',id: '11'},{name: 'December',id: '12'},
          ],
            quarters:[
              {name: 'First Quarter',id: '1'}, {name: 'Second Quarter',id: '2'},
              {name: 'Third Quarter',id: '3'}, {name: 'Fourth Quarter',id: '4'}
            ],
            RowData:[
              {name:'Average no. of Staffs', id:'1'},
              {name:'Average Quota', id:'2'},
              {name:'Average Productivity', id:'3'},
              {name:'Productivity Rate', id:'4'},
            ],
        };
        const { to, staticContext, ...rest } = this.props;
    }

    componentDidMount() {
      axios.get('http://'+window.location.hostname+':8000/employmentdetails/')
      .then(res => {
            this.setState({
                employment_data:res.data
            });
            var newList = [];
            this.state.employment_data.map((employee)=>{
                if(this.state.title === "Annual" && moment(employee.date_employed).format("YYYY") == moment(new Date()).format("YYYY")){
                    newList.push({id:employee.id, employee:employee.employee})
                }
            })
            this.setState({
              averageStaffFrom:newList,
              averageStaffTo:newList
            })
            axios.get('http://'+window.location.hostname+':8000/employmenthistory/')
            .then(res => {
                  this.setState({
                      quota_data:res.data
                  });
                    var newList = [];
                    this.state.quota_data.map((quota)=>{
                        if(this.state.title === "Annual" && moment(quota.date).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({quota:parseFloat(quota.quota)})
                        }
                    })
                    var total=0;
                    for(var i = 0; i < newList.length; i++){
                        total += newList[i].quota; 
                    }
                    this.setState({
                      averageQuotaFrom:total,
                      averageQuotaTo:total,
                    })

                    axios.get('http://'+window.location.hostname+':8000/individualpoints/')
                    .then(res => {
                      this.setState({
                          productivity_data:res.data
                      });
                        var newList = [];
                        this.state.productivity_data.map((productivity)=>{
                            if(this.state.title === "Annual" && moment(productivity.date).format("YYYY") == moment(new Date()).format("YYYY")){
                                newList.push({productivity:parseFloat(productivity.points)})
                            }
                        })
                        var total=0;
                        for(var i = 0; i < newList.length; i++){
                            total += newList[i].productivity; 
                        }
                        this.setState({
                          averageProductivityFrom:total,
                          averageProductivityTo:total,
                        })
                  })
            })
            
      })
     
   
        //GETTING THE 10 YEARS BACKWARD FROM THE CURRENT YEAR
        var year =this.state.startDate.getFullYear()
        var yearArray = []
        for(var i = 0; i < 10; i++){
            var yearTotal = this.state.startDate.getFullYear() - i
            yearArray.push({id:i, year:yearTotal});
        }
        this.setState({
            years:yearArray,
            year_selected:year
        })
        
    }
    onFilter = e =>{
      this.setState({
        filter: e.target.value
      })
      if(e.target.value == 1){
        this.setState({
          yearFrom_value:0,
          yearTo_value:0,
          title:"Annual",
          selectfrom:"Year From",
          selectto:"Year To",
          selectedAnnual:true,
          selectedQuarter:false,
          selectedMonth:false,
          averageStaffFrom:[],
          averageStaffTo:[],
          averageQuotaTo:0,
          averageQuotaFrom:0,
          averageQuotaTo:0,
          averageProductivityFrom:0,
          averageProductivityTo:0
        })
      }else if(e.target.value == 2){
        this.setState({
          quarterFrom_value:0,
          quarterTo_value:0,
          title:"Quarterly",
          selectfrom:"Quarter From",
          selectto:"Quarter To",
          selectedAnnual:false,
          selectedQuarter:true,
          selectedMonth:false,
          averageStaffFrom:[],
          averageStaffTo:[],
          averageQuotaTo:0,
          averageQuotaFrom:0,
          averageQuotaTo:0,
          averageProductivityFrom:0,
          averageProductivityTo:0
        })
      }else{
        this.setState({
          monthFrom_value:1,
          monthTo_value:1,
          title:"Monthly",
          selectfrom:"Month From",
          selectto:"Month To",
          selectedAnnual:false,
          selectedQuarter:false,
          selectedMonth:true,
          averageStaffFrom:[],
          averageStaffTo:[],
          averageQuotaTo:0,
          averageQuotaFrom:0,
          averageQuotaTo:0,
          averageProductivityFrom:0,
          averageProductivityTo:0
        })
      }
    }

    onYearSelected = e =>{
      this.setState({year_selected:e.target.value})
      if(this.state.title === "Quarterly"){
        this.setState({
          quarterFrom_value:0,
          quarterTo_value:0,
          averageStaffFrom:[],
          averageStaffTo:[],
          averageQuotaTo:0,
          averageQuotaFrom:0,
          averageQuotaTo:0,
          averageProductivityFrom:0,
          averageProductivityTo:0})
      }else if(this.state.title === "Monthly"){
        this.setState({
          monthFrom_value:0,
          monthTo_value:0,
          averageStaffFrom:[],
          averageStaffTo:[],
          averageQuotaTo:0,
          averageQuotaFrom:0,
          averageQuotaTo:0,
          averageProductivityFrom:0,
          averageProductivityTo:0
        })
      }
    }
    
    //ON YEAR FROM                            ON YEAR FROM 
    onYearFrom = e =>{
      if(e.target.value > this.state.yearTo_value){
        Swal.fire({
              title: 'Invalid Year selected!',
              text: "YearTo must be greater than YearFrom!",
              type:'error'})
      }else{
        this.setState({yearFrom_value:e.target.value})
        //AVERAGE STAFF
              var newList = [];
              this.state.employment_data.map((employee)=>{
                  if(this.state.title === "Annual" && moment(employee.date_employed).format("YYYY") == e.target.value){
                      newList.push({id:employee.id, employee:employee.employee})
                  }
              })
              this.setState({
                averageStaffFrom:newList
              })
      //AVERAGE QUOTA
              var newList = [];
              this.state.quota_data.map((quota)=>{
                  if(this.state.title === "Annual" && moment(quota.date).format("YYYY") == e.target.value){
                      newList.push({quota:parseFloat(quota.quota)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].quota; 
              }
              this.setState({
                averageQuotaFrom:total,
              })
        //AVERAGE PRODUCTIVITY POINTS
              var newList = [];
              this.state.productivity_data.map((productivity)=>{
                  if(this.state.title === "Annual" && moment(productivity.date).format("YYYY") == e.target.value){
                      newList.push({productivity:parseFloat(productivity.points)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].productivity; 
              }
              this.setState({
                averageProductivityFrom:total,
              })
      }
    }
    //ON YEAR TO                              ON YEAR TO 
    onYearTo = e =>{
      if(this.state.yearFrom_value > e.target.value){
        Swal.fire({
          title: 'Invalid Year selected!',
          text: "YearTo must be greater than YearFrom!",
          type:'error'})
      }else{
        this.setState({yearTo_value:e.target.value})
        //AVERAGE STAFF
              var newList = [];
              this.state.employment_data.map((employee)=>{
                  if(this.state.title === "Annual" && moment(employee.date_employed).format("YYYY") == e.target.value){
                      newList.push({id:employee.id, employee:employee.employee})
                  }
              })
              this.setState({
                averageStaffTo:newList
              })
        //AVERAGE QUOTA
              var newList = [];
              this.state.quota_data.map((quota)=>{
                  if(this.state.title === "Annual" && moment(quota.date).format("YYYY") == e.target.value){
                      newList.push({quota:parseFloat(quota.quota)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].quota; 
              }
              this.setState({
                averageQuotaTo:total,
              })
        //AVERAGE PRODUCTIVITY POINTS
              var newList = [];
              this.state.productivity_data.map((productivity)=>{
                  if(this.state.title === "Annual" && moment(productivity.date).format("YYYY") == e.target.value){
                      newList.push({productivity:parseFloat(productivity.points)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].productivity; 
              }
              this.setState({
                averageProductivityTo:total,
              })
      }
    }

    onQuarterFrom = e =>{
      var quarter = [];
      if(e.target.value > this.state.quarterTo_value){
        Swal.fire({
          title: 'Invalid Quarter selected!',
          text: "QuarterTo must be greater than QuarterFrom!",
          type:'error'})
      }else{
        this.setState({quarterFrom_value:e.target.value})
        if(e.target.value == 1){
          quarter.push()
          quarter.push(1,2,3)
        }else if(e.target.value == 2){
          quarter.push()
          quarter.push(4,5,6)
        }else if(e.target.value == 3){
          quarter.push()
          quarter.push(7,8,9)
        }else{
          quarter.push()
          quarter.push(10,11,12)
        }
        this.QuarterFromAverageStaff(quarter);
        this.QuarterFromAverageQuota(quarter);
        this.QuarterFromAverageProductivity(quarter);
      }
    }

                   QuarterFromAverageStaff(quarter){
                    var arrayStaff = [];
                    for(var i = 0; i < quarter.length; i++){
                      this.state.employment_data.map((employee)=>{
                            if(this.state.title === "Quarterly" && moment(employee.date_effective).format("MM") == quarter[i]
                                && moment(employee.date_effective).format("YYYY") == this.state.year_selected){
                                arrayStaff.push({id:employee.id, employee:employee.employee})
                            }
                        })
                        this.setState({
                          averageStaffFrom:arrayStaff
                        })
                        
                    } 
                  }

                  QuarterFromAverageQuota(quarter){
                    var arrayQuota = [];
                    for(var i = 0; i < quarter.length; i++){
                      this.state.quota_data.map((quota)=>{
                        if(this.state.title === "Quarterly" && moment(quota.date_updated).format("MM") == quarter[i]
                            && moment(quota.date_updated).format("YYYY") == this.state.year_selected){
                              arrayQuota.push({quota:parseFloat(quota.quota)})
                          } 
                        })
                      }
                          var total=0;
                          for(var i = 0; i < arrayQuota.length; i++){
                              total += arrayQuota[i].quota; 
                          }
                          this.setState({
                            averageQuotaFrom:total
                          })
                  }

                  QuarterFromAverageProductivity(quarter){
                    var arrayProductivity = [];
                    for(var i = 0; i < quarter.length; i++){
                      this.state.productivity_data.map((productivity)=>{
                          if(this.state.title === "Quarterly" && moment(productivity.date).format("MM") == quarter[i]
                              && moment(productivity.date).format("YYYY") == this.state.year_selected){
                              arrayProductivity.push({productivity:parseFloat(productivity.points)})
                          }
                        })
                      }
                      var total=0;
                      for(var i = 0; i < arrayProductivity.length; i++){
                          total += arrayProductivity[i].productivity; 
                      }
                      this.setState({
                        averageProductivityFrom:total
                      })
                  }

    onQuarterTo = e =>{
      var quarter = [];
      if(this.state.quarterFrom_value > e.target.value){
        Swal.fire({
          title: 'Invalid Quarter selected!',
          text: "QuarterTo must be greater than QuarterFrom!",
          type:'error'})
      }else{
        this.setState({quarterTo_value:e.target.value})
        if(e.target.value == 1){
          quarter.push()
          quarter.push(1,2,3)
        }else if(e.target.value == 2){
          quarter.push()
          quarter.push(4,5,6)
        }else if(e.target.value == 3){
          quarter.push()
          quarter.push(7,8,9)
        }else{
          quarter.push()
          quarter.push(10,11,12)
        }
        this.QuarterToAverageStaff(quarter);
        this.QuarterToAverageQuota(quarter);
        this.QuarterToAverageProductivity(quarter);
      }
    }

                        QuarterToAverageStaff(quarter){
                          var arrayStaff = [];
                          for(var i = 0; i < quarter.length; i++){
                            this.state.employment_data.map((employee)=>{
                                  if(this.state.title === "Quarterly" && moment(employee.date_effective).format("MM") == quarter[i]
                                      && moment(employee.date_effective).format("YYYY") == this.state.year_selected){
                                      arrayStaff.push({id:employee.id, employee:employee.employee})
                                  }
                              })
                              this.setState({
                                averageStaffTo:arrayStaff
                              })
                              
                          } 
                        }

                        QuarterToAverageQuota(quarter){
                          var arrayQuota = [];
                          for(var i = 0; i < quarter.length; i++){
                            this.state.quota_data.map((quota)=>{
                              if(this.state.title === "Quarterly" && moment(quota.date_updated).format("MM") == quarter[i]
                                && moment(quota.date_updated).format("YYYY") == this.state.year_selected){
                                    arrayQuota.push({quota:parseFloat(quota.quota)})
                                } 
                              })
                            }
                                var total=0;
                                for(var i = 0; i < arrayQuota.length; i++){
                                    total += arrayQuota[i].quota; 
                                }
                                this.setState({
                                  averageQuotaTo:total
                                })
                        }

                        QuarterToAverageProductivity(quarter){
                          var arrayProductivity = [];
                          for(var i = 0; i < quarter.length; i++){
                            this.state.productivity_data.map((productivity)=>{
                                if(this.state.title === "Quarterly" && moment(productivity.date).format("MM") == quarter[i]
                                    && moment(productivity.date).format("YYYY") == this.state.year_selected){
                                    arrayProductivity.push({productivity:parseFloat(productivity.points)})
                                }
                              })
                            }
                            var total=0;
                            for(var i = 0; i < arrayProductivity.length; i++){
                                total += arrayProductivity[i].productivity; 
                            }
                            this.setState({
                              averageProductivityTo:total
                            })
                        }

    onMonthFrom = e =>{
      if(e.target.value > this.state.monthTo_value){
        Swal.fire({
          title: 'Invalid Month selected!',
          text: "MonthTo must be greater than MonthFrom!",
          type:'error'})
      }else{
            this.setState({monthFrom_value:e.target.value})
        //AVERAGE STAFF
            var newList = [];
            this.state.employment_data.map((employee)=>{
                if(this.state.title === "Monthly" && moment(employee.date_employed).format("MM") == e.target.value
                    && moment(employee.date_effective).format("YYYY") == this.state.year_selected){
                    newList.push({id:employee.id, employee:employee.employee})
                }
            })
            this.setState({
              averageStaffFrom:newList
            })
        //AVERAGE QUOTA
              var newList = [];
              this.state.quota_data.map((quota)=>{
                  if(this.state.title === "Monthly" && moment(quota.date_updated).format("MM") == e.target.value
                      && moment(quota.date_updated).format("YYYY") == this.state.year_selected){
                      newList.push({quota:parseFloat(quota.quota)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].quota; 
              }
              this.setState({
                averageQuotaFrom:total,
              })
        //AVERAGE PRODUCTIVITY POINTS
              var newList = [];
              this.state.productivity_data.map((productivity)=>{
                  if(this.state.title === "Monthly" && moment(productivity.date).format("MM") == e.target.value
                      && moment(productivity.date).format("YYYY") == this.state.year_selected){
                      newList.push({productivity:parseFloat(productivity.points)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].productivity; 
              }
              this.setState({
                averageProductivityFrom:total,
              })
      }
    }

    onMonthTo = e =>{
      if(this.state.monthFrom_value > e.target.value){
        Swal.fire({
          title: 'Invalid Month selected!',
          text: "MonthTo must be greater than MonthFrom!",
          type:'error'})
      }else{
        this.setState({monthTo_value:e.target.value})
        //AVERAGE STAFF
            var newList = [];
            this.state.employment_data.map((employee)=>{
                if(this.state.title === "Monthly" && moment(employee.date_employed).format("MM") == e.target.value
                      && moment(employee.date_effective).format("YYYY") == this.state.year_selected){
                    newList.push({id:employee.id, employee:employee.employee})
                }
            })
            this.setState({
              averageStaffTo:newList
            })
        //AVERAGE QUOTA
              var newList = [];
              this.state.quota_data.map((quota)=>{
                  if(this.state.title === "Monthly" && moment(quota.date_updated).format("MM") == e.target.value
                        && moment(quota.date_updated).format("YYYY") == this.state.year_selected){
                      newList.push({quota:parseFloat(quota.quota)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].quota;
              }
              this.setState({
                averageQuotaTo:total,
              })
        //AVERAGE PRODUCTIVITY POINTS
              var newList = [];
              this.state.productivity_data.map((productivity)=>{
                  if(this.state.title === "Monthly" && moment(productivity.date).format("MM") == e.target.value
                      && moment(productivity.date).format("YYYY") == this.state.year_selected){
                      newList.push({productivity:parseFloat(productivity.points)})
                  }
              })
              var total=0;
              for(var i = 0; i < newList.length; i++){
                  total += newList[i].productivity; 
              }
              this.setState({
                averageProductivityTo:total,
              })
      }
    }
    
    onPDF = e =>{
      if(this.state.title === "Annual"){
        const input = document.getElementById('averageAnalytics');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.setFont("courier");
            pdf.setFontStyle("normal");
            pdf.text('Annual',106, 30, null, null, 'center');
            pdf.text('Year from: '+this.state.yearFrom_value,106,37,null,null,'center')
            pdf.text('Year to: '+this.state.yearTo_value,106,44,null,null,'center')
            pdf.addImage(imgData, 'PNG', 15,52,180,90);
            pdf.save("AverageAnalytics_From_"+this.state.yearFrom_value+"_to_"+this.state.yearTo_value);  
          });
      }else if(this.state.title === "Quarterly"){
        const input = document.getElementById('averageAnalytics');
        html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.setFont("courier");
          pdf.setFontStyle("normal");
          pdf.text('Quarterly',106, 23, null, null, 'center');
          pdf.text('Year: '+ this.state.year_selected, 106,30,null,null,'center')
          pdf.text('Quarter from: '+this.state.quarterFrom_value, 106,37,null,null,'center')
          pdf.text('Quarter to: '+this.state.quarterTo_value, 106,44,null,null,'center')
          pdf.addImage(imgData, 'PNG', 15,55,180,90);
          pdf.save("AverageAnalytics_Year_"+this.state.year_selected+"_from_"+this.state.quarterFrom_value+"_quarter_to_"+this.state.quarterTo_value+"_quarter");  
        });
      }else{
        const input = document.getElementById('averageAnalytics');
        html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          pdf.setFont("courier");
          pdf.setFontStyle("normal");
          pdf.text('Monthly',106, 23, null, null, 'center');
          pdf.text('Year: '+ this.state.year_selected, 106,30,null,null,'center')
          pdf.text('Month from: '+this.state.yearFrom_value,106,37,null,null,'center')
          pdf.text('Month to: '+this.state.yearTo_value,106,44,null,null,'center')
          pdf.addImage(imgData, 'PNG', 15,52,180,90);
          pdf.save("AverageAnalytics_Year_"+this.state.year_selected+"_from_"+this.state.monthFrom_value+"_month_to_"+this.state.monthTo_value+"_month");  
        });
      }
      
    }

    render(){
      const headers = [
        { label: " ", key: "title" },
        { label: "FROM", key: "from" },
        { label: "TO", key: "to" },
        { label: "DIFFERENCE", key: "difference" }
      ];
      const csvData = [
        {title:"Average no. of Staffs", 
          from:this.state.averageStaffFrom.length, 
          to:this.state.averageStaffTo.length, 
          difference:this.state.averageStaffFrom.length-this.state.averageStaffTo.length},
        {title:"Average Quota", 
          from:this.state.averageQuotaFrom, 
          to:this.state.averageQuotaTo, 
          difference:this.state.averageQuotaFrom-this.state.averageQuotaTo},
        {title:"Average Productivity", 
          from:this.state.averageProductivityFrom, 
          to:this.state.averageProductivityTo, 
          difference:this.state.averageProductivityFrom-this.state.averageProductivityTo},
        {title:"Productivity Rate", 
          from:Number((this.state.averageProductivityFrom/this.state.averageQuotaFrom).toFixed(2)), 
          to:Number((this.state.averageProductivityTo/this.state.averageQuotaTo).toFixed(2)), 
          difference:Number((this.state.averageProductivityFrom/this.state.averageQuotaFrom).toFixed(2))-Number((this.state.averageProductivityTo/this.state.averageQuotaTo).toFixed(2))}
      ]
      var title="";
      if(this.state.title === "Annual"){
        title = "AverageAnalytics_From_"+this.state.yearFrom_value+"_to_"+this.state.yearTo_value
      }else if(this.state.title === "Quarterly"){
        title = "AverageAnalytics_Year_"+this.state.year_selected+"_from_"+this.state.quarterFrom_value+"_quarter_to_"+this.state.quarterTo_value+"_quarter"
      }else{
        title = "AverageAnalytics_Year_"+this.state.year_selected+"_from_"+this.state.monthFrom_value+"_month_to_"+this.state.monthTo_value+"_month"
      }

        return(
          
        <div className="container">
              <div className="row">
                <div className="container-fluid">
                  <center><div className="col-md-6">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44",color:'white'}}>Filter</span>
                                    </div>
                                        <select onChange={this.onFilter} name="month" value={this.state.filter} className="form-control dropdown-toggle">
                                        <option value="1">Annual</option>
                                        <option value="2">Quarterly</option>
                                        <option value="3">Monthly</option>
                                        </select>
                                    </div>
                                    
                                    {this.state.selectedQuarter ?  <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>Year</span>
                                            </div>
                                         <select onChange={this.onYearSelected} value={this.state.year_selected} className="form-control dropdonw-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                </select>
                                            </div>
                                        </div>:null}

                                    {this.state.selectedMonth?  <div className="col-md-8">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>Year</span>
                                            </div>
                                         <select onChange={this.onYearSelected} value={this.state.year_selected} className="form-control dropdonw-toggle">
                                                    {this.state.years.map((year) => 
                                                        <option key={year.id} value={year.year}>{year.year}</option>)}
                                                </select>
                                            </div>
                                        </div>:null}


                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44", color:'white'}}>{this.state.selectfrom}</span>
                                    </div>
                                    {this.state.selectedAnnual ? <select onChange={this.onYearFrom} name="year" value={this.state.yearFrom_value} className="form-control dropdown-toggle">
                                                  <option value="0">SELECT YEAR</option>
                                                {this.state.years.map((year) => 
                                                    <option key={year.id} value={year.year}>{year.year}</option>)}
                                        </select>: null}
                      
                                    {this.state.selectedQuarter ? <select onChange={this.onQuarterFrom} name="quarter" value={this.state.quarterFrom_value}className="form-control dropdown-toggle">
                                                    <option value="0a">SELECT QUARTER</option>
                                                {this.state.quarters.map((quarters) => 
                                                    <option key={quarters.id} value={quarters.id}>{quarters.name}</option>)}
                                        </select> : null}         
                                    
                                    {this.state.selectedMonth ? <select onChange={this.onMonthFrom} name="month" value={this.state.monthFrom_value}className="form-control dropdown-toggle">
                                                    <option value="0">SELECT MONTH</option>
                                                {this.state.months.map((months) => 
                                                    <option key={months.id} value={months.id}>{months.name}</option>)}
                                        </select> : null}     

                                    </div>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-default" style={{background:"#db3d44",color:'white'}}>{this.state.selectto}</span>
                                    </div>
                                      {this.state.selectedAnnual ? <select onChange={this.onYearTo} name="year" value={this.state.yearTo_value} className="form-control dropdown-toggle">
                                                      <option value="0">SELECT YEAR</option>
                                                  {this.state.years.map((year) => 
                                                      <option key={year.id} value={year.year}>{year.year}</option>)}
                                          </select>: null}
                        
                                      {this.state.selectedQuarter ? <select onChange={this.onQuarterTo} name="quarter" value={this.state.quarterTo_value}className="form-control dropdown-toggle">
                                                      <option value="0">SELECT QUARTER</option>
                                                  {this.state.quarters.map((quarters) => 
                                                      <option key={quarters.id} value={quarters.id}>{quarters.name}</option>)}
                                          </select> : null}         
                                      
                                      {this.state.selectedMonth ? <select onChange={this.onMonthTo} name="month" value={this.state.monthTo_value}className="form-control dropdown-toggle">
                                                      <option value="0">SELECT MONTH</option>
                                                  {this.state.months.map((months) => 
                                                      <option key={months.id} value={months.id}>{months.name}</option>)}
                                          </select> : null}    
                                    </div>
                        </div></center>  
                  </div>
                </div>
                   <CSVLink headers={headers} data={csvData} filename={title+".csv"}>
                          <img 
                              alt='none'
                              style={{float:'right',maxHeight:50,height:50,maxWidth:50,marginBottom:5,marginRight:5}} 
                              src={toEXCEL}
                              onClick={this.onEXCEL}
                          />
                        </CSVLink>

                        <a href="#">
                          <img
                              alt='none'
                              style={{float:'right',maxHeight:50,height:50,maxWidth:50,marginBottom:5,marginRight:15}} 
                              src={toPDF}
                              onClick={this.onPDF}
                          /></a>
                  <br/>
                  <br/>
                    <div className="table-responsive text-nowrap">
                          <table className="table table-striped" id="averageAnalytics">
                              <thead>
                                  <tr style={{textAlign:"center"}}>
                                    <th colSpan="13" style={{border:"2px solid Black"}}>{this.state.title}</th>
                                  </tr>
                                        
                                  <tr>
                                    <th style={{border:"2px solid Black",textAlign:"center",width:200}}></th>
                                    <th style={{border:"2px solid Black",textAlign:"center"}}>From</th>
                                    <th style={{border:"2px solid Black",textAlign:"center"}}>To</th>
                                    <th style={{border:"2px solid Black",textAlign:"center"}}>Difference</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>Average no. of Staffs</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageStaffFrom.length}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageStaffTo.length}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageStaffFrom.length-this.state.averageStaffTo.length}</td>
                                  </tr>
                                  <tr>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>Average Quota</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageQuotaFrom}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageQuotaTo}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageQuotaFrom-this.state.averageQuotaTo}</td>
                                  </tr>
                                  <tr>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>Average Productivity</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageProductivityFrom}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageProductivityTo}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{this.state.averageProductivityFrom-this.state.averageProductivityTo}</td>
                                  </tr>
                                  <tr>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>Productivity Rate</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{isNaN(Number((this.state.averageProductivityFrom/this.state.averageQuotaFrom).toFixed(2))) ? 
                                              0 : Number((this.state.averageProductivityFrom/this.state.averageQuotaFrom).toFixed(2))}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>{isNaN(Number((this.state.averageProductivityTo/this.state.averageQuotaTo).toFixed(2))) ?
                                              0 : Number((this.state.averageProductivityTo/this.state.averageQuotaTo).toFixed(2))}</td>
                                    <td style={{border:"1px solid Black",textAlign:"center"}}>
                                              {
                                              isNaN(Number((this.state.averageProductivityFrom/this.state.averageQuotaFrom).toFixed(2))) || 
                                              isNaN(Number((this.state.averageProductivityTo/this.state.averageQuotaTo).toFixed(2))) ?
                                              0 : Number(((this.state.averageProductivityFrom/this.state.averageQuotaFrom) - (this.state.averageProductivityTo/this.state.averageQuotaTo)).toFixed(2))
                                              }
                                              
                                              </td>
                                  </tr>
                              
                              </tbody>
                        </table>
                    </div>                     
            </div>
  

        );
    }
}
