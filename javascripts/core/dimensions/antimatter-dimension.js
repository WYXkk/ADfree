"use strict";

const AntimatterDimensionCommonMultiplier = new EffectScope("Antimatter Dimension Common Multipliers", scope =>
  scope.addMultipliers(
    // Make Inf pow its own Effect Scope
    new EffectScope("Infinity Power Multiplier", scoped => {
      scoped.addMultipliers(
        new CustomEffect(
          "Infinity Power",
          () => player.infinityPower
        )).addPowers(
          new CustomEffect(
            "Infinity Power Conversion Rate",
            getInfinityConversionRate
          )
      );
      scoped.condition = () => !EternityChallenge(9).isRunning;
    }),
    new CustomEffect("Achievement Multiplier", () => Achievements.power),
    new CustomEffect("API 1", () => ShopPurchase.dimPurchases.currentMult),
    new CustomEffect("API 2", () => ShopPurchase.allDimPurchases.currentMult),
    new CustomEffect("Power Glyph", () => getAdjustedGlyphEffect("powermult")),
    new CustomEffect("Alchemy Force", () => player.reality.realityMachines.powEffectOf(AlchemyResource.force)),
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    TriadStudy(4),
    AlchemyResource.dimensionality
  ).addDivisors(
    InfinityChallenge(6)
  ));

const AntimatterDimensionStandardMultipliers = Array.range(0, 9).map(tier => {
  if (tier === 0) return null;
  return new EffectScope(`Antimatter Dimension ${tier} Multipliers`, scope => {
    // Make Overides Effect Scopes?
    scope.addOverrides(
      new CustomEffect(
        "EC11",
        () =>
          player.infinityPower.pow(
            getInfinityConversionRate()
          ).max(1).times(DimBoost.multiplierToNDTier(tier)),
        undefined,
        () => EternityChallenge(11).isRunning
      )
    );
    if (tier > 6)
      scope.addOverrides(
        new CustomEffect(
          "C10",
          () => new Decimal(1),
          undefined,
          () => NormalChallenge(10).isRunning
        )
      );
    scope.addMultipliers(
      AntimatterDimensionCommonMultiplier,
      new EffectScope(`Antimatter Dimension ${tier} Buy10 Multiplier`, scoped =>
        scoped.addMultipliers(
          new CustomEffect("Buy10 Multiplier", () => AntimatterDimensions.buyTenMultiplier)
        ).addPowers(
          new CustomEffect(
            "Continuum Amount",
            () => AntimatterDimension(tier).continuumValue,
            undefined,
            () => Laitela.continuumActive
          ),
          new CustomEffect(
            "Dimensions Bought",
            () => Math.floor(AntimatterDimension(tier).bought / 10),
            undefined,
            () => !Laitela.continuumActive
          )
        )
      ),
      // Rework this to use effects on dimboost multis
      new EffectScope(`Antimatter Dimension ${tier} DimBoost Multiplier`, scoped =>
        scoped.addMultipliers(
          new CustomEffect(
            "Dimension Boosts",
            () => DimBoost.multiplierToNDTier(tier)
          )
        )
      ),
      new EffectScope(`Antimatter Dimension ${tier} Infinitied Multiplier`, scoped =>
        scoped.addMultipliers(
          AntimatterDimension(tier).infinityUpgrade,
          BreakInfinityUpgrade.infinitiedMult
        ).addPowers(
          TimeStudy(31)
        )
      ),
      Achievement(43).effects[tier]
    );
    if (tier === 1)
      scope.addMultipliers(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        TimeStudy(234)
      );
    if (tier === 8)
      scope.addMultipliers(
        new CustomEffect("Sacrifice", () => Sacrifice.totalBoost),
        Achievement(23),
        TimeStudy(214)
      );
    if (tier < 8)
      scope.addMultipliers(
        Achievement(23),
        TimeStudy(214),
        Achievement(34),
        TimeStudy(71)
      );
    if (tier <= 4)
      scope.addMultipliers(
        Achievement(64)
      );

    if (tier > 1 && tier < 8) {
      scope.addMultipliers(
        InfinityChallenge(8).reward
      );
    }

    scope.addPowers(
      new CustomEffect(
        "Infinity Challenge 4",
        () => InfinityChallenge(4).effectValue,
        undefined,
        () => InfinityChallenge(4).isRunning && player.postC4Tier !== tier
      ),
      InfinityChallenge(4).reward,
      AntimatterDimensionGlyphPowerEffect,
      AntimatterDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power,
      new CustomEffect("Cursed Dimensions", () => getAdjustedGlyphEffect("curseddimensions")),
      new CustomEffect(
        "V Dimension Power",
        () => V_UNLOCKS.ND_POW.effect(),
        undefined,
        () => V.has(V_UNLOCKS.ND_POW)
      ),
      new CustomEffect(
        "Dilation Effect",
        () => getAdjustedGlyphEffect("dilationpow"),
        undefined,
        () => player.dilation.active && !Enslaved.isRunning
      )
    );

    scope.addDilations(
      TimeDilationStrength
    );

    scope.addMultipliers(
      DilationUpgrade.ndMultDT
    );

    scope.addDilations(
      EffarigDilationStrength
    );

    scope.addPowers(
      new CustomEffect(
        "V Celestial Penalty",
        () => 0.5,
        undefined,
        () => V.isRunning
      ),
      new CustomEffect(
        "Ra Things",
        () => 1.05,
        undefined,
        // This condition doesnt work right now
        () => false
        // Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK) && scope.value.gte(AlchemyResource.inflation.effectValue)
      )
    );

  });
});

