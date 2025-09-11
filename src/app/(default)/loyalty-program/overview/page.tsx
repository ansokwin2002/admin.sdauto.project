"use client"

import { Users, CreditCard, Gift, TrendingUp } from "lucide-react"
import { Card, Table, Flex, Box, Grid, Inset } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import BranchFilterInput from "@/components/common/BranchFilterInput"
import MetricCard from "@/components/common/MetricCard"
import { formatDate } from "@/utilities"
import { useChartOptions, chartColorPalettes } from "@/utilities/chartOptions"
import ChartLoadingPlaceholder from "@/components/common/ChartLoadingPlaceholder"
import { PageHeading } from "@/components/common/PageHeading"
import CardHeading from "@/components/common/CardHeading"
import { usePageTitle } from "@/hooks/usePageTitle"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function LoyaltyProgramOverview() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  usePageTitle('Loyalty Program');

  const clearFilter = () => {
    setSelectedBranch(null)
  }

  return (
    <Box className="space-y-6">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        justify="between" 
        align={{ initial: "stretch", sm: "center" }}
        gap={{ initial: "4", sm: "0" }}
        mb="5"
      >
        <PageHeading title="Loyalty Program" description="Management and analytics for your loyalty program" noMarginBottom/>
        <Box width={{ initial: "full", sm: "auto" }}>
          <BranchFilterInput
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            clearFilter={clearFilter}
          />
        </Box>
      </Flex>

      <MetricsSection />
      <ChartsSection />
      <ActivitySection />
    </Box>
  )
}

function MetricsSection() {
  const metrics = [
    {
      title: "Total Members",
      value: "12,458",
      change: "+12.5%",
      icon: <Users size={16} color="blue" />,
    },
    {
      title: "Active Points",
      value: "1.2M",
      change: "+8.3%",
      icon: <CreditCard size={16} color="green" />,
    },
    {
      title: "Rewards Redeemed",
      value: "3,245",
      change: "+15.2%",
      icon: <Gift size={16} color="orange" />,
    },
    {
      title: "Member Growth",
      value: "8.7%",
      change: "+2.1%",
      icon: <TrendingUp size={16} color="purple" />,
    },
  ]

  return (
    <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description="vs. last month"
          icon={metric.icon}
          trend={metric.change.startsWith('+') ? 'up' : 'down'}
          trendValue={metric.change}
          variant="flat"
        />
      ))}
    </Grid>
  )
}

function ChartsSection() {
  const [isClient, setIsClient] = useState(false);
  const [chartsLoading, setChartsLoading] = useState(true);
  const chartOptions = useChartOptions();
  
  useEffect(() => {
    setIsClient(true);
    // Add a small delay to simulate chart loading
    const timer = setTimeout(() => {
      setChartsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const growthChartSeries = [
    {
      name: "Members",
      data: [10000, 11000, 12458],
    }
  ]

  const demographicsChartSeries = [30, 40, 20, 10]

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="4">
      <Card size="3">
        <CardHeading title="Member Growth"/>
        <div className="h-[300px]">
          {isClient ? (
            chartsLoading ? (
              <ChartLoadingPlaceholder height={300} />
            ) : (
              <Chart
                options={chartOptions.getLineOptions({
                  xaxis: {
                    ...chartOptions.getBaseXAxisOptions(),
                    categories: ["Jan", "Feb", "Mar"],
                  },
                  yaxis: {
                    labels: {
                      ...chartOptions.getBaseYAxisLabels(),
                      formatter: (value: number) => value.toLocaleString(),
                    },
                  },
                  colors: [chartColorPalettes.positive[0]],
                  tooltip: {
                    ...chartOptions.getBaseTooltipOptions(),
                    y: {
                      formatter: (value: number) => value.toLocaleString(),
                    },
                  },
                })}
                series={growthChartSeries}
                type="line"
                height="100%"
              />
            )
          ) : (
            <ChartLoadingPlaceholder height={300} />
          )}
        </div>
      </Card>

      <Card size="3">
        <CardHeading title="Member Demographics"/>
        <div className="h-[300px]">
          {isClient ? (
            chartsLoading ? (
              <ChartLoadingPlaceholder height={300} />
            ) : (
              <Chart
                options={chartOptions.getPieOptions({
                  labels: ["18-24", "25-34", "35-44", "45+"],
                  colors: chartColorPalettes.warm,
                  tooltip: {
                    ...chartOptions.getBaseTooltipOptions(),
                  },
                })}
                series={demographicsChartSeries}
                type="pie"
                height="100%"
              />
            )
          ) : (
            <ChartLoadingPlaceholder height={300} />
          )}
        </div>
      </Card>
    </Grid>
  )
}

function ActivitySection() {
  const recentActivity = [
    {
      id: 1,
      member: "John Doe",
      action: "Points Earned",
      amount: "250",
      date: "2024-03-20 14:30",
      branch: "San Francisco Branch",
    },
    {
      id: 2,
      member: "Jane Smith",
      action: "Reward Redeemed",
      amount: "Free Coffee",
      date: "2024-03-20 13:15",
      branch: "Avenue Mall Branch",
    },
    {
      id: 3,
      member: "Mike Johnson",
      action: "New Member",
      amount: "Joined",
      date: "2024-03-20 12:45",
      branch: "Los Angeles Branch",
    },
  ]

  return (
    <Card size="3">
      <CardHeading title="Recent Activity" mb="8" />
      <Inset>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Branch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recentActivity.map((activity) => (
              <Table.Row key={activity.id}>
                <Table.Cell>{activity.member}</Table.Cell>
                <Table.Cell>{activity.action}</Table.Cell>
                <Table.Cell>{activity.amount}</Table.Cell>
                <Table.Cell>{activity.branch}</Table.Cell>
                <Table.Cell>{formatDate(new Date(activity.date))}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Inset>
    </Card>
  )
}
