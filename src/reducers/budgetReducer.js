import { CREATE_BUDGET, READ_BUDGETS } from "../actions/types"

const initialState = {
    budgets: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_BUDGETS:
          return action.payload;
        case CREATE_BUDGET:
          return state.concat(action.payload);
        default:
          return state;
    }
}