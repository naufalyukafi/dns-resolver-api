import domainController from '@app/controllers/domain.controller';
import express from 'express';

const router = express.Router();
router.route('/')
  .get(domainController.getDomains)
  .post(domainController.checkDomain);

router.get('/manual-update', domainController.runManualDomainUpdate);

export default router;

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: Manage domains and their DNS records, including SPF, DKIM, and DMARC validation.
 */

/**
 * @swagger
 * /domains:
 *   get:
 *     summary: Get all domains with DNS records
 *     description: Retrieve a list of all domains with their SPF, DKIM, and DMARC records. You can filter domains by `name`, `spfValid`, `dkimValid`, and `dmarcValid`.
 *     tags: [Domains]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *         description: The number of results per page.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by domain name.
 *       - in: query
 *         name: spfValid
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by SPF validity (true or false).
 *       - in: query
 *         name: dkimValid
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by DKIM validity (true or false).
 *       - in: query
 *         name: dmarcValid
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by DMARC validity (true or false).
 *     responses:
 *       "200":
 *         description: A list of domains with their SPF, DKIM, and DMARC records, filtered based on the provided query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "vconsultingnow.com"
 *                       spf:
 *                         type: object
 *                         properties:
 *                           valid:
 *                             type: boolean
 *                             example: true
 *                           record:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["v=spf1 include:_spf.google.com ~all"]
 *                       dkim:
 *                         type: object
 *                         properties:
 *                           valid:
 *                             type: boolean
 *                             example: false
 *                           record:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: null
 *                       dmarc:
 *                         type: object
 *                         properties:
 *                           valid:
 *                             type: boolean
 *                             example: true
 *                           record:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["v=DMARC1; p=reject"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-12T18:32:31.207Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-12T18:32:31.207Z"
 *                       id:
 *                         type: string
 *                         example: "67339f3efc03fbb22dd48c0a"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 5
 *                 totalPages:
 *                   type: integer
 *                   example: 200
 *                 totalResults:
 *                   type: integer
 *                   example: 998
 *       "401":
 *         description: Unauthorized access
 *       "403":
 *         description: Forbidden
 *       "500":
 *         description: Internal server error
 */

/**
 * Example response:
 * {
 *   "results": [
 *     {
 *       "spf": {
 *         "valid": true,
 *         "record": [
 *           "v=spf1 include:_spf.google.com ~all"
 *         ]
 *       },
 *       "dkim": {
 *         "valid": false,
 *         "record": null
 *       },
 *       "dmarc": {
 *         "valid": true,
 *         "record": [
 *           "v=DMARC1; p=reject"
 *         ]
 *       },
 *       "name": "vconsultingnow.com",
 *       "createdAt": "2024-11-12T18:32:31.207Z",
 *       "updatedAt": "2024-11-12T18:32:31.207Z",
 *       "id": "67339f3efc03fbb22dd48c0a"
 *     },
 *     {
 *       "spf": {
 *         "valid": true,
 *         "record": [
 *           "v=spf1 include:_spf.google.com ~all"
 *         ]
 *       },
 *       "dkim": {
 *         "valid": false,
 *         "record": null
 *       },
 *       "dmarc": {
 *         "valid": true,
 *         "record": [
 *           "v=DMARC1; p=reject"
 *         ]
 *       },
 *       "name": "trycnvrtcro.com",
 *       "createdAt": "2024-11-12T18:32:31.295Z",
 *       "updatedAt": "2024-11-12T18:32:31.295Z",
 *       "id": "67339f3efc03fbb22dd48c59"
 *     }
 *   ],
 *   "page": 1,
 *   "limit": 5,
 *   "totalPages": 200,
 *   "totalResults": 998
 * }
 */


/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: Manage domains and their DNS records, including SPF, DKIM, and DMARC validation.
 */

/**
 * @swagger
 * /domains/manual-update:
 *   get:
 *     summary: Manual Update Domain
 *     description: Send data to database.
 *     tags: [Domains]
 *
 */
