import { configure } from '@storybook/react';

configure(require.context('../app/js', true, /\.stories\.jsx$/), module);
