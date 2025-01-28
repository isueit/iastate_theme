/**
 * @file
 * jQuery the ISU Navbar. Includes keyboard navigable functionality.
 */

(function ($, Drupal) {
  $(document).ready(function () {
    // Toggle dropdown visibility
    $(document).on('click', '.isu-dropdown-toggle', function (event) {
      event.preventDefault();

      var $toggle = $(this);
      var $parentLi = $toggle.closest('li'); // Parent <li> element
      var $dropdown = $parentLi.find('ul').first(); // Submenu <ul>

      // Check the current state
      var isExpanded = $toggle.attr('aria-expanded') === 'true';

      // Toggle the current dropdown
      $toggle.attr('aria-expanded', !isExpanded);
      $dropdown.attr('aria-hidden', isExpanded ? 'true' : 'false');

      // Close all other dropdowns
      $parentLi.siblings().each(function () {
        $(this).find('.isu-dropdown-toggle').attr('aria-expanded', 'false');
        $(this).find('ul').attr('aria-hidden', 'true');
      });
    });

    // Close dropdown with the back button
    $(document).on('click', '.site-header__mega-menu-main-nav-dropdown-back', function (event) {
      event.preventDefault();

      var $dropdown = $(this).closest('ul'); // Current submenu
      var $parentToggle = $dropdown.closest('li').find('.isu-dropdown-toggle'); // Parent toggle

      // Close the submenu
      $dropdown.attr('aria-hidden', 'true');
      $parentToggle.attr('aria-expanded', 'false');
      $parentToggle.focus(); // Focus the parent toggle
    });

    // Keep child links functional
    $(document).on('click', '.link-territory', function (event) {
      console.log('Navigating to:', event.target.href); // Debugging navigation
    });

    // Close dropdowns on outside click
    $(document).on('click', function (event) {
      if (!$(event.target).closest('.isu-dropdown-toggle, .isu-navbar_dropdown').length) {
        // Close all dropdowns
        $('.isu-dropdown-toggle').attr('aria-expanded', 'false');
        $('.isu-navbar_dropdown ul').attr('aria-hidden', 'true');
      }
    });
  });
})(jQuery, Drupal);