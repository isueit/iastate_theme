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
  
  // Default ISUEO styles
  $support_extension = 'https://www.extension.iastate.edu/support-extension/';

  // Default global styles
  $default_primary = '#c8102e';
  $default_secondary = '#7c2529';
  $default_tertiary = "#003d4c";
  $default_accent = '#f1be48';
  $default_link = "#7c2529";

  // Default heading styles
  $default_heading_one_color = '#c8102e';
  $default_heading_two_color = '#c8102e';
  $default_heading_three_color = '#c8102e';
  $default_heading_four_color = '#7c2529';
  $default_heading_five_color = '#7c2529';
  $default_heading_six_color = '#7c2529';

  // Default button and label colors
  $default_btn_success = "#008540";
  $default_btn_danger = "#c8102e";
  $default_btn_primary = "#003d4c";
  $default_btn_secondary = "#7c2529";

  // Old variables need removed after local styles are updated
  $cardinal = '#c8102e';
  $burgundy = '#7c2529';
  $midnight = '#003d4c';
  $green = '#008540';
  $gold = '#f1be48';
  
/**
 * 
 * SECTION
 * ISUEO theme settings
 * 
 */
  $form['iastate_theme_settings'] = array(
    '#type'         => 'details',
    '#title'        => t('ISUEO Theme Settings'),
    '#description'  => t('Configure settings for ISUEO sites.'),
    '#weight' => -1000,
    '#open' => TRUE,
  );

  // Set up the checkbox to include/not include the ISU navbar
  $form['iastate_theme_settings']['isu_navbar'] = array(
    '#type'         => 'checkbox',
    '#title'        => t('Show ISU navbar'),
    '#default_value' => theme_get_setting('isu_navbar'),
    '#description'  => t('Check this option if you\'d like to show the ISUEO navbar.'),
  );

  // Set up the field for the Support Extension link
  $form['iastate_theme_settings']['support_extension'] = array(
    '#type'         => 'url',
    '#title'        => t('Support Extension link'),
    '#default_value' => theme_get_setting('support_extension') ?? $support_extension,
    '#description'  => t('Add an absolute URL for a custom Support Extension link. Leave blank to use the default.'),
     '#states' => [
      'visible' => [
        ':input[name="isu_navbar"]' => ['checked' => TRUE],
      ],
    ],
  );

// Create Global Config Container
$form['global_styles'] = array(
  '#type' => 'vertical_tabs',
  '#weight' => -990,
);

/**
 * 
 * SECTION
 * GLOBAL STYLES
 * 
 */
  $form['theme_overrides'] = array(
    '#type'         => 'details',
    '#title'        => t('Global Styles'),
    '#group'        => 'global_styles',
  );

  $form['theme_overrides'] ['colors'] = array(
    '#type'         => 'checkbox',
    '#title'        => t('Set Colors'),
  );

  // Create global styles section
  $form['theme_overrides'] = array(
    '#type'         => 'details',
    '#title'        => t('Global Styles'),
    '#description'  => t('Global styles set simple styles for the site. These will be applied generally and you will be able to override some elements in the following sections.'),
    '#group'        => 'global_styles',
  );

  // Weight variable affects ordering
  $form['favicon']['#weight'] = -700;
  $form['favicon']['#group'] = 'theme_overrides';

  // Set up the checkbox for the default colors
  $form['theme_overrides']['default_color_settings'] = [
    '#type' => 'checkbox',
    '#title' => t('Use the colors supplied by the theme'),
    '#description' => t('Uncheck to set global custom color styles.'),
    '#default_value' => theme_get_setting('default_color_settings') ?? 1,
  ];

  // This container will be hidden when the checkbox is checked.
  $form['theme_overrides']['global_settings'] = [
    '#type' => 'fieldset',
    '#states' => [
      'visible' => [
        ':input[name="default_color_settings"]' => ['checked' => FALSE],
      ],
    ],
  ];

  // Create color selector for primary color, cardinal is the default
  $form['theme_overrides']['global_settings']['primary_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Primary Color'),
    '#description' => t('Sets the background color for the footer, H1-H3 colors, and link hover color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('primary_color') ?? $default_primary,
  ];

  // Create color selector for secondary color, burgundy is the default
  $form['theme_overrides']['global_settings']['secondary_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Secondary Color'),
    '#description' => t('Sets the background color for the sign-on section.'), // Come back to this
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('secondary_color') ?? $default_secondary,
  ];

  // Create color selector for tertiary color, midnight is the default
  $form['theme_overrides']['global_settings']['tertiary_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Tertiary Color'),
    '#description' => t('Controls things like link color and smaller heading colors'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('tertiary_color') ?? $default_tertiary,
  ];
  
  // Create color selector for primary accent color, gold is the default
  $form['theme_overrides']['global_settings']['primary_accent_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Primary Accent Color'),
    '#description' => t('Controls decorative colors like the line under block headings'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('primary_accent_color') ?? $default_accent,
  ];

  // Create color selector for link color, burgundy is the default
  $form['theme_overrides']['global_settings']['link_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Link Color'),
    '#description' => t('Controls color of links'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('link_color') ?? $default_link,
  ];

