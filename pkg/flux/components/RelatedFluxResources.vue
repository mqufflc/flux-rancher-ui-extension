<script>
import { SERVICE_ACCOUNT, SECRET, CONFIG_MAP } from '@shell/config/types';
import {
  SOURCE_KIND_TO_RESOURCE_TYPE,
  KUSTOMIZATION_RESOURCE_NAME,
  HELM_RELEASE_RESOURCE_NAME,
  HELM_CHART_RESOURCE_NAME,
  GIT_REPOSITORY_RESOURCE_NAME,
  OCI_REPOSITORY_RESOURCE_NAME,
  HELM_REPOSITORY_RESOURCE_NAME,
  BUCKET_RESOURCE_NAME,
} from '../shared-config';
import ResourceRefTable from './ResourceRefTable.vue';

// kind used on valuesFrom/postBuild.substituteFrom entries -> resource type
const VALUE_SOURCE_KIND_TO_RESOURCE_TYPE = {
  ConfigMap: CONFIG_MAP,
  Secret: SECRET,
};

const SOURCE_RESOURCE_NAMES = [
  GIT_REPOSITORY_RESOURCE_NAME,
  OCI_REPOSITORY_RESOURCE_NAME,
  HELM_REPOSITORY_RESOURCE_NAME,
  BUCKET_RESOURCE_NAME,
];

export default {
  components: { ResourceRefTable },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    refs() {
      const value = this.value;
      const namespace = value.metadata.namespace;
      const out = [];

      const pushKindRef = (kindRef, relationship) => {
        const type = SOURCE_KIND_TO_RESOURCE_TYPE[kindRef?.kind];

        if (!type || !kindRef.name) {
          return;
        }

        out.push({ type, id: `${ kindRef.namespace || namespace }/${ kindRef.name }`, relationship });
      };

      const pushDependsOn = (dependsOn, type, relationship) => {
        for (const dep of dependsOn || []) {
          out.push({ type, id: `${ dep.namespace || namespace }/${ dep.name }`, relationship });
        }
      };

      const pushServiceAccount = (name) => {
        if (!name) {
          return;
        }

        out.push({ type: SERVICE_ACCOUNT, id: `${ namespace }/${ name }`, relationship: 'Service Account' });
      };

      // secretRef/certSecretRef/kubeConfig.secretRef/decryption.secretRef never carry a
      // namespace of their own - Flux always requires the Secret to live alongside the resource.
      const pushSecretRef = (secretRef, relationship) => {
        if (!secretRef?.name) {
          return;
        }

        out.push({ type: SECRET, id: `${ namespace }/${ secretRef.name }`, relationship });
      };

      const pushValueSources = (entries, relationship) => {
        for (const entry of entries || []) {
          const type = VALUE_SOURCE_KIND_TO_RESOURCE_TYPE[entry?.kind];

          if (!type || !entry.name) {
            continue;
          }

          out.push({ type, id: `${ entry.namespace || namespace }/${ entry.name }`, relationship });
        }
      };

      if (value.type === KUSTOMIZATION_RESOURCE_NAME) {
        pushKindRef(value.spec?.sourceRef, 'Source');
        pushDependsOn(value.spec?.dependsOn, KUSTOMIZATION_RESOURCE_NAME, 'Depends On');
        pushServiceAccount(value.spec?.serviceAccountName);
        pushSecretRef(value.spec?.decryption?.secretRef, 'Decryption Key');
        pushSecretRef(value.spec?.kubeConfig?.secretRef, 'Kubeconfig');
        pushValueSources(value.spec?.postBuild?.substituteFrom, 'Variable Substitution');
      } else if (value.type === HELM_RELEASE_RESOURCE_NAME) {
        // Prefer an explicit chartRef; otherwise the helm-controller creates a HelmChart on
        // first reconcile (status.helmChart), tracking the sourceRef declared in spec.chart.
        if (value.spec?.chartRef) {
          pushKindRef(value.spec.chartRef, 'Chart');
        } else if (value.status?.helmChart) {
          out.push({ type: HELM_CHART_RESOURCE_NAME, id: value.status.helmChart, relationship: 'Chart' });
        } else {
          pushKindRef(value.spec?.chart?.spec?.sourceRef, 'Source');
        }
        pushDependsOn(value.spec?.dependsOn, HELM_RELEASE_RESOURCE_NAME, 'Depends On');
        pushServiceAccount(value.spec?.serviceAccountName);
        pushSecretRef(value.spec?.kubeConfig?.secretRef, 'Kubeconfig');
        pushValueSources(value.spec?.valuesFrom, 'Values From');
      } else if (value.type === HELM_CHART_RESOURCE_NAME) {
        pushKindRef(value.spec?.sourceRef, 'Source');
      } else if (SOURCE_RESOURCE_NAMES.includes(value.type)) {
        pushSecretRef(value.spec?.secretRef, 'Credentials');
        pushSecretRef(value.spec?.certSecretRef, 'TLS Certificate');
        pushSecretRef(value.spec?.proxySecretRef, 'Proxy Credentials');

        if (value.type === OCI_REPOSITORY_RESOURCE_NAME) {
          pushServiceAccount(value.spec?.serviceAccountName);
          pushSecretRef(value.spec?.verify?.secretRef, 'Verification Key');
        }
      }

      return out;
    },
  },
};
</script>

<template>
  <ResourceRefTable :refs="refs" show-relationship :search="false" :groupable="false" />
</template>
