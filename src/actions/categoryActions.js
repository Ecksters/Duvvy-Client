import { CREATE_CATEGORY, CREATE_CATEGORIES, READ_CATEGORIES } from "./types"
import { apiUrl } from "../store"

export const readCategories = () => (dispatch) => {
  fetch(apiUrl + '/categories')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_CATEGORIES,
      payload: data.data
    }));
}

export const createCategory = (category) => (dispatch) => {
  fetch(apiUrl + '/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"category": category})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: CREATE_CATEGORY,
      payload: data.data
    }));
}

export const createCategories = (categories) => (dispatch) => {
  fetch(apiUrl + '/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"categories": categories})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: CREATE_CATEGORIES,
      payload: data.data
    }));
}