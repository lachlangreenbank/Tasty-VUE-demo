// eslint-disable

<template>

	<div>
		<head>
		  <title>Login Here</title>
		  <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" type="image/png" href="../../assets/logos/mini/mini.png"/>
		</head>

	<div class="bg">
		<div class="overlay-bg"></div>

		<div v-bind:class="{ shake: errorShake }" class="login-wrap">
		   <div class=" navbar-collapse" id="bs-example-navbar-collapse-1">
       <h2 style="text-align:center;"> Tasty </h2>
		    <ul class="nav navbar-nav">
		        <li> <v-btn @click="goToSignup()" primary>Signup</v-btn></a></li>
		    </ul>

		    </div>
		      
		      <div class="form">


		        <div class="form-box">
		           <button @click="googleLogin" class="btn btn-primary white" type="submit"> <img style="position:relative; right:10px;" height="35px" width="35px" src="./google.png"></img>

		            <span style="position:relative;left:0;">
		                Login with <strong>Google</strong> </span>
		            </button>
		             <!--  <button onclick="store_query()" class="btn btn-login-avalon pale-purple" type="submit"> <img style="position:relative; right:6px;" height="35px" width="35px" src="./fb.png"></img> <span style="position:relative;left:5px;"> Log in with <strong>Facebook</strong> </span></button>
 -->
		            <div class="login-splitter"></div>


		            <input v-model="email" type="text" autocomplete="off" placeholder="Email" name="email" id="email"/>
		            <input v-if="!resetPass" v-model="password" @keypress.enter="login()" type="password" placeholder="Password" name="password" />
                <v-btn @click="login()" class="btn-primary-login" v-if="!resetPass">Login</v-btn>
                <v-btn @click="sendResetEmail()" class="btn-primary-login" v-if="resetPass">Send email</v-btn>
                <v-checkbox class="resetPass" v-model="resetPass" > </v-checkbox><span class="resetPassText">Reset password</span>
                <p v-if="errorMsg != ''" style="margin-left: 20px; margin-top: -40px; padding:10px;"> {{ errorMsg }}</p>
  		    </div>
  		  </div>
      </div>
    </div>


      <svg width="580" height="400.00000000000006" class="svg-seed-animation" xmlns="http://www.w3.org/2000/svg">
       <g>
        <title>Layer 1</title>
        <path stroke="#7f3f00" id="line_3" d="m137.221808,319.444769c4.444456,23.333396 115.555869,-54.444593 34.444538,-114.444755c-81.111331,-60.000163 -32.22231,-101.111386 -32.777083,-101.666402" stroke-width="8" fill="none"/>
        <path id="line_1" d="m138.332922,326.111453c3.333342,17.777826 113.333641,-86.666902 177.77826,-48.889022c64.444619,37.77788 95.555815,-13.33337 95.001036,-13.888389" stroke-width="8" stroke="#7f3f00" fill="none"/>
        <path stroke="#7f3f00" id="line_2" d="m158.332976,319.444768c-16.666712,24.444511 130.000353,-81.111331 85.555788,-183.33383c-44.444565,-102.2225 86.668462,-152.221553 52.778701,-73.888548c-33.889761,78.333005 32.777087,100.555288 60.55494,81.666347" stroke-width="8" fill="none"/>
        <path id="svg_20" fill-opacity="null" stroke-opacity="null" stroke-width="3" stroke="#ffffff" fill="none"/>
        <ellipse ry="26.111182" rx="24.444511" id="bead_1" cy="106.666413" cx="139.444036" stroke-opacity="null" stroke-width="3" stroke="#ffffff" fill="#7fff00"/>
        <ellipse ry="26.111182" rx="24.444511" id="bead_2" cy="258.889054" cx="410.555883" stroke-opacity="null" stroke-width="3" stroke="#ffffff" fill="#7fff00"/>
        <ellipse ry="26.111182" rx="24.444511" id="bead_3" cy="137.777608" cx="362.777975" stroke-opacity="null" stroke-width="3" stroke="#ffffff" fill="#7fff00"/>
        <line stroke-linecap="null" stroke-linejoin="null" id="line_3" y2="329.444796" x2="132.777351" y1="320.555883" x1="132.777351" stroke-width="3" stroke="#00ff00" fill="none"/>
        <path id="seed_1" d="m86.110558,313.778084l-31.665967,-96.110834c0.554772,0.555019 -13.889712,-55.000687 64.999391,37.221785c78.889103,92.222473 20.000054,86.666902 19.445281,86.111881c0.554773,0.555021 -40.556449,7.221706 -52.778705,-27.222832z" stroke-width="8" fill="#191919"/>
        <path stroke="#ffffff" id="line_1" d="m102.879204,337.222595c0,0 25.75051,-37.33699 -2.452429,-78.536426c-28.202938,-41.199437 -45.369945,-42.486919 -45.982185,-43.130037" stroke-width="3" fill="none"/>
        <path stroke="#ffffff" id="line_1" d="m94.190094,327.22257c0,0 19.949442,-32.222313 -1.899946,-67.777968c-21.849387,-35.555656 -35.149016,-36.66677 -35.62333,-37.221789" stroke-width="3" fill="none"/>
       </g>
      </svg>
    </div> 
	</div>

  

