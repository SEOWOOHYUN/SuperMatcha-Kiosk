import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const files = ['menu-data', 'menu', 'cart', 'stamp', 'order', 'payment', 'view', 'app'];
// shortcut: handles this app's named imports/exports only; use a real bundler if module syntax grows.
const script = '(() => { const modules = {};\n' + files.map(name => {
  let code = readFileSync(`js/${name}.js`, 'utf8');
  const exports = [...code.matchAll(/^export (?:const|class|function) (\w+)/gm)].map(match => match[1]);
  code = code.replace(/^import \{([^}]+)\} from '\.\/(.+)\.js';$/gm, (_, names, module) => `const {${names}} = modules['${module}'];`)
    .replace(/^export /gm, '');
  return `modules['${name}'] = (() => {\n${code}\nreturn {${exports.join(',')}};\n})();`;
}).join('\n') + '\n})();';
new vm.Script(script);
const html = readFileSync('index.html', 'utf8')
  .replace('<link rel="stylesheet" href="style.css">', () => `<style>${readFileSync('style.css', 'utf8')}</style>`)
  .replace('<script type="module" src="js/app.js"></script>', () => `<script>${script.replace(/<\/script/gi, '<\\/script')}</script>`);
writeFileSync('kiosk.html', html);
console.log('Built kiosk.html — open it in a browser.');
