import { CREATE_BUDGET, READ_BUDGETS } from "./types"
import { apiUrl } from "../store"

export const readBudgets = () => (dispatch) => {
  fetch(apiUrl + '/budgets')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_BUDGETS,
      payload: data.data
    }));
}

export const createBudget = (budget) => (dispatch) => {
  fetch(apiUrl + '/budgets', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"budget": budget})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: CREATE_BUDGET,
      payload: data.data
    }));
}