import { A } from '@ember/array';
import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import _ from 'lodash';
import moment from 'moment';

var Day = EmberObject.extend({
  calendar: null,
  offset: 0,

  value: computed('_week', 'offset', function() {
    return moment(this.get('_week')).add(this.get('offset'), 'day');
  }),

  occurrences: computed(
    'calendar.occurrences.@each.startingTime',
    'startingTime',
    'endingTime', function() {
    return this.get('calendar.occurrences').filter((occurrence) => {
      var startingTime = occurrence.get('startingTime');

      return startingTime.isSameOrAfter(this.get('startingTime')) &&
             startingTime.isSameOrBefore(this.get('endingTime'));
    });
  }),

  occurrencePreview: computed(
    'calendar.occurrencePreview.startingTime',
    'startingTime',
    'endingTime', function() {
    var occurrencePreview = this.get('calendar.occurrencePreview');

    if (occurrencePreview != null) {
      var startingTime = occurrencePreview.get('startingTime');

      if (startingTime >= this.get('startingTime') &&
          startingTime <= this.get('endingTime')) {
        return occurrencePreview;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }),

  startingTime: computed(
    'value',
    '_timeSlots.firstObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: computed(
    'value',
    '_timeSlots.lastObject.endingTime', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.lastObject.endingTime'));
  }),

  isToday: computed('value', function() {
    return this.get('value').isSame(moment(), 'day');
  }),

  _week: oneWay('calendar.week'),
  _timeSlots: oneWay('calendar.timeSlots')
});

Day.reopenClass({
  buildWeek: function(options) {
    return A(_.range(0, 7).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  }
});

export default Day;
