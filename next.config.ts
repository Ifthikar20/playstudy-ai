import type { NextConfig } from 'next';
import type { Configuration, Compilation } from 'webpack';
const JavaScriptObfuscator = require('javascript-obfuscator');
const { RawSource } = require('webpack-sources');

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
            // Create a list of files that should NOT be obfuscated
            const excludeFiles = [
              'webpack-', 
              'framework-', 
              'main-', 
              'pages/_app-',
              'pages/_error-',
              'pages/_document-'
            ];

            for (const filename in compilation.assets) {
              // Only obfuscate JavaScript files that aren't critical framework files
              if (filename.endsWith('.js') && !excludeFiles.some(exclude => filename.includes(exclude))) {
                try {
                  const asset = compilation.assets[filename];
                  const input = asset.source();
                  
                  // Use less aggressive obfuscation settings
                  const obfuscated = JavaScriptObfuscator.obfuscate(input, {
                    rotateStringArray: true,
                    stringArray: true,
                    stringArrayThreshold: 0.5,
                    compact: true,
                    controlFlowFlattening: false, // Turned off to avoid breaking dynamic imports
                    deadCodeInjection: false,     // Turned off to reduce complexity
                    debugProtection: false,
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    numbersToExpressions: false,  // Turned off for compatibility
                    simplify: true,
                    splitStrings: false,          // Turned off to avoid breaking URLs
                    stringArrayShuffle: true,
                  }).getObfuscatedCode();
                  
                  // Use RawSource to create a valid Source object
                  compilation.assets[filename] = new RawSource(obfuscated);
                } catch (err) {
                  console.error(`Error obfuscating file ${filename}:`, err);
                  // Keep the original source if obfuscation fails
                }
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