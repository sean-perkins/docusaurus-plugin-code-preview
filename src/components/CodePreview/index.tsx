import React, { useEffect, useRef, useState } from 'react';

import './code-preview.css';

import 'tippy.js/dist/tippy.css';

import { ControlButton } from '../ControlButton';
import { OutputTargetButton } from '../OutputTargetButton';
import { ReportIssueButton } from '../ReportIssueButton';
import { ToggleSourceCodeButton } from '../ToggleSourceCodeButton';
import { StackblitzButton } from '../StackblitzButton';
import { CopyCodeButton } from '../CopyCodeButton';
import { PreviewFrame } from '../PreviewFrame';
import { FrameSize } from '../../utils/frame-sizes';

import { defineCustomElement } from '../DevicePreview';

interface CodePreviewProps {
  /**
   * The code snippets to be displayed in the code preview.
   */
  code: { [key: string]: () => {} };
  source?: string;
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
   * The size of the code preview frame. Default is `sm`.
   */
  size?: FrameSize | string;
  /**
   * `true` if the code preview should display in dark mode.
   */
  isDarkMode?: boolean;
  onOpenOutputTarget?: (outputTarget: string, codeBlock: string) => void;
}

export const CodePreview = ({
  code,
  source,
  viewport,
  size,
  output,
  controls,
  onOpenOutputTarget,
  isDarkMode,
  devicePreview,
  defaultExpanded,
}: CodePreviewProps) => {
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
    // codeSnippets are React components, so we need to get their rendered text
    // using outerText will preserve line breaks for formatting in Stackblitz editor
    const codeEl: any = codeRef.current?.querySelector('code');
    const codeBlock = codeEl!.outerText;

    if (onOpenOutputTarget !== undefined) {
      onOpenOutputTarget(outputTarget, codeBlock);
    }
  }

  useEffect(() => {
    const codeSnippets: any = {};
    Object.keys(code).forEach(key => {
      // Instantiates the React component from the MDX content.
      codeSnippets[key] = (code as any)[key]({});
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

  return (
    <div className="code-preview">
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
          {source &&
            viewport?.viewports.map(({ src, name }) => (
              <PreviewFrame
                key={`frame-${name}`}
                isVisible={selectedViewport === name}
                baseUrl={source!}
                src={src}
                size={size ?? 'sm'}
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
        {outputTarget && codeSnippets[outputTarget]}
      </div>
    </div>
  );
};
