/* =========================================================
   SWEET WISHES
   CARD ONLY VERSION
   ========================================================= */

"use strict";


document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =======================================================
       HELPER
       ======================================================= */

    const $ = (id) => {
      return document.getElementById(id);
    };


    /* =======================================================
       GITHUB IMAGES
       ======================================================= */

    const GITHUB_IMAGES = [
      "images/S__44457989_0.jpg",
      "images/S__48840712_0.jpg",
      "images/S__48840715_0.jpg",
      "images/S__48840716_0.jpg"
    ];


    /* =======================================================
       STATE
       ======================================================= */

    const state = {

      recipient: "",

      title:
        "Happy Birthday!",

      message: "",

      sender: "",

      theme:
        "pink",

      music: "",

      musicName: ""

    };


    /* =======================================================
       THEME
       ======================================================= */

    function applyTheme(
      element,
      theme
    ) {

      if (!element) {
        return;
      }


      const validThemes = [
        "pink",
        "blue",
        "purple",
        "cream"
      ];


      if (
        !validThemes.includes(theme)
      ) {
        theme = "pink";
      }


      element.classList.remove(
        "theme-pink",
        "theme-blue",
        "theme-purple",
        "theme-cream"
      );


      element.classList.add(
        `theme-${theme}`
      );

    }


    /* =======================================================
       MUSIC NAME
       ======================================================= */

    function getMusicServiceName(
      url
    ) {

      if (!url) {
        return "";
      }


      try {

        const parsed =
          new URL(url);

        const host =
          parsed.hostname.toLowerCase();


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


    /* =======================================================
       UTF-8 BASE64 DECODE
       ======================================================= */

    function decodeBase64Utf8(
      encoded
    ) {

      let value =
        String(encoded || "")
          .trim();


      if (!value) {
        throw new Error(
          "ไม่มีข้อมูล Base64"
        );
      }


      /*
       * รองรับ Base64URL
       *
       * - -> +
       * _ -> /
       */

      value =
        value
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .replace(/\s/g, "");


      /*
       * เติม =
       * ให้จำนวนตัวอักษรหาร 4 ลงตัว
       */

      while (
        value.length % 4 !== 0
      ) {

        value += "=";

      }


      /*
       * แปลง Base64 -> binary
       */

      const binary =
        window.atob(value);


      /*
       * binary -> Uint8Array
       */

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


      /*
       * Uint8Array -> UTF-8 text
       */

      const decoder =
        new TextDecoder(
          "utf-8",
          {
            fatal: true
          }
        );


      return decoder.decode(
        bytes
      );

    }


    /* =======================================================
       DECODE SHARE DATA
       ======================================================= */

    function decodeShareData(
      encoded
    ) {

      if (!encoded) {

        throw new Error(
          "ไม่มีข้อมูลการ์ด"
        );

      }


      let value =
        String(encoded)
          .trim();


      /*
       * -----------------------------------------------
       * 1. ลอง URL decode ก่อน
       * -----------------------------------------------
       */

      if (
        value.includes("%")
      ) {

        try {

          value =
            decodeURIComponent(
              value
            );

        } catch {

          /*
           * ถ้า decode ไม่ได้
           * ใช้ค่าเดิมต่อ
           */

        }

      }


      /*
       * -----------------------------------------------
       * 2. ถ้าเป็น JSON โดยตรง
       * -----------------------------------------------
       */

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

        } catch {

          /*
           * ไม่ใช่ JSON
           */

        }

      }


      /*
       * -----------------------------------------------
       * 3. Base64 / Base64URL
       * -----------------------------------------------
       */

      try {

        const json =
          decodeBase64Utf8(
            value
          );


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
          "Base64 decode error:",
          error
        );

      }


      throw new Error(
        "ข้อมูลการ์ดไม่ถูกต้อง"
      );

    }


    /* =======================================================
       RENDER GALLERY
       ======================================================= */

    function renderGallery() {

      const gallery =
        $("gallery");


      if (!gallery) {
        return;
      }


      gallery.innerHTML = "";


      GITHUB_IMAGES.forEach(
        (src, index) => {

          const img =
            document.createElement(
              "img"
            );


          img.src = src;


          img.alt =
            `รูปภาพในการ์ด ${index + 1}`;


          img.loading =
            "lazy";


          img.onerror =
            () => {

              img.style.display =
                "none";

            };


          gallery.appendChild(
            img
          );

        }
      );

    }


    /* =======================================================
       RENDER MUSIC
       ======================================================= */

    function renderMusic() {

      const player =
        $("musicPlayer");

      const name =
        $("musicName");

      const link =
        $("musicLink");


      if (!player) {
        return;
      }


      /*
       * ไม่มีเพลง
       */

      if (!state.music) {

        player.classList.add(
          "hidden"
        );

        return;

      }


      /*
       * มีเพลง
       */

      if (name) {

        name.textContent =
          state.musicName ||
          getMusicServiceName(
            state.music
          );

      }


      if (link) {

        link.href =
          state.music;

        link.target =
          "_blank";

        link.rel =
          "noopener noreferrer";

      }


      player.classList.remove(
        "hidden"
      );

    }


    /* =======================================================
       RENDER FULL CARD
       ======================================================= */

    function renderFullCard() {

      const title =
        $("cardTitle");

      const recipient =
        $("cardRecipient");

      const message =
        $("cardMessage");

      const sender =
        $("cardSender");

      const fullCard =
        $("fullCard");


      /*
       * TITLE
       */

      if (title) {

        title.textContent =
          state.title ||
          "Happy Birthday!";

      }


      /*
       * RECIPIENT
       */

      if (recipient) {

        recipient.textContent =
          state.recipient ||
          "";

      }


      /*
       * MESSAGE
       */

      if (message) {

        message.textContent =
          state.message ||
          "";

      }


      /*
       * SENDER
       */

      if (sender) {

        sender.textContent =
          state.sender
            ? `— ${state.sender} —`
            : "— ด้วยความรักและความปรารถนาดี —";

      }


      /*
       * THEME
       */

      applyTheme(
        fullCard,
        state.theme
      );


      /*
       * GALLERY
       */

      renderGallery();


      /*
       * MUSIC
       */

      renderMusic();

    }


    /* =======================================================
       ERROR DISPLAY
       ======================================================= */

    function showError(
      message
    ) {

      const title =
        $("cardTitle");

      const recipient =
        $("cardRecipient");

      const cardMessage =
        $("cardMessage");

      const sender =
        $("cardSender");

      const musicPlayer =
        $("musicPlayer");


      if (title) {

        title.textContent =
          "Sweet Wishes 💗";

      }


      if (recipient) {

        recipient.textContent =
          "";

      }


      if (cardMessage) {

        cardMessage.textContent =
          message;

      }


      if (sender) {

        sender.textContent =
          "";

      }


      if (musicPlayer) {

        musicPlayer.classList.add(
          "hidden"
        );

      }

    }


    /* =======================================================
       LOAD CARD FROM HASH
       ======================================================= */

    function loadFromHash() {

      const hash =
        window.location.hash || "";


      console.log(
        "Sweet Wishes hash:",
        hash
      );


      /*
       * ต้องขึ้นต้นด้วย #card=
       */

      if (
        !hash.startsWith(
          "#card="
        )
      ) {

        console.log(
          "ไม่มี #card= ใช้การ์ดเริ่มต้น"
        );

        return false;

      }


      /*
       * ตัด #card= ออก
       */

      const encoded =
        hash
          .slice(
            "#card=".length
          )
          .trim();


      if (!encoded) {

        showError(
          "ลิงก์การ์ดไม่มีข้อมูล"
        );

        return true;

      }


      try {

        /*
         * ถอดข้อมูล
         */

        const payload =
          decodeShareData(
            encoded
          );


        console.log(
          "Sweet Wishes payload:",
          payload
        );


        /*
         * ---------------------------------------------
         * อ่านข้อมูล
         * ---------------------------------------------
         */

        state.recipient =
          typeof payload.r === "string"
            ? payload.r
            : "";


        state.title =
          typeof payload.t === "string"
            ? payload.t
            : "Happy Birthday!";


        state.message =
          typeof payload.m === "string"
            ? payload.m
            : "";


        state.sender =
          typeof payload.s === "string"
            ? payload.s
            : "";


        /*
         * THEME
         */

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


        /*
         * MUSIC
         */

        state.music =
          typeof payload.mu === "string"
            ? payload.mu
            : "";


        state.musicName =
          state.music
            ? getMusicServiceName(
                state.music
              )
            : "";


        /*
         * Render
         */

        renderFullCard();


        /*
         * เปิดหน้า Card
         */

        const cardPage =
          $("cardPage");


        if (cardPage) {

          cardPage.classList.add(
            "active"
          );

        }


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


    /* =======================================================
       BLOW CANDLE EFFECT
       ======================================================= */

    function createBlowCelebration() {

      const cake =
        $("cake");


      if (!cake) {
        return;
      }


      const rect =
        cake.getBoundingClientRect();


      const centerX =
        rect.left +
        rect.width / 2;


      const centerY =
        rect.top +
        rect.height * 0.18;


      /*
       * LIGHT BURST
       */

      const burst =
        document.createElement(
          "div"
        );


      burst.className =
        "blow-burst";


      burst.style.left =
        `${centerX}px`;


      burst.style.top =
        `${centerY}px`;


      document.body.appendChild(
        burst
      );


      setTimeout(
        () => {

          burst.remove();

        },
        1100
      );


      /*
       * HEARTS
       */

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
        i < 30;
        i++
      ) {

        const heart =
          document.createElement(
            "div"
          );


        heart.className =
          "blow-heart";


        heart.textContent =
          hearts[
            Math.floor(
              Math.random() *
              hearts.length
            )
          ];


        heart.style.left =
          `${centerX +
            (Math.random() - 0.5) *
            70}px`;


        heart.style.top =
          `${centerY +
            (Math.random() - 0.5) *
            35}px`;


        heart.style.setProperty(
          "--size",
          `${17 +
            Math.random() * 27}px`
        );


        heart.style.setProperty(
          "--duration",
          `${1.9 +
            Math.random() * 1.8}s`
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
          "--x4",
          `${(Math.random() - 0.5) * 420}px`
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


        heart.style.setProperty(
          "--r4",
          `${(Math.random() - 0.5) * 240}deg`
        );


        document.body.appendChild(
          heart
        );


        setTimeout(
          () => {

            heart.remove();

          },
          4300
        );

      }


      /*
       * SPARKLES
       */

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
        i < 22;
        i++
      ) {

        const sparkle =
          document.createElement(
            "div"
          );


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
          `${centerX +
            (Math.random() - 0.5) *
            90}px`;


        sparkle.style.top =
          `${centerY +
            (Math.random() - 0.5) *
            40}px`;


        sparkle.style.setProperty(
          "--size",
          `${12 +
            Math.random() * 20}px`
        );


        sparkle.style.setProperty(
          "--duration",
          `${1.2 +
            Math.random() * 1.5}s`
        );


        sparkle.style.setProperty(
          "--x1",
          `${(Math.random() - 0.5) * 160}px`
        );


        sparkle.style.setProperty(
          "--x2",
          `${(Math.random() - 0.5) * 260}px`
        );


        sparkle.style.setProperty(
          "--x3",
          `${(Math.random() - 0.5) * 340}px`
        );


        document.body.appendChild(
          sparkle
        );


        setTimeout(
          () => {

            sparkle.remove();

          },
          3200
        );

      }


      /*
       * BIG HEART
       */

      const bigHeart =
        document.createElement(
          "div"
        );


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
        () => {

          bigHeart.remove();

        },
        1700
      );

    }


    /* =======================================================
       CONFETTI
       ======================================================= */

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
        i < 28;
        i++
      ) {

        const element =
          document.createElement(
            "span"
          );


        element.textContent =
          symbols[
            Math.floor(
              Math.random() *
              symbols.length
            )
          ];


        element.style.position =
          "fixed";


        element.style.left =
          `${Math.random() * 100}vw`;


        element.style.top =
          "-30px";


        element.style.fontSize =
          `${14 +
            Math.random() * 20}px`;


        element.style.zIndex =
          "1000";


        element.style.pointerEvents =
          "none";


        const duration =
          1.5 +
          Math.random() * 1.5;


        element.style.transition =
          `transform ${duration}s ease,
           opacity 2s`;


        document.body.appendChild(
          element
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


            element.style.transform =
              `translate(
                ${x}px,
                ${y}px
              )
              rotate(
                ${rotation}deg
              )`;


            element.style.opacity =
              "0";

          }
        );


        setTimeout(
          () => {

            element.remove();

          },
          3500
        );

      }

    }


    /* =======================================================
       BLOW BUTTON
       ======================================================= */

    const blowBtn =
      $("blowBtn");


    if (blowBtn) {

      blowBtn.addEventListener(
        "click",
        () => {

          const cake =
            $("cake");


          if (!cake) {
            return;
          }


          /*
           * ป้องกันกดซ้ำ
           */

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


          const message =
            $("blowMessage");


          if (message) {

            message.classList.remove(
              "hidden"
            );

          }


          createBlowCelebration();

          confetti();

        }
      );

    }


    /* =======================================================
       ENCODE SHARE DATA
       ======================================================= */

    function encodeShareData(
      data
    ) {

      const json =
        JSON.stringify(data);


      const bytes =
        new TextEncoder().encode(
          json
        );


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


      return window.btoa(
        binary
      )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

    }


    /* =======================================================
       CREATE SHARE PAYLOAD
       ======================================================= */

    function createSharePayload() {

      return encodeShareData({

        /*
         * ใช้ key แบบเดิม
         * เพื่อให้ลิงก์เก่ายังใช้ได้
         */

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


    /* =======================================================
       MAKE SHARE URL
       ======================================================= */

    function makeShareUrl() {

      /*
       * ใช้ URL ปัจจุบัน
       * แต่ตัด query ออก
       */

      const url =
        new URL(
          window.location.href
        );


      url.search = "";


      url.hash =
        "card=" +
        createSharePayload();


      return url.toString();

    }


    /* =======================================================
       SHARE BUTTON
       ======================================================= */

    const shareBtn =
      $("shareBtn");


    if (shareBtn) {

      shareBtn.addEventListener(
        "click",
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

            window.prompt(
              "คัดลอกลิงก์นี้:",
              url
            );

          }

        }
      );

    }


    /* =======================================================
       QR CODE
       ======================================================= */

    const qrBtn =
      $("qrBtn");


    if (qrBtn) {

      qrBtn.addEventListener(
        "click",
        () => {

          const url =
            makeShareUrl();


          const box =
            $("qrcode");


          if (!box) {
            return;
          }


          box.innerHTML = "";


          const image =
            document.createElement(
              "img"
            );


          image.width = 240;
          image.height = 240;


          image.alt =
            "QR Code สำหรับเปิดการ์ด";


          image.src =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=240x240" +
            "&ecc=M" +
            "&margin=10" +
            "&data=" +
            encodeURIComponent(url);


          image.onerror =
            () => {

              box.innerHTML =
                "<p>สร้าง QR Code ไม่สำเร็จ กรุณาลองใหม่</p>";

            };


          box.appendChild(
            image
          );


          const warning =
            $("qrWarning");


          if (warning) {

            warning.textContent =
              "สแกนแล้วจะเปิดการ์ดใบนี้โดยตรง 💗";

          }


          const modal =
            $("qrModal");


          if (modal) {

            modal.classList.remove(
              "hidden"
            );

          }

        }
      );

    }


    /* =======================================================
       CLOSE QR
       ======================================================= */

    const closeQr =
      $("closeQr");


    if (closeQr) {

      closeQr.addEventListener(
        "click",
        () => {

          const modal =
            $("qrModal");


          if (modal) {

            modal.classList.add(
              "hidden"
            );

          }

        }
      );

    }


    /* =======================================================
       CLICK OUTSIDE QR
       ======================================================= */

    const qrModal =
      $("qrModal");


    if (qrModal) {

      qrModal.addEventListener(
        "click",
        (event) => {

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


    /* =======================================================
       COPY LINK FROM QR
       ======================================================= */

    const copyLinkBtn =
      $("copyLinkBtn");


    if (copyLinkBtn) {

      copyLinkBtn.addEventListener(
        "click",
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

            window.prompt(
              "คัดลอกลิงก์:",
              url
            );

          }

        }
      );

    }


    /* =======================================================
       PARTICLES
       ======================================================= */

    function createParticles() {

      const container =
        $("particles");


      if (!container) {
        return;
      }


      /*
       * ไม่สร้างเยอะเกินไป
       * เพื่อให้เว็บเบา
       */

      const symbols = [
        "✦",
        "✧",
        "♡",
        "·"
      ];


      for (
        let i = 0;
        i < 18;
        i++
      ) {

        const particle =
          document.createElement(
            "span"
          );


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
          `${Math.random() * 100}%`;


        particle.style.top =
          `${Math.random() * 100}%`;


        particle.style.fontSize =
          `${10 +
            Math.random() * 12}px`;


        particle.style.animationDuration =
          `${8 +
            Math.random() * 12}s`;


        particle.style.animationDelay =
          `${Math.random() * -10}s`;


        container.appendChild(
          particle
        );

      }

    }


    /* =======================================================
       INITIALIZE
       ======================================================= */

    console.log(
      "Sweet Wishes Card Only เริ่มทำงาน 💗"
    );


    /*
     * สร้างพื้นหลัง
     */

    createParticles();


    /*
     * โหลดข้อมูลจาก #card=
     */

    const openedFromShare =
      loadFromHash();


    /*
     * ถ้าไม่มีข้อมูลใน URL
     * ให้แสดงการ์ดเริ่มต้น
     */

    if (!openedFromShare) {

      renderFullCard();

    }


    /* =======================================================
       HASH CHANGE
       ======================================================= */

    window.addEventListener(
      "hashchange",
      () => {

        loadFromHash();

      }
    );


  }
);
