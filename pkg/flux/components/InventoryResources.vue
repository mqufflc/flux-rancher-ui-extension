<script>
import ResourceTable from '@shell/components/ResourceTable';
import { STATES_ENUM, colorForState, stateDisplay } from '@shell/plugins/dashboard-store/resource-class';
import { NAME, NAMESPACE, STATE, TYPE } from '@shell/config/table-headers';
import { sortableNumericSuffix } from '@shell/utils/sort';
import { NAME as EXPLORER } from '@shell/config/product/explorer';
import { BadgeState } from '@shell/rancher-components/BadgeState';

export default {
  components: { ResourceTable, BadgeState },

  props: {
    inventory: {
      type: Object,
      required: true,
    }
  },

  async fetch() {
    const inStore = this.$store.getters['currentStore']();

    const res = await Promise.allSettled(this.rows.map((row) => {
      return this.$store.dispatch(`${inStore}/find`, { type: row.type, id: row.id });
    }));

    let allfetched = true
    for (let i = 0; i < res.length; i++) {
      if (res[i].status !== 'fulfilled') {
        allfetched = false;
      }
    }
    if (allfetched) {
      this.loading = false;
    }
  },

  data() {
    return { loading: true };
  },

  computed: {
    rows() {
      const cluster = this.$store.getters['clusterId'];
      const inStore = this.$store.getters['currentStore']();
      const out = [];

      for (const entry of this.inventory.entries) {
        const [namespace, name, typeApiGroup, typeName] = entry.id.split('_');
        let id = null;
        if (namespace) {
          id = `${namespace}/${name}`;
        } else {
          id = `${name}`;
        }
        let type = null
        if (typeApiGroup) {
          type = `${typeApiGroup}.${typeName.toLowerCase()}`;
        } else {
          type = typeName.toLowerCase()
        }
        const state = this.$store.getters[`${inStore}/byId`](type, id)?.state || STATES_ENUM.MISSING;
        const stateColor = colorForState(state, entry.error, entry.transitioning);
        const schema = this.$store.getters[`${inStore}/schemaFor`](type);

        const key = `${type}/${namespace}/${name}`;

        const detailLocation = {
          name: `c-cluster-product-resource${namespace ? '-namespace' : ''}-id`,
          params: {
            product: EXPLORER,
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
      return [
        STATE,
        TYPE,
        NAME,
        NAMESPACE,
      ];
    },
  },
};
</script>

<template>
  <ResourceTable :schema="null" :rows="rows" :headers="headers" :search="true" :table-actions="false"
    :namespaced="true" :groupable="true" :loading="loading">
    <template #cell:state="{ row }">
      <BadgeState :value="row" />
    </template>
  </ResourceTable>
</template>
