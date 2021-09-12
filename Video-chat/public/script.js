const socket = io("/");
const videoGrid = document.getElementById("video-grid");

var peer = new Peer(Math.floor(Math.random() * 1000), {
  host: "/",
  port: 3001,
});

const allpeer = {};
const myVideo = document.createElement("video");
const p = document.createElement("p");
myVideo.muted = true;
let myVideoStream;
1;
peer.on("open", (id) => {
  socket.emit("join-room", ROOM, id);
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addStream(myVideo, stream);
    myVideoStream = stream;

    peer.on("call", (call) => {
      console.log(call);
      call.answer(stream);

      const video = document.createElement("video");
      video.id = call.peer;
      call.on("stream", (remoteUser) => {
        addStream(video, remoteUser);
      });
    });

    socket.on("new-user", (userId) => {
      console.log("Connect", userId);
      setTimeout(function () {
        connectToUser(userId, stream);
      }, 2000);
    });
  });

socket.on("user-dis", (userId) => {
  console.log("Dis", userId);
  if (allpeer[userId]) allpeer[userId].close();
});

const addStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    document.querySelector("#lable").innerHTML = "Me";
  });
  videoGrid.appendChild(video);
};

function connectToUser(uid, stream) {
  const call = peer.call(uid, stream);
  console.log(call);
  const video = document.createElement("video");

  call.on("stream", (remoteUser) => {
    addStream(video, remoteUser);
  });

  call.on("close", () => {
    video.remove();
  });

  allpeer[uid] = call;
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    console.log("mic:", myVideoStream.getAudioTracks()[0].enabled);
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    console.log("mic:", myVideoStream.getAudioTracks()[0].enabled);
    setMuteButton();
  }
};

const mtBtn = document.getElementById("control");
mtBtn.addEventListener("click", () => {
  muteUnmute();
});

const setMuteButton = () => {
  const html = "Mute";
  document.querySelector("#control").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = "unmute";
  document.querySelector("#control").innerHTML = html;
};

const vidBtn = document.getElementById("VidControl");
vidBtn.addEventListener("click", () => {
  playStop();
});
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    console.log("Video:", myVideoStream.getVideoTracks()[0].enabled);
    setPlayVideo();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    console.log("Video:", myVideoStream.getVideoTracks()[0].enabled);
    setStopVideo();
  }
};

const setStopVideo = () => {
  const html = "Stop Video";
  document.querySelector("#VidControl").innerHTML = html;
};

const setPlayVideo = () => {
  const html = "Play Video";
  document.querySelector("#VidControl").innerHTML = html;
};

const send = document.getElementById("submit");
send.addEventListener("click", () => {
  const text = document.getElementById("msg");
  socket.emit("new-msg", text.value);
  addmsg(text.value);
});

socket.on("msg-arrived", (userid, msg) => {
  console.log(msg);
  addmsg(msg, userid);
});

function addmsg(msg, userid = peer.id) {
  const container = document.getElementById("allmsg");
  const lable = document.createElement("li");
  let name = "";
  if (userid == peer.id) {
    name = "ME";
  } else {
    name = "Anonymous";
  }

  lable.innerHTML = msg + " -- " + name;
  container.append(lable);
}
