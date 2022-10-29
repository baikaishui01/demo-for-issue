import { MESSAGE } from './../types';
import {  O2AnalyzerProps } from '../types';

export interface MessageInfoProps {
  type: MESSAGE,
  data: {
    reportData?: O2AnalyzerProps
  };
}
