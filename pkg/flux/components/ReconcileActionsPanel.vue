<script>
import { reconcileInvoke, reconcileSourceInvoke, canReconcile } from '../actions/reconcile';
import { KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME } from '../shared-config';

export default {
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      reconciling: false,
      reconcilingSource: false,
    };
  },

  computed: {
    showReconcile() {
      return canReconcile(this.resource);
    },

    showReconcileSource() {
      return this.showReconcile && [KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME].includes(this.resource.type);
    },
  },

  methods: {
    async reconcile() {
      this.reconciling = true;

      try {
        await reconcileInvoke({}, [this.resource]);
      } finally {
        this.reconciling = false;
      }
    },

    async reconcileSource() {
      this.reconcilingSource = true;

      try {
        // reconcileSourceInvoke reads this.$store, so it must run bound to a component instance.
        await reconcileSourceInvoke.call(this, {}, [this.resource]);
      } finally {
        this.reconcilingSource = false;
      }
    },
  },
};
</script>

<template>
  <div v-if="showReconcile" class="mb-20">
    <button type="button" class="btn role-primary mr-10" :disabled="reconciling" @click="reconcile">
      <i class="icon icon-refresh mr-10" :class="{ 'icon-spin': reconciling }" />
      {{ t('flux.reconcile-action-label') }}
    </button>
    <button
      v-if="showReconcileSource"
      type="button"
      class="btn role-secondary"
      :disabled="reconcilingSource"
      @click="reconcileSource"
    >
      <i class="icon icon-refresh mr-10" :class="{ 'icon-spin': reconcilingSource }" />
      {{ t('flux.reconcile-source-action-label') }}
    </button>
  </div>
</template>
