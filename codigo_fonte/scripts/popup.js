document.addEventListener("DOMContentLoaded", function() {
  var startButton = document.getElementById("startButton");
  var pauseButton = document.getElementById("pauseButton");
  var resumeButton = document.getElementById("resumeButton");
  var stopButton = document.getElementById("stopButton");
  var resizeButton = document.getElementById("resizeButton");
  var alertDiv = document.getElementById("alert");
  var alertSound = document.getElementById("alertSound");

  var timerId; // Variável para armazenar o ID do temporizador

  startButton.addEventListener("click", function() {
    browser.runtime.sendMessage({ type: "startTimer" });
    alertDiv.textContent = "Pomodoro iniciado!";
    playAlertSound(); // Reproduzir o som de alerta quando o botão "Iniciar" for pressionado
    startTimer();
  });

  pauseButton.addEventListener("click", function() {
    browser.runtime.sendMessage({ type: "pauseTimer" });
    clearTimeout(timerId); // Pausar o temporizador
  });

  resumeButton.addEventListener("click", function() {
    browser.runtime.sendMessage({ type: "resumeTimer" });
    startTimer(); // Retomar o temporizador
  });

  stopButton.addEventListener("click", function() {
    browser.runtime.sendMessage({ type: "stopTimer" });
    clearTimeout(timerId); // Parar o temporizador
    resetTimer();
  });

  resizeButton.addEventListener("click", function() {
    resizeWindow(400, 500);
  });

  // Função para iniciar o temporizador
function startTimer() {
  timerId = setInterval(function() {
    browser.runtime.sendMessage({ type: "tick" });
  }, 1000); // Alterado para 1000 para 1 segundo
}

  // Função para redefinir o cronômetro para 25:00
  function resetTimer() {
    var timer = document.getElementById("timer");
    timer.textContent = "25:00";
  }
});

browser.runtime.onMessage.addListener(function(message) {
  if (message.type === "updateTimer") {
    var timer = document.getElementById("timer");
    timer.textContent = formatTime(message.minutes) + ":" + formatTime(message.seconds);

    if (message.minutes === 0 && message.seconds === 0) {
      clearTimeout(timerId); // Parar o temporizador quando chegar a zero
      playAlertSound(); // Reproduzir o som de alerta quando o cronômetro chegar a zero
      showNotification("Pomodoro Concluído!"); // Exibir notificação quando o cronômetro chegar a zero
    }
  }
});

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

function resizeWindow(width, height) {
  browser.windows.getCurrent().then(function(window) {
    browser.windows.create({
      url: browser.extension.getURL("/código fonte/painel_html/popup.html"),
      type: "popup",
      width: width,
      height: height
    });
    browser.windows.remove(window.id);
  });
}

// Função para reproduzir o som de alerta
function playAlertSound() {
  alertSound.currentTime = 0; // Reiniciar o áudio do alerta
  alertSound.play();
}

// Função para exibir notificação
function showNotification(message) {
  browser.notifications.create({
    type: "basic",
    title: "Pomodoro Timer",
    message: message
  });
}
