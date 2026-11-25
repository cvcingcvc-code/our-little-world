"use client";

import React from "react";

interface IconProps {
  className?: string;
}

/** 首页：粉色爱心小屋 */
export function ShoujoHomeIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 16 24 4l16 12v22a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z"
        fill="#FCE1ED"
        stroke="#EF8DB8"
      />
      <path
        d="M24 33c-1.2-.8-9-5.4-9-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 4.6-7.8 9.2-9 10Z"
        fill="#F47FA9"
        stroke="#D85F91"
      />
      <path
        d="m36 5 1.5 3.5L41 10l-3.5 1.5L36 15l-1.5-3.5L31 10l3.5-1.5Z"
        fill="#FFE8A4"
        stroke="none"
      />
    </svg>
  );
}

/** 相册：蝴蝶结相机 */
export function ShoujoAlbumIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="7"
        y="13"
        width="34"
        height="27"
        rx="7"
        fill="#F8E5F4"
        stroke="#D29BCB"
      />
      <path d="M12 13l4-5h11l4 5" fill="#F8E5F4" stroke="#D29BCB" />
      <circle cx="24" cy="26" r="8" fill="#E2D8FF" stroke="#AC91E4" />
      <path
        d="M24 30s-5-3.1-5-5.7a2.7 2.7 0 0 1 5-1.1 2.7 2.7 0 0 1 5 1.1C29 26.9 24 30 24 30Z"
        fill="#F48EB5"
        stroke="none"
      />
      <path
        d="M36 12c-8-8-10 2-2 3-1 6 5 6 5 0 8 1 6-8-3-3Z"
        fill="#FFB9D1"
        stroke="#E77BA8"
      />
    </svg>
  );
}

/** 星空：月亮与星星 */
export function ShoujoStarsIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M29 5A19 19 0 1 0 43 31 17 17 0 0 1 29 5Z"
        fill="#E6D9FF"
        stroke="#B39BEA"
      />
      <path
        d="m34 9 2.2 5.8 5.8 2.2-5.8 2.2L34 25l-2.2-5.8L26 17l5.8-2.2Z"
        fill="#FFE6A6"
        stroke="#E7BE6D"
      />
      <path
        d="m10 7 1.5 3.5L15 12l-3.5 1.5L10 17l-1.5-3.5L5 12l3.5-1.5Z"
        fill="#FFB4D2"
        stroke="none"
      />
      <circle cx="41" cy="6" r="1.7" fill="#FFCAE1" stroke="none" />
    </svg>
  );
}

/** 美食：草莓蛋糕 */
export function ShoujoFoodIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 27h32l-6 14H14Z" fill="#F6C2A7" stroke="#DFA18A" />
      <path
        d="M7 27c0-5 4-8 8-8 0-6 4-10 9-10s9 4 9 10c4 0 8 3 8 8Z"
        fill="#FFE2EE"
        stroke="#E898BA"
      />
      <path d="M19 31l2 7m6-7-2 7" stroke="#DFA18A" />
      <path
        d="M24 12c-1-1-5-3.4-5-6a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 2.6-4 5-5 6Z"
        fill="#F47FA9"
        stroke="#D85F91"
      />
      <path d="m12 23 3-2m18 2 3-2" stroke="#C799E4" />
    </svg>
  );
}

/** 愿望：少女手账 */
export function ShoujoWishesIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="9"
        y="10"
        width="30"
        height="32"
        rx="6"
        fill="#F9E2EE"
        stroke="#E4A1BD"
      />
      <path d="M17 7h14v8H17Z" fill="#E3D6FF" stroke="#AE96DA" />
      <path d="m15 23 3 3 5-6m-8 13 3 3 5-6" stroke="#C18AD7" />
      <path d="M27 24h6m-6 10h6" stroke="#DDA6BC" />
      <path
        d="m38 4 1.7 4.3L44 10l-4.3 1.7L38 16l-1.7-4.3L32 10l4.3-1.7Z"
        fill="#FFE6A6"
        stroke="none"
      />
    </svg>
  );
}

/** 礼物：丝带礼盒 */
export function ShoujoGiftIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="8"
        y="19"
        width="32"
        height="23"
        rx="4"
        fill="#E7DBFF"
        stroke="#B49BE5"
      />
      <rect
        x="5"
        y="14"
        width="38"
        height="8"
        rx="3"
        fill="#FBD8E9"
        stroke="#E69ABF"
      />
      <path d="M20 14h8v28h-8Z" fill="#F49FC3" stroke="none" />
      <path
        d="M24 14C4 14 10-2 19 6l5 8Zm0 0C44 14 38-2 29 6l-5 8Z"
        fill="#FFD1E6"
        stroke="#E69ABF"
      />
    </svg>
  );
}
