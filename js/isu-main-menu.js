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

/**
 * Open or close dropdowns (disclosure pattern).
 *
 * State lives on the controls, and the CSS keys off the same attributes:
 * - a.isu-dropdown-toggle / button.isu-dropdown-toggle_mobile [aria-expanded]
 * - ul.isu-dropdown-menu [aria-hidden]
 */
function setDropdownState($dropdowns, expanded) {
  var state = expanded ? 'true' : 'false';
  // Closing a dropdown also closes any submenus nested inside it.
  if (!expanded) {
    $dropdowns = $dropdowns.find('.isu-dropdown').addBack();
  }
  $dropdowns.each(function() {
    var $dropdown = $(this);
    $dropdown.children('.isu-dropdown-toggle_wrapper').children('.isu-dropdown-toggle, .isu-dropdown-toggle_mobile').attr('aria-expanded', state);
    $dropdown.children('.isu-dropdown-menu').attr('aria-hidden', expanded ? 'false' : 'true');
    if (expanded) {
      keepInViewport($dropdown);
    }
  });
}

// Flip a top-level panel's alignment if its default offset would run past the viewport edge.
function keepInViewport($dropdown) {
  var $menu = $dropdown.children('.isu-dropdown-menu');
  $menu.removeClass('isu-dropdown-menu--align-right isu-dropdown-menu--align-left');
  if (window.innerWidth < 1200 || !$dropdown.parent().hasClass('menubar')) return;
  var gutter = 16;
  var viewportWidth = document.documentElement.clientWidth;
  var rect = $menu[0].getBoundingClientRect();
  if (rect.right > viewportWidth - gutter) {
    $menu.addClass('isu-dropdown-menu--align-right');
  } else if (rect.left < gutter) {
    $menu.addClass('isu-dropdown-menu--align-left');
  }
}

function isDropdownOpen($dropdown) {
  return $dropdown.children('.isu-dropdown-menu').attr('aria-hidden') === 'false';
}

function openDropdowns() {
  return $('.isu-dropdown-menu[aria-hidden="false"]').parent('.isu-dropdown');
}

$(document).ready(function() {

  // Navigate with right and left arrow keys.
  $('#block-iastate-theme-main-menu').on('keydown', function(event) {
    if (event.keyCode === 39) { // RIGHT arrow key
      event.preventDefault();
	  if ($(':focus').hasClass('sub')) {
		setDropdownState($(':focus').closest('.isu-dropdown'), true);
		$(':focus').parent('.isu-dropdown-toggle_wrapper').next('ul').find('li:first-of-type a').focus();
	  } else {
		$(':focus').closest('li').next('li').find('a').focus();
	  }
    } else if (event.keyCode === 37) { // LEFT arrow key
      event.preventDefault();
	  var $submenu = $(':focus').closest('.isu-dropdown-submenu');
	  if ($submenu.length) {
		// Inside a third-level menu: close it and return to its toggle
		var $subDropdown = $submenu.parent('.isu-dropdown');
		setDropdownState($subDropdown, false);
		$subDropdown.children('.isu-dropdown-toggle_wrapper').children('a.sub').focus();
	  } else {
	    $(':focus').closest('li').prev('li').find('a').focus();
	  }
    }
  });

  // Enter dropdowns with the down arrow
  $('.isu-dropdown-toggle').on('keydown', function(event) {
    var dropdownToggle = $(this);
      if (event.keyCode === 40 && window.innerWidth >= 1200) { // DOWN arrow key (desktop; mobile uses sub-panels)
        event.preventDefault();
		if (!($(':focus').is('a.isu-dropdown-toggle.sub'))) {
		  // Open menu
          setDropdownState(dropdownToggle.closest('.isu-dropdown'), true);
          // Change focus to the first link in the dropdown
          $(':focus').parent('.isu-dropdown-toggle_wrapper').next('ul').find('li:first-of-type a').focus();
		}
      }
  });

  // Navigate within a dropdown with the up and down arrow keys. Moves through
  // every visible link in the top-level panel, including open third-level menus;
  // UP from the first link closes the dropdown and returns to its toggle.
  $('.isu-dropdown-menu').on('keydown', function(event) {
    if (event.keyCode !== 40 && event.keyCode !== 38) return;
    event.preventDefault();
    event.stopPropagation();
    var $topDropdown = $(this).closest('.menubar > .isu-dropdown');
    var $links = $topDropdown.children('.isu-dropdown-menu').find('a').filter(':visible');
    var index = $links.index(document.activeElement);
    if (event.keyCode === 40) { // DOWN arrow key
      if (index < $links.length - 1) {
        $links.eq(index + 1).focus();
      }
    } else if (index > 0) { // UP arrow key
      $links.eq(index - 1).focus();
    } else {
      setDropdownState($topDropdown, false);
      $topDropdown.children('.isu-dropdown-toggle_wrapper').children('.isu-dropdown-toggle').focus();
    }
  });

  // Close dropdowns when focus leaves (keyboard users)
  $('.isu-dropdown-menu').on('focusout', function(e) {
    var dropdownMenu = $(this);
    setTimeout(function() {
      if (dropdownMenu.find(':focus').length === 0) {
        // If neither the dropdown nor its children have focus...
        if (dropdownMenu.prev('.isu-dropdown-toggle_wrapper').find(':focus').length === 0) {
          setDropdownState(dropdownMenu.parent('.isu-dropdown'), false);
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
    var isOpen = isDropdownOpen(dropdown);
    // Close other open dropdowns first (but keep this one's ancestors open)
    setDropdownState(openDropdowns().not(dropdown.parents('.isu-dropdown')), false);
    if (!isOpen) {
      setDropdownState(dropdown, true);
      // Move focus into the dropdown so keyboard and screen reader users land on its first link
      dropdown.children('.isu-dropdown-menu').find('a').first().focus();
    }
  });

  // Close open dropdowns when clicking outside the menu
  $(document).on('click', function(event) {
    if (window.innerWidth < 1200) return;
    if (!$(event.target).closest('.isu-dropdown').length) {
      setDropdownState(openDropdowns(), false);
    }
  });

  // Close desktop dropdowns when the viewport drops to the mobile menu
  var desktopMQ = window.matchMedia('(min-width: 1200px)');
  var onBreakpointChange = function(mq) {
    if (!mq.matches) {
      setDropdownState(openDropdowns(), false);
    }
  };
  if (desktopMQ.addEventListener) {
    desktopMQ.addEventListener('change', onBreakpointChange);
  } else {
    desktopMQ.addListener(onBreakpointChange); // Safari < 14
  }

  // Close open dropdowns with the Escape key, returning focus to the
  // top-level toggle if focus was inside the dropdown being closed.
  $(document).on('keydown', function(event) {
    if (event.keyCode === 27) { // Escape
      var $focusedDropdown = $(document.activeElement).closest('.menubar > .isu-dropdown');
      setDropdownState(openDropdowns(), false);
      if ($focusedDropdown.length) {
        $focusedDropdown.children('.isu-dropdown-toggle_wrapper').children('.isu-dropdown-toggle').focus();
      }
    }
  });

  // Toggle links have role="button", so Space must activate them like Enter.
  $(document).on('keydown', '.isu-dropdown-toggle', function(event) {
    if (event.keyCode === 32) { // Space
      event.preventDefault();
      this.click();
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

    if (isDropdownOpen(dropdownMenu)) {
      setDropdownState(dropdownMenu, false);
    } else {
      setDropdownState(dropdownMenu, true);
    }
  });
  
});

})(jQuery, Drupal);

