import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: oneWay('model.isInCurrentWeek'),
  model: null,
  title: '',

  actions: {
    navigateWeek: function(index) {
      this.get('model').navigateWeek(index);

      if (this.attrs['onNavigateWeek']) {
        this.attrs['onNavigateWeek'](index);
      }
    },

    goToCurrentWeek: function() {
      this.get('model').goToCurrentWeek();
    }
  }
});
