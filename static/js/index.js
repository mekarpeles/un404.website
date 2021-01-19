var requests, Wayback, count=0;
var wordsArray = [
    "Bring a missing website back to life",
    "Curious how your favorite website used to look?",
    "Prove exactly what a website used to say",
    "See how a website changes over time",
    "Explore the rich history of any website",
    "Save an important website before it changes"
];

    /* 
       Pads timestamp w/ 0's to make it 14 digits long
       and removes dashes to enable human readable dates
       like 2021-01 or 2020-01-01
     */
var normalizeTimestamp = function(ts) {
    console.log(ts);
    ts = ts.replace(/-/g, "");
    while (ts.length < 14) {
	ts += '0';
    }
    return ts;
}

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    var pad = (n, z = 2) => ('00' + n).slice(-z);
    return pad(s/3.6e6|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0) + '.' + pad(s%1000, 3);
}

function humanReadableTimestamp(ts) {
    var y = ts.slice(0, 4);
    var m = ts.slice(4, 6);
    var d = ts.slice(6, 8);
    var ms = ts.slice(8);
    var hts = y;
    if (m !== '00') {
	hts += '-' + m;
	if (d !== '00') {
	    hts += '-' + d;
	    if (ms !== '00000000') {
		hts += ' at ' + msToTime(ms);
	    }
	}
    }
    return hts;
}



(function () {
    'use strict';

    // rotating tagline
    setInterval(function () {
	count++;
	$(".tagline").fadeOut(600, function () {
	    $(this).text(wordsArray[count % wordsArray.length]).fadeIn(600);
	});
    }, 5000);

    $.support.cors = true

    requests = {
	get: function(url, callback) {
	    $.get(url, function(results) {
	    }).done(function(data) {
		if (callback) { callback(data); }
	    });
	},

	post: function(url, data, callback) {
	    $.post(url, data, function(results) {
	    }).done(function(data) {
		if (callback) { callback(data); }
	    });
	},

	put: function(url, data, callback) {
	    $.put(url, data, function(results) {
	    }).done(function(data) {
		if (callback) { callback(data); }
	    });
	},
    };

    Wayback = {
	search: function(url, timestamp, callback) {
	    var wburl = 'https://api.archivelab.org/wayback/availability';
	    wburl += '?timestamp=' + timestamp + '&url=' + url;
	    requests.get(wburl, function(response) {
		callback(response.archived_snapshots);
	    });
	},
    };

    var urlparse = {
	parameters: function(key) {
	    var query = window.location.search.substring(1);
	    var params = query.split("&");
	    if (key) {
		for (var i=0;i<params.length;i++) {
		    var item = params[i].split("=");
		    var val = item[1];
		    if(item[0] == key){return(val);}
		}
		return(undefined);
	    }
	    return(items);
	}
    };

    var modes = {
	'newest': 1,
	'oldest': 2,
	'all': 4,
	'save': 5
    }

    var lmwbtfy = urlparse.parameters('lmwbtfy');
    var mode = urlparse.parameters('m');
    var ts = urlparse.parameters('date');

    if (mode && modes[mode]) {
	$('select.options').val(modes[mode]);
    }

    if (ts) {
	ts = normalizeTimestamp(ts);
	var hts = humanReadableTimestamp(ts);
	$('select.options').append($('<option>', {
	    value: 3,
	    text: 'Closest to ' + hts
	})).val(3);
    }

    if (lmwbtfy) {
	lmwbtfy = lmwbtfy.split('://')[lmwbtfy.split('://').length-1];
	(function writeToInput(i) {
	    setTimeout(function() {
		$('#url').focus().val(
		    $('#url').val() + lmwbtfy.charAt(lmwbtfy.length - i)
		);
		if (--i) writeToInput(i);   //  decrement i and call myLoop again if i > 0
		else {
		    $('.submit').toggleClass('submit-hover');
		    $('#wayback').submit();
		}
	    }, 250)
	})(lmwbtfy.length);
    }

    var debounce = function (func, threshold, execAsap) {
	var timeout;
	return function debounced () {
	    var obj = this, args = arguments;
	    function delayed () {
		if (!execAsap)
		    func.apply(obj, args);
		timeout = null;
	    };

	    if (timeout) {
		clearTimeout(timeout);
	    } else if (execAsap) {
		func.apply(obj, args);
	    }
	    timeout = setTimeout(delayed, threshold || 100);
	};
    };

    $(document).submit(function(event) {
	event.stopPropagation();
	event.preventDefault();
	var url = $('#url').val();
	var opt = parseInt($('.options option:selected').val());
	if (opt === 4) {
	    window.location.href = "https://web.archive.org/*/" + url;
	} if (opt < 4) {
    	    var timestamp = ts ? ts : opt === 1 ? '' : '19950000000000';
	    Wayback.search(url, timestamp, function(result) {
		if (result.closest && result.closest.url) {
		    window.location.href = result.closest.url.replace(/^http:\/\//i, 'https://');
		}
	    });
	} else {
	    $('#wayback').submit();
	}
	return false;
    });

}());
