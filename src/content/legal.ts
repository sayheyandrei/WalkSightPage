/**
 * Copy for the three internal pages. It describes the behaviour of the current
 * WalkSight iOS app (checked against the native Release code):
 *
 * - no account, no CloudKit, no subscription or in-app purchase, no ads
 * - no analytics / advertising SDKs, no WalkSight backend
 * - routes, history, statistics, discoveries, survey answers and preferences stay on the device
 * - location "While Using the App" only, never in the background
 * - Apple MapKit (default routing), OpenStreetMap/Overpass, Wikipedia / Wikimedia Commons /
 *   Wikidata, Open-Meteo (weather widget, location rounded to ~1 km) and, optionally, OpenRouteService
 *
 * "{{email}}" is replaced by a mailto link built from SUPPORT_EMAIL.
 */
import { LEGAL_LAST_UPDATED } from "../config/site";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface LegalPage {
  path: "/terms/" | "/privacy/" | "/support/";
  seoTitle: string;
  seoDescription: string;
  titleLines: string[];
  lastUpdated?: string;
  lead: string;
  sections: LegalSection[];
}

const lastUpdated = `Last updated: ${LEGAL_LAST_UPDATED}`;

export const terms: LegalPage = {
  path: "/terms/",
  seoTitle: "WalkSight — Terms of Service",
  seoDescription:
    "The terms that govern your use of the WalkSight app and website: routes and safety, location, your data and availability.",
  titleLines: ["Terms", "of Service"],
  lastUpdated,
  lead: "Welcome to WalkSight. These Terms of Service govern your use of the WalkSight app and website. By using WalkSight, you agree to these terms. If you do not agree, please do not use the app or website.",
  sections: [
    {
      title: "Using WalkSight",
      paragraphs: [
        "WalkSight helps you discover nearby places, create walking routes, navigate between stops and review your walking history and statistics. The app is intended for personal, informational and recreational use.",
      ],
    },
    {
      title: "Routes and safety",
      paragraphs: [
        "Walking routes, directions, distances, travel times and place information may be incomplete, delayed or inaccurate. WalkSight does not guarantee that a suggested route is safe, accessible, open or suitable for you. Always pay attention to your surroundings and follow local laws, signs, closures and safety instructions. Do not rely on WalkSight in emergencies.",
      ],
    },
    {
      title: "Location and third-party information",
      paragraphs: [
        "Some features require access to your location. WalkSight also uses map, routing, place and weather information provided by services such as Apple Maps, OpenStreetMap, Wikimedia and Open-Meteo. Availability and accuracy of third-party information may change and may be subject to the providers’ own terms and policies.",
      ],
    },
    {
      title: "Your data",
      paragraphs: [
        "WalkSight does not require an account. Saved routes, walking history, preferences and related app data are stored locally on your device. You are responsible for maintaining access to and security of your device. Removing the app may remove locally stored WalkSight data.",
      ],
    },
    {
      title: "Availability",
      paragraphs: [
        "WalkSight is provided on an “as is” and “as available” basis. Features, map coverage, place information and routing availability may change over time. We may modify, suspend or discontinue parts of the service when necessary to maintain, improve or update the app.",
      ],
    },
    {
      title: "Disclaimer and limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, WalkSight and its developer are not liable for indirect, incidental, special or consequential loss arising from your use of the app, including loss resulting from inaccurate map data, route guidance, place information or your reliance on that information.",
      ],
    },
    {
      title: "Changes to these terms",
      paragraphs: [
        "We may update these Terms of Service from time to time. The updated version will be posted on this page with a revised “Last updated” date. Continued use of WalkSight after an update means that you accept the revised terms.",
      ],
    },
    {
      title: "Contact",
      paragraphs: ["For questions about these terms, contact us at {{email}}."],
    },
  ],
};

