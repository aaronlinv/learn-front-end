const common = require('./common');
const utils = require('./utils');

// 引入css
// .css 不可省略
require('./style.css')

common.info('Hello world!' + utils.add(100, 200));