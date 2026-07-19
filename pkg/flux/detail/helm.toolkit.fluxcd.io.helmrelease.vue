<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import Tab from '@shell/components/Tabbed/Tab';
import ResourceTabs from '@shell/components/form/ResourceTabs';
import InventoryResources from '../components/InventoryResources.vue';
import RelatedFluxResources from '../components/RelatedFluxResources.vue';

export default {
  name: 'HelmReleaseDetail',

  components: {
    ResourceTabs, Tab, InventoryResources, RelatedFluxResources
  },

  mixins: [CreateEditView],
};
</script>

<template>
  <ResourceTabs
    :mode="mode"
    :value="value"
    :needRelated="false"
  >
    <Tab
      v-if="value.status?.inventory"
      :label="t('flux.helmrelease.section.inventory.label')"
      name="inventory"
      :weight="3"
    >
      <InventoryResources :inventory="value.status.inventory" />
    </Tab>
    <Tab
      :label="t('flux.helmrelease.section.related.label')"
      name="related"
      :weight="2"
    >
      <RelatedFluxResources :value="value" />
    </Tab>
  </ResourceTabs>
</template>
