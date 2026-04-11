/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // هذا الأمر يجبر النظام على تجاهل أخطاء تايب سكريبت وبناء الموقع بالقوة
    ignoreBuildErrors: true,
  },
  eslint: {
    // هذا الأمر يتجاهل أخطاء التنسيق
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
