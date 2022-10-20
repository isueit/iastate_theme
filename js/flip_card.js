/**
 * @file
 * javascript for flip cards that allows card to flip when button is clicked
 */

var button = document.getElementById('flip-card_button');

button.addEventListener('click', function() {
	if (!this.classList.contains('on')) {
		this.classList.remove('off');
		this.classList.add('on');
	} else {
		this.classList.remove('on');
		this.classList.add('off');
	}
});
