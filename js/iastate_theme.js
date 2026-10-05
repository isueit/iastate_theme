/**
 * @file
 * javascript for the ISU Theme.
 */

(function ($, Drupal) {
  $(document).ready(function() {

	// Toggle Menu Navbar and Site Links on Mobile
	$('#isu-menu-navbar_toggler').click(function() {
	  var $toggler  = $(this);
	  var $collapse = $('#isu-menu-navbar_collapse');
	  var $navbar   = $('.isu-menu-navbar');

	  if ($toggler.hasClass('isu-menu-navbar_toggler_open')) {
	    // Closing: animate out, then remove classes
	    $toggler.removeClass('isu-menu-navbar_toggler_open isu-ext-mobile-menu').attr('aria-expanded', 'false');
	    setPageInert(false);
	    $navbar.addClass('isu-menu-navbar--closing');
	    setTimeout(function() {
	      $navbar.removeClass('isu-menu-navbar--closing');
	      $collapse.removeClass('isu-menu-navbar_show');
	      $('#isu-sitelinks_collapse').removeClass('isu-sitelinks_show');
	    }, 220);
	  } else {
	    // Opening: add classes immediately, animation handled by CSS
	    $toggler.addClass('isu-menu-navbar_toggler_open isu-ext-mobile-menu').attr('aria-expanded', 'true');
	    setPageInert(true);
	    $collapse.addClass('isu-menu-navbar_show');
	    $('#isu-sitelinks_collapse').addClass('isu-sitelinks_show');
	  }
	});

	// While the full-screen mobile menu is open, keep keyboard and screen reader
	// users inside it by making the page content behind it inert.
	function setPageInert(inert) {
	  $('.isu-page-wrap').children('main, footer').prop('inert', inert);
	}
	// Toggle Search on Mobile
	$('#isu-search_toggler').click(function() {
	  $('#isu-search_toggler').toggleClass('isu-search_toggler_open');
	  $('#isu-search_collapse').toggleClass('isu-search_show');
	});

	// Mobile slide panel menu
	(function() {
		var $collapse = $('#isu-menu-navbar_collapse');
		var panelsBuilt = false;
		var $navPlaceholder = $();

		// Cloned markup would duplicate ids (breaking label/for and ARIA references),
		// so suffix them and update anything that points at them.
		function uniqueIds($clone) {
			$clone.find('[id]').addBack('[id]').each(function() {
				var oldId = this.id;
				var newId = oldId + '-mobile';
				this.id = newId;
				$clone.find('label[for="' + oldId + '"]').attr('for', newId);
				$clone.find('[aria-labelledby="' + oldId + '"]').attr('aria-labelledby', newId);
				$clone.find('[aria-describedby="' + oldId + '"]').attr('aria-describedby', newId);
				$clone.find('[aria-controls="' + oldId + '"]').attr('aria-controls', newId);
			});
		}

		function buildMobilePanels() {
			if (panelsBuilt) return;
			panelsBuilt = true;

			var $menubar = $collapse.find('ul.menubar');
			if (!$menubar.length) return;

			var $wrap = $('<div class="isu-mobile-panels"></div>');
			var $main = $('<div class="isu-mobile-panel isu-mobile-panel--main"></div>');
			// Move the menu block's own <nav> (keeps its label and keyboard handlers)
			// rather than wrapping the menu in a second navigation landmark.
			var $nav = $menubar.closest('nav');
			if ($nav.length) {
				// Remember where the nav lived so it can be put back on desktop
				$navPlaceholder = $('<span class="isu-mobile-nav-placeholder" hidden></span>').insertBefore($nav);
				$nav.detach();
			} else {
				$nav = $('<nav aria-label="Main navigation"></nav>');
				$menubar.detach().appendTo($nav);
			}
			$main.append($nav);
			$wrap.append($main);
			$collapse.prepend($wrap);

			// Append ISU quicklinks below the menu pills
			var $isuNav = $('.isu-navbar').clone();
			$isuNav.find('.isu-navbar_break').remove();
			uniqueIds($isuNav);
			var $quicklinks = $('<div class="isu-mobile-quicklinks"></div>');
			$quicklinks.append($isuNav);
			$main.append($quicklinks);

			// Append search + social icons below quicklinks
			var $headerExtras = $('<div class="isu-mobile-header-extras"></div>');

			var $searchClone = $('#isu-search_collapse').clone();
			$searchClone.removeAttr('id').addClass('isu-mobile-search');
			uniqueIds($searchClone);
			$headerExtras.append($searchClone);

			var knownDomains = [
				'facebook.com', 'twitter.com', 'x.com', 'instagram.com',
				'linkedin.com', 'youtube.com', 'pinterest.com', 'vimeo.com',
				'snapchat.com', 'libsyn.com', 'podcasts.google.com', 'podcasts.apple.com',
				'github.com', 'flickr.com', 'reddit.com', 'tumblr.com', 'medium.com',
				'twitch.tv', 'foundation.iastate.edu'
			];

			var $socialList = $('<ul class="site-footer__social isu-social-menu list-unstyled isu-mobile-social"></ul>');
			$('#list-items li a').each(function() {
				var href = $(this).attr('href') || '#';
				var label = $(this).attr('aria-label') || $(this).attr('title') || '';
				var known = false;
				for (var d = 0; d < knownDomains.length; d++) {
					if (href.indexOf(knownDomains[d]) > -1) { known = true; break; }
				}
				if (known) {
					$socialList.append('<li><a href="' + href + '" aria-label="' + label + '"></a></li>');
				}
			});

			if ($socialList.children().length) {
				var $socialWrap = $('<nav class="isu-mobile-social-wrap" aria-label="Social media links"></nav>');
				$socialWrap.append($socialList);
				$headerExtras.append($socialWrap);
			}

			$main.append($headerExtras);

			$main.find('ul.menubar > li.isu-dropdown').each(function() {
				var $li = $(this);
				var $toggle = $li.children('.isu-dropdown-toggle_wrapper').children('a.isu-dropdown-toggle');
				$li.data('subpanel', buildSubPanel($wrap, $li, $toggle));
			});
		}

		var panelCount = 0;

		// A dropdown's items sit directly in its menu, or inside column lists for
		// two-column dropdowns. The parent link is skipped: it becomes the heading.
		function menuItemsOf($li) {
			var $menu = $li.children('.isu-dropdown-menu');
			return $menu.children('li.isu-dropdown-item')
				.add($menu.children('li.isu-dropdown-col').children('ul').children('li.isu-dropdown-item'))
				.not('.isu-dropdown-parent-item');
		}

		// Build the sub-panel for one top-level dropdown. $opener is the control
		// that opens it; returns the panel id.
		function buildSubPanel($wrap, $li, $opener) {
			var id    = 'isu-mp-' + (panelCount++);
			var label = $opener.text().trim();
			var href  = $opener.attr('href');

			$opener.attr('aria-controls', id);

			var $sub = $('<div class="isu-mobile-panel isu-mobile-panel--sub"></div>').attr('id', id);
			$sub.append('<button class="isu-mobile-back" type="button"><span class="isu-mobile-back__icon" aria-hidden="true">&lt;</span><span class="isu-mobile-back__label">Back</span><span class="sr-only"> to top level of menu</span></button>');

			// Heading links to the section page when there is one
			var $heading = (href && href !== '#')
				? $('<a class="isu-mobile-parent-heading"></a>').attr('href', href).text(label).append('<span class="arrow" aria-hidden="true"></span>')
				: $('<span class="isu-mobile-parent-heading"></span>').text(label);
			$sub.append($heading);

			var $subnav = $('<nav></nav>').attr('aria-label', label + ' sub-navigation');
			var $list = $('<ul class="isu-mobile-subitems"></ul>');
			buildSubItems($li, $list);
			$subnav.append($list);
			$sub.append($subnav);
			$wrap.append($sub);

			return id;
		}

		// Fill $list with the items of a dropdown. Items with their own children
		// get a toggle that expands their items inline (same as the desktop menu).
		function buildSubItems($li, $list) {
			menuItemsOf($li).each(function() {
				var $item = $(this);
				if ($item.hasClass('isu-dropdown')) {
					var $childToggle = $item.children('.isu-dropdown-toggle_wrapper').children('a.isu-dropdown-toggle');
					var nestedId = 'isu-mp-' + (panelCount++);
					var $toggle = $('<a class="isu-mobile-subtoggle" role="button" aria-expanded="false"></a>')
						.attr('href', $childToggle.attr('href') || '#')
						.attr('aria-controls', nestedId)
						.text($childToggle.text().trim());
					var $nested = $('<ul class="isu-mobile-subitems isu-mobile-subitems--nested" hidden></ul>').attr('id', nestedId);
					buildSubItems($item, $nested);
					$list.append($('<li></li>').append($toggle, $nested));
				} else {
					var $itemLink = $item.children('a').first();
					$list.append($('<li></li>').append(
						$('<a></a>').attr('href', $itemLink.attr('href') || '#')
							.text($itemLink.text().trim())
							.append('<span class="arrow" aria-hidden="true"></span>')
					));
				}
			});
		}

		// Collapse every inline-expanded list inside $scope
		function collapseSubItems($scope) {
			$scope.find('.isu-mobile-subtoggle').attr('aria-expanded', 'false');
			$scope.find('.isu-mobile-subitems--nested').prop('hidden', true);
		}

		// Undo everything the mobile menu changed, so the desktop menu is restored
		// when the viewport grows past the breakpoint (no reload needed).
		function destroyMobilePanels() {
			var $toggler = $('#isu-menu-navbar_toggler');
			$toggler.removeClass('isu-menu-navbar_toggler_open isu-ext-mobile-menu').attr('aria-expanded', 'false');
			$('.isu-menu-navbar').removeClass('isu-menu-navbar--closing');
			$collapse.removeClass('isu-menu-navbar_show');
			$('#isu-sitelinks_collapse').removeClass('isu-sitelinks_show');
			setPageInert(false);

			if (!panelsBuilt) return;
			var $wrap = $collapse.find('.isu-mobile-panels');
			var $nav = $wrap.find('.isu-mobile-panel--main > nav').first();
			$nav.find('a.isu-dropdown-toggle').removeAttr('aria-controls').attr('aria-expanded', 'false');
			if ($navPlaceholder.length) {
				$navPlaceholder.replaceWith($nav.detach());
				$navPlaceholder = $();
			} else {
				// No original nav (fallback wrapper was created): put the menu list back
				$nav.find('ul.menubar').first().detach().prependTo($collapse);
			}
			$wrap.remove();
			panelsBuilt = false;
		}

		var desktopMQ = window.matchMedia('(min-width: 1200px)');
		var onBreakpointChange = function(mq) {
			if (mq.matches) {
				destroyMobilePanels();
			}
		};
		if (desktopMQ.addEventListener) {
			desktopMQ.addEventListener('change', onBreakpointChange);
		} else {
			desktopMQ.addListener(onBreakpointChange); // Safari < 14
		}

		$('#isu-menu-navbar_toggler').on('click.mobilePanels', function() {
			if ($(this).hasClass('isu-menu-navbar_toggler_open')) {
				buildMobilePanels();
			} else {
				setTimeout(function() {
					$collapse.find('.isu-mobile-panel--active').removeClass('isu-mobile-panel--active');
					$collapse.find('.isu-mobile-panels').removeClass('isu-mobile-panels--drilled');
					$collapse.find('.isu-mobile-panel--main a.isu-dropdown-toggle').attr('aria-expanded', 'false');
					collapseSubItems($collapse);
				}, 220);
			}
		});

		// Show the panel $opener controls (only one panel is visible at a time)
		function openSubPanel($panels, $opener) {
			var $sub = $panels.find('#' + $opener.attr('aria-controls'));
			if (!$sub.length) return;
			$panels.find('.isu-mobile-panel--active').removeClass('isu-mobile-panel--active');
			$panels.addClass('isu-mobile-panels--drilled');
			$sub.addClass('isu-mobile-panel--active');
			$opener.attr('aria-expanded', 'true');
			// The previous panel is now hidden, so move focus into the new one
			$sub.find('.isu-mobile-back').focus();
		}

		// Back to the main panel, returning focus to the item that opened the sub-panel
		function closeSubPanel($panels) {
			var $active = $panels.find('.isu-mobile-panel--active');
			if (!$active.length) return false;
			var $opener = $panels.find('a.isu-dropdown-toggle[aria-controls="' + $active.attr('id') + '"]');
			collapseSubItems($active);
			$active.removeClass('isu-mobile-panel--active');
			$panels.removeClass('isu-mobile-panels--drilled');
			$opener.attr('aria-expanded', 'false').focus();
			return true;
		}

		$(document).on('click.mobilePanels', '.isu-mobile-panel--main .isu-dropdown-toggle_wrapper', function(e) {
			if (window.innerWidth >= 1200) return;
			e.preventDefault();
			e.stopPropagation();
			openSubPanel($(this).closest('.isu-mobile-panels'), $(this).children('a.isu-dropdown-toggle'));
		});

		// Expand/collapse a third level (or deeper) inline
		$(document).on('click.mobilePanels', '.isu-mobile-subtoggle', function(e) {
			e.preventDefault();
			var $toggle = $(this);
			var expand = $toggle.attr('aria-expanded') !== 'true';
			var $nested = $('#' + $toggle.attr('aria-controls'));
			if (!expand) {
				collapseSubItems($nested);
			}
			$toggle.attr('aria-expanded', expand ? 'true' : 'false');
			$nested.prop('hidden', !expand);
		});

		// Sub-toggles have role="button", so Space must activate them like Enter
		$(document).on('keydown.mobilePanels', '.isu-mobile-subtoggle', function(e) {
			if (e.keyCode === 32) {
				e.preventDefault();
				this.click();
			}
		});

		$(document).on('click.mobilePanels', '.isu-mobile-back', function() {
			closeSubPanel($(this).closest('.isu-mobile-panels'));
		});

		// Escape: close an open sub-panel first, otherwise close the mobile menu
		$(document).on('keydown.mobilePanels', function(e) {
			if (e.keyCode !== 27 || window.innerWidth >= 1200) return;
			var $toggler = $('#isu-menu-navbar_toggler');
			if (!$toggler.hasClass('isu-menu-navbar_toggler_open')) return;
			if (!closeSubPanel($collapse.find('.isu-mobile-panels'))) {
				$toggler.trigger('click').focus();
			}
		});
	})();

	// Social Media Dropdown
	$('#dropdownMenuButton').click(function() {
		if (!$('#list-items').is(':visible')) {
			$('#list-items').show();
		}
		else {
			$('#list-items').hide();
		}
	});

	$(document).on('click', function(e) {
		if (!$(e.target).closest('#block-socialmediared').length) {
			$('#list-items').hide();
		}
	});

	// Card modal (view-driven card + modal pairs).
	// Each card has a trigger button carrying data-isueo-card-modal-target ->
	// the id of its .isueo-card-modal__overlay. Handlers are delegated on
	// document so AJAX-pager rows are covered too.
	var isueoCardModalTrigger = null;
	var isueoCardModalScrollY = 0;

	function isueoCardModalLockScroll() {
		if (document.body.classList.contains('isueo-card-modal-scroll-lock')) { return; }
		isueoCardModalScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
		var sbw = window.innerWidth - document.documentElement.clientWidth;
		if (sbw > 0) { document.body.style.paddingRight = sbw + 'px'; }
		document.body.style.top = (-isueoCardModalScrollY) + 'px';
		document.body.classList.add('isueo-card-modal-scroll-lock');
	}

	function isueoCardModalUnlockScroll() {
		if (!document.body.classList.contains('isueo-card-modal-scroll-lock')) { return; }
		document.body.classList.remove('isueo-card-modal-scroll-lock');
		document.body.style.top = '';
		document.body.style.paddingRight = '';
		window.scrollTo(0, isueoCardModalScrollY);
	}

	function isueoCardModalFocusables(container) {
		return Array.prototype.filter.call(
			container.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			),
			function (el) {
				return el.offsetWidth || el.offsetHeight || el.getClientRects().length;
			}
		);
	}

	function isueoCardModalOpen(modal, trigger) {
		var current = document.querySelector('.isueo-card-modal__overlay--open');
		if (current && current !== modal) { isueoCardModalClose(current); }

		isueoCardModalTrigger = trigger || null;

		// Portal to <body> so the rest of the page can be made inert.
		if (modal.parentNode !== document.body) { document.body.appendChild(modal); }
		Array.prototype.forEach.call(document.body.children, function (el) {
			if (el !== modal && !el.hasAttribute('inert')) {
				el.setAttribute('inert', '');
				el.setAttribute('data-isueo-card-modal-inerted', '');
			}
		});

		isueoCardModalLockScroll();
		modal.classList.add('isueo-card-modal__overlay--open');

		var dialog = modal.querySelector('.isueo-card-modal__dialog') || modal;
		dialog.focus();
	}

	function isueoCardModalClose(modal) {
		modal.classList.remove('isueo-card-modal__overlay--open');
		isueoCardModalUnlockScroll();

		Array.prototype.forEach.call(
			document.querySelectorAll('[data-isueo-card-modal-inerted]'),
			function (el) {
				el.removeAttribute('inert');
				el.removeAttribute('data-isueo-card-modal-inerted');
			}
		);

		if (isueoCardModalTrigger && document.body.contains(isueoCardModalTrigger)) {
			isueoCardModalTrigger.focus();
		}
		isueoCardModalTrigger = null;
	}

	$(document).on('click', '[data-isueo-card-modal-trigger]', function() {
		var modal = document.getElementById($(this).data('isueo-card-modal-target'));
		if (modal) { isueoCardModalOpen(modal, this); }
	});

	$(document).on('click', '[data-isueo-card-modal-close]', function() {
		var modal = $(this).closest('.isueo-card-modal__overlay')[0];
		if (modal) { isueoCardModalClose(modal); }
	});

	$(document).on('click', '.isueo-card-modal__overlay', function(e) {
		if (e.target === this) { isueoCardModalClose(this); }
	});

	$(document).on('keydown', function(e) {
		if (e.key !== 'Escape') { return; }
		var open = document.querySelector('.isueo-card-modal__overlay--open');
		if (open) { isueoCardModalClose(open); }
	});

	// Keep Tab focus inside the open dialog.
	$(document).on('keydown', '.isueo-card-modal__overlay--open', function(e) {
		if (e.key !== 'Tab') { return; }
		var focusable = isueoCardModalFocusables(this);
		var dialog = this.querySelector('.isueo-card-modal__dialog') || this;
		if (!focusable.length) { e.preventDefault(); dialog.focus(); return; }
		var first = focusable[0];
		var last = focusable[focusable.length - 1];
		var active = document.activeElement;
		if (e.shiftKey && (active === first || active === dialog)) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && active === last) {
			e.preventDefault();
			first.focus();
		}
	});

  });

})(jQuery, Drupal);

/**
 * Fix issue: anchor_link modal cannot grab focus when using layout_builder.
 *
 * @see https://www.drupal.org/project/drupal/issues/3065095#comment-13311079
 */
(function ($, Drupal) {
  let orig_allowInteraction = $.ui.dialog.prototype._allowInteraction;

  $.ui.dialog.prototype._allowInteraction = function (event) {
    if ($(event.target).closest('.cke_dialog').length) {
      return true;
    }

    return orig_allowInteraction.apply(this, arguments);
  };

})(jQuery, Drupal);

