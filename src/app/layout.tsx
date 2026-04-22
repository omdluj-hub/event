import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "./AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "후한의원 구미점 - 구미 여드름, 다이어트, 피부과 한의원",
  description: "구미 인동 위치, 여드름, 여드름흉터, 다이어트한약, 피부질환 치료. 후한의원 구미점의 최신 이벤트와 카드뉴스 소식을 확인하세요.",
  keywords: "구미한의원, 구미피부과, 구미여드름, 구미다이어트, 인동한의원, 인동피부과, 후한의원구미점",
  openGraph: {
    title: "후한의원 구미점 - 이벤트 랜딩페이지",
    description: "구미 여드름, 다이어트, 피부 질환 치료 소식",
    url: "https://event-huhan-gumi.vercel.app", // 추후 실제 도메인으로 변경 권장
    siteName: "후한의원 구미점",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구조화된 데이터 (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "후한의원 구미점",
    "image": "https://yfeijhtrrvffahaaaxzr.supabase.co/storage/v1/object/public/event-images/event_3_2.jpg",
    "@id": "",
    "url": "https://event-huhan-gumi.vercel.app",
    "telephone": "054-474-1075",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "인동가산로 9-3 노블레스타워 4층",
      "addressLocality": "구미시",
      "addressRegion": "경상북도",
      "postalCode": "39281",
      "addressCountry": "KR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Friday"],
        "opens": "10:30",
        "closes": "20:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "14:00"
      }
    ]
  };

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="Kt_xKGvgsbv2ETHJTxwU100YLMlQPKT98dCXH3AECcc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
