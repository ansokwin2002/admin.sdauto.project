'use client';

import { Box, Flex, Heading, Text, Badge } from '@radix-ui/themes';

export default function ChangelogPage() {
  const releases = [
    {
      version: "1.0.0",
      date: "Jun 05, 2025",
      type: "major",
      changes: [
        {
          type: "initial",
          description: "Initial release of EatlyPOS"
        },
      ]
    },
    {
      version: "1.1.0",
      date: "Jun 25, 2025",
      type: "minor",
      changes: [
        {
          type: "UI",
          description: "Improved UI, Typography and visual, more customization done to Radix UI Theme variables. Misc. visual improvement to all pages."
        },
      ]
    },
  ];

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "major": return "orange";
      case "beta": return "blue";
      case "alpha": return "purple";
      case "feature": return "green";
      case "improvement": return "blue";
      case "fix": return "red";
      default: return "gray";
    }
  };

  return (
    <Box>
      <Heading size="6" mb="4">Changelog</Heading>
      
      <Flex direction="column" gap="6">
        {releases.map((release, index) => (
         
          <Box key={index}>
            <Flex align="center" gap="2" mb="4">
              <Heading size="4">Version {release.version}</Heading>
              <Badge color={getBadgeColor(release.type)} radius="full">
                {release.type}
              </Badge>
              <Text size="2" color="gray">
                {release.date}
              </Text>
            </Flex>

            <Flex direction="column" gap="2">
              {release.changes.map((change, changeIndex) => (
                <Flex key={changeIndex} gap="2" align="center">
                  <Badge color={getBadgeColor(change.type)} radius="full">
                    {change.type}
                  </Badge>
                  <Text>{change.description}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
