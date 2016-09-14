var fm = require('./fm');
var throttle = require('./throttle');
var features = require('./detectFeatures')();
var _ = require('lodash');

var rights = [{
		'slug': 'copy',
		'desc': 'make a copy of the book for yourself',
		'study_pct': 9
	}, {
		'slug': 'resell',
		'desc': 'resell the book',
		'study_pct': 12
	}, {
		'slug': 'will',
		'desc': 'leave the book to your children in your will',
		'study_pct': 26
	}, {
		'slug': 'gift',
		'desc': 'give the book away as a gift',
		'study_pct': 38
	}, {
		'slug': 'lend',
		'desc': 'lend the book to a friend',
		'study_pct': 48
	}, {
		'slug': 'device',
		'desc': 'transfer the book to any device you own',
		'study_pct': 81
	}, {
		'slug': 'keep',
		'desc': 'keep the book indefinately',
		'study_pct': 87
	}, {
		'slug': 'own',
		'study_pct': 86
	},
];

var $no_rights = null;
var $yes_rights = null;
var $example_right = null;
var $no_own = null;
var $yes_own = null;
var $rights = null;

function init () {
	$no_rights = $('#no-rights');
	$yes_rights = $('#yes-rights');
	$example_right = $('#example-right');
	$no_own = $('#no-own');
	$yes_own = $('#yes-own');
	$rights = $('.rights');

	$('.rights input[type="checkbox"]').on('click', onCheckClick);
	$('button.score').on('click', onScoreButtonClick);
}

function onCheckClick() {
	var $this = $(this);
	var slug = $this.parent().parent().attr('id');

	if ($this.parent().hasClass('yes')) {
		var $other = $('.rights #' + slug + ' .no input');
	} else {
		var $other = $('.rights #' + slug + ' .yes input');
	}

	$other.attr('checked', false);
}

function onScoreButtonClick() {
	if ($('.check input:checked').length < rights.length) {
		alert('Please check Yes or No for each prompt.');
		return;
	}

	$('button.score').hide();
	$('.rights input').attr('disabled', 'disabled');
	$('.rights td.check input:checked').addClass('highlight');

	var count = $('.yes input:checked').length;
	var ownChecked = $('.rights #own .yes input').is(':checked');

	_.each(rights, function(right) {
		$('.rights #' + right.slug + ' .response .fill').width(right.study_pct + '%');
		$('.rights #' + right.slug + ' .response .pct').text(right.study_pct + '%');
	});

	if (count == 0) {
		$no_rights.show();
		$no_own.show();
	} else if (count == 1) {
		if (ownChecked) {
			$no_rights.show();
			$yes_own.show();
		} else {
			var el = $('.rights .yes input:checked').first();
			var slug = el.parent().parent().attr('id');
			var example_right = _.find(rights, { 'slug': slug })

			$example_right.html($example_right.html().replace('%%DESC%%', example_right.desc));

			$example_right.show();
			$no_own.show();
		}
	} else {
		var el = $('.rights .yes input:checked').first();
		var slug = el.parent().parent().attr('id');
		var example_right = _.find(rights, { 'slug': slug })

		$example_right.html($example_right.html().replace('%%DESC%%', example_right.desc));

		if (ownChecked) {
			$example_right.show();
			$yes_own.show();
		} else {
			$example_right.show();
			$no_own.show();
		}
	}

	$('table.rights .response').show();
	$('.your-results').show();
	fm.resize();
}

$(document).ready(function () {
	// adjust iframe for loaded content
	fm.resize()
	init();
});
