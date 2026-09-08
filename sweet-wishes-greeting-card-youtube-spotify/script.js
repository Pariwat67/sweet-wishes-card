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

const pages = {
  landing: $("landing"),
  creator: $("creator"),
  card: $("cardPage")
};

function showPage(name) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  pages[name].classList.add("active");
  window.scrollTo({top: 0, behavior: "smooth"});
}

function applyTheme(el, theme) {
  el.classList.remove("theme-pink","theme-blue","theme-purple","theme-cream");
  el.classList.add(`theme-${theme}`);
}

function updatePreview() {
  $("miniTitle").textContent = $("titleInput").value || "Happy Birthday!";
  $("miniRecipient").textContent = $("recipient").value || "ชื่อคนรับ";
  $("miniMessage").textContent = $("message").value || "คำอวยพรของคุณจะปรากฏตรงนี้...";
  $("miniSender").textContent = $("sender").value ? `— ${$("sender").value} —` : "— จากใคร —";
  applyTheme($("miniCard"), state.theme);
}

["recipient","titleInput","message","sender"].forEach(id => {
  $(id).addEventListener("input", updatePreview);
});

document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".theme-option").forEach(b => b.classList.remove("selected"));
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
  $("musicInfo").textContent = musicUrl ? `🎵 ${musicUrl}` : "ยังไม่ได้ใส่ลิงก์เพลง";
});

$("startBtn").onclick = () => showPage("creator");
$("createTopBtn").onclick = () => showPage("creator");
$("backBtn").onclick = () => showPage("landing");
$("previewBtn").onclick = () => {
  if (!$("recipient").value.trim()) {
    alert("ใส่ชื่อคนรับก่อนนะ 😊");
    $("recipient").focus();
    return;
  }
  buildCard();
  showPage("card");
};
$("editBtn").onclick = () => showPage("creator");
$("loadDemoBtn").onclick = () => {
  $("recipient").value = "คนพิเศษ";
  $("titleInput").value = "Happy Birthday!";
  $("message").value = "ขอให้วันนี้เต็มไปด้วยรอยยิ้ม\nขอให้ทุกวันที่ผ่านไปมีแต่เรื่องดี ๆ\nและขอให้ความฝันของเธอค่อย ๆ เป็นจริงนะ 💗";
  $("sender").value = "คนที่อยากเห็นเธอมีความสุข";
  state.theme = "pink";
  document.querySelectorAll(".theme-option").forEach(b => b.classList.toggle("selected", b.dataset.theme === "pink"));
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
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "เพลงจาก YouTube";
    if (host.includes("spotify.com")) return "เพลงจาก Spotify";
    return "เพลงของเรา";
  } catch {
    return "เพลงของเรา";
  }
}

async function buildCard() {
  state.recipient = $("recipient").value.trim();
  state.title = $("titleInput").value.trim() || "Happy Birthday!";
  state.message = $("message").value.trim() || "ขอให้มีความสุขมาก ๆ ในทุกวันนะ 💗";
  state.sender = $("sender").value.trim();

  $("cardTitle").textContent = state.title;
  $("cardRecipient").textContent = state.recipient;
  $("cardMessage").textContent = state.message;
  $("cardSender").textContent = state.sender ? `— ${state.sender} —` : "— ด้วยความรักและความปรารถนาดี —";
  applyTheme($("fullCard"), state.theme);

  const gallery = $("gallery");
  gallery.innerHTML = "";
  state.images = [];

  for (const file of imageFiles) {
    const data = await fileToDataURL(file);
    state.images.push(data);
    const img = document.createElement("img");
    img.src = data;
    gallery.appendChild(img);
  }

  const musicPlayer = $("musicPlayer");
  const musicLink = $("musicLink");
  const url = musicUrl.trim();
  if (url) {
    state.music = url;
    state.musicName = getMusicServiceName(url);
    $("musicName").textContent = state.musicName;
    musicLink.href = url;
    musicPlayer.classList.remove("hidden");
  } else {
    state.music = null;
    state.musicName = "";
    musicPlayer.classList.add("hidden");
    musicLink.removeAttribute("href");
  }

  $("cake").classList.remove("blown");
  $("blowMessage").classList.add("hidden");
}

$("blowBtn").onclick = () => {
  $("cake").classList.add("blown");
  $("blowMessage").classList.remove("hidden");
  confetti();
};

function confetti() {
  const symbols = ["🎉","✨","💗","🌸","⭐"];
  for (let i=0;i<35;i++) {
    const el = document.createElement("span");
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.position = "fixed";
    el.style.left = Math.random()*100 + "vw";
    el.style.top = "-30px";
    el.style.fontSize = (14 + Math.random()*20) + "px";
    el.style.zIndex = 100;
    el.style.transition = `transform ${1.5+Math.random()*1.5}s ease, opacity 2s`;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random()-.5)*180}px, ${window.innerHeight+80}px) rotate(${Math.random()*700}deg)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), 3500);
  }
}

