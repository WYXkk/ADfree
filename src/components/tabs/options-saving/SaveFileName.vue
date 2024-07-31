<script>
import { sha512_256 } from "js-sha512";

export default {
  name: "SaveFileName",
  components: {
  },
  data() {
    return {
      saveFileName: ""
    };
  },
  methods: {
    update() {
      this.saveFileName = player.options.saveFileName;
    },
    removeNotAvailableCharacters(input) {
      return input.replace(/[^a-zA-Z0-9 -]/gu, "");
    },
    handleChange(event) {
      const newName = this.removeNotAvailableCharacters(event.target.value.trim());
      player.options.saveFileName = newName;
      event.target.value = newName;
      const secretName = '0770aecdec8496a7a129e7510b2be6d086ecb9d86888b656ad53fd2f01401c8e';
      if(sha512_256(newName.toUpperCase()) == secretName) SecretAchievement(33).unlock();
      // Chess Battle Advanced -- ADfree
    }
  }
};
</script>

<template>
  <div class="o-primary-btn o-primary-btn--option o-primary-btn--input l-options-grid__button">
    <b>Save file name:</b>
    <span ach-tooltip="Set a custom name (up to 16 alphanumeric characters, including space and hyphen)">
      <input
        class="c-custom-save-name__input"
        type="text"
        maxlength="16"
        placeholder="Custom save name"
        :value="saveFileName"
        @change="handleChange"
      >
    </span>
  </div>
</template>

<style scoped>
.c-custom-save-name__input {
  text-align: center;
  font-family: Typewriter;
  font-size: 1.3rem;
  font-weight: bold;
  border: 0.1rem solid black;
  border-radius: var(--var-border-radius, 0.3rem);
}
</style>
