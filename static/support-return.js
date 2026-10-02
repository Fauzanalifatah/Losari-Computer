/**
 * Losari Computer — Support & Return Feature Logic
 * Matches the 5-screen UI/UX Return Feature Workflow
 */

(function () {
  // State
  var currentScreen = 1;
  var sampleReturn = {
    returnId: "RT-LC20261001-001",
    orderId: "#LC20261001-1234",
    product: {
      name: "Lenovo ThinkPad T490",
      sku: "LP-T490-001",
      price: "Rp 4.500.000",
      img: "/static/images/laptop/thinkpad-t490.jpg"
    },
    condition: "Barang rusak",
    reason: "Layar bergaris vertikal saat pertama kali dinyalakan dan touchpad kadang tidak responsif.",
    submittedAt: "1 Oktober 2026, 14:30",
    completedAt: "5 Oktober 2026, 10:20",
    statusBadge: "Menunggu Verifikasi",
    stepIndex: 1, // 1 to 6
    decision: "Replacement",
    trackingNo: "JTO123456789"
  };

  var uploadedFiles = [
    { name: "foto_kerusakan_layar.jpg", size: "2.4 MB" }
  ];

  // DOM Elements
  var screenViews = {
    1: document.getElementById("screen-support-hub"),
    2: document.getElementById("screen-form-retur"),
    3: document.getElementById("screen-konfirmasi-retur"),
    4: document.getElementById("screen-status-retur"),
    5: document.getElementById("screen-retur-selesai")
  };

  var navPills = document.querySelectorAll(".screen-nav-pill");

  // Navigation function
  window.goToScreen = function (screenNum) {
    screenNum = parseInt(screenNum, 10);
    if (isNaN(screenNum) || screenNum < 1 || screenNum > 5) screenNum = 1;
    currentScreen = screenNum;

    // Update screen views
    for (var key in screenViews) {
      if (screenViews[key]) {
        if (parseInt(key, 10) === screenNum) {
          screenViews[key].style.display = "block";
          screenViews[key].classList.add("fade-in-screen");
        } else {
          screenViews[key].style.display = "none";
        }
      }
    }

    // Trigger celebration burst if Screen 3 or Screen 5
    if (screenNum === 3 || screenNum === 5) {
      setTimeout(function () {
        if (typeof window.triggerCelebrationBurst === "function") {
          window.triggerCelebrationBurst(screenNum, false);
        }
      }, 140);
    }

    // Update navigator pills
    navPills.forEach(function (pill) {
      var pillScreen = parseInt(pill.getAttribute("data-screen"), 10);
      var badge = pill.querySelector(".pill-badge");
      if (pillScreen === screenNum) {
        pill.classList.add("active");
        pill.classList.remove("completed");
        if (badge) badge.textContent = pillScreen;
      } else if (pillScreen < screenNum) {
        pill.classList.remove("active");
        pill.classList.add("completed");
        if (badge) {
          badge.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        }
      } else {
        pill.classList.remove("active");
        pill.classList.remove("completed");
        if (badge) badge.textContent = pillScreen;
      }
    });

    // Update URL without full reload
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("screen", screenNum);
      window.history.replaceState({}, "", url.toString());
    } catch (e) { }

    // Scroll to top of card smoothly
    var target = document.getElementById("return-main-anchor");
    if (target && window.scrollY > 200) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Nav pill click listener
  navPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      var screenNum = this.getAttribute("data-screen");
      goToScreen(screenNum);
    });
  });

  // Copy return ID
  window.copyReturnId = function (id) {
    var text = id || sampleReturn.returnId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Nomor retur berhasil disalin: " + text);
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Nomor retur berhasil disalin: " + text);
    }
  };

  function showToast(msg) {
    var toast = document.getElementById("ret-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ret-toast";
      toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#071a2d;color:#fff;padding:12px 24px;border-radius:999px;font-size:13px;font-weight:600;z-index:999999;box-shadow:0 10px 25px rgba(0,0,0,0.2);display:none;transition:opacity 0.3s ease;";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = "block";
    toast.style.opacity = "1";
    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () { toast.style.display = "none"; }, 300);
    }, 2800);
  }

  // Stepper Controller for Screen 4
  window.setReturnStep = function (stepIdx) {
    stepIdx = parseInt(stepIdx, 10);
    if (stepIdx < 1) stepIdx = 1;
    if (stepIdx > 6) stepIdx = 6;
    sampleReturn.stepIndex = stepIdx;

    // Update Stepper circles
    var stepItems = document.querySelectorAll(".ret-step-item");
    var progress = document.querySelector(".ret-stepper-progress");

    if (progress) {
      var percent = ((stepIdx - 1) / 5) * 100;
      progress.style.width = percent + "%";
    }

    stepItems.forEach(function (item) {
      var idx = parseInt(item.getAttribute("data-step-index"), 10);
      item.classList.remove("active", "completed");
      if (idx < stepIdx) {
        item.classList.add("completed");
        var circle = item.querySelector(".ret-step-circle");
        if (circle) circle.innerHTML = "✓";
      } else if (idx === stepIdx) {
        item.classList.add("active");
        var circle = item.querySelector(".ret-step-circle");
        if (circle) circle.textContent = idx;
      } else {
        var circle = item.querySelector(".ret-step-circle");
        if (circle) circle.textContent = idx;
      }
    });

    // Update Status Badge on Screen 4
    var badgeEl = document.getElementById("status-stage-badge");
    var badgeTexts = {
      1: "Menunggu Verifikasi",
      2: "Sedang Diverifikasi",
      3: "Menunggu Barang",
      4: "Sedang Diinspeksi",
      5: "Proses Solusi",
      6: "Retur Selesai"
    };
    if (badgeEl) {
      badgeEl.textContent = badgeTexts[stepIdx] || "Menunggu Verifikasi";
      badgeEl.className = "ret-status-badge " + (stepIdx === 6 ? "badge-success" : (stepIdx > 1 ? "badge-info" : "badge-warning"));
    }

    // Update Timeline items active/done
    var timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach(function (tItem, i) {
      var tIdx = i + 1;
      tItem.classList.remove("active", "done");
      if (tIdx < stepIdx) {
        tItem.classList.add("done");
      } else if (tIdx === stepIdx) {
        tItem.classList.add("active");
      }
    });

    // If step 6 clicked, allow switching to Screen 5 directly
    if (stepIdx === 6) {
      showToast("Status retur telah Selesai. Menampilkan rincian hasil retur...");
      setTimeout(function () {
        goToScreen(5);
      }, 700);
    }
  };

  // Form Submission
  var retForm = document.getElementById("formAjukanRetur");
  if (retForm) {
    retForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var orderIdInput = document.getElementById("inputNomorPesanan");
      var reasonInput = document.getElementById("inputAlasanRetur");
      var conditionInput = document.querySelector('input[name="kondisi_retur"]:checked');

      var orderVal = (orderIdInput && orderIdInput.value.trim()) || "#LC20261001-1234";
      var reasonVal = (reasonInput && reasonInput.value.trim()) || "Kerusakan pada unit laptop saat diterima.";
      var condVal = conditionInput ? conditionInput.value : "Barang rusak";

      // Generate realistic return ID if new
      var rand = Math.floor(100 + Math.random() * 900);
      var genId = "RT-LC2026" + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + "-" + rand;

      // Update stored sample
      sampleReturn.returnId = genId;
      sampleReturn.orderId = orderVal;
      sampleReturn.condition = condVal;
      sampleReturn.reason = reasonVal;
      sampleReturn.stepIndex = 1;

      // Update DOM on screen 3 & 4
      var confId = document.getElementById("confirmReturnId");
      if (confId) confId.textContent = genId;
      var confOrder = document.getElementById("confirmOrderId");
      if (confOrder) confOrder.textContent = orderVal;

      var statusId = document.getElementById("statusReturnId");
      if (statusId) statusId.textContent = genId;
      var statusOrder = document.getElementById("statusOrderId");
      if (statusOrder) statusOrder.textContent = orderVal;

      // Transition to Screen 3 (Confirmation)
      goToScreen(3);
      showToast("Pengajuan retur berhasil dikirim!");
    });
  }

  // Upload Zone Handlers
  var dropZone = document.getElementById("retDropZone");
  var fileInput = document.getElementById("retFileInput");
  var previewList = document.getElementById("retFilePreviewList");

  if (dropZone && fileInput) {
    dropZone.addEventListener("click", function () {
      fileInput.click();
    });

    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener("change", function () {
      if (this.files && this.files.length > 0) {
        handleFiles(this.files);
      }
    });
  }

  function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var sizeMb = (f.size / (1024 * 1024)).toFixed(1) + " MB";
      uploadedFiles.push({ name: f.name, size: sizeMb });
    }
    renderFilePreviews();
    showToast(files.length + " file berhasil ditambahkan.");
  }

  function renderFilePreviews() {
    if (!previewList) return;
    previewList.innerHTML = "";
    uploadedFiles.forEach(function (file, index) {
      var chip = document.createElement("div");
      chip.className = "ret-file-chip";
      chip.innerHTML = '<span>📄 ' + file.name + ' (' + file.size + ')</span><button type="button" class="ret-file-chip-remove" onclick="removeUploadFile(' + index + ')">×</button>';
      previewList.appendChild(chip);
    });
  }

  window.removeUploadFile = function (index) {
    uploadedFiles.splice(index, 1);
    renderFilePreviews();
  };

  // WhatsApp Contact Direct Link
  window.contactAdminRetur = function () {
    var phone = "6285332990156";
    var msg = "Halo Admin Losari Computer, saya ingin konsultasi mengenai Pengajuan Retur Barang dengan Nomor Retur: " + sampleReturn.returnId + " (Pesanan: " + sampleReturn.orderId + "). Mohon bantuan informasi selanjutnya. Terima kasih!";
    var url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  };

  // Cancel return prompt
  window.cancelReturn = function () {
    if (confirm("Apakah Anda yakin ingin membatalkan pengajuan retur ini?")) {
      showToast("Pengajuan retur telah dibatalkan.");
      setTimeout(function () {
        goToScreen(1);
      }, 500);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CONFETTI PHYSICS & CELEBRATION ENGINE (Screen 3 & Screen 5)
  // ─────────────────────────────────────────────────────────────
  var activeConfettiAnim = {};

  window.triggerCelebrationBurst = function (screenNum, isUserClick) {
    screenNum = parseInt(screenNum, 10);
    var canvasId = "confettiCanvas" + screenNum;
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var parent = canvas.parentElement;
    if (!parent) return;

    // Replay badge animations on click/entry
    var wrap = parent.querySelector(".celebrate-badge-wrap");
    if (wrap) {
      var badge = wrap.querySelector(".celebrate-main-badge");
      var check = wrap.querySelector(".draw-check");
      if (badge) {
        badge.style.animation = "none";
        void badge.offsetWidth;
        badge.style.animation = "";
      }
      if (check) {
        check.style.animation = "none";
        void check.offsetWidth;
        check.style.animation = "";
      }
    }

    // Play pleasant cheerful audio chime on user interaction
    if (isUserClick) {
      playCheerfulChime();
    }

    // Setup Canvas Dimensions
    var width = parent.clientWidth || 600;
    var height = parent.clientHeight || 450;
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Origin near badge center
    var originX = width / 2;
    var originY = wrap ? (wrap.offsetTop + wrap.offsetHeight / 2) : 120;

    var particleCount = isUserClick ? 75 : 55;
    var colors = ["#f59e0b", "#10b981", "#0284c7", "#fde047", "#8b5cf6", "#38bdf8", "#34d399", "#fbbf24"];
    var shapes = ["rect", "circle", "diamond", "ribbon"];

    var particles = [];
    for (var i = 0; i < particleCount; i++) {
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.7; // energetic upward cone
      var speed = Math.random() * 9 + 4;
      var shape = shapes[Math.floor(Math.random() * shapes.length)];
      var color = colors[Math.floor(Math.random() * colors.length)];
      var size = Math.random() * 7 + 5;

      particles.push({
        x: originX + (Math.random() - 0.5) * 20,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - 2.5,
        gravity: 0.28,
        friction: 0.98,
        color: color,
        shape: shape,
        size: size,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        opacity: 1,
        fadeSpeed: Math.random() * 0.007 + 0.006,
        life: 0
      });
    }

    // Cancel existing loop on this canvas
    if (activeConfettiAnim[screenNum]) {
      cancelAnimationFrame(activeConfettiAnim[screenNum]);
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, width, height);

      var aliveCount = 0;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.life++;

        p.vx *= p.friction;
        p.vy = (p.vy + p.gravity) * p.friction;
        p.x += p.vx + Math.sin(p.wobble) * 1.5;
        p.y += p.vy;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;

        if (p.life > 35) {
          p.opacity -= p.fadeSpeed;
        }

        if (p.opacity > 0 && p.y < height + 20) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "ribbon") {
            ctx.fillRect(-p.size / 2, -1.5, p.size, 3);
          } else if (p.shape === "diamond") {
            drawSparkleDiamond(ctx, 0, 0, p.size / 1.5);
          }
          ctx.restore();
        }
      }

      if (aliveCount > 0) {
        activeConfettiAnim[screenNum] = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, width, height);
        activeConfettiAnim[screenNum] = null;
      }
    }

    renderConfetti();
  };

  function drawSparkleDiamond(ctx, cx, cy, radius) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + radius);
    ctx.quadraticCurveTo(cx, cy, cx - radius, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - radius);
    ctx.closePath();
    ctx.fill();
  }

  function playCheerfulChime() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (cheerful major chord arpeggio)
      notes.forEach(function (freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.35);
      });
    } catch (e) { }
  }

  // Initial Load URL parameter check
  document.addEventListener("DOMContentLoaded", function () {
    renderFilePreviews();

    var params = new URLSearchParams(window.location.search);
    var screenParam = params.get("screen");
    var tabParam = params.get("tab");

    if (screenParam) {
      goToScreen(screenParam);
    } else if (tabParam === "ajukan") {
      goToScreen(2);
    } else if (tabParam === "status") {
      goToScreen(4);
    } else if (tabParam === "selesai") {
      goToScreen(5);
    } else {
      goToScreen(1);
    }

    // Attach step click listeners on Screen 4 stepper
    var stepItems = document.querySelectorAll(".ret-step-item");
    stepItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var idx = this.getAttribute("data-step-index");
        setReturnStep(idx);
      });
    });
  });
})();
