<template>
  <div>
    <button class="link" style="float: right" v-on:click="logout">Sign out</button>
    <main>
      <h1>
        <label
          for="Title"
          style="color: var(--secondary);border-bottom: 2px solid var(--secondary);"
        >{{ savedTitle }}</label>
        {{ accountId }}
      </h1>
      <form v-on:submit.prevent="saveTitle">
        <fieldset ref="fieldset">
          <label
            for="title"
            style="display:block; color:var(--gray);margin-bottom:0.5em;"
          >Change Title</label>
          <div style="display:flex">
            <input v-model="newTitle" autocomplete="off" id="title" style="flex:1" />
            <button id="save" style="border-radius:0 5px 5px 0">Save</button>
          </div>
        </fieldset>
      </form>
      <p>Look at that! A Hello World app! This greeting is stored on the NEAR blockchain. Check it out:</p>
       
      <hr />
      <p>
        To keep learning, check out
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.near.org"
        >the NEAR docs</a> or look through some
        <a
          target="_blank"
          rel="noreferrer"
          href="https://examples.near.org"
        >example apps</a>.
      </p>
    </main>

    <Notification
      v-show="notificationVisible"
      ref="notification"
      :networkId="networkId"
      :msg="'called method: setTitle'"
      :contractId="contractId"
      :visible="false"
    />
  </div>
</template>

<script>
import { logout } from "../utils"

import Notification from "./Notification.vue"

export default {
  name: "SignedIn",

  beforeMount() {
    if (this.isSignedIn) {
      this.retrieveSavedTitle()
    }
  },

  components: {
    Notification,
  },

  data: function () {
    return {
      savedTitle: "",
      newTitle: "",
      notificationVisible: false,
    }
  },

  computed: {
    isSignedIn() {
      return window.walletConnection? window.walletConnection.isSignedIn(): false
    },
    accountId() {
      return window.accountId
    },
    contractId() {
      return window.contract? window.contract.contractId: null
    },
    networkId() {
      return window.networkId
    },
  },

  methods: {
    retrieveSavedTitle() {
      console.log("retrieveSavedTitle",window.accountId)      
      //retrieve profilx
      window.contract
        .get_title({ account_id: window.accountId })
        .then((titleFromContract) => {
          console.log("retrieveSavedTitle 2",titleFromContract)      
          this.savedTitle = titleFromContract
          this.newTitle = titleFromContract
        })
    },

    saveTitle: async function (event) {
      console.log(event);
      // fired on form submit button used to update the greeting

      // disable the form while the value gets updated on-chain
      this.$refs.fieldset.disabled = true

      try {
        
        // make an update call to the smart contract
        await window.contract.set_title({
          // pass the new greeting
          message: this.newTitle,
        })
      } catch (e) {
        alert(
          "Something went wrong! " +
            "Maybe you need to sign out and back in? " +
            "Check your browser console for more info."
        )
        throw e //re-throw
      } finally {
        // re-enable the form, whether the call succeeded or failed
        this.$refs.fieldset.disabled = false
      }

      // update savedGreeting with persisted value
      this.savedTitle = this.newTitle

      this.notificationVisible = true //show new notification

      // remove Notification again after css animation completes
      // this allows it to be shown again next time the form is submitted
      setTimeout(() => {
        this.notificationVisible = false
      }, 11000)

    },

    logout: logout,
  },
}
</script>
