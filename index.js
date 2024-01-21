const express=require("express");
const mongoose=require("mongoose");
const dotenv = require("dotenv");
const http =require("http");
const { Server } = require("socket.io");
const bp =require("body-parser");
const candidatRoutes =require("./routes/Candidat.js");
const insertMockData = require("./data/candidates.js");
const insertMockChoristeData = require("./data/choristes.js");
const insertMockPupitreData = require("./data/pupitre.js");
const updateChoristeDetails=require("./controllers/Chef_pupitre.js");
const adminRoutes =require ("./routes/Admin.js");
const repRoutes =require ("./routes/Repetition.js");
const candidat =require("./models/Candidat.js");
const concertADD=require("./routes/Concert.js");
const choristesRoutes=require("./routes/Choriste.js");
const pupitresRoutes=require("./routes/Chef_pupitre.js");
const concertRoutes =require ("./routes/ConcertQRCode.js");
const ioClient = require("socket.io-client");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const schedule =require("node-schedule");
const cors = require('cors');
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(express.json());
app.use(cors());
app.use("/candidates",candidatRoutes);
app.use("/reps",repRoutes);
app.use("/concerts",concertRoutes);
app.use("/admins",adminRoutes);
app.use("/concertAdd",concertADD);
app.use("/choristes",choristesRoutes);
app.use("/pupitres",pupitresRoutes);

/*Swagger API */
const options={
  definition:{
      openapi:"3.0.0",
      info:
      {
          title:"Todos Express API with Swagger",
          version:"0.1.0",
          description:"this is an API application",
          contact:{
              name:"Hedhli Ghasssen",
              url:"LIve",
              email:"ghessenhedhli@gmail.com",

          },
      },
      servers:[
          {
              url:"http://localhost:3001",
              description:"Development server"
          }
      ],
      components: {
          responses: {
            200: {
              description: "Success",
            },
            400: {
              description: "Bad request. You may need to verify your information.",
            },
            401: {
              description: "Unauthorized request, you need additional privileges",
            },
            403: {
              description:
                "Forbidden request, you must login first. See /auth/login",
            },
            404: {
              description: "Object not found",
            },
            422: {
              description:
                "Unprocessable entry error, the request is valid but the server refused to process it",
            },
            500: {
              description: "Unexpected error, maybe try again later",
            },
          },
    
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],

  },
  apis:["./routes/*.js"]
}


const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer:true}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


/* MONGOOSE SETUP */
//"mongodb+srv://ghassen:azerty@cluster0.bswshkf.mongodb.net/"
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    //insertMockData()
    //insertMockChoristeData()
    //insertMockPupitreData()
    schedule.scheduleJob('0 10 * * *', async () => {
      const newCandidates = await getNewCandidates();
      sendNotification(io, 'New candidates have joined!', newCandidates);
    });
    const socketServer = ioClient(`http://localhost:${PORT}`, { query: { role: 'admin' } });

    // Listen for 'notification' event from the server
    socketServer.on("notification", (data) => {
      console.log('Received "notification" event from server:', data);
      // Display or log information about new candidates
      if (data && data.newCandidates) {
        const userSocket = io.sockets.connected[socketServer.id];
        console.log('User role:', userSocket.handshake.query.role);
        if ( !userSocket.handshake.query.role || userSocket.handshake.query.role !== 'admin') {
          console.log('Notification ignored: User does not have admin role');
        } else {
          data.newCandidates.forEach(candidate => {
            console.log('New Candidate:', candidate);
          });
        }
      }
    });


    // Close the simulated client connection after some time
    setTimeout(() => {
      socketServer.close();
    }, 5000); // Close the connection after 5 seconds (adjust as needed)

  })
  .catch((error) => console.log(`${error} did not connect`));
  const sendNotification = (io, message, newCandidates) => {
    console.log('Sending notification:', message);
    console.log('New Candidates:', newCandidates);
    const adminSocketId = getAdminSocketId(io);
  
    // Emit a 'notification' event to all connected clients
    if (adminSocketId) {
      io.to(adminSocketId).emit('notification', { message, newCandidates });
    }
  };
  
  const getAdminSocketId = (io) => {
    // Loop through connected clients and find the admin's socket ID
    for (const [socketId, socket] of io.sockets.sockets) {
      if (socket.handshake.query.role === 'admin') {
        return socketId;
      }
    }
    return null;
  };
  
  //checking is a client is connected or not
  // const sendNotification = (io, message, newCandidates) => {
  //   // Get all connected clients
  //   const connectedClients = io.sockets.connected;
  
  //   // Check if there are connected clients
  //   if (!connectedClients || Object.keys(connectedClients).length === 0) {
  //     console.log('No connected clients');
  //     return;
  //   }
  
  //   // Find the socket ID of the admin role (adjust the role as needed)
  //   const adminSocketIds = Object.keys(connectedClients).filter(socketId => {
  //     const socket = connectedClients[socketId];
  //     return socket.handshake.auth.role === 'admin';
  //   });
  
  //   // Check if there are admin socket IDs
  //   if (adminSocketIds.length === 0) {
  //     console.log('No connected clients with admin role');
  //     return;
  //   }
  
  //   // Emit a 'notification' event to admin clients only
  //   adminSocketIds.forEach(adminSocketId => {
  //     // Check if the user is an admin before logging
  //     if (io.sockets.connected[adminSocketId].handshake.auth.role === 'admin') {
  //       console.log('Sending notification:', message);
  //       console.log('New Candidates:', newCandidates);
  //     }
  
  //     io.to(adminSocketId).emit('notification', { message, newCandidates });
  //   });
  // };
  
  // Function to get new candidates added in the last minute
  const getNewCandidates = async () => {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
  
    return await candidat.find({ createdAt: { $gte: oneMinuteAgo } });
  };

