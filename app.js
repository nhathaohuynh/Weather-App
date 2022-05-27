
const ID_API = "20d33346bea304cf3bf68516162897f9";
const DEFAULT_VALUE = "--";
const searchInput = document.querySelector("#search-input");
const $ = document.querySelector.bind(document);
const nameCity = $(".city-name");
const weatherState = $(".weather-sate");
const weatherImg = $(".weather-img");
const temperature = $(".temperature");
const huminity = $(".huminity");
const windSpeed = $(".wind-speed");
const sunset = $(".sunset");
const sunrise = $(".sunrise");
const container = $(".container");

searchInput.onchange = function (e) {
  const text = searchInput.value
  if (text.trim()) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${ID_API}&units=metric&lang=vi`)
      .then(async res => {
        searchInput.value = "";
        const data = await res.json();
        console.log(data);
        console.log(data.name);
        nameCity.textContent = data.name || DEFAULT_VALUE;
        temperature.textContent = (data.main.temp).toFixed(0) || DEFAULT_VALUE;
        weatherState.textContent = data.weather[0].description || DEFAULT_VALUE;
        weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        huminity.textContent = Math.floor(data.main.humidity) || DEFAULT_VALUE;
        windSpeed.textContent = (data.wind.speed).toFixed(1) || DEFAULT_VALUE;
        sunset.textContent = moment.unix(data.sys.sunset).format("H:mm") || DEFAULT_VALUE;
        sunrise.textContent = moment.unix(data.sys.sunrise).format("H:mm") || DEFAULT_VALUE;
        speak(data.main.temp.toFixed(0));
      })
      .catch(function () {
        nameCity.textContent = DEFAULT_VALUE;
        temperature.textContent = DEFAULT_VALUE;
        weatherState.textContent = DEFAULT_VALUE;
        weatherImg.src = `http://openweathermap.org/img/wn/04d@2x.png`
        huminity.textContent = DEFAULT_VALUE;
        windSpeed.textContent = DEFAULT_VALUE;
        sunset.textContent = DEFAULT_VALUE;
        sunrise.textContent = DEFAULT_VALUE;
      })
  }
  else {
    nameCity.textContent = DEFAULT_VALUE;
    temperature.textContent = DEFAULT_VALUE;
    weatherState.textContent = DEFAULT_VALUE;
    weatherImg.src = `http://openweathermap.org/img/wn/04d@2x.png`
    huminity.textContent = DEFAULT_VALUE;
    windSpeed.textContent = DEFAULT_VALUE;
    sunset.textContent = DEFAULT_VALUE;
    sunrise.textContent = DEFAULT_VALUE;
  }
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition(); //new SpeechRecognition()
var synth = window.speechSynthesis; // speechSynthesis
const microphone = $(".microphone");
recognition.lang = "vi-VI";
recognition.continuous = false; //continuous

microphone.onclick = function (e) {
  e.preventDefault();
  microphone.classList.add("recording")
  if (e.target.closest(".microphone-icon")) {
    recognition.start();
  }
}
function speak(text) {
  if (synth.speaking) {
    console.error("Busy. speaking");
    return
  }

  const utter = new SpeechSynthesisUtterance(text);

  utter.onend = () => {
    console.log("SpeechSynthesisUtterance.onend");
  }
  utter.onerror = (e) => {
    console.error("speechSynthesisutterance.onerror", e);
  }
  synth.speak(utter);
}

function handleVoice(text) {
  const handleText = text.toLowerCase();
  if (handleText.includes("thời tiết tại")) {
    const location = handleText.split("tại")[1].trim();
    renderWeather(location);
    return;
  }
  if (handleText.includes("thời tiết ở")) {
    const location = handleText.split("ở")[1].trim();
    renderWeather(location);
    return;
  }

  if (handleText.includes("con cu")) {
    // const location = handleText.split("ở")[1].trim();
    // renderWeather(location);
    speak("damned you");
    return;
  }

  if (handleText.includes("black")) {
    const bgColor = handleText;
    container.style = `background: ${bgColor}`;
    return;

  }

  if (handleText.includes("mặc định")) {
    container.style.backgroundColor = "";
    return;

  }

  if (handleText.includes("mấy giờ")) {
    const today = new Date();
    const textToSpeech = `${today.getHours()} Hours ${today.getMinutes()} Minutes `
    console.log(textToSpeech);
    speak(textToSpeech);
    return;
  }

  speak("try agian");

  function renderWeather(location) {
    searchInput.value = location;
    const chaneEvent = new Event("change");
    searchInput.dispatchEvent(chaneEvent);
  }
}

recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove("recording")
}

recognition.onerror = (err) => {
  console.log(err);
  microphone.classList.remove("recording")
}

recognition.onresult = (e) => {
  console.log("onresult", e);
  const text = e.results[0][0].transcript;
  handleVoice(text);
}

