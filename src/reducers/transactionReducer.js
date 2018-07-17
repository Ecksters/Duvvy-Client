import { CREATE_TRANSACTION, CREATE_TRANSACTIONS, READ_TRANSACTIONS, UPDATE_TRANSACTION, DELETE_TRANSACTION } from "../actions/types"

const initialState = {
    transactions: []
};

const updateTransaction = (updated) => (transaction) => {
  return transaction.id === updated.id ? updated : transaction;
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_TRANSACTIONS:
          return action.payload;
        case CREATE_TRANSACTION:
        case CREATE_TRANSACTIONS:
          return state.concat(action.payload);
        case UPDATE_TRANSACTION:
          return state.map(updateTransaction(action.payload));
        case DELETE_TRANSACTION:
          return state.filter((transaction) => transaction.id !== action.payload.id);
        default:
          return state;
    }
}