import { CREATE_CATEGORY, CREATE_CATEGORIES, READ_CATEGORIES } from "../actions/types"

const initialState = {
    categories: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_CATEGORIES:
          return action.payload;
        case CREATE_CATEGORY:
        case CREATE_CATEGORIES:
          return state.concat(action.payload);
        default:
          return state;
    }
}