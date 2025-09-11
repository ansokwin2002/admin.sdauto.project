'use client';

import React, { useState } from 'react';
import { Flex, Box, Text, Skeleton, Container, Heading, Card, Switch } from '@radix-ui/themes';

export default function SkeletonDemo() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  
  const handleSwitchChange = () => {
    setSwitchLoading(true);
    setTimeout(() => {
      setSwitchChecked(!switchChecked);
      setSwitchLoading(false);
    }, 1000);
  };

  return (
    <Container size="3" py="6">
      <Heading size="6" mb="6">Skeleton</Heading>
      
      <Flex direction="column" gap="6">
        <Card>
          <Heading size="3" mb="2">Basic Skeleton</Heading>
          <Flex gap="4" direction="column">
            <Skeleton height="20px" width="200px" />
            <Skeleton height="20px" width="150px" />
            <Skeleton height="20px" width="250px" />
          </Flex>
        </Card>

        <Card>
          <Heading size="3" mb="2">Custom Sizes</Heading>
          <Flex gap="4" direction="column">
            <Text as="p" size="2">50x8 px</Text>
            <Skeleton height="8px" width="50px" />

            <Text as="p" size="2">100x16 px</Text>
            <Skeleton height="16px" width="100px" />

            <Text as="p" size="2">150x20 px</Text>
            <Skeleton height="20px" width="150px" />

            <Text as="p" size="2">200x24 px</Text>
            <Skeleton height="24px" width="200px" />
          </Flex>
        </Card>

        <Card>
          <Heading size="3" mb="2">Skeleton with Children</Heading>
          <Text as="p" size="2" mb="2">Click the switch to see the skeleton</Text>
          <Skeleton loading={switchLoading}>
            <Switch checked={switchChecked} onCheckedChange={handleSwitchChange} />
          </Skeleton>
        </Card>

        <Card>
          <Heading size="3" mb="2">Skeleton with Text</Heading>
          <Container size="1">
            <Flex direction="column" gap="3">
              <Text>
                <Skeleton>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                  felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                  erat, fringilla sed commodo sed, aliquet nec magna.
                </Skeleton>
              </Text>

              <Skeleton>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                  felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                  erat, fringilla sed commodo sed, aliquet nec magna.
                </Text>
              </Skeleton>
            </Flex>
          </Container>
        </Card>

        <Card>
          <Heading size="3" mb="2">Card Loading State</Heading>
          <Flex gap="4">
            {[1, 2, 3].map((item) => (
              <Card key={item} style={{ width: '200px' }}>
                <Skeleton mb="2">
                  <Box height="120px" />
                </Skeleton>
                <Skeleton height="20px" width="80%" mb="2" />
                <Skeleton height="14px" width="60%" />
              </Card>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}
