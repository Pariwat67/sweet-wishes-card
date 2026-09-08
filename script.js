const $ = (id) => document.getElementById(id);

const state = {
  recipient: "",
  title: "Happy Birthday!",
  message: "",
  sender: "",
  theme: "pink",
  images: [],
  music: null,
  musicName: ""
};


// =====================================================
// SAVE / LOAD CARD - ระบบบันทึกการ์ดแบบถาวรในเครื่อง
// =====================================================

function saveCard() {
  const cardData = {
    recipient: state.recipient,
    title: state.title,
    message: state.message,
    sender: state.sender,
    theme: state.theme,
    images: state.images,
    music: state.music,
    musicName: state.musicName
  };

  try {
    localStorage.setItem(
      "sweetWishesCard",
      JSON.stringify(cardData)
    );

    console.log("บันทึกการ์ดเรียบร้อยแล้ว");
  } catch (error) {
    console.error("ไม่สามารถบันทึกการ์ดได้:", error);
  }
}


function loadSavedCard() {
  const saved = localStorage.getItem("sweetWishesCard");

  if (!saved) {
    return false;
  }

  try {
    const data = JSON.parse(saved);

    // โหลดข้อมูลกลับเข้า state
    state.recipient = data.recipient || "";
    state.title = data.title || "Happy Birthday!";
    state.message = data.message || "";
    state.sender = data.sender || "";
    state.theme = data.theme || "pink";
    state.images = data.images || [];
    state.music = data.music || null;
    state.musicName = data.musicName || "";

    // ใส่ข้อมูลกลับเข้าแบบฟอร์ม
    $("recipient").value = state.recipient;
    $("titleInput").value = state.title;
    $("message").value = state.message;
    $("sender").value = state.sender;

    // โหลดเพลง
    musicUrl = state.music || "";

    $("musicInput").value = musicUrl;

    $("musicInfo").textContent = musicUrl
      ? `🎵 ${musicUrl}`
      : "ยังไม่ได้ใส่ลิงก์เพลง";

    // ตั้ง Theme
    document.querySelectorAll(".theme-option").forEach(btn => {
      btn.classList.toggle(
        "selected",
        btn.dataset.theme === state.theme
      );
    });

    // แสดงการ์ด
    $("cardTitle").textContent = state.title;

    $("cardRecipient").textContent =
      state.recipient;

    $("cardMessage").textContent =
      state.message;

    $("cardSender").textContent =
      state.sender
        ? `— ${state.sender} —`
        : "— ด้วยความปรารถนาดี —";

    applyTheme(
      $("fullCard"),
      state.theme
    );

    // แสดงรูปภาพ
    $("gallery").innerHTML = "";

    state.images.forEach(src => {
      const img = document.createElement("img");

      img.src = src;

      $("gallery").appendChild(img);
    });

    // แสดงเพลง
    if (state.music) {

      $("musicName").textContent =
        state.musicName;

      $("musicLink").href =
        state.music;

      $("musicPlayer").classList.remove("hidden");

    } else {

      $("musicPlayer").classList.add("hidden");

    }

    // อัปเดต Preview
    updatePreview();

    console.log("โหลดการ์ดที่บันทึกไว้แล้ว");

    return true;

  } catch (error) {

    console.error(
      "โหลดการ์ดไม่สำเร็จ:",
      error
    );

    return false;
  }
}


// =====================================================
// PAGE
// =====================================================

const pages = {
  landing: $("landing"),
  creator: $("creator"),
  card: $("cardPage")
};


function showPage(name) {

  Object.values(pages).forEach(p =>
    p.classList.remove("active")
  );

  pages[name].classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =====================================================
// THEME
// =====================================================

function applyTheme(el, theme) {

  el.classList.remove(
    "theme-pink",
    "theme-blue",
    "theme-purple",
    "theme-cream"
  );

  el.classList.add(
    `theme-${theme}`
  );
}


// =====================================================
// PREVIEW
// =====================================================

function updatePreview() {

  $("miniTitle").textContent =
    $("titleInput").value ||
    "Happy Birthday!";

  $("miniRecipient").textContent =
    $("recipient").value ||
    "ชื่อคนรับ";

  $("miniMessage").textContent =
    $("message").value ||
    "คำอวยพรของคุณจะปรากฏตรงนี้...";

  $("miniSender").textContent =
    $("sender").value
      ? `— ${$("sender").value} —`
      : "— จากใคร —";

  applyTheme(
    $("miniCard"),
    state.theme
  );
}


// =====================================================
// INPUT EVENTS
// =====================================================

[
  "recipient",
  "titleInput",
  "message",
  "sender"
].forEach(id => {

  $(id).addEventListener(
    "input",
    updatePreview
  );

});


// =====================================================
// THEME BUTTONS
// =====================================================

document
  .querySelectorAll(".theme-option")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".theme-option")
          .forEach(b =>
            b.classList.remove("selected")
          );

        btn.classList.add("selected");

        state.theme =
          btn.dataset.theme;

        updatePreview();
      }
    );

  });


