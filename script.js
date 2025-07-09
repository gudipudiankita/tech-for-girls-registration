let shareCount = 0;
const maxShare = 5;

const whatsappBtn = document.getElementById("whatsappBtn");
const clickCount = document.getElementById("clickCount");
const shareCompleteMsg = document.getElementById("shareCompleteMsg");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("registrationForm");
const successMsg = document.getElementById("successMsg");

const LOCAL_STORAGE_KEY = "tfg_submitted";

// Prevent resubmission
if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
  form.style.display = "none";
  successMsg.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
}

whatsappBtn.addEventListener("click", () => {
  if (shareCount >= maxShare) return;

  const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');

  shareCount++;
  clickCount.textContent = `Click count: ${shareCount}/5`;

  if (shareCount >= maxShare) {
    shareCompleteMsg.textContent = "✅ Sharing complete. Please continue.";
    submitBtn.disabled = false;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (shareCount < maxShare) {
    alert("Please complete sharing before submitting.");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const college = document.getElementById("college").value;
  const fileLink = document.getElementById("fileLink").value;

  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("college", college);
  formData.append("fileLink", fileLink);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyQFwqnR2-Swk6olRb6eCDDD6pdyJnYJsOk2lXSKrwj7Pbrl0QKOW5vo1Ilc_p9T2SHXA/exec", {
      method: "POST",
      body: formData
    });

    const resultText = await response.text();

    if (response.ok && resultText.includes("Success")) {
      form.reset();
      form.querySelectorAll("input, button").forEach(el => el.disabled = true);
      form.style.display = "none";
      successMsg.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
      localStorage.setItem(LOCAL_STORAGE_KEY, true);
    } else {
      alert("Submission failed. Server said: " + resultText);
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert("Submission failed. See console for more info.");
  }
});
