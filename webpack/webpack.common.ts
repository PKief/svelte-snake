import Autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import SveltePreprocess from 'svelte-preprocess';
import { Configuration } from 'webpack';

const devMode = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  mode: 'development',
  entry: { index: './main.ts', polyfills: './polyfills' },
  context: resolve(__dirname, '../src'),
  resolve: {
    alias: {
      svelte: resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte', 'scss'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: devMode,
            },
            emitCss: !devMode,
            hotReload: false,
            preprocess: SveltePreprocess({
              scss: true,
              sass: true,
              postcss: {
                plugins: [Autoprefixer],
              },
            }),
          },
        },
      },

      // Required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
      // See: https://github.com/sveltejs/svelte-loader#usage
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|wav)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      title: 'Snake',
      hash: true,
      favicon: './img/logo.png',
      meta: {
        viewport:
          'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1',
        screenOrientation: {
          httpEquiv: 'ScreenOrientation',
          content: 'autoRotate:disabled',
        },
      },
    }),
    new MiniCssExtractPlugin(),
  ],
};

export default config;