// =====================================================
// IMAGE
// =====================================================

let imageFiles = [];


$("imageInput").addEventListener(
  "change",
  (e) => {

    imageFiles =
      Array.from(e.target.files)
        .slice(0, 6);

    renderImageList();

  }
);


function renderImageList() {

  const list =
    $("imageList");

  list.innerHTML = "";

  imageFiles.forEach(
    (file, index) => {

      const wrap =
        document.createElement("div");

      wrap.className =
        "upload-thumb";


      const img =
        document.createElement("img");

      img.src =
        URL.createObjectURL(file);


      const remove =
        document.createElement("button");

      remove.type =
        "button";

      remove.className =
        "remove-img";

      remove.textContent =
        "×";


      remove.onclick =
        () => {

          imageFiles.splice(
            index,
            1
          );

          renderImageList();

        };


      wrap.append(
        img,
        remove
      );

      list.appendChild(
        wrap
      );

    }
  );
}


// =====================================================
// MUSIC
// =====================================================

let musicUrl = "";


$("musicInput").addEventListener(
  "input",
  (e) => {

    musicUrl =
      e.target.value.trim();

    $("musicInfo").textContent =
      musicUrl
        ? `🎵 ${musicUrl}`
        : "ยังไม่ได้ใส่ลิงก์เพลง";

  }
);


// =====================================================
// BUTTONS
// =====================================================

$("startBtn").onclick =
  () => showPage("creator");


$("createTopBtn").onclick =
  () => showPage("creator");


$("backBtn").onclick =
  () => showPage("landing");


$("previewBtn").onclick =
  async () => {

    if (
      !$("recipient")
        .value
        .trim()
    ) {

      alert(
        "ใส่ชื่อคนรับก่อนนะ 😊"
      );

      $("recipient").focus();

      return;
    }

    await buildCard();

    showPage("card");

  };


$("editBtn").onclick =
  () => showPage("creator");


// =====================================================
// DEMO
// =====================================================

$("loadDemoBtn").onclick =
  () => {

    $("recipient").value =
      "คนพิเศษ";

    $("titleInput").value =
      "Happy Birthday!";

    $("message").value =
      "ขอให้วันนี้เต็มไปด้วยรอยยิ้ม\n" +
      "ขอให้ทุกวันที่ผ่านไปมีแต่เรื่องดี ๆ\n" +
      "และขอให้ความฝันของเธอค่อย ๆ เป็นจริงนะ 💗";

    $("sender").value =
      "คนที่อยากเห็นเธอมีความสุข";

    state.theme =
      "pink";

    document
      .querySelectorAll(".theme-option")
      .forEach(b =>
        b.classList.toggle(
          "selected",
          b.dataset.theme === "pink"
        )
      );

    updatePreview();

    showPage("creator");

  };


// =====================================================
// FORM SUBMIT
// =====================================================

$("cardForm").addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    if (
      !$("recipient")
        .value
        .trim()
    ) {

      alert(
        "กรุณาใส่ชื่อคนรับ"
      );

      return;
    }

    await buildCard();

    showPage("card");

  }
);


// =====================================================
// FILE -> DATA URL
// =====================================================

async function fileToDataURL(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload =
        () => resolve(
          reader.result
        );

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );

    }
  );

}


// =====================================================
// MUSIC SERVICE
// =====================================================

function getMusicServiceName(url) {

  try {

    const u =
      new URL(url);

    const host =
      u.hostname.toLowerCase();

    if (
      host.includes("youtube.com") ||
      host.includes("youtu.be")
    ) {

      return "เพลงจาก YouTube";

    }

    if (
      host.includes("spotify.com")
    ) {

      return "เพลงจาก Spotify";

    }

    return "เพลงของเรา";

  } catch {

    return "เพลงของเรา";

  }
}


// =====================================================
// BUILD CARD
// =====================================================