/**
 * 
 * SECTION
 * HEADING OVERRIDES
 * 
 */
  $form['heading_overrides'] = array(
    '#type'         => 'details',
    '#title'        => t('Heading Overrides'),
    '#description'  => t('Override individual heading styles in this section.'),
    '#group'        => 'global_styles',
  );

  // Create color selector for H1, cardinal is the default
  $form['heading_overrides']['global_settings']['heading_one_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 1 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_one_color') ?? $default_heading_one_color,
  ];

  // Create color selector for H2, cardinal is the default
  $form['heading_overrides']['global_settings']['heading_two_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 2 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_two_color') ?? $default_heading_two_color,
  ];

  // Create color selector for H3, cardinal is the default
  $form['heading_overrides']['global_settings']['heading_three_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 3 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_three_color') ?? $default_heading_three_color,
  ];

  // Create color selector for H4, Burgundy is the default
  $form['heading_overrides']['global_settings']['heading_four_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 4 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_four_color') ?? $default_heading_four_color,
  ];

  // Create color selector for H5, burgundy is the default
  $form['heading_overrides']['global_settings']['heading_five_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 5 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_five_color') ?? $default_heading_five_color,
  ];

  // Create color selector for H6, burgundy is the default
  $form['heading_overrides']['global_settings']['heading_six_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Heading 6 Color'),
    '#description' => t('Choose a color with sufficient color contrast with the background color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('heading_six_color') ?? $default_heading_six_color,
  ];

/**
 * 
 * SECTION
 * BUTTON AND LABEL OVERRIDES
 * 
 */
  $form['bootstrap_styles'] = array(
    '#type'         => 'details',
    '#title'        => t('Button and Labels'),
    '#description'  => t('Override the button and card label colors.'),
    '#group'        => 'global_styles',
  );

  // Create color selector for success button color, green is the default
  $form['bootstrap_styles']['global_settings']['btn_success_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Bootstrap Success Color'),
    '#description' => t('Overrides the bootstrap success btn color, also used as a theme button and card label color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('btn_success_color') ?? $default_btn_success,
  ];

  // Create color selector for danger button color, cardinal is the default
  $form['bootstrap_styles']['global_settings']['btn_danger_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Bootstrap Danger Color'),
    '#description' => t('Overrides the bootstrap danger btn color, also used as a theme button and card label color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('btn_danger_color') ?? $default_btn_danger,
  ];

  // Create color selector for primary button color, midnight is the default
  $form['bootstrap_styles']['global_settings']['btn_primary_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Bootstrap Primary Color'),
    '#description' => t('Overrides the bootstrap primary color, also used as a theme button and card label color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('btn_primary_color') ?? $default_btn_primary,
  ];

  // Create color selector for secondary button color, burgundy is the default
  $form['bootstrap_styles']['global_settings']['btn_secondary_color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Bootstrap Secondary Color'),
    '#description' => t('Overrides the bootstrap secondary color, also used as a theme button and card label color.'),
    '#description_display' => 'before',
    '#default_value' => theme_get_setting('btn_secondary_color') ?? $default_btn_secondary,
  ];

