"use strict";

const BigCrunchReset = new class BigCrunchReset extends PrestigeMechanic {
  get wasReached() {
    return false;
  }

  get wasReachedEver() {
    return false;
  }

  get goal() {
    return Player.isInAntimatterChallenge ? Player.antimatterChallenge.goal : Decimal.NUMBER_MAX_VALUE;
  }

  get currencyRequired() {
    return player.records.thisInfinity.maxAM;
  }

  get currencyGained() {
    return Currency.infinityPoints;
  }

  get prestigeStat() {
    return Currency.infinities;
  }

  get eventBefore() {
    return GAME_EVENT.BIG_CRUNCH_BEFORE;
  }

  get eventAfter() {
    return GAME_EVENT.BIG_CRUNCH_AFTER;
  }

  animation() {
    if (player.options.animations.bigCrunch) return;
    document.body.style.animation = "implode 2s 1";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }

  tabChange() {
    if (!PlayerProgress.infinityUnlocked()) {
      Tab.infinity.upgrades.show();
    } else if (this.isEarlyGame || (Player.isInAntimatterChallenge && !player.options.retryChallenge)) {
      Tab.dimensions.antimatter.show();
    }
  }

  statistics() {
    player.records.bestInfinity.bestIPminEternity =
      player.records.bestInfinity.bestIPminEternity.clampMin(player.records.thisInfinity.bestIPmin);
    player.records.thisInfinity.bestIPmin = new Decimal(0);

    player.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs.clampMin(
      gainedInfinities().round().dividedBy(player.records.thisInfinity.realTime)
    );

    const infinityPoints = gainedInfinityPoints();

    addInfinityTime(
      player.records.thisInfinity.time,
      player.records.thisInfinity.realTime,
      infinityPoints,
      gainedInfinities().round()
    );

    player.records.bestInfinity.time =
      Math.min(player.records.bestInfinity.time, player.records.thisInfinity.time);
    player.records.bestInfinity.realTime =
      Math.min(player.records.bestInfinity.realTime, player.records.thisInfinity.realTime);

    player.achievementChecks.noInfinitiesThisReality = false;

    if (!player.usedMaxAll) {
      const bestIpPerMsWithoutMaxAll = infinityPoints.dividedBy(player.records.thisInfinity.realTime);
      player.records.thisEternity.bestIPMsWithoutMaxAll =
        Decimal.max(bestIpPerMsWithoutMaxAll, player.records.thisEternity.bestIPMsWithoutMaxAll);
    }
    player.usedMaxAll = false;
  }

  gain() {
    this.currencyGained.add(gainedInfinityPoints());
    this.prestigeStat.add(gainedInfinities());
  }

  reset(forcedSoft) {
    player.dimensionBoosts = 0;
    player.galaxies = 0;
    player.records.thisInfinity.maxAM = new Decimal(0);
    Currency.antimatter.reset();
    softReset(0, forcedSoft);
    InfinityDimensions.resetAmount();
    player.records.thisInfinity.time = 0;
    player.records.thisInfinity.lastBuyTime = 0;
    player.records.thisInfinity.realTime = 0;
    player.achievementChecks.noEighthDimensions = true;
    player.achievementChecks.noSacrifices = true;
    AchievementTimers.marathon2.reset();

    let remainingGalaxies = 0;
    if (Achievement(95).isUnlocked) {
      remainingGalaxies = Math.min(player.replicanti.galaxies, 1);
    } else {
      player.replicanti.amount = new Decimal(0);
    }
    if (TimeStudy(33).isBought) {
      remainingGalaxies = Math.floor(player.replicanti.galaxies / 2);
    }
    // I don't think this Math.clampMax is technically needed, but if we add another source
    // of keeping Replicanti Galaxies then it might be.
    player.replicanti.galaxies = Math.clampMax(remainingGalaxies, player.replicanti.galaxies);
  }

  challengeCompletion() {
    const challenge = Player.antimatterChallenge;
    if (!challenge && !NormalChallenge(1).isCompleted) {
      NormalChallenge(1).complete();
    }
    if (!challenge) return;
    challenge.complete();
    challenge.updateChallengeTime();
    if (!player.options.retryChallenge) {
      player.challenge.normal.current = 0;
      player.challenge.infinity.current = 0;
    }
  }

  unlock() {
    if (EternityChallenge(4).tryFail()) return;

    if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
      EffarigUnlock.infinity.unlock();
      beginProcessReality(getRealityProps(true));
    }
  }

  get canBePerformed() {
    return super.canBePerformed || Player.isInBrokenChallenge;
  }

  get isEarlyGame() {
    return !player.break && !Achievement(55).isUnlocked;
  }

  performReset() {
    this.statistics();
    this.gain();
    this.reset(true);
    this.challengeCompletion();
    this.unlock();
  }
}();