// ---------- Share / QR ----------
function createSharePayload() {
  // QR URLs should remain reasonably small. Images are included only if
  // the final encoded URL is not too large. Music is intentionally omitted.
  const base = {
    r: state.recipient,
    t: state.title,
    m: state.message,
    s: state.sender,
    th: state.theme,
    music: state.music || ""
  };

  const withImages = {...base, imgs: state.images};
  const encodedWithImages = encodeURIComponent(JSON.stringify(withImages));
  if (encodedWithImages.length < 6500) {
    return encodedWithImages;
  }
  return encodeURIComponent(JSON.stringify(base));
}

function makeShareUrl() {
  return `${location.origin}${location.pathname}#card=${createSharePayload()}`;
}

$("shareBtn").onclick = async () => {
  const url = makeShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    alert("คัดลอกลิงก์การ์ดแล้ว 💗\nนำไปส่งให้เพื่อนได้เลย");
  } catch {
    prompt("คัดลอกลิงก์นี้:", url);
  }
};

$("qrBtn").onclick = () => {
  const url = makeShareUrl();
  const box = $("qrcode");
  box.innerHTML = "";

  // ใช้ QR image service แทนไลบรารีภายนอก เพื่อให้ปุ่มทำงาน
  // แม้เปิด index.html แบบ file://
  const img = document.createElement("img");
  img.width = 220;
  img.height = 220;
  img.alt = "QR Code";
  img.loading = "eager";
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
            encodeURIComponent(url);
  box.appendChild(img);

  $("qrWarning").textContent =
    "หมายเหตุ: ถ้าต้องการให้มือถือเครื่องอื่นเปิดการ์ดได้จริง ต้องนำเว็บขึ้นออนไลน์ก่อน";
  $("qrModal").classList.remove("hidden");
};

$("closeQr").onclick = () => $("qrModal").classList.add("hidden");
$("qrModal").addEventListener("click", e => {
  if (e.target === $("qrModal")) $("qrModal").classList.add("hidden");
});

$("copyLinkBtn").onclick = async () => {
  const url = makeShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    $("copyLinkBtn").textContent = "คัดลอกแล้ว ✓";
    setTimeout(() => $("copyLinkBtn").textContent = "🔗 คัดลอกลิงก์", 1500);
  } catch {
    prompt("คัดลอกลิงก์:", url);
  }
};

// ---------- Load card from QR hash ----------
function loadFromHash() {
  const hash = location.hash;
  if (!hash.startsWith("#card=")) return false;
  try {
    const payload = JSON.parse(decodeURIComponent(hash.slice(6)));
    $("recipient").value = payload.r || "";
    $("titleInput").value = payload.t || "Happy Birthday!";
    $("message").value = payload.m || "";
    $("sender").value = payload.s || "";
    state.theme = payload.th || "pink";
    state.music = payload.music || "";
    state.musicName = state.music ? getMusicServiceName(state.music) : "";
    musicUrl = state.music;
    $("musicInput").value = state.music;
    $("musicInfo").textContent = state.music ? `🎵 ${state.music}` : "ยังไม่ได้ใส่ลิงก์เพลง";
    imageFiles = [];
    state.images = payload.imgs || [];
    updatePreview();

    $("cardTitle").textContent = payload.t || "Happy Birthday!";
    $("cardRecipient").textContent = payload.r || "";
    $("cardMessage").textContent = payload.m || "";
    $("cardSender").textContent = payload.s ? `— ${payload.s} —` : "— ด้วยความปรารถนาดี —";
    applyTheme($("fullCard"), state.theme);

    $("gallery").innerHTML = "";
    (payload.imgs || []).forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      $("gallery").appendChild(img);
    });
    if (state.music) {
      $("musicName").textContent = state.musicName;
      $("musicLink").href = state.music;
      $("musicPlayer").classList.remove("hidden");
    } else {
      $("musicPlayer").classList.add("hidden");
    }
    showPage("card");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// ---------- Decorative background ----------
(function createParticles(){
  const box = $("particles");
  const symbols = ["♡","✦","✧","•"];
  for(let i=0;i<30;i++){
    const p=document.createElement("span");
    p.className="particle";
    p.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    p.style.left=Math.random()*100+"%";
    p.style.animationDuration=(7+Math.random()*9)+"s";
    p.style.animationDelay=(-Math.random()*12)+"s";
    p.style.fontSize=(10+Math.random()*18)+"px";
    box.appendChild(p);
  }
})();

updatePreview();
loadFromHash();
