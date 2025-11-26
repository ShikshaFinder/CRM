'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface PackagingAlert {
  id: string;
  alertType: string;
  severity: string;
  message: string;
  createdAt: number;
  packagingRunId?: string | null;
}

interface PackagingRun {
  id: string;
  status: string;
  plannedOutput?: number | null;
  actualOutput?: number | null;
  rejectsCount?: number | null;
  startedAt?: number | null;
  completedAt?: number | null;
  batch: {
    id: string;
    batchNumber: string;
    product?: {
      name: string;
    } | null;
  };
  packagingLine: {
    id: string;
    name: string;
    lineType: string;
  };
}

interface PackagingLine {
  id: string;
  name: string;
  lineType: string;
  speedUnitsPerHour?: number | null;
  isActive: number;
  isUnderMaintenance: number;
  maintenanceNotes?: string | null;
  packagingRuns: PackagingRun[];
  telemetry: {
    id: string;
    parameter: string;
    value?: number | null;
    unit?: string | null;
    recordedAt: number;
  }[];
}

interface BatchOption {
  id: string;
  batchNumber: string;
  status: string;
  product?: {
    name: string;
  };
}

interface PackagingResponse {
  lines: PackagingLine[];
  alerts: PackagingAlert[];
  openBatches: BatchOption[];
}

const formatDateTime = (value?: number | null) => {
  if (!value) return '—';
  const ms = value < 10_000_000_000 ? value * 1000 : value;
  return new Date(ms).toLocaleString();
};

