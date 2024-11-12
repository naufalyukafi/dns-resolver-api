import { faker } from '@faker-js/faker';
import moment from 'moment';

const generateEndDate = (startDate) => {
  const startDateMoment = moment(startDate);
  const daysToAdd = faker.number.int({ min: 1, max: 365 * 4 });
  const endDateMoment = startDateMoment.add(daysToAdd, 'days');
  return endDateMoment.format('YYYY-MM-DD');
};

export const seedStartDate = moment(faker.date.past({ years: 5, refDate: '2020-01-01' })).format('YYYY-MM-DD');
export const seedEndDate = generateEndDate(seedStartDate);
