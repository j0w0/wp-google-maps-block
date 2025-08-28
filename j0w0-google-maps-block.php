<?php

/**
 * Plugin Name:       j0w0 Google Maps Block
 * Description:       Custom Google Maps block for Wordpress full site editing.
 * Author:            j0w0
 * Author URI:        https://www.j0w0.com
 */
if (!defined('ABSPATH')) {
    exit;
}

function j0w0_custom_blocks_init() {
    if (function_exists('wp_register_block_types_from_metadata_collection')) {
        wp_register_block_types_from_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');

        return;
    }

    if (function_exists('wp_register_block_metadata_collection')) {
        wp_register_block_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
    }

    $manifest_data = require __DIR__ . '/build/blocks-manifest.php';
    foreach (array_keys($manifest_data) as $block_type) {
        register_block_type(__DIR__ . "/build/{$block_type}");
    }
}
add_action('init', 'j0w0_custom_blocks_init');

function j0w0_new_block_category($cats) {
    $new = [
        'j0w0' => [
            'slug'  => 'j0w0',
            'title' => 'j0w0 bl0cks',
        ],
    ];

    $position = 2;
    $cats     = array_slice($cats, 0, $position, true) + $new + array_slice($cats, $position, null, true);

    return array_values($cats);
}
add_filter('block_categories_all', 'j0w0_new_block_category');

function j0w0_enqueue_scripts() {
    $api_key = defined('GOOGLE_MAPS_API_KEY') ? GOOGLE_MAPS_API_KEY : '';

    if (has_block('j0w0/google-map')) {
        add_filter('script_loader_tag', function ($tag, $handle) {
            if ('google-maps' !== $handle) {
                return $tag;
            }

            return str_replace(' src', ' async defer src', $tag);
        }, 10, 2);

        wp_enqueue_script(
            'google-maps',
            'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($api_key) . '&callback=initMap&loading=async',
            [],
            null,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'j0w0_enqueue_scripts');

function j0w0_enqueue_block_editor_assets() {
    if (has_block('j0w0/google-map')) {
        $api_key = defined('GOOGLE_MAPS_API_KEY') ? GOOGLE_MAPS_API_KEY : '';

        wp_localize_script(
            'j0w0-map-inner-editor-script',
            'googleMap',
            [
                'apiKey' => $api_key,
            ]
        );
    }
}
add_action('enqueue_block_editor_assets', 'j0w0_enqueue_block_editor_assets');
