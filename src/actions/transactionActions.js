import { CREATE_TRANSACTION, CREATE_TRANSACTIONS, READ_TRANSACTIONS, UPDATE_TRANSACTION, DELETE_TRANSACTION } from "./types"
import { apiUrl } from "../store"

export const readTransactions = () => (dispatch) => {
  fetch(apiUrl + '/transactions')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_TRANSACTIONS,
      payload: data.data
    }));
}

export const updateTransaction = (transaction) => (dispatch) => {
  fetch(apiUrl + '/transactions/' + transaction.id, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"transaction": transaction})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: UPDATE_TRANSACTION,
      payload: data.data
    }));
}

export const deleteTransaction = (transaction) => (dispatch) => {
  fetch(apiUrl + '/transactions/' + transaction.id, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(data => dispatch({
      type: DELETE_TRANSACTION,
      payload: transaction
    }));
}

export const createTransaction = (transaction) => (dispatch) => {
  fetch(apiUrl + '/transactions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"transaction": transaction})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: CREATE_TRANSACTION,
      payload: data.data
    }));
}

export const createTransactions = (transactions) => (dispatch) => {
  fetch(apiUrl + '/transactions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"transactions": transactions})
  })
    .then(result => result.json())
    .then(data => dispatch({
      type: CREATE_TRANSACTIONS,
      payload: data.data
    }));
}