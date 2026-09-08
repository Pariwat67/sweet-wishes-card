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

const STORAGE_KEY = "sweetWishesCard";

const pages = {
  landing: $("landing"),
  creator: $("creator"),
  card: $("cardPage")
};

function showPage(name) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyTheme(el, theme) {
  el.classList.remove(
    "theme-pink",
    "theme-blue",
    "theme-purple",
    "theme-cream"
  );
  el.classList.add(`theme-${theme}`);
}

function updatePreview() {
  $("miniTitle").textContent =
    $("titleInput").value || "Happy Birthday!";

  $("miniRecipient").textContent =
    $("recipient").value || "ชื่อคนรับ";

  $("miniMessage").textContent =
    $("message").value ||
    "คำอวยพรของคุณจะปรากฏตรงนี้...";

  $("miniSender").textContent =
    $("sender").value
      ? `— ${$("sender").value} —`
      : "— จากใคร —";

  applyTheme($("miniCard"), state.theme);
}

["recipient", "titleInput", "message", "sender"].forEach(id => {
  $(id).addEventListener("input", updatePreview);
});

document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".theme-option")
      .forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");

    state.theme = btn.dataset.theme;

    updatePreview();
  });
});

let imageFiles = [];

$("imageInput").addEventListener("change", (e) => {
  imageFiles = Array.from(e.target.files).slice(0, 6);
  renderImageList();
});

function renderImageList() {
  const list = $("imageList");

  list.innerHTML = "";

  imageFiles.forEach((file, index) => {
    const wrap = document.createElement("div");
    wrap.className = "upload-thumb";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    const remove = document.createElement("button");

    remove.type = "button";
    remove.className = "remove-img";
    remove.textContent = "×";

    remove.onclick = () => {
      imageFiles.splice(index, 1);
      renderImageList();
    };

    wrap.append(img, remove);
    list.appendChild(wrap);
  });
}

let musicUrl = "";

$("musicInput").addEventListener("input", (e) => {
  musicUrl = e.target.value.trim();

  $("musicInfo").textContent = musicUrl
    ? `🎵 ${musicUrl}`
    : "ยังไม่ได้ใส่ลิงก์เพลง";
});

$("startBtn").onclick = () => showPage("creator");

$("createTopBtn").onclick = () => showPage("creator");

$("backBtn").onclick = () => showPage("landing");

$("previewBtn").onclick = async () => {
  if (!$("recipient").value.trim()) {
    alert("ใส่ชื่อคนรับก่อนนะ 😊");
    $("recipient").focus();
    return;
  }

  await buildCard();

  showPage("card");
};

$("editBtn").onclick = () => showPage("creator");

$("loadDemoBtn").onclick = () => {
  $("recipient").value = "คนพิเศษ";

  $("titleInput").value = "Happy Birthday!";

  $("message").value =
    "ขอให้วันนี้เต็มไปด้วยรอยยิ้ม\n" +
    "ขอให้ทุกวันที่ผ่านไปมีแต่เรื่องดี ๆ\n" +
    "และขอให้ความฝันของเธอค่อย ๆ เป็นจริงนะ 💗";

  $("sender").value =
    "คนที่อยากเห็นเธอมีความสุข";

  state.theme = "pink";

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

$("cardForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!$("recipient").value.trim()) {
    alert("กรุณาใส่ชื่อคนรับ");
    return;
  }

  await buildCard();

  showPage("card");
});

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function getMusicServiceName(url) {
  try {
    const u = new URL(url);

    const host = u.hostname.toLowerCase();

    if (
      host.includes("youtube.com") ||
      host.includes("youtu.be")
    ) {
      return "เพลงจาก YouTube";
    }

    if (host.includes("spotify.com")) {
      return "เพลงจาก Spotify";
    }

    return "เพลงของเรา";

  } catch {
    return "เพลงของเรา";
  }
}


/* ==================================================
   LOCAL STORAGE
   ================================================== */

function saveCard() {
  try {
    const data = {
      recipient: state.recipient,
      title: state.title,
      message: state.message,
      sender: state.sender,
      theme: state.theme,
      images: state.images,
      music: state.music || "",
      musicName: state.musicName || ""
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

  } catch (err) {
    console.warn(
      "ไม่สามารถบันทึกการ์ดลงเครื่องได้:",
      err
    );
  }
}

function loadSavedCard() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return false;
    }

    const data = JSON.parse(raw);

    $("recipient").value =
      data.recipient || "";

    $("titleInput").value =
      data.title || "Happy Birthday!";

    $("message").value =
      data.message || "";

    $("sender").value =
      data.sender || "";

    state.recipient =
      data.recipient || "";

    state.title =
      data.title || "Happy Birthday!";

    state.message =
      data.message || "";

    state.sender =
      data.sender || "";

    state.theme =
      data.theme || "pink";

    state.images =
      Array.isArray(data.images)
        ? data.images
        : [];

    state.music =
      data.music || "";

    state.musicName =
      data.musicName ||
      (
        state.music
          ? getMusicServiceName(state.music)
          : ""
      );

    musicUrl = state.music;

    $("musicInput").value =
      state.music || "";

    $("musicInfo").textContent =
      state.music
        ? `🎵 ${state.music}`
        : "ยังไม่ได้ใส่ลิงก์เพลง";

    document
      .querySelectorAll(".theme-option")
      .forEach(b => {
        b.classList.toggle(
          "selected",
          b.dataset.theme === state.theme
        );
      });

    updatePreview();

    renderFullCard();

    return true;

  } catch (err) {
    console.warn(
      "โหลดการ์ดที่บันทึกไว้ไม่ได้:",
      err
    );

    return false;
  }
}


