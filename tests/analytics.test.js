const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const analytics = require("../app.js");

const facebookPath = path.join(
  __dirname,
  "..",
  "sources",
  "facebook-Feb-26-2026_May-26-2026_817678151175572.csv",
);
const instagramPath = path.join(
  __dirname,
  "..",
  "sources",
  "ig-Feb-26-2026_May-26-2026_1979714872637295.csv",
);

const facebookText = fs.readFileSync(facebookPath, "utf8");
const instagramText = fs.readFileSync(instagramPath, "utf8");

const facebookMatrix = analytics.parseCsv(facebookText);
const instagramMatrix = analytics.parseCsv(instagramText);
const facebook = analytics.processFacebookCsv(facebookText);
const instagram = analytics.processInstagramCsv(instagramText);

assert.equal(facebookMatrix.length, 261, "Facebook CSV should include one header row plus 260 data rows");
assert.equal(facebook.headers.length, 33, "Facebook CSV should parse 33 headers");
assert.equal(facebook.rows.length, 260, "Facebook CSV should parse 260 posts");

assert.equal(instagramMatrix.length, 178, "Instagram CSV should include one header row plus 177 data rows");
assert.equal(instagram.headers.length, 18, "Instagram CSV should parse 18 headers");
assert.equal(instagram.rows.length, 177, "Instagram CSV should parse 177 posts");

const facebookImages = facebook.rows.filter((row) => row.contentType === "image");
const facebookVideos = facebook.rows.filter((row) => row.contentType === "video");
assert.equal(facebookImages.length, 164, "Facebook should split 164 image posts");
assert.equal(facebookVideos.length, 96, "Facebook should split 96 video posts");

const instagramImages = instagram.rows.filter((row) => row.contentType === "image");
const instagramVideos = instagram.rows.filter((row) => row.contentType === "video");
assert.equal(instagramImages.length, 91, "Instagram should split image/slide posts");
assert.equal(instagramVideos.length, 86, "Instagram should split Reels posts");

const fbDates = facebook.rows.map((row) => row.publishedAt).filter(Boolean);
assert.equal(analytics.formatDate(new Date(Math.min(...fbDates))), "2026-02-26");
assert.equal(analytics.formatDate(new Date(Math.max(...fbDates))), "2026-05-26");

const igDates = instagram.rows.map((row) => row.publishedAt).filter(Boolean);
assert.equal(analytics.formatDate(new Date(Math.min(...igDates))), "2026-02-26");
assert.equal(analytics.formatDate(new Date(Math.max(...igDates))), "2026-05-26");

const surgeryFb = facebook.rows.find((row) => row.caption.includes("ผ่าตัดเสริมจมูก"));
assert.ok(surgeryFb, "expected to find Facebook surgery content");
assert.equal(surgeryFb.departmentId, "surgery", "surgery content should remain in data and be filterable");

const kvkSurgeryVideoExamples = [
  "ถุงใต้ตาเป็นก้อน",
  "เหนียงใหญ่คางสองชั้น",
  "ปักตระกร้าแล้ว",
  "ลดน้ำหนักแต่เหนียงยังอยู่",
];
for (const text of kvkSurgeryVideoExamples) {
  const match = facebook.rows.find((row) => row.contentType === "video" && row.caption.includes(text));
  assert.ok(match, `expected to find Facebook video containing ${text}`);
  assert.equal(match.departmentId, "surgery", `${text} should be classified as surgery`);
}

const aestheticFb = facebook.rows.find((row) => row.caption.toLowerCase().includes("ultherapy"));
assert.ok(aestheticFb, "expected to find Facebook aesthetic content");
assert.equal(aestheticFb.departmentId, "aesthetic");

const facebookImageGrades = new Set(facebookImages.map((row) => row.qualityGrade));
assert.ok(facebookImageGrades.has("A"), "Facebook image CTR grading should create Grade A rows");
assert.ok(facebookImageGrades.has("C"), "Facebook image CTR grading should create Grade C rows");

const gradedVideo = facebookVideos.find((row) => row.retentionProxy !== null);
assert.ok(gradedVideo, "Facebook video rows with duration/watch data should get retention proxy");
assert.equal(["A", "B", "C"].includes(gradedVideo.qualityGrade), true);

const instagramGradeA = instagram.rows.find((row) => row.qualityGrade === "A");
assert.ok(instagramGradeA, "Instagram ER grading should create Grade A rows");
assert.equal(instagramGradeA.engagementRate >= 2.5, true);

const igEngagementCheck = instagram.rows[0];
assert.equal(
  igEngagementCheck.engagement,
  igEngagementCheck.likes +
    igEngagementCheck.comments +
    igEngagementCheck.shares +
    igEngagementCheck.saves +
    igEngagementCheck.follows,
);

const quotedMultiline = 'A,B,C\n1,"สองบรรทัด\nมี, comma และ ""quote""",3';
const quotedRows = analytics.parseCsv(quotedMultiline);
assert.equal(quotedRows[1][1], 'สองบรรทัด\nมี, comma และ "quote"');

console.log("Analytics tests passed");
