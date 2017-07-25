export function addUserMsg(data) {
    return {
        type: "SET_DATA",
        payload:data
    };
}

export function setChatMode(data) {
    return {
        type: "SET_CHAT_MODE",
        payload:data
    };
}


export function setIsTyping(data) {
    return {
        type: "SET_IS_TYPING",
        payload:data
    };
}



export function setWelcome(data) {
    return {
        type: "SET_IS_WELCOME",
        payload:data
    };
}


export function setVCmode(data) {
    return {
        type: "SET_IS_VC_MODE",
        payload:data
    };
}