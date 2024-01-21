const express=require("express");
const {saveParticipationByChefPupitre,updateChoristeDetails} = require("../controllers/Chef_pupitre.js");



const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Chefpupitre
 *   description: Chef pupitre management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Participation:
 *       type: object
 *       properties:
 *         presence:
 *           type: boolean
 *           default: false
 *         raison:
 *           type: string
 *         theme:
 *           type: string
 *           enum: ['Concert', 'Repetition']
 *         concert:
 *           type: string
 *           description: ID of the concert
 *         repetition:
 *           type: string
 *           description: ID of the repetition
 *         choriste:
 *           type: string
 *           description: ID of the choriste
 */
router.post("/AddParticipation",saveParticipationByChefPupitre);
/**
 * @swagger
 * paths:
 *   /Chefpupitre/AddParticipation:
 *     post:
 *       summary: Add Participation
 *       tags:
 *         - Chefpupitre
 *       requestBody:
 *         description: Participation data to add
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participation'
 *       responses:
 *         '201':
 *           description: Participation saved successfully.
 *         '400':
 *           description: Bad Request. Provide either concertId or repetitionId.
 *         '404':
 *           description: Choriste not found or Invalid choristeId.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Participation:
 *       type: object
 *       properties:
 *         concertId:
 *           type: string
 *           format: uuid
 *           description: ID of the concert.
 *         repetitionId:
 *           type: string
 *           format: uuid
 *           description: ID of the repetition.
 *         choristeId:
 *           type: string
 *           format: uuid
 *           description: ID of the choriste.
 *         presence:
 *           type: boolean
 *           description: Indicates if the choriste is present.
 *         raison:
 *           type: string
 *           description: Reason for absence if the choriste is not present.
 *       example:
 *         concertId: "60f8420e314b7d002396f5a3"
 *         repetitionId: "60f8420e314b7d002396f5a4"
 *         choristeId: "60f8420e314b7d002396f5a5"
 *         presence: true
 *         raison: "Family emergency"
 */

router.patch("/UpdateChoriste/:id",updateChoristeDetails);
/**
 * @swagger
 * /Chefpupitre/UpdateChoriste/{id}:
 *   patch:
 *     summary: Update Choriste Details
 *     tags:
 *       - Chefpupitre
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the choriste to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Choriste details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChoristeUpdate'
 *           example:
 *             statut:junior
 *     responses:
 *       '200':
 *         description: Choriste details updated successfully.
 *       '404':
 *         description: Choriste not found or No choristes found.
 *       '500':
 *         description: Internal Server Error
 */

module.exports= router;