export default {
  state: {
    direction: 'forward',
  },
  mutations: {
    updateDirection(state, direction) {
      state.direction = direction;
    },
  },
  actions: {
    changeDirection(context, direction) {
      context.commit('updateDirection', direction);
    },
  },
};
