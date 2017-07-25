
const initialState = 
  {
    data: [{
            data:"error",
            msg:"Hello, how may I help you today?",
            owner: 1
        }],
    chatMode: 0,
    isTyping: 0,
    welcome: 1,
    VCmode: 0
  }


export default function elastic(state = initialState, action) {
  switch (action.type) {
        case "SET_DATA":
            state = {
                ...state,
                data: [...state.data, action.payload]
            };
            break;
        case "SET_CHAT_MODE":
            state = {
                ...state,
                chatMode: action.payload
            };
            break;
        case "SET_IS_TYPING":
            state = {
                ...state,
                isTyping: action.payload
            };
            break;
        case "SET_IS_WELCOME":
            state = {
                ...state,
                welcome: action.payload
            };
            break;
         case "SET_IS_VC_MODE":
            state = {
                ...state,
                VCmode: action.payload
            };
            break;
    }
    return state;
}

