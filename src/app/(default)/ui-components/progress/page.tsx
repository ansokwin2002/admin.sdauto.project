'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Progress, Card, Flex, Heading, Text, Button, Box } from '@radix-ui/themes'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function ProgressDemo() {
  usePageTitle('Progress')
  const [value, setValue] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Function to start progress timer
  const startProgressTimer = useCallback(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    const timer = setInterval(() => {
      setValue((prevValue) => {
        if (prevValue >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevValue + 5
      })
    }, 500)
    
    timerRef.current = timer
    return timer
  }, [])
  
  // For controlled progress demo
  useEffect(() => {
    const timer = startProgressTimer()
    
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [startProgressTimer])
  
  // Reset progress
  const handleReset = () => {
    setValue(0)
    startProgressTimer()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div>
      <Heading mb="5">Progress</Heading>
      
      <div className="space-y-5">
        {/* Basic Progress */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Progress</Heading>
          <Flex direction="column" gap="3">
            <Progress value={75} />
            <Text size="2" color="gray">Default progress bar at 75%</Text>
          </Flex>
        </Card>

        {/* Controlled Progress */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Controlled Progress</Heading>
          <Flex direction="column" gap="3">
            <Progress value={value} />
            <Flex gap="3" align="center">
              <Text size="2" color="gray">Current value: {value}%</Text>
              <Button size="1" onClick={handleReset}>Reset</Button>
            </Flex>
          </Flex>
        </Card>

        {/* Indeterminate Progress */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Indeterminate Progress</Heading>
          <Flex direction="column" gap="3">
            <Progress duration="10s" />
            <Text size="2" color="gray">Loading with unknown completion time after <code>duration=&quot;10s&quot;</code> has passed</Text>
          </Flex>
        </Card>

        {/* Progress Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Progress Sizes</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Size 1:</Text>
              </Box>
              <Progress size="1" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Size 2:</Text>
              </Box>
              <Progress size="2" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Size 3:</Text>
              </Box>
              <Progress size="3" value={60} />
            </Flex>
          </Flex>
        </Card>

        {/* Progress Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Progress Variants</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Classic:</Text>
              </Box>
              <Progress variant="classic" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Soft:</Text>
              </Box>
              <Progress variant="soft" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Surface:</Text>
              </Box>
              <Progress variant="surface" value={60} />
            </Flex>
          </Flex>
        </Card>

        {/* Progress Colors */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Progress Colors</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Indigo:</Text>
              </Box>
              <Progress color="indigo" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Cyan:</Text>
              </Box>
              <Progress color="cyan" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Green:</Text>
              </Box>
              <Progress color="green" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Orange:</Text>
              </Box>
              <Progress color="orange" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Red:</Text>
              </Box>
              <Progress color="red" value={60} />
            </Flex>
          </Flex>
        </Card>

        {/* Progress Radius */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Progress Radius</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">None:</Text>
              </Box>
              <Progress radius="none" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Small:</Text>
              </Box>
              <Progress radius="small" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Medium:</Text>
              </Box>
              <Progress radius="medium" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Large:</Text>
              </Box>
              <Progress radius="large" value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="80px">
                <Text size="2">Full:</Text>
              </Box>
              <Progress radius="full" value={60} />
            </Flex>
          </Flex>
        </Card>

        {/* High Contrast Progress */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">High Contrast Progress</Heading>
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box width="120px">
                <Text size="2">High Contrast:</Text>
              </Box>
              <Progress highContrast value={60} />
            </Flex>
            <Flex align="center" gap="3">
              <Box width="120px">
                <Text size="2">Normal Contrast:</Text>
              </Box>
              <Progress value={60} />
            </Flex>
          </Flex>
        </Card>
      </div>
    </div>
  )
}