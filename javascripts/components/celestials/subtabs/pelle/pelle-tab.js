"use strict";

Vue.component("pelle-tab", {
  data() {
    return {
      isDoomed: false,
      armageddonInterval: 0,
      unstableMatter: new Decimal(0),
      hasFamine: false
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.armageddonInterval = Pelle.armageddonInterval;
      this.unstableMatter.copyFrom(player.celestials.pelle.unstableMatter);
      this.hasFamine = PelleUpgrade.famineUnlock.isBought;
    },
    getDoomed() {
      player.celestials.pelle.doomed = true;
      Pelle.armageddon(false);
      Glyphs.unequipAll();
      respecTimeStudies(true);
      disChargeAll();
    },
    upgradeClass(upg) {
      return {
        [`pelle-upgrade-${upg.config.currency}`]: true,
        "pelle-upgrade--canbuy": upg.canBeBought,
        "pelle-upgrade--isbought": upg.isBought
      };
    }
  },
  computed: {
    upgrades() {
      return PelleUpgrade.all;
    }
  },
  template:
    `<div class="l-pelle-celestial-tab">
      <button @click="getDoomed()">Doom your reality lol</button>
      <p>Armageddon is happenings every {{ armageddonInterval / 1000 }} seconds</p>
      <p>You have <b>{{ format(unstableMatter, 2, 2) }}</b> Unstable matter</p>
      <div class="c-pelle-currency-container">
        <pelle-currency currency="famine" v-show="hasFamine"/>
        <pelle-currency currency="chaos" v-show="false"/>
        <pelle-currency currency="pestilence" v-show="false"/>
      </div>
      <div class="pelle-upgrades--container">
        <pelle-upgrade v-for="upg in upgrades" :upgrade="upg" />
      </div>
    </div>`
});
