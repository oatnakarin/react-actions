const express = require('express')
const jwt = require('jsonwebtoken')
const core = require('cors')
const app = express();
const swaggerJsDoc =  require('swagger-jsdoc');
const swaggerUi  = require('swagger-ui-express');

app.use(core())
app.use(express.json())

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.1', 
      info: {
        title: 'API BY นครินทร์',
        version: '1.0.0',
        description: 'ลองทำดูเรื่อยๆ เหนื่อยก็เล่นเกม'
      },
      basePath: '/',
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{
        bearerAuth: [],
      }]
    },
    apis: ['server.js'],
  };

const swaggerDocs  = swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * Generate Token:
 *  get:
 *      summary: this token password to verify data in this below
 *      description: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ2YWx1ZSI6MCwibGFiZWwiOiJ4XjQtMTMiLCJMdmFsdWUiOjEuNSwiUnZhbHVlIjoyfSx7InZhbHVlIjoxLCJsYWJlbCI6InheMyArIDQiLCJMdmFsdWUiOi0yLCJSdmFsdWUiOjF9LHsidmFsdWUiOjIsImxhYmVsIjoieF4zKjItNCIsIkx2YWx1ZSI6MSwiUnZhbHVlIjoyfSx7InZhbHVlIjozLCJsYWJlbCI6InheMyp4XjItMSIsIkx2YWx1ZSI6LTIsIlJ2YWx1ZSI6Mn1dLCJpYXQiOjE2NTE1MjQxNzd9.N-DpnLdKqhigUHnvUxw-YDY01T0wR3pW2iWQz0gXvYA

 */

/**
 * @swagger
 * /data/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */

/**
 * @swagger
 * /newton/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */

/**
 * @swagger
 * /onepoint/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */

/**
 * @swagger
 * /matrix_data/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */

/**
 * @swagger
 * /linear/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */

/**
 * @swagger
 * /quad/{token}:
 *  get:
 *      summary: To get all data from api
 *      description: this api to get data
 *      parameters:
 *          - in: path
 *            name: token
 *            required: true
 *            description: Token is required
 *            schema:
 *              type: string
 * 
 *      responses:
 *          200:
 *              description: this api can get data
 *          401:
 *              description: token is not valid
 */




    const verify = (req,res,next) =>{
        try{
            const token = req.params.token;
        //    console.log(req);
            jwt.verify(token,"mySecretKey",(err,user) =>{
                if(err){
                    return res.status(401).json("Token is not valid");
                }
                next();
            })
        }catch(err){
            res.status(401)
        }
    }

app.get('/data/:token',verify,function (req, res) {
    try {
    const x = require('./data.json');
        res.send({data:x.bisec});
    } catch (err) {
        res.send("Token is not valid");
    }
})

app.get('/linear/:token',verify,function (req, res) {

    const x = require('./linear.json');
    //Generate Access Token
    try {
        //const accessToken = jwt.sign({data:x.bisec},"mySecretKey");
        res.send({data:x.linear});
    } catch (err) {
        res.status(401);
    }
})

app.get('/quad/:token',verify,function (req, res) {

    const x = require('./linear.json');
    //Generate Access Token
    try {
       //const accessToken = jwt.sign({data:x.bisec},"mySecretKey");
        res.send({data:x.quad});
    } catch (err) {
        res.status(401);
    }
})

app.get('/newton/:token',verify,function (req, res) {

    const x = require('./Newton_data.json');
    //Generate Access Token
    try {
        //const accessToken = jwt.sign({data:x.bisec},"mySecretKey");
        res.send({data:x.newton});
    } catch (err) {
        res.status(401);
    }
})

app.get('/onepoint/:token',verify,function (req, res) {

    const x = require('./one_point.json');
    //Generate Access Token
    try {
        //const accessToken = jwt.sign({data:x.bisec},"mySecretKey");
        res.send({data:x.onepoint});
    } catch (err) {
        res.status(401);
    }
})

app.get('/matrix_data/:token',verify,function (req, res) {

    const x = require('./matrix_data.json');
    //Generate Access Token
    try {
        //const accessToken = jwt.sign({data:x.bisec},"mySecretKey");
        res.send({data:x.matrix});
    } catch (err) {
        res.status(401);
    }
})

app.listen(4000,()=>{
    console.log('server start!')
}) 