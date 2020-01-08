import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StudentDash  from './Dashboard/StudentDash'
import FacultyDash from './Dashboard/FacultyDash'
import {BrowserRouter as Router , Route , Redirect } from 'react-router-dom'
import Login from './Login/Login';
import Switch from 'react-router-dom/Switch';
import jwt_decode from 'jwt-decode';
import Signup from './Login/Signup';
import ResetPass from './Login/ResetPass';



class MyRoutes extends React.Component{

    tokenExistence = () =>{
        if(!localStorage.getItem('usertoken')){
            return false;
        }else{
            return true
        }
    }
    tokenCredentials = () =>{
    
        var decode = jwt_decode(localStorage.getItem('usertoken'));
        
            if(decode.binCheck === 'FID'){
                return true;
            }else{
                return false;
            }
        }
    
    
    noMatch = () =>{
     return (<Redirect to={{
         pathname : "/login",
     }}       />
     );
    }
    
    checkStudentCookie = () =>{

    if(this.tokenExistence()) {
        if(!this.tokenCredentials()){
            return(
                <StudentDash/>
            );
        }else if(this.tokenCredentials()){
            return(
                <Redirect to={{
                    pathname : '/dashboard/faculty',
                }} />
            );
        }else{
            return(
                <Redirect to={{
                    pathname : "/login",
                }}/>
                
            );
        }
    }else{
        return(
            <Redirect to={{
                pathname : "/login",
            }}/>
            
        );
    }
}
    
    checkFacultyCookie = () =>{

    if(this.tokenExistence()) {
        if(!this.tokenCredentials()){
            return(
                <Redirect to={{
                    pathname : '/dashboard/student',
                }} />
            );
        }else if(this.tokenCredentials()){
            return(
                <FacultyDash/>
            );
        }else{
            return(
                <Redirect to={{
                    pathname : "/login",
                }}/>
                
            );
        }
    }else{
        return(
            <Redirect to={{
                pathname : "/login",
            }}/>
            
        );
    }
}
    
    
    
    checkIfLoggedIn = () =>{
        if(localStorage.getItem('usertoken') && !this.tokenCredentials()){
            return (
                <Redirect to={{
                    pathname : '/dashboard/student',
                }} />
            )
        }else if(localStorage.getItem('usertoken') && this.tokenCredentials()){
            return (
                <Redirect to={{
                    pathname : '/dashboard/faculty',
                }} />
            )
        }else{
            return(
                <Login/>
            )
        }
    }
    
    render(){
        return(
            <Router>
                
                <Switch>
                    <Route  exact path="/login" component={this.checkIfLoggedIn}/>
                    <Route exact path="/dashboard/student" component={this.checkStudentCookie}/>
                    <Route exact path="/dashboard/faculty" component={this.checkFacultyCookie}/>
                    <Route exact path="/signup" component={Signup}/>
                    <Route path="/signup/reset" component={ResetPass}/>
                    <Route component={this.noMatch}/>
                    
                </Switch>
                
            </Router>
        );
    }
}
ReactDOM.render(<MyRoutes />, document.getElementById('root'));