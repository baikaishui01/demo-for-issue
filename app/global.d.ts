import { MESSAGE } from '../src/types';

type VSCode = {
  postMessage<T extends MESSAGE = MESSAGE>(message: T): void;
  getState(): any;
  setState(state: any): void;
};

declare const vscode: VSCode;