// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCQRLf2uCKnD6SmISmyGjmZmiF542xyKsE",
  authDomain: "fir-authentication-syste-cf6bd.firebaseapp.com",
  projectId: "fir-authentication-syste-cf6bd",
  appId: "1:108907873313:web:1764ee75a74531ba260f60",
  messagingSenderId: "108907873313",
  storageBucket: "fir-authentication-syste-cf6bd.firebasestorage.app",
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// const db = firebase.firestore();

 
// 🌗 Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const btn = document.querySelector('.toggle-theme');
  btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
//  Auth State Listener
auth.onAuthStateChanged(user => {
  const status = document.getElementById("user-status");
  if (user) {
    const name = user.displayName || user.email || user.phoneNumber || "User";
    status.innerHTML = `
      ✅ Logged in as: ${name}
      ${user.photoURL ? `<br><img src="${user.photoURL}" width="40" style="border-radius:50%;">` : ""}
    `;
  } else {
    status.innerHTML = "🔴 Not logged in";
  }
});



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
  const email = prompt("Enter your email:");
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => alert("📧 Reset email sent"))
      .catch(err => alert("❌ " + err.message));
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
// function updateUserStatus() {
//   const status = document.getElementById("user-status");
//   const user = firebase.auth().currentUser;
//   if (user) {
//     status.innerText = `✅ Logged in as: ${user.email || user.phoneNumber}`;
//   } else {
//     status.innerText = "👤 Not logged in";
//   }
// }

// // ✅ Monitor auth state on page load
// firebase.auth().onAuthStateChanged((user) => {
//   updateUserStatus();
// });
// // Store user info + role
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     db.collection("users").doc(user.uid).set({ role: "user" });
//   }
// });
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




