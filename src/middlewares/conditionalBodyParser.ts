import bodyParser from 'body-parser';
import express from 'express';

import { mainUrlForStripeWebhookEvent, subUrlForStripeWebhookEvent } from '@config/constants';

const rawBodyParser = bodyParser.raw({ type: 'application/json' });

/**
 * Middleware that conditionally parses the request body based on the endpoint.
 *
 * - For the Stripe webhook endpoint (`/${mainUrlForStripeWebhookEvent}/${subUrlForStripeWebhookEvent}`),
 *   use `bodyParser.raw` to ensure the raw request body is available for Stripe's `constructEvent` method.
 *   Stripe requires the raw body to verify signatures correctly.
 *   Reference: https://github.com/stripe/stripe-node?tab=readme-ov-file#webhook-signing
 * - For other endpoints, use `express.json()` to parse JSON request bodies as usual.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const conditionalBodyParser = (req, res, next) => {
  const stripeWebhookEndpoint = `/${mainUrlForStripeWebhookEvent}/${subUrlForStripeWebhookEvent}`;
  if (req.path === stripeWebhookEndpoint) {
    rawBodyParser(req, res, next);
  } else {
    express.json()(req, res, next);
  }
};

export default conditionalBodyParser;
