import { CREATE_CATEGORY, READ_CATEGORIES, UPDATE_CATEGORY, DELETE_CATEGORY, READ_TRANSACTIONS } from "./types"
import { apiUrl } from "../store"
import store from "../store"
import { updateTransaction } from "./transactionActions"

export const readCategories = () => (dispatch) => {
  fetch(apiUrl + '/categories')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_CATEGORIES,
      payload: data.data
    }));
}

export const updateCategory = (category) => (dispatch) => {
  fetch(apiUrl + '/categories/' + category.id, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"category": category})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: UPDATE_CATEGORY,
      payload: data.data
    }));
}

export const deleteCategory = (category) => (dispatch) => {
  const transactions = store.getState().transactions.map(transaction => {
    if(transaction.category_id === category.id) {
      transaction.category_id = null;
    }
    return transaction;
  });
  dispatch({
    type: READ_TRANSACTIONS,
    payload: transactions
  });
  fetch(apiUrl + '/categories/' + category.id, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(data => dispatch({
      type: DELETE_CATEGORY,
      payload: category
    }));
}

export const createCategory = (category, optional_transaction) => (dispatch) => {
  fetch(apiUrl + '/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"category": category})
  })
    .then(result => result.json())
    .then(data => {
      if(optional_transaction) {
        dispatch(updateTransaction({
          id: optional_transaction,
          category_id: data.data.id
        }));
      }
      dispatch({
        type: CREATE_CATEGORY,
        payload: data.data
      });
    });
}