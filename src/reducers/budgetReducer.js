import { CREATE_BUDGET, READ_BUDGETS, UPDATE_BUDGET, DELETE_BUDGET } from "../actions/types"

const initialState = {
    budgets: []
};

const updateBudget = (updated) => (budget) => {
  return budget.id === updated.id ? updated : budget;
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_BUDGETS:
          return action.payload;
        case CREATE_BUDGET:
          return state.concat(action.payload);
        case UPDATE_BUDGET:
          return state.map(updateBudget(action.payload));
        case DELETE_BUDGET:
          return state.filter((budget) => budget.id !== action.payload.id);
        default:
          return state;
    }
}