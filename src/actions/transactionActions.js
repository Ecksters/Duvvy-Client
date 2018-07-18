import { CREATE_TRANSACTION, CREATE_TRANSACTIONS, READ_TRANSACTIONS, UPDATE_TRANSACTION, DELETE_TRANSACTION, CREATE_CATEGORIES } from "./types"
import { apiUrl } from "../store"
import store from "../store"

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

export const createTransactionsAndCategories = (transactions, categories) => (dispatch) => {
  fetch(apiUrl + '/categories', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({"categories": categories})
  })
    .then(result => result.json())
    .then(data => {
      const allCategories = store.getState().categories.concat(data.data);
      const updatedTransactions = transactions.map((transaction) => {
        let preparedTransaction = {}
        if(transaction.category) {
          preparedTransaction.category_id = allCategories.find((category) => category.title === transaction.category).id
        }
        preparedTransaction = {...preparedTransaction,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date};
        return preparedTransaction;
      });
      dispatch(createTransactions(updatedTransactions));
      dispatch({
        type: CREATE_CATEGORIES,
        payload: data.data
      });
    });
}