import React, { Component } from 'react'
import Appbar from '../Appbar/Appbar'
import '../App.css'
import FacultyPanel from '../Panels/FacultyPanel.js'
import {withRouter} from 'react-router-dom'
import jwt_decode from 'jwt-decode'

class StudentDash extends Component {

  componentDidMount = () => {

    const token = jwt_decode(localStorage.getItem('usertoken'));

    this.setState({
      username : token.userId
    })
  }

  state = {
      faculties : [
        { id : 101, name:"Khushbhu Maurya", subject:"CG" , subCode : "IT0601"} ,
        { id : 201, name:"Zalak Trivedi", subject:"PP" , subCode : "IT0602"} ,
        { id : 301, name:"Madhvi Bera", subject:"AJT" , subCode : "IT0603"} ,
        { id : 401, name:"Sejal Thakkar", subject:"STQA" , subCode : "IT0611"} ,
        { id : 501, name:"Sandeep Chakravarti", subject:"SC" , subCode : "IT0606"} ,
        { id : 601, name:"Jay Dave", subject:"DWHM" , subCode : "IT0608"} ,
        { id : 701, name:"Not Disclosed", subject:"ATCS" , subCode : "SH0607"} ,
      ] ,
      username : ""
  }
  GeneratePanels = () => {
    let layout = [];
      for(let a=0;a<7;a++){
  
        layout.push(<FacultyPanel 
               name={this.state.faculties[a].name}
               subject={this.state.faculties[a].subject}
               subCode = {this.state.faculties[a].subCode}
               key = {this.state.faculties[a].id}
               fid = {this.state.faculties[a].id}
               enroll= {this.state.username}
          />);
      }
      return layout;
  }

 
 render() {
    return (
      
      <div className="App">

            <Appbar title="Adjudje" username={this.state.username}/>

              {this.GeneratePanels()}
              
            </div> 
      
    );
  }
}

export default withRouter(StudentDash);

