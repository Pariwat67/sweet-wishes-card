/* =========================================================
   SWEET WISHES - SCRIPT.JS
   FIXED SHARE LINK + QR CODE VERSION
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  /* =========================================================
     GITHUB IMAGES
     ========================================================= */

  const GITHUB_IMAGES = [
    "images/S__44457989_0.jpg",
    "images/S__48840712_0.jpg",
    "images/S__48840715_0.jpg",
    "images/S__48840716_0.jpg"
  ];

  /* =========================================================
     STATE
     ========================================================= */

  const state = {
    recipient: "",
    title: "Happy Birthday!",
    message: "",
    sender: "",
    theme: "pink",
    images: [...GITHUB_IMAGES],
    music: "",
    musicName: ""
  };

  const STORAGE_KEY = "sweetWishesCard";

  let imageFiles = [];
  let musicUrl = "";

  /* =========================================================
     PAGES
     ========================================================= */

  const pages = {
    landing: $("landing"),
    creator: $("creator"),
    card: $("cardPage")
  };

  function showPage(name) {

    Object.values(pages).forEach(page => {

      if (page) {
        page.classList.remove("active");
      }

    });

    if (pages[name]) {
      pages[name].classList.add("active");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =========================================================
     THEME
     ========================================================= */

  function applyTheme(element, theme) {

    if (!element) return;

    element.classList.remove(
      "theme-pink",
      "theme-blue",
      "theme-purple",
      "theme-cream"
    );

    const allowedThemes = [
      "pink",
      "blue",
      "purple",
      "cream"
    ];

    if (!allowedThemes.includes(theme)) {
      theme = "pink";
    }

    element.classList.add(`theme-${theme}`);
  }

  /* =========================================================
     PREVIEW
     ========================================================= */

  function updatePreview() {

    const miniTitle = $("miniTitle");
    const miniRecipient = $("miniRecipient");
    const miniMessage = $("miniMessage");
    const miniSender = $("miniSender");
    const miniCard = $("miniCard");

    if (miniTitle) {

      miniTitle.textContent =
        $("titleInput")?.value ||
        "Happy Birthday!";

    }

    if (miniRecipient) {

      miniRecipient.textContent =
        $("recipient")?.value ||
        "ชื่อคนรับ";

    }

    if (miniMessage) {

      miniMessage.textContent =
        $("message")?.value ||
        "คำอวยพรของคุณจะปรากฏตรงนี้...";

    }

    if (miniSender) {

      const sender =
        $("sender")?.value || "";

      miniSender.textContent =
        sender
          ? `— ${sender} —`
          : "— จากใคร —";

    }

    applyTheme(
      miniCard,
      state.theme
    );

  }

  ["recipient", "titleInput", "message", "sender"]
    .forEach(id => {

      const input = $(id);

      if (input) {

        input.addEventListener(
          "input",
          updatePreview
        );

      }

    });

  /* =========================================================
     THEME BUTTONS
     ========================================================= */

  document
    .querySelectorAll(".theme-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".theme-option")
            .forEach(btn =>
              btn.classList.remove("selected")
            );

          button.classList.add("selected");

          state.theme =
            button.dataset.theme ||
            "pink";

          updatePreview();

        }
      );

    });

  /* =========================================================
     IMAGE INPUT
     ========================================================= */

  const imageInput = $("imageInput");

  if (imageInput) {

    imageInput.addEventListener(
      "change",
      event => {

        imageFiles =
          Array.from(
            event.target.files || []
          ).slice(0, 6);

        renderImageList();

      }
    );

  }

  function renderImageList() {

    const list = $("imageList");

    if (!list) return;

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

        img.alt =
          "รูปภาพที่เลือก";

        const remove =
          document.createElement("button");

        remove.type =
          "button";

        remove.className =
          "remove-img";

        remove.textContent =
          "×";

        remove.addEventListener(
          "click",
          () => {

            imageFiles.splice(
              index,
              1
            );

            renderImageList();

          }
        );

        wrap.append(
          img,
          remove
        );

        list.appendChild(wrap);

      }
    );

  }

  /* =========================================================
     MUSIC
     ========================================================= */

  const musicInput =
    $("musicInput");

  if (musicInput) {

    musicInput.addEventListener(
      "input",
      event => {

        musicUrl =
          event.target.value.trim();

        const info =
          $("musicInfo");

        if (!info) return;

        info.textContent =
          musicUrl
            ? `🎵 ${musicUrl}`
            : "ยังไม่ได้ใส่ลิงก์เพลง";

      }
    );

  }

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

  /* =========================================================
     BUTTONS
     ========================================================= */

  const startBtn =
    $("startBtn");

  if (startBtn) {

    startBtn.onclick =
      () => showPage("creator");

  }

  const createTopBtn =
    $("createTopBtn");

  if (createTopBtn) {

    createTopBtn.onclick =
      () => showPage("creator");

  }

  const backBtn =
    $("backBtn");

  if (backBtn) {

    backBtn.onclick =
      () => showPage("landing");

  }

  const editBtn =
    $("editBtn");

  if (editBtn) {

    editBtn.onclick =
      () => showPage("creator");

  }

  /* =========================================================
     DEMO
     ========================================================= */

  const loadDemoBtn =
    $("loadDemoBtn");

  if (loadDemoBtn) {

    loadDemoBtn.onclick =
      () => {

        if ($("recipient")) {

          $("recipient").value =
            "คนพิเศษ";

        }

        if ($("titleInput")) {

          $("titleInput").value =
            "Happy Birthday!";

        }

        if ($("message")) {

          $("message").value =
            "ขอให้วันนี้เต็มไปด้วยรอยยิ้ม\n" +
            "ขอให้ทุกวันที่ผ่านไปมีแต่เรื่องดี ๆ\n" +
            "และขอให้ความฝันของเธอค่อย ๆ เป็นจริงนะ 💗";

        }

        if ($("sender")) {

          $("sender").value =
            "คนที่อยากเห็นเธอมีความสุข";

        }

        state.theme =
          "pink";

        document
          .querySelectorAll(".theme-option")
          .forEach(button => {

            button.classList.toggle(
              "selected",
              button.dataset.theme === "pink"
            );

          });

        updatePreview();

        showPage("creator");

      };

  }

  /* =========================================================
     SAVE CARD
     ========================================================= */

  function saveCard() {

    try {

      const data = {

        recipient:
          state.recipient,

        title:
          state.title,

        message:
          state.message,

        sender:
          state.sender,

        theme:
          state.theme,

        images:
          [...GITHUB_IMAGES],

        music:
          state.music || "",

        musicName:
          state.musicName || ""

      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    } catch (error) {

      console.warn(
        "ไม่สามารถบันทึกการ์ดลงเครื่องได้:",
        error
      );

    }

  }

  /* =========================================================
     LOAD SAVED CARD
     ========================================================= */

  function loadSavedCard() {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        return false;
      }

      const data =
        JSON.parse(raw);

      if ($("recipient")) {

        $("recipient").value =
          data.recipient || "";

      }

      if ($("titleInput")) {

        $("titleInput").value =
          data.title ||
          "Happy Birthday!";

      }

      if ($("message")) {

        $("message").value =
          data.message || "";

      }

      if ($("sender")) {

        $("sender").value =
          data.sender || "";

      }

      state.recipient =
        data.recipient || "";

      state.title =
        data.title ||
        "Happy Birthday!";

      state.message =
        data.message || "";

      state.sender =
        data.sender || "";

      state.theme =
        data.theme || "pink";

      state.images =
        [...GITHUB_IMAGES];

      state.music =
        data.music || "";

      state.musicName =
        data.musicName ||
        (
          state.music
            ? getMusicServiceName(
                state.music
              )
            : ""
        );

      musicUrl =
        state.music;

      if ($("musicInput")) {

        $("musicInput").value =
          state.music;

      }

      if ($("musicInfo")) {

        $("musicInfo").textContent =
          state.music
            ? `🎵 ${state.music}`
            : "ยังไม่ได้ใส่ลิงก์เพลง";

      }

      document
        .querySelectorAll(".theme-option")
        .forEach(button => {

          button.classList.toggle(
            "selected",
            button.dataset.theme ===
              state.theme
          );

        });

      updatePreview();

      renderFullCard();

      return true;

    } catch (error) {

      console.warn(
        "โหลดการ์ดที่บันทึกไว้ไม่ได้:",
        error
      );

      return false;

    }

  }

  /* =========================================================
     RENDER FULL CARD
     ========================================================= */

  function renderFullCard() {

    if ($("cardTitle")) {

      $("cardTitle").textContent =
        state.title ||
        "Happy Birthday!";

    }

    if ($("cardRecipient")) {

      $("cardRecipient").textContent =
        state.recipient || "";

    }

    if ($("cardMessage")) {

      $("cardMessage").textContent =
        state.message || "";

    }

    if ($("cardSender")) {

      $("cardSender").textContent =
        state.sender
          ? `— ${state.sender} —`
          : "— ด้วยความรักและความปรารถนาดี —";

    }

    applyTheme(
      $("fullCard"),
      state.theme
    );

    /* =====================================================
       IMAGE GALLERY
       ===================================================== */

    const gallery =
      $("gallery");

    if (gallery) {

      gallery.innerHTML = "";

      GITHUB_IMAGES.forEach(
        src => {

          const img =
            document.createElement("img");

          img.src =
            src;

          img.alt =
            "รูปภาพในการ์ด";

          img.loading =
            "lazy";

          gallery.appendChild(img);

        }
      );

    }

    /* =====================================================
       MUSIC
       ===================================================== */

    const musicPlayer =
      $("musicPlayer");

    const musicLink =
      $("musicLink");

    const musicName =
      $("musicName");

    if (state.music) {

      if (musicName) {

        musicName.textContent =
          state.musicName ||
          getMusicServiceName(
            state.music
          );

      }

      if (musicLink) {

        musicLink.href =
          state.music;

        musicLink.target =
          "_blank";

        musicLink.rel =
          "noopener noreferrer";

      }

      if (musicPlayer) {

        musicPlayer.classList.remove(
          "hidden"
        );

      }

    } else {

      if (musicPlayer) {

        musicPlayer.classList.add(
          "hidden"
        );

      }

      if (musicLink) {

        musicLink.removeAttribute(
          "href"
        );

      }

    }

  }

  /* =========================================================
     BUILD CARD
     ========================================================= */

  async function buildCard() {

    state.recipient =
      $("recipient")?.value.trim() ||
      "";

    state.title =
      $("titleInput")?.value.trim() ||
      "Happy Birthday!";

    state.message =
      $("message")?.value.trim() ||
      "ขอให้มีความสุขมาก ๆ ในทุกวันนะ 💗";

    state.sender =
      $("sender")?.value.trim() ||
      "";

    if ($("cardTitle")) {

      $("cardTitle").textContent =
        state.title;

    }

    if ($("cardRecipient")) {

      $("cardRecipient").textContent =
        state.recipient;

    }

    if ($("cardMessage")) {

      $("cardMessage").textContent =
        state.message;

    }

    if ($("cardSender")) {

      $("cardSender").textContent =
        state.sender
          ? `— ${state.sender} —`
          : "— ด้วยความรักและความปรารถนาดี —";

    }

    applyTheme(
      $("fullCard"),
      state.theme
    );

    state.images =
      [...GITHUB_IMAGES];

    const gallery =
      $("gallery");

    if (gallery) {

      gallery.innerHTML = "";

      state.images.forEach(
        src => {

          const img =
            document.createElement("img");

          img.src =
            src;

          img.alt =
            "รูปภาพในการ์ด";

          img.loading =
            "lazy";

          gallery.appendChild(img);

        }
      );

    }

    /* =====================================================
       MUSIC
       ===================================================== */

    const musicPlayer =
      $("musicPlayer");

    const musicLink =
      $("musicLink");

    const musicName =
      $("musicName");

    const url =
      musicUrl.trim();

    if (url) {

      state.music =
        url;

      state.musicName =
        getMusicServiceName(
          url
        );

      if (musicName) {

        musicName.textContent =
          state.musicName;

      }

      if (musicLink) {

        musicLink.href =
          url;

        musicLink.target =
          "_blank";

        musicLink.rel =
          "noopener noreferrer";

      }

      if (musicPlayer) {

        musicPlayer.classList.remove(
          "hidden"
        );

      }

    } else {

      state.music =
        "";

      state.musicName =
        "";

      if (musicPlayer) {

        musicPlayer.classList.add(
          "hidden"
        );

      }

      if (musicLink) {

        musicLink.removeAttribute(
          "href"
        );

      }

    }

    if ($("cake")) {

      $("cake").classList.remove(
        "blown"
      );

    }

    if ($("blowMessage")) {

      $("blowMessage").classList.add(
        "hidden"
      );

    }

    saveCard();

  }

  /* =========================================================
     PREVIEW BUTTON
     ========================================================= */

  const previewBtn =
    $("previewBtn");

  if (previewBtn) {

    previewBtn.onclick =
      async () => {

        const recipient =
          $("recipient")?.value.trim();

        if (!recipient) {

          alert(
            "ใส่ชื่อคนรับก่อนนะ 😊"
          );

          $("recipient")?.focus();

          return;

        }

        await buildCard();

        showPage("card");

      };

  }

  /* =========================================================
     FORM SUBMIT
     ========================================================= */

  const cardForm =
    $("cardForm");

  if (cardForm) {

    cardForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const recipient =
          $("recipient")?.value.trim();

        if (!recipient) {

          alert(
            "กรุณาใส่ชื่อคนรับ"
          );

          $("recipient")?.focus();

          return;

        }

        await buildCard();

        showPage("card");

      }
    );

  }

  /* =========================================================
     BLOW CANDLE EFFECT
     ========================================================= */

  function createBlowCelebration() {

    const cake =
      $("cake");

    if (!cake) return;

    const rect =
      cake.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height * 0.18;

    /* BURST */

    const burst =
      document.createElement("div");

    burst.className =
      "blow-burst";

    burst.style.left =
      `${centerX - 18}px`;

    burst.style.top =
      `${centerY - 18}px`;

    document.body.appendChild(
      burst
    );

    setTimeout(
      () => burst.remove(),
      1000
    );

    /* HEARTS */

    const hearts = [
      "❤️",
      "💕",
      "💖",
      "💗",
      "💓",
      "💘",
      "💝",
      "♥️"
    ];

    for (
      let i = 0;
      i < 34;
      i++
    ) {

      const heart =
        document.createElement("div");

      heart.className =
        "blow-heart";

      heart.textContent =
        hearts[
          Math.floor(
            Math.random() *
            hearts.length
          )
        ];

      const startX =
        centerX +
        (Math.random() - 0.5) *
        70;

      const startY =
        centerY +
        (Math.random() - 0.5) *
        35;

      heart.style.left =
        `${startX}px`;

      heart.style.top =
        `${startY}px`;

      heart.style.fontSize =
        `${17 + Math.random() * 27}px`;

      heart.style.setProperty(
        "--duration",
        `${1.9 + Math.random() * 1.8}s`
      );

      heart.style.setProperty(
        "--x1",
        `${(Math.random() - 0.5) * 110}px`
      );

      heart.style.setProperty(
        "--x2",
        `${(Math.random() - 0.5) * 210}px`
      );

      heart.style.setProperty(
        "--x3",
        `${(Math.random() - 0.5) * 330}px`
      );

      heart.style.setProperty(
        "--r1",
        `${(Math.random() - 0.5) * 60}deg`
      );

      heart.style.setProperty(
        "--r2",
        `${(Math.random() - 0.5) * 120}deg`
      );

      heart.style.setProperty(
        "--r3",
        `${(Math.random() - 0.5) * 180}deg`
      );

      document.body.appendChild(
        heart
      );

      setTimeout(
        () => heart.remove(),
        4100
      );

    }

    /* SPARKLES */

    const sparkles = [
      "✨",
      "✦",
      "✧",
      "⋆",
      "⭐",
      "💫"
    ];

    for (
      let i = 0;
      i < 26;
      i++
    ) {

      const sparkle =
        document.createElement("div");

      sparkle.className =
        "blow-sparkle";

      sparkle.textContent =
        sparkles[
          Math.floor(
            Math.random() *
            sparkles.length
          )
        ];

      sparkle.style.left =
        `${centerX + (Math.random() - 0.5) * 90}px`;

      sparkle.style.top =
        `${centerY + (Math.random() - 0.5) * 40}px`;

      sparkle.style.fontSize =
        `${12 + Math.random() * 20}px`;

      sparkle.style.setProperty(
        "--duration",
        `${1.2 + Math.random() * 1.5}s`
      );

      sparkle.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 160}px`
      );

      sparkle.style.setProperty(
        "--x2",
        `${(Math.random() - 0.5) * 260}px`
      );

      document.body.appendChild(
        sparkle
      );

      setTimeout(
        () => sparkle.remove(),
        3000
      );

    }

    /* BIG HEART */

    const bigHeart =
      document.createElement("div");

    bigHeart.className =
      "blow-big-heart";

    bigHeart.textContent =
      "💖";

    bigHeart.style.left =
      `${centerX}px`;

    bigHeart.style.top =
      `${centerY}px`;

    document.body.appendChild(
      bigHeart
    );

    setTimeout(
      () => bigHeart.remove(),
      1600
    );

  }

  /* =========================================================
     CONFETTI
     ========================================================= */

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
        document.createElement("span");

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
        `${Math.random() * 100}vw`;

      el.style.top =
        "-30px";

      el.style.fontSize =
        `${14 + Math.random() * 20}px`;

      el.style.zIndex =
        "1000";

      el.style.pointerEvents =
        "none";

      const duration =
        1.5 +
        Math.random() * 1.5;

      el.style.transition =
        `transform ${duration}s ease, opacity 2s`;

      document.body.appendChild(
        el
      );

      requestAnimationFrame(
        () => {

          const x =
            (Math.random() - 0.5) *
            180;

          const y =
            window.innerHeight +
            80;

          const rotation =
            Math.random() *
            700;

          el.style.transform =
            `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

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

  /* =========================================================
     BLOW BUTTON
     ========================================================= */

  const blowBtn =
    $("blowBtn");

  if (blowBtn) {

    blowBtn.onclick =
      () => {

        const cake =
          $("cake");

        if (!cake) return;

        if (
          cake.classList.contains(
            "blown"
          )
        ) {

          return;

        }

        cake.classList.add(
          "blown"
        );

        const blowMessage =
          $("blowMessage");

        if (blowMessage) {

          blowMessage.classList.remove(
            "hidden"
          );

        }

        createBlowCelebration();

        confetti();

      };

  }

  /* =========================================================
     SHARE DATA
     ========================================================= */

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

  /* =========================================================
     FIXED DECODE
     ========================================================= */

  function decodeShareData(encoded) {

    if (!encoded) {

      throw new Error(
        "ไม่มีข้อมูลการ์ด"
      );

    }

    const candidates = [];

    let value =
      String(encoded).trim();

    try {

      value =
        decodeURIComponent(value);

    } catch {}

    candidates.push(value);

    // รองรับ JSON ตรง ๆ เผื่อเป็นลิงก์รุ่นเก่า
    if (
      value.startsWith("{") &&
      value.endsWith("}")
    ) {

      try {

        const data =
          JSON.parse(value);

        if (
          data &&
          typeof data === "object"
        ) {

          return data;

        }

      } catch {}

    }

    // รองรับ Base64URL และ Base64 ปกติ
    let base64 =
      value
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .replace(/\s/g, "");

    while (
      base64.length % 4 !== 0
    ) {

      base64 += "=";

    }

    candidates.push(base64);

    for (
      const candidate of candidates
    ) {

      try {

        const binary =
          atob(candidate);

        const bytes =
          new Uint8Array(
            binary.length
          );

        for (
          let i = 0;
          i < binary.length;
          i++
        ) {

          bytes[i] =
            binary.charCodeAt(i);

        }

        const json =
          new TextDecoder(
            "utf-8"
          ).decode(bytes);

        const data =
          JSON.parse(json);

        if (
          data &&
          typeof data === "object"
        ) {

          return data;

        }

      } catch {}

    }

    throw new Error(
      "ข้อมูลการ์ดไม่ถูกต้อง"
    );

  }

  /* =========================================================
     CREATE SHARE PAYLOAD
     ========================================================= */

  function createSharePayload() {

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

    return encodeShareData(
      data
    );

  }

  /* =========================================================
     MAKE SHARE URL
     ========================================================= */

  function makeShareUrl() {

    const payload =
      createSharePayload();

    const baseUrl =
      new URL(
        window.location.origin +
        window.location.pathname
      );

    // ล้าง query/hash เดิม เช่น ?utm_source=...
    baseUrl.search = "";

    baseUrl.hash =
      "card=" +
      payload;

    return baseUrl.toString();

  }

  /* =========================================================
     SHARE BUTTON
     ========================================================= */

  const shareBtn =
    $("shareBtn");

  if (shareBtn) {

    shareBtn.onclick =
      async () => {

        const url =
          makeShareUrl();

        try {

          await navigator.clipboard
            .writeText(url);

          alert(
            "คัดลอกลิงก์การ์ดแล้ว 💗\n" +
            "นำไปส่งให้แฟนได้เลย"
          );

        } catch {

          prompt(
            "คัดลอกลิงก์นี้:",
            url
          );

        }

      };

  }

  /* =========================================================
     QR CODE
     ========================================================= */

  const qrBtn =
    $("qrBtn");

  if (qrBtn) {

    qrBtn.onclick =
      () => {

        const url =
          makeShareUrl();

        const box =
          $("qrcode");

        if (!box) return;

        box.innerHTML = "";

        const img =
          document.createElement("img");

        img.width =
          260;

        img.height =
          260;

        img.alt =
          "QR Code สำหรับเปิดการ์ด";

        img.loading =
          "eager";

        img.src =
          "https://api.qrserver.com/v1/create-qr-code/" +
          "?size=260x260" +
          "&ecc=M" +
          "&margin=12" +
          "&data=" +
          encodeURIComponent(url);

        img.onerror =
          () => {

            box.innerHTML =
              "<p>สร้าง QR Code ไม่สำเร็จ กรุณาลองใหม่</p>";

          };

        box.appendChild(
          img
        );

        const qrWarning =
          $("qrWarning");

        if (qrWarning) {

          qrWarning.textContent =
            "สแกน QR นี้แล้วจะเปิดการ์ดใบนี้โดยตรง 💗";

        }

        const qrModal =
          $("qrModal");

        if (qrModal) {

          qrModal.classList.remove(
            "hidden"
          );

        }

      };

  }

  /* =========================================================
     CLOSE QR
     ========================================================= */

  const closeQr =
    $("closeQr");

  if (closeQr) {

    closeQr.onclick =
      () => {

        const modal =
          $("qrModal");

        if (modal) {

          modal.classList.add(
            "hidden"
          );

        }

      };

  }

  const qrModal =
    $("qrModal");

  if (qrModal) {

    qrModal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          qrModal
        ) {

          qrModal.classList.add(
            "hidden"
          );

        }

      }
    );

  }

  /* =========================================================
     COPY LINK
     ========================================================= */

  const copyLinkBtn =
    $("copyLinkBtn");

  if (copyLinkBtn) {

    copyLinkBtn.onclick =
      async () => {

        const url =
          makeShareUrl();

        try {

          await navigator.clipboard
            .writeText(url);

          copyLinkBtn.textContent =
            "คัดลอกแล้ว ✓";

          setTimeout(
            () => {

              copyLinkBtn.textContent =
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

  }
     /* =========================================================
     LOAD CARD FROM SHARE URL / QR
     ========================================================= */

  function loadFromHash() {

    const hash =
      window.location.hash || "";

    if (
      !hash.startsWith("#card=")
    ) {

      return false;

    }

    const encoded =
      hash
        .substring("#card=".length)
        .trim();

    if (!encoded) {

      alert(
        "ลิงก์การ์ดไม่มีข้อมูล กรุณาสร้างลิงก์ใหม่"
      );

      return true;

    }

    // ป้องกันการใช้ลิงก์ตัวอย่างที่มี ...
    if (
      encoded.includes("...") ||
      encoded === "eyJ..."
    ) {

      alert(
        "ลิงก์การ์ดไม่สมบูรณ์ กรุณาสร้างลิงก์ใหม่"
      );

      return true;

    }

    try {

      const payload =
        decodeShareData(
          encoded
        );

      state.recipient =
        payload.r || "";

      state.title =
        payload.t ||
        "Happy Birthday!";

      state.message =
        payload.m || "";

      state.sender =
        payload.s || "";

      const validThemes = [
        "pink",
        "blue",
        "purple",
        "cream"
      ];

      state.theme =
        validThemes.includes(
          payload.th
        )
          ? payload.th
          : "pink";

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

      if ($("recipient")) {

        $("recipient").value =
          state.recipient;

      }

      if ($("titleInput")) {

        $("titleInput").value =
          state.title;

      }

      if ($("message")) {

        $("message").value =
          state.message;

      }

      if ($("sender")) {

        $("sender").value =
          state.sender;

      }

      if ($("musicInput")) {

        $("musicInput").value =
          state.music;

      }

      if ($("musicInfo")) {

        $("musicInfo").textContent =
          state.music
            ? `🎵 ${state.music}`
            : "ยังไม่ได้ใส่ลิงก์เพลง";

      }

      imageFiles = [];

      state.images =
        [...GITHUB_IMAGES];

      document
        .querySelectorAll(".theme-option")
        .forEach(button => {

          button.classList.toggle(
            "selected",
            button.dataset.theme ===
              state.theme
          );

        });

      updatePreview();

      renderFullCard();

      // เปิดการ์ดทันที
      showPage("card");

      // บันทึกไว้ในเครื่อง
      try {

        saveCard();

      } catch {}

      return true;

    } catch (error) {

      console.error(
        "โหลดข้อมูลการ์ดไม่สำเร็จ:",
        error
      );

      alert(
        "ไม่สามารถเปิดการ์ดนี้ได้\n" +
        "ลิงก์อาจไม่ครบหรือข้อมูลเสียหาย กรุณาสร้างลิงก์ใหม่"
      );

      // สำคัญ:
      // มี #card= แล้ว ห้ามย้อนกลับไปใช้
      // localStorage เปิดหน้าอื่นแทน
      return true;

    }

  }

  /* =========================================================
     PARTICLES
     ========================================================= */

  function createParticles() {

    const box =
      $("particles");

    if (!box) return;

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
        `${Math.random() * 100}%`;

      p.style.animationDuration =
        `${7 + Math.random() * 9}s`;

      p.style.animationDelay =
        `${-Math.random() * 12}s`;

      p.style.fontSize =
        `${10 + Math.random() * 18}px`;

      box.appendChild(
        p
      );

    }

  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  updatePreview();

  createParticles();

  /*
    สำคัญที่สุด

    ถ้ามี #card=
    ให้เปิดการ์ดก่อน

    ถ้าไม่มี #card=
    ค่อยโหลดการ์ดที่จำไว้ในเครื่อง
  */

  const openedFromShare =
    loadFromHash();

  // รองรับกรณีเปลี่ยน #card= โดยไม่รีโหลดหน้า
  window.addEventListener(
    "hashchange",
    () => {
      loadFromHash();
    }
  );

  if (!openedFromShare) {

    if (loadSavedCard()) {

      showPage("card");

    } else {

      showPage("landing");

    }

  }

});
