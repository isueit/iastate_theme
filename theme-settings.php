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

  // Default colors for the theme
  $default_primary = '#c8102e';
  $default_secondary = '#7c2529';
  $default_tertiary = "#003d4c";
  $default_accent = '#f1be48';
  $default_link = "#7c2529";
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

  // Create a section for ISU theme settings
  $form['iastate_theme_settings'] = array(
    '#type'         => 'details',
    '#title'        => t('IASTATE Theme Settings'),
    '#description'  => t('Configure IASTATE Theme options'),
    '#weight' => -1000,
    '#open' => TRUE,
  );

  // Set up the select to choose which ISU navbar to show, if any
  // Older sites stored this as a 1/0 checkbox value
  $isu_navbar = theme_get_setting('isu_navbar');
  if (!in_array($isu_navbar, ['none', 'default', 'local'], TRUE)) {
    $isu_navbar = ($isu_navbar === NULL || $isu_navbar) ? 'default' : 'none';
  }
  $local_navbar_exists = file_exists(DRUPAL_ROOT . '/local/isu-navbar.htm');
  $form['iastate_theme_settings']['isu_navbar'] = array(
    '#type'         => 'select',
    '#title'        => t('ISU navbar'),
    '#options'      => [
      'none'    => t('None'),
      'default' => t('ISU default'),
      'local'   => t('Local file (local/isu-navbar.htm)'),
    ],
    '#default_value' => $isu_navbar,
    '#description'  => t('Choose which navbar to show above the site header.') . ($local_navbar_exists ? '' : ' ' . t('No local/isu-navbar.htm file was found, so "Local file" will show the ISU default navbar.')),
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

  // This container will be hidden when the social footer icons are hidden.
  $form['iastate_theme_settings']['social_footer'] = array(
    '#type' => 'container',
    '#states' => array(
      'visible' => array(
        'input[name="default_social_footer"]' => array(
          'checked' => TRUE,
        ),
      ),
    ),
  );

  // Set up checkbox for the default social links
  $form['iastate_theme_settings']['social_footer']['default_social_links'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use the social links supplied by the theme'),
    '#default_value' => theme_get_setting('default_social_links') ?? 1,
    '#tree' => '',
  );

  $form['iastate_theme_settings']['social_footer']['settings'] = array(
    '#type' => 'container',
    '#states' => array(
      'invisible' => array(
        'input[name="default_social_links"]' => array(
          'checked' => TRUE,
        ),
      ),
    ),
  );

  // Set up textfield for the custom social links heading
  $form['iastate_theme_settings']['social_footer']['settings']['social_links_heading'] = array(
    '#type' => 'textfield',
    '#title' => t('Social links heading'),
    '#description' => t('Leave blank to show no heading.'),
    '#default_value' => theme_get_setting('social_links_heading') ?? 'Connect with ISU Extension and Outreach',
  );

  $form['iastate_theme_settings']['social_footer']['settings']['social_links_help'] = array(
    '#markup' => '<p>' . t('The icon is chosen from the link URL (Facebook, Instagram, LinkedIn, X/Twitter, YouTube, Pinterest, Flickr, and others). Other URLs show a generic link icon. The label is read by screen readers, for example "Follow us on Instagram".') . '</p>',
  );

  for ($i = 1; $i <= 8; $i++) {
    $form['iastate_theme_settings']['social_footer']['settings']['social_link_' . $i] = array(
      '#type' => 'container',
      '#attributes' => ['style' => 'display: flex; gap: 1rem; align-items: flex-end;'],
    );
    $form['iastate_theme_settings']['social_footer']['settings']['social_link_' . $i]['social_link_' . $i . '_url'] = array(
      '#type' => 'url',
      '#title' => t('Social Link @n URL', ['@n' => $i]),
      '#default_value' => theme_get_setting('social_link_' . $i . '_url') ?? '',
      '#size' => 50,
    );
    $form['iastate_theme_settings']['social_footer']['settings']['social_link_' . $i]['social_link_' . $i . '_label'] = array(
      '#type' => 'textfield',
      '#title' => t('Social Link @n Label', ['@n' => $i]),
      '#default_value' => theme_get_setting('social_link_' . $i . '_label') ?? '',
      '#size' => 30,
    );
  }


  // Set up the field for the Support Extension link
  $support_extension = '';
  $form['iastate_theme_settings']['support_extension'] = array(
    '#type'         => 'url',
    '#title'        => t('Support Extension link'),
    '#default_value' => theme_get_setting('support_extension') ?? $support_extension,
    '#description'  => t('Add an absolute URL for a custom Support Extension link.'),
     '#states' => [
      'visible' => [
        ':input[name="isu_navbar"]' => ['value' => 'default'],
      ],
    ],
  );

  // Create a section for color settings
  $form['iastate_color_settings'] = [
    '#type' => 'fieldset',
    '#title' => t('Color Settings'),
    '#weight' => -980,
    '#open' => TRUE,
  ];

  // Set up the checkbox for the default colors
  $form['iastate_color_settings']['default_color_settings'] = [
    '#type' => 'checkbox',
    '#title' => t('Use the colors supplied by the theme'),
    '#default_value' => theme_get_setting('default_color_settings') ?? 1,
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
    '#default_value' => theme_get_setting('primary_color') ?? $default_primary,
  ];

  // Create color selector for secondary color, burgundy is the default
  $form['iastate_color_settings']['settings']['secondary_color'] = [
    '#type' => 'color',
    '#title' => t('Secondary Color'),
    '#description' => t('Controls things like link color and smaller heading colors'),
    '#default_value' => theme_get_setting('secondary_color') ?? $default_secondary,
  ];

  // Create color selector for tertiary color, midnight is the default
  $form['iastate_color_settings']['settings']['tertiary_color'] = [
    '#type' => 'color',
    '#title' => t('Tertiary Color'),
    '#description' => t('Controls things like link color and smaller heading colors'),
    '#default_value' => theme_get_setting('tertiary_color') ?? $default_tertiary,
  ];

  // Create color selector for primary accent color, gold is the default
  $form['iastate_color_settings']['settings']['primary_accent_color'] = [
    '#type' => 'color',
    '#title' => t('Primary Accent Color'),
    '#description' => t('Controls decorative colors like the line under block headings'),
    '#default_value' => theme_get_setting('primary_accent_color') ?? $default_accent,
  ];

  // Create color selector for link color, burgundy is the default
  $form['iastate_color_settings']['settings']['link_color'] = [
    '#type' => 'color',
    '#title' => t('Link Color'),
    '#description' => t('Controls color of links'),
    '#default_value' => theme_get_setting('link_color') ?? $default_link,
  ];

  // Create color selector for success button color, green is the default
  $form['iastate_color_settings']['settings']['btn_success_color'] = [
    '#type' => 'color',
    '#title' => t('Bootstrap Success Button Color'),
    '#description' => t('Controls the bootstrap success btn color'),
    '#default_value' => theme_get_setting('btn_success_color') ?? $default_btn_success,
  ];

  // Create color selector for success button color, green is the default
  $form['iastate_color_settings']['settings']['btn_danger_color'] = [
    '#type' => 'color',
    '#title' => t('Bootstrap Danger Button Color'),
    '#description' => t('Controls the bootstrap danger btn color'),
    '#default_value' => theme_get_setting('btn_danger_color') ?? $default_btn_danger,
  ];

  // Create color selector for primary button color, midnight is the default
  $form['iastate_color_settings']['settings']['btn_primary_color'] = [
    '#type' => 'color',
    '#title' => t('Bootstrap Primary Color'),
    '#description' => t('Controls the bootstrap primary btn color'),
    '#default_value' => theme_get_setting('btn_primary_color') ?? $default_btn_primary,
  ];

  // Create color selector for secondary button color, burgundy is the default
  $form['iastate_color_settings']['settings']['btn_secondary_color'] = [
    '#type' => 'color',
    '#title' => t('Bootstrap Secondary Color'),
    '#description' => t('Controls the bootstrap secondary btn color'),
    '#default_value' => theme_get_setting('btn_secondary_color') ?? $default_btn_secondary,
  ];

  // Replace the native color inputs with the shared ISUEO color picker
  // (Spectrum + inline WCAG contrast checker) when that module is enabled.
  // Sites without it keep the native color inputs above.
  if (\Drupal::moduleHandler()->moduleExists('isueo_color_picker')) {
    // No 'palettes' key is passed, so the preset-palette chooser stays dormant.
    $button_color_settings = ['btn_success_color', 'btn_danger_color', 'btn_primary_color', 'btn_secondary_color'];
    $color_setting_defaults = [
      'primary_color' => $default_primary,
      'secondary_color' => $default_secondary,
      'tertiary_color' => $default_tertiary,
      'primary_accent_color' => $default_accent,
      'link_color' => $default_link,
      'btn_success_color' => $default_btn_success,
      'btn_danger_color' => $default_btn_danger,
      'btn_primary_color' => $default_btn_primary,
      'btn_secondary_color' => $default_btn_secondary,
    ];
    $color_picker_fields = [];
    foreach ($color_setting_defaults as $field_name => $default) {
      // Spectrum binds to a plain text input. The saved value carries over as
      // the default, and the validator keeps it stored as #rrggbb like the
      // native color input did.
      $element = &$form['iastate_color_settings']['settings'][$field_name];
      $element['#type'] = 'textfield';
      $element['#size'] = 10;
      $element['#maxlength'] = 7;
      $element['#element_validate'][] = 'iastate_theme_color_setting_validate';
      unset($element);

      $color_picker_fields[] = [
        'fieldName' => $field_name,
        'inputSelector' => 'input[name="' . $field_name . '"]',
        'default' => theme_get_setting($field_name) ?? $default,
        'isButton' => in_array($field_name, $button_color_settings),
      ];
    }
    $form['#attached']['library'][] = 'isueo_color_picker/color_picker';
    $form['#attached']['drupalSettings']['colorPickerWidget'] = [
      'fields' => $color_picker_fields,
      // Enables the Spectrum picker (isueo_color_picker/js/color-picker.js) on
      // these fields. regcytes must NOT set this — its group color fields
      // already get Spectrum from the color_field module's own widget, and
      // initializing it twice on the same input is unsupported.
      'initSpectrum' => TRUE,
    ];
  }

  // Default fonts for the theme, these match --sans-font and --serif-font in
  // css/base.css so the defaults stay selected in the dropdowns.
  $default_sans_font = "'Arial', 'Helvetica Neue', sans-serif";
  $default_serif_font = "'Merriweather', serif";

  // Create a section for font settings
  $form['iastate_font_settings'] = [
    '#type' => 'fieldset',
    '#title' => t('Font Settings'),
    '#weight' => -970,
    '#open' => TRUE,
  ];

  // Set up the checkbox for the default fonts
  $form['iastate_font_settings']['default_font_settings'] = [
    '#type' => 'checkbox',
    '#title' => t('Use the fonts supplied by the theme'),
    '#default_value' => theme_get_setting('default_font_settings') ?? 1,
  ];

  // This container will be hidden when the checkbox is checked.
  $form['iastate_font_settings']['settings'] = [
    '#type' => 'container',
    '#states' => [
      'visible' => [
        ':input[name="default_font_settings"]' => ['checked' => FALSE],
      ],
    ],
  ];

  // Web safe font stacks, keyed by the CSS value that gets saved
  $sans_font_options = [
    $default_sans_font => t('Arial (theme default)'),
    "'Helvetica Neue', Helvetica, Arial, sans-serif" => t('Helvetica'),
    "Verdana, Geneva, sans-serif" => t('Verdana'),
    "Tahoma, Verdana, sans-serif" => t('Tahoma'),
    "'Trebuchet MS', Helvetica, sans-serif" => t('Trebuchet MS'),
    "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" => t('System UI'),
  ];
  $serif_font_options = [
    $default_serif_font => t('Merriweather (theme default)'),
    "Georgia, 'Times New Roman', serif" => t('Georgia'),
    "'Times New Roman', Times, serif" => t('Times New Roman'),
    "'Palatino Linotype', Palatino, 'Book Antiqua', serif" => t('Palatino'),
    "Garamond, Baskerville, 'Baskerville Old Face', serif" => t('Garamond'),
  ];

  // Create font selector for the sans-serif font, Arial is the default
  $form['iastate_font_settings']['settings']['sans_font'] = [
    '#type' => 'select',
    '#title' => t('Sans-serif Font'),
    '#description' => t('Controls body text and most interface text'),
    '#options' => $sans_font_options,
    '#default_value' => theme_get_setting('sans_font') ?? $default_sans_font,
  ];

  // Create font selector for the serif font, Merriweather is the default
  $form['iastate_font_settings']['settings']['serif_font'] = [
    '#type' => 'select',
    '#title' => t('Serif Font'),
    '#description' => t('Controls headings and other text using the serif font'),
    '#options' => $serif_font_options,
    '#default_value' => theme_get_setting('serif_font') ?? $default_serif_font,
  ];

  // Include the logo default and fields for custom logo
  $form['logo']['#weight'] = -950;

  // Create a section for alt text and URL for custom logo
  $form['site_logo_alttext_url'] = array(
    '#type'	=> 'fieldset',
    '#title'	=> t('Custom Logo Settings'),
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
    '#type' => 'textfield',
    '#title' => t('Link logo to URL'),
    '#default_value'  => theme_get_setting('default_footer_logo') ? 'https://www.extension.iastate.edu' : theme_get_setting('iastate_footer_logo_url'),
  );

  // Create section for quick links settings
  $form['iastate_quick_links'] = array(
    '#type' => 'fieldset',
    '#title' => t('Quick Links Settings'),
    '#description' => t('Add up to 12 quick links to display in the footer.'),
    '#weight' => -810,
    '#open' => TRUE,
  );

  // Set up checkbox for the default quick links
  $form['iastate_quick_links']['default_quick_links'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use the quick links supplied by the theme'),
    '#default_value' => theme_get_setting('default_quick_links') ?? 1,
    '#tree' => '',
  );

  $form['iastate_quick_links']['settings'] = array(
    '#type' => 'container',
    '#states' => array(
      'invisible' => array(
        'input[name="default_quick_links"]' => array(
          'checked' => TRUE,
        ),
      ),
    ),
  );

  for ($i = 1; $i <= 9; $i++) {
    $form['iastate_quick_links']['settings']['quick_link_' . $i] = array(
      '#type' => 'container',
      '#attributes' => ['style' => 'display: flex; gap: 1rem; align-items: flex-end;'],
    );
    $form['iastate_quick_links']['settings']['quick_link_' . $i]['quick_link_' . $i . '_text'] = array(
      '#type' => 'textfield',
      '#title' => t('Link @n Text', ['@n' => $i]),
      '#default_value' => theme_get_setting('quick_link_' . $i . '_text') ?? '',
      '#size' => 30,
    );
    $form['iastate_quick_links']['settings']['quick_link_' . $i]['quick_link_' . $i . '_url'] = array(
      '#type' => 'url',
      '#title' => t('Link @n URL', ['@n' => $i]),
      '#default_value' => theme_get_setting('quick_link_' . $i . '_url') ?? '',
      '#size' => 50,
    );
  }

  // Create section for copyright settings
  $form['iastate_copyright'] = array(
    '#type' => 'fieldset',
    '#title' => t('Copyright Settings'),
    '#description' => t(''),
    '#weight' => -800,
    '#open' => TRUE,
  );

  // Set up checkbox for the default copyright settings
  $form['iastate_copyright']['default_copyright'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use the copyright supplied by the theme'),
    '#default_value' => theme_get_setting('default_copyright') ?? 1,
    '#tree' => '',
  );

  $form['iastate_copyright']['settings'] = array(
    '#type' => 'container',
    '#states' => array(
      'invisible' => array(
        'input[name="default_copyright"]' => array(
          'checked' => TRUE,
        ),
      ),
    ),
  );

  // Set up textbox for custom copyright override
  $form['iastate_copyright']['settings']['copyright_subject'] = array(
    '#type' => 'text_format',
    '#title' => t('Copyright'),
    '#allowed_formats' => ['wysiwyg'],
    '#default_value' => theme_get_setting('copyright_subject')['value'] ?? '<nav class="isu-copyright__links site-footer__utility-nav" aria-label="Footer Utility"><ul><li><a href="https://www.extension.iastate.edu/legal">Policies</a></li><li><a href="https://nifa.usda.gov/land-grant-colleges-and-universities-partner-website-directory">State &amp; National Extension Partners</a></li><li><a href="https://www.iastate.edu/">Iowa State University</a></li></ul></nav>',
  );

  // Weight variable affects ordering
  $form['favicon']['#weight'] = -700;

}

/**
 * Element validator for the color picker settings.
 *
 * Accepts #rgb or #rrggbb (with or without the #) and stores the value as a
 * lowercase #rrggbb string, matching what the native color input saved.
 */
function iastate_theme_color_setting_validate(array &$element, \Drupal\Core\Form\FormStateInterface $form_state) {
  $value = trim((string) $element['#value']);
  if (!\Drupal\Component\Utility\Color::validateHex($value)) {
    $form_state->setError($element, t('%title must be a hex color such as #c8102e.', ['%title' => $element['#title']]));
    return;
  }
  $hex = \Drupal\Component\Utility\Color::rgbToHex(\Drupal\Component\Utility\Color::hexToRgb($value));
  $form_state->setValueForElement($element, strtolower($hex));
}
