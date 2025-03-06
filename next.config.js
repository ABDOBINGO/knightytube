/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  },
  images: {
    domains: ['openrouter.ai'],
  },
  metadata: {
    title: 'KnightyTube - Luxury AI Script Generator',
    description: 'Create captivating YouTube scripts using advanced AI models. Generate engaging content with our luxury script generation tool.',
    metadataBase: new URL('https://knightytube.vercel.app'),
    openGraph: {
      title: 'KnightyTube - Luxury AI Script Generator',
      description: 'Create captivating YouTube scripts using advanced AI models',
      images: ['/og-image.png'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'KnightyTube - Luxury AI Script Generator',
      description: 'Create captivating YouTube scripts using advanced AI models',
      images: ['/og-image.png'],
    },
  },
};

module.exports = nextConfig;