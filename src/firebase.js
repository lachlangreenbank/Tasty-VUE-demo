import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyCHA83hSw92vn3JZvgG_Kbw2ZOvojD9UCU',
  authDomain: 'https://cool-app-3fa91.firebaseio.com/',
  databaseURL: 'https://cool-app-3fa91.firebaseio.com/',
  projectId: 'cool-app-3fa91',
  storageBucket: 'https://cool-app-3fa91.firebaseio.com/',
  messagingSenderId: '676767519841'
})

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database()
