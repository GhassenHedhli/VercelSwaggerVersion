const express=require("express");
//import {notifyAdmin} from "../controllers/Admin.js"
const {AddAdmin,GetThFilterConcertRep,AbsenceStatus,getConcertStatistics,getOeuvreStatistics,getChoristeStatistics} = require("../controllers/Admin.js");
const router = express.Router();
/**        
 * @swagger
 * tags:
 *   name: Tasks
 *   description: this Tasks managing API
*/

router.post("/AddAdmin",AddAdmin);
/**
 * @swagger
 * /admins/AddAdmin:
 *   post:
 *     summary: Add a new admin
 *     tags:
 *       - Admin
 *     requestBody:
 *       description: Admin data to add
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Admin'
 *     responses:
 *       201:
 *         description: Admin added successfully
 *         schema:
 *           $ref: '#/definitions/Admin'
 *       400:
 *         description: Bad request. You may need to verify your information.
 *       500:
 *         description: Unexpected error, maybe try again later
 */
router.get("/AbscenceStatus",AbsenceStatus);
/**
 * @swagger
 * /admins/AbsenceStatus:
 *   get:
 *     summary: Get absence status based on date, program, choriste, and pupitre filters
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: date
 *         in: query
 *         description: Date for filtering absence status
 *         required: false
 *         type: string
 *       - name: startDate
 *         in: query
 *         description: Start date for range filtering
 *         required: false
 *         type: string
 *       - name: endDate
 *         in: query
 *         description: End date for range filtering
 *         required: false
 *         type: string
 *       - name: programId
 *         in: query
 *         description: ID of the program for filtering
 *         required: false
 *         type: string
 *       - name: choristeId
 *         in: query
 *         description: ID of the choriste for filtering
 *         required: false
 *         type: string
 *       - name: pupitreId
 *         in: query
 *         description: ID of the pupitre for filtering
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             absenceStatus:
 *               type: array
 *       500:
 *         description: Internal Server Error
 */
router.get("/GetFiltersChoriste/:idChoriste",GetThFilterConcertRep);
/**
 * @swagger
 * /admins/GetFiltersChoriste/{idChoriste}:
 *   get:
 *     summary: Get filtered concert and repetition statistics for a choriste
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: idChoriste
 *         in: path
 *         description: ID of the choriste
 *         required: true
 *         type: string
 *       - name: year
 *         in: query
 *         description: Year for filtering statistics
 *         required: false
 *         type: string
 *       - name: title
 *         in: query
 *         description: Filter by concert title
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             attendedRepetitions:
 *               type: number
 *             attendedConcerts:
 *               type: number
 *             notAttendedRepetitions:
 *               type: number
 *             notAttendedConcerts:
 *               type: number
 *             allConcerts:
 *               type: array
 *             allPrograms:
 *               type: array
 *             allWorks:
 *               type: array
 *       500:
 *         description: Internal Server Error
 */
router.get("/getConcertStatistics/:concertId",getConcertStatistics);
/**
 * @swagger
 * /admins/getConcertStatistics/{concertId}:
 *   get:
 *     summary: Get statistics for a specific concert
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: concertId
 *         in: path
 *         description: ID of the concert
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             concert:
 *               $ref: '#/definitions/Concert' 
 *             attendedChoristes:
 *               type: number
 *             absentChoristes:
 *               type: number
 *       400:
 *         description: Concert ID is required.
 *       404:
 *         description: Concert not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/getOeuvreStatistics/:oeuvreId",getOeuvreStatistics);
/**
 * @swagger
 * /admins/getOeuvreStatistics/{oeuvreId}:
 *   get:
 *     summary: Get statistics for a specific oeuvre
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: oeuvreId
 *         in: path
 *         description: ID of the oeuvre
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             oeuvre:
 *               $ref: '#/definitions/Oeuvre'  
 *             performancesCount:
 *               type: number
 *             choristesPerformed:
 *               type: array
 *       400:
 *         description: Oeuvre ID is required.
 *       404:
 *         description: Oeuvre not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/getChoristeStatistics/:choristeId",getChoristeStatistics);
/**
 * @swagger
 * /admins/getChoristeStatistics/{choristeId}:
 *   get:
 *     summary: Get statistics for a specific choriste
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: choristeId
 *         in: path
 *         description: ID of the choriste
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             choriste:
 *               $ref: '#/definitions/Choriste'  
 *             attendedRepetitions:
 *               type: number
 *             attendedConcerts:
 *               type: number
 *       400:
 *         description: Choriste ID is required.
 *       404:
 *         description: Invalid choristeId. Provide a valid choristeId.
 *       500:
 *         description: Internal Server Error
 */
module.exports= router;

