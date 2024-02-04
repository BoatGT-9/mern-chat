// const express = require("express");
// const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const User = require("./model/User");
// const Message = require("./model/Message");
// const ws = require("ws");
// const fs = require("fs");
// const { verify } = require("crypto");
// dotenv.config();
// const salt = bcrypt.genSaltSync(10);
// const app = express();
// // ส่วนของ middleware
// // const uploadMiddleware = multer({ dest: "uploads/" })
// app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

// // ต่อกับฐานข้อมูล
// const MONGODB_URL = process.env.MONGODB_URL;
// mongoose.connect(MONGODB_URL);

// app.get("/", (req, res) => {
//   res.send("<h1>รันได้แน้วนร้าา</h1> ");
// });

// // Register

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userDoc = await User.create({
//       username,
//       password: bcrypt.hashSync(password, salt),
//     });
//     res.json(userDoc);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// });

// // Login

// const secret = process.env.SECRET;
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const userDoc = await User.findOne({ username });
//   if (userDoc) {
//     const isMatchPassword = bcrypt.compareSync(password, userDoc.password);
//     if (isMatchPassword) {
//       jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
//         if (err) throw err;
//         res.cookie("token", token).json({
//           id: userDoc._id,
//           username,
//         });
//       });
//     } else {
//       res.status(400).json("รหัสผ่านไม่ถูกต้อง");
//     }
//   } else {
//     res.status(400).json("ไม่พบผู้ใช้งาน");
//   }
// });

// // logout
// app.post("/logout", (req, res) => {
//   res.cookie("token", "").json("ok");
// });

// // Profile
// app.get("/profile", (req, res) => {
//   const token = req.cookies?.token;
//   if (token) {
//     jwt.verify(token, secret, {}, (err, userDate) => {
//       if (err) throw err;
//       res.json(userDate);
//     });
//   } else {
//     res.status(401).json("no token");
//   }
// });
// // people ของการออนไลน์ของ  user
// app.get("/people", async (req, res) => {
//   const users = await User.find({}, { _id: 1, username: 1 });
//   res.json(users);
// });

// //แกะ token data 
// const getUserDatafromRequest = (req) => {
//   return new Promise((resolve, reject) => {
//     const token = req.cookies?.token;
//     if (token) {
//       jwt.verify(token, secret, {}, (err, userData) => {
//         if (err) throw err;
//         resolve(userData);
//       });
//     } else {
//       reject("no token");
//     }
//   });
// };
// // message
// app.get("/message/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const userData = await getUserDatafromRequest(req);
//   const ourUserId = userData.userId;
//   const messages = await Message.find({
//     sender:{$in:[userId,ourUserId]},
//     recipient:{$in:[userId,ourUserId]},
//   }).sort({createdAT:1});
//   res.json(messages)
// });

// // ส่วนของช่อง PORT
// const PORT = process.env.PORT;
// const server = app.listen(PORT, () => {
//   console.log("SERVER is running on http://localhost:" + PORT);
// });

// // web Socket Server

// const wss = new ws.WebSocketServer({ server });

// wss.on("connection", (connection, req) => {
//   const notifyAboutOnlinePeople = () => {
//     [...wss.clients].forEach((clients) => {
//       // เป็นการสลายโครงสร้างจาก obj มาเป็น array
//       clients.send(
//         JSON.stringify({
//           online: [...wss.clients].map((c) => ({
//             userId: c.userId,
//             username: c.username,
//           })),
//         })
//       );
//     });
//   };

//   connection.isAlive = true;
//   connection.timer = setInterval(() => {
//     connection.ping();
//     connection.deadTimer = setTimeout(() => {
//       connection.isAlive = false;
//       clearInterval(connection.timer);
//       connection.terminate();
//       notifyAboutOnlinePeople();
//       console.log("dead");
//     }, 1000);
//   }, 5000);
//   connection.on("pong", () => {
//     clearTimeout(connection.deadTimer);
//   });

//   //read username and id form cooke

//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const tokenCookieString = cookies
//       .split(";")
//       .find((str) => str.startsWith("token="));
//     if (tokenCookieString) {
//       const token = tokenCookieString.split("=")[1];
//       if (token) {
//         jwt.verify(token, secret, {}, (err, userData) => {
//           if (err) throw err;
//           const { userId, username } = userData;
//           connection.userId = userId;
//           connection.username = username;
//         });
//       }
//     }
//   }

//   connection.on("message", async (message) => {
//     const messageData = JSON.parse(message.toString());
//     const { recipient, sender, text, file } = messageData;
//     let filename = null;
//     if (file) {
//       // เช็คถ้าไฟล์
//       const parts = file.name.split(".");
//       const ext = parts[parts.length - 1];
//       // เอานามสกุลของไฟล์มา ของเดิม
//       filename = Data.now() + "." + ext;
//       const path = __dirname + "/uploads/" + filename;
//       // เอาชื่อโฟล์เดอร์เดิม  __dirname
//       const bufferData = new Buffer(file.data.split(",")[1], "base64");
//       // เปลี่ยนให้เป้น base64 เพราะเป็น buffer
//       fs.writeFile(path, bufferData, () => {
//         // เซฟไฟล์
//         console.log("file saved:" + path);
//       });
//     }
//     // เช็คว่ามีไฟล์ไหม
//     if (recipient && (text || file)) {
//       const messageDoc = await Message.create({
//         sender: connection.userId,
//         recipient,
//         text,
//         file: file ? filename : null,
//       });
//       // การส่งช้อมูลให้ผู้รับ
//       [...wss.clients]
//         .filter((c) => c.userId === recipient)
//         .forEach((c) =>
//           c.send(
//             JSON.stringify({
//               text,
//               file: file ? filename : null,
//               recipient,
//               sender: connection.userId,
//               _id: messageDoc._id,
//             })
//           )
//         );
//       // ผู้รับที่ได้ รับข้อมูล
//     }
//   }); 
//   notifyAboutOnlinePeople();
// });

// //chat api
// const getUserDataFromRequest = (req) => {
//   return new Promise((resolve , reject) => {
//     const token = req.cookies?.token;
//     if(token) {
//       jwt.verify(token, secret,{} , (err,userData) => {
//         if(err) throw err;
//         resolve(userData)
//       })
//     } else {
//       reject("no token")
//     }
//   })
// }
// app.get("/messages/:userId" , async (req,res) => {
//   const {userId} = req.params;
//   const userData = await getUserDataFromRequest(req);
//   const ourUserId = userData.userId;
//   const messages = await Message.find({
//     sender:{$in : [userId , ourUserId]},
//     recipient:{$in : [userId , ourUserId]},
//   }).sort({createAt: 1});
//   res.json(messages);
// });
const express = require("express");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const User = require("./model/User");
const Message = require("./model/Message");
const ws = require("ws");
const fs = require("fs");

dotenv.config();

//Express Setup
const app = express();
// const CLIENT_URL = process.env.CLIENT_URL;
// app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

//set statics (public) folder
app.use("/uploads", express.static(__dirname + "/uploads"));

//Database Connect
const MONGODB_URL = process.env.MONGODB_URL;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
  
app.get("/", (req, res) => {
  res.send("<h1>This is a MERN Stack Chat</h1>")
})


//Register
const salt = bcrypt.genSaltSync(10);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt)
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//User login
const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc) {
    const isMatchedPassword = bcrypt.compareSync(password, userDoc.password);
    if (isMatchedPassword) {
      //can login
      jwt.sign({ username, userId: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        //save data in cookie
        res.cookie("token", token).json({
          userId: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  } else {
    res.status(400).json("Wrong credentials");
  }
});


//logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});


app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, secret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

//
app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
})


//Run Server
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});

