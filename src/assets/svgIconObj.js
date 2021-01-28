import React from 'react'
import { G, Path } from 'react-native-svg'

// Each nameValuePair can be:
// * Name: <Svg />; or
// * Name: { svg: <Svg />, viewBox: '0 0 50 50' }

export default {
  /*
  .##.....##.########....###....########..########.########.
  .##.....##.##.........##.##...##.....##.##.......##.....##
  .##.....##.##........##...##..##.....##.##.......##.....##
  .#########.######...##.....##.##.....##.######...########.
  .##.....##.##.......#########.##.....##.##.......##...##..
  .##.....##.##.......##.....##.##.....##.##.......##....##.
  .##.....##.########.##.....##.########..########.##.....##
  */

  back: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M5.39 2.29c-0.03,-0 -0.05,-0.01 -0.08,-0.01l-3.89 0 0.1 -0.05c0.1,-0.05 0.18,-0.11 0.26,-0.18l1.26 -1.26c0.17,-0.16 0.19,-0.41 0.07,-0.61 -0.15,-0.2 -0.43,-0.25 -0.64,-0.1 -0.02,0.01 -0.03,0.03 -0.05,0.04l-2.28 2.28c-0.18,0.18 -0.18,0.47 -0,0.65 0,0 0,0 0,0l2.28 2.28c0.18,0.18 0.47,0.18 0.65,-0 0.01,-0.01 0.03,-0.03 0.04,-0.04 0.13,-0.19 0.1,-0.45 -0.07,-0.61l-1.26 -1.27c-0.07,-0.07 -0.14,-0.12 -0.23,-0.17l-0.14 -0.06 3.87 0c0.23,0.01 0.44,-0.15 0.48,-0.38 0.04,-0.25 -0.13,-0.48 -0.38,-0.52z'
        />
      </G>
    ),
    viewBox: '0 0 5.77 5.48',
    width: '0.502409in',
    height: '0.476787in',
    version: '1.1',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  menu: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M4.25 0l-2.75 0c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41l2.75 0c0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41zm-3.84 2.73c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41 0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41zm0 -1.37c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41 0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41zm0 -1.37c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41 0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41zm3.84 2.73l-2.75 0c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41l2.75 0c0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41zm0 -1.37l-2.75 0c-0.23,0 -0.41,0.18 -0.41,0.41 0,0.23 0.18,0.41 0.41,0.41l2.75 0c0.23,0 0.41,-0.18 0.41,-0.41 0,-0.23 -0.18,-0.41 -0.41,-0.41z'
        />
      </G>
    ),
    viewBox: '0 0 4.66 3.55',
    width: '0.439441in',
    height: '0.334732in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  search: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M5.45 4.85c-0,-0.07 -0.03,-0.14 -0.09,-0.19l-1.51 -1.34c-0.15,0.21 -0.33,0.39 -0.53,0.53l1.34 1.51c0.1,0.11 0.28,0.12 0.38,0.01l0.33 -0.33c0.05,-0.05 0.08,-0.12 0.08,-0.19 0,-0 -0,-0 -0,-0.01l0 0zm-1.32 -2.79c0,-1.14 -0.92,-2.06 -2.06,-2.06 -1.14,0 -2.06,0.92 -2.06,2.06 0,1.14 0.92,2.06 2.06,2.06 1.14,0 2.06,-0.92 2.06,-2.06zm-2.06 1.57c-0.87,0 -1.57,-0.7 -1.57,-1.57 0,-0.87 0.7,-1.57 1.57,-1.57 0.87,0 1.57,0.7 1.57,1.57 0,0.87 -0.7,1.57 -1.57,1.57z'
        />
      </G>
    ),
    viewBox: '0 0 5.45 5.44',
    width: '0.461622in',
    height: '0.461559in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  /*
  .########..########...#######..########.####.##.......########
  .##.....##.##.....##.##.....##.##........##..##.......##......
  .##.....##.##.....##.##.....##.##........##..##.......##......
  .########..########..##.....##.######....##..##.......######..
  .##........##...##...##.....##.##........##..##.......##......
  .##........##....##..##.....##.##........##..##.......##......
  .##........##.....##..#######..##.......####.########.########
  */

  plus: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M-0 2l0 0.55c0,0.11 0.09,0.19 0.19,0.19l1.42 0c0.11,0 0.19,0.09 0.19,0.19l0 1.42c0,0.11 0.09,0.19 0.19,0.19l0.55 0c0.11,0 0.19,-0.09 0.19,-0.19l0 -1.42c0,-0.11 0.09,-0.19 0.19,-0.19l1.42 0c0.11,0 0.19,-0.09 0.19,-0.19l0 -0.55c0,-0.11 -0.09,-0.19 -0.19,-0.19l-1.42 0c-0.11,0 -0.19,-0.09 -0.19,-0.19l0 -1.42c0,-0.11 -0.09,-0.19 -0.19,-0.19l-0.55 0c-0.11,0 -0.19,0.09 -0.19,0.19l0 1.42c0,0.11 -0.09,0.19 -0.19,0.19l-1.42 0c-0.11,0 -0.19,0.09 -0.19,0.19zm4.27 0.18l-0.89 0c-0.05,0 -0.09,-0.04 -0.09,-0.09 0,-0.05 0.04,-0.09 0.09,-0.09l0.89 0c0.05,0 0.09,0.04 0.09,0.09 0,0.05 -0.04,0.09 -0.09,0.09zm-1.17 0l-0.07 0c-0.05,0 -0.09,-0.04 -0.09,-0.09 0,-0.05 0.04,-0.09 0.09,-0.09l0.07 0c0.05,0 0.09,0.04 0.09,0.09 0,0.05 -0.04,0.09 -0.09,0.09z'
        />
      </G>
    ),
    viewBox: '0 0 4.54 4.54',
    width: '0.383835in',
    height: '0.383831in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  user: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M1.59 1.86c0.26,0 0.48,-0.09 0.66,-0.27 0.18,-0.18 0.27,-0.4 0.27,-0.66 0,-0.26 -0.09,-0.48 -0.27,-0.66 -0.18,-0.18 -0.4,-0.27 -0.66,-0.27 -0.26,0 -0.48,0.09 -0.66,0.27 -0.18,0.18 -0.27,0.4 -0.27,0.66 0,0.26 0.09,0.48 0.27,0.66 0.18,0.18 0.4,0.27 0.66,0.27l0 0zm1.63 1.11c-0.01,-0.08 -0.02,-0.16 -0.03,-0.24 -0.02,-0.09 -0.04,-0.17 -0.06,-0.25 -0.02,-0.08 -0.06,-0.16 -0.1,-0.23 -0.04,-0.08 -0.09,-0.14 -0.15,-0.2 -0.06,-0.06 -0.13,-0.1 -0.22,-0.14 -0.08,-0.03 -0.18,-0.05 -0.28,-0.05 -0.04,0 -0.08,0.02 -0.15,0.06 -0.05,0.03 -0.1,0.06 -0.16,0.1 -0.05,0.03 -0.12,0.06 -0.2,0.09 -0.08,0.03 -0.17,0.04 -0.25,0.04 -0.08,0 -0.17,-0.01 -0.25,-0.04 -0.08,-0.03 -0.15,-0.06 -0.2,-0.09 -0.06,-0.04 -0.11,-0.07 -0.16,-0.1 -0.07,-0.05 -0.11,-0.06 -0.15,-0.06 -0.1,0 -0.19,0.02 -0.28,0.05 -0.09,0.03 -0.16,0.08 -0.22,0.14 -0.06,0.05 -0.11,0.12 -0.15,0.2 -0.04,0.07 -0.08,0.15 -0.1,0.23 -0.02,0.08 -0.04,0.16 -0.06,0.25 -0.02,0.09 -0.03,0.17 -0.03,0.24 -0.01,0.07 -0.01,0.15 -0.01,0.23 0,0.2 0.06,0.37 0.19,0.49 0.12,0.12 0.29,0.18 0.49,0.18l1.86 0c0.2,0 0.37,-0.06 0.49,-0.18 0.13,-0.12 0.19,-0.28 0.19,-0.49 -0,-0.08 -0,-0.15 -0.01,-0.23z'
        />
      </G>
    ),
    viewBox: '0 0 3.22 3.87',
    width: '0.374988in',
    height: '0.449469in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  phone: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          id='Shape'
          class='fil0'
          d='M1.67 2.36c-0.38,-0.38 -0.47,-0.77 -0.49,-0.92 -0.01,-0.04 0.01,-0.09 0.04,-0.12l0.31 -0.31c0.05,-0.05 0.05,-0.12 0.02,-0.17l-0.5 -0.77c-0.04,-0.06 -0.12,-0.08 -0.18,-0.05l-0.8 0.37c-0.05,0.03 -0.08,0.08 -0.08,0.14 0.04,0.4 0.21,1.37 1.17,2.33 0.96,0.96 1.93,1.13 2.33,1.17 0.06,0.01 0.11,-0.02 0.14,-0.08l0.37 -0.8c0.03,-0.06 0.01,-0.14 -0.05,-0.18l-0.77 -0.5c-0.05,-0.03 -0.13,-0.03 -0.17,0.02l-0.31 0.31c-0.03,0.03 -0.07,0.05 -0.12,0.04 -0.15,-0.02 -0.54,-0.11 -0.92,-0.49l0 0zm2.22 -0.21c-0.08,0 -0.14,-0.06 -0.14,-0.14 -0,-0.96 -0.78,-1.74 -1.74,-1.74 -0.08,0 -0.14,-0.06 -0.14,-0.14 0,-0.08 0.06,-0.14 0.14,-0.14 1.11,0 2.01,0.9 2.02,2.02 0,0.04 -0.01,0.07 -0.04,0.1 -0.03,0.03 -0.06,0.04 -0.1,0.04l0 0zm-0.7 0c-0.08,0 -0.14,-0.06 -0.14,-0.14 -0,-0.58 -0.47,-1.04 -1.04,-1.04 -0.08,0 -0.14,-0.06 -0.14,-0.14 0,-0.08 0.06,-0.14 0.14,-0.14 0.73,0 1.32,0.59 1.32,1.32 0,0.08 -0.06,0.14 -0.14,0.14l0 0z'
        />
      </G>
    ),
    viewBox: '0 0 4.03 4.03',
    width: '0.397in',
    height: '0.39698in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  email: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M4.07 0.21l-1.25 1.24 1.25 1.24c0.02,-0.05 0.04,-0.1 0.04,-0.15l0 -2.17c0,-0.06 -0.01,-0.11 -0.04,-0.15zm-1.42 1.41l-0.18 0.18c-0.23,0.23 -0.62,0.23 -0.85,0l-0.18 -0.18 -1.25 1.24c0.05,0.02 0.1,0.04 0.15,0.04l3.39 0c0.06,0 0.11,-0.01 0.15,-0.04l-1.25 -1.24zm-2.62 -1.41c-0.02,0.05 -0.04,0.1 -0.04,0.15l0 2.17c0,0.06 0.01,0.11 0.04,0.15l1.25 -1.24 -1.25 -1.24zm3.71 -0.21l-3.39 0c-0.06,0 -0.11,0.01 -0.15,0.04l1.59 1.58c0.14,0.14 0.37,0.14 0.51,0l1.59 -1.58c-0.05,-0.02 -0.1,-0.04 -0.15,-0.04z'
        />
      </G>
    ),
    viewBox: '0 0 4.11 2.89',
    width: '0.412283in',
    height: '0.289886in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  designation: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M1.59 0.32l1.26 0 0 0.31 -1.26 0 0 -0.31zm0.31 2.2c0,0.02 0,0.02 0.02,0.02l0.59 0c0.02,0 0.02,-0 0.02,-0.02l0 -0.28c0,-0.02 -0,-0.02 -0.02,-0.02l-0.62 0 0 0.3zm-1.9 0.94c0,0.16 0.18,0.35 0.38,0.35l3.67 0c0.11,0 0.2,-0.05 0.27,-0.12 0.06,-0.06 0.11,-0.17 0.11,-0.3l0 -1.17 -1.67 0 0 0.41c0,0.04 -0.02,0.08 -0.04,0.1 -0.03,0.03 -0.06,0.04 -0.11,0.04l-0.8 0c-0.09,0 -0.15,-0.09 -0.15,-0.18l0 -0.37 -1.66 0 0 1.24zm1.27 -3.22l0 0.4 -0.84 0c-0.18,0 -0.32,0.08 -0.38,0.22 -0.02,0.04 -0.04,0.1 -0.04,0.16l0 0.97 4.44 0 0 -0.96c0,-0.12 -0.06,-0.2 -0.13,-0.27 -0.07,-0.07 -0.16,-0.11 -0.3,-0.11l-0.84 0c0,-0.1 0.01,-0.38 -0.01,-0.46 -0.02,-0.09 -0.12,-0.17 -0.2,-0.17l-1.47 0c-0.12,0 -0.22,0.11 -0.22,0.23z'
        />
      </G>
    ),
    viewBox: '0 0 4.44 3.8',
    width: '0.41672in',
    height: '0.357004in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  social_id: {
    svg: (
      <G id='Layer_x0020_1'>
        <G id='_1441164725568'>
          <G>
            <Path
              class='fil0'
              d='M2.24 2.31l0.1 0 0 -0.33 -0.17 0.17c0.01,0.04 0.03,0.08 0.04,0.11 0.01,0.02 0.02,0.03 0.03,0.05z'
            />
            <Path
              class='fil0'
              d='M2.59 2.31l0.26 0 0 -0.07c-0.05,0.03 -0.1,0.04 -0.17,0.04 -0.03,0 -0.06,-0 -0.08,-0.01l0 0.03zm0.26 -0.27l0 -0.03 -0.26 -0.13 0 0.14c0,0 0,0 0,0 0.03,0.04 0.08,0.06 0.14,0.06 0.05,0 0.09,-0.01 0.12,-0.04z'
            />
            <Path
              class='fil1'
              d='M2.72 0c-0.92,0 -1.67,0.75 -1.67,1.67 0,0.41 0.15,0.79 0.4,1.09l-0.16 0.16 -0.18 -0.18 -1.11 1.11 0.55 0.55 1.11 -1.11 -0.18 -0.18 0.16 -0.16c0.29,0.25 0.67,0.4 1.09,0.4 0.92,0 1.67,-0.75 1.67,-1.67 0,-0.92 -0.75,-1.67 -1.67,-1.67l0 0zm-0.04 2.29c-0.11,0 -0.2,-0.04 -0.26,-0.11 -0.06,-0.08 -0.09,-0.19 -0.09,-0.34l0 -0.34c0,-0.15 0.03,-0.25 0.1,-0.33 0.07,-0.07 0.17,-0.11 0.3,-0.11 0.13,0 0.23,0.04 0.3,0.11 0.07,0.07 0.1,0.18 0.1,0.33l0 0.41 0 0 0 0.05c0,0.04 0.01,0.08 0.02,0.1 0.02,0.03 0.04,0.04 0.07,0.04 0.03,0 0.06,-0.01 0.07,-0.04 0.02,-0.02 0.02,-0.06 0.02,-0.11l0 -0.54c0,-0.13 -0.02,-0.24 -0.07,-0.34 -0.04,-0.09 -0.11,-0.16 -0.2,-0.2 -0.09,-0.05 -0.19,-0.07 -0.32,-0.07 -0.13,0 -0.24,0.02 -0.33,0.07 -0.09,0.04 -0.15,0.11 -0.2,0.2 -0.04,0.09 -0.07,0.2 -0.07,0.34 -0,0.09 -0,0.18 -0,0.27 0,0.09 0,0.18 0,0.28 0,0.12 0.02,0.23 0.07,0.31 0.04,0.08 0.11,0.14 0.2,0.19 0.09,0.04 0.2,0.06 0.33,0.06l0.34 0 0 0.2 -0.34 0c-0.18,0 -0.33,-0.03 -0.44,-0.08 -0.12,-0.06 -0.21,-0.14 -0.27,-0.25 -0.06,-0.11 -0.09,-0.25 -0.09,-0.42 0,-0.09 0,-0.18 0,-0.28 0,-0.09 0,-0.18 0,-0.27 0,-0.18 0.03,-0.32 0.09,-0.44 0.06,-0.12 0.15,-0.21 0.27,-0.27 0.12,-0.06 0.26,-0.09 0.44,-0.09 0.17,0 0.32,0.03 0.43,0.09 0.12,0.06 0.21,0.15 0.26,0.27 0.06,0.12 0.09,0.27 0.09,0.44l0 0.52c0,0.12 -0.03,0.21 -0.08,0.27 -0.05,0.06 -0.13,0.09 -0.23,0.09 -0.1,0 -0.18,-0.03 -0.23,-0.08 -0.02,-0.02 -0.04,-0.04 -0.05,-0.06 -0,-0 -0,-0 -0,-0l-0 0 -0 0 -0 0 -0 0 -0 0 -0 0 -0 0c-0.01,0.02 -0.03,0.04 -0.06,0.07 -0.05,0.05 -0.12,0.07 -0.21,0.07zm0.05 -0.2c0.06,0 0.11,-0.02 0.14,-0.06 0.03,-0.04 0.04,-0.1 0.04,-0.18l0 -0.37c0,-0.07 -0.01,-0.13 -0.04,-0.17 -0.03,-0.04 -0.08,-0.05 -0.14,-0.05 -0.12,0 -0.18,0.07 -0.18,0.22l0 0.36c0,0.08 0.01,0.14 0.04,0.18 0.03,0.04 0.08,0.06 0.14,0.06z'
            />
          </G>
        </G>
      </G>
    ),
    viewBox: '0 0 4.39 4.39',
    width: '0.402346in',
    height: '0.40235in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  website: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M2.59 0c-1.43,0 -2.59,1.16 -2.59,2.59 0,1.43 1.16,2.59 2.59,2.59 0.16,0 0.32,-0.02 0.48,-0.04l-0.18 -0.53c-0.03,0.03 -0.05,0.05 -0.08,0.07l0 -0.32 -0.4 -1.2c-0.02,-0.06 -0.03,-0.13 -0.03,-0.19l0 0.44c-0.21,0.01 -0.41,0.03 -0.6,0.06 -0.04,-0.2 -0.06,-0.42 -0.08,-0.66l0.67 0 0 0.16c0,-0.15 0.06,-0.3 0.18,-0.42 0.11,-0.11 0.26,-0.18 0.42,-0.18 0.06,0 0.13,0.01 0.19,0.03l1.19 0.4 0.39 0c-0,0.04 -0.01,0.08 -0.02,0.13l0.42 0.14c0.03,-0.16 0.04,-0.31 0.04,-0.48 0,-1.43 -1.16,-2.59 -2.59,-2.59zm1.06 5.19c-0,0 -0,0 -0,0 -0.07,-0 -0.13,-0.05 -0.15,-0.11l-0.68 -2.05c-0.02,-0.06 -0,-0.12 0.04,-0.17 0.04,-0.04 0.11,-0.06 0.17,-0.04l2.05 0.68c0.06,0.02 0.11,0.08 0.11,0.15 0,0.07 -0.04,0.13 -0.1,0.16l-0.92 0.35 -0.35 0.92c-0.02,0.06 -0.08,0.1 -0.15,0.1l0 0zm-1.28 -1.35l0 0.84c-0.19,-0.13 -0.36,-0.4 -0.49,-0.79 0.16,-0.02 0.32,-0.04 0.49,-0.05zm-1.6 -2.42c0.17,0.08 0.37,0.15 0.58,0.21 -0.05,0.23 -0.07,0.48 -0.08,0.74l-0.83 0c0.03,-0.35 0.16,-0.67 0.34,-0.95zm-0.34 1.38l0.83 0c0.01,0.27 0.04,0.52 0.08,0.75 -0.21,0.06 -0.41,0.13 -0.58,0.21 -0.18,-0.28 -0.3,-0.61 -0.34,-0.96l0 0zm1.27 1.76c-0.25,-0.11 -0.47,-0.27 -0.66,-0.46 0.12,-0.05 0.26,-0.1 0.4,-0.14 0.07,0.22 0.16,0.42 0.26,0.59l0 0zm-0.26 -3.36c-0.14,-0.04 -0.28,-0.08 -0.4,-0.14 0.19,-0.19 0.41,-0.35 0.66,-0.46 -0.1,0.17 -0.19,0.37 -0.26,0.59l-0 0zm0.92 1.16l-0.67 0c0.01,-0.23 0.04,-0.45 0.08,-0.65 0.19,0.03 0.39,0.05 0.6,0.06l0 0.59zm0 -1.03c-0.17,-0.01 -0.33,-0.02 -0.49,-0.05 0.13,-0.39 0.3,-0.67 0.49,-0.79l0 0.84zm0.43 -0.84c0.19,0.13 0.36,0.4 0.49,0.79 -0.16,0.02 -0.32,0.04 -0.49,0.05l0 -0.84zm0 1.87l0 -0.59c0.21,-0.01 0.41,-0.03 0.6,-0.06 0.04,0.2 0.06,0.42 0.08,0.65l-0.67 0zm0.66 -1.75c0.25,0.11 0.47,0.27 0.66,0.46 -0.12,0.05 -0.26,0.1 -0.4,0.14 -0.07,-0.22 -0.16,-0.42 -0.26,-0.59l0 0zm0.44 1.75c-0.01,-0.26 -0.04,-0.51 -0.08,-0.74 0.21,-0.06 0.41,-0.13 0.58,-0.21 0.18,0.28 0.3,0.6 0.34,0.95l-0.83 0z'
        />
      </G>
    ),
    viewBox: '0 0 5.19 5.19',
    width: '0.424386in',
    height: '0.424366in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  /*
  .########..########.....###....##......##.########.########.
  .##.....##.##.....##...##.##...##..##..##.##.......##.....##
  .##.....##.##.....##..##...##..##..##..##.##.......##.....##
  .##.....##.########..##.....##.##..##..##.######...########.
  .##.....##.##...##...#########.##..##..##.##.......##...##..
  .##.....##.##....##..##.....##.##..##..##.##.......##....##.
  .########..##.....##.##.....##..###..###..########.##.....##
  */

  home: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M4.07 1.82c-0,-0 -0,-0 -0,-0l-1.71 -1.71c-0.07,-0.07 -0.17,-0.11 -0.27,-0.11 -0.1,0 -0.2,0.04 -0.27,0.11l-1.71 1.71c-0,0 -0,0 -0,0 -0.15,0.15 -0.15,0.39 0,0.54 0.07,0.07 0.16,0.11 0.26,0.11 0,0 0.01,0 0.01,0l0.07 0 0 1.26c0,0.25 0.2,0.45 0.45,0.45l0.67 0c0.07,0 0.12,-0.05 0.12,-0.12l0 -0.98c0,-0.11 0.09,-0.21 0.21,-0.21l0.39 0c0.11,0 0.21,0.09 0.21,0.21l0 0.98c0,0.07 0.05,0.12 0.12,0.12l0.67 0c0.25,0 0.45,-0.2 0.45,-0.45l0 -1.26 0.06 0c0.1,0 0.2,-0.04 0.27,-0.11 0.15,-0.15 0.15,-0.39 0,-0.54zm0 0z'
        />
      </G>
    ),
    viewBox: '0 0 4.18 4.18',
    width: '0.427421in',
    height: '0.427457in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  vip: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.98 2.5c-0.06,-0.06 -0.11,-0.05 -0.14,-0.02l-0.1 0.1 0.16 0.16 0.11 -0.11c0.03,-0.03 0.03,-0.07 -0.03,-0.13zm2.04 -0.69c-0.34,0.34 -0.88,0.34 -1.21,0 -0.34,-0.34 -0.34,-0.88 0,-1.21l-0.59 -0.59 -4.22 4.22 0.59 0.59c0.34,-0.34 0.88,-0.34 1.21,0 0.34,0.34 0.34,0.88 0,1.21l0.59 0.59 4.22 -4.22 -0.59 -0.59zm-2.97 2.6l-1.03 -0.47 0.22 -0.22 0.64 0.34 -0.35 -0.64 0.22 -0.22 0.47 1.02 -0.17 0.17zm0.61 -0.61l-0.75 -0.75 0.21 -0.21 0.75 0.75 -0.21 0.21zm0.44 -0.44l-0.75 -0.75 0.32 -0.32c0.15,-0.15 0.38,-0.12 0.51,0.01 0.13,0.13 0.16,0.36 0.01,0.51l-0.12 0.12 0.23 0.23 -0.21 0.21z'
        />
      </G>
    ),
    viewBox: '0 0 6.62 6.62',
    width: '0.523992in',
    height: '0.523992in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  notification: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.56 2.95c-0.26,-0.22 -0.42,-0.55 -0.42,-0.89l0 -0.49c0,-0.61 -0.46,-1.12 -1.05,-1.21l0 -0.19c0,-0.1 -0.08,-0.17 -0.17,-0.17 -0.1,0 -0.17,0.08 -0.17,0.17l0 0.19c-0.59,0.09 -1.05,0.59 -1.05,1.21l0 0.49c0,0.35 -0.15,0.67 -0.42,0.9 -0.07,0.06 -0.11,0.14 -0.11,0.23 0,0.17 0.14,0.31 0.31,0.31l2.88 0c0.17,0 0.31,-0.14 0.31,-0.31 0,-0.09 -0.04,-0.17 -0.11,-0.23l0 0zm0.11 -1.05c-0.1,0 -0.17,-0.08 -0.17,-0.17 0,-0.49 -0.19,-0.95 -0.54,-1.3 -0.07,-0.07 -0.07,-0.18 0,-0.25 0.07,-0.07 0.18,-0.07 0.25,0 0.41,0.41 0.64,0.96 0.64,1.54 0,0.1 -0.08,0.17 -0.17,0.17zm-3.49 0c-0.1,0 -0.17,-0.08 -0.17,-0.17 0,-0.58 0.23,-1.13 0.64,-1.54 0.07,-0.07 0.18,-0.07 0.25,0 0.07,0.07 0.07,0.18 0,0.25 -0.35,0.35 -0.54,0.81 -0.54,1.3 0,0.1 -0.08,0.17 -0.17,0.17zm1.74 2.29c0.32,0 0.58,-0.23 0.64,-0.52l-1.28 0c0.06,0.3 0.33,0.52 0.64,0.52z'
        />
      </G>
    ),
    viewBox: '0 0 3.84 4.19',
    width: '0.387217in',
    height: '0.422425in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  rate: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.46 0.83l-0.28 0c-0.08,0 -0.14,0.06 -0.14,0.14 0,0.08 0.06,0.14 0.14,0.14l0.28 0c0.08,0 0.14,-0.06 0.14,-0.14 0,-0.08 -0.06,-0.14 -0.14,-0.14zm0.69 1.76c-0.02,-0.21 -0.22,-0.37 -0.44,-0.37l-1.08 0c0.09,-0.16 0.14,-0.63 0.14,-0.82 -0,-0.31 -0.26,-0.57 -0.58,-0.57l-0.11 0c-0.08,0 -0.14,0.06 -0.14,0.14 0,0.32 -0.12,0.9 -0.36,1.13 -0.16,0.16 -0.29,0.22 -0.47,0.3l0 2.08c0.27,0.09 0.62,0.22 1.14,0.22l0.9 0c0.3,0 0.53,-0.28 0.41,-0.57 0.18,-0.05 0.31,-0.21 0.31,-0.4 0,-0.05 -0.01,-0.11 -0.03,-0.15 0.3,-0.08 0.41,-0.45 0.2,-0.68 0.08,-0.08 0.12,-0.2 0.1,-0.32zm-3.46 -0.37l-0.55 0c-0.08,0 -0.14,0.06 -0.14,0.14l-0 2.21c0,0.08 0.06,0.14 0.14,0.14l0.55 0c0.08,0 0.14,-0.06 0.14,-0.14l0 -2.21c0,-0.08 -0.06,-0.14 -0.14,-0.14zm0.83 -1.39l-0.28 0c-0.08,0 -0.14,0.06 -0.14,0.14 0,0.08 0.06,0.14 0.14,0.14l0.28 0c0.08,0 0.14,-0.06 0.14,-0.14 0,-0.08 -0.06,-0.14 -0.14,-0.14zm1.45 -0.82c-0.07,-0.03 -0.15,-0.01 -0.19,0.06l-0.14 0.28c-0.03,0.07 -0.01,0.15 0.06,0.19 0.07,0.03 0.15,0.01 0.19,-0.06l0.14 -0.28c0.03,-0.07 0.01,-0.15 -0.06,-0.19zm-0.91 0.34l-0.14 -0.28c-0.03,-0.07 -0.12,-0.1 -0.19,-0.06 -0.07,0.03 -0.1,0.12 -0.06,0.19l0.14 0.28c0.03,0.07 0.12,0.1 0.19,0.06 0.07,-0.03 0.1,-0.12 0.06,-0.19z'
        />
      </G>
    ),
    viewBox: '0 0 4.15 4.71',
    width: '0.391138in',
    height: '0.44415in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  share: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.62 1.06l-0.99 -1.03c-0.03,-0.03 -0.08,-0.04 -0.12,-0.03 -0.04,0.02 -0.07,0.06 -0.07,0.11l0 0.49 -0.04 0c-0.82,0 -1.48,0.67 -1.48,1.48l0 0.23c0,0.05 0.04,0.1 0.09,0.11 0.01,0 0.02,0 0.03,0 0.04,0 0.08,-0.03 0.1,-0.06 0.21,-0.43 0.64,-0.69 1.12,-0.69l0.18 0 0 0.49c0,0.05 0.03,0.09 0.07,0.11 0.04,0.02 0.09,0.01 0.12,-0.03l0.99 -1.03c0.04,-0.04 0.04,-0.11 0,-0.16zm-0.42 2.59l-2.74 0c-0.25,0 -0.46,-0.2 -0.46,-0.46l0 -2.13c0,-0.25 0.2,-0.46 0.46,-0.46l0.46 0c0.08,0 0.15,0.07 0.15,0.15 0,0.08 -0.07,0.15 -0.15,0.15l-0.46 0c-0.08,0 -0.15,0.07 -0.15,0.15l0 2.13c0,0.08 0.07,0.15 0.15,0.15l2.74 0c0.08,0 0.15,-0.07 0.15,-0.15l0 -1.22c0,-0.08 0.07,-0.15 0.15,-0.15 0.08,0 0.15,0.07 0.15,0.15l0 1.22c0,0.25 -0.2,0.46 -0.46,0.46l0 0z'
        />
      </G>
    ),
    viewBox: '0 0 3.65 3.65',
    width: '0.366787in',
    height: '0.366791in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  report: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M1.92 0l0 0.96 0.96 0 -0.96 -0.96zm0 1.2c-0.13,0 -0.24,-0.11 -0.24,-0.24l0 -0.96 -1.44 0c-0.13,0 -0.24,0.11 -0.24,0.24l0 3.37c0,0.13 0.11,0.24 0.24,0.24l2.41 0c0.13,0 0.24,-0.11 0.24,-0.24l-0 -2.41 -0.96 0zm-0.96 2.17l-0.48 0 0 -0.72 0.48 0 0 0.72zm0.72 0l-0.48 0 0 -1.2 0.48 0 0 1.2zm0.72 0l-0.48 0 0 -1.68 0.48 0 0 1.68z'
        />
      </G>
    ),
    viewBox: '0 0 2.89 3.85',
    width: '0.316071in',
    height: '0.421433in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  request: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M5.13 0l-2.2 0c-0.4,0 -0.72,0.32 -0.72,0.72l0 3.31c0,0.14 0.16,0.22 0.27,0.14l0.69 -0.52 1.96 0c0.4,0 0.72,-0.32 0.72,-0.72l0 -2.2c0,-0.4 -0.32,-0.72 -0.72,-0.72zm-4.04 4.38c-0.6,0 -1.09,0.49 -1.09,1.09l0 0.22c0,0.09 0.08,0.17 0.17,0.17l1.84 0c0.09,0 0.17,-0.08 0.17,-0.17l0 -0.22c0,-0.6 -0.49,-1.09 -1.09,-1.09zm0.81 -0.81c0,0.45 -0.36,0.81 -0.81,0.81 -0.45,0 -0.81,-0.36 -0.81,-0.81 0,-0.45 0.36,-0.81 0.81,-0.81 0.45,0 0.81,0.36 0.81,0.81zm2.13 -0.74c-0.09,0 -0.17,-0.08 -0.17,-0.17 0,-0.09 0.08,-0.17 0.17,-0.17 0.09,0 0.17,0.08 0.17,0.17 0,0.09 -0.08,0.17 -0.17,0.17zm0.17 -0.76l0 0.04c0,0.09 -0.08,0.17 -0.17,0.17 -0.09,0 -0.17,-0.08 -0.17,-0.17l0 -0.18c0,-0.09 0.08,-0.17 0.17,-0.17 0.16,0 0.29,-0.13 0.29,-0.29 0,-0.16 -0.13,-0.29 -0.29,-0.29 -0.16,0 -0.29,0.13 -0.29,0.29 0,0.09 -0.08,0.17 -0.17,0.17 -0.09,0 -0.17,-0.08 -0.17,-0.17l0 -0c0,-0.35 0.28,-0.63 0.63,-0.63 0.35,0 0.63,0.28 0.63,0.63 0,0.29 -0.19,0.53 -0.46,0.61l0 0z'
        />
      </G>
    ),
    viewBox: '0 0 5.85 5.85',
    width: '0.436252in',
    height: '0.436252in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  up: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M6.67 3.99c0.29,-0.32 0.27,-0.82 -0.04,-1.13l-2.62 -2.63c-0.16,-0.16 -0.36,-0.23 -0.57,-0.23 -0.21,0 -0.41,0.08 -0.57,0.23l-2.62 2.62c-0.3,0.3 -0.34,0.81 -0.04,1.13 0.31,0.34 0.84,0.35 1.16,0.03l1.68 -1.68c0.22,-0.22 0.57,-0.22 0.78,0l1.68 1.68c0.33,0.33 0.85,0.32 1.16,-0.02z'
        />
      </G>
    ),
    viewBox: '0 0 6.87 4.25',
    width: '0.439717in',
    height: '0.271709in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  down: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M7.24 0.28c0.32,0.35 0.29,0.89 -0.05,1.22l-2.85 2.85c-0.17,0.17 -0.39,0.25 -0.61,0.25 -0.22,0 -0.45,-0.08 -0.61,-0.25l-2.85 -2.85c-0.33,-0.33 -0.37,-0.88 -0.05,-1.22 0.34,-0.37 0.91,-0.38 1.26,-0.03l1.82 1.82c0.23,0.23 0.61,0.23 0.85,0l1.82 -1.82c0.36,-0.35 0.93,-0.34 1.26,0.02z'
        />
      </G>
    ),
    viewBox: '0 0 7.46 4.61',
    width: '0.439717in',
    height: '0.271709in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },

  whatsapp: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M5.77 0l-0 0c-3.18,0 -5.77,2.59 -5.77,5.77 0,1.26 0.41,2.43 1.1,3.38l-0.72 2.14 2.22 -0.71c0.91,0.6 2,0.95 3.17,0.95 3.18,0 5.77,-2.59 5.77,-5.77 0,-3.18 -2.59,-5.77 -5.77,-5.77zm3.36 8.14c-0.14,0.39 -0.69,0.72 -1.13,0.81 -0.3,0.06 -0.69,0.12 -2.02,-0.43 -1.69,-0.7 -2.79,-2.42 -2.87,-2.54 -0.08,-0.11 -0.68,-0.91 -0.68,-1.74 0,-0.83 0.42,-1.23 0.59,-1.4 0.14,-0.14 0.37,-0.21 0.59,-0.21 0.07,0 0.14,0 0.19,0.01 0.17,0.01 0.25,0.02 0.37,0.28 0.14,0.34 0.48,1.16 0.52,1.25 0.04,0.09 0.08,0.2 0.02,0.31 -0.05,0.12 -0.1,0.17 -0.19,0.26 -0.09,0.1 -0.17,0.17 -0.25,0.28 -0.08,0.09 -0.17,0.19 -0.07,0.36 0.1,0.17 0.44,0.72 0.94,1.16 0.64,0.57 1.17,0.76 1.35,0.83 0.14,0.06 0.3,0.04 0.41,-0.06 0.13,-0.14 0.29,-0.37 0.45,-0.6 0.12,-0.16 0.26,-0.18 0.41,-0.13 0.16,0.05 0.98,0.46 1.15,0.55 0.17,0.09 0.28,0.13 0.32,0.2 0.04,0.07 0.04,0.41 -0.1,0.8z'
        />
      </G>
    ),
    viewBox: '0 0 11.54 11.54',
    width: '0.443102in',
    height: '0.443102in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },
  google: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.82 4.06c0.04,-0.04 0.08,-0.07 0.12,-0.11 0.44,-0.44 0.68,-1.02 0.68,-1.63 0,-0.14 -0.01,-0.28 -0.04,-0.42l-0.02 -0.11 -2.39 0 0 1.08 1.23 0c-0.09,0.17 -0.21,0.31 -0.35,0.43l0.77 0.77zm-2.49 -2.49c0.22,-0.3 0.58,-0.49 0.98,-0.49 0.33,0 0.64,0.13 0.87,0.36l0.1 0.1 0.77 -0.77 -0.1 -0.1c-0.44,-0.44 -1.02,-0.68 -1.63,-0.68 -0.62,0 -1.2,0.24 -1.63,0.68 -0.04,0.04 -0.08,0.08 -0.11,0.12l0.77 0.77zm-0.14 1.24c-0.07,-0.15 -0.11,-0.32 -0.11,-0.5 0,-0.18 0.04,-0.35 0.11,-0.5l-0.79 -0.79c-0.26,0.38 -0.4,0.83 -0.4,1.29 0,0.47 0.14,0.92 0.4,1.29l0.79 -0.79zm1.62 0.62c-0.15,0.07 -0.32,0.11 -0.5,0.11 -0.4,0 -0.75,-0.19 -0.98,-0.49l-0.77 0.77c0.04,0.04 0.07,0.08 0.11,0.12 0.44,0.44 1.02,0.68 1.63,0.68 0.47,0 0.92,-0.14 1.29,-0.4l-0.79 -0.79z'
        />
      </G>
    ),
    viewBox: '0 0 4.62 4.62',
    width: '0.449228in',
    height: '0.449228in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },
  facebook: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M0.23 2.16l0.43 0 0 -1.09 0.3 0 0.03 -0.36 -0.34 0 0 -0.21c0,-0.09 0.02,-0.12 0.1,-0.12l0.24 0 0 -0.38 -0.3 0c-0.32,0 -0.47,0.14 -0.47,0.41l0 0.29 -0.23 0 0 0.37 0.23 0 0 1.08z'
        />
      </G>
    ),
    viewBox: '0 0 1 2.16',
    width: '0.202126in',
    height: '0.437945in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },
  phone: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          id='Shape'
          class='fil0'
          d='M1.67 2.36c-0.38,-0.38 -0.47,-0.77 -0.49,-0.92 -0.01,-0.04 0.01,-0.09 0.04,-0.12l0.31 -0.31c0.05,-0.05 0.05,-0.12 0.02,-0.17l-0.5 -0.77c-0.04,-0.06 -0.12,-0.08 -0.18,-0.05l-0.8 0.37c-0.05,0.03 -0.08,0.08 -0.08,0.14 0.04,0.4 0.21,1.37 1.17,2.33 0.96,0.96 1.93,1.13 2.33,1.17 0.06,0.01 0.11,-0.02 0.14,-0.08l0.37 -0.8c0.03,-0.06 0.01,-0.14 -0.05,-0.18l-0.77 -0.5c-0.05,-0.03 -0.13,-0.03 -0.17,0.02l-0.31 0.31c-0.03,0.03 -0.07,0.05 -0.12,0.04 -0.15,-0.02 -0.54,-0.11 -0.92,-0.49l0 0zm2.22 -0.21c-0.08,0 -0.14,-0.06 -0.14,-0.14 -0,-0.96 -0.78,-1.74 -1.74,-1.74 -0.08,0 -0.14,-0.06 -0.14,-0.14 0,-0.08 0.06,-0.14 0.14,-0.14 1.11,0 2.01,0.9 2.02,2.02 0,0.04 -0.01,0.07 -0.04,0.1 -0.03,0.03 -0.06,0.04 -0.1,0.04l0 0zm-0.7 0c-0.08,0 -0.14,-0.06 -0.14,-0.14 -0,-0.58 -0.47,-1.04 -1.04,-1.04 -0.08,0 -0.14,-0.06 -0.14,-0.14 0,-0.08 0.06,-0.14 0.14,-0.14 0.73,0 1.32,0.59 1.32,1.32 0,0.08 -0.06,0.14 -0.14,0.14l0 0z'
        />
      </G>
    ),
    viewBox: '0 0 4.03 4.03',
    width: '0.397in',
    height: '0.39698in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  },
  lock: {
    svg: (
      <G id='Layer_x0020_1'>
        <Path
          class='fil0'
          d='M3.18 1.63l-0.27 0 0 -0.36c0,-0.7 -0.57,-1.27 -1.27,-1.27 -0.7,0 -1.27,0.57 -1.27,1.27l0 0.36 -0.27 0c-0.05,0 -0.09,0.04 -0.09,0.09l0 2.27c0,0.2 0.16,0.36 0.36,0.36l2.54 0c0.2,0 0.36,-0.16 0.36,-0.36l0 -2.27c0,-0.05 -0.04,-0.09 -0.09,-0.09zm-1.27 1.9c0,0.03 -0.01,0.05 -0.02,0.07 -0.02,0.02 -0.04,0.03 -0.07,0.03l-0.36 0c-0.03,0 -0.05,-0.01 -0.07,-0.03 -0.02,-0.02 -0.03,-0.04 -0.02,-0.07l0.06 -0.52c-0.09,-0.07 -0.15,-0.17 -0.15,-0.29 0,-0.2 0.16,-0.36 0.36,-0.36 0.2,0 0.36,0.16 0.36,0.36 0,0.12 -0.06,0.22 -0.15,0.29l0.06 0.52zm0.45 -1.9l-1.45 0 0 -0.36c0,-0.4 0.33,-0.73 0.73,-0.73 0.4,0 0.73,0.33 0.73,0.73l0 0.36z'
        />
      </G>
    ),
    viewBox: '0 0 3.27 4.36',
    width: '0.346945in',
    height: '0.462591in',
    style:
      'shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd'
  }
}
