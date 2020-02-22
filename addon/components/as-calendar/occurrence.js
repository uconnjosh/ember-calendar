import { on } from '@ember/object/evented';
import { htmlSafe } from '@ember/template';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import computedDuration from 'ember-calendar/macros/computed-duration';
import moment from 'moment';

export default Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'article',

  model: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  title: oneWay('model.title'),
  content: oneWay('model.content'),
  day: oneWay('model.day'),
  computedTimeSlotDuration: computedDuration('timeSlotDuration'),

  titleStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`line-height: ${this.get('timeSlotHeight')}px;`);
  }),

  _duration: oneWay('model.duration'),
  _startingTime: computed('model.startingTime', function() {
    let time = get(this, 'model.startingTime');
    let zone = get(this, 'model.calendar.timeZone');

    return moment(time).tz(zone);
  }),

  _dayStartingTime: oneWay('day.startingTime'),

  _occupiedTimeSlots: computed(
    '_duration',
    'computedTimeSlotDuration', function() {
      return this.get('_duration').as('ms') /
             this.get('computedTimeSlotDuration').as('ms');
  }),

  _height: computed('_occupiedTimeSlots', function() {
    return this.get('timeSlotHeight') * this.get('_occupiedTimeSlots');
  }),

  _top: computed(
    '_startingTime',
    '_dayStartingTime',
    'computedTimeSlotDuration',
    'timeSlotHeight', function() {
    return ((this.get('_startingTime').diff(this.get('_dayStartingTime')) % (24*3600000)) /
            this.get('computedTimeSlotDuration').as('ms')) *
            this.get('timeSlotHeight');
  }),

  _style: computed('_height', '_top', function() {
    return htmlSafe(`top: ${this.get('_top')}px;
            height: ${this.get('_height')}px;`);
  }),

  _stopPropagation: on('click', function(event) {
    event.stopPropagation();
  }),
});
