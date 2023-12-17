import { jwtFetch } from '../utils/jwt';

const RECEIVE_CURRENT_USER = "session/RECEIVE_CURRENT_USER";
const RECEIVE_SESSION_ERRORS = "session/RECEIVE_SESSION_ERRORS";
const CLEAR_SESSION_ERRORS = "session/CLEAR_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "session/RECEIVE_USER_LOGOUT";

// Dispatch receiveCurrentUser when a user logs in.
const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});
  
// Dispatch receiveErrors to show authentication errors on the frontend.
const receiveErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

// Dispatch logoutUser to clear the session user when a user logs out.
const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT
});

// Dispatch clearSessionErrors to clear any session errors.
export const clearSessionErrors = () => ({
  type: CLEAR_SESSION_ERRORS
});

export const signup = user => startSession(user, 'api/users/register');
export const login = user => startSession(user, 'api/users/login');

const startSession = (userInfo, route) => async dispatch => {
  const res = await jwtFetch(route, {
    method: "POST",
    body: JSON.stringify(userInfo)
  })
  let data;

  if (res.ok) {
    data = await res.json()
    localStorage.setItem("jwtToken", data.token)
    dispatch (receiveCurrentUser(data.user))
  } else {
    data = await res.json();
    console.log(data)
    if (data.statusCode === 400) {
      return dispatch(receiveErrors(data.errors))
    }
  }
}

export const logout = () => dispatch => {
  localStorage.removeItem("jwtToken");
  dispatch(logoutUser());
}

export const getCurrentUser = () => async dispatch => {
  const res = await jwtFetch('/api/users/current');
  const user = await res.json();
  return dispatch(receiveCurrentUser(user));
};

const initialState = {
  user: undefined
}

const sessionReducer = (state = initialState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      newState.user = action.currentUser
      return newState
    case RECEIVE_USER_LOGOUT:
      newState.user = null
      return newState
    default:
      return state
  }
}

const nullErrors = null

export const sessionErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_SESSION_ERRORS:
      return action.errors;
    case RECEIVE_CURRENT_USER:
    case CLEAR_SESSION_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

export default sessionReducer;