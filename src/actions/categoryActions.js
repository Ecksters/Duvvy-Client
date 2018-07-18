import { CREATE_CATEGORY, READ_CATEGORIES } from "./types"
import { apiUrl } from "../store"
import { updateTransaction } from "./transactionActions"

export const readCategories = () => (dispatch) => {
  fetch(apiUrl + '/categories')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_CATEGORIES,
      payload: data.data
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