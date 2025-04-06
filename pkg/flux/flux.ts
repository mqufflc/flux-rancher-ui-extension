import { IPlugin } from '@shell/core/types';
import { BUCKET_RESOURCE_NAME, FLUX_DASHBOARD_PAGE_NAME, FLUX_PRODUCT_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, RECEIVER_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, ALERT_RESOURCE_NAME, PROVIDER_RESOURCE_NAME, IMAGE_POLICY_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME } from './shared-config';

export function init($plugin: IPlugin, store: any) {

  const {
    product,
    configureType,
    virtualType,
    basicType,
    weightType,
    weightGroup,
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
    displayName: 'Git Repository',
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
    displayName: 'OCI Repository',
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
    displayName: 'Bucket',
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
    displayName: 'Helm Chart',
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

  configureType(ALERT_RESOURCE_NAME, {
    displayName: 'Alert',
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
        resource: ALERT_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(RECEIVER_RESOURCE_NAME, {
    displayName: 'Notification',
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
        resource: RECEIVER_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(PROVIDER_RESOURCE_NAME, {
    displayName: 'Provider',
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
        resource: PROVIDER_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(IMAGE_POLICY_RESOURCE_NAME, {
    displayName: 'Image Policy',
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
        resource: IMAGE_POLICY_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(IMAGE_REPOSITORY_RESOURCE_NAME, {
    displayName: 'Image Repository',
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
        resource: IMAGE_REPOSITORY_RESOURCE_NAME
      },
      meta: {
        product: FLUX_PRODUCT_NAME
      }
    }
  });

  configureType(IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME, {
    displayName: 'Image Update Automation',
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
        resource: IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME
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
  basicType([IMAGE_POLICY_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME], 'Image Automation');
  basicType([ALERT_RESOURCE_NAME,RECEIVER_RESOURCE_NAME, PROVIDER_RESOURCE_NAME], 'Notifications');

  weightGroup('Applications', 99, true);
  weightGroup('Sources', 98, true);
  weightGroup('Image Automation', 97, true);
  weightGroup('Notifications', 96, true);
  
  weightType(KUSTOMIZATION_RESOURCE_NAME,99,true)
  weightType(HELM_RELEASE_RESOURCE_NAME,98,true)

  weightType(GIT_REPOSITORY_RESOURCE_NAME,99,true)
  weightType(OCI_REPOSITORY_RESOURCE_NAME,98,true)
  weightType(BUCKET_RESOURCE_NAME,97,true)
  weightType(HELM_REPOSITORY_RESOURCE_NAME,96,true)
  weightType(HELM_CHART_RESOURCE_NAME,95,true)

  weightType(IMAGE_POLICY_RESOURCE_NAME, 99, true)
  weightType(IMAGE_REPOSITORY_RESOURCE_NAME, 98, true)
  weightType(IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME, 97, true)

  weightType(ALERT_RESOURCE_NAME, 99, true)
  weightType(RECEIVER_RESOURCE_NAME, 98, true)
  weightType(PROVIDER_RESOURCE_NAME, 97, true)
  
}
