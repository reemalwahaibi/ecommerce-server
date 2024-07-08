const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database-config');
const swaggerUi =require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const app  = express();
const port = 3001;
app.use(cors())

//==================================================
app.use(bodyParser.json());
const swaggerOptions = {
    swaggerDefinition : {
        info:{
            title : "Express Server API",
            version: "0.0.1",
            description: "A simple express api with swagger"
        },
        host : `localhost:${port}`,
        basePath: '/',
        schemas : ['http']
    },
    servers : [{ url: `http://localhost:${port}`  }],
    apis: ['./cat-server.js']
}

//=======================================================
const swaggerDocs =  swaggerJSDoc(swaggerOptions);
app.use('/api-ui', swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all category
 *     description: Returns a list of category
 *     responses:
 *       200:
 *         description: A list of category
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Category'
 * definitions:
 *   Category:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       Category:
 *         type: string
 *         example: ammar
 */

app.get('/api/category', async(req,res) => { 
    try{
    const result  = await sql.query("SELECT * FROM Category");
    res.json(result.recordset);
    }catch(error){
    res.status(500).send(error.message);
    }
    });

//=============================================
app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`)
    console.log(`Swagger UI is avaiable on http://localhost:${port}/api-ui`)
    
    });