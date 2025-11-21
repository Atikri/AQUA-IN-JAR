// Weather Widget using Open-Meteo API
// Tries browser geolocation first, falls back to a default city (Hong Kong)

(function () {
  const WIDGET_ID = "weather-widget";
  const BG_LAYER_ID = "bottle-bg-layer";
  let isBottleOpen = false;
  let activeTheme = null;

  const defaultLocation = {
    name: "香港 · Hong Kong",
    latitude: 22.3193,
    longitude: 114.1694,
    timezone: "Asia/Hong_Kong",
  };

  const weatherCodes = {
    0: { label: "Clear sky", icon: "☀️" },
    1: { label: "Mainly clear", icon: "🌤️" },
    2: { label: "Partly cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Fog", icon: "🌫️" },
    48: { label: "Depositing rime fog", icon: "🌫️" },
    51: { label: "Light drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Heavy drizzle", icon: "🌧️" },
    61: { label: "Light rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy rain", icon: "🌧️" },
    71: { label: "Light snow", icon: "🌨️" },
    73: { label: "Snow", icon: "🌨️" },
    75: { label: "Heavy snow", icon: "❄️" },
    80: { label: "Rain showers", icon: "🌦️" },
    81: { label: "Heavy showers", icon: "🌧️" },
    82: { label: "Violent showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm with hail", icon: "⛈️" },
    99: { label: "Thunderstorm with heavy hail", icon: "⛈️" },
  };

  const weatherProfiles = [
    {
      codes: [0, 1, 2],
      theme: "sunny",
      music: {
        src: "/audio/AGA-Miss-u-Goodbye(Instrumental).flac",
        title: "晴朗瓶口 · AGA - Miss U Goodbye (Instrumental)",
        mood: "适合晒晒太阳、发一会儿呆的天气歌单",
      },
    },
    {
      codes: [3, 45, 48],
      theme: "cloudy",
      music: {
        src: "/audio/ed-white-Robynn-Kendyr-Instrumental.mp3",
        title: "云层瓶口 · Red & White (Instrumental)",
        mood: "柔柔的云影，伴你慢慢翻瓶中日记",
      },
    },
    {
      codes: [51, 53, 55, 61, 63, 65, 80, 81, 82],
      theme: "rainy",
      music: {
        src: "/audio/ed-white-Robynn-Kendyr-Instrumental.mp3",
        title: "雨雾瓶口 · Red & White (Instrumental)",
        mood: "适合听着雨声、慢慢翻阅 AQUA 的小瓶子",
      },
    },
    {
      codes: [95, 96, 99],
      theme: "storm",
      music: {
        src: "/audio/ed-white-Robynn-Kendyr-Instrumental.mp3",
        title: "风暴瓶口 · Red & White (Instrumental)",
        mood: "雷声滚滚，AQUA 在瓶里陪你等晴天",
      },
    },
  ];

  function getWeatherDescription(code) {
    return weatherCodes[code] || { label: "Unknown", icon: "💧" };
  }

  function getWeatherProfile(code) {
    for (const profile of weatherProfiles) {
      if (profile.codes.includes(code)) return profile;
    }
    return (
      weatherProfiles[weatherProfiles.length - 1] || {
        theme: "sunny",
        music: {
          src: "/audio/ed-white-Robynn-Kendyr-Instrumental.mp3",
          title: "瓶中随机播放",
          mood: "AQUA 随机为你选的一首瓶中 BGM",
        },
      }
    );
  }

  function formatDateLabel(dateStr, index) {
    const date = new Date(dateStr + "T00:00:00");
    const options = { weekday: "short" };
    const weekday = date.toLocaleDateString(undefined, options);
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    return weekday;
  }

  function createCardHTML(data) {
    const {
      locationName,
      locationNote,
      currentTemp,
      currentCode,
      daily,
    } = data;

    const current = getWeatherDescription(currentCode);
    const profile = getWeatherProfile(currentCode);
    const theme = profile.theme || "sunny";
    const music = profile.music;

    const dailyItems = daily.time
      .slice(0, 4)
      .map((day, i) => {
        const dayCode = daily.weathercode[i];
        const dayTempMin = Math.round(daily.temperature_2m_min[i]);
        const dayTempMax = Math.round(daily.temperature_2m_max[i]);
        const desc = getWeatherDescription(dayCode);
        const label = formatDateLabel(day, i);

        return `
          <div class="weather-widget__day">
            <div class="weather-widget__day-label">${label}</div>
            <div class="weather-widget__day-icon">${desc.icon}</div>
            <div class="weather-widget__day-temps">
              <span>${dayTempMax}°</span>
              <span class="weather-widget__day-temp-min">${dayTempMin}°</span>
            </div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="weather-widget__card" data-bg-theme="${theme}">
        <div class="weather-widget__header">
          <div class="weather-widget__location">
            <div class="weather-widget__location-line">
              <span class="weather-widget__location-pin">📍</span>
              <span class="weather-widget__location-name">${locationName}</span>
            </div>
            <span class="weather-widget__subtitle">${
              locationNote || "今天瓶口外的天气"
            }</span>
          </div>
          <div class="weather-widget__current">
            <div class="weather-widget__current-icon">${current.icon}</div>
            <div class="weather-widget__current-temp">${Math.round(
              currentTemp
            )}°</div>
            <div class="weather-widget__current-desc">${current.label}</div>
          </div>
        </div>
        <div class="weather-widget__toggle" role="group" aria-label="bottle top toggle">
          <button class="weather-widget__toggle-btn is-active" data-toggle="close">关闭瓶塞</button>
          <button class="weather-widget__toggle-btn" data-toggle="open">打开瓶塞</button>
        </div>
        <div class="weather-widget__audio">
          <div class="weather-widget__audio-label">今日天气 BGM</div>
          <div class="weather-widget__audio-title">${music.title}</div>
          <div class="weather-widget__audio-mood">${music.mood}</div>
          <audio class="weather-widget__audio-player" controls preload="metadata">
            <source src="${music.src}">
            Your browser does not support the audio element.
          </audio>
        </div>
        <div class="weather-widget__footer">
          <div class="weather-widget__days">
            ${dailyItems}
          </div>
        </div>
      </div>
    `;
  }

  function renderLoading(container) {
    container.innerHTML = `
      <div class="weather-widget__card weather-widget__card--loading">
        <div class="weather-widget__loading-spinner"></div>
        <div class="weather-widget__loading-text">AQUA 正在探头看外面的天气...</div>
      </div>
    `;
  }

  function renderError(container, message) {
    container.innerHTML = `
      <div class="weather-widget__card weather-widget__card--error">
        <div class="weather-widget__error-icon">💧</div>
        <div class="weather-widget__error-text">${message}</div>
      </div>
    `;
  }

  function fetchWeather({ latitude, longitude, name, timezone, locationNote }) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current_weather: "true",
      daily: "weathercode,temperature_2m_max,temperature_2m_min",
      timezone: timezone || "auto",
    });

    const url = "https://api.open-meteo.com/v1/forecast?" + params.toString();

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Weather API error");
        return res.json();
      })
      .then((json) => {
        return {
          locationName: name || defaultLocation.name,
          locationNote,
          currentTemp: json.current_weather.temperature,
          currentCode: json.current_weather.weathercode,
          daily: json.daily,
        };
      });
  }

  function fetchLocationName(latitude, longitude) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      language: "zh-CN",
      count: "1",
    });
    const url =
      "https://geocoding-api.open-meteo.com/v1/reverse?" + params.toString();

    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Geocoding error");
        return res.json();
      })
      .then((json) => {
        const result = json.results && json.results[0];
        if (!result) throw new Error("No geocoding result");
        const parts = [result.name, result.admin1, result.country].filter(
          Boolean
        );
        return {
          displayName: parts.join(" · "),
          timezone: result.timezone || "auto",
        };
      });
  }

  function initWidget() {
    const container = document.getElementById(WIDGET_ID);
    if (!container) return;

    renderLoading(container);

    function useDefault() {
      fetchWeather(defaultLocation)
        .then((data) => {
          container.innerHTML = createCardHTML({
            ...data,
            locationNote: "默认位置：AQUA 的瓶口 · Hong Kong",
          });
          setupBottleToggle(container);
        })
        .catch(() => {
          renderError(container, "AQUA 今天没看清楚外面的天气，下次再试试吧～");
        });
    }

    if (!navigator.geolocation) {
      useDefault();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationName(latitude, longitude)
          .then((loc) => {
            return fetchWeather({
              latitude,
              longitude,
              name: loc.displayName,
              timezone: loc.timezone,
              locationNote: "基于你的浏览器定位，AQUA 正在陪你看这片天",
            });
          })
          .then((data) => {
            container.innerHTML = createCardHTML(data);
            setupBottleToggle(container);
          })
          .catch(() => {
            // 如果反向地理失败或接口有问题，仍然用你的坐标，只是不显示具体城市名
            fetchWeather({
              latitude,
              longitude,
              name: "Your location",
              timezone: "auto",
              locationNote: "基于你的浏览器定位，AQUA 正在陪你看这片天",
            })
              .then((data) => {
                container.innerHTML = createCardHTML(data);
                setupBottleToggle(container);
              })
              .catch(() => {
                // 最后一步才退回默认城市
                useDefault();
              });
          });
      },
      () => {
        useDefault();
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 60 * 60 * 1000,
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }

  function setupBottleToggle(container) {
    if (!container) return;
    const card = container.querySelector(".weather-widget__card");
    if (!card) return;
    const theme = card.getAttribute("data-bg-theme") || "sunny";
    const buttons = card.querySelectorAll(".weather-widget__toggle-btn");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.toggle === "open" ? "open" : "close";
        applyBottleBackground(target, theme);
        updateToggleButtons(buttons, target);
      });
    });

    const initialMode = isBottleOpen ? "open" : "close";
    updateToggleButtons(buttons, initialMode);
    if (isBottleOpen) {
      applyBottleBackground("open", theme);
    } else {
      applyBottleBackground("close");
    }
  }

  function updateToggleButtons(buttons, mode) {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.toggle === mode;
      btn.classList.toggle("is-active", isActive);
    });
  }

  function applyBottleBackground(mode, theme) {
    const body = document.body;
    if (!body) return;

    if (mode === "open") {
      const layer = ensureBackgroundLayer();
      layer.setAttribute("data-theme", theme || activeTheme || "sunny");
      body.classList.add("bottle-open");
      isBottleOpen = true;
      activeTheme = theme || "sunny";
    } else {
      body.classList.remove("bottle-open");
      const layer = document.getElementById(BG_LAYER_ID);
      if (layer) {
        layer.removeAttribute("data-theme");
      }
      isBottleOpen = false;
      activeTheme = null;
    }
  }

  function ensureBackgroundLayer() {
    let layer = document.getElementById(BG_LAYER_ID);
    if (layer) return layer;

    layer = document.createElement("div");
    layer.id = BG_LAYER_ID;
    layer.className = "bottle-bg-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.insertBefore(layer, document.body.firstChild || null);
    return layer;
  }
})();

