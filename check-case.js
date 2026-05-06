
import fs from 'fs';
import path from 'path';

const baseDir = 'src';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = getAllFiles(baseDir);
const filesLower = allFiles.map(f => f.toLowerCase().replace(/\\/g, '/'));
const filesExact = new Set(allFiles.map(f => f.replace(/\\/g, '/')));

let issues = [];

allFiles.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const absoluteImportPath = path.resolve(path.dirname(file), importPath);
        const relativeToProject = path.relative(process.cwd(), absoluteImportPath).replace(/\\/g, '/');
        
        let found = false;
        let potentialMatch = '';
        
        // Try exact match with common extensions
        const extensions = ['', '.tsx', '.ts', '.png', '.jpg', '.jpeg', '.svg', '.css'];
        for (const ext of extensions) {
          const testPath = relativeToProject + ext;
          if (filesExact.has(testPath)) {
            found = true;
            break;
          }
          // Check for case-insensitive match
          const testPathLower = testPath.toLowerCase();
          const matchIndex = filesLower.indexOf(testPathLower);
          if (matchIndex !== -1) {
            potentialMatch = allFiles[matchIndex];
          }
        }
        
        if (!found && potentialMatch) {
          issues.push({
            file,
            importPath,
            expected: potentialMatch
          });
        }
      }
    }
  }
});

if (issues.length > 0) {
  console.log('Case Sensitivity Issues Found:');
  issues.forEach(issue => {
    console.log(`File: ${issue.file}`);
    console.log(`  Import: ${issue.importPath}`);
    console.log(`  Real File: ${issue.expected}`);
  });
} else {
  console.log('No case sensitivity issues found.');
}
