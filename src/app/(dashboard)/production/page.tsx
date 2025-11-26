'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface StageLog {
  id: string;
  stageName: string;
  status: string;
  startedAt: number | null;
  completedAt: number | null;
  remarks?: string | null;
}

interface ProductionAlert {
  id: string;
  alertType: string;
  severity: string;
  message: string;
  createdAt: number;
}

interface PackagingRunSummary {
  id: string;
  status: string;
  plannedOutput?: number;
  actualOutput?: number;
  rejectsCount?: number;
  packagingLine?: {
    name: string;
    lineType: string;
  };
}

interface ProductionBatch {
  id: string;
  batchNumber: string;
  producedQty: number;
  productionDate: number | null;
  manufacturingDate: number | null;
  expiryDate: number | null;
  status: string;
  fatBefore?: number | null;
  fatAfter?: number | null;
  snfBefore?: number | null;
  snfAfter?: number | null;
  lossPercent?: number | null;
  agitationRunning?: number | null;
  holdingTimeSec?: number | null;
  homogenizationPressure?: number | null;
  qualityStatus?: string | null;
  stageLogs?: StageLog[];
  packagingRuns?: PackagingRunSummary[];
  alerts?: ProductionAlert[];
  product: {
    id: string;
    name: string;
    unit: string;
  };
  items: any[];
  inventoryStocks: any[];
}

const stageOptions = [
  'MILK_ARRIVAL',
  'PLATFORM_TEST',
  'CREAM_SEPARATION',
  'STANDARDIZATION',
  'PASTEURIZATION',
  'HOMOGENIZATION',
  'PRODUCT_MANUFACTURING',
  'PACKAGING_HANDOFF',
];

const formatDate = (value?: number | string | null) => {
  if (!value) return '—';
  const ms = typeof value === 'number' && value < 10_000_000_000 ? value * 1000 : Number(value);
  return new Date(ms).toLocaleDateString();
};

