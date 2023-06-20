import type { Metrics } from './datadog-client';
import type { Result } from '../lighthouse/types/lighthouse';

export const aggregateLightHouseScore = (data: Result) => {
  const metrics = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'speed-index',
    'interactive',
    'total-blocking-time',
    'cumulative-layout-shift',
    'max-potential-fid',
    'server-response-time',
  ];

  return metrics.reduce((acc, key) => {
    const metricValue = data.audits[key]?.numericValue || 0;
    acc[`lighthouse.${key}`] = parseFloat((metricValue / 1000).toFixed(1));
    return acc;
  }, {} as Record<string, number>);
}

export const aggregateMetrics = (data: Record<string, number>, metricsKey: string = 'retail.frontend.dashboard') => {
  const metrics: Metrics = Object.entries(data).reduce((acc: Metrics, [key, value]) => {
    acc[`${metricsKey}.${key}`] = value;
    return acc;
  }, {});

  return metrics;
}
