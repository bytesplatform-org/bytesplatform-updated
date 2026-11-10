/** Brand and contact details verified against https://bytesplatform.com/. */
export const site = {
  name: "BytesPlatform",
  legalName: "Bytes Platform LLC",
  url: "https://bytesplatform.com",
  email: "info@bytesplatform.com",
  phone: "+1 833 323 0371",
  phoneHref: "tel:+18333230371",
  address: {
    street: "2809 Joshua Street",
    city: "Denton",
    region: "Texas",
    country: "United States",
    map: "https://www.google.com/maps/search/?api=1&query=Bytes+Platform+LLC,+2809+Joshua+Street+Denton,+Texas,+United+States",
  },
  social: {
    facebook: "https://www.facebook.com/share/1Kc3xtzhqa/",
    instagram: "https://www.instagram.com/bytesplatform/",
    linkedin: "https://www.linkedin.com/company/bytebloom-solutionss",
  },
  links: {
    // Google "Add as a preferred source" deeplink (Search Central docs).
    googlePreferredSource: "https://www.google.com/preferences/source?q=bytesplatform.com",
    careers: "/careers",
    blog: "/blogs",
    privacy: "/privacy-policy",
    terms: "/terms-conditions",
    refund: "/refund-policy",
  },
} as const;
