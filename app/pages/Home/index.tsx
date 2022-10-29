import React, { useEffect, useState } from 'react';
import { Collapse, Table, Button, Tag, Icon } from '@alifd/next';
import { O2AnalyzerProps, SEVERITY_ENUMS, IssueItemProps, MessageInfoProps, MESSAGE, FormatDataSourceItem } from './types';
import { SEVERITY_DATA_SOURCE } from '../..//constant';
import { getBySeverity,  getJscpdFilePaths, getRuleUrl } from '../..//utils';
import  './index.css';

const { Panel } = Collapse;

const App = () => {
  const [dataSource, setDataSource] = useState<O2AnalyzerProps>({});
  const [severity, setSeverity] = useState<SEVERITY_ENUMS[]>([SEVERITY_ENUMS.BLOCKER]);
  const [jscpdFilePaths, setJscpdFilePaths] = useState<string[]>([]);
  const { sonar = {}, jscpd={} } = dataSource || {};
  const filePaths = Object.keys(sonar);
  const messageListener = (event: MessageEvent<MessageInfoProps>) => {
    const message = event.data;
    if(message.type === MESSAGE.INIT) {
      const data = getJscpdFilePaths(message?.data?.reportData?.jscpd || {});
      setJscpdFilePaths(data);
      setDataSource(message?.data?.reportData || {});
    }
  }
  useEffect(() => {
    window.addEventListener('message', messageListener);
    return () => {
      window.removeEventListener('message', messageListener);
    }
  }, [])

  const getPositionUrl = (record: IssueItemProps, filePath: string) => {
    const targetPath = jscpdFilePaths?.find(path => path?.includes(filePath));
    return targetPath || filePath
  }
  const renderPosition = (val: number, index: string, record: IssueItemProps, filePath: string) => {
    const { line, column, endLine, endColumn } = record;
    return (
      <Button
        text
        component="a"
        type="primary"
        href={`vscode://file/${getPositionUrl(record, filePath)}:${line}:${column}`}
      >
        {`${line}：${column} ---> ${endLine}：${endColumn}`}
      </Button>
    )
  };

  const renderRule = (val: string) => {
    return (
      <Button
        text
        type="primary"
        component="a"
        href={getRuleUrl(val)}
      >
        {val}
      </Button>
    );
  };
  const handleSeverityChange = (checked: boolean, tagInfo: FormatDataSourceItem) => {
    let newSeverity = [];
    if(checked) {
      newSeverity.push(...severity, tagInfo.value);
    } else {
      newSeverity = severity?.filter(item => item !== tagInfo.value);
    }
    setSeverity(newSeverity);
  }
  return (
    <div className="o2-analyzer-content">
      <div className='o2-analyzer-severity'>
        {
          SEVERITY_DATA_SOURCE?.map((item) => {
            return (
              <Tag.Selectable
                onChange={(val) => handleSeverityChange(val, item)}
                checked={severity?.includes(item?.value)}
                className='severity-tag'
                size="medium"
                key={item?.value}
              >
                {item?.label}
              </Tag.Selectable>
            )
          })
        }
      </div>
      <Collapse accordion>
        {filePaths?.map((filePath) => {
          const issues = getBySeverity(sonar[filePath]?.issues, severity);
          if (!issues?.length) {
            return null;
          }
          return (
            <Panel key={filePath} title={filePath}>
              <Table dataSource={issues}>
                <Table.Column dataIndex="defaultSeverity" title="类型" />
                <Table.Column
                  dataIndex="line"
                  title="起始行：起始列 ---> 终止行：终止列"
                  cell={(val, index, record) => renderPosition(val, index, record, filePath)}
                />
                <Table.Column dataIndex="message" title="错误消息" />
                <Table.Column dataIndex="ruleId" title="规则" cell={renderRule} />
              </Table>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  )
}

export default App;