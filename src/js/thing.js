var fm = require('./fm');
var throttle = require('./throttle');
var features = require('./detectFeatures')();
var _ = require('lodash');

var NO_RIGHTS = "<p>You selected no rights, which is correct. Digital media that we purchase online typically do not allow you to do any of things described above. In Perzanowski and Hoofnagle's study the vast majority of participants believed that they would be able to keep the book indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend. None of these things are allowed under the majority of license agreements that we agree to when we download digital media.</p>";
var NO_OWN = '<p>You also do not believe that you own the content, which makes you unusually knowledgable (or unusually cynical) about this issue. In the study, 86% of respondents believed they owned an ebook they purchased online. This is an intuitive conclusion. When you pay for something, you expect to own it. However, it is also false. Most license agreements explicitly state that content is "licensed, not sold".'
var YES_OWN = '<p>Like most survey respondents, you believe that you own digital books that you buy online. In the study, 86% of respondents agreed with you. This is an intuitive conclusion. When you buy something, you expect to own it. However, it is also false. Most license agreements explicitly state that content is "licensed, not sold".'
var EXAMPLE_RIGHT = _.template("<p>Like the vast majority of respondents to the original survey, you believe that buying an ebook guarantees you some rights. For example, you agreed that you would be able to <%= desc %>. In Perzanowski and Hoofnagle's study <%= study_pct %>% of respondents agreed with you. However, this is not true. In fact, the digital media that we purchase online typically does not guarantee any of these rights.</p><p>In Perzanowski and Hoofnagle's study the vast majority of participants believed that they would be able to keep the book indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend. None of these things are allowed under the majority of license agreements that we agree to when we download digital media.");
var ALL_RIGHTS = "<p>In the survey above you selected every right. In fact, digital media that we purchase online usually does not guarantee any of these rights. In Perzanowski and Hoofnagle's study the vast majority of participants believed that they would be able to keep the book indefinantely and transfer it to any device they own. More than a third believed they would be able to lend it or gift it to a friend. None of these things are allowed under the majority of license agreements that we agree to when we download digital media.</p>";

var rights = [{
		'slug': 'resell',
		'desc': 'resell the book',
		'study_pct': 12
	}, {
		'slug': 'gift',
		'desc': 'give the book away as a gift',
		'study_pct': 38
	}, {
		'slug': 'keep',
		'desc': 'keep the book indefinately',
		'study_pct': 87
	}, {
		'slug': 'device',
		'desc': 'transfer the book to any device you own',
		'study_pct': 81
	}, {
		'slug': 'lend',
		'desc': 'lend the book to a friend',
		'study_pct': 48
	}, {
		'slug': 'will',
		'desc': 'leave the book to your children in your will',
		'study_pct': 26
	}, {
		'slug': 'copy',
		'desc': 'make a copy of the book for yourself',
		'study_pct': 9
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
		$('p.response').text('Please check Yes or No for each right.');
		return;
	}

	$('button.score').hide();
	$('p.response').text('Thanks! Keep reading to learn how you did.');
	$('.rights input').attr('disabled', 'disabled');

	var count = $('.yes input:checked').length;
	var ownChecked = $('.rights #own .yes input').is(':checked');

	_.each(rights, function(right) {
		$('.results #' + right.slug + ' .response .fill').width(right.study_pct + '%');
		$('.results #' + right.slug + ' .response .pct').text(right.study_pct + '%');

		if ($('.rights #' + right.slug + ' .yes input').is(':checked')) {
			$('.results #' + right.slug + ' .yes input').attr('checked', true);
		} else {
			$('.results #' + right.slug + ' .no input').attr('checked', true);
		}
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

	$('.your_results').show();
}

function setup () {
// setup the thing, insert DOM elements, bind data, etc

	//now that everything is setup, update
	update()
}

function update () {
// update the thing, position, size, and style DOM elemements

	// adjust iframe for dynamic content
	fm.resize()
}

function resize() {
// on resize, update save dimensional values and update.

	update()
	fm.resize()
}

var throttleRender = throttle(resize, 250);

$(document).ready(function () {
	// adjust iframe for loaded content
	fm.resize()
	$(window).resize(throttleRender);
	init();
	setup();
});
