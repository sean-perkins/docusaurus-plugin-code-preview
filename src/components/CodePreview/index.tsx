import React, { createRef, useEffect, useRef, useState } from 'react';

import './code-preview.css';

import 'tippy.js/dist/tippy.css';

import { ControlButton } from '../ControlButton';
import { OutputTargetButton } from '../OutputTargetButton';
import { ReportIssueButton } from '../ReportIssueButton';
import { ToggleSourceCodeButton } from '../ToggleSourceCodeButton';
import { StackblitzButton } from '../StackblitzButton';
import { CopyCodeButton } from '../CopyCodeButton';
import { PreviewFrame } from '../PreviewFrame';
import { ResetDemoButton } from '../ResetDemoButton';
import { FrameSize } from '../../utils/frame-sizes';

import { defineCustomElement } from '../DevicePreview';
import { getFileIcon } from '../../utils/get-file-icon';
import Tabs from '../Tabs';
import { getCodeSnippetId } from '../../utils/get-code-snippet-id';
import TabItem from '../TabItem';

interface OutputTargetOptions {
  /**
   * The collection of file paths and code contents for multi-file code previews.
   */
  files?: {
    [key: string]: () => {};
  };
  /**
   * The options to configure on the main AppModule for Angular Stackblitz examples.
   */
  angularModuleOptions?: {
    imports: string[];
    declarations?: string[];
  };
}

interface CodePreviewProps {
  /**
   * The code snippets to be displayed in the code preview.
   */
  code: { [key: string]: () => {} } | OutputTargetOptions;
  src?: string;
  output?: {
    outputs: {
      name: string;
      value?: string;
    }[];
    defaultOutput: string;
  };
  viewport?: {
    viewports: {
      name: string;
      src: (baseUrl: string) => string;
    }[];
    defaultViewport: string;
  };
  controls?: {
    reportIssue?: {
      url: string;
    };
    resetDemo?: {
      tooltip?: string;
    };
    stackblitz?:
      | {
          tooltip?: string;
        }
      | boolean;
  };
  /**
   * `true` if the iframe preview should be displayed in a device chrome.
   */
  devicePreview?: boolean;
  /**
   * `true` if the code snippet should be initially expanded.
   */
  defaultExpanded?: boolean;
  /**
   * The width of the code preview frame. Default is `100%`.
   */
  width?: string | number;
  /**
   * The size of the code preview frame. Default is `sm`.
   */
  height?: FrameSize | string;
  /**
   * `true` if the code preview should display in dark mode.
   */
  isDarkMode?: boolean;
  onOpenOutputTarget?: (
    outputTarget: string,
    codeBlock: string,
    options?: OutputTargetOptions
  ) => void;
}

