<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import Tab from '@shell/components/Tabbed/Tab';
import ResourceTabs from '@shell/components/form/ResourceTabs';
import InventoryResources from '../components/InventoryResources.vue';
import RelatedFluxResources from '../components/RelatedFluxResources.vue';

export default {
  name: 'KustomizeDetail',

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
      :label="t('flux.kustomization.section.inventory.label')"
      name="inventory"
      :weight="3"
    >
      <InventoryResources :inventory="value.status?.inventory || { entries: [] }" />
    </Tab>
    <Tab
      :label="t('flux.kustomization.section.related.label')"
      name="related"
      :weight="2"
    >
      <RelatedFluxResources :value="value" />
    </Tab>
  </ResourceTabs>
</template>
