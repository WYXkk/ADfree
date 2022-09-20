/* eslint-disable camelcase */
import { GameDatabase } from "../game-database";

const propList = {
  AD: ["purchase", "dimboost", "achievement", "sacrifice", "infinityUpgrade", "breakInfinityUpgrade",
    "infinityChallenge", "infinityPower", "timeStudy", "eternityChallenge", "glyph", "alchemy", "other"],
  ID: ["purchase", "replicanti", "achievement", "timeStudy", "infinityChallenge", "eternityChallenge", "glyph",
    "alchemy", "other"],
};

// Used for individual dimension breakdowns of effects (eg. full achievement mult into its values on individual ADs)
// Results in an array of ["key_1", "key_2", ... , "key_8"]
function append8(key) {
  const props = [];
  for (let dim = 1; dim <= 8; dim++) props.push(`${key}_${dim}`);
  return props;
}

// Helper method to create very long lists of entries in the tree; format is "RESOURCE_SOURCE_DIMENSION"
function getProps(resource, tier) {
  const props = propList[resource].map(s => `${resource}_${s}`);
  if (!tier) return props;
  const newProps = [];
  for (const effect of props) newProps.push(`${effect}_${tier}`);
  return newProps;
}

// Everything is multiplierTabTree is associated with values in GameDatabase.multiplierTabValues. The only explicitly
// initialized props here are the "root" props which are viewable on the tab with full breakdowns. After the initial
// specification, all children props are dynamically added based on the arrays in the helper functions above
GameDatabase.multiplierTabTree = {
  AD_total: [
    append8("AD_total"),
    getProps("AD")
  ],
  ID_total: [
    append8("ID_total"),
    getProps("ID")
  ],
};

// Dynamically generate all values from existing values, but broken down by dimension
const resourcesWithDimensions = ["AD", "ID"];
for (const res of resourcesWithDimensions) {
  for (const prop of getProps(res)) GameDatabase.multiplierTabTree[prop] = [append8(prop)];
  for (let dim = 1; dim <= 8; dim++) GameDatabase.multiplierTabTree[`${res}_total_${dim}`] = [getProps(res, dim)];
}
