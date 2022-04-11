import { LoadContext, Plugin, PluginOptions } from '@docusaurus/types';

export default function pluginCodePreview(
  _context: LoadContext,
  _options: PluginOptions
): Plugin<void> {
  return {
    name: 'docusaurus-plugin-code-preview',
  };
}

export * from './components/CodePreview';
export * from './utils/output-target.utils';