/* ==================================================
   RENDER CARD
   ================================================== */

function renderFullCard() {
  $("cardTitle").textContent =
    state.title || "Happy Birthday!";

  $("cardRecipient").textContent =
    state.recipient || "";

  $("cardMessage").textContent =
    state.message || "";

  $("cardSender").textContent =
    state.sender
      ? `— ${state.sender} —`
      : "— ด้วยความรักและความปรารถนาดี —";

  applyTheme(
    $("fullCard"),
    state.theme
  );

  const gallery = $("gallery");

  gallery.innerHTML = "";

  (state.images || []).forEach(src => {
    const img =
      document.createElement("img");

    img.src = src;

    gallery.appendChild(img);
  });

  if (state.music) {
    $("musicName").textContent =
      state.musicName ||
      getMusicServiceName(state.music);

    $("musicLink").href =
      state.music;

    $("musicPlayer")
      .classList
      .remove("hidden");

  } else {

    $("musicPlayer")
      .classList
      .add("hidden");

    $("musicLink")
      .removeAttribute("href");
  }
}


/* ==================================================
   BUILD CARD
   ================================================== */

async function buildCard() {

  state.recipient =
    $("recipient").value.trim();

  state.title =
    $("titleInput").value.trim() ||
    "Happy Birthday!";

  state.message =
    $("message").value.trim() ||
    "ขอให้มีความสุขมาก ๆ ในทุกวันนะ 💗";

  state.sender =
    $("sender").value.trim();


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


  applyTheme(
    $("fullCard"),
    state.theme
  );


  const gallery =
    $("gallery");

  gallery.innerHTML = "";

  state.images = [];


  for (const file of imageFiles) {

    const data =
      await fileToDataURL(file);

    state.images.push(data);

    const img =
      document.createElement("img");

    img.src = data;

    gallery.appendChild(img);
  }


  const musicPlayer =
    $("musicPlayer");

  const musicLink =
    $("musicLink");

  const url =
    musicUrl.trim();


  if (url) {

    state.music = url;

    state.musicName =
      getMusicServiceName(url);

    $("musicName").textContent =
      state.musicName;

    musicLink.href =
      url;

    musicPlayer
      .classList
      .remove("hidden");

  } else {

    state.music = null;

    state.musicName = "";

    musicPlayer
      .classList
      .add("hidden");

    musicLink
      .removeAttribute("href");
  }


  $("cake")
    .classList
    .remove("blown");

  $("blowMessage")
    .classList
    .add("hidden");


  // บันทึกการ์ดไว้ในเครื่อง
  saveCard();
}


/* ==================================================
   CAKE / CONFETTI
   ================================================== */

$("blowBtn").onclick = () => {

  $("cake")
    .classList
    .add("blown");

  $("blowMessage")
    .classList
    .remove("hidden");

  confetti();
};

function confetti() {

  const symbols = [
    "🎉",
    "✨",
    "💗",
    "🌸",
    "⭐"
  ];

  for (let i = 0; i < 35; i++) {

    const el =
      document.createElement("span");

    el.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];

    el.style.position = "fixed";

    el.style.left =
      Math.random() * 100 + "vw";

    el.style.top = "-30px";

    el.style.fontSize =
      14 + Math.random() * 20 + "px";

    el.style.zIndex = 100;

    el.style.transition =
      `transform ${
        1.5 + Math.random() * 1.5
      }s ease, opacity 2s`;

    document.body.appendChild(el);


    requestAnimationFrame(() => {

      el.style.transform =
        `translate(${
          (Math.random() - 0.5) * 180
        }px, ${
          window.innerHeight + 80
        }px) rotate(${
          Math.random() * 700
        }deg)`;

      el.style.opacity = "0";
    });


    setTimeout(
      () => el.remove(),
      3500
    );
  }
}


/* ==================================================
   SHARE / QR
   ================================================== */

/*
  สำคัญมาก

  QR จะไม่เก็บรูป Base64 อีกต่อไป

  เพราะรูปทำให้ URL ยาวมาก
  และทำให้ QR แน่นจนมือถือสแกนไม่ได้

  QR จะเก็บเฉพาะ:

  - ชื่อผู้รับ
  - หัวข้อ
  - ข้อความ
  - ผู้ส่ง
  - ธีม
  - ลิงก์เพลง
*/