</template>

<script src="https:`/`/cdn.firebase.com/js/simple-login/1.6.4/firebase-simple-login.js"></script>

<script>

import firebase from 'firebase'
export default {
  name: 'login',
  data: function () {
    return {
      email: '',
      password: '',
      errorShake: false,
      errorMsg: '',
      resetPass: false
    }
  },
  mounted: function () {
    let self = this
    console.log(localStorage.getItem('1'))
    if (localStorage.getItem('needsToVerifyEmail') === '1') {
      self.errorMsg = 'Ensure you verify your email before trying to proceed'
    }
  },
  methods: {
    sendResetEmail: function () {
      var auth = firebase.auth()
      var emailAddress = this.email

      let self = this
      auth.sendPasswordResetEmail(emailAddress).then(function () {
        self.errorMsg = 'Check email for password reset'
      }).catch(function (error) {
        console.log(error)
        self.errorMsg = 'Ensure your email is correct, the email is not sending. If it is the right email and it is not working please try again later or contact support at lachlan.greenbank@gmail.com.'
      })
    },
    goToSignup: function () {
      this.$router.replace('../signup')
    },
    googleLogin: function () {
      if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider()
        // [END createprovider]
        // [START addscopes]
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithPopup(provider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken // eslint-disable-line no-unused-vars
          // The signed-in user info.
          var user = result.user // eslint-disable-line no-unused-vars
          // [START_EXCLUDE]
          // document.getElementById('quickstart-oauthtoken').textContent = token

          // this.$router.replace('') TODO replace window haing with router change
          window.location = '/dashboard'

          // [END_EXCLUDE]
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code // eslint-disable-line no-unused-vars
          var errorMessage = error.message // eslint-disable-line no-unused-vars
          // The email of the user's account used.
          var email = error.email // eslint-disable-line no-unused-vars
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential // eslint-disable-line no-unused-vars
          // [START_EXCLUDE]
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.')
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
          } else {
            console.error(error)
          }
          // [END_EXCLUDE]
        })
        // [END signin]
      } else {
        // [START signout]
        firebase.auth().signOut()
        // [END signout]
      }
      // [START_EXCLUDE]
     // document.getElementById('quickstart-sign-in').disabled = true
      // [END_EXCLUDE]
    },
    login: function () {
      let self = this

      // Remove any appended spaces from prefill emails..
      self.email = self.email.replace(/ /g, '')

      // if we are not on safari, do vibration stuff
      if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      } else {
        navigator.vibrate([50, 30, 80, 40, 100, 50, 130, 60, 150, 70])
      }
      firebase.auth().signInWithEmailAndPassword(self.email, self.password).then(
        (user) => {
          // this.$router.replace('')
          localStorage.removeItem('needsToVerifyEmail')
          window.location = '/dashboard'

          this.$store.state.safelyStoredNumber = 1
        },
        function (err) {
          // alert('Oops. ' + err.message)
          self.errorMsg = 'Oops. ' + err.message
          self.errorShake = true
          // if we are not on safari, do vibration stuff
          if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
          } else {
            navigator.vibrate([300])
          }
          setTimeout(function () {
            self.errorShake = false
          }, 500)
        }
      )
    }
  }
}
/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]

