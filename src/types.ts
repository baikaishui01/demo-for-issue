export interface O2AnalyzerProps {
  sonar?: Record<string, SonarProps>;
  jscpd?: JscpdProps;
}
export interface SonarProps {
  issues: IssueItemProps[];
  metrics: {
    ncloc: number[];
    commentLines: number[];
    nosonarLines: number[];
    executableLines: [];
    functions: number;
    statements: number;
    classes: number;
    complexity: number;
    cognitiveComplexity: number;
    code: number;
    blank: number;
    comment: number;
    language: string;
    duplication_lines: number;
    duplication_blocks: number;
  };
}

export interface IssueItemProps {
  column: number;
  line: number;
  endColumn: number;
  endLine: number;
  ruleId: string;
  message: string;
  severity: number;
  quickFixes: any[];
  secondaryLocations: any[];
  source: string;
  type: string;
  scope: string;
  defaultSeverity: SEVERITY_ENUMS;
  remediation: {
    func: string;
    constantCost: string;
  };
  effort: number;
  tags: string;
}
export enum SEVERITY_ENUMS {
  MINOR = 'Minor',
  INFO = 'Info',
  MAJOR = 'Major',
  BLOCKER = 'Blocker',
  CRITICAL = 'Critical'
}

export interface JscpdProps {
  statistics?: {
    detectionDate?: string;
    formats?: Record<string, FormatItemProps>;
    total: TotalProps;
  }
}
export interface FormatItemProps {
  sources: Record<string, SourceItemProps>;
  total: TotalProps;
}

export interface SourceItemProps {
  lines: number;
  tokens: number;
  sources:number;
  clones: number;
  duplicatedLines: number;
  duplicatedTokens: number;
  percentage: number;
  percentageTokens: number;
  newDuplicatedLines: number;
  newClones: number;
}
export interface TotalProps {
  lines: number;
  tokens: number;
  sources: number;
  clones: number;
  duplicatedLines: number;
  duplicatedTokens: number;
  percentage: number;
  percentageTokens: number;
  newDuplicatedLines: number;
  newClones: number;
}

// 消息类型
export enum MESSAGE {
  INIT = 'init'
}