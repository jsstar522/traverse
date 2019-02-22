import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    update,
    delete: _delete
};

// login Request
// dispatch를 파라미터로 하는 thunk를 return
// 컴포넌트에서는 dispatch(login(email, password))를
// 실행하면 미들웨어가 thunk를 처리
function login(email, password) {
  return dispatch => {
    dispatch(request(email));

    userService.login(email, password)
      .then(
        user => {
          dispatch(success(user));
          history.push('/');
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(email) { return { type: userConstants.LOGIN_REQUEST, payload: email } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, payload: user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, payload: error } }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    userService.register(user)
      .then(
        user => {
          dispatch(success(user));
          history.push('/login');
          dispatch(alertActions.success('Registration successful'));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(user) { return { type: userConstants.REGISTER_REQUEST, payload: user } }
  function success(user) { return { type: userConstants.REGISTER_SUCCESS, payload: user } }
  function failure(error) { return { type: userConstants.REGISTER_FAILURE, payload: error } }
}

function getAll() {
    return dispatch => {
      dispatch(request());

      userService.getAll()
        .then(
          users => dispatch(success(users)),
          error => dispatch(failure(error.toString()))
        );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, payload: users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, payload: error } }
  }
  
function update(id) {
  return dispatch => {
    dispatch(request(id));
    
    userService.update(id)
    .then(
      user => {
        dispatch(success(user));
        dispatch(alertActions.success('UserUpdate successful'));
      },
      error => {
        dispatch(failure(id));
        dispatch(alertActions.error(error.toString()));
      }
    )
  }
  function request(id) { return { type: userConstants.UPDATE_REQUEST, payload: id } }
  function success(user) { return { type: userConstants.UPDATE_SUCCESS, payload: user } }
  function failure(id) { return { type: userConstants.UPDATE_FAILURE, payload: id } }
}
    
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
      dispatch(request(id));

      userService.delete(id)
        .then(
          user => dispatch(success(user)),
          error => dispatch(failure(id, error.toString()))
        );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, payload: id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, payload: id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, payload: { id, error } } }
}