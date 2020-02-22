import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import Ember from 'ember';
import moment from 'moment';
import computedMoment from 'ember-calendar/macros/computed-moment';
import Day from './day';

var OccurrenceProxy = EmberObject.extend(Ember.Copyable, {
  calendar: null,
  content: null,
  endingTime: computedMoment('content.endsAt'),
  startingTime: computedMoment('content.startsAt'),
  title: oneWay('content.title'),

  duration: computed('startingTime', 'endingTime', function() {
    return moment.duration(
      this.get('endingTime').diff(this.get('startingTime'))
    );
  }),

  day: computed('startingTime', 'calendar', 'calendar.{startingTime,startFromDate}', function() {
    let currentDay = this.get('startingTime');
    let firstDay;

    if (this.get('calendar.startFromDate')) {
      firstDay = this.get('calendar.startingTime');
    } else {
      firstDay = this.get('calendar.startingTime').startOf('isoWeek');
    }

    return Day.create({
      calendar: this.get('calendar'),
      offset: currentDay.dayOfYear() - firstDay.dayOfYear()
    });
  }),

  copy: function() {
    return OccurrenceProxy.create({
      calendar: this.get('calendar'),

      content: EmberObject.create({
        startsAt: this.get('content.startsAt'),
        endsAt: this.get('content.endsAt'),
        title: this.get('content.title')
      })
    });
  }
});

export default OccurrenceProxy;
