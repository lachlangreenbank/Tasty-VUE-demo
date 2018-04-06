<template>
  <div @click='twoRandomFoods()' id='inspire'>
    <v-toolbar color='indigo' dark fixed app>
      <v-toolbar-side-icon @click.stop='drawer = !drawer'></v-toolbar-side-icon>
      <v-toolbar-title>Tasty</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            <FoodPicker @choice="choice" :activeItems='activeItems'></FoodPicker>
          </v-flex>
        </v-layout>
      </v-container>
      <div v-if="foodDataReady">
        <v-container fluid fill-height>
          <v-layout
            justify-center
            align-center
          >
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:5%">Thai</span><span style="font-size:20px;">{{foodData.Thai.points}}/100</span>
              <v-progress-linear :value="foodData.Thai.points" height="20" color="success"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:5%">Mexican</span><span style="font-size:20px;">{{foodData.Mexican.points}}/100</span>
              <v-progress-linear :value="foodData.Mexican.points" height="20" color="warning"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:5%">Burgers</span><span style="font-size:20px;">{{foodData.Burgers.points}}/100</span>
              <v-progress-linear :value="foodData.Burgers.points" height="20" color="error"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:5%">Peruvian</span><span style="font-size:20px;">{{foodData.Peruvian.points}}/100</span>
              <v-progress-linear :value="foodData.Peruvian.points" height="20" color="purple"></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>

    <v-dialog v-model="winnerAnnounce" max-width="500px">
        <v-card>
          <v-card-title style="font-size: 50px">
            {{winnningTeam}} is the winner!!!
          </v-card-title>
          <v-card-actions>
            <v-btn @click="resetScores()" primary>Start again</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
  import {db} from '../../firebase'
  import firebase from 'firebase'

  import FoodPicker from './foodPicker.vue'

  export default {
    data: () => ({
      foodItems: {},
      foodData: {},
      foodDataReady: false,
      activeItems: [],
      lastNumbers: [99, 99],
      winnningTeam: '',
      winnerAnnounce: false
    }),
    components: {
      FoodPicker
    },
    created: function () {
      // For keeping scope in callbacks
      let self = this
      // define refference to firebase storage
      this.storageRef = firebase.storage().ref()
      // define ref to our firebase object
      let foodItemsRef = 'foodItems'
      this.foodItemsRef = db.ref(foodItemsRef)

      let foodDataRef = 'foodData'
      this.foodDataRef = db.ref(foodDataRef)
      // Grab all our food items from firebase once
      this.foodItemsRef.once('value').then(function (snapshot) {
        console.log(snapshot.val())
        self.foodItems = snapshot.val()
        self.activeItems = self.twoRandomFoods()
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
      // Grab and watch all our food team scores from firebase
      this.foodDataRef.on('value', function (snapshot) {
        console.log(snapshot.val())
        self.foodData = snapshot.val()
        self.foodDataReady = false
        self.foodDataReady = true
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    },
    methods: {
      applyScoreChange: function (teamUp, teamDown) {
        // increace score of teamUp and decreace score of teamDown
        console.log(teamUp, teamDown)
        // Create an object that has matching params of our firebase object
        let updatedScores = {}
        updatedScores[teamUp] = {'points': this.foodData[teamUp].points += 20}
        updatedScores[teamDown] = {'points': this.foodData[teamDown].points -= 20}
        // If a team has reached 100 points display winner modal
        if (this.foodData[teamUp].points > 99) {
          this.winnerAnnounce = true
          this.winnningTeam = teamUp
        }
        console.log(updatedScores)
        // sync our updated scores with our firebase object, foodDataRef path defined in created function
        this.foodDataRef.update(updatedScores, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log('Scores sucessfully updated')
          }
        })
      },
      twoRandomFoods: function () {
        // get two pseudo random numbers inbetween 0 and the length of food item array
        let randomNumberOne = Math.floor(Math.random() * this.foodItems.length)
        let randomNumberTwo = Math.floor(Math.random() * this.foodItems.length)
        // Make sure the numbers arent the last ones picked or correspond to items on the same team, if so restart function
        if (this.lastNumbers[0] !== randomNumberOne && this.lastNumbers[1] !== randomNumberTwo && randomNumberOne !== randomNumberTwo) {
          this.lastNumbers = [randomNumberOne, randomNumberTwo]
          if (this.foodItems[randomNumberOne].team !== this.foodItems[randomNumberTwo].team) {
            this.activeItems = [this.foodItems[randomNumberOne], this.foodItems[randomNumberTwo]]
            console.log(this.lastNumbers)
            return [this.foodItems[randomNumberOne], this.foodItems[randomNumberTwo]]
          } else {
            this.twoRandomFoods()
          }
        } else {
          this.twoRandomFoods()
        }
      },
      choice: function (choice) {
        // A choice has been emitted from our food picker component
        console.log(choice)
        let teamUp = choice[0].team
        let teamDown = choice[1].team
        this.applyScoreChange(teamUp, teamDown)
      },
      resetScores: function () {
        this.winnerAnnounce = false

        let updatedScores = {}
        updatedScores['Peruvian'] = {'points': 50}
        updatedScores['Burgers'] = {'points': 50}
        updatedScores['Thai'] = {'points': 50}
        updatedScores['Mexican'] = {'points': 50}

        this.foodDataRef.update(updatedScores, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log('Node sucessfully updated')
          }
        })
      }
    }
  }
</script>

<style>

</style>
