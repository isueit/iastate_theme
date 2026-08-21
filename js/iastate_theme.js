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
	    $toggler.removeClass('isu-menu-navbar_toggler_open isu-ext-mobile-menu');
	    $navbar.addClass('isu-menu-navbar--closing');
	    setTimeout(function() {
	      $navbar.removeClass('isu-menu-navbar--closing');
	      $collapse.removeClass('isu-menu-navbar_show');
	      $('#isu-sitelinks_collapse').removeClass('isu-sitelinks_show');
	    }, 220);
	  } else {
	    // Opening: add classes immediately, animation handled by CSS
	    $toggler.addClass('isu-menu-navbar_toggler_open isu-ext-mobile-menu');
	    $collapse.addClass('isu-menu-navbar_show');
	    $('#isu-sitelinks_collapse').addClass('isu-sitelinks_show');
	  }
	});

	// Toggle Search on Mobile
	$('#isu-search_toggler').click(function() {
	  $('#isu-search_toggler').toggleClass('isu-search_toggler_open');
	  $('#isu-search_collapse').toggleClass('isu-search_show');
	});

	// Mobile slide panel menu
	(function() {
		var $collapse = $('#isu-menu-navbar_collapse');
		var panelsBuilt = false;

		function buildMobilePanels() {
			if (panelsBuilt) return;
			panelsBuilt = true;

			var $menubar = $collapse.find('ul.menubar');
			if (!$menubar.length) return;

			var $wrap = $('<div class="isu-mobile-panels"></div>');
			var $main = $('<div class="isu-mobile-panel isu-mobile-panel--main"></div>');
			var $nav = $('<nav aria-label="Main navigation"></nav>');
			$menubar.detach().appendTo($nav);
			$main.append($nav);
			$wrap.append($main);
			$collapse.prepend($wrap);

			// Append ISU quicklinks below the menu pills
			var $isuNav = $('.isu-navbar').clone();
			$isuNav.find('.isu-navbar_break').remove();
			var $quicklinks = $('<div class="isu-mobile-quicklinks"></div>');
			$quicklinks.append($isuNav);
			$main.append($quicklinks);

			// Append search + social icons below quicklinks
			var $headerExtras = $('<div class="isu-mobile-header-extras"></div>');

			var $searchClone = $('#isu-search_collapse').clone();
			$searchClone.removeAttr('id').addClass('isu-mobile-search');
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

			$main.find('li.isu-dropdown').each(function(i) {
				var $li   = $(this);
				var $a    = $li.find('> .isu-dropdown-toggle_wrapper > a.isu-dropdown-toggle');
				var label = $a.text().trim();
				var href  = $a.attr('href') || '#';
				var id    = 'isu-mp-' + i;

				$li.data('subpanel', id);

				var $sub = $('<div class="isu-mobile-panel isu-mobile-panel--sub" id="' + id + '"></div>');
				$sub.append('<button class="isu-mobile-back" type="button"><span class="isu-mobile-back__icon" aria-hidden="true">&lt;</span><span class="isu-mobile-back__label">Back</span><span class="sr-only"> to top level of menu</span></button>');
				$sub.append('<a class="isu-mobile-parent-heading" href="' + href + '">' + label + '<span class="arrow" aria-hidden="true"></span></a>');

				var $subnav = $('<nav aria-label="' + label + ' sub-navigation"></nav>');
				var $list = $('<ul class="isu-mobile-subitems"></ul>');
				$li.find('> .isu-dropdown-menu > li.isu-dropdown-item').each(function() {
					var $subA = $(this).find('a').first();
					$list.append('<li><a href="' + ($subA.attr('href') || '#') + '">' + $subA.text().trim() + '<span class="arrow" aria-hidden="true"></span></a></li>');
				});
				$subnav.append($list);
				$sub.append($subnav);
				$wrap.append($sub);
			});
		}

		$('#isu-menu-navbar_toggler').on('click.mobilePanels', function() {
			if ($(this).hasClass('isu-menu-navbar_toggler_open')) {
				buildMobilePanels();
			} else {
				setTimeout(function() {
					$collapse.find('.isu-mobile-panel--active').removeClass('isu-mobile-panel--active');
					$collapse.find('.isu-mobile-panels').removeClass('isu-mobile-panels--drilled');
				}, 220);
			}
		});

		$(document).on('click.mobilePanels', '.isu-mobile-panel--main .isu-dropdown-toggle_wrapper', function(e) {
			if ($(window).width() > 1199) return;
			e.preventDefault();
			e.stopPropagation();
			var id = $(this).closest('li').data('subpanel');
			if (!id) return;
			var $panels = $(this).closest('.isu-mobile-panels');
			$panels.addClass('isu-mobile-panels--drilled');
			$panels.find('#' + id).addClass('isu-mobile-panel--active');
		});

		$(document).on('click.mobilePanels', '.isu-mobile-back', function() {
			var $panels = $(this).closest('.isu-mobile-panels');
			$panels.find('.isu-mobile-panel--active').removeClass('isu-mobile-panel--active');
			$panels.removeClass('isu-mobile-panels--drilled');
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
	// Delegated on document so this also covers rows added later by an
	// infinite-scroll pager.
	$(document).on('click', '[data-isueo-card-modal-trigger]', function() {
		var modal = document.getElementById($(this).data('isueo-card-modal-target'));
		if (!modal) return;
		$(modal).addClass('isueo-card-modal__overlay--open');
		$('body').css('overflow', 'hidden');
	});

	$(document).on('keydown', '[data-isueo-card-modal-trigger]', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			$(this).trigger('click');
		}
	});

	$(document).on('click', '[data-isueo-card-modal-close]', function() {
		$(this).closest('.isueo-card-modal__overlay').removeClass('isueo-card-modal__overlay--open');
		$('body').css('overflow', '');
	});

	$(document).on('click', '.isueo-card-modal__overlay', function(e) {
		if (e.target === this) {
			$(this).removeClass('isueo-card-modal__overlay--open');
			$('body').css('overflow', '');
		}
	});

	$(document).on('keydown', function(e) {
		if (e.key === 'Escape') {
			$('.isueo-card-modal__overlay--open').removeClass('isueo-card-modal__overlay--open');
			$('body').css('overflow', '');
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

