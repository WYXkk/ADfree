import PrimaryButton from "@/components/PrimaryButton";

Vue.component("modal-automator-script-delete", {
  components: {
    PrimaryButton
  },
  props: {
    modalConfig: Object
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
  },
  methods: {
    handleNoClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    },
    handleYesClick() {
      const script = this.modalConfig.scriptID;
      const runningScriptID = AutomatorBackend.state.topLevelScript;

      AutomatorBackend.deleteScript(script);

      const scriptList = Object.values(player.reality.automator.scripts).map(sc => ({
        id: sc.id,
        name: sc.name,
      }));
      if (AutomatorBackend.isOn && runningScriptID !== script) {
        player.reality.automator.state.editorScript = runningScriptID;
      } else {
        // AutomatorBackend.deleteScript will create an empty script if necessary
        player.reality.automator.state.editorScript = scriptList[0].id;
      }

      // Deleting a script leaves a gap in ids, shift all of them down to fill it
      let newID = 0;
      const shiftedScripts = {};
      for (const id of Object.keys(player.reality.automator.scripts)) {
        shiftedScripts[newID] = player.reality.automator.scripts[id];
        shiftedScripts[newID].id = newID;
        newID++;
      }
      player.reality.automator.scripts = shiftedScripts;

      EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>Delete this script</h2>
      <div class="c-modal-message__text">
        Please confirm your desire to delete this Automator script.
        This is permanent and irreversible. There is no gain from doing this.
      </div>
      <div class="l-options-grid__row">
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >
          Delete
        </PrimaryButton>
      </div>
    </div>`
});
