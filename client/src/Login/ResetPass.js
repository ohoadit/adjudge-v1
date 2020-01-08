import React , {Component} from 'react';
import './Login.css';
import {TextField , Button, Snackbar, SnackbarContent} from '@material-ui/core';
import {createMuiTheme , MuiThemeProvider } from '@material-ui/core/styles';
import { withRouter} from 'react-router-dom';
import $ from 'jquery';

const theme = createMuiTheme({
    palette :{
        primary : {
            main : "#004bc3"
        }
    }
})

class ResetPass extends Component {

    SnackProps = (message , color , notify) => {
        this.setState({
            notify : notify,
            snackMessage : message,
            snackColor : color === 'r' ? '#c9422c' : color === 'g' ? '#0db48b' : ''
        })
        setTimeout(() =>{
            this.setState({
                notify : false,
                snackMessage : ''
            })
        },5000)
    }
   
    state = {
        passErr : false,
        passMessage : '',
        confirmErr : false,
        confirmMessage : '',
        notify : false,
        snackMessage : '',
        snackColor : '#c9422c',
    }
    
    componentDidMount = () => {
        const thisSave = this
        let path = window.location.pathname;

        let resetToken = {
            auth : path.split('/')[3]
        }
        const credentials = {
            token : resetToken.auth
        }
        $.ajax({
            type: "post",
            url: "/signup/reset",
            data: credentials,
            dataType: "json",
            success: function (response) {
                return
            },
            error : function (reply) { 
                if(reply.status === 401){
                    thisSave.props.history.push('/login')
                }
             }
        });

    }

    handleSubmit = (event) => {
        event.preventDefault();

        const thisSave = this;
       
        let path = window.location.pathname;

        let resetToken = {
            auth : path.split('/')[3]
        }
        
        const credentials = {
            pass : event.target.password.value,
            confirm : event.target.confirm.value,
            token : resetToken.auth
        }


        if(credentials.pass === "" && credentials.confirm === ""){
            this.setState({
                passErr : true,
                passMessage : "Username Required",
                confirmErr : true,
                confirmMessage : "Password Required"
              })
        }else if(credentials.pass.length < 7){ 
            this.setState({
                passErr : true,
                passMessage : "Password less than 7 characters"
            })
        }else if(credentials.confirm.length < 7){
            this.setState({
                confirmErr : true,
                confirmMessage : "Password less than 7 characters"
            })
        }else if(credentials.confirm !== credentials.pass){
            this.setState({
                confirmErr : true,
                confirmMessage : "Password doesn't match"
            })
        }else{
            this.setState({
                passErr : false,
                passMessage : "",
                confirmErr : false,
                confirmMessage : ""
              })

            $.ajax({
                type: "post",
                url: "/signup/reset",
                data: credentials,
                dataType: "json",
                success: function (response , string , reply) {
                    
                    thisSave.SnackProps(reply.responseJSON.message,'g',1)

                    setTimeout(() => {
                        thisSave.props.history.push('/login');
                    }, 5000);
                },error : function(err){

                    if(err.status === 401){
                        thisSave.props.history.push('/login');
                    }else if(err.status === 500){
                        thisSave.SnackProps('Server not responding wait for it to be online','r',1)
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
                     <h4>Reset Password</h4>

                    <form onSubmit={this.handleSubmit}>

                                <TextField variant="outlined" margin="normal" name="password" 
                                        label="Password" 
                                        type="password" 
                                        error={this.state.passErr}
                                        style={{height : 50 + 'px' }}
                                /><br/>
                                <span className="inputError">{this.state.passMessage}</span><br/>

                                <TextField variant="outlined" margin="normal" name="confirm" 
                                            label="Confirm" 
                                            type="password" 
                                            error={this.state.confirmErr}
                                            style={{height : 50 + 'px' }}
                                /><br/>
                                <span className="inputError">{this.state.confirmMessage}</span><br/>

                                <Button 
                                    variant="contained" color="primary" 
                                     type="submit"
                                    style={{width:100 , marginTop:20}}>Submit</Button>
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

export default withRouter (ResetPass);