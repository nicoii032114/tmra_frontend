import React, {Component} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';  
import moment from 'moment';
import Swal from 'sweetalert2'
import toPDF from './topdf.jpg';
import toEXCEL from './toexcel.jpg';
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CSVLink, CSVDownload } from "react-csv";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./style.css";
import Pagination from "./Pagination.js";



var totalQuota = 0
var totalPoints = 0
var quota_points_data = []

var quotaJan='';
var quotaFeb='';
var quotaMar='';
var quotaApr='';
var quotaMay='';
var quotaJun='';
var quotaJul='';
var quotaAug='';
var quotaSep='';
var quotaOct='';
var quotaNov='';
var quotaDec='';
var pointsJan='';
var pointsFeb='';
var pointsMar='';
var pointsApr='';
var pointsMay='';
var pointsJun='';
var pointsJul='';
var pointsAug='';
var pointsSep='';
var pointsOct='';
var pointsNov='';
var pointsDec='';


export default class QuotaActualProductivity extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            startDate: new Date(),
            performance_rating:'',

            years:[],
            year_selected:'',
            individualpoints_data:[],
            quota_list:[],
            //quota_points_data:[],
            
        };
        const { to, staticContext, ...rest } = this.props;
    }

    componentDidMount() {
        quota_points_data = [];
        axios.get('http://'+window.location.hostname+':8000/individualpoints/')
        .then(res => {
            this.setState({
               individualpoints_data:res.data
            });
            console.log(this.state.individualpoints_data)
            axios.get('http://'+window.location.hostname+':8000/employmenthistory/')
            .then(res => {
             this.setState({
                quota_list:res.data
             });
             var newList = [];
             this.state.quota_list.map((data)=>{
                this.state.individualpoints_data.map((points)=>{
                    if(moment(data.date_updated).format("MM") == moment(points.date).format("MM") && data.employee == points.employee
                                && moment(data.date_updated).format("YYYY") == moment(new Date()).format("YYYY")
                                && moment(points.date_updated).format("YYYY") == moment(new Date()).format("YYYY")){
                            newList.push({name:data.employee_id.firstname + ' ' + data.employee_id.lastname, quota:data.quota, 
                            quotadate:moment(data.date_updated).format("YYYY-MM-DD"), points:points.points, pointsdate:moment(points.date).format("YYYY-MM-DD")})
                        }
                    })
                   
                })
                
           var arrayName = [];
           for (var i = 0; i < newList.length; i++) {
               var name = newList[i].name;
               if (!arrayName[name]) {
               arrayName[name] = [];
               }
               arrayName[name].push(newList[i]);
           }

                Object.keys(arrayName).map((item,index) => {
                    console.log(arrayName[item])
                    totalQuota = 0;
                    totalPoints = 0;
                    arrayName[item].map((data)=>{
                        if(moment(data.quotadate).format("MM")=="01"){
                            quotaJan=data.quota
                            totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="02"){
                            quotaFeb=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="03"){
                            quotaMar=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="04"){
                            quotaApr=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="05"){
                            quotaMay=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="06"){
                            quotaJun=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="07"){
                            quotaJul=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="08"){
                            quotaAug=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="09"){
                            quotaSep=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="10"){
                            quotaOct=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="11"){
                            quotaNov=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }else if(moment(data.quotadate).format("MM")=="12"){
                            quotaDec=data.quota
                           totalQuota = totalQuota+parseInt(data.quota)
                        }
                    
                        if(moment(data.pointsdate).format("MM")=="01"){
                            pointsJan=data.points
                            totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="02"){
                            pointsFeb=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="03"){
                            pointsMar=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="04"){
                            pointsApr=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="05"){
                            pointsMay=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="06"){
                            pointsJun=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="07"){
                            pointsJul=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="08"){
                            pointsAug=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="09"){
                            pointsSep=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="10"){
                            pointsOct=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="11"){
                            pointsNov=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }else if(moment(data.pointsdate).format("MM")=="12"){
                            pointsDec=data.points
                           totalPoints = totalPoints+parseFloat(data.points)
                        }
                        
                    })

                    quota_points_data.push({name:item,quotajan:quotaJan?quotaJan:0,quotafeb:quotaFeb?quotaFeb:0,quotamar:quotaMar?quotaMar:0,
                        quotaapr:quotaApr?quotaApr:0,quotamay:quotaMay?quotaMay:0,quotajun:quotaJun?quotaJun:0,quotajul:quotaJul?quotaJul:0,
                        quotaaug:quotaAug?quotaAug:0,quotasep:quotaSep?quotaSep:0,quotaoct:quotaOct?quotaOct:0,quotanov:quotaNov?quotaNov:0,
                        quotadec:quotaDec?quotaDec:0,
                        quotaave:totalQuota,
                                
                        pointsjan:pointsJan?pointsJan:0,pointsfeb:pointsFeb?pointsFeb:0,pointsmar:pointsMar?pointsMar:0,
                        pointsapr:pointsApr?pointsApr:0,pointsmay:pointsMay?pointsMay:0,pointsjun:pointsJun?pointsJun:0,
                        pointsjul:pointsJul?pointsJul:0,pointsaug:pointsAug?pointsAug:0,pointssep:pointsSep?pointsSep:0,
                        pointsoct:pointsOct?pointsOct:0,pointsnov:pointsNov?pointsNov:0,pointsdec:pointsDec?pointsDec:0,
                        pointsave:totalPoints,

                        ratingjan:isNaN(pointsJan/quotaJan)?0:Number((pointsJan/quotaJan).toFixed(2)),ratingfeb:isNaN(pointsFeb/quotaFeb)?0:Number((pointsFeb/quotaFeb).toFixed(2)),
                        ratingmar:isNaN(pointsMar/quotaMar)?0:Number((pointsMar/quotaMar).toFixed(2)),ratingapr:isNaN(pointsApr/quotaApr)?0:Number((pointsApr/quotaApr).toFixed(2)),
                        ratingmay:isNaN(pointsMay/quotaMay)?0:Number((pointsMay/quotaMay).toFixed(2)),ratingjun:isNaN(pointsJun/quotaJun)?0:Number((pointsJun/quotaJun).toFixed(2)),
                        ratingjul:isNaN(pointsJul/quotaJul)?0:Number((pointsJul/quotaJul).toFixed(2)),ratingaug:isNaN(pointsAug/quotaAug)?0:Number((pointsAug/quotaAug).toFixed(2)),
                        ratingsep:isNaN(pointsSep/quotaSep)?0:Number((pointsSep/quotaSep).toFixed(2)),ratingoct:isNaN(pointsOct/quotaOct)?0:Number((pointsOct/quotaOct).toFixed(2)),
                        ratingnov:isNaN(pointsNov/quotaNov)?0:Number((pointsNov/quotaNov).toFixed(2)),ratingdec:isNaN(pointsDec/quotaDec)?0:Number((pointsDec/quotaDec).toFixed(2)),
                        ratingave:isNaN(totalPoints/totalQuota)?0:Number((totalPoints/totalQuota).toFixed(2))
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

    onYear = e => {
        console.log(e.target.value)
        this.setState({year_selected:e.target.value})
        quota_points_data = [];
        var newList = [];
        this.state.quota_list.map((data)=>{
            this.state.individualpoints_data.map((points)=>{
                if(moment(data.date_updated).format("MM") == moment(points.date).format("MM") && data.employee == points.employee
                && moment(data.date_updated).format("YYYY") == e.target.value && moment(points.date_updated).format("YYYY") == e.target.value){
                        newList.push({name:data.employee_id.firstname + ' ' + data.employee_id.lastname, quota:data.quota, 
                        quotadate:moment(data.date_updated).format("YYYY-MM-DD"), points:points.points, pointsdate:moment(points.date).format("YYYY-MM-DD")})
                    }
                })
               
            })
           
      var arrayName = [];
      for (var i = 0; i < newList.length; i++) {
          var name = newList[i].name;
          if (!arrayName[name]) {
          arrayName[name] = [];
          }
          arrayName[name].push(newList[i]);
      }

           Object.keys(arrayName).map((item,index) => {
               console.log(arrayName[item])
               totalQuota = 0;
               totalPoints = 0;
               arrayName[item].map((data)=>{
                   if(moment(data.quotadate).format("MM")=="01"){
                       quotaJan=data.quota
                       totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="02"){
                       quotaFeb=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="03"){
                       quotaMar=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="04"){
                       quotaApr=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="05"){
                       quotaMay=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="06"){
                       quotaJun=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="07"){
                       quotaJul=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="08"){
                       quotaAug=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="09"){
                       quotaSep=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="10"){
                       quotaOct=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="11"){
                       quotaNov=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }else if(moment(data.quotadate).format("MM")=="12"){
                       quotaDec=data.quota
                      totalQuota = totalQuota+parseInt(data.quota)
                   }
               
                   if(moment(data.pointsdate).format("MM")=="01"){
                       pointsJan=data.points
                       totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="02"){
                       pointsFeb=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="03"){
                       pointsMar=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="04"){
                       pointsApr=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="05"){
                       pointsMay=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="06"){
                       pointsJun=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="07"){
                       pointsJul=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="08"){
                       pointsAug=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="09"){
                       pointsSep=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="10"){
                       pointsOct=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="11"){
                       pointsNov=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }else if(moment(data.pointsdate).format("MM")=="12"){
                       pointsDec=data.points
                      totalPoints = totalPoints+parseFloat(data.points)
                   }
               })

               quota_points_data.push({name:item,quotajan:quotaJan?quotaJan:0,quotafeb:quotaFeb?quotaFeb:0,quotamar:quotaMar?quotaMar:0,
                   quotaapr:quotaApr?quotaApr:0,quotamay:quotaMay?quotaMay:0,quotajun:quotaJun?quotaJun:0,quotajul:quotaJul?quotaJul:0,
                   quotaaug:quotaAug?quotaAug:0,quotasep:quotaSep?quotaSep:0,quotaoct:quotaOct?quotaOct:0,quotanov:quotaNov?quotaNov:0,
                   quotadec:quotaDec?quotaDec:0,
                   quotaave:totalQuota,
                           
                   pointsjan:pointsJan?pointsJan:0,pointsfeb:pointsFeb?pointsFeb:0,pointsmar:pointsMar?pointsMar:0,
                   pointsapr:pointsApr?pointsApr:0,pointsmay:pointsMay?pointsMay:0,pointsjun:pointsJun?pointsJun:0,
                   pointsjul:pointsJul?pointsJul:0,pointsaug:pointsAug?pointsAug:0,pointssep:pointsSep?pointsSep:0,
                   pointsoct:pointsOct?pointsOct:0,pointsnov:pointsNov?pointsNov:0,pointsdec:pointsDec?pointsDec:0,
                   pointsave:totalPoints,

                   ratingjan:isNaN(pointsJan/quotaJan)?0:Number((pointsJan/quotaJan).toFixed(2)),ratingfeb:isNaN(pointsFeb/quotaFeb)?0:Number((pointsFeb/quotaFeb).toFixed(2)),
                   ratingmar:isNaN(pointsMar/quotaMar)?0:Number((pointsMar/quotaMar).toFixed(2)),ratingapr:isNaN(pointsApr/quotaApr)?0:Number((pointsApr/quotaApr).toFixed(2)),
                   ratingmay:isNaN(pointsMay/quotaMay)?0:Number((pointsMay/quotaMay).toFixed(2)),ratingjun:isNaN(pointsJun/quotaJun)?0:Number((pointsJun/quotaJun).toFixed(2)),
                   ratingjul:isNaN(pointsJul/quotaJul)?0:Number((pointsJul/quotaJul).toFixed(2)),ratingaug:isNaN(pointsAug/quotaAug)?0:Number((pointsAug/quotaAug).toFixed(2)),
                   ratingsep:isNaN(pointsSep/quotaSep)?0:Number((pointsSep/quotaSep).toFixed(2)),ratingoct:isNaN(pointsOct/quotaOct)?0:Number((pointsOct/quotaOct).toFixed(2)),
                   ratingnov:isNaN(pointsNov/quotaNov)?0:Number((pointsNov/quotaNov).toFixed(2)),ratingdec:isNaN(pointsDec/quotaDec)?0:Number((pointsDec/quotaDec).toFixed(2)),
                   ratingave:isNaN(totalPoints/totalQuota)?0:Number((totalPoints/totalQuota).toFixed(2))
                   })

           })
    }

    onPDF = e =>{ 
          const input = document.getElementById("quota_actual_productivity");
          html2canvas(input)
            .then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('landscape');
              pdf.setFont("courier");
              pdf.setFontStyle("normal");
              pdf.text("Quota vs Actual vs Productivity year "+this.state.year_selected,10,20);
              pdf.addImage(imgData, 'PNG', 10,25,280,50);
              pdf.save("Quota_vs_Actual_vs_Productivity_year_"+this.state.year_selected);  
            });
      }

    render(){
       const headers = [
            {label: 'Names', key: 'name'},
            {label: 'Jan', key: 'quotajan'},
            {label: 'Feb', key: 'quotafeb'},
            {label: 'Mar', key: 'quotamar'},
            {label: 'Apr', key: 'quotaapr'},
            {label: 'May', key: 'quotamay'},
            {label: 'Jun', key: 'quotajun'},
            {label: 'Jul', key: 'quotajul'},
            {label: 'Aug', key: 'quotaaug'},
            {label: 'Sep', key: 'quotasep'},
            {label: 'Oct', key: 'quotaoct'},
            {label: 'Nov', key: 'quotanov'},
            {label: 'Dec', key: 'quotadec'},
            {label: 'Ave', key: 'quotaave'},
            {label: ' ', key: 'separator'},
            {label: 'Jan', key: 'pointsjan'},
            {label: 'Feb', key: 'pointsfeb'},
            {label: 'Mar', key: 'pointsmar'},
            {label: 'Apr', key: 'pointsapr'},
            {label: 'May', key: 'pointsmay'},
            {label: 'Jun', key: 'pointsjun'},
            {label: 'Jul', key: 'pointsjul'},
            {label: 'Aug', key: 'pointsaug'},
            {label: 'Sep', key: 'pointssep'},
            {label: 'Oct', key: 'pointsoct'},
            {label: 'Nov', key: 'pointsnov'},
            {label: 'Dec', key: 'pointsdec'},
            {label: 'Ave', key: 'pointsave'},
            {label: ' ', key: 'separator'},
            {label: 'Jan', key: 'ratingjan'},
            {label: 'Feb', key: 'ratingfeb'},
            {label: 'Mar', key: 'ratingmar'},
            {label: 'Apr', key: 'ratingapr'},
            {label: 'May', key: 'ratingmay'},
            {label: 'Jun', key: 'ratingjun'},
            {label: 'Jul', key: 'ratingjul'},
            {label: 'Aug', key: 'ratingaug'},
            {label: 'Sep', key: 'ratingsep'},
            {label: 'Oct', key: 'ratingoct'},
            {label: 'Nov', key: 'ratingnov'},
            {label: 'Dec', key: 'ratingdec'},
            {label: 'Ave', key: 'ratingave'},
        ]

         
            
              
          
          var title="Quota_Actual_Productivity_year_"+this.state.year_selected;

        return(
            
        <div className="container">
            
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                                <div className="col-md-6">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroup-sizing-default" style={{width:70,background:"#db3d44",color:'white'}}>Year</span>
                                        </div>
                                            <select onChange={this.onYear} name="year" value={this.state.year_selected} className="form-control dropdown-toggle">
                                                {this.state.years.map((year) => 
                                                    <option key={year.id} value={year.year}>{year.year}</option>)}
                                            </select>
                                    </div>
                            </div>
                        </div>
                  </div>
                  <br/>
                        <CSVLink headers={headers} data={quota_points_data} filename={title+".csv"}>
                                <img 
                                    alt='none'
                                    style={{float:'right',maxHeight:50,height:50,maxWidth:50,marginBottom:5,marginRight:5}} 
                                    src={toEXCEL}
                                    onClick={this.onEXCEL}
                                    target="_blank"
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
                        <br/>
                <div id="quota_actual_productivity">
                    <ReactTable
                         style={{
                            background: '#F5F5F5',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            padding: '5px',
                            textAlign:"center",
                            marginBottom:20
                          }}
                        PaginationComponent={Pagination}
                        defaultPageSize={10}
                        data={quota_points_data}
                        pageSizeOptions={[20, 30, 50, 100, 200, 500]}
                        columns={[
                        {
                            Header: "Names",
                            accessor: "name",
                            columns: [{Header:'',accessor:'name', width:200}]
                        },
                        {
                            Header: "Quota",
                            accessor: "quota",
                            minWidth: 300,
                            columns: [
                                {Header: 'Jan', accessor: 'quotajan'},
                                {Header: 'Feb', accessor: 'quotafeb'},
                                {Header: 'Mar', accessor: 'quotamar'},
                                {Header: 'Apr', accessor: 'quotaapr'},
                                {Header: 'May', accessor: 'quotamay'},
                                {Header: 'Jun', accessor: 'quotajun'},
                                {Header: 'Jul', accessor: 'quotajul'},
                                {Header: 'Aug', accessor: 'quotaaug'},
                                {Header: 'Sep', accessor: 'quotasep'},
                                {Header: 'Oct', accessor: 'quotaoct'},
                                {Header: 'Nov', accessor: 'quotanov'},
                                {Header: 'Dec', accessor: 'quotadec'},
                                {Header: 'Ave', accessor: 'quotaave'},
                            ]
                        },
                        {
                            Header: "Productivity Points",
                            accessor: "productivity_points",
                            minWidth: 300,
                            columns: [
                                {Header: 'Jan', accessor: 'pointsjan'},
                                {Header: 'Feb', accessor: 'pointsfeb'},
                                {Header: 'Mar', accessor: 'pointsmar'},
                                {Header: 'Apr', accessor: 'pointsapr'},
                                {Header: 'May', accessor: 'pointsmay'},
                                {Header: 'Jun', accessor: 'pointsjun'},
                                {Header: 'Jul', accessor: 'pointsjul'},
                                {Header: 'Aug', accessor: 'pointsaug'},
                                {Header: 'Sep', accessor: 'pointssep'},
                                {Header: 'Oct', accessor: 'pointsoct'},
                                {Header: 'Nov', accessor: 'pointsnov'},
                                {Header: 'Dec', accessor: 'pointsdec'},
                                {Header: 'Ave', accessor: 'pointsave'},
                            ]
                        },
                        {
                            Header: "Performance Rating",
                            accessor: "performance_rating",
                            minWidth: 300,
                            columns: [
                                {Header: 'Jan', accessor: 'ratingjan'},
                                {Header: 'Feb', accessor: 'ratingfeb'},
                                {Header: 'Mar', accessor: 'ratingmar'},
                                {Header: 'Apr', accessor: 'ratingapr'},
                                {Header: 'May', accessor: 'ratingmay'},
                                {Header: 'Jun', accessor: 'ratingjun'},
                                {Header: 'Jul', accessor: 'ratingjul'},
                                {Header: 'Aug', accessor: 'ratingaug'},
                                {Header: 'Sep', accessor: 'ratingsep'},
                                {Header: 'Oct', accessor: 'ratingoct'},
                                {Header: 'Nov', accessor: 'ratingnov'},
                                {Header: 'Dec', accessor: 'ratingdec'},
                                {Header: 'Ave', accessor: 'ratingave'},
                            ]
                        },
                        ]}
                    />
                </div>
            </div>
        </div>
  

        );
    }
}
