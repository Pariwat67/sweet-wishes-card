/* =========================================================
   SWEET WISHES
   CARD DISPLAY ONLY
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const fullCard = document.getElementById("fullCard");
  const cardTitle = document.getElementById("cardTitle");
  const cardRecipient = document.getElementById("cardRecipient");
  const cardMessage = document.getElementById("cardMessage");
  const cardSender = document.getElementById("cardSender");

  const gallery = document.getElementById("gallery");

  const musicPlayer = document.getElementById("musicPlayer");
  const musicName = document.getElementById("musicName");
  const musicLink = document.getElementById("musicLink");

  const blowBtn = document.getElementById("blowBtn");
  const blowMessage = document.getElementById("blowMessage");

  const particles = document.getElementById("particles");


  /* =========================================================
     DEFAULT DATA
     ========================================================= */

  const DEFAULT_DATA = {
    recipient: "หม่ามี๊",
    title: "Happy Birthday!",
    message: "หม่ามี๊ค้าบบมีความสุขมากๆนะค้าบบขอโทษก่อนเลยที่ไม่ได้อยู่ด้วยในวันสำคัญแบบเค้าเลยตั้งใจทำการ์ดวันเกิดนี้ขึ้นมาจะให่หม่ามี๊ได้ดูคนเดียวโตขึ้นอีกปีแล้วน้าาาเค้าดีใจมากๆเลยที่ได้เจอหม่ามี๊น้าาาเค้าเป็นของขวัญให้ด้วยล่ะเค้าตั้งใจรักมากๆเค้าให้วันเกิดนี้เต็มไปด้วยความสุขของเราสองคนนะคับ จุ๊ปๆ 💗",
    sender: "— คนที่อยากให้เธอมีความสุข —",
    theme: "pink",
    music: "https://youtu.be/1OMZrYHIim8?si=86hEP7g4fmwg5KSY",
    musicName: "เพลงของเรา"
  };


  /* =========================================================
     GALLERY
     ========================================================= */

  const GITHUB_IMAGES = [
    "images/S__44457989_0.jpg",
    "images/S__48840712_0.jpg",
    "images/S__48840715_0.jpg",
    "images/S__48840716_0.jpg"
  ];


  /* =========================================================
     THEME
     ========================================================= */

  const THEMES = [
    "pink",
    "blue",
    "purple",
    "cream"
  ];

  function applyTheme(theme) {

    const selectedTheme = THEMES.includes(theme)
      ? theme
      : "pink";

    if (!fullCard) return;

    fullCard.classList.remove(
      "theme-pink",
      "theme-blue",
      "theme-purple",
      "theme-cream"
    );

    fullCard.classList.add(`theme-${selectedTheme}`);
  }


  /* =========================================================
     UTF-8 BASE64 DECODER
     ========================================================= */

  function decodeBase64UTF8(value) {

    let base64 = String(value || "")
      .trim()
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\s/g, "");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder("utf-8", {
        fatal: true
      }).decode(bytes);
    }

    let result = "";

    for (let i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
    }

    return decodeURIComponent(
      escape(result)
    );
  }


  /* =========================================================
     DECODE SHARE DATA
     ========================================================= */

  function decodeShareData(raw) {

    if (!raw) {
      return null;
    }

    let value = String(raw).trim();

    /*
      กรณี URL ถูก encode เช่น
      %7B%22r%22%3A...
    */

    try {

      if (value.includes("%")) {
        const decodedURL = decodeURIComponent(value);

        if (
          decodedURL.startsWith("{") ||
          decodedURL.startsWith("[")
        ) {
          value = decodedURL;
        }
      }

    } catch (error) {
      // ปล่อยให้ลองวิธีอื่นต่อ
    }


    /*
      ถ้าเป็น JSON ตรง ๆ
    */

    try {

      if (
        value.startsWith("{") &&
        value.endsWith("}")
      ) {
        return JSON.parse(value);
      }

    } catch (error) {
      // ลอง Base64 ต่อ
    }


    /*
      Base64 UTF-8
    */

    try {

      const jsonText = decodeBase64UTF8(value);

      return JSON.parse(jsonText);

    } catch (error) {
      console.error(
        "ไม่สามารถถอดรหัสข้อมูลการ์ดได้:",
        error
      );
    }


    /*
      ลอง decodeURIComponent + Base64
    */

    try {

      const decodedValue = decodeURIComponent(value);

      const jsonText = decodeBase64UTF8(decodedValue);

      return JSON.parse(jsonText);

    } catch (error) {
      console.error(
        "ไม่สามารถถอดรหัสข้อมูลการ์ดได้:",
        error
      );
    }

    return null;
  }


  /* =========================================================
     NORMALIZE DATA
     ========================================================= */

  function normalizeCardData(data) {

    if (!data || typeof data !== "object") {
      return {
        ...DEFAULT_DATA
      };
    }

    return {

      /*
        รองรับทั้งรูปแบบใหม่แบบสั้น

        r = recipient
        t = title
        m = message
        s = sender
        th = theme
        mu = music

        และรูปแบบชื่อเต็ม
      */

      recipient:
        data.r ??
        data.recipient ??
        data.to ??
        DEFAULT_DATA.recipient,

      title:
        data.t ??
        data.title ??
        DEFAULT_DATA.title,

      message:
        data.m ??
        data.message ??
        DEFAULT_DATA.message,

      sender:
        data.s ??
        data.sender ??
        data.from ??
        DEFAULT_DATA.sender,

      theme:
        data.th ??
        data.theme ??
        DEFAULT_DATA.theme,

      music:
        data.mu ??
        data.music ??
        data.musicUrl ??
        "",

      musicName:
        data.musicName ??
        data.songName ??
        "เพลงของเรา"
    };
  }


  /* =========================================================
     RENDER GALLERY
     ========================================================= */

  function renderGallery() {

    if (!gallery) return;

    gallery.innerHTML = "";

    GITHUB_IMAGES.forEach((imagePath, index) => {

      const image = document.createElement("img");

      image.src = imagePath;

      image.alt = `รูปภาพความทรงจำ ${index + 1}`;

      image.loading = "lazy";

      image.addEventListener(
        "error",
        () => {
          image.style.display = "none";
        },
        { once: true }
      );

      gallery.appendChild(image);
    });
  }


  /* =========================================================
     MUSIC
     ========================================================= */

  function getMusicServiceName(url) {

    if (!url) {
      return "เพลงของเรา";
    }

    const lower = url.toLowerCase();

    if (
      lower.includes("youtube.com") ||
      lower.includes("youtu.be")
    ) {
      return "เพลงจาก YouTube";
    }

    if (lower.includes("spotify.com")) {
      return "เพลงจาก Spotify";
    }

    return "เพลงของเรา";
  }


  function renderMusic(musicUrl, customName) {

    if (!musicPlayer || !musicLink || !musicName) {
      return;
    }

    if (!musicUrl) {

      musicPlayer.classList.add("hidden");

      musicLink.removeAttribute("href");

      return;
    }

    musicPlayer.classList.remove("hidden");

    musicName.textContent =
      customName ||
      getMusicServiceName(musicUrl);

    musicLink.href = musicUrl;

    musicLink.target = "_blank";

    musicLink.rel =
      "noopener noreferrer";
  }


  /* =========================================================
     RENDER CARD
     ========================================================= */

  function renderCard(data) {

    const card = normalizeCardData(data);


    if (cardTitle) {
      cardTitle.textContent =
        card.title || DEFAULT_DATA.title;
    }


    if (cardRecipient) {
      cardRecipient.textContent =
        card.recipient ||
        DEFAULT_DATA.recipient;
    }


    if (cardMessage) {
      cardMessage.textContent =
        card.message ||
        DEFAULT_DATA.message;
    }


    if (cardSender) {
      cardSender.textContent =
        card.sender ||
        DEFAULT_DATA.sender;
    }


    applyTheme(card.theme);


    renderGallery();


    renderMusic(
      card.music,
      card.musicName
    );


    /*
      เก็บข้อมูลไว้ใน window
      เผื่อใช้ตรวจสอบผ่าน Console
    */

    window.sweetWishesCard = card;
  }


  /* =========================================================
     SHOW ERROR
     ========================================================= */

  function showError() {

    if (cardTitle) {
      cardTitle.textContent =
        "Sweet Wishes 💗";
    }

    if (cardRecipient) {
      cardRecipient.textContent =
        "มีบางอย่างผิดพลาด";
    }

    if (cardMessage) {
      cardMessage.textContent =
        "ไม่สามารถเปิดข้อมูลการ์ดนี้ได้\n" +
        "ลองเปิดลิงก์ใหม่อีกครั้งนะ 💗";
    }

    if (cardSender) {
      cardSender.textContent =
        "— Sweet Wishes —";
    }

    applyTheme("pink");

    renderGallery();

    if (musicPlayer) {
      musicPlayer.classList.add("hidden");
    }
  }


  /* =========================================================
     LOAD CARD FROM URL HASH
     ========================================================= */

  function loadFromHash() {

    const hash = window.location.hash || "";

    /*
      ต้องขึ้นต้นด้วย

      #card=
    */

    if (!hash.startsWith("#card=")) {

      /*
        ไม่มีข้อมูลการ์ด
        แสดงการ์ดตัวอย่างแทน
      */

      renderCard(DEFAULT_DATA);

      return;
    }


    /*
      สำคัญมาก:
      ตัดเฉพาะ "#card="
      ออกจาก URL
    */

    const encodedData =
      hash.slice("#card=".length);


    if (!encodedData) {

      renderCard(DEFAULT_DATA);

      return;
    }


    const decodedData =
      decodeShareData(encodedData);


    if (!decodedData) {

      console.error(
        "Card data is invalid:",
        encodedData
      );

      showError();

      return;
    }


    console.log(
      "Sweet Wishes card data:",
      decodedData
    );


    renderCard(decodedData);
  }


  /* =========================================================
     BLOW CANDLE
     ========================================================= */

  function blowCandles() {

    const flames =
      document.querySelectorAll(".flame");

    if (!flames.length) {
      return;
    }


    flames.forEach((flame, index) => {

      setTimeout(() => {

        flame.classList.add("blown");

      }, index * 120);

    });


    if (blowBtn) {

      blowBtn.disabled = true;

      blowBtn.textContent =
        "✨ เป่าเรียบร้อยแล้ว";
    }


    if (blowMessage) {

      blowMessage.classList.remove("hidden");

      blowMessage.classList.add(
        "show"
      );
    }


    createConfetti();
  }


  /* =========================================================
     CONFETTI
     ========================================================= */

  function createConfetti() {

    const container =
      document.body;

    const symbols = [
      "💗",
      "💖",
      "💕",
      "✨",
      "🎉",
      "🎂",
      "🌸",
      "⭐"
    ];


    for (let i = 0; i < 45; i++) {

      const confetti =
        document.createElement("span");

      confetti.className =
        "confetti";

      confetti.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      confetti.style.left =
        Math.random() * 100 + "vw";

      confetti.style.animationDelay =
        Math.random() * 0.8 + "s";

      confetti.style.animationDuration =
        2.5 +
        Math.random() * 2 +
        "s";


      container.appendChild(confetti);


      setTimeout(() => {

        confetti.remove();

      }, 5000);
    }
  }


  /* =========================================================
     PARTICLES
     ========================================================= */

  function createParticles() {

    if (!particles) {
      return;
    }

    particles.innerHTML = "";


    const symbols = [
      "♡",
      "♥",
      "✦",
      "✧",
      "•"
    ];


    for (let i = 0; i < 24; i++) {

      const particle =
        document.createElement("span");

      particle.className =
        "particle";

      particle.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      particle.style.left =
        Math.random() * 100 + "%";

      particle.style.top =
        Math.random() * 100 + "%";

      particle.style.animationDelay =
        Math.random() * 4 + "s";

      particle.style.animationDuration =
        3 +
        Math.random() * 4 +
        "s";

      particle.style.opacity =
        0.2 +
        Math.random() * 0.5;


      particles.appendChild(
        particle
      );
    }
  }


  /* =========================================================
     BLOW BUTTON EVENT
     ========================================================= */

  if (blowBtn) {

    blowBtn.addEventListener(
      "click",
      blowCandles
    );
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  createParticles();

  loadFromHash();


  /* =========================================================
     HASH CHANGE
     ========================================================= */

  window.addEventListener(
    "hashchange",
    () => {

      /*
        รีเซ็ตปุ่มเป่าเทียน
      */

      if (blowBtn) {

        blowBtn.disabled = false;

        blowBtn.textContent =
          "🌬️ เป่าเทียน";
      }


      if (blowMessage) {

        blowMessage.classList.add(
          "hidden"
        );

        blowMessage.classList.remove(
          "show"
        );
      }


      /*
        โหลดข้อมูลการ์ดใหม่
      */

      loadFromHash();
    }
  );

});