/**
 * 
 * SECTION
 * LOGO SETTINGS
 * 
 */
  $form['custom_logo'] = array(
    '#type'         => 'details',
    '#title'        => t('Logo Settings'),
    '#group'        => 'global_styles',
  );

  // Include the logo default and fields for custom logo
  $form['logo']['#weight'] = -950;
  $form['logo']['#group'] = 'custom_logo';
  
  // Set up textfield for custom logo alt text
  $form['custom_logo']['global_settings']['site_logo_alttext'] = array(
    '#type'	=> 'textfield',
    '#title'	=> t('Alternative Text'),
    '#description' => t('Set the alternative text to be used by the logo for accessibility.'),
    '#description_display' => 'before',
    '#default_value'	=> theme_get_setting('default_site_logo_alttext_url') ? 'Iowa State University Extension and Outreach' : theme_get_setting('site_logo_alttext'),
  );
  
  // Set up textfield for custom logo 
  $form['custom_logo']['global_settings']['site_logo_url'] = array(
    '#type'   => 'textfield',
    '#title'  => t('URL'),
    '#description' => t('Add the URL that the custom logo should link to.'),
    '#description_display' => 'before',
    '#default_value'  => theme_get_setting('default_site_logo_alttext_url') ? 'https://www.extension.iastate.edu' : theme_get_setting('site_logo_url'),
  );
  
  /**
  * 
   * SECTION
   * FOOTER SETTINGS
  * 
  */
  $form['iastate_footer_logo'] = array(
    '#type'         => 'details',
    '#title'        => t('Footer'),
    '#group'        => 'global_styles',
  );

  // Set up textfield for path to custom footer logo
  $form['iastate_footer_logo']['global_settings']['iastate_footer_logo_path'] = array(
    '#type'	=> 'textfield',
    '#title'	=> t('Path to footer logo'),
    '#description' => t('Examples: logo.svg (for a file in the public filesystem), public://logo.svg, or themes/contrib/iastate_theme/logo.svg.'),
    '#description_display' => 'before',    
    '#default_value'  => theme_get_setting('default_footer_logo') ? 'themes/custom/iastate_theme/images/wordmark-stacked.svg' : theme_get_setting('iastate_footer_logo_path'),
  ); 

  // Set up textfield for custom footer logo alt text
  $form['iastate_footer_logo']['global_settings']['iastate_footer_logo_alttext'] = array(
    '#title'	=> t('Alternative Text'),
    '#description' => t('Set the alternative text to be used by the footer logo for accessibility.'),
    '#description_display' => 'before',
	  '#default_value'	=> theme_get_setting('default_footer_logo') ? 'Iowa State University Extension and Outreach' : theme_get_setting('iastate_footer_logo_alttext'),
  );

  // Set up textfield for custom footer logo link
  $form['iastate_footer_logo']['global_settings']['iastate_footer_logo_url'] = array(
    '#type' => 'textfield',
    '#title'  => t('URL'),
    '#description' => t('Add the URL that the footer logo should link to.'),
    '#description_display' => 'before',
    '#default_value'  => theme_get_setting('default_footer_logo') ? 'https://www.extension.iastate.edu' : theme_get_setting('iastate_footer_logo_url'),
  );
  
  // Set up checkbox for the default copyright settings
  $form['iastate_footer_logo']['iastate_copyright']['default_copyright'] = array(
	  '#type' => 'checkbox',
	  '#title' => t('Use the copyright supplied by the theme'),
	  '#default_value' => theme_get_setting('default_copyright'),
	  '#tree'	=> '',
  );

  $form['iastate_footer_logo']['iastate_copyright']['global_settings'] = array(
	  '#type'	=> 'container',
	  '#states'	=> array(
	    'invisible'	=> array(
	      'input[name="default_copyright"]' => array(
		      'checked'	=> true
		    ),
		  ),
	  ),
	);

  // Set up the checkbox to show/hide the social icons under the footer logo
  $form['iastate_footer_logo']['default_social_footer'] = array(
    '#type'		=> 'checkbox',
    '#title'	=> t('Show social media icons'),
    '#description' => t('Check this option to use the ISU social media icons under the logo in the footer.'),
    '#default_value'	=> theme_get_setting('default_social_footer'),
  );

  // Set up textbox for custom copyright settings
  $form['iastate_footer_logo']['iastate_copyright']['global_settings']['copyright_subject'] = array(
	  '#type'	=> 'text_format',
	  '#title'	=> t('Copyright'),
	  '#allowed_formats'	=> [ 'wysiwyg' ],
	  '#default_value'	=> theme_get_setting('default_copyright') ? 'Copyright © 1995-'. date("Y") . '<strong><br><a href="https://www.iastate.edu/">Iowa State University of Science and Technology.</a></strong> All rights reserved.<br>2150 Beardshear Hall<br>Ames, IA 50011-2031<br>(800) 262-3804<br><br><a href="https://www.iastate.edu/">Iowa State University</a> | <a href="https://www.extension.iastate.edu/legal">Policies</a><br><a href="http://nifa.usda.gov/partners-and-extension-map">State & National Extension Partners</a>' : theme_get_setting('copyright_subject')['value'],
  );

}