document.getElementById('loginForm').addEventListener('submit', function(event) {
	event.preventDefault();
	const username = document.getElementById('username').value;
	if (username === 'hod') {
		window.location.href = '/hod';
	} else {
		window.location.href = '/employee';
	}
});