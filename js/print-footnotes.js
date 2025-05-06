(function() {
    var printFootnotesGenerated = false;

    function generatePrintFootnotes() {
      if (printFootnotesGenerated) return;
      printFootnotesGenerated = true;

      // Select only links inside the main content container.
      var links = document.querySelectorAll("main.isu-main a");
      var footnoteMap = {};
      var uniqueFootnotes = [];

      // Patterns to exclude by URL (optional).
      var excludePatterns = [
        "homepage",
        "/edit",
        "/delete",
        "/manage-display",
        "/layout",
        "/revisions"
      ];

      links.forEach(function(link) {
        // 1) Skip links in a nav item.
        if (link.closest("li.nav.item")) {
          return;
        }
        // 2) Skip links inside any slick slide that is NOT .slick-active
        if (link.closest(".slick-slide")) {
          return;
        }
        // Skip if it's "More News"
        if(link.closest(".ext-news-feed footer")){
          return;
        }
        //Skip if it's "More Events"
        if(link.closest(".events_show_more")){
          return;
        }
        // 4) Check the href attribute.
        var url = link.getAttribute("href");
        if (!url) return;

        // 5) Exclude specific URL patterns.
        if (excludePatterns.some(function(pattern) {
          return url.indexOf(pattern) !== -1;
        })) {
          return;
        }

        if (!/^https?:\/\//.test(url)) {
            // Adjust this domain as needed
            url = "https://www.extension.iastate.edu" + url;
          }


        // 6) Check if the link is visible in print.
        if (link.getClientRects().length === 0) return;

        // 7) Deduplicate URLs.
        if (!(url in footnoteMap)) {
          footnoteMap[url] = uniqueFootnotes.length + 1;
          uniqueFootnotes.push(url);
        }

        // Create a superscript marker for the footnote number.
        var num = footnoteMap[url];
        var sup = document.createElement("sup");
        sup.classList.add('sup-print');
        sup.textContent = "[" + num + "]";
        link.appendChild(sup);
      });

      // Build the footnotes container.
      var footnotesDiv = document.createElement("div");
      footnotesDiv.id = "print_footnotes";

      var header = document.createElement("h3");
      header.textContent = "Footnotes";
      footnotesDiv.appendChild(header);

      var list = document.createElement("ol");
      uniqueFootnotes.forEach(function(url) {
        var li = document.createElement("li");
        li.textContent = url;
        list.appendChild(li);
      });
      footnotesDiv.appendChild(list);

      // Insert the footnotes into the designated placeholder.
      var placeholder = document.getElementById("footnotes-placeholder");
      if (placeholder) {
        placeholder.appendChild(footnotesDiv);
      } else {
        document.body.appendChild(footnotesDiv);
      }
    }

    // Run the footnotes generation when printing.
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          generatePrintFootnotes();
        }
      });
    }
    window.onbeforeprint = generatePrintFootnotes;
  })();
