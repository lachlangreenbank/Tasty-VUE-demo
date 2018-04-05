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
              <span style="font-size:50px; margin:20%">Thai</span>
              <v-progress-linear :value="foodData.Thai.points" height="20" color="success"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:20%">Mexican</span>
              <v-progress-linear :value="foodData.Mexican.points" height="20" color="warning"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:20%">Burgers</span>
              <v-progress-linear :value="foodData.Burgers.points" height="20" color="error"></v-progress-linear>
            </v-flex>
            <v-flex xs3 sm3 md3>
              <span style="font-size:50px; margin:20%">Peruvian</span>
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
      // For keeping scpoe in callbacks
      let self = this

      this.storageRef = firebase.storage().ref()

      let foodItemsRef = 'foodItems'
      this.foodItemsRef = db.ref(foodItemsRef)

      let foodDataRef = 'foodData'
      this.foodDataRef = db.ref(foodDataRef)

      this.foodItemsRef.once('value').then(function (snapshot) {
        console.log(snapshot.val())
        self.foodItems = snapshot.val()
        self.activeItems = self.twoRandomFoods()
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })

      this.foodDataRef.on('value', function (snapshot) {
        console.log(snapshot.val())
        self.foodData = snapshot.val()
        self.foodDataReady = false
        self.foodDataReady = true
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    },
    mounted: function () {

    },
    watch: {
    },
    computed: {
    },
    methods: {
      applyScoreChange: function (teamUp, teamDown) {
        console.log(teamUp, teamDown)
        let updatedScores = {}
        updatedScores[teamUp] = {'points': this.foodData[teamUp].points += 20}
        updatedScores[teamDown] = {'points': this.foodData[teamDown].points -= 20}

        console.log(this.foodData[teamUp].points)
        if (this.foodData[teamUp].points > 99) {
          this.winnerAnnounce = true
          this.winnningTeam = teamUp
        }
        console.log(updatedScores)
        this.foodDataRef.update(updatedScores, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log('Node sucessfully updated')
          }
        })
      },
      twoRandomFoods: function () {
        let randomNumberOne = Math.floor(Math.random() * 8)
        let randomNumberTwo = Math.floor(Math.random() * 8)

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