import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
import categoryReducer from './categoryReducer';
import budgetReducer from './budgetReducer';

export default combineReducers({
    transactions: transactionReducer,
    categories: categoryReducer,
    budgets: budgetReducer
});