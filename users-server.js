const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database-config');
const swaggerUi =require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');
const app  = express();
// const port = 3006;
const port = process.env.PORT || 1433;

app.use(cors())

//=================================================

//==================================================
app.use(bodyParser.json());
const swaggerOptions = {
    swaggerDefinition : {
        info:{
            title : "Express Server API",
            version: "0.0.1",
            description: "A simple express api with swagger"
        },
        host : `reemalwahaibi-app-f7fdb50e4fd7.herokuapp.com`,
        basePath: '/',
        schemas : ['https']
    },
    servers : [{ url: `https://reemalwahaibi-app-f7fdb50e4fd7.herokuapp.com/`  }],
    apis: ['./users-server.js']
}

//==///=====================================================
const swaggerDocs =  swaggerJSDoc(swaggerOptions);
app.use('/api-ui', swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *
 * /api/users/{email}/{password}:
 *   get:
 *     summary: Get a user by email and password
 *     description: Returns a single user by email and password
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         type: string
 *         description: The email of the user
 *       - name: password
 *         in: path
 *         required: true
 *         type: string
 *         description: The password of the user
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/User'
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all Products
 *     responses:
 *       200:
 *         description: A list of Products
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Products'
 *   post:
 *     summary: Add a new product
 *     description: Add a new product
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The product to add
 *         schema:
 *           $ref: '#/definitions/Products'
 *     responses:
 *       201:
 *         description: Product added successfully
 * /api/products/{id}:
 * 
 *   get:
 *     summary: Get a Product by ID
 *     description: Returns products by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the Products
 *     responses:
 *       200:
 *         description: Products
 *         schema:
 *           $ref: '#/definitions/Products'
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the Product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *   put:
 *     summary: Update a Product
 *     description: Updates a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of a product
 *       - in: body
 *         name: Products
 *         description: The product is updated
 *         schema:
 *           $ref: '#/definitions/Products'
 *     responses:
 *       201:
 *         description: Product added successfully
 * 
 * /api/products/category/{id}:
 *   get:
 *     summary: Get a Product by Category
 *     description: Returns products by Category
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The ID of the Category
 *     responses:
 *       200:
 *         description: Products
 *         schema:
 *           $ref: '#/definitions/Products'
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
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       fname:
 *         type: string
 *         example: ammar
 *       lname:
 *         type: string
 *         example: ammar
 *       email:
 *         type: string
 *         example: ammar@example.com
 *       password:
 *         type: string
 *         example: 32434ghhjrgew
 *   Products:
 *     type: object
 *     properties:
 *       productId:
 *         type: integer
 *         example: 1
 *       productName:
 *         type: string
 *         example: Phone
 *       productDesc:
 *         type: string
 *         example: This is phone
 *       price:
 *         type: number
 *         format : float
 *         example: 3.99
 *       productImage:
 *         type: string
 *         example: 'thepic.jpg'
 *       categoryId:
 *         type: integer
 *         example: 1
 *       qty:
 *         type: integer
 *         example: 1
 *   Category:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 1
 *       Category:
 *         type: string
 *         example: Food
 */
app.get('/api/users', async(req,res) => { 
    try{
    const result  = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
    }catch(error){
    res.status(500).send(error.message);
    }
    });

//=============================================

app.post('/api/users', async(req,res) => {
    try {
        const {fname,lname,email,password} = req.body;
        
        const result = await sql.query
        (`Exec sp_Register @FirstName='${fname}',@LastName='${lname}',
            @Email='${email}',@Password=${password}`);

        res.status(201).json({user: result.recordset  ,message:'User has been created Successfully!'})
    } catch (error) {
        res.status(500).send(error.message);
    }
    });

//=============================================

app.get('/api/users/:email/:password', async(req,res) => { 
    try{
    const {email,password} = req.params;

    const result  = await sql.query
    (`Exec sp_Login @Email='${email}',@Password='${password}'`);
    res.json(result.recordset);
    }catch(error){
    res.status(500).send(error.message);
    }
    });

//=============================================
//================products========================
app.get('/api/products', async(req,res) => { 
    try{
    const result  = await sql.query("SELECT * FROM Products");
    res.json(result.recordset);
    }catch(error){
    res.status(500).send(error.message);
    }
    });

//=======================================================
app.post('/api/products', async(req,res) => {
    try {
        const {productName,productDesc,price,categoryId,productImage,qty} = req.body;
        
        const result = await sql.query
        (`Exec sp_AddProduct @ProductName='${productName}',@ProductDesc='${productDesc}',
            @Price=${price},@Category='${categoryId}',@ProductImage='${productImage}',@Qty=${qty}`);

        res.status(201).json({user: result.recordset  ,message:'Product has been added Successfully!'})
    } catch (error) {
        res.status(500).send(error.message);
    }
    });


//=======================================================
app.delete('/api/products/:id', async(req,res) => {
    try {
        const {id} = req.params;
       
        const result = await sql.query
        (`Exec sp_DeleteProduct @id=${id}`);
        res.status(201).json({user: result.recordset  ,
            message:'Product has been Removed Successfully!'})
    } catch (error) {
        res.status(500).send(error.message);
    }
    });

//=======================================================
app.get('/api/products/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query(`Exec sp_ListProductsByCat @CatId=${id}`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
//========================================================
app.get('/api/products/:id', async(req,res) => {
  try {
      const {id} = req.params;
      const result = await sql.query(`Exec sp_ProductById @ProductId=${id}`);
      res.json(result.recordset);
  } catch (error) {
      res.status(500).send(error.message);
  }
  });

//=======================================================
app.put('/api/products/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const {productName,productDesc,price,productImage,categoryId,qty} = req.body;
        const result = await sql.query
        (`Exec sp_UpdateProduct @ProductName='${productName}',@ProductDesc='${productDesc}',
            @Price=${price},@ProductImage='${productImage}', @Category=${categoryId},@Qty=${qty},@Id=${id}`);
            res.status(201).json({user: result.recordset  ,message:'Product has been Updated Successfully!'})
        } catch (error) {
            res.status(500).send(error.message);
        }
        });


//=============================================
app.get('/api/category', async(req,res) => { 
    try{
    const result  = await sql.query("SELECT * FROM Category");
    res.json(result.recordset);
    }catch(error){
    res.status(500).send(error.message);
    }
    });
//================category========================

app.listen(port, ()=> {
    console.log(`Server is running on https://reemalwahaibi-app-f7fdb50e4fd7.herokuapp.com/`)
    console.log(`Swagger UI is avaiable on https://reemalwahaibi-app-f7fdb50e4fd7.herokuapp.com/api-ui`)
    
    });