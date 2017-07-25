import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { addUserMsg, setIsTyping, setVCmode } from "../actions/elasticActions";
import { bindActionCreators } from 'redux'

class messageBox extends React.Component {
    letMargoRead(item) {
        let res
        if (item.data === "error") {
            console.log("test")
            responsiveVoice.speak(item.msg, 'US English Female')
        } else {
            switch (item.intent) {
                case "people":
                    if (item.data.hits.hits.length > 1) {
                        responsiveVoice.speak("Here's the people I found")
                    } else if (item.data.hits.hits.length < 1) {
                        responsiveVoice.speak("Ooops! Sorry I can't find that one")
                    } else {
                        console.log(item)
                        console.log(item.data)
                        res = "Here's some details about " + item.data.hits.hits[0].fields.cleantitle
                        responsiveVoice.speak(res)
                    }
                    break;
                case "weather":
                    responsiveVoice.speak("Here's the weather today")
                    break;
                case "docs":
                    responsiveVoice.speak("Here's what I found")
                    if (item.msg != null) {
                        responsiveVoice.speak(item.msg)
                    }
                    break;
                case "stream":
                    responsiveVoice.speak("Alright! I'm done posting it. You can check your post here")
                    break;
                case "polly":
                    responsiveVoice.speak("Alright! I'm done creating your poll. You can check it here")
                    break;
                case "any":
                    break;
                default:
                    if(item.msg.indexOf("Here is the list of things that I can do") > 0){
                        responsiveVoice.speak("My vision is to provide you with the most relevant information and connect you with the best people here in Accenture. Here is the list of things that I can do: I can provide you with the most relevant documents to your queries. I could provide you with the list of people who are experts on their fields. I could tell you the weather today. I could post to stream. I could create you a poll. I can make you laugh. I can inspire you. I can motivate you when you are down. I am currently in a development phase so there will be more thing that I can do in the days to follow.")
                    }else{
                        responsiveVoice.speak(item.msg)
                    }
                    
            }
        }
    }

    callAPI(qq) {
        ///client/data/people.json
        axios.post('https://collab-ts.cioperf.accenture.com/margo/api/margo/ask/ai', {
            question: qq
        })
            .then(function (response) {
                const margoResponse = {
                    data: JSON.stringify(response.data),
                    owner: 1
                }
                this.props.addUserMsg(margoResponse)
                this.props.setIsTyping(0)
                if (annyang && this.props.data.VCmode) {
                    this.letMargoRead(response.data)
                    annyang.resume();
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error);
                this.props.setIsTyping(0)
            })
    }

    sendMessage(e) {
        if (e.nativeEvent.keyCode === 13) {
            const userMsg = {
                data: null,
                owner: 0,
                msg: e.target.value
            }
            this.props.setIsTyping(1)
            this.props.addUserMsg(userMsg)
            e.preventDefault();
            this.callAPI(e.target.value);
            e.target.value = ""
        }

    }

    activateVC() {
        this.props.setVCmode(1)
        const vcThis = this
        if (annyang) {
            annyang.addCallback('result', function (phrases) {
                console.log("I think the user said: ", phrases[0]);
                const userMsg = {
                    data: null,
                    owner: 0,
                    msg: phrases[0]
                }
                vcThis.props.setIsTyping(1)
                vcThis.props.addUserMsg(userMsg)
                vcThis.callAPI(phrases[0]);
                annyang.pause();
            });
            annyang.start();
        }
    }

    deactivateVC() {
        this.props.setVCmode(0)
        annyang.removeCallback();
        annyang.pause();
        annyang.abort()
    }

    controlVC() {
        if (this.props.data.VCmode) {
            this.deactivateVC()
        }
        else {
            this.activateVC()
        }
    }

    render() {
        let micImgClass = (this.props.data.VCmode) ? "i2o-margo-hidden" : ""
        let micActiveClass = (this.props.data.VCmode) ? "" : "i2o-margo-hidden"
        let margoPlaceHolder = (this.props.data.VCmode) ? "Listening..." : "Type to chat.."
        let taClass = (this.props.data.VCmode) ? "i2o-margo-ta-inactive" : ""
        return (
            <div className="i20-margo-footer">
                <textarea className={taClass} placeholder={margoPlaceHolder} onKeyPress={this.sendMessage.bind(this)}></textarea>
                <div className="i20-margo-mic" onClick={this.controlVC.bind(this)}>
                    <img className={micImgClass} src="./assets/images/mic.png" />
                    <div className={"google-microphone " + micActiveClass}>
                        <div className="shadow listening">
                            <div className="gn">
                                <div className="mc"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addUserMsg: (data) => {
            dispatch(addUserMsg(data));
        },
        setIsTyping: (data) => {
            dispatch(setIsTyping(data));
        },
        setVCmode: (data) => {
            dispatch(setVCmode(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(messageBox);	