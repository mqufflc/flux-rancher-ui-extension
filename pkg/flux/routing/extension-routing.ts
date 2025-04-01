// ./routing/extension-routing.ts
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';
import { FLUX_DASHBOARD_PAGE_NAME, FLUX_PRODUCT_NAME } from '../shared-config';
import FluxDashboard from '../pages/fluxDashboard.vue';


const routes = [
  // {
  //   name:      `c-cluster-${ FLUX_PRODUCT_NAME }-${ FLUX_DASHBOARD_PAGE_NAME }`,
  //   path:      `/c/:cluster/${ FLUX_PRODUCT_NAME }/${ FLUX_DASHBOARD_PAGE_NAME }`,
  //   component: FluxDashboard,
  //   meta:      { product: FLUX_PRODUCT_NAME },
  // },
  {
    name:      `c-cluster-${ FLUX_PRODUCT_NAME }-resource`,
    path:      `/c/:cluster/${ FLUX_PRODUCT_NAME }/:resource`,
    component: ListResource,
    meta:      { product: FLUX_PRODUCT_NAME },
  },
  {
    name:      `c-cluster-${ FLUX_PRODUCT_NAME }-resource-create`,
    path:      `/c/:cluster/${ FLUX_PRODUCT_NAME }/:resource/create`,
    component: CreateResource,
    meta:      { product: FLUX_PRODUCT_NAME },
  },
  {
    name:      `c-cluster-${ FLUX_PRODUCT_NAME }-resource-id`,
    path:      `/c/:cluster/${ FLUX_PRODUCT_NAME }/:resource/:id`,
    component: ViewResource,
    meta:      { product: FLUX_PRODUCT_NAME },
  },
  {
    name:      `c-cluster-${ FLUX_PRODUCT_NAME }-resource-namespace-id`,
    path:      `/:cluster/${ FLUX_PRODUCT_NAME }/:resource/:namespace/:id`,
    component: ViewNamespacedResource,
    meta:      { product: FLUX_PRODUCT_NAME },
  }
];

export default routes;