export default function PackagingPage() {
  const [data, setData] = useState<PackagingResponse>({
    lines: [],
    alerts: [],
    openBatches: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runForm, setRunForm] = useState({
    packagingLineId: '',
    batchId: '',
    plannedOutput: '',
  });
  const [runUpdates, setRunUpdates] = useState<Record<string, { actualOutput?: string; rejectsCount?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPackaging = useCallback(() => {
    setLoading(true);
    fetch('/api/packaging', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load packaging data');
        }
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load packaging data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadPackaging();
  }, [loadPackaging]);

  const metrics = useMemo(() => {
    const totalLines = data.lines.length;
    const runningRuns = data.lines.reduce(
      (acc, line) =>
        acc +
        line.packagingRuns.filter((run) => run.status === 'RUNNING' || run.status === 'PLANNED').length,
      0
    );
    const alerts = data.alerts.length;
    return { totalLines, runningRuns, alerts };
  }, [data]);

  const handleStartRun = async () => {
    if (!runForm.batchId || !runForm.packagingLineId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'run',
          batchId: runForm.batchId,
          packagingLineId: runForm.packagingLineId,
          plannedOutput: runForm.plannedOutput ? Number(runForm.plannedOutput) : undefined,
          status: 'RUNNING',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to start packaging run');
      }
      setRunForm({ packagingLineId: '', batchId: '', plannedOutput: '' });
      loadPackaging();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunUpdateChange = (runId: string, field: 'actualOutput' | 'rejectsCount', value: string) => {
    setRunUpdates((prev) => ({
      ...prev,
      [runId]: {
        ...prev[runId],
        [field]: value,
      },
    }));
  };

  const submitRunUpdate = async (run: PackagingRun, status: string) => {
    setIsSubmitting(true);
    try {
      const payload = runUpdates[run.id] ?? {};
      const res = await fetch('/api/packaging', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runId: run.id,
          status,
          actualOutput: payload.actualOutput ? Number(payload.actualOutput) : undefined,
          rejectsCount: payload.rejectsCount ? Number(payload.rejectsCount) : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update packaging run');
      }
      loadPackaging();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading packaging telemetry...</div>
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
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h1 className="text-4xl font-semibold text-black mb-2">Packaging</h1>
            <p className="text-lg text-zinc-600">
              Monitor line utilization, capture rejects, and keep dispatch prep in sync with production.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-zinc-600">
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Lines</p>
              <p className="text-2xl font-semibold text-black">{metrics.totalLines}</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Active runs</p>
              <p className="text-2xl font-semibold text-black">{metrics.runningRuns}</p>
            </div>
            <div className="rounded-xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-widest">Alerts</p>
              <p className="text-2xl font-semibold text-black">{metrics.alerts}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {data.lines.map((line, idx) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-black/10 shadow-sm p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase text-zinc-500 tracking-widest">Line</p>
                    <h3 className="text-2xl font-semibold text-black">{line.name}</h3>
                    <p className="text-sm text-zinc-600">{line.lineType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-zinc-500 tracking-widest">Status</p>
                    <p className="text-sm font-semibold text-black">
                      {line.isUnderMaintenance ? 'Maintenance' : line.isActive ? 'Running' : 'Offline'}
                    </p>
                    {line.maintenanceNotes && (
                      <p className="text-xs text-zinc-500 mt-1">{line.maintenanceNotes}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {line.packagingRuns.length === 0 && (
                    <p className="text-sm text-zinc-500">No runs attached. Start a run from the form.</p>
                  )}

                  {line.packagingRuns.map((run) => (
                    <div key={run.id} className="rounded-xl border border-zinc-200 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase text-zinc-500 tracking-widest">Batch</p>
                          <p className="font-semibold text-black">
                            {run.batch.batchNumber} · {run.batch.product?.name || 'Unknown product'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${
                            run.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : run.status === 'RUNNING'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {run.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs uppercase text-zinc-500 tracking-widest">Planned</p>
                          <p className="font-semibold text-black">{run.plannedOutput ?? '—'} units</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-zinc-500 tracking-widest">Produced</p>
                          <p className="font-semibold text-black">{run.actualOutput ?? '—'} units</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-zinc-500 tracking-widest">Rejects</p>
                          <p className="font-semibold text-black">{run.rejectsCount ?? 0} units</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-zinc-500 tracking-widest">Started</p>
                          <p className="font-semibold text-black">{formatDateTime(run.startedAt)}</p>
                        </div>
                      </div>

                      {run.status !== 'COMPLETED' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <input
                            className="rounded-xl border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                            placeholder="Actual output"
                            value={runUpdates[run.id]?.actualOutput ?? ''}
                            onChange={(e) => handleRunUpdateChange(run.id, 'actualOutput', e.target.value)}
                          />
                          <input
                            className="rounded-xl border border-zinc-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                            placeholder="Rejects"
                            value={runUpdates[run.id]?.rejectsCount ?? ''}
                            onChange={(e) => handleRunUpdateChange(run.id, 'rejectsCount', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                              disabled={isSubmitting}
                              onClick={() => submitRunUpdate(run, 'RUNNING')}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-xl bg-black text-white px-3 py-2 text-xs font-semibold hover:bg-black/90 disabled:bg-zinc-400"
                              disabled={isSubmitting}
                              onClick={() => submitRunUpdate(run, 'COMPLETED')}
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {line.telemetry.length ? (
                  <div className="mt-4 pt-4 border-t border-dashed border-zinc-200">
                    <p className="text-xs uppercase text-zinc-500 tracking-widest mb-2">Latest telemetry</p>
                    <div className="grid gap-3 text-sm">
                      {line.telemetry.slice(0, 3).map((sample) => (
                        <div key={sample.id} className="flex items-center justify-between text-zinc-600">
                          <span>
                            {sample.parameter} · {sample.value ?? '—'} {sample.unit || ''}
                          </span>
                          <span className="text-xs">{formatDateTime(sample.recordedAt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black mb-1">Start packaging run</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Link batches to lines and track output vs rejects for finance and inventory sync.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase text-zinc-500 tracking-widest">Packaging line</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    value={runForm.packagingLineId}
                    onChange={(e) => setRunForm((prev) => ({ ...prev, packagingLineId: e.target.value }))}
                  >
                    <option value="">Select line</option>
                    {data.lines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name} · {line.lineType}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-zinc-500 tracking-widest">Batch</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    value={runForm.batchId}
                    onChange={(e) => setRunForm((prev) => ({ ...prev, batchId: e.target.value }))}
                  >
                    <option value="">Select batch</option>
                    {data.openBatches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batchNumber} · {batch.product?.name} ({batch.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-zinc-500 tracking-widest">Planned output</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Units"
                    value={runForm.plannedOutput}
                    onChange={(e) => setRunForm((prev) => ({ ...prev, plannedOutput: e.target.value }))}
                  />
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/90 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                  onClick={handleStartRun}
                  disabled={isSubmitting || !runForm.batchId || !runForm.packagingLineId}
                >
                  {isSubmitting ? 'Starting...' : 'Start run'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-black mb-2">Alerts</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Reject spikes, downtime, or process deviations raised by production & packaging flows.
              </p>
              <div className="space-y-3">
                {data.alerts.length === 0 && (
                  <p className="text-sm text-zinc-500">No active alerts.</p>
                )}
                {data.alerts.slice(0, 6).map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <p className="font-semibold">{alert.alertType.replace('_', ' ')}</p>
                    <p>{alert.message}</p>
                    <p className="text-xs text-red-500">{new Date(alert.createdAt * 1000).toLocaleString()}</p>
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



