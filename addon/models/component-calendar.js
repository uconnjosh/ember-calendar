import { A } from '@ember/array';
import { computed } from '@ember/object';
import { oneWay, readOnly } from '@ember/object/computed';
import Calendar from './calendar';
import OccurrenceProxy from './occurrence-proxy';

export default Calendar.extend({
  component: null,
  timeZone: oneWay('component.timeZone'),
  startFromDate: readOnly('component.startFromDate'),
  startingTime: computed('component.startingDate', {
    get() {
      let startsAt = this.get('component.startingDate')

      if (startsAt) {
        return moment(startsAt)
      }
    },
    set(value) {
      if (value) {
        return this.set('component.startingDate', value.toDate())
      }
    }
  }),
  dayStartingTime: computed('component.dayStartingTime', {
    get() {
      return this.computedDuration(this.get('component.dayStartingTime'))
    }
  }),
  dayEndingTime: computed('component.dayEndingTime', {
    get() {
      return this.computedDuration(this.get('component.dayEndingTime'))
    }
  }),
  timeSlotDuration: computed('component.timeSlotDuration', {
    get() {
      return this.computedDuration(this.get('component.timeSlotDuration'))
    }
  }),

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
  }),
  computedDuration(value) {
    if (!value) {
      return
    }

    return moment.duration(value)
  }
});
