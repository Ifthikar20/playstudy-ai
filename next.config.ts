import type { NextConfig } from 'next';
import type { Configuration, Compilation } from 'webpack';
const JavaScriptObfuscator = require('javascript-obfuscator');
const { RawSource } = require('webpack-sources'); // Add this import

const nextConfig: NextConfig = {
  images: {
    domains: [
      "media.giphy.com",
      "media0.giphy.com",
      "media1.giphy.com",
      "media2.giphy.com",
      "media3.giphy.com",
      "media4.giphy.com",
      "i.pravatar.cc"
    ],
  },
  serverExternalPackages: ['zlib'],
  productionBrowserSourceMaps: false,
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
  webpack: (config: Configuration, { isServer }: { isServer: boolean }): Configuration => {
    if (!isServer) {
      config.devtool = false;

      // Ensure config.optimization exists and is an object
      if (!config.optimization) {
        config.optimization = {};
      }

      // Ensure minimizer is an array, initializing it if undefined
      if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }

      // Wrap JavaScriptObfuscator in a custom plugin with apply method
      config.optimization.minimizer.push({
        apply: (compiler: any) => {
          compiler.hooks.emit.tapAsync('JavaScriptObfuscator', (compilation: Compilation, callback: () => void) => {
            for (const filename in compilation.assets) {
              if (filename.endsWith('.js')) {
                const asset = compilation.assets[filename];
                const input = asset.source();
                const obfuscated = JavaScriptObfuscator.obfuscate(input, {
                  rotateStringArray: true,
                  stringArray: true,
                  stringArrayThreshold: 0.75,
                  compact: true,
                  controlFlowFlattening: true,
                  deadCodeInjection: true,
                  debugProtection: false,
                  identifierNamesGenerator: 'hexadecimal',
                  log: false,
                  numbersToExpressions: true,
                  simplify: true,
                  splitStrings: true,
                  stringArrayShuffle: true,
                }).getObfuscatedCode();
                // Use RawSource to create a valid Source object
                compilation.assets[filename] = new RawSource(obfuscated);
              }
            }
            callback();
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;