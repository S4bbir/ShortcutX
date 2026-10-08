(function () {
  "use strict";

  const STORAGE_KEY = "shortcutXStateV1";
  const ALL_GROUP = "All";
  const VERSION = "0.2.26";
  const DEFAULT_OPEN_MODE = "same";
  const MAX_BACKGROUND_IMAGE_BYTES = 3 * 1024 * 1024;
  const MAX_ICON_IMAGE_BYTES = 1024 * 1024;
  const MAX_PROFILE_IMAGE_BYTES = 1024 * 1024;
  const defaultShortcuts = [
    {
      id: "starter-google",
      title: "Google",
      url: "https://www.google.com",
      group: "",
      iconType: "auto",
      icon: "G",
      iconImage: "",
      color: "#4285f4",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    },
    {
      id: "starter-youtube",
      title: "YouTube",
      url: "https://www.youtube.com",
      group: "",
      iconType: "auto",
      icon: "YT",
      iconImage: "",
      color: "#ff0000",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    },
    {
      id: "starter-facebook",
      title: "Facebook",
      url: "https://www.facebook.com",
      group: "",
      iconType: "auto",
      icon: "F",
      iconImage: "",
      color: "#1877f2",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    },
    {
      id: "starter-linkedin",
      title: "LinkedIn",
      url: "https://www.linkedin.com",
      group: "",
      iconType: "auto",
      icon: "IN",
      iconImage: "",
      color: "#0a66c2",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    },
    {
      id: "starter-chatgpt",
      title: "ChatGPT",
      url: "https://chatgpt.com",
      group: "",
      iconType: "auto",
      icon: "AI",
      iconImage: "",
      color: "#10a37f",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    },
    {
      id: "starter-email",
      title: "Email",
      url: "https://mail.google.com",
      group: "",
      iconType: "auto",
      icon: "EM",
      iconImage: "",
      color: "#ea4335",
      note: "",
      openMode: DEFAULT_OPEN_MODE
    }
  ];

  const defaultState = {
    shortcuts: defaultShortcuts,
    groups: [],
    tasks: [],
    notes: [],
    weather: {
      city: "",
      latitude: null,
      longitude: null,
      unit: "celsius",
      cache: null,
      cachedAt: 0
    },
    profile: {
      username: "",
      image: ""
    },
    settings: {
      theme: "dark",
      accent: "#f8fafc",
      background: "#000000",
      backgroundImage: "",
      wallpaperDimLevel: 58,
      columns: 20,
      iconSize: 62,
      gridGap: 18,
      tileShape: "circle",
      layout: "center",
      showLabels: true,
      showClock: false,
      clockFormat: "12",
      clockAlignment: "center",
      showGroups: false,
      showTopLinks: true,
      defaultEngine: "google",
      topLinks: [
        { label: "Gmail", url: "https://mail.google.com" },
        { label: "Images", url: "https://images.google.com" }
      ]
    }
  };

  const namedColors = [
    ["Black", "#000000"],
    ["White", "#ffffff"],
    ["Red", "#ef4444"],
    ["Orange", "#f97316"],
    ["Amber", "#f59e0b"],
    ["Yellow", "#eab308"],
    ["Lime", "#84cc16"],
    ["Green", "#22c55e"],
    ["Emerald", "#10b981"],
    ["Teal", "#14b8a6"],
    ["Cyan", "#06b6d4"],
    ["Sky Blue", "#0ea5e9"],
    ["Blue", "#3b82f6"],
    ["Indigo", "#6366f1"],
    ["Violet", "#8b5cf6"],
    ["Purple", "#a855f7"],
    ["Fuchsia", "#d946ef"],
    ["Pink", "#ec4899"],
    ["Rose", "#f43f5e"],
    ["Slate", "#64748b"],
    ["Gray", "#6b7280"],
    ["Zinc", "#71717a"],
    ["Neutral", "#737373"],
    ["Stone", "#78716c"],
    ["Brown", "#92400e"]
  ].map(([name, hex]) => ({ name, hex, rgb: hexToRgb(hex) }));

  const brandColors = [
    { match: ["gmail", "mail.google.com"], color: "#ea4335" },
    { match: ["drive", "drive.google.com"], color: "#34a853" },
    { match: ["analytics", "analytics.google.com"], color: "#f9ab00" },
    { match: ["google", "google.com"], color: "#4285f4" },
    { match: ["youtube", "youtube.com", "youtu.be"], color: "#ff0000" },
    { match: ["facebook", "facebook.com", "fb.com"], color: "#1877f2" },
    { match: ["twitter", "twitter.com", "x.com"], color: "#f8fafc" },
    { match: ["github", "github.com"], color: "#f8fafc" },
    { match: ["linkedin", "linkedin.com"], color: "#0a66c2" },
    { match: ["reddit", "reddit.com"], color: "#ff4500" },
    { match: ["stack overflow", "stackoverflow.com"], color: "#f48024" },
    { match: ["chatgpt", "openai", "chatgpt.com", "openai.com"], color: "#10a37f" },
    { match: ["claude", "claude.ai"], color: "#d97757" },
    { match: ["leetcode", "leetcode.com"], color: "#f59e0b" },
    { match: ["edx", "edx.org"], color: "#2d6cdf" },
    { match: ["fiverr", "fiverr.com"], color: "#1dbf73" },
    { match: ["canva", "canva.com"], color: "#7c3aed" },
    { match: ["notion", "notion.so"], color: "#f8fafc" }
  ];

  const generatedColorPalette = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e"
  ];

  const iconPaths = {
    plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.16 2.16 0 1 1-3.06 3.06l-.04-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.08 1.65V21a2.16 2.16 0 1 1-4.32 0v-.06a1.8 1.8 0 0 0-1.18-1.65 1.8 1.8 0 0 0-1.98.36l-.04.04a2.16 2.16 0 1 1-3.06-3.06l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.65-1.08H3a2.16 2.16 0 1 1 0-4.32h.06A1.8 1.8 0 0 0 4.7 8.42a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.16 2.16 0 1 1 3.06-3.06l.04.04a1.8 1.8 0 0 0 1.98.36h.02A1.8 1.8 0 0 0 10.5 2.1V2a2.16 2.16 0 1 1 4.32 0v.06a1.8 1.8 0 0 0 1.08 1.65 1.8 1.8 0 0 0 1.98-.36l.04-.04a2.16 2.16 0 1 1 3.06 3.06l-.04.04a1.8 1.8 0 0 0-.36 1.98v.02a1.8 1.8 0 0 0 1.65 1.08H22a2.16 2.16 0 1 1 0 4.32h-.06A1.8 1.8 0 0 0 19.4 15z"></path>',
    close: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.8-3.8"></path>',
    sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.42 1.42"></path><path d="m17.65 17.65 1.42 1.42"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.35 17.65-1.42 1.42"></path><path d="m19.07 4.93-1.42 1.42"></path>',
    cloud: '<path d="M20 16.2A4.5 4.5 0 0 0 18.5 7.5a6 6 0 0 0-11.7 1.8A4 4 0 0 0 7 17h11"></path>',
    rain: '<path d="M20 14.2A4.5 4.5 0 0 0 18.5 5.5a6 6 0 0 0-11.7 1.8A4 4 0 0 0 7 15h11"></path><path d="m8 18-1 2"></path><path d="m13 18-1 2"></path><path d="m18 18-1 2"></path>',
    snow: '<path d="M20 14.2A4.5 4.5 0 0 0 18.5 5.5a6 6 0 0 0-11.7 1.8A4 4 0 0 0 7 15h11"></path><path d="M8 18v3"></path><path d="m6.7 18.8 2.6 1.5"></path><path d="m9.3 18.8-2.6 1.5"></path><path d="M16 18v3"></path><path d="m14.7 18.8 2.6 1.5"></path><path d="m17.3 18.8-2.6 1.5"></path>',
    storm: '<path d="M20 14.2A4.5 4.5 0 0 0 18.5 5.5a6 6 0 0 0-11.7 1.8A4 4 0 0 0 7 15h11"></path><path d="m13 16-3 4h3l-1 3 4-5h-3l1-2"></path>',
    more: '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.2 6.5"></path><path d="M3 12A9 9 0 0 1 18.2 5.5"></path><path d="M3 21v-5h5"></path><path d="M21 3v5h-5"></path>'
  };

  let state = clone(defaultState);
  let activeGroup = ALL_GROUP;
  let activePanel = "shortcut";
  let dragId = "";
  let toastTimer = 0;
  let systemThemeQuery = null;
  let shortcutColorTouched = false;
  let profileDraftImage = "";
  let analyzedBackgroundKey = "";
  let backgroundToneRequest = 0;
  let notesSaveTimer = 0;

  const dom = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheDom();
    paintIcons();
    bindEvents();
    state = normalizeState(await loadState());
    if (hasChromeStorage() && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleExternalOrganizerState);
    }
    applySettings();
    syncFormControls();
    renderAll();
    refreshWeatherIfNeeded();
    tickClock();
    setInterval(tickClock, 60000);

    if (typeof window.matchMedia === "function") {
      systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      systemThemeQuery.addEventListener("change", applySettings);
    }
  }

  function cacheDom() {
    const ids = [
      "profileButton",
      "profileAvatar",
      "profilePopover",
      "profileForm",
      "profileUsernameInput",
      "profilePreviewAvatar",
      "profileImageStatus",
      "uploadProfileImageButton",
      "clearProfileImageButton",
      "profileImageFileInput",
      "brandName",
      "shortcutCount",
      "topLinks",
      "topLinkOne",
      "topLinkTwo",
      "addShortcutButton",
      "openSettingsButton",
      "timeBlock",
      "clockText",
      "dateText",
      "weatherWidget",
      "weatherIcon",
      "weatherText",
      "searchForm",
      "searchIcon",
      "searchInput",
      "organizerEdgeTrigger",
      "organizerScrim",
      "organizerWindow",
      "closeOrganizerButton",
      "organizerTasksTab",
      "organizerNotesTab",
      "tasksView",
      "notesView",
      "taskCount",
      "sectionBar",
      "groupTabs",
      "sortButton",
      "shortcutGrid",
      "emptyState",
      "emptyAddButton",
      "panelScrim",
      "sidePanel",
      "panelTitle",
      "panelSubtitle",
      "closePanelButton",
      "shortcutForm",
      "shortcutId",
      "titleInput",
      "urlInput",
      "groupInput",
      "groupOptions",
      "iconTypeInput",
      "iconTextField",
      "iconInput",
      "iconImageField",
      "iconImageInput",
      "uploadIconImageButton",
      "clearIconImageButton",
      "iconImageFileInput",
      "colorInput",
      "colorNameOutput",
      "defaultColorButton",
      "openModeInput",
      "noteInput",
      "deleteShortcutButton",
      "customizeForm",
      "columnsInput",
      "columnsOutput",
      "iconSizeInput",
      "iconSizeOutput",
      "gridGapInput",
      "gridGapOutput",
      "tileShapeInput",
      "layoutInput",
      "labelsInput",
      "clockInput",
      "clockFormatRow",
      "clockFormatInput",
      "clockAlignmentInput",
      "showGroupsInput",
      "groupNameInput",
      "addGroupButton",
      "groupManageSelect",
      "renameGroupInput",
      "renameGroupButton",
      "deleteGroupButton",
      "themeInput",
      "accentInput",
      "accentNameOutput",
      "backgroundInput",
      "backgroundNameOutput",
      "backgroundPresets",
      "backgroundImageInput",
      "uploadBackgroundButton",
      "clearBackgroundButton",
      "backgroundFileInput",
      "wallpaperDimLevelInput",
      "wallpaperDimLevelOutput",
      "weatherCityInput",
      "weatherUnitInput",
      "saveWeatherCityButton",
      "useWeatherLocationButton",
      "topLinksInput",
      "topLinkOneLabelInput",
      "topLinkOneUrlInput",
      "topLinkTwoLabelInput",
      "topLinkTwoUrlInput",
      "backupView",
      "exportButton",
      "importButton",
      "resetButton",
      "importFileInput",
      "taskForm",
      "taskInput",
      "taskList",
      "taskEmpty",
      "clearCompletedTasksButton",
      "notesGrid",
      "addNoteButton",
      "notesSaveStatus",
      "toast"
    ];

    ids.forEach((id) => {
      dom[id] = document.getElementById(id);
    });

    dom.panelTabs = Array.from(document.querySelectorAll("[data-panel-tab]"));
    dom.panelViews = Array.from(document.querySelectorAll("[data-panel-view]"));
    dom.backgroundPresetButtons = Array.from(document.querySelectorAll(".background-preset"));
  }

  function paintIcons() {
    dom.addShortcutButton.innerHTML = icon("plus");
    dom.openSettingsButton.innerHTML = icon("settings");
    dom.closePanelButton.innerHTML = icon("close");
    dom.closeOrganizerButton.innerHTML = icon("close");
    dom.searchIcon.innerHTML = icon("search");
  }

  function bindEvents() {
    dom.profileButton.addEventListener("click", toggleProfilePopover);
    dom.profileForm.addEventListener("submit", saveProfileFromForm);
    dom.profileUsernameInput.addEventListener("input", renderProfilePreview);
    dom.uploadProfileImageButton.addEventListener("click", () => dom.profileImageFileInput.click());
    dom.clearProfileImageButton.addEventListener("click", clearProfileImage);
    dom.profileImageFileInput.addEventListener("change", handleProfileImageFileSelect);
    dom.addShortcutButton.addEventListener("click", () => openShortcutEditor());
    dom.emptyAddButton.addEventListener("click", () => openShortcutEditor());
    dom.openSettingsButton.addEventListener("click", () => openPanel("customize"));
    dom.organizerEdgeTrigger.addEventListener("pointerenter", () => {
      if (!dom.sidePanel.classList.contains("is-open")) {
        openOrganizerWindow();
      }
    });
    dom.closeOrganizerButton.addEventListener("click", closeOrganizerWindow);
    dom.organizerScrim.addEventListener("click", closeOrganizerWindow);
    dom.organizerTasksTab.addEventListener("click", () => setOrganizerView("tasks"));
    dom.organizerNotesTab.addEventListener("click", () => setOrganizerView("notes"));
    dom.weatherWidget.addEventListener("click", () => {
      openPanel("customize");
      setTimeout(() => dom.weatherCityInput.focus(), 220);
    });
    dom.closePanelButton.addEventListener("click", closePanel);
    dom.panelScrim.addEventListener("click", closePanel);
    dom.searchForm.addEventListener("submit", handleSearchSubmit);
    dom.taskForm.addEventListener("submit", addTaskFromForm);
    dom.taskList.addEventListener("change", handleTaskChange);
    dom.taskList.addEventListener("click", handleTaskListClick);
    dom.clearCompletedTasksButton.addEventListener("click", clearCompletedTasks);
    dom.notesGrid.addEventListener("input", handleNotesInput);
    dom.notesGrid.addEventListener("click", handleNotesGridClick);
    dom.addNoteButton.addEventListener("click", addNote);
    dom.saveWeatherCityButton.addEventListener("click", saveWeatherCity);
    dom.useWeatherLocationButton.addEventListener("click", useCurrentLocationForWeather);
    dom.weatherUnitInput.addEventListener("change", handleWeatherUnitChange);
    dom.weatherCityInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveWeatherCity();
      }
    });
    dom.sortButton.addEventListener("click", sortVisibleShortcuts);
    dom.titleInput.addEventListener("input", syncSuggestedShortcutColor);
    dom.urlInput.addEventListener("input", syncSuggestedShortcutColor);
    dom.shortcutForm.addEventListener("submit", saveShortcutFromForm);
    dom.deleteShortcutButton.addEventListener("click", deleteShortcutFromForm);
    dom.iconTypeInput.addEventListener("change", syncIconFields);
    dom.colorInput.addEventListener("input", handleShortcutColorInput);
    dom.defaultColorButton.addEventListener("click", applyDefaultShortcutColor);
    dom.uploadIconImageButton.addEventListener("click", () => {
      dom.iconTypeInput.value = "image";
      syncIconFields();
      dom.iconImageFileInput.click();
    });
    dom.clearIconImageButton.addEventListener("click", clearIconImageInput);
    dom.iconImageFileInput.addEventListener("change", handleIconImageFileSelect);
    dom.addGroupButton.addEventListener("click", addGroupFromControls);
    dom.groupNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addGroupFromControls();
      }
    });
    dom.groupManageSelect.addEventListener("change", syncSelectedGroupControls);
    dom.renameGroupButton.addEventListener("click", renameGroupFromControls);
    dom.renameGroupInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        renameGroupFromControls();
      }
    });
    dom.deleteGroupButton.addEventListener("click", deleteGroupFromControls);
    dom.customizeForm.addEventListener("input", handleSettingsInput);
    dom.customizeForm.addEventListener("change", handleSettingsInput);
    dom.backgroundPresetButtons.forEach((button) => {
      button.addEventListener("click", () => applyBackgroundPreset(button));
    });
    dom.uploadBackgroundButton.addEventListener("click", () => dom.backgroundFileInput.click());
    dom.clearBackgroundButton.addEventListener("click", clearBackgroundImage);
    dom.backgroundFileInput.addEventListener("change", handleBackgroundFileSelect);
    dom.exportButton.addEventListener("click", exportData);
    dom.importButton.addEventListener("click", () => dom.importFileInput.click());
    dom.importFileInput.addEventListener("change", importData);
    dom.resetButton.addEventListener("click", resetData);

    dom.panelTabs.forEach((tab) => {
      tab.addEventListener("click", () => setActivePanel(tab.dataset.panelTab));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isProfilePopoverOpen()) {
        closeProfilePopover();
        return;
      }

      if (event.key === "Escape" && dom.sidePanel.classList.contains("is-open")) {
        closePanel();
      }
      if (event.key === "Escape" && dom.organizerWindow.classList.contains("is-open")) {
        closeOrganizerWindow();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        openShortcutEditor();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        dom.searchInput.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!isProfilePopoverOpen()) {
        return;
      }

      if (dom.profilePopover.contains(event.target) || dom.profileButton.contains(event.target)) {
        return;
      }

      closeProfilePopover();
    });
  }

  async function loadState() {
    try {
      if (hasChromeStorage()) {
        const result = await chrome.storage.local.get([STORAGE_KEY]);
        return result[STORAGE_KEY] || clone(defaultState);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultState);
    } catch (error) {
      console.warn("ShortcutX could not load saved data.", error);
      return clone(defaultState);
    }
  }

  async function saveState() {
    try {
      if (hasChromeStorage()) {
        await chrome.storage.local.set({ [STORAGE_KEY]: state });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (error) {
      console.warn("ShortcutX could not save data.", error);
      showToast("Could not save changes");
    }
  }

  function hasChromeStorage() {
    return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
  }

  function normalizeState(nextState) {
    const raw = nextState && typeof nextState === "object" ? nextState : {};
    const rawSettings = raw.settings && typeof raw.settings === "object" ? raw.settings : {};
    const hasShortcuts = Array.isArray(raw.shortcuts);
    const shortcuts = (hasShortcuts ? raw.shortcuts : defaultShortcuts)
      .map(normalizeShortcut)
      .filter(Boolean);
    const groups = normalizeGroups(raw.groups, shortcuts);

    const settings = { ...defaultState.settings, ...rawSettings };
    settings.columns = clampNumber(settings.columns, 4, 24, defaultState.settings.columns);
    settings.iconSize = clampNumber(settings.iconSize, 44, 86, defaultState.settings.iconSize);
    settings.gridGap = clampNumber(settings.gridGap, 8, 34, defaultState.settings.gridGap);
    settings.accent = safeColor(settings.accent, defaultState.settings.accent);
    settings.background = safeColor(settings.background, defaultState.settings.background);
    settings.backgroundImage = normalizeImageUrl(settings.backgroundImage) || "";
    settings.wallpaperDimLevel = rawSettings.wallpaperDimLevel === undefined
      ? (rawSettings.imageOverlay === false ? 0 : 58)
      : clampNumber(rawSettings.wallpaperDimLevel, 0, 80, defaultState.settings.wallpaperDimLevel);
    delete settings.imageOverlay;
    settings.tileShape = ["circle", "rounded", "square"].includes(settings.tileShape) ? settings.tileShape : defaultState.settings.tileShape;
    settings.layout = ["center", "top"].includes(settings.layout) ? settings.layout : defaultState.settings.layout;
    settings.theme = ["system", "light", "dark"].includes(settings.theme) ? settings.theme : defaultState.settings.theme;
    settings.showLabels = settings.showLabels !== false;
    settings.showClock = Boolean(settings.showClock);
    settings.clockFormat = settings.clockFormat === "24" ? "24" : "12";
    settings.clockAlignment = ["left", "center", "right"].includes(settings.clockAlignment)
      ? settings.clockAlignment
      : defaultState.settings.clockAlignment;
    settings.showGroups = Boolean(settings.showGroups);
    settings.showTopLinks = settings.showTopLinks !== false;
    settings.topLinks = normalizeTopLinks(rawSettings.topLinks);
    const tasks = (Array.isArray(raw.tasks) ? raw.tasks : [])
      .map((task) => ({
        id: String(task && task.id || uid()),
        text: String(task && task.text || "").trim().slice(0, 120),
        completed: Boolean(task && task.completed)
      }))
      .filter((task) => task.text);

    return {
      shortcuts,
      groups,
      profile: normalizeProfile(raw.profile),
      settings,
      tasks,
      notes: normalizeNotes(raw.notes),
      weather: normalizeWeather(raw.weather)
    };
  }

  function normalizeNotes(value) {
    if (typeof value === "string") {
      const text = value.slice(0, 30000);
      return text.trim() ? [{ id: uid(), text, color: 0 }] : [];
    }
    return (Array.isArray(value) ? value : []).slice(0, 100).map((note, index) => ({
      id: String(note && note.id || uid()),
      text: String(note && note.text || "").slice(0, 5000),
      color: clampNumber(note && note.color, 0, 4, index % 5)
    }));
  }

  function normalizeWeather(value) {
    const source = value && typeof value === "object" ? value : {};
    const latitude = Number(source.latitude);
    const longitude = Number(source.longitude);
    const hasCoordinates = source.latitude !== null && source.latitude !== undefined && source.longitude !== null && source.longitude !== undefined;
    const validCoordinates = hasCoordinates && Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
    const cache = source.cache && typeof source.cache === "object" && Number.isFinite(Number(source.cache.temperature))
      ? {
          temperature: Number(source.cache.temperature),
          code: Number(source.cache.code) || 0,
          isDay: source.cache.isDay !== false,
          days: Array.isArray(source.cache.days) ? source.cache.days.slice(0, 3) : []
        }
      : null;

    return {
      city: String(source.city || "").trim().slice(0, 80),
      latitude: validCoordinates ? latitude : null,
      longitude: validCoordinates ? longitude : null,
      unit: source.unit === "fahrenheit" ? "fahrenheit" : "celsius",
      cache,
      cachedAt: Number.isFinite(Number(source.cachedAt)) ? Number(source.cachedAt) : 0
    };
  }

  function normalizeProfile(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      username: cleanUsername(source.username),
      image: normalizeImageUrl(source.image || "")
    };
  }

  function normalizeGroups(rawGroups, shortcuts) {
    const groupSet = new Set();

    if (Array.isArray(rawGroups)) {
      rawGroups.forEach((group) => {
        const cleaned = cleanGroupName(group);
        if (cleaned) {
          groupSet.add(cleaned);
        }
      });
    }

    shortcuts.forEach((shortcut) => {
      const cleaned = cleanGroupName(shortcut.group);
      if (cleaned) {
        groupSet.add(cleaned);
      }
    });

    return Array.from(groupSet).sort((a, b) => a.localeCompare(b));
  }

  function normalizeShortcut(shortcut) {
    if (!shortcut || typeof shortcut !== "object") {
      return null;
    }

    const title = String(shortcut.title || "").trim().slice(0, 42);
    const url = normalizeUrl(shortcut.url);

    if (!title || !url) {
      return null;
    }

    const iconImage = normalizeImageUrl(shortcut.iconImage || "");
    const iconType = coerceIconType(shortcut.iconType, iconImage);

    return {
      id: shortcut.id || uid(),
      title,
      url,
      group: cleanGroup(shortcut.group),
      iconType,
      icon: String(shortcut.icon || initials(title)).trim().slice(0, 4) || initials(title),
      iconImage: iconType === "image" ? iconImage : "",
      color: safeColor(shortcut.color, getSuggestedShortcutColor(title, url)),
      note: String(shortcut.note || "").trim().slice(0, 96),
      openMode: shortcut.openMode === "new" ? "new" : DEFAULT_OPEN_MODE
    };
  }

  function normalizeTopLinks(value) {
    const source = Array.isArray(value) ? value : defaultState.settings.topLinks;

    return [0, 1].map((index) => {
      const fallback = defaultState.settings.topLinks[index];
      const item = source[index] || {};
      return {
        label: String(item.label ?? fallback.label).trim().slice(0, 18),
        url: normalizeUrl(item.url ?? fallback.url)
      };
    });
  }

  function applySettings() {
    const { settings } = state;
    const root = document.documentElement;
    const systemDark = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effectiveDark = settings.theme === "dark" || (settings.theme === "system" && systemDark);
    const tileCell = Math.max(settings.iconSize + 26, 74);
    const gridMaxWidth = settings.columns * tileCell + Math.max(settings.columns - 1, 0) * settings.gridGap;

    document.body.dataset.theme = settings.theme;
    document.body.dataset.shape = settings.tileShape;
    document.body.dataset.layout = settings.layout;
    document.body.dataset.labels = settings.showLabels ? "shown" : "hidden";
    document.body.dataset.clock = settings.showClock ? "shown" : "hidden";
    document.body.dataset.clockAlign = settings.clockAlignment;
    document.body.dataset.groups = settings.showGroups ? "shown" : "hidden";
    document.body.dataset.toplinks = settings.showTopLinks ? "shown" : "hidden";

    root.style.setProperty("--accent", settings.accent);
    root.style.setProperty("--accent-ink", readableTextColor(settings.accent));
    root.style.setProperty("--icon-size", `${settings.iconSize}px`);
    root.style.setProperty("--tile-cell", `${tileCell}px`);
    root.style.setProperty("--grid-gap", `${settings.gridGap}px`);
    root.style.setProperty("--grid-max-width", `${gridMaxWidth}px`);
    root.style.setProperty("--bg-overlay", String(settings.wallpaperDimLevel / 100));
    root.style.setProperty("--bg-overlay-rgb", effectiveDark ? "0, 0, 0" : "255, 255, 255");
    document.body.style.setProperty("--background", settings.background);

    if (settings.backgroundImage) {
      root.style.setProperty("--bg-image", `url("${cssUrl(settings.backgroundImage)}")`);
    } else {
      root.style.setProperty("--bg-image", "none");
    }
    updateBackgroundTextTone(settings.backgroundImage, settings.background, settings.wallpaperDimLevel, effectiveDark);

    dom.timeBlock.hidden = !settings.showClock;
    dom.clockFormatRow.hidden = !settings.showClock;
    dom.topLinks.hidden = !settings.showTopLinks;
    updateBackgroundPresetState();
    renderTopLinks();
  }

  function syncFormControls() {
    const { settings } = state;
    dom.columnsInput.value = settings.columns;
    dom.columnsOutput.value = settings.columns;
    dom.iconSizeInput.value = settings.iconSize;
    dom.iconSizeOutput.value = settings.iconSize;
    dom.gridGapInput.value = settings.gridGap;
    dom.gridGapOutput.value = settings.gridGap;
    dom.tileShapeInput.value = settings.tileShape;
    dom.layoutInput.value = settings.layout;
    dom.labelsInput.checked = settings.showLabels;
    dom.clockInput.checked = settings.showClock;
    dom.clockFormatInput.value = settings.clockFormat;
    dom.clockAlignmentInput.value = settings.clockAlignment;
    dom.showGroupsInput.checked = settings.showGroups;
    dom.themeInput.value = settings.theme;
    dom.accentInput.value = settings.accent;
    dom.backgroundInput.value = settings.background;
    syncBackgroundImageInput();
    dom.wallpaperDimLevelInput.value = settings.wallpaperDimLevel;
    dom.wallpaperDimLevelOutput.value = `${settings.wallpaperDimLevel}%`;
    dom.wallpaperDimLevelOutput.textContent = dom.wallpaperDimLevelOutput.value;
    dom.weatherCityInput.value = state.weather.city;
    dom.weatherUnitInput.value = state.weather.unit;
    dom.topLinksInput.checked = settings.showTopLinks;
    dom.topLinkOneLabelInput.value = settings.topLinks[0].label;
    dom.topLinkOneUrlInput.value = settings.topLinks[0].url;
    dom.topLinkTwoLabelInput.value = settings.topLinks[1].label;
    dom.topLinkTwoUrlInput.value = settings.topLinks[1].url;
    syncColorLabels();
  }

  function updateBackgroundTextTone(imageUrl, backgroundColor, dimLevel, effectiveDark) {
    const key = imageUrl ? `${imageUrl}|${backgroundColor}|${dimLevel}|${effectiveDark}` : "";
    if (key === analyzedBackgroundKey) {
      return;
    }
    analyzedBackgroundKey = key;
    const requestId = ++backgroundToneRequest;

    if (!imageUrl) {
      delete document.body.dataset.imageTone;
      return;
    }

    const image = new Image();
    if (!imageUrl.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.addEventListener("load", () => {
      if (requestId !== backgroundToneRequest) {
        return;
      }

      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          delete document.body.dataset.imageTone;
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const base = hexToRgb(backgroundColor) || { r: 0, g: 0, b: 0 };
        const overlayAlpha = dimLevel / 100;
        const overlayChannel = effectiveDark ? 0 : 255;
        let luminanceTotal = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          const alpha = pixels[index + 3] / 255;
          const red = (pixels[index] * alpha + base.r * (1 - alpha)) * (1 - overlayAlpha) + overlayChannel * overlayAlpha;
          const green = (pixels[index + 1] * alpha + base.g * (1 - alpha)) * (1 - overlayAlpha) + overlayChannel * overlayAlpha;
          const blue = (pixels[index + 2] * alpha + base.b * (1 - alpha)) * (1 - overlayAlpha) + overlayChannel * overlayAlpha;
          luminanceTotal += (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
        }
        document.body.dataset.imageTone = luminanceTotal / (pixels.length / 4) >= 0.5 ? "light" : "dark";
      } catch (error) {
        delete document.body.dataset.imageTone;
      }
    });
    image.addEventListener("error", () => {
      if (requestId === backgroundToneRequest) {
        delete document.body.dataset.imageTone;
      }
    });
    image.src = imageUrl;
  }

  function renderAll() {
    renderProfile();
    renderGroups();
    renderShortcuts();
    renderGroupOptions();
    renderGroupManager();
    dom.shortcutCount.textContent = `${state.shortcuts.length} shortcuts`;
    renderTasks();
    renderNotes();
    renderWeather();
  }

  async function addTaskFromForm(event) {
    event.preventDefault();
    const text = dom.taskInput.value.trim();
    if (!text) {
      return;
    }
    state.tasks.unshift({ id: uid(), text: text.slice(0, 120), completed: false });
    dom.taskInput.value = "";
    renderTasks();
    await saveState();
    dom.taskInput.focus();
  }

  function renderTasks() {
    dom.taskList.replaceChildren();
    state.tasks.forEach((task) => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " is-complete" : ""}`;
      item.dataset.id = task.id;

      const label = document.createElement("label");
      label.className = "task-label";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Mark ${task.text} ${task.completed ? "incomplete" : "complete"}`);
      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.text;
      label.append(checkbox, text);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "task-remove";
      remove.dataset.action = "remove";
      remove.setAttribute("aria-label", `Delete ${task.text}`);
      remove.innerHTML = icon("close");
      item.append(label, remove);
      dom.taskList.append(item);
    });

    const pendingCount = state.tasks.filter((task) => !task.completed).length;
    dom.taskCount.textContent = String(pendingCount);
    dom.taskEmpty.hidden = state.tasks.length > 0;
    dom.clearCompletedTasksButton.hidden = !state.tasks.some((task) => task.completed);
  }

  async function handleTaskChange(event) {
    if (event.target.type !== "checkbox") {
      return;
    }
    const item = event.target.closest(".task-item");
    const task = state.tasks.find((candidate) => candidate.id === item?.dataset.id);
    if (!task) {
      return;
    }
    task.completed = event.target.checked;
    renderTasks();
    await saveState();
  }

  async function handleTaskListClick(event) {
    const remove = event.target.closest('[data-action="remove"]');
    if (!remove) {
      return;
    }
    const id = remove.closest(".task-item")?.dataset.id;
    state.tasks = state.tasks.filter((task) => task.id !== id);
    renderTasks();
    await saveState();
  }

  async function clearCompletedTasks() {
    state.tasks = state.tasks.filter((task) => !task.completed);
    renderTasks();
    await saveState();
  }

  function handleNotesInput(event) {
    const card = event.target.closest(".note-card");
    if (!card) {
      return;
    }
    const note = state.notes.find((item) => item.id === card.dataset.id);
    if (!note) {
      return;
    }
    note.text = event.target.value.slice(0, 5000);
    dom.notesSaveStatus.textContent = "Saving…";
    clearTimeout(notesSaveTimer);
    notesSaveTimer = setTimeout(async () => {
      await saveState();
      dom.notesSaveStatus.textContent = "Saved automatically";
    }, 500);
  }

  function handleExternalOrganizerState(changes, areaName) {
    if (areaName !== "local" || !changes[STORAGE_KEY]?.newValue) {
      return;
    }
    const incoming = normalizeState(changes[STORAGE_KEY].newValue);
    if (JSON.stringify(state.tasks) !== JSON.stringify(incoming.tasks)) {
      state.tasks = incoming.tasks;
      renderTasks();
    }
    if (JSON.stringify(state.notes) !== JSON.stringify(incoming.notes)) {
      state.notes = incoming.notes;
      renderNotes();
    }
  }

  function renderNotes() {
    dom.notesGrid.replaceChildren();
    if (!state.notes.length) {
      const empty = document.createElement("p");
      empty.className = "notes-empty";
      empty.textContent = "Your notes will appear here.";
      dom.notesGrid.append(empty);
      return;
    }
    state.notes.forEach((note, index) => {
      const card = document.createElement("article");
      card.className = `note-card note-color-${note.color}`;
      card.dataset.id = note.id;

      const text = document.createElement("textarea");
      text.className = "note-card-text";
      text.value = note.text;
      text.maxLength = 5000;
      text.setAttribute("aria-label", `Note ${index + 1}`);
      text.placeholder = "Write a note...";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "note-edit-button";
      edit.dataset.action = "edit";
      edit.setAttribute("aria-label", "Edit note");
      edit.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z"/></svg>';

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "note-delete-button";
      remove.dataset.action = "delete";
      remove.setAttribute("aria-label", "Delete note");
      remove.innerHTML = icon("close");

      card.append(text, edit, remove);
      dom.notesGrid.append(card);
    });
  }

  async function addNote() {
    if (state.notes.length >= 100) {
      showToast("You can save up to 100 notes");
      return;
    }
    const note = { id: uid(), text: "", color: state.notes.length % 5 };
    state.notes.unshift(note);
    renderNotes();
    await saveState();
    dom.notesGrid.querySelector(`[data-id="${note.id}"] .note-card-text`)?.focus();
  }

  async function handleNotesGridClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }
    const card = button.closest(".note-card");
    if (!card) {
      return;
    }
    if (button.dataset.action === "edit") {
      card.querySelector(".note-card-text")?.focus();
      return;
    }
    if (button.dataset.action === "delete") {
      state.notes = state.notes.filter((note) => note.id !== card.dataset.id);
      renderNotes();
      await saveState();
    }
  }

  function renderProfile() {
    const username = state.profile.username;
    const displayName = username || "ShortcutX";
    const letter = getProfileLetter(username);
    dom.brandName.textContent = displayName;
    dom.profileButton.setAttribute("aria-label", `Edit ${displayName} profile`);
    renderAvatar(dom.profileAvatar, state.profile.image, letter);
  }

  function toggleProfilePopover() {
    if (isProfilePopoverOpen()) {
      closeProfilePopover();
      return;
    }

    openProfilePopover();
  }

  function openProfilePopover() {
    profileDraftImage = state.profile.image;
    dom.profileUsernameInput.value = state.profile.username;
    renderProfilePreview();
    dom.profilePopover.hidden = false;
    dom.profileButton.setAttribute("aria-expanded", "true");
    setTimeout(() => dom.profileUsernameInput.focus(), 0);
  }

  function closeProfilePopover() {
    dom.profilePopover.hidden = true;
    dom.profileButton.setAttribute("aria-expanded", "false");
  }

  function isProfilePopoverOpen() {
    return !dom.profilePopover.hidden;
  }

  function renderProfilePreview() {
    const username = cleanUsername(dom.profileUsernameInput.value);
    const letter = getProfileLetter(username);
    renderAvatar(dom.profilePreviewAvatar, profileDraftImage, letter);
    dom.profileImageStatus.textContent = profileDraftImage ? "Image selected" : `${letter} letter avatar`;
  }

  function renderAvatar(element, imageUrl, letter) {
    const safeImage = normalizeImageUrl(imageUrl);
    element.classList.toggle("has-image", Boolean(safeImage));
    element.style.backgroundImage = safeImage ? `url("${cssUrl(safeImage)}")` : "";
    element.textContent = safeImage ? "" : letter;
  }

  async function saveProfileFromForm(event) {
    event.preventDefault();
    state.profile = {
      username: cleanUsername(dom.profileUsernameInput.value),
      image: normalizeImageUrl(profileDraftImage)
    };
    await saveState();
    renderProfile();
    closeProfilePopover();
    showToast("Profile saved");
  }

  function clearProfileImage() {
    profileDraftImage = "";
    dom.profileImageFileInput.value = "";
    renderProfilePreview();
    showToast("Profile image removed");
  }

  function handleProfileImageFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      dom.profileImageFileInput.value = "";
      showToast("Choose an image file");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      dom.profileImageFileInput.value = "";
      showToast("Profile image must be under 1 MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      profileDraftImage = normalizeImageUrl(String(reader.result || ""));
      dom.profileImageFileInput.value = "";
      renderProfilePreview();
      showToast("Profile image ready");
    });
    reader.addEventListener("error", () => {
      dom.profileImageFileInput.value = "";
      showToast("Could not read image");
    });
    reader.readAsDataURL(file);
  }

  function renderTopLinks() {
    const anchors = [dom.topLinkOne, dom.topLinkTwo];
    state.settings.topLinks.forEach((link, index) => {
      const anchor = anchors[index];
      const hasLink = Boolean(link.label && link.url);
      anchor.hidden = !hasLink;
      anchor.textContent = link.label || "";
      anchor.href = link.url || "#";
    });
  }

  function syncBackgroundImageInput() {
    if (!dom.backgroundImageInput) {
      return;
    }

    if (isDataImage(state.settings.backgroundImage)) {
      dom.backgroundImageInput.value = "";
      dom.backgroundImageInput.placeholder = "Uploaded image stored locally";
      dom.backgroundImageInput.dataset.localImage = "true";
    } else {
      dom.backgroundImageInput.value = state.settings.backgroundImage;
      dom.backgroundImageInput.placeholder = "https://...";
      delete dom.backgroundImageInput.dataset.localImage;
    }
  }

  function updateBackgroundPresetState() {
    if (!dom.backgroundPresetButtons) {
      return;
    }

    dom.backgroundPresetButtons.forEach((button) => {
      const isActive = !state.settings.backgroundImage &&
        safeColor(button.dataset.background, "") === state.settings.background &&
        safeColor(button.dataset.accent, "") === state.settings.accent;
      button.classList.toggle("is-active", isActive);
    });
  }

  function renderGroups() {
    const groups = getGroups();
    dom.groupTabs.replaceChildren();

    if (!groups.includes(activeGroup)) {
      activeGroup = ALL_GROUP;
    }

    groups.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `group-tab${group === activeGroup ? " is-active" : ""}`;
      button.role = "tab";
      button.ariaSelected = group === activeGroup ? "true" : "false";
      button.textContent = `${group} ${getGroupCount(group)}`;
      button.addEventListener("click", () => {
        activeGroup = group;
        renderAll();
      });
      dom.groupTabs.append(button);
    });
  }

  function renderGroupOptions() {
    dom.groupOptions.replaceChildren();
    getGroups()
      .filter((group) => group !== ALL_GROUP)
      .forEach((group) => {
        const option = document.createElement("option");
        option.value = group;
        dom.groupOptions.append(option);
      });
  }

  function renderGroupManager() {
    const groups = getEditableGroups();
    const previousValue = dom.groupManageSelect.value;
    dom.groupManageSelect.replaceChildren();

    groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = `${group} (${getGroupCount(group)})`;
      dom.groupManageSelect.append(option);
    });

    const selectedGroup = groups.includes(previousValue) ? previousValue : groups[0] || "";
    dom.groupManageSelect.value = selectedGroup;
    dom.groupManageSelect.disabled = groups.length === 0;
    dom.renameGroupInput.disabled = groups.length === 0;
    dom.renameGroupButton.disabled = groups.length === 0;
    dom.deleteGroupButton.disabled = groups.length === 0;
    dom.renameGroupInput.value = selectedGroup;
  }

  function syncSelectedGroupControls() {
    dom.renameGroupInput.value = dom.groupManageSelect.value;
  }

  function renderShortcuts() {
    const visible = getVisibleShortcuts();
    dom.shortcutGrid.replaceChildren();

    visible.forEach((shortcut) => {
      dom.shortcutGrid.append(createShortcutCard(shortcut));
    });

    appendUtilityCards();
    dom.emptyState.hidden = visible.length > 0;
  }

  function createShortcutCard(shortcut) {
    const card = document.createElement("article");
    card.className = "shortcut-card";
    card.draggable = true;
    card.tabIndex = 0;
    card.dataset.id = shortcut.id;
    card.style.setProperty("--tile-color", safeColor(shortcut.color, "#3b82f6"));
    card.role = "link";
    card.setAttribute("aria-label", `Open ${shortcut.title}`);

    card.addEventListener("click", () => openUrl(shortcut.url, shortcut.openMode));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openUrl(shortcut.url, shortcut.openMode);
      }
    });
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("drop", handleDrop);

    const visual = document.createElement("span");
    visual.className = "shortcut-visual";
    visual.append(buildShortcutIcon(shortcut), buildCardMenu(shortcut));

    const meta = document.createElement("span");
    meta.className = "shortcut-meta";

    const title = document.createElement("span");
    title.className = "shortcut-title";
    title.textContent = shortcut.title;

    const url = document.createElement("span");
    url.className = "shortcut-url";
    url.textContent = displayUrl(shortcut.url);

    meta.append(title, url);

    if (shortcut.note) {
      const note = document.createElement("span");
      note.className = "shortcut-note";
      note.textContent = shortcut.note;
      meta.append(note);
    }

    card.append(visual, meta);
    return card;
  }

  function buildShortcutIcon(shortcut) {
    const shortcutIcon = document.createElement("span");
    shortcutIcon.className = "shortcut-icon";

    const imageUrl = getShortcutImage(shortcut);
    if (imageUrl) {
      const image = document.createElement("img");
      image.alt = "";
      image.draggable = false;
      image.src = imageUrl;
      shortcutIcon.classList.add(shortcut.iconType === "image" ? "is-custom-image" : "has-image");
      image.addEventListener("error", () => {
        shortcutIcon.classList.remove("has-image", "is-custom-image");
        shortcutIcon.replaceChildren(document.createTextNode(shortcut.icon || initials(shortcut.title)));
      });
      shortcutIcon.append(image);
    } else {
      shortcutIcon.textContent = shortcut.icon || initials(shortcut.title);
    }

    return shortcutIcon;
  }

  function buildCardMenu(shortcut) {
    const menu = document.createElement("button");
    menu.type = "button";
    menu.className = "card-menu";
    menu.title = "Edit shortcut";
    menu.ariaLabel = `Edit ${shortcut.title}`;
    menu.innerHTML = icon("more");
    menu.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openShortcutEditor(shortcut.id);
    });
    return menu;
  }

  function appendUtilityCards() {
    const utilities = [
      {
        title: "Add",
        iconName: "plus",
        color: state.settings.accent,
        action: () => openShortcutEditor()
      },
      {
        title: "Customize",
        iconName: "settings",
        color: "#94a3b8",
        action: () => openPanel("customize")
      },
      {
        title: "Refresh",
        iconName: "refresh",
        color: "#94a3b8",
        action: () => window.location.reload()
      }
    ];

    utilities.forEach((utility) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shortcut-card utility-card";
      button.style.setProperty("--tile-color", utility.color);
      button.addEventListener("click", utility.action);

      const visual = document.createElement("span");
      visual.className = "shortcut-visual";

      const shortcutIcon = document.createElement("span");
      shortcutIcon.className = "shortcut-icon";
      shortcutIcon.innerHTML = icon(utility.iconName);
      visual.append(shortcutIcon);

      const meta = document.createElement("span");
      meta.className = "shortcut-meta";

      const title = document.createElement("span");
      title.className = "shortcut-title";
      title.textContent = utility.title;
      meta.append(title);

      button.append(visual, meta);
      dom.shortcutGrid.append(button);
    });
  }

  function getVisibleShortcuts() {
    return state.shortcuts.filter((shortcut) => {
      const matchesGroup = activeGroup === ALL_GROUP || shortcut.group === activeGroup;
      return matchesGroup;
    });
  }

  function getGroups() {
    return [ALL_GROUP, ...getEditableGroups()];
  }

  function getEditableGroups() {
    return normalizeGroups(state.groups, state.shortcuts);
  }

  function getGroupCount(group) {
    if (group === ALL_GROUP) {
      return state.shortcuts.length;
    }
    return state.shortcuts.filter((shortcut) => shortcut.group === group).length;
  }

  function openShortcutEditor(id = "") {
    const shortcut = state.shortcuts.find((item) => item.id === id);
    shortcutColorTouched = Boolean(shortcut);
    setActivePanel("shortcut");
    dom.shortcutId.value = shortcut ? shortcut.id : "";
    dom.titleInput.value = shortcut ? shortcut.title : "";
    dom.urlInput.value = shortcut ? shortcut.url : "";
    dom.groupInput.value = shortcut ? shortcut.group : activeGroup === ALL_GROUP ? getDefaultGroupName() : activeGroup;
    dom.iconTypeInput.value = shortcut ? shortcut.iconType : "auto";
    dom.iconInput.value = shortcut ? shortcut.icon : "";
    syncIconImageInput(shortcut ? shortcut.iconImage : "");
    dom.colorInput.value = shortcut ? shortcut.color : getSuggestedShortcutColor("", "");
    syncColorLabels();
    dom.openModeInput.value = shortcut ? shortcut.openMode : DEFAULT_OPEN_MODE;
    dom.noteInput.value = shortcut ? shortcut.note : "";
    syncIconFields();
    openPanel("shortcut");
    dom.deleteShortcutButton.hidden = !shortcut;
    dom.panelTitle.textContent = shortcut ? "Edit shortcut" : "Add shortcut";
    dom.panelSubtitle.textContent = shortcut ? displayUrl(shortcut.url) : "Add or edit one tile.";
    setTimeout(() => dom.titleInput.focus(), 80);
  }

  function openPanel(panel = "shortcut") {
    closeOrganizerWindow();
    setActivePanel(panel);
    dom.panelScrim.hidden = false;
    dom.sidePanel.classList.add("is-open");
    dom.sidePanel.ariaHidden = "false";
  }

  function closePanel() {
    dom.sidePanel.classList.remove("is-open");
    dom.sidePanel.ariaHidden = "true";
    setTimeout(() => {
      if (!dom.sidePanel.classList.contains("is-open")) {
        dom.panelScrim.hidden = true;
      }
    }, 200);
  }

  function setActivePanel(panel) {
    activePanel = panel;
    dom.panelTabs.forEach((tab) => {
      const isActive = tab.dataset.panelTab === activePanel;
      tab.classList.toggle("is-active", isActive);
      tab.ariaSelected = isActive ? "true" : "false";
    });
    dom.panelViews.forEach((view) => {
      view.classList.toggle("is-active", view.dataset.panelView === activePanel);
    });

    const titles = {
      shortcut: ["Shortcut", "Add or edit one tile."],
      customize: ["Customize", "Layout, style, and links."],
      backup: ["Backup", "Export or import local data."]
    };

    const title = titles[activePanel] || titles.shortcut;
    dom.panelTitle.textContent = title[0];
    dom.panelSubtitle.textContent = title[1];
  }

  function openOrganizerWindow() {
    closePanel();
    setOrganizerView("tasks");
    dom.organizerScrim.hidden = false;
    dom.organizerWindow.classList.add("is-open");
    dom.organizerWindow.setAttribute("aria-hidden", "false");
    dom.organizerWindow.inert = false;
    setTimeout(() => dom.taskInput.focus(), 100);
  }

  function closeOrganizerWindow() {
    dom.organizerWindow.classList.remove("is-open");
    dom.organizerWindow.setAttribute("aria-hidden", "true");
    dom.organizerWindow.inert = true;
    setTimeout(() => {
      if (!dom.organizerWindow.classList.contains("is-open")) {
        dom.organizerScrim.hidden = true;
      }
    }, 200);
  }

  function setOrganizerView(view) {
    const showTasks = view === "tasks";
    dom.tasksView.hidden = !showTasks;
    dom.notesView.hidden = showTasks;
    dom.tasksView.classList.toggle("is-active", showTasks);
    dom.notesView.classList.toggle("is-active", !showTasks);
    dom.organizerTasksTab.classList.toggle("is-active", showTasks);
    dom.organizerNotesTab.classList.toggle("is-active", !showTasks);
    dom.organizerTasksTab.setAttribute("aria-selected", String(showTasks));
    dom.organizerNotesTab.setAttribute("aria-selected", String(!showTasks));
    if (!showTasks) {
      setTimeout(() => (dom.notesGrid.querySelector(".note-card-text") || dom.addNoteButton).focus(), 60);
    }
  }

  function syncIconFields() {
    const type = dom.iconTypeInput.value;
    dom.iconTextField.hidden = type !== "text";
    dom.iconImageField.hidden = type !== "image";
  }

  function syncSuggestedShortcutColor() {
    if (shortcutColorTouched || dom.shortcutId.value) {
      return;
    }

    applySuggestedShortcutColor();
  }

  function applyDefaultShortcutColor() {
    shortcutColorTouched = false;
    applySuggestedShortcutColor();
    showToast("Default icon color applied");
  }

  function applySuggestedShortcutColor() {
    dom.colorInput.value = getSuggestedShortcutColor(dom.titleInput.value, dom.urlInput.value);
    syncColorLabels();
  }

  function handleShortcutColorInput() {
    shortcutColorTouched = true;
    syncColorLabels();
  }

  function syncIconImageInput(imageUrl) {
    if (isDataImage(imageUrl)) {
      dom.iconImageInput.value = "";
      dom.iconImageInput.placeholder = "Uploaded image stored locally";
      dom.iconImageInput.dataset.localImage = "true";
      dom.iconImageInput.dataset.imageData = imageUrl;
    } else {
      dom.iconImageInput.value = imageUrl || "";
      dom.iconImageInput.placeholder = "https://...";
      delete dom.iconImageInput.dataset.localImage;
      delete dom.iconImageInput.dataset.imageData;
    }
  }

  function getIconImageFromControls() {
    if (dom.iconImageInput.dataset.localImage === "true") {
      return normalizeImageUrl(dom.iconImageInput.dataset.imageData) || "";
    }

    return normalizeImageUrl(dom.iconImageInput.value) || "";
  }

  function clearIconImageInput() {
    syncIconImageInput("");
    dom.iconImageFileInput.value = "";
    showToast("Icon image cleared");
  }

  function handleIconImageFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      dom.iconImageFileInput.value = "";
      showToast("Choose an image file");
      return;
    }

    if (file.size > MAX_ICON_IMAGE_BYTES) {
      dom.iconImageFileInput.value = "";
      showToast("Icon image must be under 1 MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      dom.iconTypeInput.value = "image";
      syncIconFields();
      syncIconImageInput(String(reader.result || ""));
      dom.iconImageFileInput.value = "";
      showToast("Icon image ready");
    });
    reader.addEventListener("error", () => {
      dom.iconImageFileInput.value = "";
      showToast("Could not read image");
    });
    reader.readAsDataURL(file);
  }

  async function saveShortcutFromForm(event) {
    event.preventDefault();

    const title = dom.titleInput.value.trim();
    const url = normalizeUrl(dom.urlInput.value);
    const selectedIconType = dom.iconTypeInput.value;
    const iconImage = getIconImageFromControls();

    if (!title || !url) {
      showToast("Title and URL are required");
      return;
    }

    if (selectedIconType === "image" && !iconImage) {
      showToast("Icon image URL is invalid");
      return;
    }

    const id = dom.shortcutId.value || uid();
    const existingIndex = state.shortcuts.findIndex((shortcut) => shortcut.id === id);
    const shortcut = {
      id,
      title: title.slice(0, 42),
      url,
      group: cleanGroup(dom.groupInput.value),
      iconType: coerceIconType(selectedIconType, iconImage),
      icon: (dom.iconInput.value.trim() || initials(title)).slice(0, 4),
      iconImage: selectedIconType === "image" ? iconImage : "",
      color: safeColor(dom.colorInput.value, getSuggestedShortcutColor(title, url)),
      note: dom.noteInput.value.trim().slice(0, 96),
      openMode: dom.openModeInput.value === "new" ? "new" : DEFAULT_OPEN_MODE
    };

    if (existingIndex >= 0) {
      state.shortcuts.splice(existingIndex, 1, shortcut);
    } else {
      state.shortcuts.push(shortcut);
    }

    ensureGroup(shortcut.group);
    activeGroup = shortcut.group;
    await saveState();
    renderAll();
    closePanel();
    showToast(existingIndex >= 0 ? "Shortcut updated" : "Shortcut added");
  }

  async function deleteShortcutFromForm() {
    const id = dom.shortcutId.value;
    if (!id) {
      return;
    }

    const shortcut = state.shortcuts.find((item) => item.id === id);
    const confirmed = confirm(`Delete "${shortcut ? shortcut.title : "this shortcut"}"?`);
    if (!confirmed) {
      return;
    }

    state.shortcuts = state.shortcuts.filter((item) => item.id !== id);
    await saveState();
    renderAll();
    closePanel();
    showToast("Shortcut deleted");
  }

  async function addGroupFromControls() {
    const group = cleanGroupName(dom.groupNameInput.value);
    if (!group) {
      showToast("Group name is required");
      return;
    }

    if (group === ALL_GROUP) {
      showToast("All is reserved");
      return;
    }

    if (getEditableGroups().includes(group)) {
      showToast("Group already exists");
      return;
    }

    ensureGroup(group);
    activeGroup = group;
    dom.groupNameInput.value = "";
    await saveState();
    renderAll();
    showToast("Group added");
  }

  async function renameGroupFromControls() {
    const currentGroup = dom.groupManageSelect.value;
    const nextGroup = cleanGroupName(dom.renameGroupInput.value);
    if (!currentGroup) {
      showToast("Select a group first");
      return;
    }

    if (!nextGroup) {
      showToast("New group name is required");
      return;
    }

    if (nextGroup === ALL_GROUP) {
      showToast("All is reserved");
      return;
    }

    if (nextGroup === currentGroup) {
      return;
    }

    if (getEditableGroups().includes(nextGroup)) {
      showToast("Group already exists");
      return;
    }

    state.groups = normalizeGroups(state.groups, state.shortcuts).map((group) => {
      return group === currentGroup ? nextGroup : group;
    });
    state.shortcuts = state.shortcuts.map((shortcut) => {
      return shortcut.group === currentGroup ? { ...shortcut, group: nextGroup } : shortcut;
    });

    if (activeGroup === currentGroup) {
      activeGroup = nextGroup;
    }

    await saveState();
    renderAll();
    dom.groupManageSelect.value = nextGroup;
    syncSelectedGroupControls();
    showToast("Group renamed");
  }

  async function deleteGroupFromControls() {
    const group = dom.groupManageSelect.value;
    if (!group) {
      showToast("Select a group first");
      return;
    }

    const shortcutCount = getGroupCount(group);
    const confirmed = confirm(shortcutCount > 0
      ? `Delete "${group}" and move ${shortcutCount} shortcut${shortcutCount === 1 ? "" : "s"} to another group?`
      : `Delete "${group}"?`);
    if (!confirmed) {
      return;
    }

    const remainingGroups = getEditableGroups().filter((item) => item !== group);
    const fallbackGroup = shortcutCount > 0 ? remainingGroups[0] || "Ungrouped" : "";
    state.groups = remainingGroups;

    if (shortcutCount > 0) {
      ensureGroup(fallbackGroup);
      state.shortcuts = state.shortcuts.map((shortcut) => {
        return shortcut.group === group ? { ...shortcut, group: fallbackGroup } : shortcut;
      });
    }

    if (activeGroup === group) {
      activeGroup = ALL_GROUP;
    }

    await saveState();
    renderAll();
    showToast(shortcutCount > 0 ? `Group deleted; shortcuts moved to ${fallbackGroup}` : "Group deleted");
  }

  function getBackgroundImageFromControls(target) {
    if (target && target.id === "backgroundImageInput") {
      return normalizeImageUrl(dom.backgroundImageInput.value) || "";
    }

    if (dom.backgroundImageInput.dataset.localImage === "true") {
      return state.settings.backgroundImage;
    }

    return normalizeImageUrl(dom.backgroundImageInput.value) || "";
  }

  async function applyBackgroundPreset(button) {
    state.settings.background = safeColor(button.dataset.background, defaultState.settings.background);
    state.settings.accent = safeColor(button.dataset.accent, defaultState.settings.accent);
    state.settings.backgroundImage = "";
    syncFormControls();
    applySettings();
    await saveState();
    showToast("Background updated");
  }

  async function clearBackgroundImage() {
    state.settings.backgroundImage = "";
    syncFormControls();
    applySettings();
    await saveState();
    showToast("Background image cleared");
  }

  function handleBackgroundFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      dom.backgroundFileInput.value = "";
      showToast("Choose an image file");
      return;
    }

    if (file.size > MAX_BACKGROUND_IMAGE_BYTES) {
      dom.backgroundFileInput.value = "";
      showToast("Image must be under 3 MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      state.settings.backgroundImage = String(reader.result || "");
      syncFormControls();
      applySettings();
      await saveState();
      dom.backgroundFileInput.value = "";
      showToast("Background image updated");
    });
    reader.addEventListener("error", () => {
      dom.backgroundFileInput.value = "";
      showToast("Could not read image");
    });
    reader.readAsDataURL(file);
  }

  async function handleSettingsInput(event) {
    const target = event.target;
    if (target === dom.weatherCityInput || target === dom.weatherUnitInput) {
      return;
    }
    state.settings.columns = Number(dom.columnsInput.value);
    state.settings.iconSize = Number(dom.iconSizeInput.value);
    state.settings.gridGap = Number(dom.gridGapInput.value);
    state.settings.tileShape = dom.tileShapeInput.value;
    state.settings.layout = dom.layoutInput.value;
    state.settings.showLabels = dom.labelsInput.checked;
    state.settings.showClock = dom.clockInput.checked;
    state.settings.clockFormat = dom.clockFormatInput.value;
    state.settings.clockAlignment = dom.clockAlignmentInput.value;
    state.settings.showGroups = dom.showGroupsInput.checked;
    tickClock();
    state.settings.theme = dom.themeInput.value;
    state.settings.accent = safeColor(dom.accentInput.value, defaultState.settings.accent);
    state.settings.background = safeColor(dom.backgroundInput.value, defaultState.settings.background);
    state.settings.backgroundImage = getBackgroundImageFromControls(target);
    state.settings.wallpaperDimLevel = Number(dom.wallpaperDimLevelInput.value);
    dom.wallpaperDimLevelOutput.value = `${state.settings.wallpaperDimLevel}%`;
    dom.wallpaperDimLevelOutput.textContent = dom.wallpaperDimLevelOutput.value;
    state.settings.showTopLinks = dom.topLinksInput.checked;
    state.settings.topLinks = normalizeTopLinks([
      { label: dom.topLinkOneLabelInput.value, url: dom.topLinkOneUrlInput.value },
      { label: dom.topLinkTwoLabelInput.value, url: dom.topLinkTwoUrlInput.value }
    ]);

    dom.columnsOutput.value = state.settings.columns;
    dom.iconSizeOutput.value = state.settings.iconSize;
    dom.gridGapOutput.value = state.settings.gridGap;
    syncColorLabels();
    applySettings();
    if (target.id !== "backgroundImageInput") {
      syncBackgroundImageInput();
    }

    await saveState();
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = dom.searchInput.value.trim();
    if (!query) {
      return;
    }
    const match = state.shortcuts.find((shortcut) => shortcut.title.toLowerCase() === query.toLowerCase());
    if (match) {
      openUrl(match.url, match.openMode);
      return;
    }
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  async function sortVisibleShortcuts() {
    const visibleIds = new Set(getVisibleShortcuts().map((shortcut) => shortcut.id));
    const sortedVisible = state.shortcuts
      .filter((shortcut) => visibleIds.has(shortcut.id))
      .sort((a, b) => a.title.localeCompare(b.title));
    let sortedIndex = 0;

    state.shortcuts = state.shortcuts.map((shortcut) => {
      if (!visibleIds.has(shortcut.id)) {
        return shortcut;
      }
      const replacement = sortedVisible[sortedIndex];
      sortedIndex += 1;
      return replacement;
    });

    await saveState();
    renderShortcuts();
    showToast("Visible shortcuts sorted");
  }

  function handleDragStart(event) {
    dragId = event.currentTarget.dataset.id;
    event.currentTarget.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd(event) {
    event.currentTarget.classList.remove("is-dragging");
    dragId = "";
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  async function handleDrop(event) {
    event.preventDefault();
    const targetId = event.currentTarget.dataset.id;
    if (!dragId || dragId === targetId) {
      return;
    }

    const fromIndex = state.shortcuts.findIndex((shortcut) => shortcut.id === dragId);
    const toIndex = state.shortcuts.findIndex((shortcut) => shortcut.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const [moved] = state.shortcuts.splice(fromIndex, 1);
    state.shortcuts.splice(toIndex, 0, moved);
    await saveState();
    renderShortcuts();
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      product: "ShortcutX",
      version: VERSION,
      data: state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shortcutx-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Export started");
  }

  function importData(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const imported = parsed.data || parsed;
        state = normalizeState(imported);
        activeGroup = ALL_GROUP;
        await saveState();
        applySettings();
        syncFormControls();
        renderAll();
        showToast("Import complete");
      } catch (error) {
        console.warn("ShortcutX import failed.", error);
        showToast("Import failed");
      } finally {
        dom.importFileInput.value = "";
      }
    });
    reader.readAsText(file);
  }

  async function resetData() {
    const confirmed = confirm(
      "Reset all ShortcutX data?\n\nThis will remove every shortcut, group, background, layout setting, and customization saved in this browser.\n\nExport your data first if you want a backup before resetting."
    );
    if (!confirmed) {
      return;
    }

    const finalConfirmed = confirm(
      "Final warning: reset everything now?\n\nThis cannot be undone unless you already exported a backup."
    );
    if (!finalConfirmed) {
      return;
    }

    state = clone(defaultState);
    activeGroup = ALL_GROUP;
    await saveState();
    applySettings();
    syncFormControls();
    renderAll();
    closePanel();
    showToast("Reset complete");
  }

  async function saveWeatherCity() {
    const city = dom.weatherCityInput.value.trim();
    if (!city) {
      showToast("Enter a city name");
      return;
    }

    if (!await requestWeatherPermissions(true)) {
      showToast("Allow weather access or use a different location method");
      return;
    }

    dom.saveWeatherCityButton.disabled = true;
    try {
      const params = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      if (!response.ok) {
        throw new Error("Location search failed");
      }
      const result = await response.json();
      const place = result.results && result.results[0];
      if (!place) {
        showToast("Could not find that city");
        return;
      }
      await setWeatherLocation({
        city: [place.name, place.country].filter(Boolean).join(", "),
        latitude: place.latitude,
        longitude: place.longitude
      });
      dom.weatherCityInput.value = state.weather.city;
    } catch (error) {
      showToast("Could not load weather location");
    } finally {
      dom.saveWeatherCityButton.disabled = false;
    }
  }

  function useCurrentLocationForWeather() {
    if (!navigator.geolocation) {
      showToast("Location is not available in this browser");
      return;
    }
    dom.useWeatherLocationButton.disabled = true;
    requestWeatherPermissions(false).then((allowed) => {
      if (!allowed) {
        dom.useWeatherLocationButton.disabled = false;
        showToast("Location permission was not granted");
        return;
      }
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await setWeatherLocation({
            city: "My location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          dom.weatherCityInput.value = state.weather.city;
        } catch (error) {
          showToast("Could not save your weather location");
        } finally {
          dom.useWeatherLocationButton.disabled = false;
        }
      }, (error) => {
        dom.useWeatherLocationButton.disabled = false;
        const message = error.code === error.PERMISSION_DENIED
          ? "Allow location access for ShortcutX in Chrome settings"
          : error.code === error.TIMEOUT
            ? "Location request timed out; try again"
            : "Your location is unavailable right now";
        showToast(message);
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 30 * 60 * 1000 });
    });
  }

  async function requestWeatherPermissions(includeGeocoding) {
    if (!globalThis.chrome?.permissions) {
      return true;
    }
    const origins = ["https://api.open-meteo.com/*"];
    if (includeGeocoding) {
      origins.push("https://geocoding-api.open-meteo.com/*");
    }
    try {
      return await chrome.permissions.request({ origins });
    } catch (error) {
      return false;
    }
  }

  async function setWeatherLocation(location) {
    state.weather.city = location.city;
    state.weather.latitude = location.latitude;
    state.weather.longitude = location.longitude;
    state.weather.cache = null;
    state.weather.cachedAt = 0;
    renderWeather();
    await saveState();
    await refreshWeather(true);
  }

  async function handleWeatherUnitChange() {
    state.weather.unit = dom.weatherUnitInput.value === "fahrenheit" ? "fahrenheit" : "celsius";
    state.weather.cache = null;
    state.weather.cachedAt = 0;
    await saveState();
    await refreshWeather(true);
  }

  function refreshWeatherIfNeeded() {
    if (state.weather.latitude === null || state.weather.longitude === null) {
      renderWeather();
      return;
    }
    if (state.weather.cache && Date.now() - state.weather.cachedAt < 30 * 60 * 1000) {
      renderWeather();
      return;
    }
    if (!globalThis.chrome?.permissions) {
      refreshWeather();
      return;
    }
    chrome.permissions.contains({ origins: ["https://api.open-meteo.com/*"] }, (allowed) => {
      if (allowed) {
        refreshWeather();
      } else {
        renderWeather();
      }
    });
  }

  async function refreshWeather(force = false) {
    if (state.weather.latitude === null || state.weather.longitude === null) {
      renderWeather();
      return;
    }
    if (!force && state.weather.cache && Date.now() - state.weather.cachedAt < 30 * 60 * 1000) {
      renderWeather();
      return;
    }

    try {
      const params = new URLSearchParams({
        latitude: String(state.weather.latitude),
        longitude: String(state.weather.longitude),
        current: "temperature_2m,weather_code,is_day",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        forecast_days: "3",
        timezone: "auto",
        temperature_unit: state.weather.unit
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) {
        throw new Error("Weather request failed");
      }
      const result = await response.json();
      state.weather.cache = {
        temperature: result.current.temperature_2m,
        code: result.current.weather_code,
        isDay: result.current.is_day === 1,
        days: (result.daily.time || []).slice(0, 3).map((date, index) => ({
          date,
          code: result.daily.weather_code[index],
          high: result.daily.temperature_2m_max[index],
          low: result.daily.temperature_2m_min[index]
        }))
      };
      state.weather.cachedAt = Date.now();
      await saveState();
    } catch (error) {
      if (!state.weather.cache) {
        dom.weatherText.textContent = "Weather unavailable";
        dom.weatherWidget.title = "Weather could not be loaded";
      }
    }
    renderWeather();
  }

  function renderWeather() {
    const weather = state.weather;
    if (!weather || weather.latitude === null || weather.longitude === null) {
      dom.weatherIcon.innerHTML = icon("sun");
      dom.weatherText.textContent = "Set weather location";
      dom.weatherWidget.title = "Choose a city or use your location in Customize";
      return;
    }
    if (!weather.cache) {
      dom.weatherIcon.innerHTML = icon("cloud");
      dom.weatherText.textContent = weather.city || "Loading weather…";
      dom.weatherWidget.title = "Weather refreshes every 30 minutes";
      return;
    }

    const description = weatherDescription(weather.cache.code);
    const unitLabel = weather.unit === "fahrenheit" ? "°F" : "°C";
    const temperature = `${Math.round(weather.cache.temperature)}${unitLabel}`;
    dom.weatherIcon.innerHTML = icon(weatherIconName(weather.cache.code));
    dom.weatherText.textContent = `${temperature} · ${weather.city || description}`;
    const forecast = weather.cache.days.map((day) => {
      const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(`${day.date}T12:00:00`));
      return `${weekday} ${Math.round(day.high)}°/${Math.round(day.low)}° ${weatherDescription(day.code)}`;
    }).join(" | ");
    dom.weatherWidget.title = `${description}${forecast ? ` · ${forecast}` : ""}`;
  }

  function weatherDescription(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2].includes(code)) return "Partly cloudy";
    if (code === 3) return "Overcast";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather";
  }

  function weatherIconName(code) {
    if ([95, 96, 99].includes(code)) return "storm";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
    if (code === 0) return "sun";
    return "cloud";
  }

  function tickClock() {
    const now = new Date();
    const use24 = state.settings.clockFormat === "24";
    dom.clockText.dateTime = now.toISOString();
    let clockText = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: !use24
    }).format(now);
    if (!use24) {
      clockText = clockText.replace(/\s?(AM|PM|am|pm|a\.m\.|p\.m\.)\.?/i, "").trim();
    }
    dom.clockText.textContent = clockText;
    dom.dateText.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(now);
  }

  function openUrl(url, mode) {
    if (mode === "new") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  }

  function getShortcutImage(shortcut) {
    if (shortcut.iconType === "image" && shortcut.iconImage) {
      return shortcut.iconImage;
    }

    if (shortcut.iconType === "auto") {
      return faviconUrl(shortcut.url);
    }

    return "";
  }

  function faviconUrl(url) {
    try {
      const parsed = new URL(url);
      if (["http:", "https:"].includes(parsed.protocol)) {
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=128`;
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function getSuggestedShortcutColor(title, rawUrl) {
    const normalizedUrl = normalizeUrl(rawUrl);
    const host = getHostname(normalizedUrl || rawUrl);
    const identity = `${host} ${String(title || "")}`.toLowerCase();

    const brand = brandColors.find((item) => {
      return item.match.some((value) => identity.includes(value));
    });
    if (brand) {
      return brand.color;
    }

    const seed = host || String(title || "").trim();
    if (!seed) {
      return "#3b82f6";
    }

    return generatedColorPalette[hashString(seed) % generatedColorPalette.length];
  }

  function getHostname(value) {
    try {
      const parsed = new URL(value);
      return parsed.hostname.replace(/^www\./, "").toLowerCase();
    } catch (error) {
      const match = String(value || "").trim().match(/^(?:https?:\/\/)?(?:www\.)?([^/?#:]+).*$/i);
      return match ? match[1].toLowerCase() : "";
    }
  }

  function hashString(value) {
    return Array.from(String(value || "")).reduce((hash, character) => {
      return ((hash << 5) - hash + character.charCodeAt(0)) >>> 0;
    }, 0);
  }

  function normalizeUrl(rawUrl) {
    const value = String(rawUrl || "").trim();
    if (!value) {
      return "";
    }

    const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) || /^(mailto|tel|chrome|edge|brave|file):/i.test(value);
    const looksLocal = /^(localhost|(\d{1,3}\.){3}\d{1,3}|\[[^\]]+\])(:\d+)?(\/|$)/i.test(value);
    const withProtocol = hasProtocol ? value : looksLocal ? `http://${value}` : `https://${value}`;

    try {
      const url = new URL(withProtocol);
      if (["http:", "https:", "mailto:", "tel:", "chrome:", "edge:", "brave:", "file:"].includes(url.protocol)) {
        return url.href;
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  function normalizeImageUrl(rawUrl) {
    const value = String(rawUrl || "").trim();
    if (!value) {
      return "";
    }

    if (isDataImage(value)) {
      return value;
    }

    const normalized = normalizeUrl(value);
    if (!normalized) {
      return "";
    }

    try {
      const url = new URL(normalized);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function isDataImage(value) {
    return /^data:image\/[a-z0-9.+-]+;base64,/i.test(String(value || ""));
  }

  function displayUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "mailto:") {
        return parsed.pathname;
      }
      return parsed.hostname ? parsed.hostname.replace(/^www\./, "") : parsed.href;
    } catch (error) {
      return url;
    }
  }

  function cleanGroup(value) {
    return cleanGroupName(value) || getDefaultGroupName();
  }

  function cleanGroupName(value) {
    const group = String(value || "").trim().replace(/\s+/g, " ");
    if (!group || group === ALL_GROUP) {
      return "";
    }

    return group.slice(0, 28);
  }

  function cleanUsername(value) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, 28);
  }

  function getDefaultGroupName() {
    return getEditableGroups()[0] || "General";
  }

  function ensureGroup(value) {
    const group = cleanGroupName(value);
    if (!group) {
      return "";
    }

    if (!state.groups.includes(group)) {
      state.groups.push(group);
      state.groups.sort((a, b) => a.localeCompare(b));
    }

    return group;
  }

  function initials(value) {
    return String(value || "S")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S";
  }

  function getProfileLetter(username) {
    return cleanUsername(username).charAt(0).toUpperCase() || "X";
  }

  function uid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
      const values = new Uint32Array(4);
      globalThis.crypto.getRandomValues(values);
      return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("-");
    }

    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function coerceIconType(value, iconImage = "") {
    if (value === "image") {
      return iconImage ? "image" : "auto";
    }

    if (value === "text") {
      return "text";
    }

    return "auto";
  }

  function safeColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, number));
  }

  function syncColorLabels() {
    if (dom.colorNameOutput && dom.colorInput) {
      dom.colorNameOutput.value = colorDisplayName(dom.colorInput.value);
      dom.colorNameOutput.textContent = dom.colorNameOutput.value;
    }

    if (dom.accentNameOutput && dom.accentInput) {
      dom.accentNameOutput.value = colorDisplayName(dom.accentInput.value);
      dom.accentNameOutput.textContent = dom.accentNameOutput.value;
    }

    if (dom.backgroundNameOutput && dom.backgroundInput) {
      dom.backgroundNameOutput.value = colorDisplayName(dom.backgroundInput.value);
      dom.backgroundNameOutput.textContent = dom.backgroundNameOutput.value;
    }
  }

  function colorDisplayName(value) {
    const color = safeColor(value, "#000000").toLowerCase();
    const exact = namedColors.find((item) => item.hex === color);
    if (exact) {
      return exact.name;
    }

    const rgb = hexToRgb(color);
    if (!rgb) {
      return color.toUpperCase();
    }

    const nearest = namedColors.reduce((best, item) => {
      const distance = colorDistance(rgb, item.rgb);
      return !best || distance < best.distance ? { item, distance } : best;
    }, null);

    return `${nearest.item.name} ${color.toUpperCase()}`;
  }

  function colorDistance(a, b) {
    return Math.sqrt(
      ((a.r - b.r) ** 2) +
      ((a.g - b.g) ** 2) +
      ((a.b - b.b) ** 2)
    );
  }

  function hexToRgb(hex) {
    const color = safeColor(hex, "");
    if (!color) {
      return null;
    }

    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16)
    };
  }

  function readableTextColor(hex) {
    const color = safeColor(hex, "#f8fafc").slice(1);
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 145 ? "#111827" : "#ffffff";
  }

  function cssUrl(url) {
    return String(url).replace(/["\\\n\r\f]/g, "");
  }

  function icon(name) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || ""}</svg>`;
  }

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    toastTimer = setTimeout(() => {
      dom.toast.hidden = true;
    }, 2200);
  }
})();
