import React , {Component} from 'react'
import {AppBar , Toolbar , IconButton, MenuList, MenuItem , Paper, ClickAwayListener } from '@material-ui/core'
import AccountBox from '@material-ui/icons/AccountBox'
import {  MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {withRouter} from 'react-router-dom'
import $ from 'jquery'

const theme = createMuiTheme({
    palette : {
        primary : {
            main : "#004bc3"
        }
    }
})


class Appbar extends Component{

    state = {
        open : false,
    }

    handleAccount = () => {

    const thisSave = this

        if(this.state.open === false){

        

            $(".menu").animate({
                width : 130 + 'px',
                height : 50 + 'px'
            },50)

            thisSave.setState({ open : true});
        }else{
           
        }
           
    }

    handleClickAway = () =>{
        this.setState({
            open : false
        })
        $(".menu").animate({
            width : 0 + 'px',
            height : 0 + 'px'
        },50)
    }

    handleLogout = () =>{
        localStorage.removeItem('usertoken');
        this.props.history.push('/login/welcome');
    }
    
    
  
    render (){
      
        return ( 
            <div className="appbar">
            <MuiThemeProvider theme={theme}>
                <AppBar color="primary" style={{ height:70+'px'}}>
                    <Toolbar style={{flexGrow : 1}}>
                    
                        <h4 style={{flexGrow:1}}>
                            {this.props.title} 
                        </h4>  
                        <IconButton color="inherit" 
                            onClick={ this.handleAccount }>
                            <AccountBox/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                </MuiThemeProvider>
            <ClickAwayListener onClickAway={this.handleClickAway}>
                <div className="menu">
                    <Paper style={{borderRadius : 1+'px'}}>
                          <MenuList>
                              <MenuItem onClick={this.handleClickAway} >{this.props.username}</MenuItem>
                              <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                          </MenuList>
                    </Paper>
                </div>
            </ClickAwayListener>
            </div>
            
        );
    }
}

export default withRouter(Appbar);