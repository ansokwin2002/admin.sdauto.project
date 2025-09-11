'use client';

import { Box, Flex, Grid, Heading, Text } from '@radix-ui/themes';

export default function LayoutsDoc() {
  return (
    <Box>
      <Heading size="6" mb="4">Application Layouts</Heading>

      <Grid columns="1" gap="6">
        {/* Default Layout */}
        <Box>
          <Flex direction="column" gap="4">
            <Box>
              <Heading size="3" mb="2">Default Layout</Heading>
              <Text as="p" mb="4">
                The default layout is used for the main application interface. It includes:
              </Text>
              
              {/* Layout Visualization */}
              <Box className="border-2 border-slate-200 rounded-lg p-2 mb-4">
                <Flex>
                  {/* Sidebar */}
                  <Box className="w-[250px] h-[300px] bg-slate-100 p-2 border-r border-slate-200">
                    <Box className="w-8 h-8 bg-orange-500 rounded-lg mb-4" />
                    <Box className="space-y-2">
                      {[1,2,3].map(i => (
                        <Box key={i} className="h-6 bg-slate-200 rounded w-full" />
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Main Content */}
                  <Box className="flex-1">
                    {/* Top Bar */}
                    <Box className="h-12 border-b border-slate-200 p-2 mb-4">
                      <Flex justify="between" align="center">
                        <Box className="w-32 h-4 bg-slate-200 rounded" />
                        <Box className="w-8 h-8 bg-slate-200 rounded-full" />
                      </Flex>
                    </Box>
                    
                    {/* Content */}
                    <Box className="px-4">
                      <Box className="max-w-[1200px] mx-auto space-y-4">
                        <Box className="h-8 bg-slate-100 rounded w-1/3" />
                        <Box className="h-32 bg-slate-100 rounded" />
                      </Box>
                    </Box>
                  </Box>
                </Flex>
              </Box>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Fixed sidebar (250px width) with navigation menu</li>
                <li>Top bar with organization and user controls</li>
                <li>Main content area with maximum width of 1200px</li>
                <li>Responsive design that adapts to different screen sizes</li>
              </ul>
            </Box>
          </Flex>
        </Box>

        {/* POS Layout */}
        <Box>
          <Flex direction="column" gap="4">
            <Box>
              <Heading size="3" mb="2">POS Layout</Heading>
              <Text as="p" mb="4">
                A minimal layout designed for point-of-sale operations:
              </Text>
              
              {/* Layout Visualization */}
              <Box className="border-2 border-slate-200 rounded-lg p-2 mb-4 overflow-hidden">
                <Box className="h-[400px] bg-background p-4">
                  <Grid columns="5" gap="4" height="full">
                    {/* Left Side - Menu Categories & Items */}
                    <Box className="col-span-3 space-y-4">
                      {/* Categories */}
                      <Flex gap="2">
                        {[1,2,3,4].map(i => (
                          <Box key={i} className="h-10 w-24 bg-slate-100 rounded-lg" />
                        ))}
                      </Flex>
                      
                      {/* Menu Items Grid */}
                      <Grid columns="3" gap="3">
                        {[1,2,3,4,5,6].map(i => (
                          <Box key={i} className="aspect-square bg-slate-100 rounded-lg p-2">
                            <Flex direction="column" justify="between" height="full">
                              <Box className="w-full h-2/3 bg-slate-200 rounded mb-2" />
                              <Box className="space-y-2">
                                <Box className="h-3 bg-slate-200 rounded w-3/4" />
                                <Box className="h-3 bg-slate-200 rounded w-1/2" />
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </Grid>
                    </Box>
                    
                    {/* Right Side - Order Summary */}
                    <Box className="col-span-2 bg-slate-50 rounded-lg p-4">
                      <Flex direction="column" height="full" gap="4">
                        <Box className="h-8 bg-slate-200 rounded" />
                        <Box className="flex-1 space-y-2">
                          {[1,2,3].map(i => (
                            <Box key={i} className="h-16 bg-white rounded p-2">
                              <Flex justify="between">
                                <Box className="space-y-2">
                                  <Box className="h-3 bg-slate-100 rounded w-24" />
                                  <Box className="h-3 bg-slate-100 rounded w-16" />
                                </Box>
                                <Box className="h-6 w-6 bg-slate-100 rounded" />
                              </Flex>
                            </Box>
                          ))}
                        </Box>
                        <Box className="h-12 bg-orange-500 rounded-lg" />
                      </Flex>
                    </Box>
                  </Grid>
                </Box>
              </Box>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Full viewport height layout</li>
                <li>Disabled zoom on mobile devices for better touch interaction</li>
                <li>Scrollable content area with padding</li>
                <li>No fixed elements to maximize screen space</li>
              </ul>
            </Box>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}