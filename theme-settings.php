<?php

/**
 * @file
 * This is the heart of creating custom theme settings. You set all of your form options within
 * the form_system_theme_settings_alter hook. From the Drupal API:
 * "With this hook, themes can alter the theme-specific settings form in any way allowable by
 * Drupal's Form API, such as adding form elements, changing default values and removing form
 * elements. See the Form API documentation on api.drupal.org for detailed information."
 * (https://api.drupal.org/api/drupal/core!lib!Drupal!Core!Render!theme.api.php/function/
 * hook_form_system_theme_settings_alter/8)
 *
 */

/**
 * Implementation of hook_form_system_theme_settings_alter()
 *
 * @param $form
 *   Nested array of form elements that comprise the form.
 *
 * @param $form_state
 *   A keyed array containing the current state of the form.
 */
function iastate_theme_form_system_theme_settings_alter(&$form, &$form_state) {

  // Create a section for ISU theme settings
  $form['iastate_theme_settings'] = array(
    '#type'         => 'details',
    '#title'        => t('IASTATE Theme Settings'),
    '#description'  => t('Configure IASTATE Theme options'),
    '#weight' => -1000,
    '#open' => TRUE,
  );

  // Set up the checkbox to include/not include the ISU navbar
  $form['iastate_theme_settings']['isu_navbar'] = array(
    '#type'         => 'checkbox',
    '#title'        => t('Show ISU navbar'),
    '#default_value' => theme_get_setting('isu_navbar'),
    '#description'  => t('Check this option if you\'d like to show the ISU navbar.'),
  );

  // Set up the checkbox to show/hide the gold border on the Site Header
  $form['iastate_theme_settings']['gold_border_hidden'] = array(
    '#type'         => 'checkbox',
    '#title'        => t('Hide gold border'),
    '#default_value' => theme_get_setting('gold_border_hidden'),
    '#description'  => t('Check this option to hide the gold border on the red header.'),
  );

  // Set up the checkbox to show/hide the social icons under the footer logo
  $form['iastate_theme_settings']['default_social_footer'] = array(
    '#type'		=> 'checkbox',
    '#title'	=> t('Show social footer icons'),
    '#default_value'	=> theme_get_setting('default_social_footer'),
    '#tree'		=> '',
  );

  // Create a section for color settings
  $form['iastate_color_settings'] = [
    '#type' => 'details',
    '#title' => t('Theme Color Settings'),
    '#description' => t('Color selection for custom colors'),
    '#weight' => -980,
    '#open' => TRUE,
  ];
  
  // Set up the checkbox for the default colors
  $form['iastate_color_settings']['default_color_settings'] = [
    '#type' => 'checkbox',
    '#title' => t('Use the colors supplied by the theme'),
    '#default_value' => isset($stored_value) ? $stored_value : 1,
  ];
  
  // This container will be hidden when the checkbox is checked.
  $form['iastate_color_settings']['settings'] = [
    '#type' => 'container',
    '#states' => [
      'visible' => [
        ':input[name="default_color_settings"]' => ['checked' => FALSE],
      ],
    ],
  ];
  
  // Create color selector for primary color, cardinal is the default
  $form['iastate_color_settings']['settings']['primary_color'] = [
    '#type' => 'color',
    '#title' => t('Primary Color'),
    '#description' => t('Controls things like footer background color and heading colors'),
    '#default_value' => theme_get_setting('primary_color') ?? '#c8102e',
  ];
  
  // Create color selector for secondary color, burgundy is the default
  $form['iastate_color_settings']['settings']['secondary_color'] = [
    '#type' => 'color',
    '#title' => t('Secondary Color'),
    '#description' => t('Controls things like link color and smaller heading colors'),
    '#default_value' => theme_get_setting('secondary_color') ?? '#7c2529',
  ];
  
  // Create color selector for primary accent color, gold is the default
  $form['iastate_color_settings']['settings']['primary_accent_color'] = [
    '#type' => 'color',
    '#title' => t('Primary Accent Color'),
    '#description' => t('Controls decorative colors like the line under block headings'),
    '#default_value' => theme_get_setting('primary_accent_color') ?? '#003d4c',
  ];
  

  // Include the logo default and fields for custom logo
  $form['logo']['#weight'] = -950;
  
  // Create a section for alt text and URL for custom logo
  $form['site_logo_alttext_url'] = array(
    '#type'	=> 'details',
    '#title'	=> t('Logo Image Alternative Text & URL'),
    '#weight'	=> -900,
    '#open'	=> TRUE,
  );
  
  // Set up the checkbox for the default logo alt text and URL
  $form['site_logo_alttext_url']['default_site_logo_alttext_url'] = array(
    '#type'		=> 'checkbox',
    '#title'	=> t('Use the alt text and URL supplied by the theme'),
    '#default_value'	=> theme_get_setting('default_site_logo_alttext_url'),
    '#tree'		=> '',
  );
  
  $form['site_logo_alttext_url']['settings'] = array(
    '#type'	=> 'container',
    '#states'	=> array(
      'invisible'	=> array(
        'input[name="default_site_logo_alttext_url"]' => array(
        'checked'	=> true
        ),
      ),
    ),
  );
  
  // Set up textfield for custom logo alt text
  $form['site_logo_alttext_url']['settings']['site_logo_alttext'] = array(
    '#type'	=> 'textfield',
    '#title'	=> t('Set alt text for accessibility'),
    '#default_value'	=> theme_get_setting('default_site_logo_alttext_url') ? 'Iowa State University Extension and Outreach' : theme_get_setting('site_logo_alttext'),
  );
  
  // Set up textfield for custom logo 
  $form['site_logo_alttext_url']['settings']['site_logo_url'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Link logo to URL'),
    '#default_value'  => theme_get_setting('default_site_logo_alttext_url') ? 'https://www.extension.iastate.edu' : theme_get_setting('site_logo_url'),
  );
  
  // Create a section for footer logo
  $form['iastate_footer_logo'] = array(
	  '#type'	=> 'details',
    '#title'	=> t('Footer image'),
	  '#weight'	=> -880,
	  '#open'	=> TRUE,
  );

  // Set up the checkbox for the default footer logo settings
  $form['iastate_footer_logo']['default_footer_logo'] = array(
	'#type'		=> 'checkbox',
	'#title'	=> t('Use the logo supplied by the theme'),
	'#default_value'	=> theme_get_setting('default_footer_logo'),
	'#tree'		=> '',
	);

  $form['iastate_footer_logo']['settings'] = array(
	'#type'	=> 'container',
	'#states'	=> array(
	  'invisible'	=> array(
	    'input[name="default_footer_logo"]' => array(
		  'checked'	=> true
		    ),
		  ),
	  ),
	);

  // Set up textfield for path to custom footer logo
  $form['iastate_footer_logo']['settings']['iastate_footer_logo_path'] = array(
    '#type'	=> 'textfield',
    '#title'	=> t('Path to custom logo'),
    '#description' => t('Examples: logo.svg (for a file in the public filesystem), public://logo.svg, or themes/contrib/iastate_theme/logo.svg.'),
    '#default_value'  => theme_get_setting('default_footer_logo') ? 'themes/custom/iastate_theme/images/wordmark-stacked.svg' : theme_get_setting('iastate_footer_logo_path'),
  ); 

  // Set up textfield for custom footer logo alt text
  $form['iastate_footer_logo']['settings']['iastate_footer_logo_alttext'] = array(
	'#type'	=> 'textfield',
	'#title'	=> t('Set alt text for accessibility'),
	'#default_value'	=> theme_get_setting('default_footer_logo') ? 'Iowa State University Extension and Outreach' : theme_get_setting('iastate_footer_logo_alttext'),
    );

  // Set up textfield for custom footer logo link
  $form['iastate_footer_logo']['settings']['iastate_footer_logo_url'] = array(
    '#type'   => 'textfield',
    '#title'  => t('Link logo to URL'),
    '#default_value'  => theme_get_setting('default_footer_logo') ? 'https://www.extension.iastate.edu' : theme_get_setting('iastate_footer_logo_url'),
  );
  
  // Create section for copyright settings
  $form['iastate_copyright'] = array(
    '#type'         => 'details',
    '#title'        => t('Copyright Settings'),
    '#description'  => t(''),
    '#weight' => -800,
    '#open' => TRUE,
  );
  
  // Set up checkbox for the default copyright settings
  $form['iastate_copyright']['default_copyright'] = array(
	  '#type'		=> 'checkbox',
	  '#title'	=> t('Use the copyright supplied by the theme'),
	  '#default_value'	=> theme_get_setting('default_copyright'),
	  '#tree'		=> '',
  );

  $form['iastate_copyright']['settings'] = array(
	  '#type'	=> 'container',
	  '#states'	=> array(
	    'invisible'	=> array(
	      'input[name="default_copyright"]' => array(
		      'checked'	=> true
		    ),
		  ),
	  ),
	);

  // Set up textbox for custom copyright settings
  $form['iastate_copyright']['settings']['copyright_subject'] = array(
	  '#type'	=> 'text_format',
	  '#title'	=> t('Copyright'),
	  '#allowed_formats'	=> [ 'wysiwyg' ],
	  '#default_value'	=> theme_get_setting('default_copyright') ? 'Copyright © 1995-'. date("Y") . '<strong><br><a href="https://www.iastate.edu/">Iowa State University of Science and Technology.</a></strong> All rights reserved.<br>2150 Beardshear Hall<br>Ames, IA 50011-2031<br>(800) 262-3804<br><br><a href="https://www.iastate.edu/">Iowa State University</a> | <a href="https://www.extension.iastate.edu/legal">Policies</a><br><a href="http://nifa.usda.gov/partners-and-extension-map">State & National Extension Partners</a>' : theme_get_setting('copyright_subject')['value'],
  );
  
  // Weight variable affects ordering
  $form['favicon']['#weight'] = -700;

}