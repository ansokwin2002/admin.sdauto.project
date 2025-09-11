import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';

const textColorDark = '#e2e8f0';
const textColorLight = '#334155';
const gridColorDark = '#3f3f46';
const gridColorLight = '#e2e8f0';

// Base y-axis labels
const baseYAxisLabels = (isDarkMode: boolean) => {
  const textColor = isDarkMode ? textColorDark : textColorLight;
  return {
    style: {
      colors: textColor,
      fontSize: '12px',
    },
  };
};

const baseXAxisLabels = (isDarkMode: boolean) => {
  const textColor = isDarkMode ? textColorDark : textColorLight;
  return {
    style: {
      colors: textColor,
      fontSize: '12px',
    },
  };
};

const baseXAxisOptions = (isDarkMode: boolean) => {
  const gridColor = isDarkMode ? gridColorDark : gridColorLight;
  return {
    labels: baseXAxisLabels(isDarkMode),
    axisBorder: {
      color: gridColor,
    },
    axisTicks: {
      color: gridColor,
    },
  };
};

const baseLegendLabels = (isDarkMode: boolean) => {
  const textColor = isDarkMode ? textColorDark : textColorLight;
  return {
    labels: {
      colors: textColor,
    },
  };
};

const baseTooltipOptions = (isDarkMode: boolean) => {
  return {
    theme: isDarkMode ? 'dark' : 'light',
    style: {
      fontSize: '12px',
    },
  };
};

// Common base options for all charts
const getBaseChartOptions = (isDarkMode: boolean): ApexOptions => {
  const gridColor = isDarkMode ? gridColorDark : gridColorLight;

  return {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      background: 'transparent',
      fontFamily: 'var(--font-plus-jakarta-sans), sans-serif',
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
    },
    yaxis: {
      labels: baseYAxisLabels(isDarkMode),
    },
    legend: {
      ...baseLegendLabels(isDarkMode),
      position: 'top',
      markers: {
        strokeWidth: 0,
        shape: 'circle', 
      },
    },
  };
};

// Specific chart type presets
const getLineChartOptions = (isDarkMode: boolean, customOptions?: ApexOptions): ApexOptions => {
  return {
    ...getBaseChartOptions(isDarkMode),
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: {
        size: 7
      }
    },
    ...customOptions,
  };
};

const getBarChartOptions = (isDarkMode: boolean, customOptions?: ApexOptions): ApexOptions => {
  return {
    ...getBaseChartOptions(isDarkMode),
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    ...customOptions,
  };
};

const getStackedBarChartOptions = (isDarkMode: boolean, customOptions?: ApexOptions): ApexOptions => {
  return {
    ...getBaseChartOptions(isDarkMode),
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          position: 'top',
        },
        distributed: false,
      },
    },
    ...customOptions,
  };
};

const getHorizontalBarChartOptions = (isDarkMode: boolean, customOptions?: ApexOptions): ApexOptions => {
  return {
    ...getBaseChartOptions(isDarkMode),
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    ...customOptions,
  };
};

const getPieChartOptions = (isDarkMode: boolean, customOptions?: ApexOptions): ApexOptions => {
  return {
    ...getBaseChartOptions(isDarkMode),
    stroke: {
      width: 0,
    },
    legend: {
      position: 'right',
      markers: {
        strokeWidth: 0,
        shape: 'circle',
      },
      labels: {
        colors: isDarkMode ? '#e2e8f0' : '#334155',
      },
    },
    ...customOptions,
  };
};

// React hook to use chart options with theme awareness
export const useChartOptions = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return {
    getBaseYAxisLabels: () => baseYAxisLabels(isDarkMode),
    getBaseXAxisLabels: () => baseXAxisLabels(isDarkMode),
    getBaseXAxisOptions: () => baseXAxisOptions(isDarkMode),
    getBaseTooltipOptions: () => baseTooltipOptions(isDarkMode),
    getBaseOptions: (customOptions?: ApexOptions) => ({
      ...getBaseChartOptions(isDarkMode),
      ...customOptions,
    }),
    getLineOptions: (customOptions?: ApexOptions) => getLineChartOptions(isDarkMode, customOptions),
    getBarOptions: (customOptions?: ApexOptions) => getBarChartOptions(isDarkMode, customOptions),
    getStackedBarOptions: (customOptions?: ApexOptions) => getStackedBarChartOptions(isDarkMode, customOptions),
    getHorizontalBarOptions: (customOptions?: ApexOptions) => getHorizontalBarChartOptions(isDarkMode, customOptions),
    getPieOptions: (customOptions?: ApexOptions) => getPieChartOptions(isDarkMode, customOptions),
    isDarkMode,
  };
};

// Predefined color palettes
export const chartColorPalettes = {
  default: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#0ea5e9'],
  muted: ['#3b82f6', '#22c55e', '#eab308', '#d946ef', '#7c3aed', '#06b6d4'],
  warm: ['#7C444F', '#9F5255', '#E16A54', '#F39E60', '#FFCF9D', '#FFB38E'],
  cool: ['#8174A0', '#A888B5', '#EFB6C8', '#80BCBD', '#AAD9BB', '#D5F0C1'],
  monochrome: ['#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5', '#fafafa'],
  restaurant: ['#f97316', '#ea580c', '#c2410c', '#f59e0b', '#d97706', '#fef3c7'],
  positive: ['#34d399', '#10b981', '#22c55e', '#6ee7b7', '#10b981', '#d1fae5'],
  negative: ['#f87171', '#ef4444', '#dc2626', '#fca5a5', '#f87171', '#fee2e2'],
  info: ['#3b82f6', '#2563eb', '#1d4ed8', '#93c5fd', '#3b82f6', '#dbeafe'],
};