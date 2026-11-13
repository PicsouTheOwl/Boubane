/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/rdv",
        destination: "https://rdv.boubane.com/boubane/30min",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
