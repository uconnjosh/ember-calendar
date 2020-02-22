import { run } from '@ember/runloop';
import $ from 'jquery';
import { A } from '@ember/array';
import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';
import moment from 'moment';
import testSelector from 'ember-test-selectors';

import {
  timeSlotHeight,
  selectTime,
  resizeOccurrence,
  dragOccurrence,
  selectTimeZone,
  selectNextWeek,
  selectPreviousWeek
} from 'ember-calendar/test-helpers/all';

moduleForComponent('as-calendar', 'AsCalendarComponent', {
  integration: true,

  beforeEach: function() {
    this.set('occurrences', A());

    this.on('calendarAddOccurrence', (occurrence) => {
      this.get('occurrences').pushObject(occurrence);
    });

    this.on('calendarRemoveOccurrence', (occurrence) => {
      this.get('occurrences').removeObject(occurrence);
    });

    this.on('calendarUpdateOccurrence', (occurrence, properties) => {
      occurrence.setProperties(properties);
    });
  }
});

test('Add an occurrence', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  assert.equal($('.as-calendar-occurrence').length, 0, 'it shows an empty calendar');

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1, 'it adds the occurrence to the calendar');
  assert.ok(this.get('occurrences.firstObject').startsAt instanceof Date, 'startsAt is a Date');
  assert.ok(this.get('occurrences.firstObject').endsAt instanceof Date, 'endsAt is a Date');
});

test('Remove an occurrence', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1, 'it adds the occurrence to the calendar');

  run(() => {
    $('.as-calendar-occurrence .as-calendar-occurrence__remove').click();
  });

  assert.equal($('.as-calendar-occurrence').length, 0, 'it removes the occurrence from the calendar');
});


test('Resize an occurrence', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      defaultOccurrenceDuration="00:30"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );

  resizeOccurrence($('.as-calendar-occurrence'), { timeSlots: 2 });

  assert.equal($('.as-calendar-occurrence').height(), timeSlotHeight() * 3,
    'it resizes the occurrence');
});

test('Drag an occurrence', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal(this.$('.as-calendar-occurrence').length, 1, 'it adds the occurrence to the calendar');
  let inMonday = this.$(testSelector('day-id', '0')).find('.as-calendar-occurrence').length === 1;
  assert.ok(inMonday);

  dragOccurrence(this.$('.as-calendar-occurrence'), { days: 2, timeSlots: 4 });

  let inWednesday = this.$(testSelector('day-id', '2')).find('.as-calendar-occurrence').length === 1;
  assert.ok(inWednesday);
});

test('Change time zone', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      timeZone="Europe/London"
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      defaultTimeZoneQuery="Rome"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').position().top, 0,
    'it shows the occurrence in the London time zone');

  selectTimeZone('Rome');

  let tzOffset;

  const romeDst = moment().tz('Europe/Rome').isDST();
  const londonDst = moment().tz('Europe/London').isDST();

  if (romeDst === londonDst) {
    tzOffset = 1;
  } else {
    tzOffset = 2;
  }

  assert.equal($('.as-calendar-occurrence').position().top, timeSlotHeight() * tzOffset,
    'it shows the occurrence in the Rome time zone');
});

test('Change week', function(assert) {

  var weekIndex = 0;

  this.on('navigateWeek', (index) => {
    weekIndex += index;
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      onRemoveOccurrence=(action "calendarRemoveOccurrence")
      onNavigateWeek=(action "navigateWeek")}}
  `);

  selectNextWeek();

  assert.equal(weekIndex, 1, 'it navigates to the next week');

  selectPreviousWeek();

  assert.equal(weekIndex, 0, 'it navigates back to the current week');
});

test('Displays week of specified day', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      startingDate="2017-06-08"}}
  `);

  assert.equal(this.$('.as-calendar-timetable__column-item:first-child').text().trim(), 'Mon 5 Jun');
});

test('Week starts from specified day', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      startingDate="2017-06-08"
      startFromDate=true}}
  `);

  assert.equal(this.$('.as-calendar-timetable__column-item:first-child').text().trim(), 'Thu 8 Jun');
});

test('Week starts from today', function(assert) {
  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      startFromDate=true}}
  `);

  const today = moment().format('ddd D MMM');
  assert.equal(this.$('.as-calendar-timetable__column-item:first-child').text().trim(), today);
});

test('Update function differentiates preview and original object', function(assert) {
  assert.expect(4);

  this.on('calendarUpdateOccurrence', (occurrence, properties, isPreview) => {
    occurrence.setProperties(properties);

    if (isPreview) {
      assert.notDeepEqual(occurrence, this.get('occurrences.firstObject'), 'Passed occurrence not same as original');
    } else {
      assert.deepEqual(occurrence, this.get('occurrences.firstObject'), 'Passed occurrence is same as original');
    }
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence=(action "calendarAddOccurrence")
      onUpdateOccurrence=(action "calendarUpdateOccurrence")
      onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  dragOccurrence(this.$('.as-calendar-occurrence'), { days: 2, timeSlots: 4 });
});
