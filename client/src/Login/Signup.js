import React , {Component} from 'react'
import './Login.css'
import {TextField , Button, Snackbar, SnackbarContent, Select, MenuItem} from '@material-ui/core'
import {createMuiTheme , MuiThemeProvider } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import $ from 'jquery'

const theme = createMuiTheme({
    palette :{
        primary : {
            main : "#004bc3"
        }
    }
})


class Signup extends Component{

    SnackProps = (message , color , notify) => {
        this.setState({
            notify : notify,
            snackMessage : message,
            snackColor : color === 'r' ? '#c9422c' : color === 'g' ? '#0db48b' : ''
        })
        // setTimeout(() =>{
        //     this.setState({
        //         notify : false,
        //         snackMessage : ''
        //     })
        // },5000)
    }



    state = {
        usernameErr : false,
        usernameMessage : '',
        emailErr : false,
        emailMessage : '',
        username : '',
        notify : false,
        snackMessage : '',
        label : 'Enrollment',
        userBound : 'IT',
        snackColor : '#c9422c'
    }



    userScope = (event) =>{

         this.setState({
             userBound : event.target.value
         })        
     }

     handleSubmit = (event) => {

       
        event.preventDefault();

        const thisSave = this
        
        const credentials = {
            enroll : event.target.username.value,
            email : event.target.email.value,
            branch : this.state.userBound
        }

        
        if(credentials.enroll === "" && credentials.email === ""){
            this.setState({
                usernameErr : true,
                usernameMessage : "Username Required",
                emailErr : true,
                emailMessage : "Email Required"
            })
        }else if(credentials.enroll.length !==10){
                this.setState({
                    usernameErr : true,
                    usernameMessage : "Username Invalid"    
                })
                
        }else if (credentials.email === "") { 
            this.setState({
                emailErr : true,
                emailMessage : "Email Required"
            })
        }else{
            thisSave.setState({
                emailErr : false,
                emailMessage : '',
                usernameErr : false,
                usernameMessage : ''
            })

        $.ajax({
            type: "post",
            url: "/signup",
            data: credentials,
            dataType: "json",
            success: function (response , string , reply) {
                thisSave.SnackProps(reply.responseJSON.message,'g',1);
            },
            error : function(err){
                if(err.status === 422){
                    thisSave.setState({
                        emailErr : true , 
                        emailMessage : err.responseJSON.message
                    })
                }else if(err.status === 409){
                    thisSave.setState({
                        usernameErr : true , 
                        usernameMessage : err.responseJSON.message
                    })
                    
                }else if(err.status === 500){
                    thisSave.SnackProps('Server not responding ','r',1)
                }else {
                    thisSave.SnackProps(err.responseJSON.message,'r',1);
                }
            }
        });
        }
    }


    render () {

        return (
            <MuiThemeProvider theme={theme}>
            <div className="loginForm">
            <h2>Adjudge</h2>
                 <h4>Signup</h4>
             <form onSubmit={this.handleSubmit}>
             
    <Select style={{ position : 'absolute' , marginTop : 15 + 'px' ,
                         height : 50 +'px' , width : 80 +'px' , 
                         marginLeft : -40+'px', textDecoration : 'none'}}
             
            onChange = {this.userScope}
            value={this.state.userBound}
    >
        <MenuItem value="IT">IT</MenuItem>
        <MenuItem value="CE">CE</MenuItem>
        <MenuItem value="CSE">CSE</MenuItem>
    </Select>
                
                <TextField variant="outlined" margin="normal" name="username" 
                  
                    label="Enrollment"
                    error={this.state.usernameErr}
                    style={{height : 50 + 'px' , width : 170 +'px' , marginLeft : 80 + 'px' }}
                    /><br/>
                <span className="inputError">{this.state.usernameMessage}</span>    
                    <br/>
                <TextField variant="outlined" margin="normal" name="email" 
                    label="Email" 
                    type="text" 
                    className="input"
                    error={this.state.emailErr}
                    style={{height : 50 + 'px' , width : 300 +'px' }}
                /><br/>
                <span className="inputError">{this.state.emailMessage}</span>
              
                <br/>
                <Button 
                    variant="contained"  
                    color="primary" 
                    className="input" type="submit" style={{width:100 , marginTop:20}}>Submit</Button>

                <Button variant="outlined" color="primary" 
                        style={{ marginTop:20  , marginLeft : 10 }}
                        component={Link} to="/login"
                        >Login</Button>    
                   
            </form>

            <Snackbar open={this.state.notify} className="snackbar" autoHideDuration={5000}>
                      <SnackbarContent 
                        message = {this.state.snackMessage}
                        style={{backgroundColor : this.state.snackColor , textAlign : 'right' }}
                      />
                      
                      </Snackbar>

            </div>
            </MuiThemeProvider>
        );
    }
}

export default Signup;