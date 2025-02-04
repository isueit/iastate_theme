/**
 * @file
 * jQuery navigating the main menu with a keyboard
 *
 * - Right and left should tab through top level items.
 * - Down should open and enter a dropdown.
 * - Up and down should go up and down within the dropdown.
 * - Right and left should also go up and down within the dropdown.
 * - Enter should still work to click on parent items.
 *
 * HTML Structure
 *
 * ul
 * - li NO CHILDREN
 * -- a.isu-navlink
 * - li.isu-dropdown HAS CHILDREN
 * -- div.isu-dropdown-toggle_wrapper PARENT LINK IS A TOGGLE
 * --- a.isu-navlink.isu-dropdown-toggle PARENT LINK
 * --- button.isu-dropdown-toggle_mobile MOBILE TOGGLE BUTTON
 * -- ul.isu-dropdown-menu
 * --- li.isu-dropdown-item
 * ---- a
 *
 */

(function ($, Drupal) {
  $(document).ready(function () {
    const menu = $('#block-iastate-theme-main-menu');

    // Click to open submenu instead of navigating (only for items with submenus)
    menu.on('click', '.isu-dropdown-toggle', function (event) {
      const dropdown = $(this).closest('.isu-dropdown');

      if (dropdown.length && dropdown.find('.isu-dropdown-menu').length) {
        event.preventDefault(); // Prevent navigation ONLY for dropdown items
        const submenu = dropdown.find('.isu-dropdown-menu').first();
        const isExpanded = dropdown.attr('aria-expanded') === 'true';

        // Toggle submenu visibility
        dropdown.attr('aria-expanded', !isExpanded);
        submenu.attr('aria-hidden', isExpanded);

        // Manage focus
        if (!isExpanded) {
          submenu.find('li:first-child a, button').first().focus();
        }
      }
    });

    // Ensure menu items without submenus navigate as expected
    menu.on('click', '.nav-item:not(.isu-dropdown) a', function (event) {
      // Allow normal navigation
      window.location.href = $(this).attr('href');
    });

    // Back button to close submenu
    menu.on('click', '.isu-dropdown-back', function () {
      const submenu = $(this).closest('.isu-dropdown-menu');
      const parentDropdown = submenu.closest('.isu-dropdown');

      // Hide submenu and refocus parent link
      submenu.attr('aria-hidden', 'true');
      parentDropdown.attr('aria-expanded', 'false');
      parentDropdown.find('> .isu-dropdown-toggle_wrapper > .isu-dropdown-toggle').focus();
    });

    // Close dropdowns when clicking outside
    $(document).on('click', function (event) {
      if (!$(event.target).closest('.isu-dropdown').length) {
        $('.isu-dropdown[aria-expanded="true"]').attr('aria-expanded', 'false').find('.isu-dropdown-menu').attr('aria-hidden', 'true');
      }
    });

    // Close dropdowns when focus leaves
    menu.on('focusout', '.isu-dropdown-menu', function () {
      const dropdown = $(this).closest('.isu-dropdown');
      setTimeout(() => {
        if (!dropdown.find(':focus').length) {
          dropdown.attr('aria-expanded', 'false').find('.isu-dropdown-menu').attr('aria-hidden', 'true');
        }
      }, 100);
    });

    // Allow submenu's second "Resources" link to navigate
    menu.on('click', '.isu-dropdown-parent-wrap a', function (event) {
      window.location.href = $(this).attr('href');
    });

  });
})(jQuery, Drupal);
