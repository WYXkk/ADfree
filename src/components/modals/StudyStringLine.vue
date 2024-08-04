<script>
export default {
  name: "StudyStringLine",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    intoEmpty: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    importDestString() {
      return this.intoEmpty ? "into an empty Tree" : "with your current Tree";
    }
  },
  methods: {
    formatTheoremCost(tt, st) {
      const strTT = `${tt < 0 ? "no more" : formatWithCommas(tt)} TT`;
      const strST = `${st < 0 ? "no more" : formatWithCommas(st)} ST`;
      return st === 0 ? strTT : `${strTT} + ${strST}`;
    }
  },
};
</script>

<template>
  <div class="l-modal-import-tree__tree-info-line">
    <div v-if="tree.newStudiesArray.length === 0">
      <i>Importing this {{ importDestString }} will not purchase any new Time Studies.</i>
    </div>
    <div v-else>
      Importing {{ importDestString }} will purchase:
      <br>
      {{ tree.newStudies }}
      (Requires {{ formatTheoremCost(tree.timeTheorems, tree.spaceTheorems) }})
    </div>
    <br>
  </div>
</template>
