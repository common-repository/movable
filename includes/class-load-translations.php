<?php
/**
 * Load translated strings for our plugin.
 *
 * @package Movable
 */

namespace Movable;

use \Movable\Plugin as Plugin;

// Stop the hackers if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load .
 *
 * @since 1.0.0
 */
class Load_Translations {

	/**
	 * Register class with appropriate WordPress hooks
	 */
	public static function register() {
		$instance = new self();
		add_action( 'init', array( $instance, 'load_script_translations' ), 99 );
		add_action( 'plugins_loaded', array( $instance, 'load_textdomain_translations' ) );
	}

	/**
	 * Load all translations for our plugin from the MO file.
	 *
	 * @return void
	 */
	public function load_script_translations() {

		// Shortcuts for variables.
		// We could store these variables in the constructor as they are shared
		// between methods, but I don't think they fit the context of the class.
		$instance        = Plugin::get_instance();
		$plugin_dir_path = $instance->plugin_dir_path;
		$slug            = $instance->slug;

		/**
		 * Loads translated strings written in JavaScript.
		 *
		 * @since 1.0.0
		 */
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				$slug . '-editor-script',
				$slug,
				$plugin_dir_path . 'languages'
			);
		}
	}

	/**
	 * Load all translations for our plugin from the MO file.
	 *
	 * @return void
	 */
	public function load_textdomain_translations() {

		// Shortcuts for variables.
		$instance    = Plugin::get_instance();
		$text_domain = $instance->text_domain;
		$slug        = $instance->slug;

		// Load translated strings written in PHP.
		// The last argument is the plugin relative path so we can just use,
		// the slug.
		// Reference: http://clivern.com/how-to-internationalize-your-wordpress-plugin/.
		// Could also use basename( $plugin_dir_path ) . '/languages'.
		load_plugin_textdomain(
			$slug,
			false,
			$slug . '/languages'
		);
	}
}
