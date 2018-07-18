import { CREATE_BUDGET, READ_BUDGETS, UPDATE_BUDGET, DELETE_BUDGET, READ_CATEGORIES } from "./types"
import { apiUrl } from "../store"
import store from "../store"
import { updateCategory } from "./categoryActions";

export const readBudgets = () => (dispatch) => {
  fetch(apiUrl + '/budgets')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_BUDGETS,
      payload: data.data
    }));
}

export const updateBudget = (budget) => (dispatch) => {
  fetch(apiUrl + '/budgets/' + budget.id, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"budget": budget})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: UPDATE_BUDGET,
      payload: data.data
    }));
}

export const deleteBudget = (budget) => (dispatch) => {
  const categories = store.getState().categories.map(category => {
    if(category.budget_id === budget.id) {
      category.budget_id = null;
    }
    return category;
  });
  dispatch({
    type: READ_CATEGORIES,
    payload: categories
  });
  fetch(apiUrl + '/budgets/' + budget.id, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(data => dispatch({
      type: DELETE_BUDGET,
      payload: budget
    }));
}

export const createBudget = (budget, optional_category) => (dispatch) => {
  fetch(apiUrl + '/budgets', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"budget": budget})
  })
    .then(result => result.json())
    .then(data => {
      if(optional_category) {
        dispatch(updateCategory({
          id: optional_category,
          budget_id: data.data.id
        }));
      }
      dispatch({
        type: CREATE_BUDGET,
        payload: data.data
      });
    });
}