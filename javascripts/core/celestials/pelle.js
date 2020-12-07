"use strict";

const Pelle = {
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isDoomed) return false;

    switch (mechanic) {

      // case: "glyphs"
      default:
        return true;
    }
  },

  armageddon(gainStuff) {
    const time = player.records.thisReality.realTime;
    finishProcessReality({ reset: true });
    this.cel.lastArmageddonAt = Date.now();
    if (gainStuff) {
      let unstableMatterGain = Math.log10(this.cel.maxAMThisArmageddon.log10()) ** 3;
      if (PelleUpgrade.timeMultToUnstable.canBeApplied) {
        unstableMatterGain *= (time / 1000) ** 1.1;
      }
      this.cel.unstableMatter = this.cel.unstableMatter.plus(unstableMatterGain);
    }

    this.cel.maxAMThisArmageddon = new Decimal(0);
  },

  gameLoop(diff) {
    if (Date.now() - this.cel.lastArmageddonAt > this.armageddonInterval) {
      this.armageddon(true);
    }

    if (this.isDoomed) {
      this.cel.maxAMThisArmageddon = player.antimatter.max(this.cel.maxAMThisArmageddon);
    }

    const currencies = ['famine', 'pestilence', 'chaos'];

    currencies.forEach(currency => {
      this.cel[currency].timer += TimeSpan.fromMilliseconds(diff).totalSeconds;
      if (this.cel[currency].timer > this[currency].fillTime) {
        this.cel[currency].amount = this.cel[currency].amount.plus(this[currency].gain)
        this.cel[currency].timer = 0
      }
    })
  },

  famine: {
    get fillTime() { return 2.5 * 1 / Math.log10(Math.log10(player.dimensionBoosts) + 1) },
    get gain() { return 1 }
  },
  pestilence: {
    get fillTime() { return 10 },
    get gain() { return 1 }
  },
  chaos: {
    get fillTime() { return 10 },
    get gain() { return 1 }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  // Milliseconds
  get armageddonInterval() {
    if (PelleUpgrade.longerArmageddon.canBeApplied) return 5000;
    return 500;
  }
};

class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades
  }

  get currency() {
    if (this.config.currency === "unstableMatter") return player.celestials.pelle[this.config.currency];
    return player.celestials.pelle[this.config.currency].amount
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return this.config.cost;
  }

  get currencyDisplay() {
    switch(this.config.currency) {
      case "unstableMatter":
        return "Unstable Matter";

      case "famine":
        return "Famine";

      case "pestilence":
        return "Pestilence";

      case "chaos":
        return "Chaos";
    }
  }
}

const PelleUpgrade = (function() {
  const db = GameDatabase.celestials.pelle.upgrades;
  const obj = {}
  Object.keys(db).forEach(key => {
    obj[key] = new PelleUpgradeState(db[key]);
  })
  return {
    all: Object.values(obj),
    ...obj
  }
}());