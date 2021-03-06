/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function (maxentries, opts) {
    opts = jQuery.extend({
        items_per_page: 10,
        num_display_entries: 10,
        current_page: 0,
        num_edge_entries: 0,
        link_to: "#",
        first_text: "First",
        prev_text: "Prev",
        next_text: "Next",
        last_text: "Last",
        jump_text: "Jump",
        isSum: true,
        isJump: true,
        jump_format_text: "The number format error",
        jump_outofrange_text: "The number is out of range",
        jump_null_text: "The number is not allow null",
        ellipse_text: "...",
        first_show_always: true,
        prev_show_always: true,
        next_show_always: true,
        last_show_always: true,
        callback: function () { return true; }
    }, opts || {});

    return this.each(function () {
        /**
        * Calculate the maximum number of pages
        */
        function numPages() {
            return Math.ceil(maxentries / opts.items_per_page);
        }

        /**
        * Calculate start and end point of pagination links depending on 
        * current_page and num_display_entries.
        * @return {Array}
        */
        function getInterval() {
            var ne_half = Math.ceil(opts.num_display_entries / 2);
            var np = numPages();
            var upper_limit = np - opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
            return [start, end];
        }

        /**
        * This is the event handling function for the pagination links. 
        * @param {int} page_id The new page number
        */
        function pageSelected(page_id, evt) {
            current_page = page_id;
            drawLinks();
            var continuePropagation = opts.callback(page_id, panel);
            if (!continuePropagation) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                else {
                    evt.cancelBubble = true;
                }
            }
            return continuePropagation;
        }

        /**
        * This function inserts the pagination links into the container element
        */
        function drawLinks() {
            panel.empty();
            var interval = getInterval();
            var np = numPages();
            // This helper function returns a handler function that calls pageSelected with the right page_id
            var getClickHandler = function (page_id) {
                return function (evt) { return pageSelected(page_id, evt); }
            }
            // Helper function for generating a single link (or a span tag if it's the current page)
            var appendItem = function (page_id, appendopts) {
                page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
                appendopts = jQuery.extend({ text: page_id + 1, classes: "" }, appendopts || {});
                if (page_id == current_page) {
                    var lnk = jQuery("<span class='current'>" + (appendopts.text) + "</span>");
                }
                else {
                    var lnk = jQuery("<a>" + (appendopts.text) + "</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.link_to.replace(/__id__/, page_id));
                }
                //alert(page_id);
                if (appendopts.classes) { lnk.addClass(appendopts.classes); }
                panel.find("[id='pagerrigt']").append(lnk);
            }
            // sum total
            if (opts.isSum) {
                panel.append("<div id='pagerleft'><span style='margin-right:10px;'>共<span class='hot'>" + maxentries + "</span>条记录</span>第<span class='hot'>" + (current_page + 1) + "</span>/<span>" + numPages() + "</span>页</div><div id='pagerrigt'>");
            }
           
            // Generate "First"-Link
            if (opts.first_text
					&& (current_page > 0 || opts.first_show_always)) {

                appendItem(0, { text: opts.first_text, classes: "prev" });
            }
            // Generate "Previous"-Link
            if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, { text: opts.prev_text, classes: "prev" });
            }
            // Generate starting points
            if (interval[0] > 0 && opts.num_edge_entries > 0) {
                var end = Math.min(opts.num_edge_entries, interval[0]);
                for (var i = 0; i < end; i++) {
                    appendItem(i);
                }
                if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
            }
            // Generate interval links
            for (var i = interval[0]; i < interval[1]; i++) {
                appendItem(i);
            }
            // Generate ending points
            if (interval[1] < np && opts.num_edge_entries > 0) {
                if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
                var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                for (var i = begin; i < np; i++) {
                    appendItem(i);
                }
            }


            // Generate "Next"-Link
            if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
                appendItem(current_page + 1, { text: opts.next_text, classes: "next" });
            }
            // Generate "Last"-Link
            if (opts.last_text
					&& (current_page < np - 1 || opts.last_show_always)) {
                appendItem(np, { text: opts.last_text, classes: "next" });
            }
            //跳转
            if (opts.isJump) {
                // Generate Jump Input
                panel.find("[id='pagerrigt']").append(jQuery(" <span class=\"tz\">转至<input type='text'  style='text-align:center;' id='jump-index' title='请输入正整数' size='1' value='' />页</span>"));
                //				panel.append(jQuery("<b>/"+numPages()+"  </b>"));

                // Generate Jump Handler
                var index = null;
                var jump = jQuery("<a class='go'>" + opts.jump_text + "</a>").bind("click", function (evt) {
                    var jumpinput = jQuery("#jump-index");
                    index = jumpinput.val();
                    if (index == null || index == "") {
                        alert(opts.jump_null_text);
                        return;
                    }
                    if (/^\d+$/.test(index)) {
                        if (index > numPages() || index < 1) {
                            alert(opts.jump_outofrange_text);
                            jumpinput.val("");
                            return;
                        }
                        index -= 1;
                        return pageSelected(index, evt);
                    } else {
                        alert(opts.jump_format_text);
                        jumpinput.val("");
                        return;
                    }
                }).attr("href", opts.link_to.replace(/__id__/, index));
                panel.find("[id='pagerrigt']").append(jump);
               
                $('#jump-index').bind('keyup', function (event) {
                    if (event.keyCode == "13") {
                        var jumpinput = jQuery("#jump-index");
                        index = jumpinput.val();
                        if (index == null || index == "") {
                            alert(opts.jump_null_text);
                            return;
                        }
                        if (/^\d+$/.test(index)) {
                            if (index > numPages() || index < 1) {
                                alert(opts.jump_outofrange_text);
                                jumpinput.val("");
                                return;
                            }
                            index -= 1;

                            return pageSelected(index, event);
                        } else {

                            alert(opts.jump_format_text);
                            jumpinput.val("");
                            return;
                        }
                        // appendItem(index);

                    }

                });
            }
        }

        // Extract current_page from options
        var current_page = opts.current_page;
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        // Store DOM element for easy access from all inner functions
        var panel = jQuery(this);
        // Attach control functions to the DOM element 
        this.selectPage = function (page_id) { pageSelected(page_id); }
        this.prevPage = function () {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.nextPage = function () {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        }
        // When all initialisation is done, draw the links
        drawLinks();
        // call callback function
       // opts.callback(current_page, this);
    });
}