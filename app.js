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
    threeSecondViews: "การรับชมวิดีโอนาน 3 วินาที",
    oneMinuteViews: "การรับชมวิดีโอนาน 1 นาที",
    uniqueThreeSecondViewers: "ผู้ที่รับชมนาน 3 วินาที",
    uniqueOneMinuteViewers: "ผู้ที่รับชมนาน 1 นาที",
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

  const YT_HEADERS = {
    videoId: "เนื้อหา",
    title: "ชื่อวิดีโอ",
    publishedAt: "เวลาเผยแพร่วิดีโอ",
    duration: "ระยะเวลา",
    engagedViews: "ยอดดูอย่างมีส่วนร่วม",
    averageViewPercentage: "เปอร์เซ็นต์การดูโดยเฉลี่ย (%)",
    stayedToWatch: "อยู่ดูต่อไป (%)",
    views: "จำนวนการดู",
    watchHours: "เวลาในการรับชม (ชั่วโมง)",
    subscribers: "ผู้ติดตาม",
    averageViewDuration: "ระยะเวลาการดูโดยเฉลี่ย",
    impressions: "การแสดงผล",
    impressionsCtr: "อัตราการคลิกผ่านการแสดงผล (%)",
  };

  const COLORS = {
    fb: "#1877f2",
    ig: "#d62976",
    yt: "#dc2626",
    green: "#059669",
    amber: "#b7791f",
    red: "#be123c",
    blue: "#2563eb",
    teal: "#0f766e",
    muted: "#64748b",
    grid: "#dbe2ea",
    ink: "#0f172a",
  };

  const MARKET_BENCHMARKS = {
    facebook_image: {
      metricField: "engagementRate",
      gradeA: 1.9,
      gradeB: 1.0,
      basis: "Global Healthcare benchmark 2025; applied to Engagement / Reach",
    },
    facebook_video_actual_3s: {
      metricField: "threeSecondViewerRate",
      gradeA: 30,
      gradeB: 20,
      secondaryMetricField: "oneMinuteContinuationRate",
      secondaryGradeA: 15,
      secondaryGradeB: 8,
      basis: "Meta Hook working range plus 1-minute continuation standard; long videos must pass both stages",
    },
    facebook_video_watch_ratio: {
      metricField: "averageWatchRatio",
      gradeA: 30,
      gradeB: 15,
      basis: "Fallback video watch-ratio standard; actual 3s data unavailable",
    },
    instagram_image: {
      metricField: "engagementRate",
      gradeA: 3.7,
      gradeB: 2.0,
      basis: "Global Healthcare 2025 and Beauty 2026; applied to Engagement / Reach",
    },
    instagram_video: {
      metricField: "engagementRate",
      gradeA: 3.7,
      gradeB: 2.0,
      basis: "Global Healthcare 2025 and Beauty 2026; applied to Engagement / Reach",
    },
    youtube_short: {
      metricField: "qualityScore",
      gradeA: 70,
      gradeB: 50,
      secondaryMetricField: "stayedToWatch",
      secondaryGradeA: 60,
      secondaryGradeB: 45,
      basis: "YouTube Shorts working standard 2026; APV is capped at 100 and read together with Stayed to Watch",
    },
    youtube_long_under_5: {
      metricField: "qualityScore",
      gradeA: 60,
      gradeB: 50,
      basis: "Length-adjusted YouTube retention working standard 2026; videos under 5 minutes",
    },
    youtube_long_5_10: {
      metricField: "qualityScore",
      gradeA: 55,
      gradeB: 45,
      basis: "Length-adjusted YouTube retention working standard 2026; videos 5-10 minutes",
    },
    youtube_long_10_20: {
      metricField: "qualityScore",
      gradeA: 50,
      gradeB: 40,
      basis: "Length-adjusted YouTube retention working standard 2026; videos 10-20 minutes",
    },
    youtube_long_20_plus: {
      metricField: "qualityScore",
      gradeA: 45,
      gradeB: 35,
      basis: "Length-adjusted YouTube retention working standard 2026; videos over 20 minutes",
    },
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
        "kvksurgery",
        "#kvksurgery",
        "surgery",
        "ถุงใต้ตา",
        "ถุงไขมันใต้ตา",
        "ดูดเหนียง",
        "ตัดเหนียง",
        "คางสองชั้น",
        "ไขมันใต้คาง",
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
      youtube: null,
    },
    data: {
      facebook: [],
      instagram: [],
      youtube: [],
    },
    headers: {
      facebook: [],
      instagram: [],
      youtube: [],
    },
    warnings: [],
    activePlatform: "facebook",
    facebookType: "image",
    activeDetail: null,
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
      youtube: {
        quality: "all",
        type: "all",
        search: "",
      },
    },
  };

  const DEFAULT_SAMPLE_FILES = {
    facebook: "sources/Apr-28-2026_May-25-2026_2176080329882985.csv",
    instagram: "sources/ig-Feb-26-2026_May-26-2026_1979714872637295.csv",
    youtube: "../Youtube data.xlsx",
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

  function parseOptionalNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed || trimmed === "14" || trimmed === "-" || trimmed === "—" || trimmed.toLowerCase() === "n/a") {
        return null;
      }
    }
    const parsed = parseNumber(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function parseYoutubeDate(value) {
    const text = String(value || "").trim();
    if (!text || text === "14") {
      return null;
    }
    const date = new Date(text);
    return Number.isNaN(date.valueOf()) ? null : date;
  }

  function parseDurationText(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }
    const text = String(value || "").trim();
    if (!text || text === "14") {
      return 0;
    }
    if (/^\d+(\.\d+)?$/.test(text)) {
      return Number(text);
    }
    const parts = text.split(":").map(Number);
    if (parts.some((part) => Number.isNaN(part))) {
      return 0;
    }
    return parts.reduce((total, part) => total * 60 + part, 0);
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

  function applyMarketGrades(rows) {
    rows.forEach((row) => {
      const benchmark = MARKET_BENCHMARKS[row.benchmarkGroup];
      const value = benchmark ? Number(row[benchmark.metricField]) : NaN;
      const requiresOneMinute = row.benchmarkGroup === "facebook_video_actual_3s" && Number(row.duration) >= 60;
      const secondarySourceValue = benchmark?.secondaryMetricField
        ? row[benchmark.secondaryMetricField]
        : null;
      const secondaryValue = secondarySourceValue === null || secondarySourceValue === undefined
        ? NaN
        : Number(secondarySourceValue);
      const requiresYoutubeShortStayed = row.benchmarkGroup === "youtube_short";
      const requiresSecondary = requiresOneMinute
        || requiresYoutubeShortStayed
        || (benchmark?.secondaryMetricField && Number.isFinite(secondaryValue));
      if (!benchmark || !row.dataValid || !Number.isFinite(value)) {
        row.qualityGrade = "NA";
        row.benchmarkGradeA = benchmark?.gradeA ?? null;
        row.benchmarkGradeB = benchmark?.gradeB ?? null;
        row.benchmarkSecondaryGradeA = benchmark?.secondaryGradeA ?? null;
        row.benchmarkSecondaryGradeB = benchmark?.secondaryGradeB ?? null;
        row.benchmarkBasis = benchmark?.basis || "Insufficient source data";
        return;
      }
      if (requiresSecondary && !Number.isFinite(secondaryValue)) {
        const missingSecondaryLabel = requiresYoutubeShortStayed
          ? "Stayed to Watch metric"
          : "actual 1-minute metric";
        row.qualityGrade = "NA";
        row.primaryGrade = gradeByThreshold(value, benchmark.gradeA, benchmark.gradeB);
        row.secondaryGrade = "NA";
        row.benchmarkGradeA = benchmark.gradeA;
        row.benchmarkGradeB = benchmark.gradeB;
        row.benchmarkSecondaryGradeA = benchmark.secondaryGradeA;
        row.benchmarkSecondaryGradeB = benchmark.secondaryGradeB;
        row.benchmarkBasis = `${benchmark.basis}; missing ${missingSecondaryLabel}`;
        return;
      }
      row.qualityMetric = value;
      row.primaryGrade = gradeByThreshold(value, benchmark.gradeA, benchmark.gradeB);
      row.secondaryGrade = requiresSecondary
        ? gradeByThreshold(secondaryValue, benchmark.secondaryGradeA, benchmark.secondaryGradeB)
        : null;
      row.qualityGrade = requiresSecondary
        ? worstGrade(row.primaryGrade, row.secondaryGrade)
        : row.primaryGrade;
      row.benchmarkGradeA = benchmark.gradeA;
      row.benchmarkGradeB = benchmark.gradeB;
      row.benchmarkSecondaryGradeA = benchmark.secondaryGradeA ?? null;
      row.benchmarkSecondaryGradeB = benchmark.secondaryGradeB ?? null;
      row.benchmarkBasis = benchmark.basis;
    });
    return rows;
  }

  function worstGrade(...grades) {
    const order = { A: 3, B: 2, C: 1, NA: 0 };
    return grades.reduce((worst, grade) => (order[grade] < order[worst] ? grade : worst), "A");
  }

  function evaluateFacebookVideo(rowLike) {
    const avgWatchSeconds = Number(rowLike.avgWatchSeconds) || 0;
    const duration = Number(rowLike.duration) || 0;
    const reach = Number(rowLike.reach) || 0;
    const uniqueThreeSecondViewers = parseOptionalNumber(rowLike.uniqueThreeSecondViewers);
    const uniqueOneMinuteViewers = parseOptionalNumber(rowLike.uniqueOneMinuteViewers);
    const rawAverageWatchRatio = duration > 0 && avgWatchSeconds > 0
      ? (avgWatchSeconds / duration) * 100
      : null;
    const averageWatchRatio = rawAverageWatchRatio === null
      ? null
      : Math.min(Math.max(rawAverageWatchRatio, 0), 100);
    const rawThreeSecondViewerRate = reach > 0 && uniqueThreeSecondViewers !== null
      ? (uniqueThreeSecondViewers / reach) * 100
      : null;
    const threeSecondViewerRate = rawThreeSecondViewerRate === null
      ? null
      : Math.min(Math.max(rawThreeSecondViewerRate, 0), 100);
    const rawOneMinuteContinuationRate =
      duration >= 60 && uniqueThreeSecondViewers > 0 && uniqueOneMinuteViewers !== null
        ? (uniqueOneMinuteViewers / uniqueThreeSecondViewers) * 100
        : null;
    const oneMinuteContinuationRate = rawOneMinuteContinuationRate === null
      ? null
      : Math.min(Math.max(rawOneMinuteContinuationRate, 0), 100);
    const hasActualThreeSecondMetric = threeSecondViewerRate !== null;
    const qualityMetric = hasActualThreeSecondMetric ? threeSecondViewerRate : averageWatchRatio;

    return {
      rawAverageWatchRatio,
      averageWatchRatio,
      rawThreeSecondViewerRate,
      threeSecondViewerRate,
      rawOneMinuteContinuationRate,
      oneMinuteContinuationRate,
      hasActualThreeSecondMetric,
      qualityMetric,
      dataValid: hasActualThreeSecondMetric
        ? reach >= 100
        : Number(rowLike.views) >= 100 && averageWatchRatio !== null,
    };
  }

  function normalizeFacebook(records) {
    const rows = records.map((record, index) => {
      const title = String(record[FB_HEADERS.title] || "").trim();
      const description = String(record[FB_HEADERS.description] || "").trim();
      const caption = [title, description].filter(Boolean).join("\n\n").trim();
      const postTypeRaw = String(record[FB_HEADERS.postType] || "").trim();
      const contentType = postTypeRaw.includes("วิดีโอ") ? "video" : "image";
      const duration = parseNumber(record[FB_HEADERS.duration]);
      const avgWatchSeconds = parseNumber(record[FB_HEADERS.avgWatchSeconds]);
      const views = parseNumber(record[FB_HEADERS.views]);
      const reach = parseNumber(record[FB_HEADERS.reach]);
      const threeSecondViews = parseOptionalNumber(record[FB_HEADERS.threeSecondViews]);
      const oneMinuteViews = parseOptionalNumber(record[FB_HEADERS.oneMinuteViews]);
      const uniqueThreeSecondViewers = parseOptionalNumber(record[FB_HEADERS.uniqueThreeSecondViewers]);
      const uniqueOneMinuteViewers = parseOptionalNumber(record[FB_HEADERS.uniqueOneMinuteViewers]);
      const clicks = parseNumber(record[FB_HEADERS.clicks]);
      const engagement = parseNumber(record[FB_HEADERS.engagement]);
      const clickRate = reach ? (clicks / reach) * 100 : null;
      const engagementRate = reach ? (engagement / reach) * 100 : 0;
      const videoEvaluation =
        contentType === "video"
          ? evaluateFacebookVideo({
              avgWatchSeconds,
              duration,
              views,
              reach,
              uniqueThreeSecondViewers,
              uniqueOneMinuteViewers,
            })
          : null;
      const qualityMetric = contentType === "video" ? videoEvaluation.qualityMetric : clickRate;
      const dataValid = contentType === "video" ? videoEvaluation.dataValid : reach >= 100 && clickRate !== null;
      const benchmarkGroup = contentType === "video"
        ? videoEvaluation.hasActualThreeSecondMetric ? "facebook_video_actual_3s" : "facebook_video_watch_ratio"
        : "facebook_image";
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
        views,
        reach,
        engagement,
        reactions: parseNumber(record[FB_HEADERS.reactions]),
        comments: parseNumber(record[FB_HEADERS.comments]),
        shares: parseNumber(record[FB_HEADERS.shares]),
        clicks,
        photoClicks: parseNumber(record[FB_HEADERS.photoClicks]),
        linkClicks: parseNumber(record[FB_HEADERS.linkClicks]),
        videoClicks: parseNumber(record[FB_HEADERS.videoClicks]),
        threeSecondViews,
        oneMinuteViews,
        uniqueThreeSecondViewers,
        uniqueOneMinuteViewers,
        watchSeconds: parseNumber(record[FB_HEADERS.watchSeconds]),
        avgWatchSeconds,
        duration,
        adImpressions: parseNumber(record[FB_HEADERS.adImpressions]),
        clickRate,
        engagementRate,
        averageWatchRatio: videoEvaluation?.averageWatchRatio ?? null,
        rawAverageWatchRatio: videoEvaluation?.rawAverageWatchRatio ?? null,
        threeSecondViewerRate: videoEvaluation?.threeSecondViewerRate ?? null,
        rawThreeSecondViewerRate: videoEvaluation?.rawThreeSecondViewerRate ?? null,
        oneMinuteContinuationRate: videoEvaluation?.oneMinuteContinuationRate ?? null,
        rawOneMinuteContinuationRate: videoEvaluation?.rawOneMinuteContinuationRate ?? null,
        hasActualThreeSecondMetric: videoEvaluation?.hasActualThreeSecondMetric ?? false,
        benchmarkGroup,
        dataValid,
        qualityMetric,
        qualityGrade: "NA",
      };
    });
    return applyMarketGrades(rows);
  }

  function normalizeInstagram(records) {
    const rows = records.map((record, index) => {
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
        benchmarkGroup: `instagram_${contentType}`,
        dataValid: reach >= 100,
        qualityMetric: engagementRate,
        qualityGrade: "NA",
      };
    });
    return applyMarketGrades(rows);
  }

  function youtubeBenchmarkGroup(contentType, duration) {
    if (contentType === "short") {
      return "youtube_short";
    }
    const minutes = (Number(duration) || 0) / 60;
    if (minutes < 5) {
      return "youtube_long_under_5";
    }
    if (minutes < 10) {
      return "youtube_long_5_10";
    }
    if (minutes < 20) {
      return "youtube_long_10_20";
    }
    return "youtube_long_20_plus";
  }

  function evaluateYoutubeVideo(rowLike) {
    const contentType = rowLike.contentType || ((Number(rowLike.duration) || 0) <= 60 ? "short" : "long");
    const retention = parseOptionalNumber(rowLike.averageViewPercentage);
    const qualityScore = retention === null ? null : Math.min(Math.max(retention, 0), 100);
    return {
      contentType,
      benchmarkGroup: youtubeBenchmarkGroup(contentType, rowLike.duration),
      qualityGrade: "NA",
      qualityScore,
    };
  }

  function normalizeYoutube(records) {
    const rows = records
      .filter((record) => String(record[YT_HEADERS.videoId] || "").trim() && String(record[YT_HEADERS.videoId] || "").trim() !== "รวม")
      .map((record, index) => {
        const videoId = String(record[YT_HEADERS.videoId] || "").trim();
        const caption = String(record[YT_HEADERS.title] || "").trim();
        const duration = parseDurationText(record[YT_HEADERS.duration]);
        const averageViewPercentage = parseOptionalNumber(record[YT_HEADERS.averageViewPercentage]);
        const stayedToWatch = parseOptionalNumber(record[YT_HEADERS.stayedToWatch]);
        const impressionsCtr = parseOptionalNumber(record[YT_HEADERS.impressionsCtr]);
        const evaluation = evaluateYoutubeVideo({ duration, averageViewPercentage, stayedToWatch, impressionsCtr });
        const department = classifyDepartment(caption);
        return {
          platform: "youtube",
          index,
          videoId,
          postId: videoId,
          caption,
          publishedAt: parseYoutubeDate(record[YT_HEADERS.publishedAt]),
          publishedAtText: String(record[YT_HEADERS.publishedAt] || "").trim(),
          permalink: videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : "",
          postTypeRaw: evaluation.contentType === "short" ? "YouTube Short" : "YouTube Long-form",
          contentType: evaluation.contentType,
          departmentId: department.id,
          departmentLabel: department.label,
          duration,
          engagedViews: parseNumber(record[YT_HEADERS.engagedViews]),
          views: parseNumber(record[YT_HEADERS.views]),
          reach: parseNumber(record[YT_HEADERS.impressions]),
          engagement: parseNumber(record[YT_HEADERS.engagedViews]),
          watchHours: parseNumber(record[YT_HEADERS.watchHours]),
          subscribers: parseNumber(record[YT_HEADERS.subscribers]),
          averageViewDuration: parseDurationText(record[YT_HEADERS.averageViewDuration]),
          averageViewPercentage,
          stayedToWatch,
          impressions: parseNumber(record[YT_HEADERS.impressions]),
          impressionsCtr,
          benchmarkGroup: evaluation.benchmarkGroup,
          dataValid: parseNumber(record[YT_HEADERS.views]) >= 100 && averageViewPercentage !== null,
          qualityMetric: evaluation.qualityScore,
          qualityScore: evaluation.qualityScore,
          qualityGrade: "NA",
        };
      });
    return applyMarketGrades(rows);
  }

  function processFacebookCsv(text) {
    const matrix = parseCsv(text);
    const parsed = csvMatrixToObjects(matrix);
    return {
      headers: parsed.headers,
      rows: normalizeFacebook(parsed.rows),
      warnings: [...parsed.warnings, ...validateHeaders(parsed.headers, [FB_HEADERS.postId, FB_HEADERS.postType, FB_HEADERS.reach])],
    };
  }

  function processInstagramCsv(text) {
    const matrix = parseCsv(text);
    const parsed = csvMatrixToObjects(matrix);
    return {
      headers: parsed.headers,
      rows: normalizeInstagram(parsed.rows),
      warnings: [...parsed.warnings, ...validateHeaders(parsed.headers, [IG_HEADERS.postId, IG_HEADERS.postType, IG_HEADERS.reach])],
    };
  }

  function processYoutubeMatrix(matrix) {
    const parsed = csvMatrixToObjects(matrix);
    return {
      headers: parsed.headers,
      rows: normalizeYoutube(parsed.rows),
      warnings: [...parsed.warnings, ...validateHeaders(parsed.headers, [YT_HEADERS.videoId, YT_HEADERS.title, YT_HEADERS.duration, YT_HEADERS.averageViewPercentage])],
    };
  }

  function validateHeaders(headers, requiredHeaders) {
    const missing = requiredHeaders.filter((header) => !headers.includes(header));
    return missing.length ? [`ขาดคอลัมน์สำคัญ: ${missing.join(", ")}`] : [];
  }

  function initDashboard() {
    const facebookInput = document.getElementById("facebookInput");
    const instagramInput = document.getElementById("instagramInput");
    const youtubeInput = document.getElementById("youtubeInput");

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

    youtubeInput.addEventListener("change", (event) => {
      state.selectedFiles.youtube = event.target.files[0] || null;
      setText("youtubeFileName", state.selectedFiles.youtube?.name || "ยังไม่ได้เลือกไฟล์ YouTube");
      updateProcessButton();
    });

    document.getElementById("processButton").addEventListener("click", processSelectedFiles);
    document.getElementById("loadSampleButton").addEventListener("click", loadBundledSamples);

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
    bindFilter("youtubeQualityFilter", "youtube", "quality");
    bindFilter("youtubeTypeFilter", "youtube", "type");
    bindFilter("youtubeSearch", "youtube", "search");
    bindDetailModal();

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
    const hasFile = Boolean(state.selectedFiles.facebook || state.selectedFiles.instagram || state.selectedFiles.youtube);
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

    if (state.selectedFiles.youtube) {
      try {
        const matrix = await readYoutubeWorkbook(state.selectedFiles.youtube);
        const result = processYoutubeMatrix(matrix);
        state.data.youtube = result.rows;
        state.headers.youtube = result.headers;
        warnings.push(...result.warnings.map((warning) => `YouTube: ${warning}`));
      } catch (error) {
        warnings.push(`YouTube: ${error.message}`);
      }
    }

    state.warnings = warnings;
    if (state.data.facebook.length) {
      state.activePlatform = "facebook";
    } else if (state.data.instagram.length) {
      state.activePlatform = "instagram";
    } else if (state.data.youtube.length) {
      state.activePlatform = "youtube";
    }
    renderDashboard();
  }

  async function loadBundledSamples() {
    const warnings = [];
    try {
      const facebookText = await fetchLocalSample(DEFAULT_SAMPLE_FILES.facebook);
      const facebookResult = processFacebookCsv(facebookText);
      state.data.facebook = facebookResult.rows;
      state.headers.facebook = facebookResult.headers;
      setText("facebookFileName", DEFAULT_SAMPLE_FILES.facebook.split("/").pop());
      warnings.push(...facebookResult.warnings.map((warning) => `Facebook: ${warning}`));
    } catch (error) {
      warnings.push(`Facebook sample load failed: ${error.message}`);
    }

    try {
      const instagramText = await fetchLocalSample(DEFAULT_SAMPLE_FILES.instagram);
      const instagramResult = processInstagramCsv(instagramText);
      state.data.instagram = instagramResult.rows;
      state.headers.instagram = instagramResult.headers;
      setText("instagramFileName", DEFAULT_SAMPLE_FILES.instagram.split("/").pop());
      warnings.push(...instagramResult.warnings.map((warning) => `Instagram: ${warning}`));
    } catch (error) {
      warnings.push(`Instagram sample load failed: ${error.message}`);
    }

    try {
      const youtubeBuffer = await fetchLocalArrayBuffer(DEFAULT_SAMPLE_FILES.youtube);
      const youtubeResult = processYoutubeMatrix(await readYoutubeWorkbook(youtubeBuffer));
      state.data.youtube = youtubeResult.rows;
      state.headers.youtube = youtubeResult.headers;
      setText("youtubeFileName", DEFAULT_SAMPLE_FILES.youtube.split("/").pop());
      warnings.push(...youtubeResult.warnings.map((warning) => `YouTube: ${warning}`));
    } catch (error) {
      warnings.push(`YouTube sample load failed: ${error.message}`);
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

  async function readYoutubeWorkbook(fileOrBuffer) {
    if (!global.XLSX) {
      throw new Error("ไม่พบตัวอ่าน Excel กรุณาตรวจสอบไฟล์ vendor/xlsx.full.min.js");
    }
    const buffer = fileOrBuffer instanceof ArrayBuffer ? fileOrBuffer : await fileOrBuffer.arrayBuffer();
    const workbook = global.XLSX.read(buffer, { type: "array" });
    const preferredName = workbook.SheetNames.find((name) => name === "ข้อมูลตาราง") || workbook.SheetNames[0];
    if (!preferredName) {
      throw new Error("ไม่พบชีตข้อมูลในไฟล์ YouTube");
    }
    return global.XLSX.utils.sheet_to_json(workbook.Sheets[preferredName], { header: 1, raw: true, defval: "" });
  }

  async function loadSamplesFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const facebookSample = params.get("fb") || params.get("sampleFb");
    const instagramSample = params.get("ig") || params.get("sampleIg");
    const youtubeSample = params.get("yt") || params.get("sampleYt");
    if (!facebookSample && !instagramSample && !youtubeSample) {
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

    if (youtubeSample) {
      try {
        const buffer = await fetchLocalArrayBuffer(youtubeSample);
        const result = processYoutubeMatrix(await readYoutubeWorkbook(buffer));
        state.data.youtube = result.rows;
        state.headers.youtube = result.headers;
        setText("youtubeFileName", youtubeSample.split("/").pop());
        warnings.push(...result.warnings.map((warning) => `YouTube: ${warning}`));
      } catch (error) {
        warnings.push(`โหลด YouTube sample ไม่สำเร็จ: ${error.message}`);
      }
    }

    state.warnings = warnings;
    state.activePlatform = state.data.facebook.length ? "facebook" : state.data.instagram.length ? "instagram" : "youtube";
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

  async function fetchLocalArrayBuffer(samplePath) {
    const url = new URL(samplePath, window.location.href);
    if (url.origin !== window.location.origin) {
      throw new Error("sample ต้องอยู่ใน origin เดียวกัน");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.arrayBuffer();
  }

  function bindDetailModal() {
    const modal = document.getElementById("detailModal");
    document.getElementById("detailCloseButton").addEventListener("click", closeDetailModal);
    modal.addEventListener("click", (event) => {
      const target = event.target;
      if (target && target.dataset && target.dataset.closeModal === "true") {
        closeDetailModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeDetailModal();
      }
    });
  }

  function renderDashboard() {
    renderStatus();
    renderNotices();
    renderPlatformTabs();

    const hasData = state.data.facebook.length > 0 || state.data.instagram.length > 0 || state.data.youtube.length > 0;
    toggle("emptyState", !hasData);
    toggle("facebookView", hasData && state.activePlatform === "facebook" && state.data.facebook.length > 0);
    toggle("instagramView", hasData && state.activePlatform === "instagram" && state.data.instagram.length > 0);
    toggle("youtubeView", hasData && state.activePlatform === "youtube" && state.data.youtube.length > 0);

    if (!hasData) {
      return;
    }

    if (state.activePlatform === "facebook" && state.data.facebook.length) {
      renderFacebook();
    } else if (state.activePlatform === "instagram" && state.data.instagram.length) {
      renderInstagram();
    } else if (state.activePlatform === "youtube" && state.data.youtube.length) {
      renderYoutube();
    }
  }

  function renderStatus() {
    setText("facebookStatus", statusText(state.data.facebook));
    setText("instagramStatus", statusText(state.data.instagram));
    setText("youtubeStatus", statusText(state.data.youtube));
    setText("activeStatus", activeStatusText());
  }

  function statusText(rows) {
    if (!rows.length) {
      return "ยังไม่มีข้อมูล";
    }
    return `${formatInteger(rows.length)} รายการ | ${getDateRange(rows)}`;
  }

  function activeStatusText() {
    const rows =
      state.activePlatform === "facebook"
        ? getFilteredFacebookRows()
        : state.activePlatform === "instagram"
          ? getFilteredInstagramRows()
          : getFilteredYoutubeRows();
    if (!rows.length) {
      return "-";
    }
    const platformLabel = state.activePlatform === "facebook" ? "Facebook" : state.activePlatform === "instagram" ? "Instagram" : "YouTube";
    return `${platformLabel} | ${formatInteger(rows.length)} รายการหลังกรอง`;
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
    setText("youtubeTabCount", state.data.youtube.length);
    document.querySelectorAll(".platform-tab").forEach((tab) => {
      const isActive = tab.dataset.platform === state.activePlatform;
      tab.classList.toggle("active", isActive);
    });
    document.getElementById("tabFacebook").disabled = state.data.facebook.length === 0;
    document.getElementById("tabInstagram").disabled = state.data.instagram.length === 0;
    document.getElementById("tabYoutube").disabled = state.data.youtube.length === 0;
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

  function renderYoutube() {
    const rows = getFilteredYoutubeRows();
    renderKpis("youtubeKpis", youtubeKpis(rows));
    document.getElementById("youtubeGradeChart").innerHTML = renderBarChart(groupBy(rows, "qualityGrade", "views"), {
      color: COLORS.yt,
      valueLabel: "Views",
      labelMap: gradeLabel,
    });
    document.getElementById("youtubeRetentionChart").innerHTML = renderTopChart(
      getTopRows(rows.filter((row) => row.averageViewPercentage !== null), "averageViewPercentage", 10),
      "averageViewPercentage",
      COLORS.red,
    );
    document.getElementById("youtubeTopChart").innerHTML = renderTopChart(getTopRows(rows, "views", 10), "views", COLORS.yt);
    renderYoutubeTable(rows);
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

  function getFilteredYoutubeRows() {
    const filters = state.filters.youtube;
    return state.data.youtube
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
    const hasActualHook = state.facebookType === "video" && rows.some((row) => row.hasActualThreeSecondMetric);
    const metricName = state.facebookType === "video"
      ? hasActualHook ? "Avg 3s Hook Rate" : "Avg Watch Ratio"
      : "Avg Engagement Rate";
    const metricValue =
      state.facebookType === "video"
        ? averageMetric(rows.map((row) => hasActualHook ? row.threeSecondViewerRate : row.averageWatchRatio).filter((value) => value !== null))
        : weightedPercent(rows, "engagement", "reach");
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

  function youtubeKpis(rows) {
    const avgRetention = averageMetric(rows.map((row) => row.qualityScore).filter((value) => value !== null));
    const avgCtr = averageMetric(rows.map((row) => row.impressionsCtr).filter((value) => value !== null));
    const gradeA = rows.filter((row) => row.qualityGrade === "A").length;
    return [
      { label: "Videos", value: formatInteger(rows.length), meta: "หลังใช้ตัวกรอง", accent: "kpi-yt" },
      { label: "Views", value: formatInteger(sumBy(rows, "views")), meta: "จำนวนการดูรวม", accent: "kpi-blue" },
      { label: "Watch Hours", value: formatInteger(sumBy(rows, "watchHours")), meta: "ชั่วโมงรับชมรวม", accent: "kpi-teal" },
      { label: "Subscribers", value: `+${formatInteger(sumBy(rows, "subscribers"))}`, meta: "ผู้ติดตามจากวิดีโอ", accent: "kpi-green" },
      { label: "Retention Score", value: avgRetention === null ? "N/A" : `${avgRetention.toFixed(1)}%`, meta: "APV capped at 100; Shorts checks stayed-to-watch", accent: "kpi-yt" },
      { label: "Grade A / CTR", value: `${gradeA} / ${avgCtr === null ? "N/A" : `${avgCtr.toFixed(1)}%`}`, meta: "คุณภาพสูง / CTR เฉลี่ย", accent: "kpi-amber" },
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
    const hasActualHook = isVideo && state.data.facebook.some((row) => row.contentType === "video" && row.hasActualThreeSecondMetric);
    document.getElementById("facebookTableHead").innerHTML = `
      <tr>
        <th>#</th>
        <th>เนื้อหา</th>
        <th>แผนก</th>
        <th>Reach</th>
        <th>Views</th>
        <th>Engagement</th>
        <th>Clicks</th>
        ${isVideo
          ? hasActualHook
            ? "<th>3s Hook Rate</th><th>1min Continuation</th>"
            : "<th>Avg Watch</th><th>Watch Ratio</th>"
          : "<th>Engagement Rate</th>"}
        <th>Grade</th>
        <th>ลิงก์</th>
      </tr>
    `;

    document.getElementById("facebookTableBody").innerHTML =
      getTopRows(rows, "reach", 80)
        .map(
          (row, index) => `
            <tr class="interactive-row" tabindex="0" data-platform="facebook" data-index="${row.index}">
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
              ${isVideo
                ? hasActualHook
                  ? `<td>${formatMetric(row.threeSecondViewerRate)}</td><td>${formatMetric(row.oneMinuteContinuationRate)}</td>`
                  : `<td>${row.avgWatchSeconds ? `${row.avgWatchSeconds.toFixed(1)}s` : "N/A"}</td><td>${formatMetric(row.averageWatchRatio)}</td>`
                : `<td>${formatMetric(row.engagementRate)}</td>`}
              <td>${renderGrade(row.qualityGrade)}</td>
              <td class="link-cell">${renderPostLink(row.permalink)}</td>
            </tr>
          `,
        )
        .join("") || emptyTableRow(isVideo ? 11 : 10);

    bindInteractiveRows();
  }

  function renderInstagramTable(rows) {
    document.getElementById("instagramTableBody").innerHTML =
      getTopRows(rows, "engagementRate", 100)
        .map(
          (row, index) => `
            <tr class="interactive-row" tabindex="0" data-platform="instagram" data-index="${row.index}">
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

    bindInteractiveRows();
  }

  function renderYoutubeTable(rows) {
    document.getElementById("youtubeTableBody").innerHTML =
      getTopRows(rows, "views", 150)
        .map(
          (row, index) => `
            <tr class="interactive-row" tabindex="0" data-platform="youtube" data-index="${row.index}">
              <td>${index + 1}</td>
              <td>
                <div class="post-title">${escapeHtml(truncate(row.caption, 150))}</div>
                <div class="post-meta">${escapeHtml(formatDateTime(row.publishedAt, row.publishedAtText))} · ${formatDuration(row.duration)}</div>
              </td>
              <td><span class="pill pill-dept">${row.contentType === "short" ? "Shorts" : "Long-form"}</span></td>
              <td>${formatInteger(row.views)}</td>
              <td>${formatMetric(row.averageViewPercentage)}</td>
              <td>${formatMetric(row.stayedToWatch)}</td>
              <td>${formatMetric(row.impressionsCtr)}</td>
              <td>+${formatInteger(row.subscribers)}</td>
              <td>${row.qualityScore === null ? "N/A" : `${row.qualityScore.toFixed(0)}/100`}</td>
              <td>${renderGrade(row.qualityGrade)}</td>
              <td class="link-cell">${renderPostLink(row.permalink)}</td>
            </tr>
          `,
        )
        .join("") || emptyTableRow(11);

    bindInteractiveRows();
  }

  function bindInteractiveRows() {
    document.querySelectorAll(".interactive-row").forEach((rowElement) => {
      rowElement.addEventListener("click", handleInteractiveRow);
      rowElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleInteractiveRow.call(rowElement);
        }
      });
    });
  }

  function handleInteractiveRow() {
    const platform = this.dataset.platform;
    const index = Number(this.dataset.index);
    if (!platform || Number.isNaN(index)) {
      return;
    }
    const row = state.data[platform].find((item) => item.index === index);
    if (!row) {
      return;
    }
    openDetailModal(row);
  }

  function openDetailModal(row) {
    const detail = buildDetailView(row);
    state.activeDetail = row;
    setText("detailBadge", detail.badge);
    setText("detailTitle", truncate(row.caption, 180));
    setText("detailSubtitle", detail.subtitle);
    document.getElementById("detailMetricGrid").innerHTML = detail.metrics
      .map(
        (metric) => `
          <article class="detail-metric-card">
            <p class="label">${escapeHtml(metric.label)}</p>
            <p class="value">${escapeHtml(metric.value)}</p>
            <p class="meta">${escapeHtml(metric.meta)}</p>
          </article>
        `,
      )
      .join("");
    setText("detailGradeLabel", detail.gradeLabel);
    setText("detailEvaluationText", detail.evaluation);
    document.getElementById("detailActionList").innerHTML = detail.actions
      .map((action) => `<span class="detail-action-chip">${escapeHtml(action)}</span>`)
      .join("");
    setText("detailCaption", row.caption || "-");
    const link = document.getElementById("detailPermalink");
    if (row.permalink) {
      link.href = row.permalink;
      link.hidden = false;
    } else {
      link.hidden = true;
      link.removeAttribute("href");
    }
    const modal = document.getElementById("detailModal");
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
  }

  function closeDetailModal() {
    state.activeDetail = null;
    const modal = document.getElementById("detailModal");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  function buildDetailView(row) {
    if (row.platform === "facebook") {
      return buildFacebookDetail(row);
    }
    if (row.platform === "youtube") {
      return buildYoutubeDetail(row);
    }
    return buildInstagramDetail(row);
  }

  function buildFacebookDetail(row) {
    const isVideo = row.contentType === "video";
    const metrics = isVideo
      ? row.hasActualThreeSecondMetric
        ? [
          { label: "Views", value: formatInteger(row.views), meta: "Total video views" },
          { label: "Reach", value: formatInteger(row.reach), meta: "Unique reach" },
          { label: "3s Hook Rate", value: formatMetric(row.threeSecondViewerRate), meta: "Unique 3-second viewers / reach" },
          { label: "Hook grade", value: gradeLabel(row.primaryGrade), meta: "ดี ≥ 30% · ผ่าน ≥ 20%" },
          { label: "Unique 3s viewers", value: formatInteger(row.uniqueThreeSecondViewers), meta: `${formatInteger(row.threeSecondViews)} total 3-second views` },
          { label: "1min continuation", value: formatMetric(row.oneMinuteContinuationRate), meta: "Unique 1-minute viewers / unique 3-second viewers" },
          { label: "1min grade", value: row.duration >= 60 ? gradeLabel(row.secondaryGrade) : "N/A", meta: row.duration >= 60 ? "ดี ≥ 15% · ผ่าน ≥ 8%" : "Video shorter than 60 seconds" },
          { label: "Unique 1min viewers", value: row.duration >= 60 ? formatInteger(row.uniqueOneMinuteViewers) : "N/A", meta: row.duration >= 60 ? "Actual Meta metric" : "Video shorter than 60 seconds" },
          { label: "Market standard", value: benchmarkBand(row), meta: row.benchmarkBasis },
        ]
        : [
          { label: "Views", value: formatInteger(row.views), meta: "Total video views" },
          { label: "Reach", value: formatInteger(row.reach), meta: "Unique reach" },
          { label: "Watch ratio", value: formatMetric(row.averageWatchRatio), meta: "Avg watch / duration, scoring capped at 100%" },
          { label: "Raw watch ratio", value: formatMetric(row.rawAverageWatchRatio), meta: "May exceed 100% from replay or looping" },
          { label: "Avg watch", value: row.avgWatchSeconds ? `${row.avgWatchSeconds.toFixed(1)} sec` : "N/A", meta: "Average watch time" },
          { label: "Duration", value: row.duration ? `${row.duration.toFixed(1)} sec` : "N/A", meta: "Clip length in export" },
          { label: "Market standard", value: benchmarkBand(row), meta: row.benchmarkBasis },
        ]
      : [
          { label: "Reach", value: formatInteger(row.reach), meta: "Unique reach" },
          { label: "Clicks", value: formatInteger(row.clicks), meta: `${formatInteger(row.linkClicks)} link clicks` },
          { label: "Click rate", value: formatMetric(row.clickRate), meta: "Total clicks / reach; not impression CTR" },
          { label: "Engagement rate", value: formatMetric(row.engagementRate), meta: "Engagement / reach" },
          { label: "Market standard", value: benchmarkBand(row), meta: row.benchmarkBasis },
        ];
    return {
      badge: isVideo ? "Facebook Video" : "Facebook Image",
      subtitle: `${row.departmentLabel} | ${row.postTypeRaw || "-"} | ${formatDateTime(row.publishedAt, row.publishedAtText)}`,
      metrics,
      gradeLabel: gradeLabel(row.qualityGrade),
      evaluation: describeFacebookEvaluation(row),
      actions: facebookActions(row),
    };
  }

  function buildInstagramDetail(row) {
    return {
      badge: `Instagram ${row.contentType === "video" ? "Reel" : "Post"}`,
      subtitle: `${row.departmentLabel} | ${row.postTypeRaw || "-"} | ${formatDateTime(row.publishedAt, row.publishedAtText)}`,
      metrics: [
        { label: "Reach", value: formatInteger(row.reach), meta: "Unique reach" },
        { label: "Views", value: formatInteger(row.views), meta: "Total views" },
        { label: "Engagement", value: formatInteger(row.engagement), meta: "Likes + comments + shares + saves + follows" },
        { label: "ER", value: formatMetric(row.engagementRate), meta: "Engagement / reach" },
        { label: "Market standard", value: benchmarkBand(row), meta: row.benchmarkBasis },
      ],
      gradeLabel: gradeLabel(row.qualityGrade),
      evaluation: describeInstagramEvaluation(row),
      actions: instagramActions(row),
    };
  }

  function buildYoutubeDetail(row) {
    return {
      badge: row.contentType === "short" ? "YouTube Shorts" : "YouTube Long-form",
      subtitle: `${row.departmentLabel} | ${formatDateTime(row.publishedAt, row.publishedAtText)} | ${formatDuration(row.duration)}`,
      metrics: [
        { label: "Views", value: formatInteger(row.views), meta: "จำนวนการดู" },
        { label: "Raw APV", value: formatMetric(row.averageViewPercentage), meta: "ค่าดิบจาก YouTube Studio; rewatch อาจเกิน 100%" },
        { label: "Stayed to watch", value: formatMetric(row.stayedToWatch), meta: "สัดส่วน Shorts ที่ผู้ชมเลือกอยู่ดูต่อ" },
        { label: "Impression CTR", value: formatMetric(row.impressionsCtr), meta: "คุณภาพชื่อคลิปและ Thumbnail" },
        { label: "Watch hours", value: formatInteger(row.watchHours), meta: "เวลารับชมรวม" },
        { label: "Retention score", value: row.qualityScore === null ? "N/A" : `${row.qualityScore.toFixed(0)}/100`, meta: "APV capped at 100 for grading" },
        { label: "Market standard", value: benchmarkBand(row), meta: row.benchmarkBasis },
      ],
      gradeLabel: gradeLabel(row.qualityGrade),
      evaluation: describeYoutubeEvaluation(row),
      actions: youtubeActions(row),
    };
  }

  function describeFacebookEvaluation(row) {
    if (row.contentType === "video") {
      if (!row.dataValid) {
        return "ข้อมูลยังไม่ผ่าน Data Validity Gate จึงแสดง N/A และไม่นำไปเทียบเกรด เพื่อหลีกเลี่ยงข้อสรุปจากฐานผู้ชมที่ไม่เพียงพอ";
      }
      const metricName = row.hasActualThreeSecondMetric ? "3s Hook Rate จริง" : "Watch Ratio";
      const continuationText = row.duration >= 60
        ? ` และ 1min Continuation ${formatMetric(row.oneMinuteContinuationRate)}`
        : "";
      if (row.qualityGrade === "A") {
        return `${metricName} ผ่านระดับดี${continuationText} โดยเกรดรวมผ่านทั้งช่วงเปิดและการรักษาคนดู (${row.benchmarkBasis})`;
      }
      if (row.qualityGrade === "B") {
        return `${metricName} และความต่อเนื่องผ่านระดับใช้งาน${continuationText} (${row.benchmarkBasis}) ควรทดลองปรับจังหวะเปิดและเวลาที่เข้าสู่สาระสำคัญ`;
      }
      return `${metricName} หรือ 1min Continuation ต่ำกว่ามาตรฐานตลาด${continuationText} (${row.benchmarkBasis}) ควรตรวจ first frame โครงเรื่อง และช่วงเกริ่นนำ`;
    }

    if (row.qualityGrade === "A") {
      return `Engagement Rate ผ่านระดับดีของตลาด Healthcare (${row.benchmarkBasis}) เหมาะสำหรับขยายผลหรือทดสอบแนวทางใกล้เคียง`;
    }
    if (row.qualityGrade === "B") {
      return `Engagement Rate ผ่านระดับใช้งานของตลาด (${row.benchmarkBasis}) ควรทดสอบภาพหลักหรือข้อความเปิดเพิ่มเติม`;
    }
    if (row.qualityGrade === "NA") return "ข้อมูล Reach ยังไม่เพียงพอสำหรับตัดเกรด ระบบจึงแสดง N/A";
    return `Engagement Rate ต่ำกว่ามาตรฐานตลาด (${row.benchmarkBasis}) ควรทบทวนลำดับภาพและข้อความเปิด`;
  }

  function describeInstagramEvaluation(row) {
    if (row.qualityGrade === "NA") return "ข้อมูล Reach ยังไม่เพียงพอสำหรับตัดเกรด ระบบจึงแสดง N/A";
    if (row.qualityGrade === "A") {
      return `Engagement Rate ผ่านระดับดีของตลาด Healthcare/Beauty (${row.benchmarkBasis})`;
    }
    if (row.qualityGrade === "B") {
      return `Engagement Rate ผ่านระดับใช้งานของตลาด (${row.benchmarkBasis}) ควรทดสอบเหตุผลให้คน save/share เพิ่มเติม`;
    }
    return `Engagement Rate ต่ำกว่ามาตรฐานตลาด (${row.benchmarkBasis}) ควรทบทวน visual payoff และ audience fit`;
  }

  function describeYoutubeEvaluation(row) {
    if (row.qualityGrade === "NA") {
      return "ข้อมูล Retention ไม่เพียงพอสำหรับตัดเกรด ระบบจึงแสดง N/A เพื่อหลีกเลี่ยงข้อสรุปที่เกินข้อมูลจริง";
    }
    if (row.qualityGrade === "A") {
      return row.contentType === "short"
        ? `Retention Score และ Stayed to Watch ผ่านระดับดีของ Shorts (${row.benchmarkBasis})`
        : `Retention Score ผ่านระดับดีของ Long-form ตามความยาวคลิป (${row.benchmarkBasis})`;
    }
    if (row.qualityGrade === "B") {
      return row.contentType === "short"
        ? "Shorts อยู่ในระดับใช้งาน แต่ยังควรปรับ first frame, hook และ stayed-to-watch เพื่อไม่ให้ APV สูงเฉพาะกลุ่มที่ดูซ้ำ"
        : "Long-form รักษาคนดูได้ในระดับใช้งาน แต่ยังมีพื้นที่ให้ปรับ Hook, จังหวะการเล่า หรือ Packaging เพื่อขึ้นสู่ Grade A";
    }
    return row.contentType === "short"
      ? "Shorts ต่ำกว่าเกณฑ์หลัก ควรทบทวน first frame, ข้อความเปิด และจังหวะก่อนถึง payoff โดยดู Stayed to Watch คู่กับ APV"
      : "Retention ต่ำกว่าเกณฑ์หลัก ควรทบทวนคำสัญญาในช่วงเปิด โครงเรื่อง และเวลาที่ใช้ก่อนเข้าสู่สาระสำคัญ";
  }

  function facebookActions(row) {
    if (row.contentType === "video") {
      if (!row.dataValid) {
        return ["เพิ่มข้อมูล Views และ Average Watch", "อัปโหลด export ที่มี 3-second views หากต้องการวัด Hook จริง", "ประเมินช่วงเปิดด้วยการดูคลิปจริง"];
      }
      if (row.qualityGrade === "A") {
        return ["Reuse hook pattern", "Retest with similar topic", "Promote high-retention clips"];
      }
      if (row.qualityGrade === "B") {
        return ["Shorten mid-section", "Bring proof earlier", "Test faster captions"];
      }
      return ["ทบทวน first frame", "ลดช่วงเกริ่นนำ", "นำผลลัพธ์ขึ้นก่อน"];
    }
    if (row.qualityGrade === "A") {
      return ["Reuse thumbnail style", "Scale headline format", "Clone CTA structure"];
    }
    if (row.qualityGrade === "B") {
      return ["Test new cover image", "Sharpen opening line", "Segment by department"];
    }
    return ["Replace hero image", "Simplify message", "Review audience match"];
  }

  function instagramActions(row) {
    if (row.qualityGrade === "A") {
      return ["Turn into repeatable series", "Pin strong comments", "Reuse visual direction"];
    }
    if (row.qualityGrade === "B") {
      return ["Strengthen save trigger", "Improve first frame", "Test shorter caption"];
    }
    return ["Rework visual payoff", "Clarify audience problem", "Add stronger CTA"];
  }

  function youtubeActions(row) {
    if (row.qualityGrade === "NA") {
      return ["ตรวจรูปแบบ export", "ยืนยันคอลัมน์ Retention", "ประเมินคลิปด้วยข้อมูลรอบใหม่"];
    }
    if (row.qualityGrade === "A") {
      return ["ทำหัวข้อภาคต่อ", "นำ Hook ไปใช้ซ้ำ", "เพิ่มการกระจายผ่าน Playlist"];
    }
    if (row.qualityGrade === "B") {
      return ["เร่งจังหวะกลางคลิป", "ทดสอบชื่อและ Thumbnail", "ย้ายหลักฐานให้เร็วขึ้น"];
    }
    return ["เขียน Hook ใหม่", "ลดความยาวส่วนเกริ่น", "ทำสาระหลักให้เห็นเร็วขึ้น"];
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
          <text x="${labelWidth + widthValue + 7}" y="${y + 14}" class="axis-label">${["engagementRate", "averageViewPercentage", "stayedToWatch", "impressionsCtr"].includes(field) ? `${value.toFixed(1)}%` : formatCompact(value)}</text>
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
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">เปิดโพสต์</a>`;
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

  function benchmarkBand(row) {
    if (row.benchmarkGradeA === null || row.benchmarkGradeA === undefined || row.benchmarkGradeB === null || row.benchmarkGradeB === undefined) {
      return "N/A";
    }
    const primary = `ดี ≥ ${Number(row.benchmarkGradeA).toFixed(1)}% | ผ่าน ≥ ${Number(row.benchmarkGradeB).toFixed(1)}%`;
    if (row.benchmarkSecondaryGradeA !== null && row.benchmarkSecondaryGradeA !== undefined) {
      const secondaryLabel = row.benchmarkGroup === "youtube_short" ? "Stayed" : "1min";
      return `${primary} | ${secondaryLabel} ดี ≥ ${Number(row.benchmarkSecondaryGradeA).toFixed(1)}% · ผ่าน ≥ ${Number(row.benchmarkSecondaryGradeB).toFixed(1)}%`;
    }
    return primary;
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

  function formatDuration(value) {
    const totalSeconds = Math.max(0, Math.round(Number(value) || 0));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${minutes}:${String(seconds).padStart(2, "0")}`;
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
    YT_HEADERS,
    parseCsv,
    csvMatrixToObjects,
    parseNumber,
    parseOptionalNumber,
    parseFacebookDate,
    parseYoutubeDate,
    parseDurationText,
    classifyDepartment,
    gradeByThreshold,
    applyMarketGrades,
    worstGrade,
    MARKET_BENCHMARKS,
    evaluateFacebookVideo,
    evaluateYoutubeVideo,
    normalizeFacebook,
    normalizeInstagram,
    normalizeYoutube,
    processFacebookCsv,
    processInstagramCsv,
    processYoutubeMatrix,
    summarizeRows,
    aggregateWeekly,
    groupBy,
    formatDate,
    formatDuration,
  };

  global.KVKAnalytics = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initDashboard);
  }
})(typeof window !== "undefined" ? window : globalThis);
