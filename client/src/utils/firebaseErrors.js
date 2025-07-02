// src/utils/firebaseErrors.js

export const getFirebaseAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please use a different one.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Try again later.";
    case "auth/invalid-credential":
      return "Invalid login credentials. Please try again.";
    case "auth/missing-email":
      return "Please enter your email.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
