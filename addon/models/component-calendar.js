import { A } from '@ember/array';
import { computed } from '@ember/object';
import { oneWay, readOnly } from '@ember/object/computed';
import computedMoment from 'ember-calendar/macros/computed-moment';
import computedDuration from 'ember-calendar/macros/computed-duration';
import Calendar from './calendar';
import OccurrenceProxy from './occurrence-proxy';

export default Calendar.extend({
  component: null,
  timeZone: oneWay('component.timeZone'),
  startFromDate: readOnly('component.startFromDate'),
  startingTime: computedMoment('component.startingDate'),
  dayStartingTime: computedDuration('component.dayStartingTime'),
  dayEndingTime: computedDuration('component.dayEndingTime'),
  timeSlotDuration: computedDuration('component.timeSlotDuration'),

  defaultOccurrenceTitle: oneWay(
    'component.defaultOccurrenceTitle'
  ),

  defaultOccurrenceDuration: computedDuration(
    'component.defaultOccurrenceDuration'
  ),

  occurrences: computed('component.occurrences.[]', function() {
    let newOccurences = A();

    this.get('component.occurrences').forEach((occurrence) => {
      newOccurences.pushObject(OccurrenceProxy.create({ calendar: this, content: occurrence }));
    });

    return newOccurences;
  })
});
