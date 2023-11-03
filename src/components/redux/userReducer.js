import { 
  SET_USER, 
  SET_LOADING, 
  SET_HAS_KIDS, 
  SET_KIDS_LIST, 
  SET_MEMORY_LIST 
} from './userActions';

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  hasKids: false,
  kidsList: [],
  memoryList: [],
  selectedKid: null  // Initial state of selectedKid
};

// Reducer
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { 
        ...state, 
        user: action.payload  // Simply set the user to the payload
      };

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case SET_HAS_KIDS:
      return { ...state, hasKids: action.payload };

    case SET_KIDS_LIST:
      return { ...state, kidsList: action.payload };

    case SET_MEMORY_LIST:
      return {
        ...state,
        memoryList: {
          ...state.memoryList,
          [action.payload.kidId]: action.payload.memories  // Update the memory list for a specific kidId
        }
      };

    default:
      return state;
  }
};

export default userReducer;
