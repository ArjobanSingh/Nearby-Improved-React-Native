// import * as Google from 'expo-google-app-auth';
// import * as firebase from 'firebase';

// const isUserEqual = (googleUser, firebaseUser) => {
//     if (firebaseUser) {
//       var providerData = firebaseUser.providerData;
//       for (var i = 0; i < providerData.length; i++) {
//         if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
//             providerData[i].uid === googleUser.getBasicProfile().getId()) {
//           // We don't need to reauth the Firebase connection.
//           return true;
//         }
//       }
//     }
//     return false;
//   }

// const onSignIn = (googleUser) => {
//     console.log('Google Auth Response');
//     // We need to register an Observer on Firebase Auth to make sure auth is initialized.
//     var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
//       unsubscribe();
//       // Check if we are already signed-in Firebase with the correct user.
//       if (!isUserEqual(googleUser, firebaseUser)) {
//         // Build Firebase credential with the Google ID token.
//         var credential = firebase.auth.GoogleAuthProvider.credential(
//             googleUser.idToken,
//             googleUser.accessToken);
//         // Sign in with credential from the Google user.
//         firebase.auth().signInWithCredential(credential).then((result) => {
//             //loginUser()
//             if (result.additionalUserInfo.isNewUser)
//             {
//                 firebase.database().ref('/users/' + result.user.uid)
//                 .set({
//                     gmail: result.user.email,
//                     profile_picture : result.additionalUserInfo.profile.picture,
//                     locale: result.additionalUserInfo.profile.locale,
//                     first_name: result.additionalUserInfo.profile.given_name,
//                     last_name: result.additionalUserInfo.profile.family_name,
//                     created_at:Date.now()
//                 })
//                 // .then((snapshot) => {
//                 //         //
//                 // });
//             }else{
//                 firebase.database().ref('/users/' + result.user.uid).update({
//                     last_logged_in: Date.now()
//                 })
//             }

            
//         })
//         .catch(function(error) {
//           // Handle Errors here.
//           var errorCode = error.code;
//           var errorMessage = error.message;
//           // The email of the user's account used.
//           var email = error.email;
//           // The firebase.auth.AuthCredential type that was used.
//           var credential = error.credential;
//           // ...
//         });
//       } else {
//         console.log('User already signed-in Firebase.');
//       }
//     });
//   }

// const signInWithGoogleAsync = async() => {
//     try {
//       const result = await Google.logInAsync({
//         // behavior: 'system',  
//         androidClientId: '309181979930-s8tdhbu6hbbbcaf9naeuutbo1m2tb6aq.apps.googleusercontent.com',
//         iosClientId: '309181979930-kcag7903p8v16vocqk69e8u8b5dsdhui.apps.googleusercontent.com',
//         scopes: ['profile', 'email'],
//       });
  
//       if (result.type === 'success') {
//           onSignIn(result);
//         return {token: result.accessToken};
//       } else {
//         return { cancelled: true, err_data: "Login Cancelled" };
//       }
//     } catch (e) {
//       return { error: true, err_data: e };
//     }
//   }

//   export default signInWithGoogleAsync;