function encodeShareData(data) {

  const json =
    JSON.stringify(data);

  const bytes =
    new TextEncoder()
      .encode(json);

  let binary = "";

  const chunkSize =
    0x8000;


  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {

    binary +=
      String.fromCharCode(
        ...bytes.subarray(
          i,
          i + chunkSize
        )
      );
  }


  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


function decodeShareData(encoded) {

  const base64 =
    encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/");


  const padded =
    base64 +
    "=".repeat(
      (4 - (base64.length % 4)) % 4
    );


  const binary =
    atob(padded);


  const bytes =
    Uint8Array.from(
      binary,
      c => c.charCodeAt(0)
    );


  return JSON.parse(
    new TextDecoder()
      .decode(bytes)
  );
}


function createSharePayload() {

  /*
    ห้ามใส่ state.images ลง QR

    เพราะรูปจะทำให้ QR ใหญ่มาก
  */

  const data = {

    r:
      state.recipient || "",

    t:
      state.title ||
      "Happy Birthday!",

    m:
      state.message || "",

    s:
      state.sender || "",

    th:
      state.theme || "pink",

    mu:
      state.music || ""
  };


  return encodeShareData(data);
}


function makeShareUrl() {

  return (
    `${location.origin}` +
    `${location.pathname}` +
    `#card=${createSharePayload()}`
  );
}


/* ==================================================
   COPY SHARE LINK
   ================================================== */

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


/* ==================================================
   QR CODE
   ================================================== */

$("qrBtn").onclick = () => {

  const url =
    makeShareUrl();

  const box =
    $("qrcode");

  box.innerHTML = "";


  /*
    QR ใช้ข้อมูลสั้นลงแล้ว

    ECC = M
    ขนาด = 260x260
    margin = 12
  */

  const img =
    document.createElement("img");


  img.width = 260;

  img.height = 260;

  img.alt = "QR Code";

  img.loading = "eager";


  img.src =
    "https://api.qrserver.com/v1/create-qr-code/" +
    "?size=260x260" +
    "&ecc=M" +
    "&margin=12" +
    "&data=" +
    encodeURIComponent(url);


  box.appendChild(img);


  $("qrWarning").textContent =
    "QR นี้เก็บเฉพาะข้อมูลข้อความของการ์ด " +
    "ไม่เก็บรูป เพื่อให้สแกนง่ายขึ้น";


  $("qrModal")
    .classList
    .remove("hidden");
};


$("closeQr").onclick = () => {

  $("qrModal")
    .classList
    .add("hidden");
};


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


/* ==================================================
   COPY LINK BUTTON
   ================================================== */

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


      setTimeout(() => {

        $("copyLinkBtn")
          .textContent =
          "🔗 คัดลอกลิงก์";

      }, 1500);


    } catch {

      prompt(
        "คัดลอกลิงก์:",
        url
      );
    }
  };


/* ==================================================
   LOAD CARD FROM QR
   ================================================== */

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
      decodeShareData(
        hash.slice(6)
      );


    $("recipient").value =
      payload.r || "";


    $("titleInput").value =
      payload.t ||
      "Happy Birthday!";


    $("message").value =
      payload.m || "";


    $("sender").value =
      payload.s || "";


    state.recipient =
      payload.r || "";


    state.title =
      payload.t ||
      "Happy Birthday!";


    state.message =
      payload.m || "";


    state.sender =
      payload.s || "";


    state.theme =
      payload.th || "pink";


    state.music =
      payload.mu || "";


    state.musicName =
      state.music
        ? getMusicServiceName(
            state.music
          )
        : "";


    musicUrl =
      state.music;


    $("musicInput").value =
      state.music;


    $("musicInfo").textContent =
      state.music
        ? `🎵 ${state.music}`
        : "ยังไม่ได้ใส่ลิงก์เพลง";


    /*
      QR ไม่ส่งรูปมา
      เพื่อให้ QR สแกนง่าย
    */

    imageFiles = [];

    state.images = [];


    document
      .querySelectorAll(
        ".theme-option"
      )
      .forEach(b => {

        b.classList.toggle(
          "selected",
          b.dataset.theme ===
          state.theme
        );
      });


    updatePreview();

    renderFullCard();

    showPage("card");


    return true;


  } catch (err) {

    console.error(
      "โหลดข้อมูล QR ไม่สำเร็จ:",
      err
    );

    alert(
      "QR Code นี้ไม่ถูกต้อง " +
      "หรือข้อมูลเสียหาย"
    );

    return false;
  }
}


/* ==================================================
   DECORATIVE BACKGROUND
   ================================================== */

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
      document.createElement("span");


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
      Math.random() * 100 + "%";


    p.style.animationDuration =
      7 +
      Math.random() * 9 +
      "s";


    p.style.animationDelay =
      -Math.random() * 12 +
      "s";


    p.style.fontSize =
      10 +
      Math.random() * 18 +
      "px";


    box.appendChild(p);
  }

})();


/* ==================================================
   START
   ================================================== */

updatePreview();


/*
  ถ้ามีข้อมูลใน URL
  ให้เปิดการ์ดจาก QR ก่อน

  ถ้าไม่มี
  ให้โหลดการ์ดล่าสุดจากเครื่อง
*/

if (!loadFromHash()) {

  if (loadSavedCard()) {

    showPage("card");
  }
}
