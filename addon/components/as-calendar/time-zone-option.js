import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  description: oneWay('option.description'),
  option: null,
  selectedOption: null,

  isSelected: computed(
    'selectedOption.value',
    'option.value', function() {
      return this.get('selectedOption.value') === this.get('option.value');
  }),

  _selectOption: on('click', function() {
    this.attrs.onSelect(this.get('option.value'));
  })
});
