const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const analytics = require("../app.js");

const facebookPath = path.join(
  __dirname,
  "..",
  "sources",
  "Apr-28-2026_May-25-2026_2176080329882985.csv",
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

assert.equal(facebookMatrix.length, 102, "Facebook CSV should include one header row plus 101 data rows");
assert.equal(facebook.headers.length, 196, "Facebook CSV should parse the expanded Meta export schema");
assert.equal(facebook.rows.length, 101, "Facebook CSV should parse 101 posts");

assert.equal(instagramMatrix.length, 178, "Instagram CSV should include one header row plus 177 data rows");
assert.equal(instagram.headers.length, 18, "Instagram CSV should parse 18 headers");
assert.equal(instagram.rows.length, 177, "Instagram CSV should parse 177 posts");

const facebookImages = facebook.rows.filter((row) => row.contentType === "image");
const facebookVideos = facebook.rows.filter((row) => row.contentType === "video");
assert.equal(facebookImages.length, 73, "Facebook should split 73 image posts");
assert.equal(facebookVideos.length, 28, "Facebook should split 28 video posts");

const instagramImages = instagram.rows.filter((row) => row.contentType === "image");
const instagramVideos = instagram.rows.filter((row) => row.contentType === "video");
assert.equal(instagramImages.length, 91, "Instagram should split image/slide posts");
assert.equal(instagramVideos.length, 86, "Instagram should split Reels posts");

const fbDates = facebook.rows.map((row) => row.publishedAt).filter(Boolean);
assert.equal(analytics.formatDate(new Date(Math.min(...fbDates))), "2026-04-28");
assert.equal(analytics.formatDate(new Date(Math.max(...fbDates))), "2026-05-25");

const igDates = instagram.rows.map((row) => row.publishedAt).filter(Boolean);
assert.equal(analytics.formatDate(new Date(Math.min(...igDates))), "2026-02-26");
assert.equal(analytics.formatDate(new Date(Math.max(...igDates))), "2026-05-26");

const surgeryFb = facebook.rows.find((row) => row.caption.includes("ผ่าตัดเสริมจมูก"));
assert.ok(surgeryFb, "expected to find Facebook surgery content");
assert.equal(surgeryFb.departmentId, "surgery", "surgery content should remain in data and be filterable");

const aestheticFb = facebook.rows.find((row) => row.caption.toLowerCase().includes("ultherapy"));
assert.ok(aestheticFb, "expected to find Facebook aesthetic content");
assert.equal(aestheticFb.departmentId, "aesthetic");

const facebookImageGrades = new Set(facebookImages.map((row) => row.qualityGrade));
assert.ok(facebookImageGrades.has("A"), "Facebook image market grading should create Grade A rows");
assert.ok(facebookImageGrades.has("C"), "Facebook image market grading should create Grade C rows");
assert.ok(facebookImageGrades.has("NA"), "Facebook rows below the validity gate should be N/A");

const gradedVideo = facebookVideos.find((row) => row.qualityGrade !== "NA");
assert.ok(gradedVideo, "Facebook video rows with actual 3-second viewer data should be graded");
assert.equal(["A", "B", "C"].includes(gradedVideo.qualityGrade), true);
assert.equal("hookProxy" in gradedVideo, false, "Facebook must not infer a 3-second Hook from average watch");
assert.equal(gradedVideo.hasActualThreeSecondMetric, true);
assert.equal(
  gradedVideo.threeSecondViewerRate,
  (gradedVideo.uniqueThreeSecondViewers / gradedVideo.reach) * 100,
  "3s Hook Rate must use actual unique 3-second viewers divided by reach",
);
if (gradedVideo.duration >= 60 && gradedVideo.uniqueOneMinuteViewers !== null) {
  assert.equal(
    gradedVideo.oneMinuteContinuationRate,
    (gradedVideo.uniqueOneMinuteViewers / gradedVideo.uniqueThreeSecondViewers) * 100,
    "1min continuation must use actual unique viewer counts",
  );
}

const replayExample = analytics.evaluateFacebookVideo({ avgWatchSeconds: 12, duration: 6, views: 500 });
assert.equal(replayExample.rawAverageWatchRatio, 200, "raw watch ratio should preserve replay/loop evidence");
assert.equal(replayExample.averageWatchRatio, 100, "watch ratio used for grading must be capped at 100");
assert.equal(replayExample.dataValid, true);

const watchDepthExample = analytics.evaluateFacebookVideo({
  avgWatchSeconds: 4.5,
  duration: 30,
  reach: 400,
  uniqueThreeSecondViewers: 120,
  views: 500,
});
assert.equal(watchDepthExample.averageWatchRatio, 15, "watch depth should use average watch seconds divided by duration");

const lowViewsExample = analytics.evaluateFacebookVideo({ avgWatchSeconds: 4.5, duration: 12, views: 80 });
assert.equal(lowViewsExample.dataValid, false, "low-view videos should not be graded");

const marketRows = [
  {
    benchmarkGroup: "facebook_video_actual_3s_short",
    dataValid: true,
    threeSecondViewerRate: 35,
    averageWatchRatio: 22,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_short",
    dataValid: true,
    threeSecondViewerRate: 25,
    averageWatchRatio: 12,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_short",
    dataValid: true,
    threeSecondViewerRate: 35,
    averageWatchRatio: 8,
  },
];
analytics.applyMarketGrades(marketRows);
assert.deepEqual(
  marketRows.map((row) => row.qualityGrade),
  ["A", "B", "C"],
  "short Facebook videos must pass both 3s Hook and Watch Depth",
);

const longVideoMarketRows = [
  {
    benchmarkGroup: "facebook_video_actual_3s_mid",
    dataValid: true,
    duration: 90,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: 16,
    averageWatchRatio: 8,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_mid",
    dataValid: true,
    duration: 90,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: 9,
    averageWatchRatio: 5.5,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_mid",
    dataValid: true,
    duration: 90,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: 16,
    averageWatchRatio: 4,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_mid",
    dataValid: true,
    duration: 90,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: null,
    averageWatchRatio: 8,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_mid",
    dataValid: true,
    duration: 90,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: 16,
    averageWatchRatio: null,
  },
  {
    benchmarkGroup: "facebook_video_actual_3s_long",
    dataValid: true,
    duration: 240,
    threeSecondViewerRate: 35,
    oneMinuteContinuationRate: 16,
    averageWatchRatio: 3,
  },
];
analytics.applyMarketGrades(longVideoMarketRows);
assert.deepEqual(
  longVideoMarketRows.map((row) => row.qualityGrade),
  ["A", "B", "C", "NA", "NA", "B"],
  "long Facebook videos must include actual 1-minute continuation and length-adjusted Watch Depth in the overall grade",
);

const zeroClickImage = facebookImages.find((row) => row.dataValid && row.clickRate === 0);
assert.ok(zeroClickImage, "new Facebook database should include a valid zero-click image");
assert.equal(zeroClickImage.qualityGrade, "C", "zero-click images with weak engagement should remain Grade C");

const youtubeMatrix = [
  Object.values(analytics.YT_HEADERS),
  ["long-a", "Long-form winner", "Jan 5, 2026", 300, 1000, 45, 70, 1200, 50, 12, "0:02:15", 10000, 5.2],
  ["short-c", "Short with weak hook", "Jan 6, 2026", 45, 800, 80, 42, 900, 8, 3, "0:00:36", 2000, 3],
  ["short-loop", "Short replay winner", "Jan 7, 2026", 20, 500, 125, 65, 900, 8, 4, "0:00:25", 1500, 4],
  ["missing", "Missing metrics", "14", 90, 0, "14", "14", 0, 0, 0, "14", 0, "14"],
];
const youtube = analytics.processYoutubeMatrix(youtubeMatrix);
assert.equal(youtube.rows.length, 4);
assert.equal(youtube.rows[0].contentType, "long");
assert.equal(youtube.rows[0].qualityGrade, "B", "long-form retention should use length-adjusted market thresholds");
assert.equal(youtube.rows[1].contentType, "short");
assert.equal(youtube.rows[1].qualityGrade, "C", "Shorts should fail when stayed-to-watch is below the standard");
assert.equal(youtube.rows[2].qualityScore, 100, "APV above 100 should be capped for grading");
assert.equal(youtube.rows[2].averageViewPercentage, 125, "raw APV should still preserve replay evidence");
assert.equal(youtube.rows[2].qualityGrade, "A", "Shorts can grade A only when capped APV and stayed-to-watch both pass");
assert.equal(youtube.rows[3].qualityGrade, "NA", "placeholder values should not be graded");

const instagramGradeA = instagram.rows.find((row) => row.qualityGrade === "A");
assert.ok(instagramGradeA, "Instagram market grading should create Grade A rows");
assert.equal(instagramGradeA.engagementRate >= 3.7, true);

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
