const express = require("express");
const {
    addChoristeResponse,
    sendMailConfirmation,
    ChoristesThatConfirmed,
    
} = require("../controllers/Choriste.js");
/**
 * @swagger
 * tags:
 *   name: Choriste
 *   description: Choriste management API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ChoristeResponse:
 *       type: object
 *       properties:
 *         choristeId:
 *           type: string
 *           description: ID of the choriste
 *         concertId:
 *           type: string
 *           description: ID of the concert
 *         confirmation:
 *           type: string
 *           description: Confirmation status ('confirm' or 'not_confirm')
 *         additionalData:
 *           type: object
 *           description: Additional data related to the choriste response

 */

const router = express.Router();
router.post('/addChoristeResponse', addChoristeResponse)
/**
 * @swagger
 * /Choriste/addChoristeResponse:
 *   post:
 *     summary: Add Choriste Response
 *     tags:
 *       - Choriste
 *     requestBody:
 *       description: Choriste response data to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChoristeResponse'
 *     responses:
 *       '201':
 *         description: Choriste response added successfully.
 *       '400':
 *         description: Bad Request. Provide valid choristeId and concertId.
 *       '404':
 *         description: Invalid choriste or concert ID.
 *       '500':
 *         description: Internal Server Error
 */

router.get('/sendMailConfirmation', sendMailConfirmation)
/**
 * @swagger
 * /Choriste/sendMailConfirmation:
 *   get:
 *     summary: Send Mail Confirmation
 *     tags:
 *       - Choriste
 *     responses:
 *       '200':
 *         description: Choristes fetched successfully.
 *       '500':
 *         description: Internal Server Error
 */

router.get('/ChoristesThatConfirmed', ChoristesThatConfirmed)
/**
 * @swagger
 * /Choriste/ChoristesThatConfirmed:
 *   get:
 *     summary: Get Choristes that confirmed
 *     tags:
 *       - Choriste
 *     responses:
 *       '200':
 *         description: Choristes fetched successfully.
 *       '500':
 *         description: Internal Server Error
 */


module.exports = router;