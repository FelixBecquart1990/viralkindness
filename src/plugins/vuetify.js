import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#43809F', 
        secondary: '#F0AA57', 
        tertiary: '#FFEECF', 
        accent: '#82B1FF',
        error: '#FF7B79',
        info: '#FE5C94',
        success: '#00D07C',
        warning: '#FFCC00'
      },
    },
  },
});
