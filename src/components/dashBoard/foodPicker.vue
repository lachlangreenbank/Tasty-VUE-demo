<template>
  <div>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm12 md12>
            <v-card class="elevation-12">
              <v-card-actions v-if="activeItems">
                <v-avatar
                  :tile="true"
                  :size="avatarSize"
                  class="grey lighten-4"
                  @click="chooseItem([activeItems[0], activeItems[1]])"
                >
                  <img :src="activeItems[0].url" :alt="activeItems[0].name">
                </v-avatar>
                <span style="font-size: 60px">{{activeItems[0].name}}</span>
                <v-avatar
                  :tile="true"
                  :size="avatarSize"
                  class="grey lighten-4"
                  @click="chooseItem([activeItems[1], activeItems[0]])"
                >
                  <img :src="activeItems[1].url" :alt="activeItems[1].name">
                </v-avatar>
                <span style="font-size: 60px">{{activeItems[1].name}}</span>
              </v-card-actions>
              <v-slider
                v-model="slider"
                :min="300"
                :max="700"
                label="Size"
                thumb-label
              ></v-slider>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  </div>
</template>

<script>
  export default {
    data: () => ({
      // Example of modeling a data value to a component, slider changes the size of the images
      slider: 500
    }),
    // Array including 2 food items passed from parent
    props: ['activeItems'],
    components: {
    },
    created: function () {
    },
    mounted: function () {
      console.log(this.activeItems)
    },
    watch: {
    },
    computed: {
      avatarSize () {
        return `${this.slider}px`
      }
    },
    methods: {
    // Emit to the parent component the choice that has been made
      chooseItem: function (choice) {
        this.$emit('choice', choice)
      }
    }
  }
</script>

<style>

</style>
