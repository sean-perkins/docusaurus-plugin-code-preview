
export const loadSourceFiles = async (files: string[]) => {
  const sourceFiles = await Promise.all(files.map(f => fetch(f)));
  return (await Promise.all(sourceFiles.map(res => res.text())));
}