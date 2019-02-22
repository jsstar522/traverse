import { createAction, handleActions } from 'redux-actions';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';
import { Map } from 'immutable';

// action type
const REGISTER = 'user/USERS_REGISTER';
const LOGIN = 'user/USERS_LOGIN';
const LOGOUT = 'user/USERS_LOGOUT';
const GETALL = 'user/USERS_GETALL';
const UPDATE = 'user/USERS_UPDATE';
const DELETE = 'user/USERS_DELETE';

// action creator
export const register = createAction(REGISTER);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
export const getAll = createAction(GETALL);
export const update = createAction(UPDATE);
export const delete = createAction(DELETE);

// initial State
const initialState = Map({
  loggedIn: false,
  // 이후 추가
});

//reducer
export default handleActions({
  [REGISTER] : (state, action) => state.set('', ),
  [LOGIN] : (state, action) => state.set('loggedIn', true),
  [LOGOUT] : (state, action) => state.set('loggedIn', false),
})
