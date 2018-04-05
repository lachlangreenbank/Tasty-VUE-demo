<template>
  <div>
    <v-layout row justify-center>
      <v-tooltip class="editHeaderMenuButton"  left>
        <v-icon slot="activator" style="font-size: 18px; cursor: pointer;" dark medium @click.stop="dialog = !dialog">fa-1x fa fa-edit</v-icon>
        <span>Settings</span>
      </v-tooltip>
      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        :overlay="false"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title class="settings-title">Settings</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-list three-line subheader>
              
              <v-subheader style="display: inline-block; margin-top: 13px" >Profile Information</v-subheader>
              <span style="display: inline; margin-left: 50px" v-if="!deepEqual(stagedInfo, userInfo)">
                <span> You have unsaved changes </span>
                <v-btn color="info" round @click="saveInformation()">Save</v-btn>
              </span>

              <div style="max-width:700px; margin-left: 2%"> 
                <v-text-field
                  label="Name"
                  v-model="stagedInfo.name"
                  :counter="30"
                  style="width: 235px"
                  required
                ></v-text-field>
                <v-text-field
                  label="Bio"
                  v-model="stagedInfo.bio"
                  :counter="300"
                  required
                  textarea
                ></v-text-field>
                <v-text-field
                  label="Phone Number"
                  v-model="stagedInfo.phone"
                  style="width: 235px"
                  required
                ></v-text-field>
                <v-text-field
                  label="Bitcoin Address"
                  v-model="stagedInfo.bitcoin"
                  style="width: 310px"
                  required
                ></v-text-field>
                <v-text-field
                  label="Ethereum Address"
                  v-model="stagedInfo.ethereum"
                  style="width: 310px"
                  required
                ></v-text-field>
              </div>
            </v-list>
          </v-card-text>

          <v-card-text>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>Application Settings</v-subheader>
              <v-list-tile avatar>
                <v-list-tile-action>
                  <v-checkbox @change="saveSettings()" v-model="sound"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Sound Effects</v-list-tile-title>
                  <v-list-tile-sub-title>Play sounds when receiving notifications or when interacting with UI</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>

          <v-btn color="info" style="width: 150px; margin-left: 30px" round @click="logout()">Logout</v-btn>
          <div style="flex: 1 1 auto;"/>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import equal from 'deep-equal'

  export default {
    data () {
      return {
        userUid: null,
        dialog: false,
        sound: true,
        userInfo: {},
        information: {
          bio: '',
          bitcoin: '',
          ethereum: '',
          linkedin: '',
          name: '',
          phone: '',
          surname: ''
        },
        stagedInfo: {
          bio: '',
          bitcoin: '',
          ethereum: '',
          linkedin: '',
          name: '',
          phone: '',
          surname: ''}
      }
    },
    mounted () {
      const defaultSettings = { sound: this.sound }

      const userAuth = firebase.auth().currentUser
      this.userUid = userAuth.uid

      firebase.database().ref(`users/${this.userUid}`).once('value', data => {
        const userData = data.val()

        const { settings, information } = userData

        this.userInfo = Object.assign({}, information)
        this.stagedInfo = Object.assign({}, information)

        if (settings) {
          Object.assign(this, settings)
        } else {
          firebase.database().ref(`users/${this.userUid}/settings`).set(defaultSettings)
        }
      })
    },
    methods: {
      deepEqual: equal,
      logout: function () {
        firebase.auth().signOut().then(() => {
          this.$router.replace('login')
        })
      },
      saveSettings: function () {
        firebase.database().ref(`users/${this.userUid}/settings`).update({sound: this.sound})
      },
      saveInformation: function () {
        firebase.database().ref(`users/${this.userUid}/information`).update(this.stagedInfo)
        this.userInfo = Object.assign({}, this.stagedInfo)
        this.$forceUpdate()
      }
    }
  }
</script>

<style type="text/css">

  @media screen and (max-width: 500px) {
    .settings-title {
      position:absolute;
      right:10px;
    }
  }
  
</style>