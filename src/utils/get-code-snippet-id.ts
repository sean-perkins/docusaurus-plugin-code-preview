export function getCodeSnippetId(outputTarget: string, fileName: string) {
  let fileNameId = fileName;
  // replace all non-alphanumeric characters with underscores
  fileNameId = fileNameId.replace(/[^a-zA-Z0-9]/g, '_');
  return `playground_${outputTarget.toLowerCase()}_${fileNameId}`;
}
