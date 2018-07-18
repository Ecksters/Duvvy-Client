import { CREATE_CATEGORY, CREATE_CATEGORIES, READ_CATEGORIES, UPDATE_CATEGORY, DELETE_CATEGORY } from "../actions/types"

const initialState = {
    categories: []
};

const updateCategory = (updated) => (category) => {
  return category.id === updated.id ? updated : category;
};

export default function(state = initialState, action) {
    switch(action.type) {
        case READ_CATEGORIES:
          return action.payload;
        case CREATE_CATEGORY:
        case CREATE_CATEGORIES:
          return state.concat(action.payload);
        case UPDATE_CATEGORY:
          return state.map(updateCategory(action.payload));
        case DELETE_CATEGORY:
          return state.filter((category) => category.id !== action.payload.id);
        default:
          return state;
    }
}