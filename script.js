
const pogodaBtn = document.getElementById("submit-btn");
const addressInput = document.getElementById("address-input");
const errorSection = document.getElementById("error-section");
const curWeatherDiv = document.getElementById("current-weather");

const API_KEY = "112e9054a258f286a729d45f40ceb389";

class WeatherContainerGen {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'weather-box';

        this.weatherDiv = document.createElement('div');
        this.weatherDiv.className = 'weather-div';

        this.timeLabel = document.createElement('div');
        this.timeLabel.className = 'time-label';

        this.weatherImg = document.createElement('img');
        this.weatherImg.className = 'weather-icon';
        this.weatherImg.alt = 'weather icon';

        this.weatherDesc = document.createElement('span');
        this.weatherDesc.className = 'weather-desc';

        this.paramsDiv = document.createElement('div');
        this.paramsDiv.className = 'weather-params';

        this.tempDiv = document.createElement('div');
        this.tempDiv.className = 'temp-div';

        this.tempText = document.createElement('span');
        this.tempText.className = 'temp-text';

        this.pressureDiv = document.createElement('div');
        this.pressureDiv.className = 'pressure-div';

        this.pressureText = document.createElement('span');
        this.pressureText.className = 'pressure-text';

        this.weatherDiv.appendChild(this.timeLabel);
        this.weatherDiv.appendChild(this.weatherImg);
        this.weatherDiv.appendChild(this.weatherDesc);
        this.tempDiv.appendChild(this.tempText);
        this.pressureDiv.appendChild(this.pressureText);
        this.container.appendChild(this.weatherDiv);
        this.paramsDiv.appendChild(this.tempDiv);
        this.paramsDiv.appendChild(this.pressureDiv);
        this.container.appendChild(this.paramsDiv);
    }

    setWeatherDesc(textContent, icon) {
        this.weatherImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
        this.weatherDesc.textContent = textContent;
    }

    setTempKelvin(kelvin) {
        const c = (kelvin - 273.15).toFixed(1);
        this.tempText.textContent = `${c}°C`;
    }

    setPressure(pressure) {
        this.pressureText.textContent = `${pressure} hPa`;
    }

    setTimeStr(textContent) {
        this.timeLabel.textContent = textContent;
    }

    generate() {
        return this.container;
    }
}

function handleForecastJson(json) {
    let forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    if (!json.list || json.list.length === 0) return;

    console.log(json.list);
    let lastDate = "";

    for (let item of json.list) {
        let date = new Date(item["dt_txt"]);
        let timeStr = date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
        let dayStr = date.toLocaleDateString('pl-PL', {weekday: 'long', day: '2-digit', month: '2-digit'});

        if (dayStr !== lastDate) {
            let whenLabel = document.createElement('div');
            whenLabel.className = 'when-label';
            whenLabel.textContent = `${dayStr}`;
            forecastDiv.appendChild(whenLabel);
            lastDate = dayStr;
        }

        let divGen = new WeatherContainerGen();
        divGen.setWeatherDesc(
            item["weather"][0].description,
            item["weather"][0].icon
        );
        divGen.setTimeStr(timeStr);
        divGen.setTempKelvin(item["main"]["temp"]);
        divGen.setPressure(item["main"]["pressure"]);

        forecastDiv.appendChild(divGen.generate());
    }
}

function handleCurWeatherJson(json) {
    let divGen = new WeatherContainerGen();
    console.log(json);
    divGen.setWeatherDesc(
        json["weather"][0]["description"],
        json["weather"][0]["icon"]
    );
    divGen.setTempKelvin(json["main"]["temp"]);
    divGen.setPressure(json["main"]["pressure"]);
    divGen.setTimeStr(new Date(json["dt"] * 1000).toLocaleTimeString("PL-pl", {hour: '2-digit', minute: '2-digit'}));

    let whenLabel = document.createElement('div');
    whenLabel.className = 'when-label';
    whenLabel.textContent = 'teraz';

    curWeatherDiv.innerHTML = '';
    curWeatherDiv.appendChild(whenLabel);
    curWeatherDiv.appendChild(divGen.generate());
}

pogodaBtn.addEventListener("click", () => {
    if (addressInput.value === "") return;
    //ajax load current weather
    let addr = encodeURI(addressInput.value);
    let xhreq = new XMLHttpRequest();
    xhreq.onreadystatechange = (e) => {
        let state = e.target.readyState;
        let status = e.target.status;
        let respText = e.target.responseText;

        if (state === 4 && status === 200) {
            console.log(e.target);
            handleCurWeatherJson(JSON.parse(respText));
        }
        else if (state === 4) {
            if (status === 404) {
                errorSection.textContent = "Nie znaleziono miasta o podanej nazwie.";
            } else {
                errorSection.textContent = `Error: Http status code ${status}`;
            }
            errorSection.style.display = "block";
            console.error(`current weather response (status:${status}):${respText}`);
        }
    }
    xhreq.open('get', `https://api.openweathermap.org/data/2.5/weather?q=${addr}&lang=pl&appid=${API_KEY}`, true);
    xhreq.send();

    //fetch forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${addr}&lang=pl&appid=${API_KEY}`)
        .then(res => {
            console.log(res);
            if (res.status === 404) throw new Error("Nie znaleziono miasta o podanej nazwie.");
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            errorSection.style.display = "none";
            return res.json();
        })
        .then(handleForecastJson)
        .catch(err => {
            console.debug(err);
            errorSection.textContent = err.message;
            errorSection.style.display = "block";
        });
})