/* test/index_test.js */
import './enzyme_setup';

const testsContext = require.context('../app/js', true, /\.test\.(jsx|js)$/);

testsContext.keys().forEach(testsContext);
