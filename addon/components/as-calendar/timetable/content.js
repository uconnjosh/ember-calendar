import { on } from '@ember/object/evented';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable-content'],
  attributeBindings: ['_style:style'],

  days: oneWay('model.days'),
  model: null,
  timeSlotDuration: oneWay('model.timeSlotDuration'),
  timeSlots: oneWay('model.timeSlots'),
  timetable: null,

  timeSlotStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${this.get('timeSlotHeight')}px`);
  }),

  dayWidth: computed(function() {
    if (this.get('_wasInserted')) {
      return this.$().width() / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _wasInserted: false,

  _style: computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return htmlSafe(`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`);
  }),

  _setWasInserted: on('didInsertElement', function() {
    this.set('_wasInserted', true);
  }),

  _registerWithParent: on('init', function() {
    this.set('timetable.contentComponent', this);
  }),

  _selectTime: on('click', function(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);

    var dayIndex = Math.floor(offsetX / this.get('dayWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days').objectAt(dayIndex);

    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.attrs.onSelectTime(
      moment(day.get('value')).add(timeSlot.get('time'))
    );
  })
});
