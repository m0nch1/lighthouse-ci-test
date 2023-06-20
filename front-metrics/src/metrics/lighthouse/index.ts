import { promises as fs } from 'fs';
import { fileURLToPath } from 'url'
import path from 'path'
import { createClient, IDatadogClient } from '../lib/datadog-client';
import { aggregateLightHouseScore, aggregateMetrics } from '../lib/aggregate'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Output directory of lighthouse ci result
const directoryPath = path.join(__dirname, '.lighthouseci')
const jsonFileRegExp = /lhr.*\.json/

const getLightHouseScoreByJson = async () => {
  try {
    const files = await fs.readdir(directoryPath);

    const scoreJsonFile = files.find((file) => jsonFileRegExp.test(file));
    if (!scoreJsonFile) {
      console.error('No JSON file found');
      process.exitCode = 1;
      return;
    }

    const dataStr = await fs.readFile(path.join(directoryPath, scoreJsonFile), 'utf-8');
    const data = JSON.parse(dataStr);
    const lighthouseScore = aggregateLightHouseScore(data);

    return lighthouseScore;
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

const aggregateMetricsAndSendDataDog = async (
  client: IDatadogClient,
) => {
  try {
    const lighthouseScore = await getLightHouseScoreByJson()

    if (!lighthouseScore) {
      throw new Error('No lighthouse score found');
    }

    const metrics = aggregateMetrics(lighthouseScore);
    console.log(metrics)
    // await client.sendMetrics(metrics);
  } catch (err) {
    console.error(err);
  }
}

const main = async () => {
  const ddClient = createClient();
  await aggregateMetricsAndSendDataDog(ddClient);
};

main();
