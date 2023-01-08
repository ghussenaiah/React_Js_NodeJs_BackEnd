//import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // 
require("dotenv").config();
const Razorpay = require("razorpay");


const app = express();

app.use(cors())
// create express app

// setup the server port
const port = process.env.PORT || 5000;

// parse request data content type application/x-www-form-rulencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse request data content type application/json
app.use(bodyParser.json());

// define root route

const prisma = new PrismaClient()



app.post('/orders', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 50000, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post('/register', async (req, res) => {
  console.log("request", req);
  console.log("request body", req.body);
  console.log("request body data", req.body.data1);

  const datainfo = await prisma.employee.create({
    data:

    {
      name: req.body.name, addresss: req.body.address, order: req.body.order, time: new Date(req.body.date),
      jobTitle: "hyderabad"
    }

  })
  res.json(datainfo);
});



app.get('/fetchall', async (req, res) => {
  console.log("request", req);
  console.log("request body", req.body);
  console.log("request body data", req.body.data);

  const allUsers = await prisma.employee.findMany();
  console.log(allUsers)
  res.json(allUsers);

});


app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});


/* 
app.post('/login', async (req, res)=>{
  console.log("request",req);
  console.log("request body",req.body);
  console.log("request body data",req.body.data);
  
  const newUserWithTweets = await prisma.employee.findUnique({
    where: {
      
       name: req.body.name, 
       addresss: req.body.address

    }
  });
  
  console.log("User object with Tweets:");
  console.dir(newUserWithTweets);
  
  res.json(datainfo);
});
 */



/* app.post('/login', async (req, res)=>{
  console.log("request",req);
  console.log("request body",req.body);
  console.log("request body data",req.body.data);
  
  const newUserWithTweets = await prisma.employee.findUnique({
    where: {
      
       name: req.body.name, 
       addresss: req.body.address

    }
  });
  
  console.log("User object with Tweets:");
  console.dir(newUserWithTweets);
  
  res.json(datainfo);
});
 */
app.delete('/delete', async (req, res) => {
  console.log("request", req);
  console.log("request body", req.body);
  console.log("request body data", req.params);

  const deletePost = await prisma.employee.delete({
    where: {
      id: parseInt(req.query.id) // Random ID
    },
  })




  console.dir(deletePost);

  res.json(deletePost);
});




app.put('/update/:id', async (req, res) => {


  console.log("request", req);
  console.log("request body", req.body);
  console.log("request body data", req.params);

  const deletePost = await prisma.employee.update({
    where: {
      id: parseInt(req.params.id) // Random ID
    },
    data: {

      name: req.body.name, addresss: req.body.address, order: req.body.order
    },
  })


  console.dir(deletePost);

  res.json(deletePost);
});



app.delete('/edit', async (req, res) => {
  console.log("edit request", req);
  console.log("request body", req.body);
  console.log("request body data", req.params);

  const editrecord = await prisma.employee.findUnique({
    where: {
      id: parseInt(req.query.id) // Random ID
    },
  })


  console.log(editrecord);

  res.json(editrecord);
});












async function main() {

  /*   await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alicej@prisma.io',
        posts: {
          create: { title: 'Hello World' },
        },
        profile: {
          create: { bio: 'I like turtles' },
        },
      },
    }) */
  /*   const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    })
    console.dir(allUsers, { depth: null }) */
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

app.listen(port, () => {
  console.log(`Express is running at port ${port}`);
});

