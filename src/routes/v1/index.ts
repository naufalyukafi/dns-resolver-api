import config from '@config/config';
import express from 'express';

import docsRoute from './docs.route';
import domainRoute from './domain.route'

const router = express.Router();

const defaultRoutes = [
  {
    path: '/domains',
    route: domainRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
