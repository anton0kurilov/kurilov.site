$(pomodoro());

function pomodoro() {
	var timer,
		breakTime = false;
	initSettings();
	assign($("#settings"), showSettings);
	assign($("#apply"), applySettings);
	assign($("#reset"), setTimer);
	assign($("#start"), startTimer);
	assign($("#pause"), pauseTimer);

	(function notify() {
		if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {});
		}
	})();

	function assign(selector, fn) {
		selector.click(function (e) {
			e.preventDefault();
			fn();
		});
	}

	function showSettings() {
		pauseTimer();
		$("#duration").val(localStorage.rrrrDuration);
		$("#break").val(localStorage.rrrrBreak);
		$(".settings-wrapper").css("display", "flex");
		$(".wrapper").addClass("is-blured");
	}

	function applySettings() {
		var dur = Math.abs($("#duration").val()),
			br = Math.abs($("#break").val());
		if (!isNumber(dur) || !isNumber(br)) {
			$("#message").show();
			return false;
		}
		localStorage.rrrrDuration = parseInt(dur);
		localStorage.rrrrBreak = parseInt(br);
		$(".settings-wrapper").css("display", "none");
		$(".wrapper").removeClass("is-blured");
		setTimer();
		$("#message").hide();
	}

	function initSettings() {
		localStorage.rrrrDuration = localStorage.rrrrDuration || 25;
		localStorage.rrrrBreak = localStorage.rrrrBreak || 5;
		setTimer();
	}

	function setTimer() {
		$(".timer").removeClass("active-break");
		pauseTimer();
		$("#time-min").text(localStorage.rrrrDuration);
		$("#time-sec").text("00");
	}

	function isNumber(obj) {
		return !isNaN(parseInt(obj));
	}

	function startTimer() {
		var currentSec = parseInt($("#time-sec").text());
		var currentMin = parseInt($("#time-min").text());
		var notification = new Notification("Tracking started!");

		clearInterval(timer);
		timer = setInterval(decSec, 1000);

		function decSec() {
			if (currentSec === 0) {
				currentSec = 59;
				currentMin--;
			} else {
				currentSec--;
			}
			$("#time-sec").text(currentSec);
			if (10 > currentSec && currentSec >= 0) {
				$("#time-sec").text("0" + currentSec);
			}
			$("#time-min").text(currentMin);
			if (currentMin === 0 && currentSec === 0) {
				pauseTimer();
				startBreak();
			}
		}
	}

	function pauseTimer() {
		if (typeof timer !== "undefined") {
			clearInterval(timer);
		}
	}

	function startBreak() {
		$(".timer").addClass("active-break");
		$("#time-min").text(localStorage.rrrrBreak);
		var currentSec = parseInt($("#time-sec").text());
		var currentMin = parseInt($("#time-min").text());
		var notification = new Notification("Take a rest");
		timer = setInterval(decSec, 1000);

		function decSec() {
			if (currentSec === 0) {
				currentSec = 59;
				currentMin--;
			} else {
				currentSec--;
			}
			$("#time-sec").text(currentSec);
			if (10 > currentSec && currentSec >= 0) {
				$("#time-sec").text("0" + currentSec);
			}
			$("#time-min").text(currentMin);
			if (currentMin === 0 && currentSec === 0) {
				pauseTimer();
				$(".timer").removeClass("active-break");
				setTimer();
				var notification = new Notification("Break finished. Press start to begin another pomodoro");
			}
		}

	}
}
