import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { connect } from 'react-redux';
import { setWelcome } from "../actions/elasticActions";

class body extends React.Component {

    getPromise(city) {
        let timestamp, jData, offsets, localdate, targetDate
        targetDate = new Date()
        timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60
        const cThis = this
        cThis.getLongLatperCity(city).then(function (result) {
            return cThis.getDateAndTimeperCity(result)
        }).then(function (output) {
            jData = output.data
            offsets = jData.dstOffset * 1000 + jData.rawOffset * 1000 // get dst and time zone offsets in milliseconds
            localdate = new Date(timestamp * 1000 + offsets) // date object containing current time of tokyo (timestamp + dstoffset + rawoffset)
            return localdate
        })

    }

    getDateAndTimeperCity(data) {
        let location, targetDate, timestamp, apikey, apicall
        location = data.data.results[0].geometry.location
        targetDate = new Date()
        timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60
        apikey = 'AIzaSyDUkd8jFQhR5SnP01XMOjDj6EdrYpOsFME'
        apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + apikey
        const config = {
            method: 'get',
            url: apicall
        }

        return new Promise((resolve, reject) => {
            axios.request(config)
                .then((res) => {
                    // log success, config, res here
                    resolve(res);
                })
                .catch(err => {
                    // same, log whatever you want here
                    reject(err);
                })
        })
    }

