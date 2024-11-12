import logger from '@config/logger';
import domainService from '@services/domain.service';
import { CronJob } from 'cron';

const job = new CronJob('0 0 * * *', async () => {
  try {
    await domainService.checkAndUpdateDomainRecords();
    logger.info('Cron job: Domain records updated successfully.');
  } catch (error) {
    logger.error('Error while checking and updating domain records: ', error);
  }
}, null, true, 'Asia/Jakarta');

export default function startCheckAndUpdateCronJob() {
  logger.info('Cron job: check and update domain records is started');
  job.start();
}
