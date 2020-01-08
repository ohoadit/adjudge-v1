import React from 'react'
import Appbar from '../Appbar/Appbar'
import '../App.css'
import jwt_decode from 'jwt-decode'
import  { Button , Dialog , DialogTitle , DialogContent, DialogContentText, DialogActions, Select , MenuItem} from '@material-ui/core'
import {withRouter} from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import $ from 'jquery'
import Slide from '@material-ui/core/Slide'
import transitions from '@material-ui/core/styles/transitions';


const Transition = (props) => {
    return (<Slide direction="up" {...props}/>)
}

class FacultyDash extends React.Component{


    

    componentDidMount = () => {

        const token = jwt_decode(localStorage.getItem('usertoken'));
        this.setState({
            username : token.userId
        })
    }
    state = {
        username : '',
        IT: [
            { id : 101, name:"Khushbhu Maurya", know :"", teach : "",punct : "",comm : "",speed : "" } ,
            { id : 201, name:"Zalak Trivedi", know :"", teach : "",punct : "",comm : "",speed : ""  } ,
            { id : 301, name:"Madhvi Bera", know :"", teach : "",punct : "",comm : "",speed : "" } ,
            { id : 401, name:"Sejal Thakkar",know :"", teach : "",punct : "",comm : "",speed : "" } ,
            { id : 501, name:"Sandeep Chakravarti",know :"", teach : "",punct : "",comm : "",speed : ""  } ,
            { id : 601, name:"Jay Dave",know :"", teach : "",punct : "",comm : "",speed : ""  } ,
            { id : 701, name:"Rutva Meckwan",know :"", teach : "",punct : "",comm : "",speed : "" } ,
        ],
        dialog : false,
        rows : false,
        branch : 'Branch'

    }

    

      generateRows = ()=>{

        if (!this.state.rows){
            return;
        }

        let rowLayout = [];

            for(let i=0;i<7;i++){
                rowLayout.push(<Paper>
                {<tr style={{ marginTop : 100+'px'}}>
                    <td>{this.state.IT[i].name}</td>
                    <td className="margin">{this.state.IT[i].know}</td>
                    <td className="rest">{this.state.IT[i].teach}</td>
                    <td className="rest">{this.state.IT[i].punct}</td>
                    <td className="rest">{this.state.IT[i].comm}</td>
                    <td className="rest">{this.state.IT[i].speed}</td>
                </tr>}</Paper>)
                rowLayout.push(<br/>)
            }
            return rowLayout;
  }

    pushResults = (report , index) =>{
        var finalKnow = 0,
            finalTeach = 0,
            finalPunc = 0,
            finalComm = 0,
            finalSpeed = 0;
        if(report.length > 0){
            for(var i=0;i<report.length;i++){
                var know = parseInt(report[i].know);
                var teach = parseInt(report[i].qot);
                var comm = parseInt(report[i].comm);
                var punc = parseInt(report[i].punc);
                var speed = parseInt(report[i].speed);

                finalKnow+=know;
                finalTeach+=teach;
                finalComm+=comm;
                finalPunc+=punc;
                finalSpeed+=speed;
            }

            finalKnow/=report.length;
            finalTeach/=report.length;
            finalPunc/=report.length;
            finalComm/=report.length;
            finalSpeed/=report.length;

            let temp = this.state.IT;
            temp[index].know = Math.round(finalKnow)
            temp[index].teach = Math.round(finalTeach)
            temp[index].punct = Math.round(finalPunc)
            temp[index].comm = Math.round(finalComm)
            temp[index].speed = Math.round(finalSpeed)
            this.setState({
                IT : temp
            })
        }
    }
    
      getFaculty = (e) =>{

            e.preventDefault();
            
            const thisSave = this
            
            const send = {
                token : localStorage.getItem('usertoken'),
                data : "Get results"
            }
            $.ajax({
                type: "post",
                url: "/dashboard/faculty",
                data: send,
                dataType: "json",
                success: function (response , string , reply) {
                    
                    if(reply.status === 201){
                        
                        let fac1 = [] , fac2 = [] , fac3 = [] , fac4 = [] , fac5 = [] , fac6 = [];
                        for(var i=0;i<response.length;i++){
                            if(response[i].fid === '101'){
                                fac1.push(response[i]);
                            }else if(response[i].fid === '201'){
                                fac2.push(response[i]);
                            }else if(response[i].fid === '301'){
                                fac3.push(response[i]);
                            }else if(response[i].fid === '401'){
                                fac4.push(response[i]);
                            }else if(response[i].fid === '501'){
                                fac5.push(response[i]);
                            }else if(response[i].fid === '601'){
                                fac6.push(response[i]);
                            }
                        }

                        thisSave.pushResults(fac1 , 0)
                        thisSave.pushResults(fac2 , 1)
                        thisSave.pushResults(fac3 , 2)
                        thisSave.pushResults(fac4 , 3)
                        thisSave.pushResults(fac5 , 4)
                        thisSave.pushResults(fac6 , 5)
                        
                        thisSave.setState({
                            rows : true
                        })
                    }  
                
                },
                error : function(reply){
                    if ( reply.status === 401){
                        localStorage.removeItem('usertoken');
                        thisSave.props.history.push('/login');
                    }
                }
            });
      }

      handleClose = () => {
          this.setState({
              dialog : false
          })
      }


  
    render () {
        return (

            <div className="App">
                <Appbar title="Adjudge" username={this.state.username}/>

            <div className="request" >
                <form onSubmit={this.getFaculty}>


                        

                        
                </form> 

                    <Button color="secondary" variant = "raised"
                            className="button" 
                            type="submit" 
                            name="individual" onClick={()=>{
                                this.setState({
                                    dialog : true
                                })
                            }}>Speical Remarks</Button>
                            
                
              <Dialog open={this.state.dialog} TransitionComponent={Transition} scroll="paper">
                
                    <DialogTitle>Select From the following</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.specialRemarks}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Kingpin</Button>
                    </DialogActions>
                </Dialog>
                
                <table   cellPadding="5px" cellSpacing="30px" className="table">
                
                <Paper>
                    <tr>
                        <td>Faculty{this.state.test}</td>
                        <td style={{paddingLeft : 150+'px'}}>Knowledge</td>
                        <td>Teaching Skills</td>
                        <td>Punctuality</td>
                        <td>Comm. Skills</td>
                        <td>Speed </td>
                    </tr>
                    </Paper><br/>
                
                {this.generateRows()}
                     
                </table>
  
                </div>
              
            </div> 
        );
    }
}

export default withRouter(FacultyDash);