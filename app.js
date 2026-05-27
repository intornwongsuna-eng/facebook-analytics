(function (global) {
  "use strict";

  const FB_HEADERS = {
    postId: "ID โพสต์",
    pageId: "ID เพจ",
    pageName: "ชื่อเพจ",
    title: "ชื่อ",
    description: "คำอธิบาย",
    duration: "ระยะเวลา (วินาที)",
    publishedAt: "เวลาที่เผยแพร่",
    permalink: "ลิงก์ถาวร",
    postType: "ประเภทโพสต์",
    views: "ยอดดู",
    reach: "การเข้าถึง",
    engagement: "ความรู้สึก ความคิดเห็น และการแชร์",
    reactions: "ความรู้สึก",
    comments: "ความคิดเห็น",
    shares: "การแชร์",
    clicks: "การคลิกทั้งหมด",
    photoClicks: "การใช้การกำหนดกลุ่มเป้าหมายที่ตรงกัน (Photo Click)",
    otherClicks: "การคลิกอื่นๆ",
    linkClicks: "การคลิกลิงก์",
    videoClicks: "การใช้การกำหนดกลุ่มเป้าหมายที่ตรงกัน (Video Click)",
    watchSeconds: "จำนวนวินาทีที่รับชม",
    avgWatchSeconds: "จำนวนวินาทีที่รับชมโดยเฉลี่ย",
    adImpressions: "อิมเพรสชั่นโฆษณา",
  };

  const IG_HEADERS = {
    postId: "ID โพสต์",
    accountId: "ID บัญชี",
    username: "ชื่อผู้ใช้ของบัญชี",
    accountName: "ชื่อบัญชี",
    description: "คำอธิบาย",
    duration: "ระยะเวลา (วินาที)",
    publishedAt: "เวลาที่เผยแพร่",
    permalink: "ลิงก์ถาวร",
    postType: "ประเภทโพสต์",
    views: "ยอดดู",
    reach: "การเข้าถึง",
    likes: "การกดถูกใจ",
    shares: "แชร์",
    follows: "การติดตาม",
    comments: "ความคิดเห็น",
    saves: "การบันทึก",
  };

  const COLORS = {
    fb: "#1877f2",
    ig: "#d62976",
    green: "#059669",
    amber: "#b7791f",
    red: "#be123c",
    blue: "#2563eb",
    teal: "#0f766e",
    muted: "#64748b",
    grid: "#dbe2ea",
    ink: "#0f172a",
  };

  const DEPARTMENT_RULES = [
    {
      id: "surgery",
      label: "ศัลยกรรม",
      terms: [
        "ศัลยกรรม",
        "ผ่าตัด",
        "ห้องผ่าตัด",
        "หลังผ่าตัด",
        "ก่อนผ่าตัด",
        "เสริมจมูก",
        "ปรับทรงจมูก",
        "ทรงจมูก",
        "จมูก",
        "ตาสองชั้น",
        "ชั้นตา",
        "หนังตาตก",
        "กล้ามเนื้อตาอ่อนแรง",
        "หน้าอก",
        "เสริมอก",
        "ซิลิโคน",
        "ดูดไขมัน",
      ],
    },
    {
      id: "aesthetic",
      label: "หัตถการ / เสริมความงาม",
      terms: [
        "ulthera",
        "ultherapy",
        "ultheraprime",
        "thermage",
        "morpheus",
        "hifu",
        "filler",
        "ฟิลเลอร์",
        "botox",
        "โบท็อก",
        "sculptra",
        "juvelook",
        "rejuran",
        "laser",
        "เลเซอร์",
        "pico",
        "picosure",
        "ฝ้า",
        "กระ",
        "สิว",
        "หลุมสิว",
        "ยกกระชับ",
        "ผิว",
        "ริ้วรอย",
        "เหนียง",
        "กรอบหน้า",
      ],
    },
    {
      id: "brand",
      label: "แบรนด์ / โปรโมชัน / ประกาศ",
      terms: [
        "โปร",
        "โปรโมชั่น",
        "ราคา",
        "คุ้ม",
        "anniversary",
        "golden pass",
        "birthday",
        "รางวัล",
        "academy",
        "wave global",
        "สาขา",
        "ตารางแพทย์",
        "ปิดให้บริการ",
        "สงกรานต์",
        "healthcare heroes",
        "ขอบคุณ",
      ],
    },
  ];

  const state = {
    selectedFiles: {
      facebook: null,
      instagram: null,
    },
    data: {
      facebook: [],
      instagram: [],
    },
    headers: {
      facebook: [],
      instagram: [],
    },
    warnings: [],
    activePlatform: "facebook",
    facebookType: "image",
    filters: {
      facebook: {
        department: "all",
        quality: "all",
        search: "",
      },
      instagram: {
        department: "all",
        quality: "all",
        type: "all",
        search: "",
      },
    },
  };

  function parseCsv(text) {
    const source = String(text || "").replace(/^\uFEFF/, "");
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      const next = source[index + 1];

      if (inQuotes) {
        if (char === '"') {
          if (next === '"') {
            field += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") {
          index += 1;
        }
        row.push(field);
        field = "";
        if (row.some((cell) => cell !== "")) {
          rows.push(row);
        }
        row = [];
      } else {
        field += char;
      }
    }

    if (field !== "" || row.length > 0) {
      row.push(field);
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
    }

    return rows;
  }

  function csvMatrixToObjects(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      return { headers: [], rows: [], warnings: ["CSV ไม่มีข้อมูล"] };
    }

    const headers = matrix[0].map((header) => String(header || "").trim());
    const warnings = [];
    const rows = matrix.slice(1).map((line, rowIndex) => {
      const record = {};
      headers.forEach((header, columnIndex) => {
        record[header] = line[columnIndex] === undefined ? "" : line[columnIndex];
      });
      if (line.length !== headers.length) {
        warnings.push(`แถว ${rowIndex + 2} มี ${line.length} คอลัมน์ แต่ header มี ${headers.length} คอลัมน์`);
      }
      return record;
    });

    return { headers, rows, warnings };
  }

  function parseNumber(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }
    const normalized = String(value || "")
      .replace(/,/g, "")
      .replace(/\s/g, "")
      .trim();
    if (!normalized) {
      return 0;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function parseFacebookDate(value) {
    const text = String(value || "").trim();
    const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
    if (!match) {
      return null;
    }
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    return new Date(year, month - 1, day, hour, minute);
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function classifyDepartment(caption) {
    const normalized = normalizeText(caption);
    const matched = DEPARTMENT_RULES.find((rule) =>
      rule.terms.some((term) => normalized.includes(term.toLowerCase())),
    );
    return matched || DEPARTMENT_RULES.find((rule) => rule.id === "aesthetic");
  }

  function gradeByThreshold(value, gradeA, gradeB) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return "NA";
    }
    if (value >= gradeA) {
      return "A";
    }
    if (value >= gradeB) {
      return "B";
    }
    return "C";
  }

  function normalizeFacebook(records) {
    return records.map((record, index) => {
      const title = String(record[FB_HEADERS.title] || "").trim();
      const description = String(record[FB_HEADERS.description] || "").trim();
      const caption = [title, description].filter(Boolean).join("\n\n").trim();
      const postTypeRaw = String(record[FB_HEADERS.postType] || "").trim();
      const contentType = postTypeRaw.includes("วิดีโอ") ? "video" : "image";
      const duration = parseNumber(record[FB_HEADERS.duration]);
      const avgWatchSeconds = parseNumber(record[FB_HEADERS.avgWatchSeconds]);
      const reach = parseNumber(record[FB_HEADERS.reach]);
      const clicks = parseNumber(record[FB_HEADERS.clicks]);
      const engagement = parseNumber(record[FB_HEADERS.engagement]);
      const ctr = reach ? (clicks / reach) * 100 : 0;
      const engagementRate = reach ? (engagement / reach) * 100 : 0;
      const retentionProxy =
        contentType === "video" && duration > 0 && avgWatchSeconds > 0
          ? (avgWatchSeconds / duration) * 100
          : null;
      const qualityMetric = contentType === "video" ? retentionProxy : ctr;
      const qualityGrade =
        contentType === "video" ? gradeByThreshold(retentionProxy, 10, 5) : gradeByThreshold(ctr, 3.5, 1.5);
      const department = classifyDepartment(caption);

      return {
        platform: "facebook",
        index,
        postId: String(record[FB_HEADERS.postId] || "").trim(),
        caption,
        publishedAt: parseFacebookDate(record[FB_HEADERS.publishedAt]),
        publishedAtText: String(record[FB_HEADERS.publishedAt] || "").trim(),
        permalink: String(record[FB_HEADERS.permalink] || "").trim(),
        postTypeRaw,
        contentType,
        departmentId: department.id,
        departmentLabel: department.label,
        views: parseNumber(record[FB_HEADERS.views]),
        reach,
        engagement,
        reactions: parseNumber(record[FB_HEADERS.reactions]),
        comments: parseNumber(record[FB_HEADERS.comments]),
        shares: parseNumber(record[FB_HEADERS.shares]),
        clicks,
        photoClicks: parseNumber(record[FB_HEADERS.photoClicks]),
        linkClicks: parseNumber(record[FB_HEADERS.linkClicks]),
        videoClicks: parseNumber(record[FB_HEADERS.videoClicks]),
        watchSeconds: parseNumber(record[FB_HEADERS.watchSeconds]),
        avgWatchSeconds,
        duration,
        adImpressions: parseNumber(record[FB_HEADERS.adImpressions]),
        ctr,
        engagementRate,
        retentionProxy,
        qualityMetric,
        qualityGrade,
      };
    });
  }

  function normalizeInstagram(records) {
    return records.map((record, index) => {
      const caption = String(record[IG_HEADERS.description] || "").trim();
      const postTypeRaw = String(record[IG_HEADERS.postType] || "").trim();
      const contentType = postTypeRaw.includes("Reels") ? "video" : "image";
      const reach = parseNumber(record[IG_HEADERS.reach]);
      const likes = parseNumber(record[IG_HEADERS.likes]);
      const shares = parseNumber(record[IG_HEADERS.shares]);
      const follows = parseNumber(record[IG_HEADERS.follows]);
      const comments = parseNumber(record[IG_HEADERS.comments]);
      const saves = parseNumber(record[IG_HEADERS.saves]);
      const engagement = likes + shares + follows + comments + saves;
      const engagementRate = reach ? (engagement / reach) * 100 : 0;
      const department = classifyDepartment(caption);

      return {
        platform: "instagram",
        index,
        postId: String(record[IG_HEADERS.postId] || "").trim(),
        caption,
        publishedAt: parseFacebookDate(record[IG_HEADERS.publishedAt]),
        publishedAtText: String(record[IG_HEADERS.publishedAt] || "").trim(),
        permalink: String(record[IG_HEADERS.permalink] || "").trim(),
        postTypeRaw,
        contentType,
        departmentId: department.id,
        departmentLabel: department.label,
        views: parseNumber(record[IG_HEADERS.views]),
        reach,
        likes,
        shares,
        follows,
        comments,
        saves,
        engagement,
        engagementRate,
        qualityMetric: engagementRate,
        qualityGrade: gradeByThreshold(engagementRate, 2.5, 1.0),
      };
    });
  }

  function processFacebookCsv(text) {
    const matrix = parseCsv(text);
    const parsed = csvMatrixToObjects(matrix);
    return {
      headers: parsed.headers,
      rows: normalizeFacebook(parsed.rows),
      warnings: parsed.warnings,
    };
  }

  function processInstagramCsv(text) {
    const matrix = parseCsv(text);
    const parsed = csvMatrixToObjects(matrix);
    return {
      headers: parsed.headers,
      rows: normalizeInstagram(parsed.rows),
      warnings: parsed.warnings,
    };
  }

  function initDashboard() {
    const facebookInput = document.getElementById("facebookInput");
    const instagramInput = document.getElementById("instagramInput");

    facebookInput.addEventListener("change", (event) => {
      state.selectedFiles.facebook = event.target.files[0] || null;
      setText("facebookFileName", state.selectedFiles.facebook?.name || "ยังไม่ได้เลือกไฟล์ Facebook");
      updateProcessButton();
    });

    instagramInput.addEventListener("change", (event) => {
      state.selectedFiles.instagram = event.target.files[0] || null;
      setText("instagramFileName", state.selectedFiles.instagram?.name || "ยังไม่ได้เลือกไฟล์ Instagram");
      updateProcessButton();
    });

    document.getElementById("processButton").addEventListener("click", processSelectedFiles);

    document.querySelectorAll(".platform-tab").forEach((button) => {
      button.addEventListener("click", () => {
        state.activePlatform = button.dataset.platform;
        renderDashboard();
      });
    });

    document.querySelectorAll("#facebookView .sub-tab").forEach((button) => {
      button.addEventListener("click", () => {
        state.facebookType = button.dataset.type;
        renderDashboard();
      });
    });

    bindFilter("facebookDepartmentFilter", "facebook", "department");
    bindFilter("facebookQualityFilter", "facebook", "quality");
    bindFilter("facebookSearch", "facebook", "search");
    bindFilter("instagramDepartmentFilter", "instagram", "department");
    bindFilter("instagramQualityFilter", "instagram", "quality");
    bindFilter("instagramTypeFilter", "instagram", "type");
    bindFilter("instagramSearch", "instagram", "search");

    updateProcessButton();
    renderDashboard();
    loadSamplesFromQuery();
  }

  function bindFilter(elementId, platform, key) {
    const element = document.getElementById(elementId);
    element.addEventListener(key === "search" ? "input" : "change", (event) => {
      state.filters[platform][key] = event.target.value;
      renderDashboard();
    });
  }

  function updateProcessButton() {
    const hasFile = Boolean(state.selectedFiles.facebook || state.selectedFiles.instagram);
    document.getElementById("processButton").disabled = !hasFile;
  }

  async function processSelectedFiles() {
    const warnings = [];
    if (state.selectedFiles.facebook) {
      const text = await readFileText(state.selectedFiles.facebook);
      const result = processFacebookCsv(text);
      state.data.facebook = result.rows;
      state.headers.facebook = result.headers;
      warnings.push(...result.warnings.map((warning) => `Facebook: ${warning}`));
    }

    if (state.selectedFiles.instagram) {
      const text = await readFileText(state.selectedFiles.instagram);
      const result = processInstagramCsv(text);
      state.data.instagram = result.rows;
      state.headers.instagram = result.headers;
      warnings.push(...result.warnings.map((warning) => `Instagram: ${warning}`));
    }

    state.warnings = warnings;
    if (state.data.facebook.length) {
      state.activePlatform = "facebook";
    } else if (state.data.instagram.length) {
      state.activePlatform = "instagram";
    }
    renderDashboard();
  }

  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
      reader.readAsText(file, "utf-8");
    });
  }

  async function loadSamplesFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const facebookSample = params.get("fb") || params.get("sampleFb");
    const instagramSample = params.get("ig") || params.get("sampleIg");
    if (!facebookSample && !instagramSample) {
      return;
    }

    const warnings = [];
    if (facebookSample) {
      try {
        const text = await fetchLocalSample(facebookSample);
        const result = processFacebookCsv(text);
        state.data.facebook = result.rows;
        state.headers.facebook = result.headers;
        setText("facebookFileName", facebookSample.split("/").pop());
        warnings.push(...result.warnings.map((warning) => `Facebook: ${warning}`));
      } catch (error) {
        warnings.push(`โหลด Facebook sample ไม่สำเร็จ: ${error.message}`);
      }
    }

    if (instagramSample) {
      try {
        const text = await fetchLocalSample(instagramSample);
        const result = processInstagramCsv(text);
        state.data.instagram = result.rows;
        state.headers.instagram = result.headers;
        setText("instagramFileName", instagramSample.split("/").pop());
        warnings.push(...result.warnings.map((warning) => `Instagram: ${warning}`));
      } catch (error) {
        warnings.push(`โหลด Instagram sample ไม่สำเร็จ: ${error.message}`);
      }
    }

    state.warnings = warnings;
    state.activePlatform = state.data.facebook.length ? "facebook" : "instagram";
    renderDashboard();
  }

  async function fetchLocalSample(samplePath) {
    const url = new URL(samplePath, window.location.href);
    if (url.origin !== window.location.origin) {
      throw new Error("sample ต้องอยู่ใน origin เดียวกัน");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  }

  function renderDashboard() {
    renderStatus();
    renderNotices();
    renderPlatformTabs();

    const hasData = state.data.facebook.length > 0 || state.data.instagram.length > 0;
    toggle("emptyState", !hasData);
    toggle("facebookView", hasData && state.activePlatform === "facebook" && state.data.facebook.length > 0);
    toggle("instagramView", hasData && state.activePlatform === "instagram" && state.data.instagram.length > 0);

    if (!hasData) {
      return;
    }

    if (state.activePlatform === "facebook" && state.data.facebook.length) {
      renderFacebook();
    } else if (state.activePlatform === "instagram" && state.data.instagram.length) {
      renderInstagram();
    }
  }

  function renderStatus() {
    setText("facebookStatus", statusText(state.data.facebook));
    setText("instagramStatus", statusText(state.data.instagram));
    setText("activeStatus", activeStatusText());
  }

  function statusText(rows) {
    if (!rows.length) {
      return "ยังไม่มีข้อมูล";
    }
    return `${formatInteger(rows.length)} โพสต์ | ${getDateRange(rows)}`;
  }

  function activeStatusText() {
    const rows = state.activePlatform === "facebook" ? getFilteredFacebookRows() : getFilteredInstagramRows();
    if (!rows.length) {
      return "-";
    }
    return `${state.activePlatform === "facebook" ? "Facebook" : "Instagram"} | ${formatInteger(rows.length)} โพสต์ที่ผ่าน filter`;
  }

  function renderNotices() {
    const notice = document.getElementById("noticeBox");
    if (!state.warnings.length) {
      notice.hidden = true;
      notice.innerHTML = "";
      return;
    }
    notice.hidden = false;
    notice.innerHTML = state.warnings.slice(0, 5).map(escapeHtml).join("<br />");
  }

  function renderPlatformTabs() {
    setText("facebookTabCount", state.data.facebook.length);
    setText("instagramTabCount", state.data.instagram.length);
    document.querySelectorAll(".platform-tab").forEach((tab) => {
      const isActive = tab.dataset.platform === state.activePlatform;
      tab.classList.toggle("active", isActive);
    });
    document.getElementById("tabFacebook").disabled = state.data.facebook.length === 0;
    document.getElementById("tabInstagram").disabled = state.data.instagram.length === 0;
  }

  function renderFacebook() {
    const allRows = state.data.facebook;
    const imageCount = allRows.filter((row) => row.contentType === "image").length;
    const videoCount = allRows.filter((row) => row.contentType === "video").length;
    setText("facebookImageCount", imageCount);
    setText("facebookVideoCount", videoCount);
    document.getElementById("facebookImageTab").classList.toggle("active", state.facebookType === "image");
    document.getElementById("facebookImageTab").classList.toggle("fb", state.facebookType === "image");
    document.getElementById("facebookVideoTab").classList.toggle("active", state.facebookType === "video");
    document.getElementById("facebookVideoTab").classList.toggle("fb", state.facebookType === "video");

    const rows = getFilteredFacebookRows();
    renderKpis("facebookKpis", facebookKpis(rows), "kpi-fb");
    document.getElementById("facebookTrendChart").innerHTML = renderTrendChart(rows, "facebook");
    document.getElementById("facebookDepartmentChart").innerHTML = renderBarChart(groupBy(rows, "departmentLabel", "reach"), {
      color: COLORS.fb,
      valueLabel: "Reach",
    });
    document.getElementById("facebookTopChart").innerHTML = renderTopChart(getTopRows(rows, "reach", 10), "reach", COLORS.fb);
    renderFacebookTable(rows);
  }

  function renderInstagram() {
    const rows = getFilteredInstagramRows();
    renderKpis("instagramKpis", instagramKpis(rows), "kpi-ig");
    document.getElementById("instagramTrendChart").innerHTML = renderTrendChart(rows, "instagram");
    document.getElementById("instagramGradeChart").innerHTML = renderBarChart(groupBy(rows, "qualityGrade", "reach"), {
      color: COLORS.ig,
      valueLabel: "Reach",
      labelMap: gradeLabel,
    });
    document.getElementById("instagramTopChart").innerHTML = renderTopChart(getTopRows(rows, "engagementRate", 10), "engagementRate", COLORS.ig);
    renderInstagramTable(rows);
  }

  function getFilteredFacebookRows() {
    const filters = state.filters.facebook;
    return state.data.facebook
      .filter((row) => row.contentType === state.facebookType)
      .filter((row) => filters.department === "all" || row.departmentId === filters.department)
      .filter((row) => filters.quality === "all" || row.qualityGrade === filters.quality)
      .filter((row) => matchesSearch(row, filters.search));
  }

  function getFilteredInstagramRows() {
    const filters = state.filters.instagram;
    return state.data.instagram
      .filter((row) => filters.department === "all" || row.departmentId === filters.department)
      .filter((row) => filters.quality === "all" || row.qualityGrade === filters.quality)
      .filter((row) => filters.type === "all" || row.contentType === filters.type)
      .filter((row) => matchesSearch(row, filters.search));
  }

  function matchesSearch(row, search) {
    const term = normalizeText(search);
    if (!term) {
      return true;
    }
    return normalizeText(row.caption).includes(term) || normalizeText(row.postTypeRaw).includes(term);
  }

  function facebookKpis(rows) {
    const summary = summarizeRows(rows);
    const metricName = state.facebookType === "video" ? "Avg Retention Proxy" : "Avg CTR";
    const metricValue =
      state.facebookType === "video"
        ? averageMetric(rows.map((row) => row.retentionProxy).filter((value) => value !== null))
        : weightedPercent(rows, "clicks", "reach");
    return [
      { label: "Posts", value: formatInteger(rows.length), meta: state.facebookType === "video" ? "วิดีโอ" : "ภาพนิ่ง", accent: "kpi-fb" },
      { label: "Reach", value: formatInteger(summary.reach), meta: "หลัง filter", accent: "kpi-blue" },
      { label: "Views", value: formatInteger(summary.views), meta: "ยอดดูรวม", accent: "kpi-teal" },
      { label: "Engagement", value: formatInteger(summary.engagement), meta: "reactions + comments + shares", accent: "kpi-green" },
      { label: "Clicks", value: formatInteger(summary.clicks), meta: `${formatInteger(summary.linkClicks)} link clicks`, accent: "kpi-amber" },
      { label: metricName, value: metricValue === null ? "N/A" : `${metricValue.toFixed(1)}%`, meta: "benchmark metric", accent: "kpi-fb" },
    ];
  }

  function instagramKpis(rows) {
    const summary = summarizeRows(rows);
    const totalSaves = sumBy(rows, "saves");
    const totalFollows = sumBy(rows, "follows");
    return [
      { label: "Posts", value: formatInteger(rows.length), meta: "หลัง filter", accent: "kpi-ig" },
      { label: "Reach", value: formatInteger(summary.reach), meta: "รวมทุกโพสต์", accent: "kpi-blue" },
      { label: "Views", value: formatInteger(summary.views), meta: "ยอดดูรวม", accent: "kpi-teal" },
      { label: "Engagement", value: formatInteger(summary.engagement), meta: "likes + comments + shares + saves", accent: "kpi-green" },
      { label: "ER", value: `${weightedPercentByValue(summary.engagement, summary.reach).toFixed(1)}%`, meta: "engagement / reach", accent: "kpi-ig" },
      { label: "Saves / Follows", value: `${formatInteger(totalSaves)} / ${formatInteger(totalFollows)}`, meta: "high-intent actions", accent: "kpi-amber" },
    ];
  }

  function summarizeRows(rows) {
    return {
      posts: rows.length,
      reach: sumBy(rows, "reach"),
      views: sumBy(rows, "views"),
      engagement: sumBy(rows, "engagement"),
      clicks: sumBy(rows, "clicks"),
      linkClicks: sumBy(rows, "linkClicks"),
    };
  }

  function sumBy(rows, field) {
    return rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
  }

  function weightedPercent(rows, numeratorField, denominatorField) {
    const denominator = sumBy(rows, denominatorField);
    if (!denominator) {
      return 0;
    }
    return (sumBy(rows, numeratorField) / denominator) * 100;
  }

  function weightedPercentByValue(numerator, denominator) {
    return denominator ? (numerator / denominator) * 100 : 0;
  }

  function averageMetric(values) {
    if (!values.length) {
      return null;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function renderKpis(containerId, cards) {
    document.getElementById(containerId).innerHTML = cards
      .map(
        (card) => `
          <article class="kpi-card ${card.accent}">
            <p class="label">${escapeHtml(card.label)}</p>
            <p class="value">${escapeHtml(card.value)}</p>
            <p class="meta">${escapeHtml(card.meta)}</p>
          </article>
        `,
      )
      .join("");
  }

  function renderFacebookTable(rows) {
    const isVideo = state.facebookType === "video";
    document.getElementById("facebookTableHead").innerHTML = `
      <tr>
        <th>#</th>
        <th>เนื้อหา</th>
        <th>แผนก</th>
        <th>Reach</th>
        <th>Views</th>
        <th>Engagement</th>
        <th>Clicks</th>
        <th>${isVideo ? "Retention Proxy" : "CTR"}</th>
        <th>Grade</th>
        <th>ลิงก์</th>
      </tr>
    `;

    document.getElementById("facebookTableBody").innerHTML =
      getTopRows(rows, "reach", 80)
        .map(
          (row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="post-title">${escapeHtml(truncate(row.caption, 150))}</div>
                <div class="post-meta">${escapeHtml(formatDateTime(row.publishedAt, row.publishedAtText))} | ${escapeHtml(row.postTypeRaw)}</div>
              </td>
              <td><span class="pill pill-dept">${escapeHtml(row.departmentLabel)}</span></td>
              <td>${formatInteger(row.reach)}</td>
              <td>${formatInteger(row.views)}</td>
              <td>${formatInteger(row.engagement)}</td>
              <td>${formatInteger(row.clicks)}</td>
              <td>${formatMetric(row.qualityMetric)}</td>
              <td>${renderGrade(row.qualityGrade)}</td>
              <td class="link-cell">${renderPostLink(row.permalink)}</td>
            </tr>
          `,
        )
        .join("") || emptyTableRow(10);
  }

  function renderInstagramTable(rows) {
    document.getElementById("instagramTableBody").innerHTML =
      getTopRows(rows, "engagementRate", 100)
        .map(
          (row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="post-title">${escapeHtml(truncate(row.caption, 150))}</div>
                <div class="post-meta">${escapeHtml(formatDateTime(row.publishedAt, row.publishedAtText))}</div>
              </td>
              <td><span class="pill pill-dept">${escapeHtml(row.departmentLabel)}</span></td>
              <td>${escapeHtml(row.postTypeRaw)}</td>
              <td>${formatInteger(row.reach)}</td>
              <td>${formatInteger(row.views)}</td>
              <td>${formatInteger(row.engagement)}</td>
              <td>${formatMetric(row.engagementRate)}</td>
              <td>${renderGrade(row.qualityGrade)}</td>
              <td class="link-cell">${renderPostLink(row.permalink)}</td>
            </tr>
          `,
        )
        .join("") || emptyTableRow(10);
  }

  function renderTrendChart(rows, platform) {
    const data = aggregateWeekly(rows);
    if (!data.length) {
      return renderNoData("ไม่มีข้อมูลสำหรับ trend");
    }

    const width = 980;
    const height = 320;
    const pad = { top: 28, right: 28, bottom: 54, left: 70 };
    const plotWidth = width - pad.left - pad.right;
    const plotHeight = height - pad.top - pad.bottom;
    const series =
      platform === "facebook"
        ? [
            { key: "reach", label: "Reach", color: COLORS.fb },
            { key: "engagement", label: "Engagement", color: COLORS.green },
            { key: "clicks", label: "Clicks", color: COLORS.amber },
          ]
        : [
            { key: "reach", label: "Reach", color: COLORS.ig },
            { key: "engagement", label: "Engagement", color: COLORS.green },
            { key: "views", label: "Views", color: COLORS.blue },
          ];
    const maxY = Math.max(1, ...data.flatMap((row) => series.map((item) => row[item.key] || 0)));
    const x = (index) =>
      pad.left + (data.length === 1 ? plotWidth / 2 : (plotWidth * index) / (data.length - 1));
    const y = (value) => pad.top + plotHeight - (plotHeight * value) / maxY;

    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map((step) => {
        const yPos = pad.top + plotHeight - plotHeight * step;
        return `<line x1="${pad.left}" y1="${yPos}" x2="${width - pad.right}" y2="${yPos}" stroke="${COLORS.grid}" />
          <text x="10" y="${yPos + 4}" class="axis-label">${formatCompact(maxY * step)}</text>`;
      })
      .join("");

    const lines = series
      .map((item) => {
        const points = data.map((row, index) => `${x(index)},${y(row[item.key] || 0)}`).join(" ");
        const dots = data
          .map((row, index) => `<circle cx="${x(index)}" cy="${y(row[item.key] || 0)}" r="3.4" fill="${item.color}" />`)
          .join("");
        return `<polyline points="${points}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />${dots}`;
      })
      .join("");

    const labels = data
      .map((row, index) => {
        const show = data.length <= 9 || index % Math.ceil(data.length / 8) === 0 || index === data.length - 1;
        return show
          ? `<text x="${x(index)}" y="${height - 18}" text-anchor="middle" class="axis-label">${escapeHtml(row.label.slice(5))}</text>`
          : "";
      })
      .join("");

    return `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Weekly trend chart">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white"></rect>
        ${grid}
        ${lines}
        ${labels}
      </svg>
      ${renderLegend(series)}
    `;
  }

  function renderBarChart(data, options) {
    if (!data.length) {
      return renderNoData("ไม่มีข้อมูลสำหรับ chart");
    }

    const rows = data.slice(0, 8);
    const width = 640;
    const rowHeight = 44;
    const height = 40 + rows.length * rowHeight;
    const labelWidth = 220;
    const barWidth = width - labelWidth - 48;
    const maxValue = Math.max(1, ...rows.map((row) => row.value));
    const bars = rows
      .map((row, index) => {
        const y = 24 + index * rowHeight;
        const widthValue = (barWidth * row.value) / maxValue;
        const label = options.labelMap ? options.labelMap(row.label) : row.label;
        return `
          <text x="0" y="${y + 14}" class="chart-title-label">${escapeHtml(truncate(label, 28))}</text>
          <text x="0" y="${y + 31}" class="axis-label">${row.posts} posts</text>
          <rect x="${labelWidth}" y="${y}" width="${widthValue}" height="18" rx="5" fill="${options.color}" />
          <text x="${labelWidth + widthValue + 8}" y="${y + 14}" class="axis-label">${formatCompact(row.value)}</text>
        `;
      })
      .join("");

    return `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white"></rect>
        ${bars}
      </svg>
      ${renderLegend([{ label: options.valueLabel || "Value", color: options.color }])}
    `;
  }

  function renderTopChart(rows, field, color) {
    if (!rows.length) {
      return renderNoData("ไม่มีข้อมูลโพสต์");
    }

    const width = 640;
    const rowHeight = 42;
    const height = 32 + rows.length * rowHeight;
    const labelWidth = 250;
    const barWidth = width - labelWidth - 48;
    const maxValue = Math.max(1, ...rows.map((row) => row[field] || 0));
    const bars = rows
      .map((row, index) => {
        const y = 20 + index * rowHeight;
        const value = row[field] || 0;
        const widthValue = (barWidth * value) / maxValue;
        return `
          <text x="0" y="${y + 14}" class="chart-label">${index + 1}. ${escapeHtml(truncate(row.caption, 34))}</text>
          <rect x="${labelWidth}" y="${y}" width="${widthValue}" height="18" rx="5" fill="${color}" />
          <text x="${labelWidth + widthValue + 7}" y="${y + 14}" class="axis-label">${field === "engagementRate" ? `${value.toFixed(1)}%` : formatCompact(value)}</text>
        `;
      })
      .join("");

    return `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Top posts chart">
        <rect x="0" y="0" width="${width}" height="${height}" fill="white"></rect>
        ${bars}
      </svg>
    `;
  }

  function aggregateWeekly(rows) {
    const grouped = new Map();
    rows
      .filter((row) => row.publishedAt)
      .forEach((row) => {
        const week = formatDate(getWeekStart(row.publishedAt));
        if (!grouped.has(week)) {
          grouped.set(week, { label: week, posts: 0, reach: 0, views: 0, engagement: 0, clicks: 0 });
        }
        const bucket = grouped.get(week);
        bucket.posts += 1;
        bucket.reach += row.reach || 0;
        bucket.views += row.views || 0;
        bucket.engagement += row.engagement || 0;
        bucket.clicks += row.clicks || 0;
      });
    return Array.from(grouped.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  function groupBy(rows, labelField, valueField) {
    const grouped = new Map();
    rows.forEach((row) => {
      const label = row[labelField] || "Unknown";
      if (!grouped.has(label)) {
        grouped.set(label, { label, posts: 0, value: 0 });
      }
      const bucket = grouped.get(label);
      bucket.posts += 1;
      bucket.value += row[valueField] || 0;
    });
    return Array.from(grouped.values()).sort((a, b) => b.value - a.value);
  }

  function getWeekStart(date) {
    const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const offset = (copy.getDay() + 6) % 7;
    copy.setDate(copy.getDate() - offset);
    return copy;
  }

  function getTopRows(rows, field, limit) {
    return [...rows].sort((a, b) => (b[field] || 0) - (a[field] || 0)).slice(0, limit);
  }

  function getDateRange(rows) {
    const dates = rows.map((row) => row.publishedAt).filter(Boolean);
    if (!dates.length) {
      return "-";
    }
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    return `${formatDate(min)} - ${formatDate(max)}`;
  }

  function renderLegend(items) {
    return `
      <div class="legend">
        ${items
          .map(
            (item) => `
              <span class="legend-item">
                <span class="swatch" style="background:${item.color}"></span>
                ${escapeHtml(item.label)}
              </span>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderGrade(grade) {
    const className = grade === "A" ? "grade-a" : grade === "B" ? "grade-b" : grade === "C" ? "grade-c" : "grade-na";
    return `<span class="grade-chip ${className}">${escapeHtml(gradeLabel(grade))}</span>`;
  }

  function gradeLabel(grade) {
    if (grade === "A") return "Grade A";
    if (grade === "B") return "Grade B";
    if (grade === "C") return "Grade C";
    return "N/A";
  }

  function renderPostLink(url) {
    if (!url) {
      return "-";
    }
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">เปิดโพสต์</a>`;
  }

  function renderNoData(message) {
    return `<div class="empty-state"><p>${escapeHtml(message)}</p></div>`;
  }

  function emptyTableRow(colspan) {
    return `<tr><td colspan="${colspan}">ไม่พบข้อมูลตาม filter ปัจจุบัน</td></tr>`;
  }

  function toggle(id, visible) {
    const element = document.getElementById(id);
    if (element) {
      element.hidden = !visible;
    }
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function formatInteger(value) {
    return Math.round(Number(value) || 0).toLocaleString("en-US");
  }

  function formatCompact(value) {
    const number = Number(value) || 0;
    if (Math.abs(number) >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(number) >= 1000) {
      return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`;
    }
    return `${Math.round(number)}`;
  }

  function formatMetric(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return "N/A";
    }
    return `${Number(value).toFixed(1)}%`;
  }

  function formatDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
      return "-";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDateTime(date, fallback) {
    if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
      return fallback || "-";
    }
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${formatDate(date)} ${hour}:${minute}`;
  }

  function truncate(value, maxLength) {
    const normalized = String(value || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return "-";
    }
    if (normalized.length <= maxLength) {
      return normalized;
    }
    return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const api = {
    FB_HEADERS,
    IG_HEADERS,
    parseCsv,
    csvMatrixToObjects,
    parseNumber,
    parseFacebookDate,
    classifyDepartment,
    gradeByThreshold,
    normalizeFacebook,
    normalizeInstagram,
    processFacebookCsv,
    processInstagramCsv,
    summarizeRows,
    aggregateWeekly,
    groupBy,
    formatDate,
  };

  global.KVKAnalytics = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initDashboard);
  }
})(typeof window !== "undefined" ? window : globalThis);
