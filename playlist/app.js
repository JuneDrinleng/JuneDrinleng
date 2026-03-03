/* ============================================
   音乐歌单分析 — Vue 3 Dashboard
   ============================================ */

(function () {
  "use strict";

  var PALETTE = [
    "#6366f1", "#10b981", "#f59e0b", "#f43f5e",
    "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6",
    "#f97316", "#3b82f6", "#a855f7", "#84cc16",
    "#e11d48", "#0ea5e9", "#78716c"
  ];

  /* ---------- Chart.js 全局默认 ---------- */
  Chart.defaults.font.family = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#7c8297";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;

  /* ---------- 数字滚动动画 ---------- */
  function animateCounter(ref, target) {
    var start = 0;
    var duration = 1000;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      ref.value = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else ref.value = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  /* ---------- 图表渲染 ---------- */
  function renderPlatformChart(data) {
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
  }

  function renderTagsChart(data) {
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
  }

  function renderArtistChart(data) {
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
  }

  function renderAlbumChart(data) {
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
  }

  function renderTrendChart(data) {
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

  /* ---------- Vue App ---------- */
  var app = Vue.createApp({
    data: function () {
      return {
        data: {
          totalTracks: 0,
          uniqueArtists: 0,
          uniqueAlbums: 0,
          uniquePlatforms: 0,
          platforms: [],
          topArtists: [],
          topAlbums: [],
          periodTags: [],
          monthlyTrend: [],
          dateRange: { start: "", end: "" }
        },
        statItems: [],
        recentTotal: 0,
        trendDirection: 0,
        trendPercent: 0,
        peakMonth: { month: "-", count: 0 },
        monthlyAvg: 0,
        totalMonths: 0
      };
    },
    mounted: function () {
      var self = this;
      fetch("./data.json")
        .then(function (res) { return res.json(); })
        .then(function (json) {
          self.data = json;
          self.computeStats(json);
          self.computeInsights(json);
          Vue.nextTick(function () {
            renderPlatformChart(json);
            renderTagsChart(json);
            renderArtistChart(json);
            renderAlbumChart(json);
            renderTrendChart(json);
          });
        })
        .catch(function (err) {
          console.error("Failed to load playlist data:", err);
        });
    },
    methods: {
      computeStats: function (data) {
        var items = [
          { icon: "🎵", value: data.totalTracks, label: "总歌曲数", display: "0" },
          { icon: "🎤", value: data.uniqueArtists, label: "艺术家数", display: "0" },
          { icon: "💿", value: data.uniqueAlbums, label: "专辑数", display: "0" },
          { icon: "📱", value: data.uniquePlatforms, label: "平台数", display: "0" }
        ];
        this.statItems = items;
        var self = this;
        Vue.nextTick(function () {
          items.forEach(function (item) {
            animateCounter(item, item.value);
          });
          self.statItems = items.slice();
        });
      },

      computeInsights: function (data) {
        var trend = data.monthlyTrend;
        this.totalMonths = trend.length;

        /* peak month */
        var peak = { month: "", count: 0 };
        trend.forEach(function (m) {
          if (m.count > peak.count) peak = m;
        });
        this.peakMonth = peak;

        /* monthly average */
        var totalAll = 0;
        trend.forEach(function (m) { totalAll += m.count; });
        this.monthlyAvg = Math.round(totalAll / trend.length);

        /* recent 6 months vs previous 6 months */
        var recent6 = trend.slice(-6);
        var prev6 = trend.slice(-12, -6);

        var recentSum = 0;
        recent6.forEach(function (m) { recentSum += m.count; });
        this.recentTotal = recentSum;

        var prevSum = 0;
        prev6.forEach(function (m) { prevSum += m.count; });

        if (prevSum > 0) {
          var change = ((recentSum - prevSum) / prevSum * 100);
          this.trendDirection = change >= 0 ? 1 : -1;
          this.trendPercent = Math.round(Math.abs(change));
        } else {
          this.trendDirection = 1;
          this.trendPercent = 100;
        }
      }
    }
  });

  app.mount("#app");
})();