async function buildCard() {

  state.recipient =
    $("recipient")
      .value
      .trim();

  state.title =
    $("titleInput")
      .value
      .trim() ||
    "Happy Birthday!";

  state.message =
    $("message")
      .value
      .trim() ||
    "ขอให้มีความสุขมาก ๆ ในทุกวันนะ 💗";

  state.sender =
    $("sender")
      .value
      .trim();


  // แสดงข้อความ
  $("cardTitle").textContent =
    state.title;

  $("cardRecipient").textContent =
    state.recipient;

  $("cardMessage").textContent =
    state.message;

  $("cardSender").textContent =
    state.sender
      ? `— ${state.sender} —`
      : "— ด้วยความรักและความปรารถนาดี —";


  // Theme
  applyTheme(
    $("fullCard"),
    state.theme
  );


  // ===================================================
  // IMAGES
  // ===================================================

  const gallery =
    $("gallery");

  gallery.innerHTML = "";

  state.images = [];


  for (
    const file of imageFiles
  ) {

    const data =
      await fileToDataURL(file);

    state.images.push(data);


    const img =
      document.createElement("img");

    img.src =
      data;

    gallery.appendChild(
      img
    );

  }


  // ===================================================
  // MUSIC
  // ===================================================

  const musicPlayer =
    $("musicPlayer");

  const musicLink =
    $("musicLink");

  const url =
    musicUrl.trim();


  if (url) {

    state.music =
      url;

    state.musicName =
      getMusicServiceName(
        url
      );

    $("musicName").textContent =
      state.musicName;

    musicLink.href =
      url;

    musicPlayer
      .classList
      .remove("hidden");

  } else {

    state.music =
      null;

    state.musicName =
      "";

    musicPlayer
      .classList
      .add("hidden");

    musicLink
      .removeAttribute("href");

  }


  // ===================================================
  // CAKE
  // ===================================================

  $("cake")
    .classList
    .remove("blown");

  $("blowMessage")
    .classList
    .add("hidden");


  // ===================================================
  // ⭐ บันทึกการ์ดถาวร
  // ===================================================

  saveCard();

}


// =====================================================
// BLOW CANDLE
// =====================================================

$("blowBtn").onclick =
  () => {

    $("cake")
      .classList
      .add("blown");

    $("blowMessage")
      .classList
      .remove("hidden");

    confetti();

  };


// =====================================================
// CONFETTI
// =====================================================

function confetti() {

  const symbols = [
    "🎉",
    "✨",
    "💗",
    "🌸",
    "⭐"
  ];


  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const el =
      document.createElement(
        "span"
      );

    el.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    el.style.position =
      "fixed";

    el.style.left =
      Math.random() *
      100 +
      "vw";

    el.style.top =
      "-30px";

    el.style.fontSize =
      (
        14 +
        Math.random() *
        20
      ) +
      "px";

    el.style.zIndex =
      100;

    el.style.transition =
      `transform ${
        1.5 +
        Math.random() *
        1.5
      }s ease, opacity 2s`;


    document.body
      .appendChild(el);


    requestAnimationFrame(
      () => {

        el.style.transform =
          `translate(${
            (
              Math.random() -
              0.5
            ) *
            180
          }px, ${
            window.innerHeight +
            80
          }px) rotate(${
            Math.random() *
            700
          }deg)`;


        el.style.opacity =
          "0";

      }
    );


    setTimeout(
      () => el.remove(),
      3500
    );

  }

}


// =====================================================
// SHARE / QR
// =====================================================

function createSharePayload() {

  // QR URLs should remain reasonably small.
  // Images are included only if
  // the final encoded URL is not too large.
  // Music is intentionally included as URL.

  const base = {

    r:
      state.recipient,

    t:
      state.title,

    m:
      state.message,

    s:
      state.sender,

    th:
      state.theme,

    music:
      state.music || ""

  };


  const withImages = {
    ...base,
    imgs: state.images
  };


  const encodedWithImages =
    encodeURIComponent(
      JSON.stringify(
        withImages
      )
    );


  if (
    encodedWithImages.length <
    6500
  ) {

    return encodedWithImages;

  }


  return encodeURIComponent(
    JSON.stringify(base)
  );

}


function makeShareUrl() {

  return `${
    location.origin
  }${
    location.pathname
  }#card=${
    createSharePayload()
  }`;

}


// =====================================================
// SHARE BUTTON
// =====================================================

$("shareBtn").onclick =
  async () => {

    const url =
      makeShareUrl();

    try {

      await navigator.clipboard
        .writeText(url);

      alert(
        "คัดลอกลิงก์การ์ดแล้ว 💗\n" +
        "นำไปส่งให้เพื่อนได้เลย"
      );

    } catch {

      prompt(
        "คัดลอกลิงก์นี้:",
        url
      );

    }

  };


// =====================================================
// QR CODE
// =====================================================

$("qrBtn").onclick =
  () => {

    const url =
      makeShareUrl();

    const box =
      $("qrcode");

    box.innerHTML = "";


    // ใช้ QR image service
    // แทนไลบรารีภายนอก

    const img =
      document.createElement(
        "img"
      );

    img.width =
      220;

    img.height =
      220;

    img.alt =
      "QR Code";

    img.loading =
      "eager";


    img.src =
      "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
      encodeURIComponent(url);


    box.appendChild(
      img
    );


    $("qrWarning").textContent =
      "หมายเหตุ: ถ้าต้องการให้มือถือเครื่องอื่นเปิดการ์ดได้จริง ต้องนำเว็บขึ้นออนไลน์ก่อน";


    $("qrModal")
      .classList
      .remove("hidden");

  };


