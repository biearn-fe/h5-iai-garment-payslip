export default {
  state: {
    userInfo: null,
  },
  mutations: {
    updateUser: (state, user) => {
      state.userInfo = user;
    },
  },
  actions: {
    changeUser(context, user) {
      context.commit('updateUser', user);
    },
  },
};
