// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCQRLf2uCKnD6SmISmyGjmZmiF542xyKsE",
  authDomain: "fir-authentication-syste-cf6bd.firebaseapp.com",
  projectId: "fir-authentication-syste-cf6bd",
  appId: "1:108907873313:web:1764ee75a74531ba260f60",
  messagingSenderId: "108907873313"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// 🌗 Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const btn = document.querySelector('.toggle-theme');
  btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
//  Auth State Listener
auth.onAuthStateChanged(async (user) => {
  const status = document.getElementById("user-status");
  if (user) {
    const name = user.displayName || user.email || user.phoneNumber || "Unknown User";
    
    // Optional: fetch role from Firestore
    let role = "user";
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().role) {
        role = doc.data().role;
      }
    } catch (e) {
      console.warn("Failed to fetch role:", e);
    }

    status.innerHTML = `
      <span style="color:green;">🟢 Logged in</span><br>
      <strong>User:</strong> ${name}<br>
      <strong>Role:</strong> ${role}
      ${user.photoURL ? `<br><img src="${user.photoURL}" alt="User Photo" width="40" style="border-radius: 50%;">` : ""}
    `;
  } else {
    status.innerHTML = `<span style="color:red;">🔴 Not logged in</span>`;
  }
   if (user) {
    const doc = await db.collection("users").doc(user.uid).get();
    const role = doc.data()?.role;

    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }
  }
});
async function saveOAuthUser(result) {
  const user = result.user;
  const userRef = db.collection("users").doc(user.uid);
  const doc = await userRef.get();
  if (!doc.exists) {
    await userRef.set({
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "user",
      createdAt: new Date()
    });
  }
  alert("Login successful!");
}


// 📧 Email Sign Up
function signUp(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("✅ Sign-up successful! Logged in as " + user.email);
      updateUserStatus();
    })
    .catch((error) => {
      alert("❌ Sign-up error: " + error.message);
    });
}

// 📧 Email Login
function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("✅ Logged in as " + user.email);
      updateUserStatus();
    })
    .catch((error) => {
      alert("❌ Login error: " + error.message);
    });
}
function forgotPassword() {
  const email = prompt("Enter your email to reset password:");
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => alert("Password reset email sent."))
      .catch((error) => alert(error.message));
  }
}

// 🔐 Google Login
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      alert("✅ Google login successful!");
      updateUserStatus();
    })
    .catch(error => {
      alert("❌ Google login error: " + error.message);
    });
}

// 🔐 Facebook Login
function signInWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      alert("✅ Facebook login successful!");
      updateUserStatus();
    })
    .catch(error => {
      alert("❌ Facebook login error: " + error.message);
    });
}

// 🔐 GitHub Login
function signInWithGitHub() {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      alert("✅ GitHub login successful!");
      updateUserStatus();
    })
    .catch(error => {
      alert("❌ GitHub login error: " + error.message);
    });
}
// 📲 Phone OTP Login
let recaptchaVerifier;
let confirmationResult;

// Setup reCAPTCHA on page load
window.onload = () => {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
    size: "normal",
    callback: (response) => {
      console.log("✅ reCAPTCHA verified");
    },
    "expired-callback": () => {
      alert("⚠️ reCAPTCHA expired. Try again.");
    },
  });

  // 🔄 Render the widget
  recaptchaVerifier.render().then(widgetId => {
    window.recaptchaWidgetId = widgetId;
  });
};

//   Send OTP
function sendOTP() {
  const phoneNumber = document.getElementById("phone").value;

  firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      alert("✅ OTP sent!");
    })
    .catch(error => {
      alert("❌ Error sending OTP: " + error.message);
    });
}

//  Verify OTP
function verifyOTP() {
  const otp = document.getElementById("otp").value;

  if (!confirmationResult) return alert("❌ OTP not sent yet.");

  confirmationResult.confirm(otp)
    .then(result => {
      document.getElementById("user-status").innerText =
        "✅ Logged in as " + result.user.phoneNumber;
    })
    .catch(error => {
      alert("❌ Invalid OTP: " + error.message);
    });
}

//  Logout
function logout() {
  firebase.auth().signOut().then(() => {
    alert("✅ Logged out");
    updateUserStatus();
  }).catch((error) => {
    alert("❌ Logout error: " + error.message);
  });
}

//  Update user status
function updateUserStatus() {
  const status = document.getElementById("user-status");
  const user = firebase.auth().currentUser;
  if (user) {
    status.innerText = `✅ Logged in as: ${user.email || user.phoneNumber}`;
  } else {
    status.innerText = "👤 Not logged in";
  }
}

// ✅ Monitor auth state on page load
firebase.auth().onAuthStateChanged((user) => {
  updateUserStatus();
});
// Store user info + role
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    db.collection("users").doc(user.uid).set({ role: "user" });
  }
});
// After user signs in (in .then block)
// const user = result.user;
// db.collection("users").doc(user.uid).get().then(doc => {
//   if (!doc.exists) {
//     db.collection("users").doc(user.uid).set({
//       email: user.email || null,
//       role: "user"  // default role
//     });
//   }
// });
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const doc = await db.collection("users").doc(user.uid).get();
    const role = doc.data()?.role;

    if (!doc.exists) {
      // Only set default role if user doc doesn't exist
      await db.collection("users").doc(user.uid).set({
        email: user.email || null,
        role: "user"
      });
    }

    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }
  }
});



