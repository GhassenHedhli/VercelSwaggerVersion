const express=require("express");
const {ConcertForQR} =require ("../controllers/Concert.js");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Concert
 *   description: Concert management API
 */
router.get("/concert", ConcertForQR);
/**
 * @swagger
 * /Concert/concert:
 *   get:
 *     summary: Generate QR Codes for Concerts
 *     tags:
 *       - Concert
 *     responses:
 *       '200':
 *         description: QR Codes generated successfully.
 *         content:
 *           text/html:
 *             example: '<p>Lieu1 - Date1: <a href="images/qrcode_1.png" target="_blank">images/qrcode_1.png</a></p><p>Lieu2 - Date2: <a href="images/qrcode_2.png" target="_blank">images/qrcode_2.png</a></p>'
 *       '500':
 *         description: Internal Server Error
 */

module.exports = router;