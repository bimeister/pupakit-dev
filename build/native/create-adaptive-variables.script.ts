import { readFile, writeFile } from 'fs/promises';

const ADAPTIVE_CONFIG_PATH: string = './projects/kit/src/assets/configs/adaptive-config.json';
const ADAPTIVE_VARIABLES_PATH: string = './projects/kit/src/styles/variables/adaptive.variables.scss';

function getVariablesWithPostfix(data: Record<string, number>, postfix: string = ''): string {
  return Object.keys(data).reduce(
    (accumulator: string, dataKey: string) => `${accumulator}$${dataKey}${postfix}: ${data[dataKey]};\n`,
    ''
  );
}

async function writeAdaptiveVariablesToFile(fileData: string): Promise<void> {
  return await writeFile(ADAPTIVE_VARIABLES_PATH, fileData, null);
}

async function getAdaptiveVariablesData(): Promise<string> {
  return await readFile(ADAPTIVE_CONFIG_PATH, { encoding: 'utf8' })
    .then((content: string) => JSON.parse(content))
    .then((fileData: object) => {
      const emptyFileContent: string = '/** @file Automatically generated by createAdaptiveVariables gulp task. */\n';

      const breakpoints: string = getVariablesWithPostfix(fileData['breakpoints'], 'BreakPoint');
      const columns: string = getVariablesWithPostfix(fileData['columns'], 'ColumnsCount');
      const gutters: string = getVariablesWithPostfix(fileData['gutters'], 'Gutter');
      const offsets: string = getVariablesWithPostfix(fileData['offsets'], 'Offset');

      return `${emptyFileContent}\n${breakpoints}\n${columns}\n${gutters}\n${offsets}`;
    });
}

Promise.resolve()
  .then(() => getAdaptiveVariablesData())
  .then((targetFileData: string) => writeAdaptiveVariablesToFile(targetFileData));
