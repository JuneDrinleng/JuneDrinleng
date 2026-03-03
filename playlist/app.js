/* ============================================
   音乐歌单分析 — Vanilla JS Dashboard
   ============================================ */

(function () {
  "use strict";

  var PALETTE = [
    "#6366f1", "#10b981", "#f59e0b", "#f43f5e",
    "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6",
    "#f97316", "#3b82f6", "#a855f7", "#84cc16",
    "#e11d48", "#0ea5e9", "#78716c"
  ];

  /* ---------- Chart.js 全局默认（安全检查） ---------- */
  function configureChartDefaults() {
    if (typeof Chart === "undefined") return;
    Chart.defaults.font.family = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#7c8297";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 14;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 10;
  }

  /* ---------- 数字滚动动画 ---------- */
  function animateCounter(el, target) {
    var duration = 1000;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  /* ---------- 统计卡片渲染 ---------- */
  function renderStatCards(data) {
    var items = [
      { icon: "🎵", value: data.totalTracks, label: "总歌曲数", color: 1 },
      { icon: "🎤", value: data.uniqueArtists, label: "艺术家数", color: 2 },
      { icon: "💿", value: data.uniqueAlbums, label: "专辑数", color: 3 },
      { icon: "📱", value: data.uniquePlatforms, label: "平台数", color: 4 }
    ];

    var grid = document.getElementById("statsGrid");
    grid.innerHTML = "";

    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "stat-card";

      var iconDiv = document.createElement("div");
      iconDiv.className = "stat-icon";
      iconDiv.textContent = item.icon;

      var valueDiv = document.createElement("div");
      valueDiv.className = "stat-value";
      valueDiv.textContent = "0";

      var labelDiv = document.createElement("div");
      labelDiv.className = "stat-label";
      labelDiv.textContent = item.label;

      card.appendChild(iconDiv);
      card.appendChild(valueDiv);
      card.appendChild(labelDiv);
      grid.appendChild(card);

      animateCounter(valueDiv, item.value);
    });
  }

  /* ---------- 近期偏好分析 ---------- */
  function renderInsights(data) {
    var trend = data.monthlyTrend;
    if (!trend || trend.length === 0) return;

    var totalMonths = trend.length;

    /* peak month */
    var peak = { month: "-", count: 0 };
    trend.forEach(function (m) {
      if (m.count > peak.count) peak = m;
    });

    /* monthly average */
    var totalAll = 0;
    trend.forEach(function (m) { totalAll += m.count; });
    var monthlyAvg = Math.round(totalAll / trend.length);

    /* recent 6 months vs previous 6 months */
    var recentCount = Math.min(6, trend.length);
    var recent6 = trend.slice(-recentCount);
    var prev6 = trend.length > 6 ? trend.slice(-12, -6) : [];

    var recentSum = 0;
    recent6.forEach(function (m) { recentSum += m.count; });

    var prevSum = 0;
    prev6.forEach(function (m) { prevSum += m.count; });

    var trendDirection = 0;
    var trendPercent = 0;
    if (prevSum > 0 && recentSum > 0) {
      var change = ((recentSum - prevSum) / prevSum * 100);
      trendDirection = change >= 0 ? 1 : -1;
      trendPercent = Math.round(Math.abs(change));
    } else if (recentSum > 0) {
      trendDirection = 1;
      trendPercent = 100;
    }

    document.getElementById("recentTotal").textContent = recentSum;
    document.getElementById("peakMonth").textContent = peak.month;
    document.getElementById("peakMonthDesc").textContent = "收藏了 " + peak.count + " 首歌曲";
    document.getElementById("monthlyAvg").textContent = monthlyAvg;
    document.getElementById("totalMonthsDetail").textContent = "基于全部 " + totalMonths + " 个月数据";

    /* trend badge */
    if (trendDirection !== 0) {
      var badge = document.getElementById("trendBadge");
      badge.style.display = "";
      badge.className = "insight-trend " + (trendDirection > 0 ? "trend-up" : "trend-down");
      badge.textContent = (trendDirection > 0 ? "↑" : "↓") +
        " 相比前 6 个月" + (trendDirection > 0 ? "增长" : "下降") + " " + trendPercent + "%";
    }

    /* favorite artist card */
    if (data.topArtists && data.topArtists.length > 0) {
      var card = document.getElementById("favArtistCard");
      card.style.display = "";
      document.getElementById("favArtistName").textContent = data.topArtists[0].name;
      document.getElementById("favArtistCount").textContent = "共收藏 " + data.topArtists[0].count + " 首歌曲";
      document.getElementById("favArtistTop3").textContent =
        "Top 3：" + data.topArtists.slice(0, 3).map(function (a) { return a.name; }).join("、");
    }
  }

  /* ---------- 平台详情表格 ---------- */
  function renderPlatformTable(data) {
    var body = document.getElementById("platformTableBody");
    body.innerHTML = "";
    if (!data.platforms || data.platforms.length === 0) return;
    var maxCount = data.platforms[0].count || 1;

    data.platforms.forEach(function (p) {
      var row = document.createElement("div");
      row.className = "platform-row";

      var name = document.createElement("span");
      name.className = "platform-name";
      name.textContent = p.name;

      var count = document.createElement("span");
      count.className = "platform-count";
      count.textContent = p.count;

      var percent = document.createElement("span");
      percent.className = "platform-percent";
      percent.textContent = ((p.count / data.totalTracks) * 100).toFixed(1) + "%";

      var barCell = document.createElement("span");
      barCell.className = "platform-bar-cell";
      var bar = document.createElement("span");
      bar.className = "platform-bar";
      bar.style.width = (p.count / maxCount * 100) + "%";
      barCell.appendChild(bar);

      row.appendChild(name);
      row.appendChild(count);
      row.appendChild(percent);
      row.appendChild(barCell);
      body.appendChild(row);
    });
  }

  /* ---------- 图表渲染 ---------- */
  function renderCharts(data) {
    if (typeof Chart === "undefined") return;

    new Chart(document.getElementById("platformChart"), {
      type: "doughnut",
      data: {
        labels: data.platforms.map(function (p) { return p.name; }),
        datasets: [{
          data: data.platforms.map(function (p) { return p.count; }),
          backgroundColor: PALETTE.slice(0, data.platforms.length),
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: "65%",
        plugins: { legend: { position: "bottom" } }
      }
    });

    new Chart(document.getElementById("tagsChart"), {
      type: "doughnut",
      data: {
        labels: data.periodTags.map(function (t) { return t.name; }),
        datasets: [{
          data: data.periodTags.map(function (t) { return t.count; }),
          backgroundColor: [PALETTE[1], PALETTE[3], PALETTE[2], PALETTE[4]].slice(0, data.periodTags.length),
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: "65%",
        plugins: { legend: { position: "bottom" } }
      }
    });

    new Chart(document.getElementById("artistChart"), {
      type: "bar",
      data: {
        labels: data.topArtists.map(function (a) { return a.name; }),
        datasets: [{
          label: "歌曲数",
          data: data.topArtists.map(function (a) { return a.count; }),
          backgroundColor: function (ctx) {
            var chart = ctx.chart;
            var g = chart.ctx.createLinearGradient(0, 0, chart.width, 0);
            g.addColorStop(0, "#6366f1");
            g.addColorStop(1, "#8b5cf6");
            return g;
          },
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 28
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { precision: 0 } },
          y: { grid: { display: false } }
        }
      }
    });

    new Chart(document.getElementById("albumChart"), {
      type: "bar",
      data: {
        labels: data.topAlbums.map(function (a) { return a.name; }),
        datasets: [{
          label: "歌曲数",
          data: data.topAlbums.map(function (a) { return a.count; }),
          backgroundColor: function (ctx) {
            var chart = ctx.chart;
            var g = chart.ctx.createLinearGradient(0, 0, chart.width, 0);
            g.addColorStop(0, "#10b981");
            g.addColorStop(1, "#06b6d4");
            return g;
          },
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 28
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { precision: 0 } },
          y: { grid: { display: false } }
        }
      }
    });

    new Chart(document.getElementById("trendChart"), {
      type: "line",
      data: {
        labels: data.monthlyTrend.map(function (m) { return m.month; }),
        datasets: [{
          label: "新增收藏",
          data: data.monthlyTrend.map(function (m) { return m.count; }),
          borderColor: "#6366f1",
          backgroundColor: function (ctx) {
            var chart = ctx.chart;
            var area = chart.chartArea;
            if (!area) return "rgba(99,102,241,0.08)";
            var g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
            g.addColorStop(0, "rgba(99,102,241,0.18)");
            g.addColorStop(1, "rgba(99,102,241,0.01)");
            return g;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2.5
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  /* ---------- 初始化 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    configureChartDefaults();

    fetch("./data.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        renderStatCards(data);
        renderInsights(data);
        renderPlatformTable(data);
        renderCharts(data);
      })
      .catch(function (err) {
        console.error("Failed to load playlist data:", err);
      });
  });
})();
