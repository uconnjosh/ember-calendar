import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

export default EmberObject.extend({
  value: null,

  description: computed('value', function() {
    return `${this.get('_title')}
            (${this.get('_offset')}
            ${this.get('abbreviation')})`;
  }),

  abbreviation: computed('value', function() {
    return moment().tz(this.get('value')).format('z');
  }),

  _title: computed('value', function() {
    return this.get('value').replace('_', ' ');
  }),

  _offset: computed('value', function() {
    return moment().tz(this.get('value')).format('Z');
  })
});