// =====================================================
// CLOSE QR
// =====================================================

$("closeQr").onclick =
  () =>
    $("qrModal")
      .classList
      .add("hidden");


$("qrModal").addEventListener(
  "click",
  e => {

    if (
      e.target ===
      $("qrModal")
    ) {

      $("qrModal")
        .classList
        .add("hidden");

    }

  }
);


// =====================================================
// COPY LINK
// =====================================================

$("copyLinkBtn").onclick =
  async () => {

    const url =
      makeShareUrl();

    try {

      await navigator.clipboard
        .writeText(url);

      $("copyLinkBtn")
        .textContent =
        "คัดลอกแล้ว ✓";


      setTimeout(
        () => {

          $("copyLinkBtn")
            .textContent =
            "🔗 คัดลอกลิงก์";

        },
        1500
      );

    } catch {

      prompt(
        "คัดลอกลิงก์:",
        url
      );

    }

  };


// =====================================================
// LOAD CARD FROM URL HASH
// =====================================================

function loadFromHash() {

  const hash =
    location.hash;


  if (
    !hash.startsWith(
      "#card="
    )
  ) {

    return false;

  }


  try {

    const payload =
      JSON.parse(
        decodeURIComponent(
          hash.slice(6)
        )
      );


    // โหลดเข้า state
    state.recipient =
      payload.r || "";

    state.title =
      payload.t ||
      "Happy Birthday!";

    state.message =
      payload.m ||
      "";

    state.sender =
      payload.s ||
      "";

    state.theme =
      payload.th ||
      "pink";

    state.music =
      payload.music ||
      null;

    state.musicName =
      state.music
        ? getMusicServiceName(
            state.music
          )
        : "";


    // ใส่กลับเข้า form
    $("recipient").value =
      state.recipient;

    $("titleInput").value =
      state.title;

    $("message").value =
      state.message;

    $("sender").value =
      state.sender;


    // Music
    musicUrl =
      state.music || "";

    $("musicInput").value =
      musicUrl;

    $("musicInfo").textContent =
      state.music
        ? `🎵 ${state.music}`
        : "ยังไม่ได้ใส่ลิงก์เพลง";


    // Theme
    document
      .querySelectorAll(
        ".theme-option"
      )
      .forEach(b =>
        b.classList.toggle(
          "selected",
          b.dataset.theme ===
          state.theme
        )
      );


    // Images
    imageFiles = [];

    state.images =
      payload.imgs || [];


    updatePreview();


    // Card
    $("cardTitle").textContent =
      state.title;

    $("cardRecipient").textContent =
      state.recipient;

    $("cardMessage").textContent =
      state.message;

    $("cardSender").textContent =
      state.sender
        ? `— ${state.sender} —`
        : "— ด้วยความปรารถนาดี —";


    applyTheme(
      $("fullCard"),
      state.theme
    );


    // Gallery
    $("gallery").innerHTML =
      "";


    (
      payload.imgs || []
    ).forEach(
      src => {

        const img =
          document.createElement(
            "img"
          );

        img.src =
          src;

        $("gallery")
          .appendChild(img);

      }
    );


    // Music player
    if (state.music) {

      $("musicName")
        .textContent =
        state.musicName;

      $("musicLink")
        .href =
        state.music;

      $("musicPlayer")
        .classList
        .remove("hidden");

    } else {

      $("musicPlayer")
        .classList
        .add("hidden");

    }


    showPage("card");

    return true;


  } catch (err) {

    console.error(
      err
    );

    return false;

  }

}


// =====================================================
// DECORATIVE BACKGROUND
// =====================================================

(function createParticles() {

  const box =
    $("particles");

  const symbols = [
    "♡",
    "✦",
    "✧",
    "•"
  ];


  for (
    let i = 0;
    i < 30;
    i++
  ) {

    const p =
      document.createElement(
        "span"
      );

    p.className =
      "particle";

    p.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    p.style.left =
      Math.random() *
      100 +
      "%";


    p.style.animationDuration =
      (
        7 +
        Math.random() *
        9
      ) +
      "s";


    p.style.animationDelay =
      (
        -Math.random() *
        12
      ) +
      "s";


    p.style.fontSize =
      (
        10 +
        Math.random() *
        18
      ) +
      "px";


    box.appendChild(
      p
    );

  }

})();


// =====================================================
// START APP
// =====================================================

updatePreview();


// ถ้ามี #card= ใน URL
// ให้โหลดจาก URL ก่อน
//
// ถ้าไม่มี
// ให้โหลดการ์ดที่บันทึกไว้ในเครื่อง

if (!loadFromHash()) {

  if (loadSavedCard()) {

    showPage("card");

  }

}
