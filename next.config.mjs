/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Os prompts de IA são lidos em runtime via fs.readFileSync (não são
  // importados como código), então precisam ser explicitamente incluídos
  // no bundle de produção — sem isso, a Vercel poderia excluí-los.
  outputFileTracingIncludes: {
    "/**": ["./lib/ai/prompts/**/*.md"],
  },
};

export default nextConfig;