// [END buttoncallback]
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
</script>

<style scoped>

* { 
  box-sizing: border-box; margin: 0; padding:0;
}

span{
  top:0 !important;
}

html {
  background: #95a5a6 cover;
  font-family: 'Helvetica Neue', Arial, Sans-Serif;
}

body, html {
  height:auto !important;
  min-height:1000px;
  width:100%;
  position: static;
}

.nav.navbar-nav{
  width:100%;
  background: -moz-linear-gradient(right, rgba(118,240,227,1) 0%, rgba(95,139,238,1) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(right, rgba(118,240,227,1) 0%, rgba(95,139,238,1) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to left, rgba(118,240,227,1) 0%, rgba(95,139,238,1) 100%); 
  list-style: none;
  padding:20px;
  text-decoration: none;
}
.navbar-nav a{
  font-size: 14px;
  text-decoration: none;
  color:white;

}
.login-wrap {
  position: absolute;
  left:10%;
  margin: 100px auto;
  background: #ecf0f1;
  width: 350px;
  border-radius: 5px;
  border:2px solid silver;
  text-decoration: none;
  border-radius: 30px, 30px, 0,0;

}

.resetPass {
  transform: translateX(120px);
}
.resetPassText {
  position:relative; 
  top:-51px !important; 
  left: 150px !important;
}

@media screen and (max-width: 800px) {

  .resetPass {
    transform: translateX(100px);
  }
  .resetPassText {
    position:relative; 
    top:-51px !important; 
    left: 40% !important;
  }
  .svg-seed-animation  {
    display: none
  }
  .login-wrap {
    left:0;
    width: auto;
    top:-50px;
  }
}
  h2 {
    text-align: center;
    font-weight: 200;
    font-size: 2em;
    margin-top: 10px;
    color: #34495e;
  }
  
  .form-box {
    border-radius: 30px, 30px, 0,0;
    padding-top: 30px;

}
.bg {
  width:100%;
  height:100vh;
  background:url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e6e6e6' fill-opacity='0.96' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
}

  h2 {
    text-align: center;
    font-weight: 200;
    font-size: 2em;
    margin-top: 10px;
    color: #34495e;
  }
  
  .form-box {
    border-radius: 30px, 30px, 0,0;
    padding-top: 30px;

}
button.btn.btn.btn-primary-login{
  position: relative;
  bottom: 0px !important;
  transition: 0.2s all;
  box-shadow:none;
  background-color: white;
  border: 1px solid silver;
}
.login-splitter{
  width:40%;
  margin:15px auto;
  height:1px;
  background-color: rgba(0,0,0,0.2);

  height:1px;

}
  input[type="text"],
  input[type="password"],
  button {
    width: 65%;
    margin-left: 20%;
    margin-bottom: 10px;
    height: 40px;
    padding-bottom: 0px;
    border-radius: 5px;
    outline: 0;
    -moz-outline-style: none;
  }
  
  input[type="text"],
  input[type="password"] {
    width:90%;
    margin-left: 5%;
    border: 1px solid #bbb;
    padding: 0 0 0 10px;
    font-size: 14px;
    }
    input[type="text"],
  input[type="password"]:focus {
      border: 1px solid #3498db;
    }
  

  
  a {
    text-align: center;
    font-size: 10px;
    color: #3498db;
   } 
    p{
      padding-bottom: 10px;
    }
    

  
  button {
    background: #e74c3c;
    border:none;
    color: white;
    font-size: 12px;
    font-weight: 200;
    cursor: pointer;
     
  }  
button:hover {
          
  cursor: pointer; 
}
  
button:active {

}

.footer-container{

  position: absolute;
  bottom: 0;
  left: 0;
  width:100%;
  height:60px;
  background-color: rgba(255,255,255,0.2);
  border-top: white solid 2px;
}
.footer-banner{
  width:60%;
  text-align:center;
  padding:10px 12% ;
  height:100px;
  margin: auto auto;
   
}
       
.primary-blue{ 
    background-color: rgba(95,139,238,1);
    width:60%;
    height:40px;
 
}
.orange{
    background-color: rgba(239,157,76,1);
}

.white{
    background-color: rgba(255,255,255,1);
    color:rgba(0,0,0,0.8);
    
}
.pale-purple{
    background-color: rgba(72,88,148,1);

}

.svg-seed-animation  {
  left:800px;
  top:200px;
  position:absolute;
  transform: scale(1);
}

#bead_1{
  -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
  animation: float 5s infinite;
}
#bead_2{
  -webkit-animation: mymove 6s infinite; /* Safari 4.0 - 8.0 */
  animation: float 6s infinite;
}
#bead_3{
  -webkit-animation: mymove 4s infinite; /* Safari 4.0 - 8.0 */
  animation: float 4s infinite;
}
#seed_1{
  -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
  animation: float 5s infinite;
}
#line_1{
  -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
  animation: float 5s infinite;
}
#line_2{
  -webkit-animation: mymove 3s infinite; /* Safari 4.0 - 8.0 */
  animation: float 3s infinite;
}
#line_3{
  -webkit-animation: mymove 7s infinite; /* Safari 4.0 - 8.0 */
  animation: float 7s infinite;
}

