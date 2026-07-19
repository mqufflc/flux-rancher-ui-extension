<script>
import ResourceTable from '@shell/components/ResourceTable';
import { STATES_ENUM, colorForState, stateDisplay } from '@shell/plugins/dashboard-store/resource-class';
import { NAME, NAMESPACE, STATE, TYPE } from '@shell/config/table-headers';
import { sortableNumericSuffix } from '@shell/utils/sort';
import { NAME as EXPLORER } from '@shell/config/product/explorer';
import { BadgeState } from '@shell/rancher-components/BadgeState';
import { FLUX_PRODUCT_NAME, FLUX_RESOURCE_TYPES } from '../shared-config';

const RELATIONSHIP = {
  name: 'relationship',
  labelKey: 'flux.relatedResources.relationshipColumn.label',
  value: 'relationship',
  getValue: (row) => row.relationship,
  sort: 'relationship',
};

export default {
  components: { ResourceTable, BadgeState },

  props: {
    // Refs to resolve and display, e.g. { type: 'source.toolkit.fluxcd.io.gitrepository', id: 'default/my-repo', relationship: 'Source' }
    refs: {
      type: Array,
      required: true,
    },

    showRelationship: {
      type: Boolean,
      default: false,
    },

    search: {
      type: Boolean,
      default: true,
    },

    groupable: {
      type: Boolean,
      default: true,
    },
  },

  async fetch() {
    const inStore = this.$store.getters['currentStore']();

    // allSettled: a single ref with no known schema, missing RBAC, or since-deleted
    // resource must not block the rest of the table from ever leaving the loading state.
    await Promise.allSettled(this.rows.map((row) => {
      return this.$store.dispatch(`${inStore}/find`, { type: row.type, id: row.id });
    }));

    this.loading = false;
  },

  data() {
    return { loading: true };
  },

  computed: {
    rows() {
      const cluster = this.$store.getters['clusterId'];
      const inStore = this.$store.getters['currentStore']();
      const out = [];

      for (const ref of this.refs) {
        const { type, id, relationship } = ref;

        let namespace = null;
        let name = id;
        const idx = id.indexOf('/');

        if (idx > 0) {
          namespace = id.substring(0, idx);
          name = id.substring(idx + 1);
        }

        const state = this.$store.getters[`${inStore}/byId`](type, id)?.state || STATES_ENUM.MISSING;
        const stateColor = colorForState(state);
        const schema = this.$store.getters[`${inStore}/schemaFor`](type);

        const key = `${type}/${namespace}/${name}`;

        // The route name is always the shell's generic "product" page (see
        // Resource._detailLocation in @rancher/shell/plugins/dashboard-store/resource-class.js) -
        // only params.product varies. Using a product-specific route name here breaks nav
        // highlighting/menu state, since those are keyed off this literal route name.
        const product = FLUX_RESOURCE_TYPES.includes(type) ? FLUX_PRODUCT_NAME : EXPLORER;

        const detailLocation = {
          name: `c-cluster-product-resource${namespace ? '-namespace' : ''}-id`,
          params: {
            product,
            cluster: inStore === 'management' ? 'local' : cluster,
            resource: type,
            namespace,
            id: name,
          }
        };

        out.push({
          type,
          id,
          state,
          relationship,
          metadata: { namespace, name },
          _key: key,

          name,
          namespace,
          nameDisplay: name,
          nameSort: sortableNumericSuffix(name).toLowerCase(),

          stateColor,
          detailLocation,
          typeDisplay: this.$store.getters['type-map/labelFor'](schema),
          stateDisplay: stateDisplay(state),
          stateBackground: stateColor.replace('text-', 'bg-'),
          groupByLabel: namespace,
        });
      }

      return out;
    },

    headers() {
      const out = [STATE, TYPE, NAME, NAMESPACE];

      if (this.showRelationship) {
        out.push(RELATIONSHIP);
      }

      return out;
    },
  },
};
</script>

<template>
  <ResourceTable :schema="null" :rows="rows" :headers="headers" :search="search" :table-actions="false"
    :namespaced="true" :groupable="groupable" :loading="loading">
    <template #cell:state="{ row }">
      <BadgeState :value="row" />
    </template>
  </ResourceTable>
</template>
