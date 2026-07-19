import { importTypes } from '@rancher/auto-import';
import { ActionLocation, PanelLocation, IPlugin } from '@shell/core/types';
import extensionRouting from './routing/extension-routing';
import { BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, RECEIVER_RESOURCE_NAME } from './shared-config';
import { reconcileInvoke, reconcileSourceInvoke, canReconcile } from './actions/reconcile';

// Init the package
export default function (plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load flux product
  plugin.addProduct(require('./flux'));

  const RECONCILABLE_RESOURCE_NAMES = [BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, RECEIVER_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME];

  plugin.addAction(
    ActionLocation.TABLE,
    {
      resource: RECONCILABLE_RESOURCE_NAMES
    },
    {
      label: 'reconcile',
      labelKey: 'flux.reconcile-action-label',
      icon: 'icon icon-refresh',
      multiple: true,
      enabled: canReconcile,
      invoke: reconcileInvoke
    }
  )

  plugin.addAction(
    ActionLocation.TABLE,
    {
      resource: [KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME]
    },
    {
      label: 'reconcile source',
      labelKey: 'flux.reconcile-source-action-label',
      icon: 'icon icon-refresh',
      multiple: true,
      enabled: canReconcile,
      invoke: reconcileSourceInvoke
    }
  )

  // Buttons on the resource detail page masthead, mirroring the table actions above
  plugin.addPanel(
    PanelLocation.DETAILS_MASTHEAD,
    {
      resource: RECONCILABLE_RESOURCE_NAMES
    },
    {
      component: () => import('./components/ReconcileActionsPanel.vue')
    }
  )

  // Add Vue Routes
  plugin.addRoutes(extensionRouting);
}