@keyframes float {
   0% {
       transform: scale(0.999, 0.999) rotate(0deg) translate3d(0px, 0px, 1px);
       animation-timing-function:ease-in-out
   }

   25% {
       transform: scale(1.005, 1.005) rotate(1deg) translate3d(0px, 4px, 1px);
       animation-timing-function:ease-in-out
   }

   50% {
       transform: scale(1.005, 1.005) rotate(2deg) translate3d(4px, 4px, 1px);
       animation-timing-function:ease-in-out
   }

   75% {
       transform: scale(1.005, 1.005) rotate(1deg) translate3d(4px, 0px, 1px);
       animation-timing-function:ease-in-out
   }

   100% {
       transform: scale(0.999, 0.999) rotate(0deg) translate3d(0px, 0px, 1px);
       animation-timing-function:ease-in-out
   }
}

.shake{
  -webkit-animation: shake 0.3s infinite; /* Safari 4.0 - 8.0 */
  animation: shake 0.3s infinite;
  background-color: rgba(255, 153, 51, 0.1) !important;
  border:1px orange solid;
  transition: 0.2s all;
}

@keyframes shake {
   0% {
       transform: scale(0.999, 0.999) rotate(0deg) translate3d(0px, 0px, 1px);
       animation-timing-function:ease-in-out
   }

   12.5% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(6px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   25% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(12px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   32.5% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(6px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   50% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(0px, 0px, 10px);
       animation-timing-function:ease-in-out
   }

   72.5% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(6px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   75% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(-12px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   87.5% {
       transform: scale(1.000, 1.000) rotate(0deg) translate3d(6px, 0px, 20px);
       animation-timing-function:ease-in-out
   }

   100% {
       transform: scale(0.999, 0.999) rotate(0deg) translate3d(0px, 0px, 1px);
       animation-timing-function:ease-in-out
   }
}



</style>
