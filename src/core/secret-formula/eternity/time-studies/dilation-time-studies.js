// TS costs are replaced by requiring the least TT amount to reach -- ADfree
export const dilationTimeStudies = [
  {
    id: 1,
    description: "Unlock Time Dilation",
    cost: 7113,
    requirement: () => {
      const ttRequirement = Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement);
      if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
          ttRequirement &&
          !isInCelestialReality() && !Pelle.isDoomed
      ) {
        return true;
      }
      const tsRequirement = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
      if (Perk.bypassECDilation.canBeApplied) return tsRequirement;
      const ecRequirement = EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted;
      return tsRequirement && ecRequirement && ttRequirement;
    }
  },
  {
    id: 2,
    description: "Unlock the 5th Time Dimension",
    cost: 1007113,
    requirement: () => PlayerProgress.dilationUnlocked()
  },
  {
    id: 3,
    description: "Unlock the 6th Time Dimension",
    cost: 11007113,
    requirement: () => TimeStudy.timeDimension(5).isBought
  },
  {
    id: 4,
    description: "Unlock the 7th Time Dimension",
    cost: 111007113,
    requirement: () => TimeStudy.timeDimension(6).isBought
  },
  {
    id: 5,
    description: "Unlock the 8th Time Dimension",
    cost: 1111007113,
    requirement: () => TimeStudy.timeDimension(7).isBought
  },
  {
    id: 6,
    description: () => (Pelle.isDoomed
      ? "You cannot escape a Doomed Reality"
      : "Unlock Reality"),
    cost: 1111007114,
    requirement: () => TimeStudy.timeDimension(8).isBought &&
      player.records.thisReality.maxEP.exponent >= 4000 &&
      (Perk.firstPerk.isBought || Achievements.preReality.every(a => a.isUnlocked)) &&
      !Pelle.isDoomed
  }
];
