import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { MessageInfoProps } from './types';
import { O2AnalyzerProps, MESSAGE } from '../types';

export default class ViewLoader {
  public static currentPanel?: vscode.WebviewPanel;
  public static readonly viewType = 'o2-report-webview';

  private panel: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposables = [];

    this.panel = vscode.window.createWebviewPanel(ViewLoader.viewType, "lint detail", vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: false,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app')),
        vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
      ],
    });

    // render webview
    this.renderWebview();

    // listen messages from webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        console.log('msg', message);
      },
      null,
      this.disposables
    );
    
    // 关闭webView
    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );
  }

  // 渲染webView
  private renderWebview() {
    const html = this.render();
    this.panel.webview.html = html;
  }

  // 在vscode中打开webView
  static showWebview(context: vscode.ExtensionContext) {
    const cls = this;
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (cls.currentPanel) {
      // 单例，只允许存在一个webView
      cls.currentPanel.reveal(column);
    } else {
      // 获取工程根路径
      const rootPath = vscode?.workspace?.workspaceFolders?.[0]?.uri?.fsPath || '';
      // 获取o2-analyzer-report.json文件路径
      const reportPath = `${rootPath}/o2-analyzer-report.json`;
      
      // o2-analyzer-report.json文件不存在，禁止打开webView
      if(!reportPath || !fs.existsSync(reportPath)) {
        vscode.window.showErrorMessage(`path '${reportPath}' not exit!`);
        return
      }


      cls.currentPanel = new cls(context).panel;

      // 获取规约报告并发送给webView
      const reportData: O2AnalyzerProps = fse.readJsonSync(reportPath);
      this.postMessageToWebview({
        type: MESSAGE.INIT,
        data: {
          reportData
        }
      })
    }
  }

  // 向webView页面发送消息
  static postMessageToWebview(message: MessageInfoProps) {
    const cls = this;
    cls.currentPanel?.webview.postMessage(message);
  }

  public dispose() {
    ViewLoader.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  render() {
    const bundleScriptPath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app', 'bundle.js'))
    );

    const nextCssUrl = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'next.css'))
    );
    

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>代码质量分析</title>
        <link href="${nextCssUrl}" rel="stylesheet" />
      </head>

      <body>
        <div id="root"></div>
        <script>
          const vscode = acquireVsCodeApi();
        </script>
        <script src="${bundleScriptPath}"></script>
      </body>
    </html>
    `;
  }
}
