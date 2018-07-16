import { CREATE_TRANSACTION, READ_TRANSACTIONS } from "../actions/types"

export const readTransactions = () => (dispatch) => {
  fetch('http://localhost:4000/api/v1/transactions')
    .then(result => result.json())
    .then(data => dispatch({
      type: READ_TRANSACTIONS,
      payload: data.data
    }));
}