import React from 'react';
import MsgBox from '../components/messageBox.jsx'
import Body from '../components/body.jsx'
import { Header } from '../components/header.jsx'
import { connect } from 'react-redux';
import { setChatMode } from "../actions/elasticActions";

class App extends React.Component{
    handleOpenChat(){
        let payload = (this.props.data.chatMode) ? 0 : 1      
        this.props.setChatMode(payload)
    }

    render(){  
        let chatClass = (this.props.data.chatMode) ? "i20-margo-chat-open" : "i20-margo-chat-close"      
        let bubbleClass = (this.props.data.chatMode) ? "i20-margo-bubble-open" : "i20-margo-bubble-close"
        return (
            <div className="i2o-margo-wrapper">
                <div className={"i20-margo-cont " + chatClass}>
                    <Header handleOpenChat={ this.handleOpenChat.bind(this) }/>
                    <Body/>
                    <MsgBox />
                </div>
                <div className={"i20-margo-bubble " + bubbleClass} onClick={ this.handleOpenChat.bind(this) }>  
                     <img src="./assets/images/margo_bubble.png"/>
                </div>
                <div className="i2o-margo-hidden" id="audio"></div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        data: state.data
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setChatMode: (data) => {
            dispatch(setChatMode(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (App);