export const CodePreview = ({
  code,
  src,
  viewport,
  height,
  width,
  output,
  controls,
  onOpenOutputTarget,
  isDarkMode,
  devicePreview,
  defaultExpanded,
}: CodePreviewProps) => {
  const hostRef = createRef<HTMLDivElement>();
  const codeRef = useRef<HTMLDivElement>(null);

  const [outputTarget, setOutputTarget] = useState(
    output?.defaultOutput ?? Object.keys(code)[0]
  );
  const [codeExpanded, setCodeExpanded] = useState(defaultExpanded ?? true);
  const [codeSnippets, setCodeSnippets] = useState({} as any);

  const [selectedViewport, setSelectedViewport] = useState<string | null>(
    viewport?.defaultViewport ?? null
  );

  function copySourceCode() {
    const copyButton = codeRef.current!.querySelector('button');
    copyButton?.click();
  }

  function openEditor() {
    let codeBlock: any;
    const options: OutputTargetOptions = {};

    if (hasOutputTargetOptions) {
      const codeUsageTarget = code[
        outputTarget as keyof OutputTargetOptions
      ] as OutputTargetOptions;
      options.angularModuleOptions = codeUsageTarget.angularModuleOptions;

      options.files = Object.keys(codeSnippets[outputTarget])
        .map(fileName => ({
          [fileName]: hostRef.current!.querySelector<any>(
            `#${getCodeSnippetId(outputTarget, fileName)} code`
          )!.outerText,
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    } else {
      // codeSnippets are React components, so we need to get their rendered text
      // using outerText will preserve line breaks for formatting in Stackblitz editor
      const codeEl: any = codeRef.current?.querySelector('code');
      codeBlock = codeEl!.outerText;
    }

    if (onOpenOutputTarget !== undefined) {
      onOpenOutputTarget(outputTarget, codeBlock, options);
    }
  }

  useEffect(() => {
    const codeSnippets: any = {};
    Object.keys(code).forEach(key => {
      if (
        (code[key as keyof OutputTargetOptions] as OutputTargetOptions)
          .files !== undefined
      ) {
        const fileSnippets: any = {};
        // @ts-ignore
        for (const fileName of Object.keys(code[key].files)) {
          // @ts-ignore
          fileSnippets[`${fileName}`] = code[key].files[fileName]({});
        }
        codeSnippets[key] = fileSnippets;
      } else {
        // Instantiates the React component from the MDX content.
        // @ts-ignore
        codeSnippets[key] = code[key]({});
      }
    });
    setCodeSnippets(codeSnippets);
  }, [code]);

  useEffect(() => {
    defineCustomElement();
  });

  let stackBlitzTooltip;
  if (controls?.stackblitz && typeof controls.stackblitz !== 'boolean') {
    stackBlitzTooltip = controls.stackblitz.tooltip;
  }

  /**
   * Reloads iframe sources back to their original state.
   */
  function resetDemo() {
    if (hostRef.current) {
      const frames = Array.from(
        hostRef.current.querySelectorAll<HTMLIFrameElement>('iframe')
      );
      for (const frame of frames) {
        frame.contentWindow?.location.reload();
      }
    }
  }

  const hasOutputTargetOptions =
    (code[outputTarget as keyof OutputTargetOptions] as OutputTargetOptions)
      ?.files !== undefined;

  function renderCodeSnippets() {
    if (outputTarget) {
      if (hasOutputTargetOptions) {
        if (!codeSnippets[outputTarget]) {
          return null;
        }
        return (
          <Tabs className="playground__tabs">
            {Object.keys(codeSnippets[outputTarget]).map(fileName => (
              <TabItem
                className="playground__tab-item"
                value={fileName}
                label={fileName}
                key={fileName}
                {...{
                  icon: getFileIcon(fileName),
                }}
              >
                <div id={getCodeSnippetId(outputTarget, fileName)}>
                  {codeSnippets[outputTarget][fileName]}
                </div>
              </TabItem>
            ))}
          </Tabs>
        );
      }
      return codeSnippets[outputTarget];
    }
  }

  return (
    <div className="code-preview" ref={hostRef}>
      <div className="code-preview__container">
        <div className="code-preview__control-toolbar">
          <div className="code-preview__control-group">
            {Object.keys(code).map(key => {
              const target = output?.outputs.find(
                o => o.value === key || o.name === key
              )!;
              const targetValue = target.value || target.name;
              return (
                <OutputTargetButton
                  key={`code-block-${key}`}
                  label={target.name}
                  isSelected={outputTarget === targetValue}
                  onClick={() => {
                    setCodeExpanded(true);
                    setOutputTarget(targetValue);
                  }}
                />
              );
            })}
          </div>
          <div className="code-preview__control-group">
            {viewport?.viewports.map(({ name }) => (
              <ControlButton
                key={`viewport-${name}`}
                isSelected={selectedViewport === name}
                onClick={() => setSelectedViewport(name)}
                label={name}
              />
            ))}
          </div>
          <div className="code-preview__control-group code-preview__control-group--end">
            <ToggleSourceCodeButton
              codeExpanded={codeExpanded}
              setCodeExpanded={setCodeExpanded}
            />
            {controls?.resetDemo && (
              <ResetDemoButton
                onClick={resetDemo}
                tooltip={controls.resetDemo.tooltip}
              />
            )}
            {controls?.reportIssue && (
              <ReportIssueButton url={controls.reportIssue.url} />
            )}
            <CopyCodeButton copySourceCode={copySourceCode} />
            {controls?.stackblitz && (
              <StackblitzButton
                tooltip={stackBlitzTooltip}
                onClick={openEditor}
              />
            )}
          </div>
        </div>
        <div className="code-preview__preview">
          {/*
           * We render an iframe for each viewport.
           * When the selected viewport changes, we hide one frame
           * and show the other. This is done to avoid flickering
           * and doing unnecessary reloads when switching viewports.
           */}
          {src &&
            viewport?.viewports.map(viewport => (
              <PreviewFrame
                key={`frame-${viewport.name}`}
                isVisible={selectedViewport === viewport.name}
                baseUrl={src!}
                src={viewport.src}
                width={width ?? '100%'}
                height={height ?? 'sm'}
                devicePreview={devicePreview}
                isDarkMode={isDarkMode === true}
              />
            ))}
        </div>
      </div>
      <div
        ref={codeRef}
        className={
          'code-preview__code-block ' +
          (codeExpanded ? 'code-preview__code-block--expanded' : '')
        }
        aria-expanded={codeExpanded ? 'true' : 'false'}
      >
        {renderCodeSnippets()}
      </div>
    </div>
  );
};