// Move these to somewhere better
const TimeDilationStrength = new EffectScope("Time Dilation Strength", scope => {
  scope.base = 0.75;
  scope.condition = () => player.dilation.active || Enslaved.isRunning;
  scope.addMultipliers(
    DilationUpgrade.dilationPenalty
  );
});

const EffarigDilationStrength = new EffectScope("Effarig Dilation Strength", scope => {
  scope.base = 0.25;
  scope.condition = () => Effarig.isRunning;
  scope.addMultipliers(
    new CustomEffect(
      // Needs a better Name
      "Nerf Factor",
      () => Effarig.nerfFactor(player.infinityPower)
    )
  );
});

const AntimatterDimensionGlyphPowerEffect = new EffectScope("Antimatter Dimension Glyph Power", scope =>
  scope.addMultipliers(
    new CustomEffect(
      "Power Glyph",
      () => getAdjustedGlyphEffect("powerpow")
    ),
    new CustomEffect(
      "Effarig Glyph",
      () => getAdjustedGlyphEffect("effarigdimensions")
    ),
    new CustomEffect(
      "Ra Momentum",
      () => Ra.momentumValue
    )
  )
);

function onBuyDimension(tier) {
  Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) {
    AntimatterDimensions.resetAmountUpToTier(tier - 1);
  }

  player.postC4Tier = tier;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  if (tier !== 8) player.achievementChecks.onlyEighthDimensions = false;
  if (tier !== 1) player.achievementChecks.onlyFirstDimensions = false;
  if (tier === 8) player.achievementChecks.noEighthDimensions = false;
  if (tier === 1) player.achievementChecks.noFirstDimensions = false;
}

function floatText(tier, text) {
  if (!player.options.animations.floatingText) return;
  const floatingText = ui.view.tabs.dimensions.antimatter.floatingText[tier];
  floatingText.push({ text, key: UIID.next() });
  setTimeout(() => floatingText.shift(), 1000);
}

function buyOneDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

  const cost = dimension.cost;

  if (tier === 8 && Enslaved.isRunning && AntimatterDimension(8).bought >= 1) return false;

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10 === 9) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought++;

  if (dimension.boughtBefore10 === 0) {
    floatText(tier, formatX(AntimatterDimensions.buyTenMultiplier, 2, 1));
  }

  if (tier === 1) {
    Achievement(28).tryUnlock();
  }

  onBuyDimension(tier);

  return true;
}

function buyManyDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought += dimension.remainingUntil10;

  floatText(tier, format(AntimatterDimensions.buyTenMultiplier, 2, 1));
  onBuyDimension(tier);

  return true;
}

