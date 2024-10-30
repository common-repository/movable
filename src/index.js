/**
 * External Dependencies
 */
import { hotPluginLoader, registerPlugins } from '@blockhandbook/block-hot-loader';

/** Import the blocks **/
if ( module.hot ) {
	hotPluginLoader( {
		getContext: () => require.context( './plugins', true, /index\.js$/ ),
		module,
	} );
} else {
	registerPlugins( {
		getContext: () => require.context( './plugins', true, /index\.js$/ ),
		module,
	} );
}