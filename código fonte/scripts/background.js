let timerId;
let minutes;
let seconds;
let isPaused = false;

function playAlarm() {
  let alarm = new Audio(browser.runtime.getURL("/código fonte/audios/alarme.mp3"));
  alarm.play();
  showNotification();
}

function startTimer() {
  minutes = 25;
  seconds = 0;
  isPaused = false;
  timerId = setInterval(countDown, 1000);
}

function countDown() {
  if (!isPaused) {
    seconds--;

    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }

    if (minutes === 0 && seconds === 0) {
      clearInterval(timerId);
      playAlarm();
    }

    browser.runtime.sendMessage({
      type: "updateTimer",
      minutes: minutes,
      seconds: seconds
    });
  }
}

function pauseTimer() {
  isPaused = true;
}

function resumeTimer() {
  isPaused = false;
}

function stopTimer() {
  clearInterval(timerId);
  minutes = 0;
  seconds = 0;
  browser.runtime.sendMessage({
    type: "updateTimer",
    minutes: minutes,
    seconds: seconds
  });
}

browser.runtime.onMessage.addListener(function(message) {
  if (message.type === "startTimer") {
    startTimer();
  } else if (message.type === "pauseTimer") {
    pauseTimer();
  } else if (message.type === "resumeTimer") {
    resumeTimer();
  } else if (message.type === "stopTimer") {
    stopTimer();
  }
});

function showNotification() {
  browser.notifications.create({
    type: "basic",
    iconUrl: browser.runtime.getURL("/código fonte/estilos/icon.png"),
    title: "Pomodoro Timer",
    message: "O cronômetro zerou!",
  });
}