//Web Socket Server
const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  };
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deadTimer = setTimeout(() => {
      connection.isAlive = false
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);
  connection.on('pong', () => {
    clearTimeout(connection.deadTimer);
  });

  //read username and id from cookie for this connection

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find((str) => str.startsWith('token='))
    if (tokenCookieString) {
      //การทำงานของฟังก์ชันสตริง
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, secret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        })
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, sender, text, file } = messageData;
    let filename = null;
    if (file) {
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      //const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, file.data.split(",")[1], "base64" , () => {
        console.log('file saved: ' + path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text: text.toString(), 
        file: file ? filename : null
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              file: file ? filename : null,
              recipient,
              sender: connection.userId,
              _id: messageData._id,
            })
          )
        );
    }
  });


  notifyAboutOnlinePeople();
});

//chat api
const getUserDataFromRequest = (req) => {
  return new Promise((resolve , reject) => {
    const token = req.cookies?.token;
    if(token) {
      jwt.verify(token, secret,{} , (err,userData) => {
        if(err) throw err;
        resolve(userData)
      })
    } else {
      reject("no token")
    }
  })
}
app.get("/messages/:userId" , async (req,res) => {
  const {userId} = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender:{$in : [userId , ourUserId]},
    recipient:{$in : [userId , ourUserId]},
  }).sort({createAt: 1});
  res.json(messages);
});