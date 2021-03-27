export default {
    state: {
      url: null,
    },
    mutations: {
      updateUrl: (state, url) => {
        state.url = url;
      },
    },
    actions: {
      changeUrl(context, url) {
        context.commit('updateUrl', url);
      },
    },
  };
  