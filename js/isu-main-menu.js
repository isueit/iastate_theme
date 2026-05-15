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

$(document).ready(function() {

  // Navigate with right and left arrow keys.
  $('#block-iastate-theme-main-menu').on('keydown', function(event) {
    if (event.keyCode === 39) { // RIGHT arrow key
      event.preventDefault();
	  if ($(':focus').hasClass('sub')) {
		$(':focus').closest('.isu-dropdown').attr('aria-expanded', 'true');
		$(':focus').parent('.isu-dropdown-toggle_wrapper').next('ul').find('li:first-of-type a').focus();
	  } else {
		$(':focus').closest('li').next('li').find('a').focus();
	  }
    } else if (event.keyCode === 37) { // LEFT arrow key
      event.preventDefault();
	  if ($(':focus').offsetParent().siblings('div.isu-dropdown-toggle_wrapper').children('a.sub').hasClass('isu-dropdown-toggle')) {
		$(':focus').offsetParent().offsetParent().find('a.sub').focus();
        $(':focus').closest('.isu-dropdown').attr('aria-expanded', 'false');
	  } else {
	    $(':focus').closest('li').prev('li').find('a').focus();
	  }
    }
  });

  // Enter dropdowns with the down arrow
  $('.isu-dropdown-toggle').on('keydown', function(event) {
    var dropdownToggle = $(this);
      if (event.keyCode === 40) { // DOWN arrow key
        event.preventDefault();
		if (!($(':focus').is('a.isu-dropdown-toggle.sub'))) {
		  // Open menu
          dropdownToggle.closest('.isu-dropdown').attr('aria-expanded', 'true');
          // Change focus to the first link in the dropdown
          $(':focus').parent('.isu-dropdown-toggle_wrapper').next('ul').find('li:first-of-type a').focus();
		}
      }
  });

  // Navigate within a dropdown with the up and down arrow keys.
  $('.isu-dropdown-menu').on('keydown', function(event) {
    if (event.keyCode === 40) { // DOWN arrow key
      event.preventDefault();
	  event.stopPropagation();
      // Change the focus to the next link in the dropdown
      $(':focus').closest('li').next('li').find('a').focus();
	  // console.log($(':focus').parent());
    } else if (event.keyCode === 38) { // UP arrow key
      event.preventDefault();
	  event.stopPropagation();
      if ( $(':focus').is('.isu-dropdown-menu li:not(:first-of-type) a') ) {
        // If the focused item is NOT the first item in the list...
        // Change the focus to the link in the previous li
		// console.log($(':focus').closest('li').prev('li'));
        $(':focus').closest('li').prev('li').find('a').focus();
      }
    }
  });

  // Exit dropdowns with the up arrow
  $('.isu-dropdown-menu > li:first-of-type a').on('keydown', function(event) {
    var dropdownMenuItem = $(this);
      if (event.keyCode === 38) { // up
		if (!($(':focus').offsetParent().hasClass('isu-dropdown-submenu'))) {
          // Close the dropdown
          dropdownMenuItem.offsetParent().closest('.isu-dropdown').attr('aria-expanded', 'false');
          // Refocus on the parent link
          dropdownMenuItem.closest('.isu-dropdown-menu').prev('.isu-dropdown-toggle_wrapper').find('.isu-dropdown-toggle').focus();
		}
      }
  });

  // Close dropdowns when focus leaves (keyboard users)
  $('.isu-dropdown-menu').on('focusout', function(e) {
    var dropdownMenu = $(this);
    setTimeout(function() {
      if (dropdownMenu.find(':focus').length === 0) {
        // If neither the dropdown nor its children have focus...
        if (dropdownMenu.siblings('a:focus').length === 0) {
          dropdownMenu.parent('.isu-dropdown').attr('aria-expanded', 'false');
        }
	  }
    }, 100 );
  });

  /* Desktop click-to-open dropdowns
   *
   * On desktop (>=1200px) the toggle link opens/closes the dropdown on click.
   * Clicking outside any open dropdown closes it. Escape also closes.
   */

  // Toggle dropdowns on desktop via the nav link
  $(document).on('click', '.isu-dropdown-toggle', function(event) {
    if (window.innerWidth < 1200) return;
    event.preventDefault();
    var dropdown = $(this).closest('.isu-dropdown');
    var isOpen = dropdown.attr('aria-expanded') === 'true';
    // Close all open dropdowns first
    $('.isu-dropdown[aria-expanded="true"]').attr('aria-expanded', 'false');
    if (!isOpen) {
      dropdown.attr('aria-expanded', 'true');
    }
  });

  // Close open dropdowns when clicking outside the menu
  $(document).on('click', function(event) {
    if (window.innerWidth < 1200) return;
    if (!$(event.target).closest('.isu-dropdown').length) {
      $('.isu-dropdown[aria-expanded="true"]').attr('aria-expanded', 'false');
    }
  });

  // Close open dropdowns with the Escape key
  $(document).on('keydown', function(event) {
    if (event.keyCode === 27) { // Escape
      $('.isu-dropdown[aria-expanded="true"]').attr('aria-expanded', 'false');
    }
  });

  /* Entering and exiting the dropdowns with the mobile toggle
   *
   * Because there is no hover on mobile, we must add a mobile toggle button
   * for those narrow screens. They must open on click/tap, enter, and arrow keys
   * because the mobile breakpoints also appear when the page zooms.
   */

  // Toggle dropdowns on mobile with the mobile toggle button
  $('.isu-dropdown-toggle_mobile').click(function() {
    var dropdownMenu = $(this).closest('.isu-dropdown');

    if (dropdownMenu.attr('aria-expanded') === 'true') {
      $(dropdownMenu).attr('aria-expanded', 'false');
    } else {
      $(dropdownMenu).attr('aria-expanded', 'true');
    }
  });
  
});

})(jQuery, Drupal);

