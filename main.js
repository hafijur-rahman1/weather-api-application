// 3 part
// 1.memory Data Store(CRUD)
// 2 UI(DOM)
//create - New Element
//read - showing UI
//update- updating UI
//delete - delete UI
//Local storage(CRUD)

//Grouping data
const weatherDataStore = {
  privetCity: "Mymensingh",
  privetCountry: "BD",
  API_KEY: "aba108740aa0c2add74c56c52a11b253",
  set city(name) {
    //validation
    this.privetCity = name;
  },
  set country(name) {
    this.privetCountry = name;
  },
  async fetchData() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.privetCity},${this.privetCountry}&units=metric&appid=${this.API_KEY}`
      );
      return await res.json();
    } catch (err) {
      UI.showMessage(err.message);
    }
  },
};

const storage = {
  privetCity: "",
  privetCountry: "",
  set city(name) {
    this.privetCity = name;
  },
  set country(name) {
    this.privetCountry = name;
  },
  saveItem() {
    localStorage.setItem("BD-weather-city", this.privetCity);
    localStorage.setItem("BD-weather-country", this.privetCountry);
  },
};

const UI = {
  loadSelectors() {
    const cityElm = document.querySelector("#city");
    const cityInFoElm = document.querySelector("#w-city");
    const iconElm = document.querySelector("#w-icon");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const formElm = document.querySelector("#form");
    const countryElm = document.querySelector("#country");
    const messageElm = document.querySelector("#messageWrapper");

    return {
      cityElm,
      cityInFoElm,
      iconElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      formElm,
      countryElm,
      messageElm,
    };
  },
  getInputValues() {
    const { cityElm, countryElm } = this.loadSelectors();
    const city = cityElm.value;
    const country = countryElm.value;
    return {
      city,
      country,
    };
  },
  validateInput(city, country) {
    let err = false;
    if (city === "" || country === "") {
      err = true;
    }
    return err;
  },
  hideMessage() {
    const message = document.querySelector(".err-msg");
    if (message) {
      setTimeout(() => {
        message.remove();
      }, 3000);
    }
  },
  showMessage(msg) {
    const message = document.querySelector(".err-msg");
    const { messageElm } = this.loadSelectors();
    const elm = `<div class="alert alert-danger err-msg">${msg}</div>`;
    if (!message) {
      messageElm.insertAdjacentHTML("afterbegin", elm);
    }
    this.hideMessage();
  },
  getIconSrc(iconCode) {
    return "https://openweathermap.org/img/w/" + iconCode + ".png";
  },

  printWeather(data) {
    const {
      cityInFoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
    } = this.loadSelectors();

    // console.log(data);

    const { main, weather, name } = data;
    cityInFoElm.textContent = name;
    temperatureElm.textContent = `Temperature: ${main.temp}°C`;
    humidityElm.textContent = `Humidity: ${main.humidity}kpa`;
    pressureElm.textContent = `pressure: ${main.pressure}kap`;
    feelElm.textContent = `${weather[0].description}`;
    const src = this.getIconSrc(weather[0].icon);

    // console.log(src);

    iconElm.setAttribute("src", src);
  },
  resetInput() {
    const { countryElm, cityElm } = this.loadSelectors();
    cityElm.value = "";
    countryElm.value = "";
  },
  init() {
    const { formElm } = this.loadSelectors();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();

      //get the input value

      const { city, country } = this.getInputValues();
      //reset input
      this.resetInput();
      //validate input
      const err = this.validateInput(city, country);
      //show error message to UI
      if (err) return this.showMessage("plese provide valid input");

      //setting data to weather store
      weatherDataStore.city = city;
      weatherDataStore.country = country;
      //setting to local storage
      storage.city = city;
      storage.country = country;
      storage.saveItem();

      //send requesr to API server
      const data = await weatherDataStore.fetchData();
      this.printWeather(data);
    });

    document.addEventListener("DOMContentLoaded", async (e) => {
      //load data from local storage
      if (localStorage.getItem("BD-weather-city")) {
        //setting data to  data store
        weatherDataStore.city = localStorage.getItem("BD-weather-city");
      }
      if (localStorage.getItem("BD-weather-country")) {
        //setting data to  data store
        weatherDataStore.country = localStorage.getItem("BD-weather-country");
      }
      //send request to api
      const data = await weatherDataStore.fetchData();

      if (Number(data.cod) > 400) {
        this.showMessage(data.message);
      } else {
        //show data to UI
        this.printWeather(data);
      }
    });
  },
};

UI.init();
