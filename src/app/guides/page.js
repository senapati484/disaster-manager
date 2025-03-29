/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

const guidesData = [
  {
    category: "Floods",
    guides: [
      {
        title: "Flood Preparedness and Response",
        description:
          "This guide provides a comprehensive overview of how to prepare for floods, including steps such as securing your property, identifying safe zones, and creating an evacuation plan. Key recommendations include moving to higher ground and staying tuned to local alerts.",
        source: {
          name: "FEMA Flood Preparedness",
          url: "https://www.fema.gov/flood-preparedness",
        },
      },
      {
        title: "Flood Evacuation Procedures",
        description:
          "Learn how to evacuate safely during a flood emergency. This guide outlines critical steps like planning your escape route, keeping an emergency kit ready, and following instructions from local authorities.",
        source: {
          name: "Red Cross Flood Evacuation",
          url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/flood.html",
        },
      },
    ],
  },
  {
    category: "Wildfires",
    guides: [
      {
        title: "Wildfire Preparedness",
        description:
          "This guide covers essential wildfire preparedness tips such as creating a defensible space around your home, preparing emergency kits, and following evacuation orders. It also offers advice on how to reduce fire risks.",
        source: {
          name: "National Fire Protection Association",
          url: "https://www.nfpa.org/Public-Education/By-topic/Preparing-for-a-disaster/Wildfire",
        },
      },
      {
        title: "Wildfire Evacuation Guide",
        description:
          "Detailed instructions for safely evacuating during a wildfire. This guide recommends staying informed through official channels, planning your evacuation route, and having a communication plan in place.",
        source: {
          name: "Cal Fire",
          url: "https://www.fire.ca.gov/",
        },
      },
    ],
  },
  {
    category: "Earthquakes",
    guides: [
      {
        title: "Earthquake Safety and Preparedness",
        description:
          "A comprehensive earthquake guide detailing safety measures before, during, and after an earthquake. It advises securing heavy furniture, preparing an emergency kit, and following safety protocols during tremors.",
        source: {
          name: "USGS Earthquake Hazards",
          url: "https://www.usgs.gov/natural-hazards/earthquake-hazards",
        },
      },
      {
        title: "Post-Earthquake Recovery",
        description:
          "Guidance on how to recover after an earthquake, including how to assess structural damage, safely evacuate if needed, and access support services. The guide emphasizes prioritizing safety and communication with local emergency services.",
        source: {
          name: "Red Cross Earthquake Guide",
          url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/earthquake.html",
        },
      },
    ],
  },
  {
    category: "Hurricanes",
    guides: [
      {
        title: "Hurricane Preparedness Guide",
        description:
          "This guide outlines crucial steps to prepare for hurricanes, including securing your home, assembling an emergency kit, and planning evacuation routes. It stresses the importance of staying informed via weather alerts.",
        source: {
          name: "National Hurricane Center",
          url: "https://www.nhc.noaa.gov/",
        },
      },
      {
        title: "Post-Hurricane Recovery",
        description:
          "Learn the necessary steps to recover after a hurricane. The guide discusses assessing damage, applying for disaster assistance, and safely rebuilding. It aggregates advice from federal and state recovery agencies.",
        source: {
          name: "FEMA Hurricane Recovery",
          url: "https://www.fema.gov/hurricanes",
        },
      },
    ],
  },
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Disaster Survival Guides</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive guides for disaster preparedness and response. The
          information below has been curated from reputable sources.
        </p>
      </header>

      <Alert className="mb-8">
        <AlertTitle>Emergency Contacts</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            <p>
              <strong>Emergency Services:</strong> 911
            </p>
            <p>
              <strong>FEMA:</strong> 1-800-621-3362
            </p>
            <p>
              <strong>Red Cross:</strong> 1-800-733-2767
            </p>
            <p>
              <strong>Poison Control:</strong> 1-800-222-1222
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-[1000px] w-full rounded-md border p-4">
        <div className="space-y-8">
          {guidesData.map((category) => (
            <section key={category.category} className="space-y-4">
              <h2 className="text-2xl font-semibold">{category.category}</h2>
              <div className="grid grid-cols-1 gap-6">
                {category.guides.map((guide, index) => (
                  <Card
                    key={index}
                    className="shadow-lg border-l-4 border-indigo-500"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="description">
                          <AccordionTrigger>Overview</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-700">{guide.description}</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="preparation">
                          <AccordionTrigger>
                            Before {category.category}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>
                                Create an emergency kit with essential supplies
                              </li>
                              <li>Develop and practice an evacuation plan</li>
                              <li>
                                Stay informed through local news and weather
                                alerts
                              </li>
                              <li>
                                Keep important documents in a waterproof
                                container
                              </li>
                              <li>
                                Know your area's evacuation routes and shelter
                                locations
                              </li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="during">
                          <AccordionTrigger>
                            During {category.category}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Stay calm and follow your emergency plan</li>
                              <li>
                                Listen to emergency broadcasts and follow
                                instructions
                              </li>
                              <li>Help others if it's safe to do so</li>
                              <li>Avoid unnecessary travel</li>
                              <li>Keep your emergency kit accessible</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="after">
                          <AccordionTrigger>
                            After {category.category}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>
                                Check for injuries and seek medical attention if
                                needed
                              </li>
                              <li>Document damage for insurance purposes</li>
                              <li>
                                Begin cleanup when authorities declare it's safe
                              </li>
                              <li>
                                Contact family and friends to let them know
                                you're safe
                              </li>
                              <li>
                                Watch for updated information from local
                                authorities
                              </li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <div className="mt-4 text-sm text-gray-500">
                        Source:{" "}
                        <a
                          href={guide.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-700"
                        >
                          {guide.source.name}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