function buyAsManyAsYouCanBuy(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought += howMany;

  if (dimension.boughtBefore10 === 0) {
    floatText(tier, format(AntimatterDimensions.buyTenMultiplier, 2, 1));
  }

  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  if (Laitela.continuumActive) return;
  const dimension = AntimatterDimension(tier);
  dimension.challengeCostBump();
  dimension.amount = Decimal.round(dimension.amount.plus(dimension.remainingUntil10));
  dimension.bought += dimension.remainingUntil10;
  onBuyDimension(tier);
}

function maxAll() {
  if (Laitela.continuumActive || Currency.antimatter.gt(Player.infinityLimit)) return;

  player.usedMaxAll = true;

  for (let tier = 1; tier < 9; tier++) {
    buyMaxDimension(tier);
  }

  // Do this here because tickspeed might not have been unlocked before
  // (and maxAll might have unlocked it by buying dimensions).
  buyMaxTickSpeed();
}

function buyMaxDimension(tier, bulk = Infinity, auto = false) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;
  const cost = dimension.costUntil10;
  let bulkLeft = bulk;
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && (NormalChallenge.isRunning || InfinityChallenge.isRunning)) return;

  if (tier === 8 && Enslaved.isRunning) {
    buyOneDimension(8);
    return;
  }

  const multBefore = Decimal.pow(AntimatterDimensions.buyTenMultiplier, dimension.bought / 10);

  // Buy any remaining until 10 before attempting to bulk-buy
  if (Currency.antimatter.purchase(cost)) {
    buyUntilTen(tier);
    bulkLeft--;
  }

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft > 0) {
      Currency.antimatter.subtract(dimension.costUntil10);
      buyUntilTen(tier);
      bulkLeft--;
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    Math.floor(dimension.bought / 10) + dimension.costBumps, dimension.currencyAmount
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying > bulkLeft) buying = bulkLeft;
  dimension.amount = dimension.amount.plus(10 * buying).round();
  dimension.bought += 10 * buying;
  dimension.currencyAmount = dimension.currencyAmount.minus(Decimal.pow10(maxBought.logPrice));
  const multAfter = Decimal.pow(AntimatterDimensions.buyTenMultiplier, dimension.bought / 10);
  if (multBefore.neq(multAfter) && auto === false) {
    floatText(tier, format(multAfter.dividedBy(multBefore), 2, 1));
  }
}