export const privacy: LegalPage = {
  path: "/privacy/",
  seoTitle: "WalkSight — Privacy Policy",
  seoDescription:
    "What WalkSight stores on your device, when location is used and which map, place and weather services receive requests. No account, no ads, no tracking.",
  titleLines: ["Privacy", "Policy"],
  lastUpdated,
  lead: "WalkSight is designed to work without an account and without advertising or cross-app tracking. This Privacy Policy explains what information the app uses, what stays on your device and when information is sent to services required to provide maps, routes and place details.",
  sections: [
    {
      title: "Information stored on your device",
      paragraphs: [
        "WalkSight stores app preferences, saved routes, walking history, route geometry and related statistics locally on your device, together with the places you have discovered, your onboarding survey answers and a temporary cache of nearby places that expires after about 14 days. This information is used to provide the app’s history, statistics and personalization features. WalkSight does not operate a user-account backend that stores this information for you.",
      ],
    },
    {
      title: "Location and heading",
      paragraphs: [
        "With your permission, WalkSight uses your location while you are using the app to show nearby places, choose your current position as a route start, build walking routes and support navigation and nearby discovery features. If you share only approximate location, WalkSight asks iOS for temporary precise location when a feature needs it. Heading information may be used to orient map and discovery views. WalkSight does not request background-location access.",
      ],
    },
    {
      title: "Map, route and place requests",
      paragraphs: [
        "To provide nearby places, routes, place information and weather, the app communicates directly with map and information services. Depending on the feature you use, a request may include a map region, coordinates, route endpoints, place names or place identifiers needed to return the requested information.",
        "WalkSight currently uses services including Apple MapKit, OpenStreetMap/Overpass, Open-Meteo and Wikimedia services such as Wikipedia, Wikimedia Commons and Wikidata. When you open the weather widget, your location is rounded to about 1 km before it is sent to Open-Meteo. OpenRouteService may also be used when that routing provider is enabled.",
        "These providers receive requests directly from your device and may process technical information in accordance with their own privacy policies.",
      ],
    },
    {
      title: "Analytics, advertising and tracking",
      paragraphs: [
        "WalkSight does not include third-party advertising or analytics SDKs and does not use your activity for cross-app advertising tracking.",
      ],
    },
    {
      title: "Accounts and cloud sync",
      paragraphs: [
        "WalkSight does not require an account and does not currently provide cloud synchronization of your routes or history. Your WalkSight history and preferences remain local to the device unless you choose to share information using functionality provided by iOS or another service.",
      ],
    },
    {
      title: "Data deletion",
      paragraphs: [
        "You can remove saved walking history from within WalkSight. Deleting WalkSight from your device removes the app’s locally stored data as part of the normal iOS app-removal process.",
      ],
    },
    {
      title: "Your choices",
      paragraphs: [
        "You can change WalkSight’s location access at any time in iOS Settings. If location access is disabled, features that depend on your current position may be unavailable or may require you to select a location manually.",
      ],
    },
    {
      title: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy when WalkSight or its data practices change. The latest version will always be published on this page with its effective date.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "If you have questions about privacy or data use in WalkSight, contact us at {{email}}.",
      ],
    },
  ],
};

export const support: LegalPage = {
  path: "/support/",
  seoTitle: "WalkSight — Support",
  seoDescription:
    "Answers about WalkSight: location access, creating a route, nearby discovery, history and statistics, and how to contact us.",
  titleLines: ["WalkSight", "Support"],
  lead: "Need help with WalkSight? Find answers to common questions below, or contact us if something isn’t working as expected.",
  sections: [
    {
      title: "Getting started",
      paragraphs: [
        "WalkSight helps you discover interesting places nearby and turn them into a walk. You can let the app build a route automatically from your time, distance and interests, or choose stops manually.",
      ],
    },
    {
      title: "Why does WalkSight need my location?",
      paragraphs: [
        "Your location is used to show nearby places, start routes from your current position and support navigation and discovery features. WalkSight only requests location access while you are using the app. You can change this permission at any time in iOS Settings.",
      ],
    },
    {
      title: "Creating a route",
      paragraphs: [
        "Open the route planner and choose Auto or Manual. In Auto mode, select your starting point, nearby search radius, desired walking length or steps, available time and other preferences. In Manual mode, choose the places you want to visit and build the route yourself.",
      ],
    },
    {
      title: "Nearby discovery",
      paragraphs: [
        "Nearby discovery helps you see interesting places around your current position and understand their direction and distance. For the best result, allow location access and make sure Location Services are enabled for WalkSight.",
      ],
    },
    {
      title: "History and statistics",
      paragraphs: [
        "Completed walks can appear in History, where you can review routes and statistics such as distance, steps and discovered places. This information is stored locally on your device.",
      ],
    },
    {
      title: "Deleting history",
      paragraphs: [
        "You can remove individual saved walks or clear your WalkSight history from within the app. If you delete the app from your iPhone, its locally stored app data is removed by iOS.",
      ],
    },
    {
      title: "System requirements",
      paragraphs: ["WalkSight is currently designed for iPhone and requires iOS 17 or later."],
    },
    {
      title: "Still need help?",
      paragraphs: [
        "Email us at {{email}}. When reporting a problem, please include your iPhone model, iOS version, a short description of what happened and, if useful, a screenshot.",
      ],
    },
  ],
};
