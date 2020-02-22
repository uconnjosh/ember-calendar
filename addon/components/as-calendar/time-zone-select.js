import { debounce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';
import TimeZoneOption from 'ember-calendar/models/time-zone-option';

export default Component.extend({
  classNameBindings: [':as-calendar-time-zone-select', 'showResults:open'],
  tagName: 'section',

  defaultQuery: '',
  showResults: false,
  inputQuery: '',
  query: '',
  value: null,
  options: null,
  showSearch: true,

  selectedOptionAbbreviation: oneWay(
    'selectedOption.abbreviation'
  ),

  arrangedOptions: computed(
    '_options.@each.{description,value}',
    'selectedOption.value',
    'showSearch',
    '_query', function() {
    if (this.get('showSearch')) {
      let regexp = new RegExp(this.get('_query'), 'i');

      return this.get('_options').filter((option) => {
        return option.get('description').match(regexp) ||
               option.get('value') === this.get('selectedOption.value');
      });
    } else {
      return this.get('_options');
    }
  }),

  selectedOption: computed('value', function() {
    let value = this.get('value');

    if (value) {
      return TimeZoneOption.create({ value: value });
    }
  }),

  _query: computed('query', 'defaultQuery', function() {
    let query = this.get('query');

    if (isEmpty(query)) {
       return this.get('defaultQuery');
    } else {
      return query;
    }
  }),

  _options: computed('options', function() {
    if (isPresent(this.get('options'))) {
      return this.get('options');
    } else {
      return moment.tz.names().map(function(timeZoneName) {
        return TimeZoneOption.create({ value: timeZoneName });
      });
    }
  }),

  _setQuery: function (value) {
    this.set('query', value);
  },

  actions: {
    inputQueryChanged: function(value) {
      debounce(this, this._setQuery, value, 200);
    }
  }
});
