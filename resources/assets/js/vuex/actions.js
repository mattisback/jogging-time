import Vue from 'vue';

const apiPath = '/api/v1/';

/**
 * Set access token for Vue resourse http requests
 *
 * @param access_token
 */
function setHttpAccessToken(access_token) {
  Vue.http.interceptors.push((request, next) => {
    request.headers.set('Authorization', 'Bearer ' + access_token);
    next();
  });
}


/* ========================================================================= *\
 * Simple Actions
\* ========================================================================= */

function makeAction(type) {
  return ({commit}, ...args) => commit(type, ...args)
}

export const clearError = makeAction('CLEAR_ERROR');


/* ========================================================================= *\
 * Auth Actions
\* ========================================================================= */

export const checkLogin = ({commit, dispatch}) => {
  commit('CHECK_LOGIN');

  const access_token = localStorage.getItem('access_token');

  if ( ! access_token) {
    commit('CHECK_LOGIN_FAIL');
    return;
  }

  setHttpAccessToken(access_token);

  return new Promise((resolve, reject) => {
    Vue.http.get(apiPath + 'user/me')
      .then(
        response => {
          commit('CHECK_LOGIN_OK', response.data);
          resolve();
        },
        response => {
          localStorage.removeItem('access_token');
          commit('CHECK_LOGIN_FAIL');
          reject(response.data);
        });
  });
};


export const login = ({commit, dispatch}, form) => {
  commit('LOGIN');

  return new Promise((resolve, reject) => {
    Vue.http.post(apiPath + 'auth/login', form)
      .then(
        response => {
          const access_token = response.data.access_token;
          localStorage.setItem('access_token', access_token);
          setHttpAccessToken(access_token);

          commit('LOGIN_OK', response.data.user);
          resolve();
        },
        response => {
          commit('LOGIN_FAIL');
          reject(response.data);
        });
  })
};


export const logout = ({commit, dispatch}) => {
  commit('LOGOUT_OK');

  localStorage.removeItem('access_token');
};


export const register = ({commit, dispatch}, form) => {
  commit('REGISTER');

  return new Promise((resolve, reject) => {
    Vue.http.post(apiPath + 'auth/register', form)
      .then(
        response => {
          const access_token = response.data.access_token;
          localStorage.setItem('access_token', access_token);
          setHttpAccessToken(access_token);

          commit('REGISTER_OK', response.data.user);
          resolve();
        },
        response => {
          commit('REGISTER_FAIL');
          reject(response.data);
        });
  })
};


/* ========================================================================= *\
 * Entries
\* ========================================================================= */

export const loadEntries = ({commit, dispatch}, page) => {
  commit('LOAD_ENTRIES');

  return new Promise((resolve, reject) => {
    Vue.http.get(apiPath + 'entry', {page})
      .then(
        response => {
          commit('LOAD_ENTRIES_OK', response.data.entries);
          resolve();
        },
          response => {
          commit('LOAD_ENTRIES_FAIL');
          reject(response.data);
        });
  })
};

export const storeEntry = ({commit, dispatch}, form) => {
  commit('STORE_ENTRY');

  return new Promise((resolve, reject) => {
    Vue.http.post(apiPath + 'entry', form)
      .then(
        response => {
          commit('STORE_ENTRY_OK', response.data.entry);
          resolve();
        },
        response => {
          commit('STORE_ENTRY_FAIL');
          reject(response.data);
        });
  })
};

export const deleteEntry = ({commit, dispatch}, id) => {
  commit('DELETE_ENTRY');

  return new Promise((resolve, reject) => {
    Vue.http.post(apiPath + 'entry/' + id, {_method: 'DELETE'})
      .then(
        response => {
          commit('DELETE_ENTRY_OK', id);
          resolve();
        },
        response => {
          commit('DELETE_ENTRY_FAIL');
          reject(response.data);
        });
  })
};