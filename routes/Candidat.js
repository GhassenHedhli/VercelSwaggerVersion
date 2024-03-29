const express = require("express");
const {
  AddCandidat,
  GetUser,
  saveAndSendMailAudition,
  showAllAuditions,
  sendMailAbscent,
} = require("../controllers/Candidat.js");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Candidats
 *   description: API for managing Candidats
 */
router.post("/AddCandidat", AddCandidat);

router.get("/getCandidat", GetUser);
/**
 * @swagger
 * paths:
 *   /candidates/getCandidat:
 *     get:
 *       summary: Get Candidat information with optional filtering
 *       tags: [Candidats]
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *           description: "Page number for pagination (default: 1)"
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: "Number of items to return per page (default: 10)"
 *         - in: query
 *           name: firstname
 *           schema:
 *             type: string
 *           description: Filter by first name
 *         - in: query
 *           name: lastname
 *           schema:
 *             type: string
 *           description: Filter by last name
 *       responses:
 *         200:
 *           description: List of Candidats
 *           content:
 *             application/json:
 *               example:
 *                 candidates: [...]
 *                 currentPage: 1
 *         500:
 *           description: Internal Server Error
 */
router.post("/saveandsendmail", saveAndSendMailAudition);
/**
 * @swagger
 * paths:
 *   /candidates/saveandsendmail:
 *     post:
 *       summary: Schedule and send audition emails for candidates
 *       tags: [Candidats]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Audition'
 *       responses:
 *         201:
 *           description: Auditions and candidate associations created successfully
 *         500:
 *           description: Internal Server Error
 */
router.get("/getAllAudition", showAllAuditions);
/**
 * @swagger
 * paths:
 *   /candidates/getAllAudition:
 *     get:
 *       summary: Get information about all auditions
 *       tags: [Candidats]
 *       responses:
 *         200:
 *           description: List of all auditions
 *           content:
 *             application/json:
 *               example:
 *                 auditions: [...]
 *         404:
 *           description: No auditions found
 *         500:
 *           description: Internal Server Error
 */
router.post("/sendMailAbscent", sendMailAbscent);
/**
 * @swagger
 * paths:
 *   /candidates/sendMailAbscent:
 *     post:
 *       summary: Send absence notification emails to specified email addresses
 *       tags: [Candidats]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sendMailType:
 *                   type: string
 *                   description: Type of mail to be sent
 *                 emailList:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of email addresses
 *                 debutheure:
 *                   type: number
 *                   description: Start hour for auditions
 *                 finheure:
 *                   type: number
 *                   description: End hour for auditions
 *                 duration:
 *                   type: number
 *                   description: Duration of each audition
 *               example:
 *                 sendMailType: "FirstAbsent"
 *                 emailList: ["email1@example.com", "email2@example.com"]
 *                 debutheure: 10
 *                 finheure: 16
 *                 duration: 1
 *       responses:
 *         200:
 *           description: Audition and email associations created successfully
 *         500:
 *           description: Internal Server Error
 */

module.exports = router;
