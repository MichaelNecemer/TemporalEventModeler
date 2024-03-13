import CustomRenderer from './CustomRenderer';
import CustomPalette from './CustomPalette';
import CustomPropertiesProvider from './CustomPropertiesProvider';
import CustomRules from './CustomRules';
import CustomContextPadProvider from './CustomContextPadProvider';
import CustomConnectModule from './CustomConnectModule';

export default {
  __init__: [ 'customContextPadProvider', 'customPaletteProvider', 'customRenderer', 'customPropertiesProvider',  'customRules', 'connect'],
  customContextPadProvider: [ 'type', CustomContextPadProvider],
  customPaletteProvider: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPropertiesProvider: ['type', CustomPropertiesProvider],
  customRules: ['type', CustomRules],
  connect: ['type', CustomConnectModule]
};

