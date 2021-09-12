require("dotenv").config();
const express = require("express");
const path = require("path");
const { v4: uuidV4 } = require("uuid");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:roomId", (req, res) => {
  res.render("room", { roomId: req.params.roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(userId);
    socket.join(roomId);

    socket.broadcast.to(roomId).emit("new-user", userId);
    socket.on("new-msg", (msg) => {
      console.log(msg);
      socket.broadcast.to(roomId).emit("msg-arrived", userId, msg);
    });
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-dis", userId);
    });
  });
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./public")));
}
server.listen(process.env.PORT || 3000, () => {
  console.log("Running..");
});
