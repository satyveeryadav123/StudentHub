interface JsonLdProps {
  courseName: string;
  courseCode: string;
  description: string;
  url: string;
}

export default function JsonLd({ courseName, courseCode, description, url }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseName,
    "courseCode": courseCode,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "StudentHub",
      "sameAs": "https://studentshub-aktu.vercel.app",
    },
    "url": url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
