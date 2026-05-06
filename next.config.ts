import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/product/mitsubishi-xpander",
        destination: "/product/mitsubishi-xpander-7-seater",
        permanent: true,
      },
      {
        source: "/product/mitsubishi-xpander-7-seater-rental",
        destination: "/product/mitsubishi-xpander-7-seater",
        permanent: true,
      },
      {
        source: "/product/nissan-magnite-rental",
        destination: "/product/nissan-magnite",
        permanent: true,
      },
      {
        source: "/product/hyundai-creta-rental",
        destination: "/product/hyundai-creta",
        permanent: true,
      },
      {
        source: "/product/kia-seltos-rental",
        destination: "/product/kia-seltos",
        permanent: true,
      },
      {
        source: "/brand",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/faqs",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/rent-a-car-sharjah",
        destination: "/car-rental-sharjah",
        permanent: true,
      },
      {
        source: "/rent-a-car-ajman",
        destination: "/car-rental-ajman",
        permanent: true,
      },
      {
        source: "/rent-a-car-umm-al-quwain",
        destination: "/car-rental-uaq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
