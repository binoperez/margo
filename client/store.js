import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import data from "./reducers/dataReducer";


export default createStore(
    combineReducers({
        data
    }), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);