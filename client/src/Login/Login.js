import React, { Component } from 'react'
import './Login.css'
import {TextField , Button, Snackbar, SnackbarContent, Select, MenuItem, IconButton} from '@material-ui/core'
import {createMuiTheme , MuiThemeProvider } from '@material-ui/core/styles'
import Launch from '@material-ui/icons/Launch'
import { withRouter} from 'react-router-dom'
import $ from 'jquery'
import Link from 'react-router-dom/Link';

const theme = createMuiTheme({
    palette :{
        primary : {
            main : "#004bc3"
        }
    }
})

class Login extends Component{

    state = {
        usernameErr : false,
        usernameMessage : '',
        passErr : false,
        passMessage : '',
        username : '',
        notify : false,
        snackMessage : '',
        label : 'Enrollment',
        userBound : 'IT',
        snackColor : '#c9422c'
    }

    handleSubmit = (event) =>{

        const thisSave = this

        event.preventDefault()

        const credentials = {
            name : event.target.username.value,
            pass : event.target.password.value,
            branch : this.state.userBound
        }
        if(credentials.name === "" && credentials.pass === ""){
            this.setState({
                usernameErr : true,
                usernameMessage : "Username Required",
                passErr : true,
                passMessage : "Password Required"
              })
        }else if(credentials.pass.length < 7){ 
            this.setState({
                passErr : true,
                passMessage : "Password less than 7 characters"
            })
        }else if(credentials.pass === ""){
            this.setState({
                passErr : true,
                passMessage : "Password Required"
            })
        }else if(credentials.name.length !==10 && credentials.branch !== 'FID'){
            this.setState({
                usernameErr : true,
                usernameMessage : "Username invalid skip IU just in case"
            })
        }else if(credentials.branch === 'FID' && credentials.name.length!==6){
            this.setState({
                usernameErr : true,
                usernameMessage : "Username invalid check the dropdown incase you are a student"
            })
        }
        else{
                thisSave.setState({
                    usernameErr : false,
                    usernameMessage : "",
                    passErr : false,
                    passMessage : ""
                });
                
        $.ajax({
            type: "POST",
            url: "/login",
            data: credentials,
            dataType: "json",
            success: function (res, string , reply) {

                if(reply.status === 201){
                    thisSave.setState({
                        notify : true,
                        snackMessage : reply.responseJSON.message,
                        snackColor : '#0db48b'
                    })
                    setTimeout(()=>{
                        thisSave.setState({
                            notify : false,
                        })
                    },3000)    
                }

                   else if(reply.status === 200){
                    
                        
                        localStorage.setItem('usertoken',reply.responseJSON.usertoken);

                            if(credentials.branch === 'FID'){
                                thisSave.props.history.push('/dashboard/faculty');
                            }else{
                                thisSave.props.history.push('/dashboard/student');
                            }
                       
                    }
                       

            },error: function(message){

                if(message.status === 455){

                    thisSave.setState({
                        usernameErr : true,
                        usernameMessage : message.responseJSON.message
                    })
                }else if(message.status === 500) {
                    thisSave.setState({
                        notify : true,
                        snackMessage : "Server not responding wait for it to be online"
                    })
                    setTimeout(()=>{
                        thisSave.setState({
                            notify : false,
                        })
                    },3000)
                 }else{
                    thisSave.setState({
                        passErr : true,
                        passMessage : message.responseJSON.message
                    })
                }
              }
            })
        }
    }

    userScope = (event) =>{

       const dropDownValue = event.target.value
        this.setState({
            userBound : event.target.value
        })

        if(dropDownValue === 'FID'){
            this.setState({
                label : 'Faculty_Id'
            })
        }else{
            this.setState({
                label : 'Enrollment'
            })
        }

        
    }
    

    render(){

        return (
            
            <MuiThemeProvider theme={theme}>
                <div className="loginForm">
                <h2>Adjudge</h2>
                     <h4>Login</h4>
                 <form onSubmit={this.handleSubmit}>
                 
        <Select style={{ position : 'absolute' , marginTop : 15 + 'px' ,
                         height : 50 +'px' , width : 80 +'px' , 
                         marginLeft : -30+'px', textDecoration : 'none'}}
                onChange = {this.userScope}
                value={this.state.userBound}
                variant="outlined"
        >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="FID">FID</MenuItem>
        </Select>
                    
                    <TextField variant="outlined" margin="normal" name="username" 
                      
                        label={this.state.label}
                        error={this.state.usernameErr}
                        style={{height : 50 + 'px' , width : 170 , marginLeft : 80 }}
                        /><br/>
                    <span className="inputError">{this.state.usernameMessage}</span>    
                        <br/>
                    <TextField variant="outlined" margin="normal" name="password" 
                        label="Password" 
                        type="password" 
                        className="input"
                        error={this.state.passErr}
                        style={{height : 50 + 'px', width : 250 }}
                        onChange={this.handleChars}
                    /><br/>
                    <span className="inputError">{this.state.passMessage}</span>
                  
                    <br/>
                    <Button 
                        variant="contained"  
                        color="primary" 
                        className="input" type="submit" style={{width:100 , marginTop:20}}>Submit</Button>

                <Button variant="outlined" color="primary" 
                        style={{ marginTop:20  , marginLeft : 10 }}
                        component={Link} to="/signup"
                        >SignUp 
                        
                            <Launch/>
                        </Button>
                       
                </form>

                <Snackbar open={this.state.notify} className="snackbar">
                          <SnackbarContent
                            message = {this.state.snackMessage}
                            style={{backgroundColor : this.state.snackColor }}
                          />
                          
                          </Snackbar>

                </div>
                </MuiThemeProvider>
            
        );
    }
}

export default withRouter(Login);