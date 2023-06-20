import * as dotenv from 'dotenv';
import fetch, { Response } from 'node-fetch';
import { v1 } from '@datadog/datadog-api-client';

dotenv.config();
const DD_API_KEY = process.env.DD_API_KEY as string;

export type Metrics = {
  [metricName: string]: number | string;
}

export type IDatadogClient = {
  sendMetrics: (
    data: Metrics
  ) => Promise<Response>;
};

export const createClient = (): IDatadogClient => {
  const apiUrl = `https://api.datadoghq.com/api/v1/series?api_key=${DD_API_KEY}`;

  const post = async (requestBody: string) => {
    return await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
  };

  const sendMetrics = async (metrics: Metrics) => {
    const requestBody = JSON.stringify({
      series: Object.entries(metrics).map(([metricName, value]): v1.Series => ({
        metric: metricName,
        points: [[Math.floor(Date.now() / 1000), Number(value)]],
        type: 'gauge',
      })),
    })

    return await post(requestBody);
  };

  return {
    sendMetrics,
  };
};
