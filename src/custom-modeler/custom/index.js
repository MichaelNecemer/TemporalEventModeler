import CustomRenderer from './CustomRenderer';
import CustomPalette from './CustomPalette';
import CustomPropertiesProvider from './CustomPropertiesProvider';
import CustomRules from './CustomRules';
import CustomContextPadProvider from './CustomContextPadProvider';
import CustomConnectModule from './CustomConnectModule';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
import CustomOrderingProvider from './CustomOrderingProvider';

export default {
  __init__: [ 'customContextPadProvider', 'customPaletteProvider', 'customRenderer', 'customPropertiesProvider', 'customOrderingProvider', 'customRules', 'connect'],
  customContextPadProvider: [ 'type', CustomContextPadProvider],
  customPaletteProvider: [ 'type', CustomPalette ],
  customRenderer: [ 'type', CustomRenderer ],
  customPropertiesProvider: ['type', CustomPropertiesProvider],
/*   customReplaceMenuProvider: ['type', CustomReplaceMenuProvider],
 */  
  customOrderingProvider: ['type', CustomOrderingProvider],
  customRules: ['type', CustomRules],
  connect: ['type', CustomConnectModule]
};

