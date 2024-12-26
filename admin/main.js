var vm = new StoreinoApp({
  el: "#app_simulator",

  data: {
    data: __DATA__,
    tabs: [
      { name: "main", title: "Main", content: "Welcome to the Mian Tab" },
      {
        name: "analytics",
        title: "Analytics",
        content: "Welcome to Analytics Tab",
      },
      {
        name: "settings",
        title: "Settings",
        content: "Adjust your Settings here",
      },
    ],
    activeTab: "main",
    ShowDetails: false,
    toSaveData: false,
    selectedMonth: "",
    buyPrice: 0,
    adscost: 0,
    ordersLeadNumber: 0,
    ordersNumber: "-------",
    ConfirmedLeadNumber: 0,
    DeliverdLeadNumber: 0,
    confirmationcost: 0,
    stockagecost: 0,

    deliverycost: 0,
    LeadPrice: 0,
    SalePrice: 0,
    profits: 0,
    realAdsCost: 0,
    confirmationTotalCost: 0,
    storageTotalCost: 0,
    deliveryTotalCost: 0,
    AnalyticsData: {},
    chartData: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgba(248, 121, 121, 0.5)",
          borderColor: "#f87979",
          data: [40, 20, 30, 50, 70, 60, 80],
        },
        {
          label: "Revenue",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "#4bc0c0",
          data: [35, 25, 45, 65, 85, 75, 95],
        },
        {
          label: "Expenses",
          backgroundColor: "#9966ff",
          borderColor: "#9966ff",
          data: [25, 15, 35, 55, 65, 50, 70],
        },
        {
          label: "Profits",
          backgroundColor: "rgba(25, 229, 87, 0.5)",
          borderColor: "#19e557",
          data: [0, 18, 44, 55, 90, 33, 21],
        },
      ],
    },
    sales: 0,
    revenue: 0,
    expenses: 0,
  },
  computed: {},
  mounted() {
    const currnTDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.selectedMonth = monthNames[currnTDate.getMonth()];
    console.log("🚀 ~ mounted ~  this.data:",  this.data)
    this.AnalyticsData=this.data.AnalyticsData;
    console.log("🚀 ~ mounted ~  this.AnalyticsData:",  this.AnalyticsData)
  },
  watch: {
    buyPrice(val) {
      this.calculateProfits();
    },
    adscost(val) {
      this.calculateProfits();
    },
    ordersLeadNumber(val) {
      this.calculateProfits();
    },
    ConfirmedLeadNumber(val) {
      this.calculateProfits();
    },
    confirmationcost(val) {
      this.calculateProfits();
    },
    stockagecost(val) {
      this.calculateProfits();
    },
    deliverycost(val) {
      this.calculateProfits();
    },
    LeadPrice(val) {
      this.calculateProfits();
    },
    DeliverdLeadNumber(val) {
      this.calculateProfits();
    },
    SalePrice(val) {
      this.calculateProfits();
    },
    activeTab(val) {
      console.log("🚀 ~ activeTab ~ val:", val);
      if (val === "analytics") {
        this.$nextTick(() => {
          this.renderChart();
        });
      }
    },
  },
  methods: {
    saveDataAnalytics() {
      const datasetConfig = {
        Profits: { backgroundColor: "#19e557", borderColor: "#19e557" },
        Expenses: { backgroundColor: "#9966ff", borderColor: "#9966ff" },
        Revenue: { backgroundColor: "#4bc0c0", borderColor: "#4bc0c0" },
        Sales: { backgroundColor: "#f87979", borderColor: "#f87979" },
      };
    
      const currentMonthData = {
        month: this.selectedMonth,
        datasets: Object.entries(datasetConfig).map(([key, config]) => ({
          label: key,
          ...config,
          value: this[key.toLowerCase()] || 0,
        })),
      };
    
      if (!this.AnalyticsData || !Array.isArray(this.AnalyticsData)) {
        this.AnalyticsData = [];
      }
    
      const existingIndex = this.AnalyticsData.findIndex(
        (data) => data.month === this.selectedMonth
      );
    
      if (existingIndex !== -1) {
        // Update existing month data
        this.$set(this.AnalyticsData, existingIndex, currentMonthData);
      } else {
        // Add new month data
        this.AnalyticsData.push(currentMonthData);
      }
    
      // Update data.AnalyticsData with the latest AnalyticsData
      this.$set(this.data, "AnalyticsData", [...this.AnalyticsData]);
    
      console.log("Updated AnalyticsData:", this.AnalyticsData);
      this.toSaveData = false;
    },
    renderChart() {
      const canvas = document.getElementById("mychart");
      console.log("🚀 ~ renderChart ~ canvas:", canvas);
      if (canvas) {
        const ctx = canvas.getContext("2d");
        console.log("🚀 ~ renderChart ~ ctx:", ctx);
    
        // Prepare data for Chart.js
        const labels = this.AnalyticsData.map((item) => item.month); // X-axis labels
        const datasets = this.AnalyticsData[0]?.datasets.map((datasetConfig, index) => ({
          label: datasetConfig.label,
          backgroundColor: datasetConfig.backgroundColor,
          borderColor: datasetConfig.borderColor,
          borderWidth: 1,
          data: this.AnalyticsData.map((item) => item.datasets[index].value), // Y-axis data for each dataset
        }));
    
        // Create the chart
        new Chart(ctx, {
          type: "bar", // Choose chart type
          data: {
            labels, // Months (X-axis)
            datasets, // Dynamic datasets based on AnalyticsData
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Months",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Values",
                },
              },
            },
          },
        });
      } else {
        console.error("Canvas element not found.");
      }
    },
    selectTab(tabName) {
      this.activeTab = tabName;
    },
    calculateProfits() {
      const SalePrice = parseFloat(this.SalePrice ?? 0);
      const ordersLeadNumber = parseFloat(this.ordersLeadNumber ?? 0);
      const confirmationcost = parseFloat(this.confirmationcost ?? 0);
      const stockagecost = parseFloat(this.stockagecost ?? 0);
      const deliverycost = parseFloat(this.deliverycost ?? 0);
      const buyPrice = parseFloat(this.buyPrice ?? 0);
      const deleivredLeadNumber = parseFloat(this.DeliverdLeadNumber ?? 0);
      const ConfirmedLeadNumber = parseFloat(this.ConfirmedLeadNumber ?? 0);
      const adscost = parseFloat(this.adscost ?? 0);

      const Geted = SalePrice * deleivredLeadNumber;
      console.log("🚀 ~ calculateProfits ~ Geted:", Geted);

      const lost =
        deliverycost * deleivredLeadNumber +
        adscost +
        confirmationcost * ordersLeadNumber +
        stockagecost * ordersLeadNumber +
        deleivredLeadNumber * buyPrice;
      this.expenses = lost;
      this.revenue = Geted;
      this.sales = deleivredLeadNumber;
      console.log("🚀 ~ calculateProfits ~ lost:", lost);
      this.profits = Geted - lost;

      // Call `calculateTotalsCosts` directly using `this` properties
      this.calculateTotalsCosts();
    },
    calculateTotalsCosts() {
      const adscost = parseFloat(this.adscost ?? 0);
      const ConfirmedLeadNumber = parseFloat(this.ConfirmedLeadNumber ?? 0);
      const ordersLeadNumber = parseFloat(this.ordersLeadNumber ?? 0);
      const deleivredLeadNumber = parseFloat(this.DeliverdLeadNumber ?? 0);
      const confirmationcost = parseFloat(this.confirmationcost ?? 0);
      const stockagecost = parseFloat(this.stockagecost ?? 0);
      const deliverycost = parseFloat(this.deliverycost ?? 0);

      // Avoid division by zero
      this.realAdsCost =
        deleivredLeadNumber !== 0 ? adscost / deleivredLeadNumber : 0;

      this.confirmationTotalCost = confirmationcost * ordersLeadNumber || 0;

      this.storageTotalCost = stockagecost * ordersLeadNumber || 0;
      this.deliveryTotalCost = deliverycost * deleivredLeadNumber || 0;
    },
    svg(name) {
      const icons = {
        edit: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/></svg>',
        delete:
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>',
        add: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
        open: '<svg xmlns="http://www.w3.org/2000/svg"  height="24px" viewBox="0 -960 960 960" width="20px" fill="#00000"><path d="m280-400 200-200 200 200H280Z"/></svg>',
        close:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px" fill="#00000"><path d="M480-360 280-560h400L480-360Z"/></svg>',
        styles:
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M340-540H200q-33 0-56.5-23.5T120-620v-140q0-33 23.5-56.5T200-840h140q33 0 56.5 23.5T420-760v140q0 33-23.5 56.5T340-540Zm-140-80h140v-140H200v140Zm140 500H200q-33 0-56.5-23.5T120-200v-140q0-33 23.5-56.5T200-420h140q33 0 56.5 23.5T420-340v140q0 33-23.5 56.5T340-120Zm-140-80h140v-140H200v140Zm560-340H620q-33 0-56.5-23.5T540-620v-140q0-33 23.5-56.5T620-840h140q33 0 56.5 23.5T840-760v140q0 33-23.5 56.5T760-540Zm-140-80h140v-140H620v140Zm140 500H620q-33 0-56.5-23.5T540-200v-140q0-33 23.5-56.5T620-420h140q33 0 56.5 23.5T840-340v140q0 33-23.5 56.5T760-120Zm-140-80h140v-140H620v140ZM340-620Zm0 280Zm280-280Zm0 280Z"/></svg>',
        cancel:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>',
        done: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#314D1C"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>',
        drag: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#AB4459"><path d="M200-380v-40h560v40H200Zm0-160v-40h560v40H200Z"/></svg>',
        settings:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="##434343"><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z"/></svg>',
        sell: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M856-390 570-104q-12 12-27 18t-30 6q-15 0-30-6t-27-18L103-457q-11-11-17-25.5T80-513v-287q0-33 23.5-56.5T160-880h287q16 0 31 6.5t26 17.5l352 353q12 12 17.5 27t5.5 30q0 15-5.5 29.5T856-390ZM513-160l286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640Zm220 160Z"/></svg>',
        deleivred:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120ZM360-540Z"/></svg>',
        storage:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>',
        ordered:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M200-200v-560 454-85 191Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v320h-80v-320H200v560h280v80H200Zm494 40L552-222l57-56 85 85 170-170 56 57L694-80ZM320-440q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 160h240v-80H440v80Zm0-160h240v-80H440v80Z"/></svg>',
        confirmed:
          '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M480-40v-80h280v-40H600v-320h160v-40q0-116-82-198t-198-82q-116 0-198 82t-82 198v40h160v320H200q-33 0-56.5-23.5T120-240v-280q0-74 28.5-139.5T226-774q49-49 114.5-77.5T480-880q74 0 139.5 28.5T734-774q49 49 77.5 114.5T840-520v400q0 33-23.5 56.5T760-40H480ZM200-240h80v-160h-80v160Zm480 0h80v-160h-80v160ZM200-400h80-80Zm480 0h80-80Z"/></svg>',
        ads: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M720-440v-80h160v80H720Zm48 280-128-96 48-64 128 96-48 64Zm-80-480-48-64 128-96 48 64-128 96ZM200-200v-160h-40q-33 0-56.5-23.5T80-440v-80q0-33 23.5-56.5T160-600h160l200-120v480L320-360h-40v160h-80Zm240-182v-196l-98 58H160v80h182l98 58Zm120 36v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346ZM300-480Z"/></svg>',
        buy: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e16f23"><path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"/></svg>',
      };
      return icons[name] || "";
    },
  },
});
