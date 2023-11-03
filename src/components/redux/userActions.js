// Action types
export const SET_USER = 'SET_USER';
export const SET_LOADING = 'SET_LOADING';
export const SET_HAS_KIDS = 'SET_HAS_KIDS';
export const SET_KIDS_LIST = 'SET_KIDS_LIST';
export const SET_MEMORY_LIST = 'SET_MEMORY_LIST';

// Action creators
export const setUser = (userData) => ({
  type: SET_USER,
  payload: userData
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

export const setHasKids = (hasKids) => ({
  type: SET_HAS_KIDS,
  payload: hasKids
});

export const setKidsList = (kids) => ({
  type: SET_KIDS_LIST,
  payload: kids
});

export const setMemoryList = (kidId, memories) => ({
  type: SET_MEMORY_LIST,
  payload: { kidId, memories }
});
