<?php
/**
 * Register block scripts and styles.
 *
 * @package Movable
 */

namespace Movable;

use \Movable\Plugin as Plugin;

// Stop the hackers if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register blocks.
 *
 * @since 1.0.0
 */
class Register_Blocks
{

    /**
     * Register class with appropriate WordPress hooks
     */
    public static function register()
    {
        $instance = new self();
        add_action('init', array($instance, 'register_blocks'));
    }

    /**
     * Registers all block assets so they can be enqueued through Gutenberg.
     *
     * @return void
     */
    public function register_blocks()
    {

        if (!function_exists('register_block_type')) {
            // Gutenberg is not active.
            return;
        }

        // Shortcuts for variables.
        $instance = Plugin::get_instance();
        $slug = $instance->slug;
        $text_domain = $instance->text_domain;
        $plugin_dir_path = $instance->plugin_dir_path;
        $plugin_dir_url = $instance->plugin_dir_url;
        $version = $instance->version;

        // Register editor-only block styles.
        wp_enqueue_style(
            $slug . '-editor-style',
            $plugin_dir_url . 'build/index.css',
            array('wp-edit-blocks'),
            $version
        );

        // Enqueue tailwind styles.
        wp_enqueue_style(
            $slug . '-tailwind-style',
            $plugin_dir_url . 'build/tailwind.css',
            array(),
            $version
        );

        $script_asset_path = "$plugin_dir_path/build/index.asset.php";
        if (!file_exists($script_asset_path)) {
            throw new Error(
                'You need to run `npm start` or `npm run build` for the "movable/testimonial" block first.'
            );
        }

        // Register editor-only block scripts.
        // Dynamically load dependencies using index.build.asset.php generated by
        // @wordpress/dependency-extraction-webpack-plugin.
        $script_asset = require "$plugin_dir_path/build/index.asset.php";

        wp_enqueue_script(
            $slug . '-editor-script',
            $plugin_dir_url . 'build/index.js',
            $script_asset['dependencies'],
            $script_asset['version'],
            true
        );
    }
}