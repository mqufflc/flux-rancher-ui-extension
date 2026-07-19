import { ActionOpts } from '@shell/core/types';
import Resource from '@shell/plugins/dashboard-store/resource-class';
import {
  HELM_CHART_RESOURCE_NAME,
  KUSTOMIZATION_RESOURCE_NAME,
  HELM_RELEASE_RESOURCE_NAME,
  SOURCE_KIND_TO_RESOURCE_TYPE,
} from '../shared-config';

// dashboard-store injects `type`/`metadata`/`spec`/`status` onto Resource instances at
// runtime; they aren't declared on the class itself, so allowJs can't infer them.
interface FluxResource extends Resource {
  type: string;
  metadata: { namespace: string, annotations?: Record<string, string> };
  spec?: any;
  status?: any;
}

const RECONCILE_ANNOTATION = 'reconcile.fluxcd.io/requestedAt';

export function canReconcile(ctx: any) {
  if (ctx.type === 'event') {
    return false;
  }

  return ctx.canUpdate;
}

export function reconcile(value: FluxResource) {
  return value.patch(
    { metadata: { annotations: { [RECONCILE_ANNOTATION]: Date.now().toString() } } },
    { headers: { 'content-type': 'application/merge-patch+json' } },
    false,
    true
  );
}

async function findRef(store: any, ref: { kind: string, name: string, namespace?: string }, defaultNamespace: string): Promise<FluxResource | undefined> {
  const type = SOURCE_KIND_TO_RESOURCE_TYPE[ref.kind];

  if (!type) {
    return undefined;
  }

  const inStore = store.getters['currentStore']();

  return store.dispatch(`${ inStore }/find`, { type, id: `${ ref.namespace || defaultNamespace }/${ ref.name }` });
}

// Kustomizations reference their source directly via spec.sourceRef
async function reconcileKustomizationSource(store: any, value: FluxResource) {
  const sourceRef = value.spec?.sourceRef;

  if (!sourceRef) {
    return;
  }

  const source = await findRef(store, sourceRef, value.metadata.namespace);

  if (source) {
    await reconcile(source);
  }
}

// HelmReleases either reference a HelmChart/OCIRepository directly via spec.chartRef,
// or have helm-controller manage a HelmChart for them, tracked in status.helmChart.
// In both cases the HelmChart (if any) has its own spec.sourceRef pointing at the real
// upstream HelmRepository/GitRepository/Bucket.
async function reconcileHelmReleaseSource(store: any, value: FluxResource) {
  const chartRef = value.spec?.chartRef;
  const helmChartId = value.status?.helmChart;

  let chart: FluxResource | undefined;

  if (chartRef) {
    chart = await findRef(store, chartRef, value.metadata.namespace);
  } else if (helmChartId) {
    const [namespace, name] = helmChartId.split('/');
    const inStore = store.getters['currentStore']();

    chart = await store.dispatch(`${ inStore }/find`, { type: HELM_CHART_RESOURCE_NAME, id: `${ namespace }/${ name }` });
  }

  if (!chart) {
    return;
  }

  if (chart.type === HELM_CHART_RESOURCE_NAME && chart.spec?.sourceRef) {
    const source = await findRef(store, chart.spec.sourceRef, chart.metadata.namespace);

    if (source) {
      await reconcile(source);
    }
  }

  await reconcile(chart);
}

async function reconcileSourceOne(store: any, value: FluxResource) {
  try {
    if (value.type === KUSTOMIZATION_RESOURCE_NAME) {
      await reconcileKustomizationSource(store, value);
    } else if (value.type === HELM_RELEASE_RESOURCE_NAME) {
      await reconcileHelmReleaseSource(store, value);
    }
  } catch (error: any) {
    store.dispatch('growl/error', {
      title:   'Error reconciling source',
      message: error?.message || `${ error }`,
      timeout: 5000
    }, { root: true });
  }
}

export function reconcileInvoke(_opts: ActionOpts, values: FluxResource[]) {
  return Promise.all(values.map((value) => reconcile(value))).then(() => true);
}

export function reconcileSourceInvoke(this: any, _opts: ActionOpts, values: FluxResource[]) {
  const store = this.$store;

  return Promise.all(values.map((value) => reconcileSourceOne(store, value))).then(() => true);
}
