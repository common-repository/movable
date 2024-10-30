<?php
/**
 * Plugin Name: Movable
 * Plugin URI: https://blockhandbook.com/plugins/movable
 * Description: Drag, Drop, Duplicate, Delete, Select & Insert blocks from the block editor sidebar.
 * Author: BlockHandbook
 * Author URI: https://blockhandbook.com
 * Text Domain: movable
 * Domain Path: /languages
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Tested up to: 5.5
 * Version: 1.0.1
 * Requires at least: 5.0
 * Requires PHP: 5.6
 *
 * @package Movable
 */

namespace Movable;

use \Movable\Load_Translations as Load_Translations;
use \Movable\Plugin as Plugin;
use \Movable\Register_Blocks as Register_Blocks;

// Stop the hackers if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('Plugin')):
    /**
     * Plugin Class.
     *
     * @since 1.0.0
     */
    class Plugin
{

        /**
         * Class instance.
         *
         * @var Plugin
         */
        private static $instance = null;

        /**
         * Plugin Path.
         *
         * @var string
         */
        public $plugin_dir_path;

        /**
         * Plugin URL.
         *
         * @var string
         */
        public $plugin_dir_url;

        /**
         * Plugin Slug.
         *
         * @var string
         */
        public $slug;

        /**
         * Plugin text-domain.
         *
         * @var string
         */
        public $text_domain;

        /**
         * Plugin version.
         *
         * @var string
         */
        public $version;

        /**
         * Plugin constructor.
         * Called immediately when you instantiate a class.
         * Really good article on setting up constructors for WP classes.
         * https://carlalexander.ca/designing-class-wordpress-hooks/
         */
        private function __construct()
    {
            // filesystem directory i.e. /var/home/www/blockhandbook/wp-content/plugins/.
            $this->plugin_dir_path = plugin_dir_path(__FILE__);
            // web address w/ trailing slash.
            // i.e. - http://blockhandbook.com/wp-content/plugins/.
            $this->plugin_dir_url = plugin_dir_url(__FILE__);
            $this->slug = 'movable';
            $this->text_domain = 'movable';
            $this->version = '1.0.1';
        }

        /**
         * Return Plugin Instance.
         *
         * @return object\Plugin
         */
        public static function get_instance()
    {
            if (null === self::$instance) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        /**
         * Load the plugin.
         *
         * @return void
         */
        public static function load()
    {
            require __DIR__ . '/vendor/autoload.php';

            Load_Translations::register();
            Register_Blocks::register();
        }
    }
endif;

Plugin::load();