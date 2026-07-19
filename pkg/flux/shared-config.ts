export const FLUX_PRODUCT_NAME = 'flux';
export const FLUX_DASHBOARD_PAGE_NAME = 'fluxDashboard'

export const KUSTOMIZATION_RESOURCE_NAME = "kustomize.toolkit.fluxcd.io.kustomization"

export const HELM_RELEASE_RESOURCE_NAME = "helm.toolkit.fluxcd.io.helmrelease"

export const GIT_REPOSITORY_RESOURCE_NAME = "source.toolkit.fluxcd.io.gitrepository"
export const HELM_REPOSITORY_RESOURCE_NAME = "source.toolkit.fluxcd.io.helmrepository"
export const BUCKET_RESOURCE_NAME = "source.toolkit.fluxcd.io.bucket"
export const HELM_CHART_RESOURCE_NAME = "source.toolkit.fluxcd.io.helmchart"
export const OCI_REPOSITORY_RESOURCE_NAME = "source.toolkit.fluxcd.io.ocirepository"

export const ALERT_RESOURCE_NAME = "notification.toolkit.fluxcd.io.alert"
export const RECEIVER_RESOURCE_NAME = "notification.toolkit.fluxcd.io.receiver"
export const PROVIDER_RESOURCE_NAME = "notification.toolkit.fluxcd.io.provider"

export const IMAGE_POLICY_RESOURCE_NAME = "image.toolkit.fluxcd.io.imagepolicy"
export const IMAGE_REPOSITORY_RESOURCE_NAME = "image.toolkit.fluxcd.io.imagerepository"
export const IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME = "image.toolkit.fluxcd.io.imageupdateautomation"

// Maps the `kind` used in a Flux sourceRef/chartRef/dependsOn entry to the resource type this extension registers
export const SOURCE_KIND_TO_RESOURCE_TYPE: Record<string, string> = {
  GitRepository:  GIT_REPOSITORY_RESOURCE_NAME,
  OCIRepository:  OCI_REPOSITORY_RESOURCE_NAME,
  Bucket:         BUCKET_RESOURCE_NAME,
  HelmRepository: HELM_REPOSITORY_RESOURCE_NAME,
  HelmChart:      HELM_CHART_RESOURCE_NAME,
  Kustomization:  KUSTOMIZATION_RESOURCE_NAME,
  HelmRelease:    HELM_RELEASE_RESOURCE_NAME,
}

// Every resource type this extension registers under the `flux` product, so links to them
// can be routed via the extension's own product routes instead of the generic explorer ones.
export const FLUX_RESOURCE_TYPES = [
  KUSTOMIZATION_RESOURCE_NAME,
  HELM_RELEASE_RESOURCE_NAME,
  GIT_REPOSITORY_RESOURCE_NAME,
  HELM_REPOSITORY_RESOURCE_NAME,
  BUCKET_RESOURCE_NAME,
  HELM_CHART_RESOURCE_NAME,
  OCI_REPOSITORY_RESOURCE_NAME,
  ALERT_RESOURCE_NAME,
  RECEIVER_RESOURCE_NAME,
  PROVIDER_RESOURCE_NAME,
  IMAGE_POLICY_RESOURCE_NAME,
  IMAGE_REPOSITORY_RESOURCE_NAME,
  IMAGE_UPDATE_AUTOMATION_RESOURCE_NAME,
]
