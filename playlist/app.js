/* ============================================
   音乐歌单分析 — 数据可视化
   ============================================ */

(function () {
  "use strict";

  /* ---------- 渐变配色 ---------- */
  var COLORS = [
    "#5e5ce6",
    "#30d158",
    "#ff9f0a",
    "#ff375f",
    "#bf5af2",
    "#5ac8fa",
    "#ff6482",
    "#34c759",
    "#ffd60a",
    "#64d2ff",
    "#ac8e68",
    "#ff453a",
    "#32ade6",
    "#a2845e",
    "#8e8e93",
  ];

  /* ---------- Chart.js 全局默认 ---------- */
  Chart.defaults.font.family =
    '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#6e6e73";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.tooltip.padding = 10;

  /* ---------- 工具 ---------- */
  function animateValue(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 滚动渐入动画 ---------- */
  function initScrollReveal() {
    var blocks = document.querySelectorAll(".chart-block");
    if (!("IntersectionObserver" in window)) {
      blocks.forEach(function (b) { b.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    blocks.forEach(function (block) {
      observer.observe(block);
    });
  }

  /* ---------- 渲染统计卡片 ---------- */
  function renderStats(data) {
    var items = [
      { icon: "🎵", value: data.totalTracks, label: "总歌曲数" },
      { icon: "🎤", value: data.uniqueArtists, label: "艺术家数" },
      { icon: "💿", value: data.uniqueAlbums, label: "专辑数" },
      { icon: "📱", value: data.uniquePlatforms, label: "平台数" },
    ];
    var grid = document.getElementById("statsGrid");
    items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "stat-card";
      card.innerHTML =
        '<div class="stat-icon">' +
        item.icon +
        "</div>" +
        '<div class="stat-value" data-target="' +
        item.value +
        '">0</div>' +
        '<div class="stat-label">' +
        item.label +
        "</div>";
      grid.appendChild(card);
    });
    /* 数字滚动动画 */
    grid.querySelectorAll(".stat-value").forEach(function (el) {
      animateValue(el, parseInt(el.dataset.target, 10), 1200);
    });
  }

  /* ---------- 平台分布甜甜圈 ---------- */
  function renderPlatformChart(data) {
    new Chart(document.getElementById("platformChart"), {
      type: "doughnut",
      data: {
        labels: data.platforms.map(function (p) {
          return p.name;
        }),
        datasets: [
          {
            data: data.platforms.map(function (p) {
              return p.count;
            }),
            backgroundColor: COLORS.slice(0, data.platforms.length),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "62%",
        plugins: { legend: { position: "bottom" } },
      },
    });
  }

  /* ---------- 艺术家柱状图 ---------- */
  function renderArtistChart(data) {
    new Chart(document.getElementById("artistChart"), {
      type: "bar",
      data: {
        labels: data.topArtists.map(function (a) {
          return a.name;
        }),
        datasets: [
          {
            label: "歌曲数",
            data: data.topArtists.map(function (a) {
              return a.count;
            }),
            backgroundColor: function (ctx) {
              var chart = ctx.chart;
              var gradient = chart.ctx.createLinearGradient(0, 0, chart.width, 0);
              gradient.addColorStop(0, "#5e5ce6");
              gradient.addColorStop(1, "#bf5af2");
              return gradient;
            },
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 32,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { precision: 0 } },
          y: { grid: { display: false } },
        },
      },
    });
  }

  /* ---------- 专辑柱状图 ---------- */
  function renderAlbumChart(data) {
    new Chart(document.getElementById("albumChart"), {
      type: "bar",
      data: {
        labels: data.topAlbums.map(function (a) {
          return a.name;
        }),
        datasets: [
          {
            label: "歌曲数",
            data: data.topAlbums.map(function (a) {
              return a.count;
            }),
            backgroundColor: function (ctx) {
              var chart = ctx.chart;
              var gradient = chart.ctx.createLinearGradient(0, 0, chart.width, 0);
              gradient.addColorStop(0, "#30d158");
              gradient.addColorStop(1, "#5ac8fa");
              return gradient;
            },
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 32,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { precision: 0 } },
          y: { grid: { display: false } },
        },
      },
    });
  }

  /* ---------- 时间线折线图 ---------- */
  function renderTrendChart(data) {
    new Chart(document.getElementById("trendChart"), {
      type: "line",
      data: {
        labels: data.monthlyTrend.map(function (m) {
          return m.month;
        }),
        datasets: [
          {
            label: "新增收藏",
            data: data.monthlyTrend.map(function (m) {
              return m.count;
            }),
            borderColor: "#5e5ce6",
            backgroundColor: function (ctx) {
              var chart = ctx.chart;
              var area = chart.chartArea;
              if (!area) return "rgba(94,92,230,0.08)";
              var gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
              gradient.addColorStop(0, "rgba(94,92,230,0.18)");
              gradient.addColorStop(1, "rgba(94,92,230,0.01)");
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 2.5,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { precision: 0 } },
        },
      },
    });
  }

  /* ---------- 场景标签甜甜圈 ---------- */
  function renderTagsChart(data) {
    new Chart(document.getElementById("tagsChart"), {
      type: "doughnut",
      data: {
        labels: data.periodTags.map(function (t) {
          return t.name;
        }),
        datasets: [
          {
            data: data.periodTags.map(function (t) {
              return t.count;
            }),
            backgroundColor: COLORS.slice(0, data.periodTags.length),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        cutout: "62%",
        plugins: { legend: { position: "bottom" } },
      },
    });
  }

  /* ---------- 入口 ---------- */
  fetch("./data.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderStats(data);
      renderPlatformChart(data);
      renderArtistChart(data);
      renderAlbumChart(data);
      renderTrendChart(data);
      renderTagsChart(data);
      initScrollReveal();
    })
    .catch(function (err) {
      console.error("Failed to load playlist data:", err);
    });
})();
