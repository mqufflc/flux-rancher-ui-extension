<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import Tab from '@shell/components/Tabbed/Tab';
import ResourceTabs from '@shell/components/form/ResourceTabs';
import RelatedResources from '@shell/components/RelatedResources';
import InventoryResources from '../components/InventoryResources.vue';

export default {
  name: 'HelmReleaseDetail',

  components: { ResourceTabs, Tab, RelatedResources, InventoryResources },

  mixins: [CreateEditView],
};
</script>

<template>
  <ResourceTabs
    :mode="mode"
    :value="value"
    :needRelated="false"
  >
    
  </ResourceTabs>
</template>