    getLongLatperCity(city) {
        const config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(city)
        }
        return new Promise((resolve, reject) => {
            axios.request(config)
                .then((res) => {
                    // log success, config, res here
                    resolve(res);
                })
                .catch(err => {
                    // same, log whatever you want here
                    reject(err);
                })
        })
    }

    getDay() {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = days[now.getDay()];

        return day
    }

    getCurrentDate() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = mm + '/' + dd + '/' + yyyy;

        return today
    }

    getIconClass(icon) {
        let iconClass

        switch (icon) {
            case "01d":
                iconClass = <img src="./assets/images/sun.png" />
                break;
            case "02d":
                iconClass = <img src="./assets/images/day_cloud.png" />
                break;
            case "03d":
                iconClass = <img src="./assets/images/day_cloudy.png" />
                break;
            case "04d":
                iconClass = <img src="./assets/images/day_cloudy.png" />
                break;
            case "09d":
                iconClass = <img src="./assets/images/rain.png" />
                break;
            case "10d":
                iconClass = <img src="./assets/images/rain.png" />
                break;
            case "11d":
                iconClass = <img src="./assets/images/thunderstorm.png" />
                break;
            case "13d":
                iconClass = <img src="./assets/images/snow.png" />
                break;
            case "50d":
                iconClass = <img src="./assets/images/snow.png" />
                break;
            case "01n":
                iconClass = <img src="./assets/images/snow.png" />
                break;
            case "02n":
                iconClass = <img src="./assets/images/cloudy.png" />
                break;
            case "03n":
                iconClass = <img src="./assets/images/cloud.png" />
                break;
            case "04n":
                iconClass = <img src="./assets/images/cloudy.png" />
                break;
            case "09n":
                iconClass = <img src="./assets/images/rain.png" />
                break;
            case "10n":
                iconClass = <img src="./assets/images/rain.png" />
                break;
        }
        return iconClass;

    }

    getDocImg(item) {
        let docImg

        switch (item._source.cleancontentsource) {
            case "internalblogs":
                if (item._source.blogpostimageurl != null) {
                    docImg = <img src={item._source.blogpostimageurl} />
                } else {
                    docImg = <img src="./assets/images/acn_white.png" />
                }
                break;
            case "kx":
                if (item._source.cleanthumbnail != null) {
                    docImg = <img src={item._source.cleanthumbnail} />
                } else {
                    docImg = <img src="./assets/images/acn_white.png" />
                }
                break;
            default:
                docImg = <img src="./assets/images/acn_white.png" />
                break;
        }
        return docImg;
    }

    getDocURL(item) {
        let docURL = "javascript:void(0)"

        switch (item._source.cleancontentsource) {
            case "internalblogs":
                if (item._source.blogreturnurl != null) {
                    docURL = item._source.blogreturnurl
                } else if (item._source.cleanurl != null) {
                    docURL = item._source.cleanurl
                }
                break;
            case "kx":
                if (item._source.cleanurl != null) {
                    docURL = item._source.cleanurl
                } else if (item._source.cleanurl != null) {
                    docURL = item._source.cleanurl
                }
                break;
            case "mx":
                if (item._source.cleantitle != null) {
                    docURL = item._source.cleantitle
                } else if (item._source.cleanurl != null) {
                    docURL = item._source.cleanurl
                }
                break;
            default:
                docURL = docURL
                break;
        }
        return docURL;
    }

    createResponse(data) {
        data = JSON.parse(data)
        let message_list
        let markup
        switch (data.intent) {
            case "people":
                //draw people markup
                //if more than 1 return
                if (data.data.hits.hits.length > 1) {          
                    message_list = data.data.hits.hits.map((item, i) => {
                        var country = "";
                        var locLength = item.fields.location.length;
                        if(locLength > 0){
                            country = item.fields.location[locLength -1];
                        }
                        return (
                            <div className="i20-margo-reply-people-item" key={i}>
                                <div className="i20-margo-reply-people-img">
                                    <img src={"https://peopleux-perf.ciotest.accenture.com/misc/PhotoProvider.ashx?pk=" + item.fields.peoplekey[0]} />
                                </div>
                                <div className="i20-margo-reply-people-details">
                                    <div className="i20-margo-reply-people-name">
                                        <a target="_blank" href={item.fields.cleanurl[0]}>{item.fields.cleantitle}</a>
                                    </div>                                
                                    <div className="i20-margo-reply-people-level">{item.fields.cleanlevel[2]}</div>
                                     <div className="i20-margo-reply-people-location">{item.fields.homeoffice[0]}</div>
                                      <div className="i20-margo-reply-people-city-country">{country}</div>
                                </div>
                            </div>
                        )
                    });
                    markup = (
                        <div>
                            <div className="i20-margo-reply">Here's the people I found</div>
                            <div className="i20-margo-reply-people">
                                {message_list}
                            </div>
                        </div>
                    )
                } else if (data.data.hits.hits.length < 1) {
                    markup = (
                        <div>
                            <div className="i20-margo-reply">{"Ooops! Sorry I can't find that one"}</div>
                        </div>
                    )
                }
                else {
                    let item = data.data.hits.hits[0]
                    message_list = (
                        <div className="i20-margo-reply-person">
                            <div className="i20-margo-reply-person-item">
                                <div className="i20-margo-reply-person-left">
                                    <img src={"https://peopleux-perf.ciotest.accenture.com/misc/PhotoProvider.ashx?pk=" + item.fields.peoplekey[0]} />
                                </div>
                                <div className="i20-margo-reply-person-right">
                                    <span className="i20-margo-reply-person-name">{item.fields.cleantitle}</span>
                                    <span className="i20-margo-reply-person-level">{item.fields.cleanlevel[2]}</span>
                                    <span className="i20-margo-reply-person-desc">{item.fields.cleandescription[0]}</span>
                                </div>
                            </div>
                        </div>
                    )
                    markup = (
                        <div>
                            <div className="i20-margo-reply">{"Here's some details about " + item.fields.cleantitle}</div>
                            <div className="i20-margo-reply-people">
                                {message_list}
                            </div>
                        </div>
                    )
                }
                break;
            case "weather":
                //draw weather markup
                let item = data.data
                message_list = (
                    <div className="i20-margo-reply-weather">
                        <div className="i20-margo-reply-weather-icon">

                        </div>
                        <div className="i20-margo-reply-weather-details">
                            <div className="i20-margo-reply-weather-main">
                                <div className="i20-margo-reply-weather-city">{item.cityName}</div>
                                <div className="i20-margo-reply-weather-day">{this.getDay()}</div>
                                <div className="i20-margo-reply-weather-date">{this.getCurrentDate()}</div>
                            </div>
                            <div className="i20-margo-reply-weather-icon">
                                <div className={"i20-margo-reply-weather-img"}>{this.getIconClass(item.list[0].weather[0].icon)}</div>
                                <div className="i20-margo-reply-weather-desc">{item.list[0].weather[0].description}</div>
                            </div>
                            <div className="i20-margo-reply-weather-extra">
                                <div className="i20-margo-reply-weather-temp-cont">
                                    <div className="i20-margo-reply-weather-temp-max">{Math.round(parseInt(item.list[0].main.temp_max) * (9 / 5) - 459.67, 2) + " °F"}</div>
                                    <div className="i20-margo-reply-weather-temp-min">{Math.round(parseInt(item.list[0].main.temp_min) * (9 / 5) - 459.67, 2) + " °F"}</div>
                                </div>
                                <div className="i20-margo-reply-weather-wind" title="wind"><span><img src="./assets/images/wind.png" /></span> {item.list[0].wind.speed + "m/s"}</div>
                                <div className="i20-margo-reply-weather-hud" title="humidty"><span><img src="./assets/images/humidity.png" /></span> {item.list[0].main.humidity}</div>
                                <div className="i20-margo-reply-weather-temp-main">{Math.round(parseInt(item.list[0].main.temp) * (9 / 5) - 459.67, 2) + " °F"}</div>
                            </div>
                        </div>
                    </div>
                )
                markup = (
                    <div>
                        <div className="i20-margo-reply">Here's the weather today</div>
                        <div className="i20-margo-reply-people">
                            {message_list}
                        </div>
                    </div>
                )
                break;
            case "docs":
                if (data.data.hits.hits.length > 1) {

                } else {
                    let item = data.data.hits.hits[0]
                    message_list = (
                        <div className="i20-margo-reply-docs">
                            <div className="i20-margo-reply-docs-left">
                                {this.getDocImg(item)}
                            </div>
                            <div className="i20-margo-reply-docs-right">
                                <span className="i20-margo-reply-docs-title"><a target="_blank" href={this.getDocURL(item)}>{item._source.cleantitle}</a></span>
                                <span className="i20-margo-reply-docs-desc">{item._source.cleandescription}</span>
                            </div>
                        </div>
                    )
                    markup = (
                        <div>
                            <div className="i20-margo-reply">{"Here's what I found"}</div>
                            <div className="i20-margo-reply-people">
                                {message_list}
                            </div>
                            {(data.msg === undefined) ? "" : <div className="i20-margo-reply">{data.msg}</div>}
                        </div>
                    )
                }
                break;
            case "stream":
                markup = (
                    <div>
                        <div className="i20-margo-reply">{"Alright! I'm done posting it. You can check your post "}  <a href={"https://peopleux-perf.ciotest.accenture.com/stream/eventid/" + data.data.eventID} target='_blank'>here</a></div>
                    </div>
                )
                break;
            case "polly":
                markup = (
                    <div>
                        <div className="i20-margo-reply">{"Alright! I'm done creating your poll. You can check it "}  <a href={"https://polly.cioperf.accenture.com/" + data.data.surveyID + "/poll"} target='_blank'>here</a></div>
                    </div>
                )
                break;
            case "any": {
                markup = (
                    <div>
                        <div className="i20-margo-reply">{"Ooops! Sorry I can't find that one"}</div>
                    </div>
                )
                break;
            }
            case "game":
                window.location = "https://collab-ts.cioperf.accenture.com/margo/games/margoPuzzle.html";
                break;
            default:
                markup = (
                    <div className="i20-margo-reply" dangerouslySetInnerHTML={this.createMarkup(data.msg)} />
                )
                break;
        }
        return (
            <div className="i20-margo-reply-wrapper">
                {markup}
            </div>
        )
    }

    createMsg() {
        let message_list
        message_list = this.props.data.data.map((item, i) => {
            if (item.owner) {
                //margo response
                if (item.data === "error") {
                    //draw margo generic response
                    return (
                        <div className="i20-margo-reply-wrapper" key={i}><div className="i20-margo-reply">{item.msg}</div></div>
                    )
                } else {
                    //draw margo response base on type
                    return this.createResponse(item.data)
                }
            } else {
                //user response
                return (
                    <div className="i20-margo-reply-wrapper" key={i}><div className="i20-margo-user-reply">{item.msg}</div></div>
                )
            }
        })
        return message_list
    }

    createMarkup(data) {
        return { __html: data }
    }

    render() {
        const messages = this.createMsg();
        let isTypingClass = (this.props.data.isTyping) ? "" : "i2o-margo-hidden"
        let welcomeClass = (this.props.data.welcome) ? "" : "i2o-margo-hidden"
        return (
            <div className="i20-margo-body-wrapper">
                <div className="i20-margo-body">
                    <div className={"i20-margo-welcome " + welcomeClass}>
                        <div className="i20-margo-welcome-img">
                            <img src="./assets/images/margo_welcome.png" />
                        </div>
                        <div className="i20-margo-welcome-note">
                            Hi! I am Margo. I'm a collaboration assistant design to recommend highly relevant and personalized results. I'm your gateway to the entire Accenture knowledge network.
                            </div>
                        <div className="i20-margo-welcome-btn">
                            <span onClick={this.handleWelcome.bind(this)}>SAY HI TO ME</span>
                        </div>
                    </div>
                    {messages}
                    <div className="i20-margo-vSensor" ref={(el) => { this.vSensor = el; }}></div>
                </div>
                <div className={"i20-margo-typingIndicator " + isTypingClass}>
                    <div className="i20-margo-typingIndicator-bubble"></div>
                    <div className="i20-margo-typingIndicator-bubble"></div>
                    <div className="i20-margo-typingIndicator-bubble"></div>
                    <div className="i20-margo-isTyping">
                        <span>Margo is responding...</span>
                    </div>
                </div>
            </div>
        )
    }
    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this.vSensor);
        node.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    componentWillUpdate(nextProps, nextState) {

    }
    handleWelcome() {
        let payload = (this.props.data.welcome) ? 0 : 1
        this.props.setWelcome(payload)
    }
}


const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setWelcome: (data) => {
            dispatch(setWelcome(data));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(body);	