<script>
import CreateEditView from '@shell/mixins/create-edit-view';
import Tab from '@shell/components/Tabbed/Tab';
import ResourceTabs from '@shell/components/form/ResourceTabs';
import RelatedFluxResources from '../components/RelatedFluxResources.vue';

export default {
  name: 'HelmRepositoryDetail',

  components: { ResourceTabs, Tab, RelatedFluxResources },

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
      :label="t('flux.helmrepository.section.related.label')"
      name="related"
      :weight="2"
    >
      <RelatedFluxResources :value="value" />
    </Tab>
  </ResourceTabs>
</template>
