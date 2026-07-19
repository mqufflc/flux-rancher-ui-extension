<script>
import ResourceRefTable from './ResourceRefTable.vue';

export default {
  components: { ResourceRefTable },

  props: {
    inventory: {
      type: Object,
      required: true,
    }
  },

  computed: {
    refs() {
      return this.inventory.entries.map((entry) => {
        const [namespace, name, typeApiGroup, typeName] = entry.id.split('_');
        const id = namespace ? `${namespace}/${name}` : name;
        const type = typeApiGroup ? `${typeApiGroup}.${typeName.toLowerCase()}` : typeName.toLowerCase();

        return { type, id };
      });
    },
  },
};
</script>

<template>
  <ResourceRefTable :refs="refs" />
</template>
