var fm = require('./fm');
var throttle = require('./throttle');
var features = require('./detectFeatures')();
var _ = require('lodash');

var NO_RIGHTS = "<p>You are correct.  The terms of service agreements (TOS) that govern digital media almost never convey any of the rights listed above.</p><p>In Perzanowski and Hoofnagle's study shoppers consistently, and dramatically, overestimated what rights they acquired to digital content they purchased online. The vast majority believed that they would be able to keep their ebook indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend.</p>";
var EXAMPLE_RIGHT = _.template("<p>The correct answer, in every case, is \"No\". However, like the vast majority of shoppers in the original survey, you answered that buying an ebook guarantees you at least some rights. For example, you said that you would be able to <%= desc %>. In reality, the terms of service agreements (TOS) that govern digital media almost never convey any of the rights listed above.</p><p>In Perzanowski and Hoofnagle's study shoppers consistently, and dramatically, overestimated what rights they acquired to digital content they purchased online. The vast majority of participants believed that they would be able to keep their ebook indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend.</p>");
var ALL_RIGHTS = "<p>The correct answer, in every case, is \"No\". You selected Yes for every statement, which is to say that you believe you have similar rights to an ebook that you would have to a physical copy. In reality, the terms of service agreements (TOS) that govern digital media almost never convey any of the rights listed above.</p><p>In Perzanowski and Hoofnagle's study shoppers consistently, and dramatically, overestimated what rights they acquired to digital content they purchased online. The vast majority of participants believed that they would be able to keep their ebook indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend.</p>";

var NO_OWN = '<p>You did not check the box indicating you would "own" the ebook, which makes you either unusually knowledgable or unusually cynical about this issue. In the study, 86% of respondents believed they owned an ebook they purchased online. This is an intuitive conclusion. When you pay for something, you expect to own it. However, it is also false. Most TOS explicitly state that content is "licensed, not sold" and thus remains the property of the seller.'
var YES_OWN = '<p>Like most survey respondents, you checked the box indicating that you would "own" the ebook. In the study, 86% of respondents agreed with you. This is an intuitive conclusion. When you buy something, you expect to own it. However, it is also false. Most TOS explicitly state that content is "licensed, not sold" and thus remains the property of the seller.'

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

var $explainer = null;
var $rights = null;

function init () {
	$explainer = $('div.explainer');
	$rights = $('.rights');

	$explainer.html(NO_RIGHTS + NO_OWN);

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
		$explainer.html(NO_RIGHTS + NO_OWN);
	} else if (count == 1) {
		if (ownChecked) {
			$explainer.html(NO_RIGHTS + YES_OWN);
		} else {
			var el = $('.rights .yes input:checked').first();
			var slug = el.parent().parent().attr('id');
			var example_right = _.find(rights, { 'slug': slug })
			$explainer.html(EXAMPLE_RIGHT(example_right) + NO_OWN);
		}
	} else {
		var el = $('.rights .yes input:checked').first();
		var slug = el.parent().parent().attr('id');
		var example_right = _.find(rights, { 'slug': slug })

		if (ownChecked) {
			$explainer.html(EXAMPLE_RIGHT(example_right) + YES_OWN);
		} else {
			$explainer.html(EXAMPLE_RIGHT(example_right) + NO_OWN);
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
