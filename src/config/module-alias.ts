import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@controllers': path.join(files, 'src', 'controllers'),
  '@services': path.join(files, 'src', 'services'),
  '@tests': path.join(files, 'tests'),
});
