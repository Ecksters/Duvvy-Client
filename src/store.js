import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers"

const initialState = {
    transactions: [],
    categories: [],
    budgets: []
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

export const apiUrl = "http://localhost:4000/api/v1";

export const mapStateToProps = state => ({
    transactions: state.transactions,
    categories: state.categories,
    budgets: state.budgets
})

export default store;