function canAfford(cost) {
  return (player.break || cost.lt(Decimal.NUMBER_MAX_VALUE)) && Currency.antimatter.gte(cost);
}

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = C6_BASE_COSTS[tier];
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = C6_BASE_COST_MULTIPLIERS[tier];
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  }

  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(Math.floor(this.bought / 10) + this.costBumps);
  }

  /** @returns {number} */
  get costBumps() {
    return this.data.costBumps;
  }

  /** @param {number} value */
  set costBumps(value) {
    this.data.costBumps = value;
  }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought % 10;
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return 10 - this.boughtBefore10;
  }

  /**
   * @returns {Decimal}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return Decimal.floor(Decimal.max(Decimal.min(ratio, 10 - this.boughtBefore10), 0)).toNumber();
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {Decimal}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return new Decimal(0);
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = AntimatterDimension(tier + 2).productionPerSecond;
    } else {
      toGain = AntimatterDimension(tier + 1).productionPerSecond;
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {Decimal}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount
      : Currency.antimatter.value;
  }

  /**
   * @param {Decimal} value
   */
  set currencyAmount(value) {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount = value
      : Currency.antimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return 0;
    return this.costScale.getContinuumValue(Currency.antimatter.value) * Laitela.matterExtraPurchaseFactor;
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive) return 0;
    return Math.floor(10 * this.continuumValue);
  }

  /**
   * Continuum doesn't continually update dimension amount because that would require making the code
   * significantly messier to handle it properly. Instead an effective amount is calculated here, which
   * is only used for production and checking for boost/galaxy. Doesn't affect achievements.
   * Taking the max is kind of a hack but it seems to work in all cases. Obviously it works if
   * continuum isn't unlocked. If the dimension is being produced and the continuum is unlocked,
   * the dimension will be being produced in large numbers (since the save is endgame), so the amount
   * will be larger than the continuum and so the continuum is insignificant, which is fine.
   * If the dimension isn't being produced, the continuum will be at least the amount, so
   * the continuum will be used and that's fine. Note that when continuum is first unlocked,
   * both 8d amount and 8d continuum will be nonzero until the next infinity, so taking the sum
   * doesn't work.
   * @param {Decimal} value
   */
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordable() {
    if (Laitela.continuumActive) return false;
    if (!player.break && this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return this.cost.lte(this.currencyAmount);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(Decimal.NUMBER_MAX_VALUE)) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (Currency.antimatter.gt(Player.infinityLimit)) return false;
    if (this.tier > DimBoost.totalBoosts + 4) return false;
    const hasPrevTier = this.tier === 1 ||
      (Laitela.continuumActive
        ? AntimatterDimension(this.tier - 1).continuumValue >= 1
        : AntimatterDimension(this.tier - 1).amount.neq(0));
    if (!EternityMilestone.unlockAllND.isReached && !hasPrevTier) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = new Decimal(0);
    this.bought = 0;
    this.costBumps = 0;
  }

  resetAmount() {
    this.amount = new Decimal(0);
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.e === this.cost.e) {
        dimension.costBumps++;
      }
    }
    if (Tickspeed.cost.e === this.cost.e) player.chall9TickspeedCostBumps++;
  }

  multiplyIC5Costs() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.e <= this.cost.e) {
        dimension.costBumps++;
      } else if (this.tier >= 5 && dimension.cost.e >= this.cost.e) {
        dimension.costBumps++;
      }
    }
  }

  get multiplier() {
    return AntimatterDimensionStandardMultipliers[this.tier].value;
  }

  get cappedProductionInNormalChallenges() {
    const postBreak = (player.break && !NormalChallenge.isRunning) ||
      InfinityChallenge.isRunning ||
      Enslaved.isRunning;
    return postBreak ? Decimal.MAX_VALUE : new Decimal("1e315");
  }

  get productionPerSecond() {
    const tier = this.tier;
    if (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension) return new Decimal(0);
    let amount = this.totalAmount;
    if (NormalChallenge(12).isRunning) {
      if (tier === 2) amount = amount.pow(1.6);
      if (tier === 4) amount = amount.pow(1.4);
      if (tier === 6) amount = amount.pow(1.2);
    }
    let production = amount.times(this.multiplier).dividedBy(Tickspeed.current.dividedBy(1000));
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.chall2Pow);
    }
    if (tier === 1) {
      if (NormalChallenge(3).isRunning) {
        production = production.times(player.chall3Pow);
      }
      if (production.gt(10)) {
        const log10 = production.log10();
        production = Decimal.pow10(Math.pow(log10, getAdjustedGlyphEffect("effarigantimatter")));
      }
    }
    production = production.min(this.cappedProductionInNormalChallenges);
    return production;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
const AntimatterDimension = AntimatterDimensionState.createAccessor();

const AntimatterDimensions = {
  /**
   * @type {AntimatterDimensionState[]}
   */
  all: AntimatterDimension.index.compact(),

  reset() {
    for (const dimension of AntimatterDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of AntimatterDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    if (NormalChallenge(7).isRunning) return new Decimal(2).min(1 + DimBoost.totalBoosts / 5);

    let mult = new Decimal(2).plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );

    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(getAdjustedGlyphEffect("effarigforgotten"))
      .powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);

    return mult;
  },

  tick(diff) {
    // Stop producing antimatter at Big Crunch goal because all the game elements
    // are hidden when pre-break Big Crunch button is on screen.
    const hasBigCrunchGoal = !player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning;
    if (hasBigCrunchGoal && Currency.antimatter.gte(Player.infinityGoal)) return;

    let maxTierProduced = EternityChallenge(3).isRunning ? 3 : 7;
    let nextTierOffset = 1;
    if (NormalChallenge(12).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) {
      AntimatterDimension(tier + nextTierOffset).produceDimensions(AntimatterDimension(tier), diff / 10);
    }
    if (AntimatterDimension(1).amount.gt(0)) {
      player.achievementChecks.noFirstDimensions = false;
    }
    AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
    if (NormalChallenge(12).isRunning) {
      AntimatterDimension(2).produceCurrency(Currency.antimatter, diff);
    }
  }
};
