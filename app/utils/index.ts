import {IssueItemProps, SEVERITY_ENUMS, JscpdProps} from '../types';

// 通过severity值过滤issues
export function getBySeverity(
  srcData: IssueItemProps[],
  severity: SEVERITY_ENUMS[]
) {
  const result = srcData?.filter((issue) => {
    return severity?.includes(issue.defaultSeverity);
  });
  return result;
}

const extendsFromEslint = [
  'brace-style',
  'comma-dangle',
  'comma-spacing',
  'func-call-spacing',
  'indent',
  'init-declarations',
  'keyword-spacing',
  'no-dupe-class-members',
  'no-duplicate-imports',
  'no-extra-parens',
  'no-extra-semi',
  'no-invalid-this',
  'no-loop-func',
  'no-loss-of-precision',
  'no-unused-expressions',
  'no-unused-vars',
  'no-useless-constructor',
  'object-curly-spacing',
  'quotes',
  'semi',
  'space-before-function-paren',
  'space-infix-ops',
];

// 获取规则链接
export const getRuleUrl = (rule: string) => {
  const isTsEslintRuleDetail = rule?.startsWith('@typescript-eslint');
  const ruleId = isTsEslintRuleDetail ? rule?.replace('@typescript-eslint/', '') : rule;
  if (isTsEslintRuleDetail && !extendsFromEslint.includes(ruleId)) {
    return `https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/${ruleId}.md`
  } else {
    return `https://eslint.org/docs/latest/rules/${ruleId}`
  }
};

// 获取jscpb中所有的文件路径
export const getJscpdFilePaths = (jscpd: JscpdProps) => {
		const formats = jscpd?.statistics?.formats || {}
	
		const fileFormats = Object.keys(formats);
		const fileFormatsPaths = [];
		for(let i = 0; i < fileFormats?.length; i++) {
			const format = fileFormats[i];
			const formatPaths = Object.keys(formats?.[format]?.sources || {});
			fileFormatsPaths.push(...formatPaths)
		}
    return fileFormatsPaths
}