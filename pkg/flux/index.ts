import { importTypes } from '@rancher/auto-import';
import { ActionLocation, ActionOpts, IPlugin } from '@shell/core/types';
import extensionRouting from './routing/extension-routing';
import { BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME } from './shared-config';
import Resource from '@shell/plugins/dashboard-store/resource-class';
import { exceptionToErrorsArray } from '@shell/utils/error';

// Init the package
export default function (plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addProduct(require('./flux'));

  plugin.addAction(
    ActionLocation.TABLE,
    { resource: [BUCKET_RESOURCE_NAME, GIT_REPOSITORY_RESOURCE_NAME, HELM_CHART_RESOURCE_NAME, HELM_REPOSITORY_RESOURCE_NAME, OCI_REPOSITORY_RESOURCE_NAME, KUSTOMIZATION_RESOURCE_NAME, HELM_RELEASE_RESOURCE_NAME] },
    {
      label: 'reconcile',
      labelKey: 'flux.reconcile-action-label',
      multiple: true,
      enabled(ctx: Resource) {
        return ctx.canUpdate
      },
      invoke(opts: ActionOpts, values: Resource[]) {
        values.forEach(value => {
          value.setAnnotation("reconcile.fluxcd.io/requestedAt", Date.now().toString())
          try { value.save() }
          catch (error) {
            console.log(exceptionToErrorsArray(error))
          }
        })
      }
    }
  )

  // Add Vue Routes
  plugin.addRoutes(extensionRouting);
}
