import { CREATE_TRANSACTION, CREATE_TRANSACTIONS, READ_TRANSACTIONS } from "../actions/types"

const initialState = {
    transactions: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_TRANSACTIONS:
          return action.payload;
        case CREATE_TRANSACTION:
        case CREATE_TRANSACTIONS:
          return state.concat(action.payload);
        default:
          return state;
    }
}