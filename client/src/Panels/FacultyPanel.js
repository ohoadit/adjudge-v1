
import React from 'react'
import {ExpansionPanel , ExpansionPanelDetails 
        , ExpansionPanelSummary , Divider ,
             TextField , Button, Snackbar ,  SnackbarContent } from '@material-ui/core'
import Slider from '@material-ui/lab/Slider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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
class FacultyPanel extends React.Component {

    sliderprops = {
        quality : ["Knowledge","Teaching Skills","Punctuality","Communication Skill","Speed Covering Syllabus"],
        name :["slider1","slider2","slider3","slider4","slider5"]
    }

    inputSwitch =(i) =>{
        switch(i){
            case 1 : return(<input type="text" className="card"
                            value={this.state.slideOneVal}
                            name={this.sliderprops.name[i-1]}
                            readOnly/>)
            case 2 : return(<input type="text" className="card"
                            value={this.state.slideTwoVal}
                            name={this.sliderprops.name[i-1]}
                            readOnly/>)
            case 3 : return(<input type="text" className="card"
                            value={this.state.slideThreeVal}
                            name={this.sliderprops.name[i-1]}
                            readOnly/>)                 
            case 4 : return(<input type="text" className="card"
                            value={this.state.slideFourVal}
                            name={this.sliderprops.name[i-1]}
                            readOnly/>)                                                                            
            case 5 : return(<input type="text" className="card"
                            value={this.state.slideFiveVal}
                            name={this.sliderprops.name[i-1]}
                            readOnly/>)  

            default : return(<p>Fault</p>)
        }
    }
    sliderSwitch = (i) =>{
        switch(i){
                case 1 : return(<Slider min={1}   max={10} value={this.state.slideOneVal} onChange={ this.onChangeHandlerA }/>);
                case 2 : return(<Slider min={1}   max={10} value={this.state.slideTwoVal} onChange={ this.onChangeHandlerB}/>);
                case 3 : return(<Slider min={1}   max={10} value={this.state.slideThreeVal} onChange={ this.onChangeHandlerC }/>);
                case 4 : return(<Slider min={1}   max={10} value={this.state.slideFourVal} onChange={ this.onChangeHandlerD }/>);
                case 5 : return(<Slider min={1}   max={10} value={this.state.slideFiveVal} onChange={ this.onChangeHandlerE }/>);
                default : return(<p>Fault</p>)
            }
    }

    state = {
        slideOneVal : 0,
        slideTwoVal : 0,
        slideThreeVal : 0,
        slideFourVal : 0,
        slideFiveVal : 0,
        notify : false,
        snackMessage : '',
        snackColor : ''
    }

    onChangeHandlerA = (event,value) => {this.setState({
            slideOneVal : Math.round(value)
         })
    }

    onChangeHandlerB = (event,value) => {this.setState({
            slideTwoVal : Math.round(value)
         })
    }

    onChangeHandlerC = (event,value) => {this.setState({
            slideThreeVal : Math.round(value)
         })
    }

    onChangeHandlerD = (event,value) => {this.setState({
            slideFourVal : Math.round(value)
         })
    }

    onChangeHandlerE = (event,value) => {this.setState({
            slideFiveVal : Math.round(value)
         })
    }

        generateSlider = () =>{
            let sliderLayout = []

            for(let i=1;i<=5;i++){

                sliderLayout.push(<div className="new" key={i}>{<p>{this.sliderprops.quality[i-1]}</p>}
                {this.inputSwitch(i)}
                {<span className="divide">/10</span>}
                {<div className="slideWrapper">
                    {this.sliderSwitch(i)}
                        </div>}
                </div>)
            }

            return sliderLayout;
        }

        handleSubmit = (event) =>{

            const thisSave = this
            event.preventDefault()
            var faculty = this.props.fid
            var opt = event.target.optional.value
            var know = parseInt(event.target.slider1.value)
            var teach = parseInt(event.target.slider2.value)
            var punc = parseInt(event.target.slider3.value)
            var comm = parseInt(event.target.slider4.value)
            var speed = parseInt(event.target.slider5.value)
           
            const ratings = {
                token : localStorage.getItem('usertoken'),
                username : this.props.enroll,
                fid : faculty,
                optional : opt,
                knowledge : know,
                teaching : teach,
                punctuality : punc,
                communication : comm,
                speed : speed
            }

            
            if(know === 0 || teach === 0 || punc === 0 || comm === 0 || speed === 0){
                thisSave.setState({
                    notify : true , 
                    snackMessage : "Sorry But Zero Not Allowed :(",
                })
                setTimeout(()=>{
                    thisSave.setState({
                        notify : false,
                    })
                },3000)
            }else{

                $.ajax({
                    type: "post",
                    url: "/dashboard/student",
                    data: ratings,
                    dataType: "json",
                    success: function (response,string, reply) {
                        thisSave.setState({
                            notify : true,
                            snackMessage : reply.responseJSON.message,
                            snackColor : '#0db48b'
                        })
                        setTimeout(()=>{
                            thisSave.setState({
                                notify : false,
                            })
                        },2000)
                    },
                    error : function(reply){
                        if (reply.status === 401){
                            localStorage.removeItem('usertoken');
                            thisSave.props.history.push('/login');
                        }
                        thisSave.setState({
                            notify : true,
                            snackMessage : reply.responseJSON.message,
                            snackColor : '#c9422c'
                        })
                    }
                });
                
            }

            
        }

        checkCookie = () => {
            if(localStorage.getItem('usertoken')){
                return;
            }else{
                this.props.history.push('/login');
            }
        }


    render(){

    
    return (
        <div className="expansionContainer" onPointerMove={this.checkCookie}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <p> {this.props.name}</p><hr className="headDivider"/>
                    <p> {this.props.subject} ({this.props.subCode}) </p> 
                </ExpansionPanelSummary>
                            <Divider/>
                <ExpansionPanelDetails>
            
                <p><span> Tap the slider anywhere on the slidebar and drag accordingly to fill out the following fields.</span></p>
                </ExpansionPanelDetails>
    <form onSubmit={this.handleSubmit}>
      <MuiThemeProvider theme={theme}>

                <TextField
                    label="Remarks(optional)"
                    multiline
                    rows="3"
                    className="remarks"
                    margin="normal"
                    variant="outlined"
                    color = "secondary"
                    name="optional"
                     />
                    {this.generateSlider()}
                   
                    <Button variant="contained" color="primary" type="submit"
                            style={{ marginTop : 10+'px',marginBottom : 10 +'px'}}
                    >Save</Button>
      </MuiThemeProvider>
             </form>  
            </ExpansionPanel>
            <Snackbar open={this.state.notify} className="snackbar">
                          <SnackbarContent 
                            message = {this.state.snackMessage}
                            style={{backgroundColor : this.state.snackColor }}
                          /></Snackbar>
            </div>
        );
    }
}
export default withRouter(FacultyPanel);