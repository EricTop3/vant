import Calendar from '..';
import { mount, later } from '../../../test';
import { minDate, maxDate, formatRange } from './utils';

test('max-range prop when showConfirm is false', async () => {
  const wrapper = mount(Calendar, {
    propsData: {
      type: 'range',
      minDate,
      maxDate,
      maxRange: 3,
      poppable: false,
      showConfirm: false,
    },
  });

  await later();

  const days = wrapper.findAll('.van-calendar__day');
  days.at(12).trigger('click');
  days.at(18).trigger('click');

  expect(formatRange(wrapper.emitted('select')[0][0])).toEqual('2010/1/13-');
  expect(formatRange(wrapper.emitted('select')[1][0])).toEqual(
    '2010/1/13-2010/1/19'
  );
  expect(wrapper.emitted('confirm')).toBeFalsy();
});

test('max-range prop when showConfirm is true', async () => {
  const wrapper = mount(Calendar, {
    propsData: {
      type: 'range',
      minDate,
      maxDate,
      maxRange: 3,
      poppable: false,
    },
  });

  await later();

  const days = wrapper.findAll('.van-calendar__day');
  days.at(12).trigger('click');
  days.at(18).trigger('click');

  expect(formatRange(wrapper.emitted('select')[0][0])).toEqual('2010/1/13-');
  expect(formatRange(wrapper.emitted('select')[1][0])).toEqual(
    '2010/1/13-2010/1/15'
  );
  expect(wrapper.emitted('confirm')).toBeFalsy();
});

test('show-title prop', () => {
  const wrapper = mount(Calendar, {
    propsData: {
      value: true,
    },
  });

  expect(wrapper.contains('.van-calendar__header-title')).toBeTruthy();
  wrapper.setProps({ showTitle: false });
  expect(wrapper.contains('.van-calendar__header-title')).toBeFalsy();
});

test('show-subtitle prop', () => {
  const wrapper = mount(Calendar, {
    propsData: {
      value: true,
    },
  });

  expect(wrapper.contains('.van-calendar__header-subtitle')).toBeTruthy();
  wrapper.setProps({ showSubtitle: false });
  expect(wrapper.contains('.van-calendar__header-subtitle')).toBeFalsy();
});

test('hide close icon when there is no title', () => {
  const wrapper = mount(Calendar, {
    propsData: {
      value: true,
    },
  });

  expect(wrapper.contains('.van-popup__close-icon')).toBeTruthy();

  wrapper.setProps({
    showTitle: false,
    showSubtitle: false,
  });
  expect(wrapper.contains('.van-popup__close-icon')).toBeFalsy();
});

test('allow-same-day prop', async () => {
  const select = jest.fn();
  const wrapper = mount(Calendar, {
    propsData: {
      type: 'range',
      minDate,
      maxDate,
      poppable: false,
    },
    listeners: {
      select,
    },
  });

  await later();

  const days = wrapper.findAll('.van-calendar__day');
  days.at(9).trigger('click');
  days.at(9).trigger('click');

  expect(select).toHaveBeenLastCalledWith([minDate, null]);

  wrapper.setProps({
    allowSameDay: true,
  });

  days.at(9).trigger('click');
  expect(select).toHaveBeenLastCalledWith([minDate, minDate]);
});
