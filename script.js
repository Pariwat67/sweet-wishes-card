/* =========================================================
   SWEET WISHES - CARD ONLY
   เปิดการ์ดจาก #card= โดยตรง
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  /* =========================================================
     รูปภาพจาก GitHub
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

    const validThemes = [
      "pink",
      "blue",
      "purple",
      "cream"
    ];

    if (!validThemes.includes(theme)) {
      theme = "pink";
    }

    element.classList.add(`theme-${theme}`);
  }

  /* =========================================================
     MUSIC NAME
     ========================================================= */

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

  /* =========================================================
     DECODE SHARE DATA
     ========================================================= */

  function decodeShareData(encoded) {

    if (!encoded) {
      throw new Error("ไม่มีข้อมูลการ์ด");
    }

    let value = String(encoded).trim();

    /* URL decode */
    try {
      value = decodeURIComponent(value);
    } catch {}

    /* =====================================================
       กรณีเป็น JSON ตรง ๆ
       ===================================================== */

    if (
      value.startsWith("{") &&
      value.endsWith("}")
    ) {

      try {

        const data = JSON.parse(value);

        if (
          data &&
          typeof data === "object"
        ) {
          return data;
        }

      } catch {}

    }

    /* =====================================================
       Base64URL
       ===================================================== */

    let base64 = value
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\s/g, "");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    try {

      const binary = atob(base64);

      const bytes =
        new Uint8Array(binary.length);

      for (
        let i = 0;
        i < binary.length;
        i++
      ) {
        bytes[i] =
          binary.charCodeAt(i);
      }

      const json =
        new TextDecoder("utf-8")
          .decode(bytes);

      const data =
        JSON.parse(json);

      if (
        data &&
        typeof data === "object"
      ) {
        return data;
      }

    } catch (error) {

      console.error(
        "Decode error:",
        error
      );

    }

    throw new Error(
      "ข้อมูลการ์ดไม่ถูกต้อง"
    );
  }

  /* =========================================================
     RENDER CARD
     ========================================================= */

  function renderFullCard() {

    /* ชื่อ */
    const cardTitle = $("cardTitle");

    if (cardTitle) {
      cardTitle.textContent =
        state.title ||
        "Happy Birthday!";
    }

    /* ผู้รับ */
    const cardRecipient =
      $("cardRecipient");

    if (cardRecipient) {
      cardRecipient.textContent =
        state.recipient || "";
    }

    /* ข้อความ */
    const cardMessage =
      $("cardMessage");

    if (cardMessage) {
      cardMessage.textContent =
        state.message || "";
    }

    /* ผู้ส่ง */
    const cardSender =
      $("cardSender");

    if (cardSender) {

      cardSender.textContent =
        state.sender
          ? `— ${state.sender} —`
          : "— ด้วยความรักและความปรารถนาดี —";

    }

    /* Theme */
    applyTheme(
      $("fullCard"),
      state.theme
    );

    /* =====================================================
       GALLERY
       ===================================================== */

    const gallery =
      $("gallery");

    if (gallery) {

      gallery.innerHTML = "";

      GITHUB_IMAGES.forEach(src => {

        const img =
          document.createElement("img");

        img.src = src;

        img.alt =
          "รูปภาพในการ์ด";

        img.loading =
          "lazy";

        gallery.appendChild(img);

      });

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

    }
  }

  /* =========================================================
     LOAD CARD FROM URL
     ========================================================= */

  function loadFromHash() {

    const hash =
      window.location.hash || "";

    console.log(
      "Sweet Wishes hash:",
      hash
    );

    if (
      !hash.startsWith("#card=")
    ) {

      console.warn(
        "ไม่พบ #card= ใน URL"
      );

      return false;
    }

    const encoded =
      hash
        .substring("#card=".length)
        .trim();

    if (!encoded) {

      showError(
        "ลิงก์การ์ดไม่มีข้อมูล"
      );

      return true;
    }

    try {

      /* ถอดข้อมูล */
      const payload =
        decodeShareData(encoded);

      console.log(
        "Sweet Wishes payload:",
        payload
      );

      /* ===================================================
         อ่านข้อมูล
         =================================================== */

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

      /* ===================================================
         แสดงการ์ด
         =================================================== */

      renderFullCard();

      /* ทำให้หน้า Card แสดงทันที */
      const cardPage =
        $("cardPage");

      if (cardPage) {
        cardPage.classList.add("active");
      }

      /* ซ่อนหน้าอื่น ถ้ามีเหลือใน HTML */
      document
        .querySelectorAll(".page")
        .forEach(page => {

          if (page.id !== "cardPage") {
            page.classList.remove("active");
          }

        });

      console.log(
        "เปิดการ์ดสำเร็จ 💗"
      );

      return true;

    } catch (error) {

      console.error(
        "โหลดการ์ดไม่สำเร็จ:",
        error
      );

      showError(
        "ไม่สามารถเปิดการ์ดนี้ได้\n" +
        "ลิงก์อาจไม่ครบหรือข้อมูลเสียหาย"
      );

      return true;
    }
  }

  /* =========================================================
     ERROR
     ========================================================= */

  function showError(message) {

    const cardTitle =
      $("cardTitle");

    const cardRecipient =
      $("cardRecipient");

    const cardMessage =
      $("cardMessage");

    const cardSender =
      $("cardSender");

    if (cardTitle) {
      cardTitle.textContent =
        "Sweet Wishes 💗";
    }

    if (cardRecipient) {
      cardRecipient.textContent = "";
    }

    if (cardMessage) {
      cardMessage.textContent =
        message;
    }

    if (cardSender) {
      cardSender.textContent = "";
    }
  }

  /* =========================================================
     BLOW CANDLE
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

    /* Burst */

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

    /* Hearts */

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

    /* Sparkles */

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

    /* Big heart */

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
     CREATE SHARE URL
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

  function createSharePayload() {

    return encodeShareData({

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

      mu:
        state.music

    });
  }

  function makeShareUrl() {

    const baseUrl =
      new URL(
        window.location.origin +
        window.location.pathname
      );

    baseUrl.search = "";

    baseUrl.hash =
      "card=" +
      createSharePayload();

    return baseUrl.toString();
  }

  /* =========================================================
     SHARE
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
            "คัดลอกลิงก์การ์ดแล้ว 💗"
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

        img.width = 260;
        img.height = 260;

        img.alt =
          "QR Code สำหรับเปิดการ์ด";

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

        box.appendChild(img);

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
          event.target === qrModal
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
     INITIALIZE
     ========================================================= */

  console.log(
    "Sweet Wishes Card Only เริ่มทำงาน"
  );

  const openedFromShare =
    loadFromHash();

  /* รองรับการเปลี่ยน #card= */
  window.addEventListener(
    "hashchange",
    () => {
      loadFromHash();
    }
  );

  /* ถ้าไม่มี #card= ให้แสดงการ์ดเปล่า */
  if (!openedFromShare) {

    renderFullCard();

    const cardPage =
      $("cardPage");

    if (cardPage) {
      cardPage.classList.add("active");
    }
  }

});