export default function ProductionPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [stageForm, setStageForm] = useState({
    stageName: stageOptions[0],
    status: 'IN_PROGRESS',
    remarks: '',
  });
  const [stageSubmitting, setStageSubmitting] = useState(false);

  const loadBatches = useCallback(() => {
    setLoading(true);
    fetch('/api/production', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Request failed: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setBatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load production batches');
        setBatches([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const selectedBatch = useMemo(
    () => batches.find((batch) => batch.id === selectedBatchId) ?? null,
    [batches, selectedBatchId]
  );

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'IN_PRODUCTION':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStageSubmit = async () => {
    if (!selectedBatch || !stageForm.stageName) {
      return;
    }
    setStageSubmitting(true);
    try {
      const res = await fetch('/api/production/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: selectedBatch.id,
          stageName: stageForm.stageName,
          status: stageForm.status,
          remarks: stageForm.remarks || undefined,
          startedAt: Date.now(),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to log stage activity');
      }
      setStageForm((prev) => ({ ...prev, remarks: '' }));
      loadBatches();
    } catch (err) {
      console.error(err);
    } finally {
      setStageSubmitting(false);
    }
  };

  const productionSummary = useMemo(() => {
    if (!batches.length) return { active: 0, completed: 0, avgLoss: 0, alerts: 0 };
    const active = batches.filter((batch) => batch.status === 'IN_PRODUCTION').length;
    const completed = batches.filter((batch) => batch.status === 'COMPLETED').length;
    const lossValues = batches.map((batch) => batch.lossPercent ?? 0).filter((v) => v > 0);
    const avgLoss = lossValues.length
      ? lossValues.reduce((acc, curr) => acc + curr, 0) / lossValues.length
      : 0;
    const alerts = batches.reduce((acc, batch) => acc + (batch.alerts?.length ?? 0), 0);
    return { active, completed, avgLoss, alerts };
  }, [batches]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading production batches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h1 className="text-4xl font-semibold text-black mb-2">Production</h1>
            <p className="text-lg text-zinc-600">
              Real-time visibility into cream separation, standardization, pasteurization, and packaging readiness.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600">
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Active Batches</p>
              <p className="text-2xl font-semibold text-black">{productionSummary.active}</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Average Loss %</p>
              <p className="text-2xl font-semibold text-black">
                {productionSummary.avgLoss.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-semibold text-black">{productionSummary.completed}</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Open Alerts</p>
              <p className="text-2xl font-semibold text-black">{productionSummary.alerts}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {batches.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white border border-dashed border-black/10 rounded-xl"
              >
                <p className="text-zinc-600">No production batches found</p>
              </motion.div>
            )}

            {batches.map((batch, index) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setSelectedBatchId(batch.id)}
                  className="w-full text-left p-6 flex flex-col gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500">Batch</p>
                      <h3 className="text-2xl font-semibold text-black">{batch.batchNumber}</h3>
                      <p className="text-sm text-zinc-600">{batch.product?.name || 'Unknown product'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                        {batch.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-zinc-500">
                        Production: {formatDate(batch.productionDate)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs uppercase text-zinc-500">Qty</p>
                      <p className="font-semibold text-black">
                        {batch.producedQty || 0} {batch.product?.unit || ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-zinc-500">FAT %</p>
                      <p className="font-semibold text-black">
                        {(batch.fatAfter ?? batch.fatBefore ?? '—') as number | string}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-zinc-500">SNF %</p>
                      <p className="font-semibold text-black">
                        {(batch.snfAfter ?? batch.snfBefore ?? '—') as number | string}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-zinc-500">Loss %</p>
                      <p className="font-semibold text-black">
                        {batch.lossPercent ? `${batch.lossPercent.toFixed(2)}%` : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed border-zinc-200">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Stage timeline</p>
                    <div className="flex flex-wrap gap-3">
                      {stageOptions.map((stage) => {
                        const log = batch.stageLogs?.find((item) => item.stageName === stage);
                        const state = log?.status ?? 'PENDING';
                        const color =
                          state === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : state === 'FAIL'
                            ? 'bg-red-100 text-red-700'
                            : state === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-zinc-100 text-zinc-600';
                        return (
                          <span key={`${batch.id}-${stage}`} className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                            {stage.replace('_', ' ')}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {batch.packagingRuns?.length ? (
                    <div className="pt-4 border-t border-dashed border-zinc-200 text-sm text-zinc-600">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Packaging handoff</p>
                      {batch.packagingRuns.slice(0, 2).map((run) => (
                        <div key={run.id} className="flex flex-wrap items-center justify-between gap-2">
                          <span>
                            {run.packagingLine?.name || 'Line'} · {run.status.replace('_', ' ')}
                          </span>
                          <span className="font-medium text-black">
                            {run.actualOutput ?? run.plannedOutput ?? 0} units
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {batch.alerts?.length ? (
                    <div className="pt-4 border-t border-dashed border-zinc-200">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Open alerts</p>
                      <ul className="space-y-1 text-sm">
                        {batch.alerts.slice(0, 2).map((alert) => (
                          <li key={alert.id} className="flex items-center gap-2 text-red-600">
                            <span className="text-xs font-semibold">{alert.severity}</span>
                            <span>{alert.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black mb-1">Stage logging</h2>
              <p className="text-sm text-zinc-600 mb-6">
                Capture FAT/SNF approvals, pasteurization exceptions, and packaging readiness per batch.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase text-zinc-500 tracking-widest">Batch</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    value={selectedBatchId ?? ''}
                    onChange={(e) => setSelectedBatchId(e.target.value || null)}
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batchNumber} · {batch.product?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-zinc-500 tracking-widest">Stage</label>
                    <select
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      value={stageForm.stageName}
                      onChange={(e) => setStageForm((prev) => ({ ...prev, stageName: e.target.value }))}
                    >
                      {stageOptions.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-zinc-500 tracking-widest">Status</label>
                    <select
                      className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      value={stageForm.status}
                      onChange={(e) => setStageForm((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="FAIL">Fail</option>
                      <option value="ON_HOLD">On hold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase text-zinc-500 tracking-widest">Remarks</label>
                  <textarea
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    rows={3}
                    placeholder="Temperature deviation, FAT/SNF reading, operator note..."
                    value={stageForm.remarks}
                    onChange={(e) => setStageForm((prev) => ({ ...prev, remarks: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  disabled={stageSubmitting || !selectedBatchId}
                  onClick={handleStageSubmit}
                  className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/90 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                >
                  {stageSubmitting ? 'Logging...' : 'Log stage update'}
                </button>
              </div>
              {selectedBatch && (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-600 space-y-2">
                  <p className="font-semibold text-black">{selectedBatch.batchNumber}</p>
                  <p>Quality status: {selectedBatch.qualityStatus || 'Pending'}</p>
                  <p>
                    Agitation: {selectedBatch.agitationRunning ? 'Running' : 'Idle'} · Holding time:{' '}
                    {selectedBatch.holdingTimeSec ? `${selectedBatch.holdingTimeSec}s` : '—'}
                  </p>
                  <p>
                    Homogenization pressure:{' '}
                    {selectedBatch.homogenizationPressure ? `${selectedBatch.homogenizationPressure} psi` : '—'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black mb-1">Active alerts</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Threshold breaches from platform tests, pasteurization, or packaging rejects.
              </p>
              <div className="space-y-3">
                {productionSummary.alerts === 0 && (
                  <p className="text-sm text-zinc-500">No process alerts. All KPIs within tolerance.</p>
                )}
                {batches
                  .flatMap((batch) => batch.alerts?.map((alert) => ({ alert, batch })) ?? [])
                  .slice(0, 5)
                  .map(({ alert, batch }) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                      <p className="font-semibold text-red-800">{alert.alertType.replace('_', ' ')}</p>
                      <p>{alert.message}</p>
                      <p className="text-xs text-red-500">
                        Batch {batch.batchNumber} · {new Date(alert.createdAt * 1000).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

