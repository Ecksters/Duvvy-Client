import { CREATE_TRANSACTION, READ_TRANSACTIONS } from "../actions/types"

const initialState = {
    transactions: [],
    transaction: {}
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_TRANSACTIONS:
          return {
            ...state,
            transactions: action.payload
          }
        default:
          return state;
    }
}