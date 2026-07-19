import { importTypes } from '@rancher/auto-import';
import { ActionLocation, IPlugin } from '@shell/core/types';
import extensionRouting from './routing/extension-routing';
import { BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, RECEIVER_RESOURCE_NAME } from './shared-config';
import { reconcileInvoke, reconcileSourceInvoke } from './actions/reconcile';

// Init the package
export default function (plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load flux product
  plugin.addProduct(require('./flux'));

  function canReconcile(ctx: any) {
    if (ctx.type === "event") {
      return false
    }
    return ctx.canUpdate
  }

  plugin.addAction(
    ActionLocation.TABLE,
    {
      resource: [BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, RECEIVER_RESOURCE_NAME, IMAGE_REPOSITORY_RESOURCE_NAME, IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME]
    },
    {
      label: 'reconcile',
      labelKey: 'flux.reconcile-action-label',
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
      multiple: true,
      enabled: canReconcile,
      invoke: reconcileSourceInvoke
    }
  )

  // Add Vue Routes
  plugin.addRoutes(extensionRouting);
}
