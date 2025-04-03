import { IPlugin } from '@shell/core/types';
import { BUCKET_RESOURCE_NAME, FLUX_DASHBOARD_PAGE_NAME, FLUX_PRODUCT_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME } from './shared-config';

export function init($plugin: IPlugin, store: any) {

  const {
    product,
    configureType,
    virtualType,
    basicType,
    weightType,
  } = $plugin.DSL(store, FLUX_PRODUCT_NAME);

  product({
    icon:    'gear',
    inStore: 'cluster',
    weight:  50,
    showNamespaceFilter: true,
    to:      {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-${ FLUX_DASHBOARD_PAGE_NAME }`,
      params: { product: FLUX_PRODUCT_NAME },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(KUSTOMIZATION_RESOURCE_NAME, {
    displayName: 'Kustomization',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced:  true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: KUSTOMIZATION_RESOURCE_NAME,
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(HELM_RELEASE_RESOURCE_NAME, {
    displayName: 'Helm Release',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: HELM_RELEASE_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(HELM_REPOSITORY_RESOURCE_NAME, {
    displayName: 'Helm Repository',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: HELM_REPOSITORY_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(GIT_REPOSITORY_RESOURCE_NAME, {
    displayName: 'Helm Release',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: GIT_REPOSITORY_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(OCI_REPOSITORY_RESOURCE_NAME, {
    displayName: 'Helm Release',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: OCI_REPOSITORY_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(BUCKET_RESOURCE_NAME, {
    displayName: 'Helm Release',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: BUCKET_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(HELM_CHART_RESOURCE_NAME, {
    displayName: 'Helm Release',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    namespaced: true,
    customRoute: {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
      params: {
        product:  FLUX_PRODUCT_NAME,
        resource: HELM_CHART_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  virtualType({
    labelKey: 'flux.dashboard-menu-label',
    name:     FLUX_DASHBOARD_PAGE_NAME,
    route:    {
      name:   `c-cluster-${ FLUX_PRODUCT_NAME }-${ FLUX_DASHBOARD_PAGE_NAME }`,
      params: { product: FLUX_PRODUCT_NAME },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });
  
  // basicType([FLUX_DASHBOARD_PAGE_NAME]);
  basicType([HELM_RELEASE_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME], 'Applications');
  basicType([BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME], 'Sources');
  
  weightType(KUSTOMIZATION_RESOURCE_NAME,30,true)
  weightType(HELM_RELEASE_RESOURCE_NAME,20,true)

  weightType(BUCKET_RESOURCE_NAME,50,true)
  weightType(GIT_REPOSITORY_RESOURCE_NAME,40,true)
  weightType(HELM_CHART_RESOURCE_NAME,30,true)
  weightType(HELM_REPOSITORY_RESOURCE_NAME,20,true)
  weightType(OCI_REPOSITORY_RESOURCE_NAME,10,true)
  
}
