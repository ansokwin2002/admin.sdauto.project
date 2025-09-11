'use client'

import { usePageTitle } from "@/hooks/usePageTitle"
import { Spinner, Card, Heading, Flex, Switch, Button } from '@radix-ui/themes'
import { Bookmark } from 'lucide-react'
import { useState } from 'react'

export default function SpinnerDemo() {
  usePageTitle('Spinner')
  const [spinnerLoading, setSpinnerLoading] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)

  const handleSwitchChange = () => {
    setSpinnerLoading(!spinnerLoading)
    setTimeout(() => {
      setSwitchChecked(!switchChecked)
      setSpinnerLoading(spinnerLoading)
    }, 1000)
  }

  return (
    <div>
      <Heading mb="5">Spinner</Heading>
      
      <div className="space-y-5">
        {/* Basic Spinners */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Spinners</Heading>
          <Flex gap="4" wrap="wrap">
            <Spinner />
            <Spinner loading={false} />
          </Flex>
        </Card>

        {/* Spinner Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Spinner Sizes</Heading>
          <Flex gap="4" wrap="wrap" align="center">
            <Spinner size="1" />
            <Spinner size="2" />
            <Spinner size="3" />
          </Flex>
        </Card>

        {/* Spinner with children */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Spinner with Children</Heading>
          <Flex gap="4" wrap="wrap">
            <Spinner loading={spinnerLoading}>
              <Switch checked={switchChecked} onCheckedChange={handleSwitchChange} />
            </Spinner>
          </Flex>
        </Card>

        {/* Spinner with button */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Spinner with Button</Heading>
          <Flex gap="4" wrap="wrap">
            <Button loading>Bookmark</Button>
            <Button disabled>
              <Spinner loading>
                <Bookmark />
              </Spinner>
              Bookmark
            </Button>
          </Flex>
        </Card>
      </div>
    </div>
  )
}
