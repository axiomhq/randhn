import { cn } from '@/cn';

const MenuIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 5.75H19.25" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 18.25H19.25" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.75 12H19.25" />
    </svg>
  );
};

// <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
const GitHubIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="1rem"
      height="1rem"
      viewBox="0 0 448 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0 1.3-1.5 2.4-3.5 2.4-2.2.2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7.9 3.7 2.4zm-13.7-1.1c-.4 1.3-2.4 1.9-4.1 1.3-1.9-.4-3.2-1.9-2.8-3.2.4-1.3 2.4-1.9 4.1-1.5 2 .6 3.3 2.1 2.8 3.4zm-12.3-5.4c-.9 1.1-2.8.9-4.3-.6-1.5-1.3-1.9-3.2-.9-4.1.9-1.1 2.8-.9 4.3.6 1.3 1.3 1.8 3.3.9 4.1zm-9.1-9.1c-.9.6-2.6 0-3.7-1.5s-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1zm-6.5-9.7c-.9.9-2.4.4-3.5-.6-1.1-1.3-1.3-2.8-.4-3.5.9-.9 2.4-.4 3.5.6 1.1 1.3 1.3 2.8.4 3.5zm-6.7-7.4c-.4.9-1.7 1.1-2.8.4-1.3-.6-1.9-1.7-1.5-2.6.4-.6 1.5-.9 2.8-.4 1.3.7 1.9 1.8 1.5 2.6z" />
    </svg>
  );
};

const AxiomIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="1rem"
      height="1rem"
      viewBox="0 0 131 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M130.042 82.3363L102.058 33.5469C100.775 31.3046 97.6132 29.4699 95.0316 29.4699H77.5612C73.5005 29.4699 71.8355 26.5877 73.8614 23.065L83.4418 6.40493C84.2021 5.08268 84.2007 3.45493 83.4375 2.13418C82.6746 0.813363 81.266 0 79.7418 0H55.3701C52.7884 0 49.6194 1.83049 48.3277 4.06789L0.969431 86.0934C-0.322344 88.3307 -0.323303 91.9923 0.967513 94.2302L13.1533 115.357C15.1835 118.877 18.5132 118.882 20.5523 115.366L30.0739 98.9529C32.1131 95.4379 35.4428 95.4421 37.473 98.9621L46.1053 113.928C47.3959 116.166 50.5644 117.997 53.1458 117.997H109.463C112.045 117.997 115.213 116.166 116.504 113.928L130.028 90.4822C131.319 88.2443 131.325 84.5786 130.042 82.3363ZM92.2502 79.988C94.2677 83.5154 92.5963 86.4013 88.5355 86.4013H44.7298C40.6691 86.4013 39.008 83.5213 41.0382 80.0012L62.9583 41.9977C64.9886 38.4776 68.3108 38.4777 70.3408 41.9979L92.2502 79.988Z"
        fill="currentColor"
      />
    </svg>
  );
};

const TweetIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.31 18.25C14.7819 18.25 17.7744 13.4403 17.7744 9.26994C17.7744 9.03682 17.9396 8.83015 18.152 8.73398C18.8803 8.40413 19.8249 7.49943 18.8494 5.97828C18.2031 6.32576 17.6719 6.51562 16.9603 6.74448C15.834 5.47393 13.9495 5.41269 12.7514 6.60761C11.9785 7.37819 11.651 8.52686 11.8907 9.62304C9.49851 9.49618 6.69788 7.73566 5.1875 5.76391C4.39814 7.20632 4.80107 9.05121 6.10822 9.97802C5.63461 9.96302 5.1716 9.82741 4.75807 9.58305V9.62304C4.75807 11.1255 5.75654 12.4191 7.1444 12.7166C6.70672 12.8435 6.24724 12.8622 5.80131 12.771C6.19128 14.0565 7.87974 15.4989 9.15272 15.5245C8.09887 16.4026 6.79761 16.8795 5.45806 16.8782C5.22126 16.8776 4.98504 16.8626 4.75 16.8326C6.11076 17.7588 7.69359 18.25 9.31 18.2475V18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LotusIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.9326 14.2162L16.8155 13.4754C16.5763 13.5132 16.3701 13.6641 16.2618 13.8807C16.1535 14.0972 16.1564 14.3528 16.2696 14.5668L16.9326 14.2162ZM16.9326 8.78383L16.2696 8.4332C16.1564 8.64725 16.1535 8.90279 16.2618 9.11935C16.3701 9.33591 16.5763 9.48685 16.8155 9.52464L16.9326 8.78383ZM12 6.35276L11.3185 6.66599C11.4409 6.93218 11.707 7.10276 12 7.10276C12.293 7.10276 12.5591 6.93218 12.6815 6.66599L12 6.35276ZM7.06744 8.78382L7.18449 9.52464C7.42366 9.48685 7.62988 9.33591 7.73821 9.11935C7.84653 8.90278 7.84364 8.64725 7.73044 8.43319L7.06744 8.78382ZM7.06745 14.2162L7.73044 14.5668C7.84364 14.3528 7.84654 14.0972 7.73821 13.8807C7.62988 13.6641 7.42367 13.5132 7.18449 13.4754L7.06745 14.2162ZM12 16.6472L12.6815 16.334C12.5591 16.0678 12.293 15.8972 12 15.8972C11.707 15.8972 11.4409 16.0678 11.3185 16.334L12 16.6472ZM16.2696 14.5668C16.4165 14.8446 16.5 15.1614 16.5 15.5H18C18 14.9112 17.854 14.3542 17.5955 13.8655L16.2696 14.5668ZM18.5 11.5C18.5 12.4968 17.77 13.3246 16.8155 13.4754L17.0496 14.957C18.7217 14.6928 20 13.2464 20 11.5H18.5ZM16.8155 9.52464C17.77 9.67544 18.5 10.5032 18.5 11.5H20C20 9.7536 18.7217 8.30719 17.0496 8.04302L16.8155 9.52464ZM16.5 7.5C16.5 7.83855 16.4165 8.15539 16.2696 8.4332L17.5955 9.13446C17.854 8.6458 18 8.08884 18 7.5H16.5ZM14.5 5.5C15.6046 5.5 16.5 6.39543 16.5 7.5H18C18 5.567 16.433 4 14.5 4V5.5ZM12.6815 6.66599C12.9985 5.97635 13.6944 5.5 14.5 5.5V4C13.087 4 11.8712 4.83727 11.3185 6.03952L12.6815 6.66599ZM9.5 5.5C10.3056 5.5 11.0015 5.97635 11.3185 6.66599L12.6815 6.03952C12.1288 4.83727 10.913 4 9.5 4V5.5ZM7.5 7.5C7.5 6.39543 8.39543 5.5 9.5 5.5V4C7.567 4 6 5.567 6 7.5H7.5ZM7.73044 8.43319C7.58351 8.15539 7.5 7.83855 7.5 7.5H6C6 8.08884 6.14602 8.6458 6.40445 9.13446L7.73044 8.43319ZM5.5 11.5C5.5 10.5032 6.23 9.67544 7.18449 9.52464L6.9504 8.04301C5.27833 8.30719 4 9.75361 4 11.5H5.5ZM7.18449 13.4754C6.23 13.3246 5.5 12.4968 5.5 11.5H4C4 13.2464 5.27833 14.6928 6.9504 14.957L7.18449 13.4754ZM7.5 15.5C7.5 15.1614 7.58351 14.8446 7.73044 14.5668L6.40446 13.8655C6.14602 14.3542 6 14.9112 6 15.5H7.5ZM9.5 17.5C8.39543 17.5 7.5 16.6046 7.5 15.5H6C6 17.433 7.567 19 9.5 19V17.5ZM11.3185 16.334C11.0015 17.0236 10.3056 17.5 9.5 17.5V19C10.913 19 12.1288 18.1627 12.6815 16.9605L11.3185 16.334ZM14.5 17.5C13.6944 17.5 12.9985 17.0236 12.6815 16.334L11.3185 16.9605C11.8712 18.1627 13.087 19 14.5 19V17.5ZM16.5 15.5C16.5 16.6046 15.6046 17.5 14.5 17.5V19C16.433 19 18 17.433 18 15.5H16.5Z"
        fill="currentColor"
      />
      <path
        d="M13.5 11.75C13.5 12.5784 12.8284 13.25 12 13.25V14.75C13.6569 14.75 15 13.4069 15 11.75H13.5ZM12 13.25C11.1716 13.25 10.5 12.5784 10.5 11.75H9C9 13.4069 10.3431 14.75 12 14.75V13.25ZM10.5 11.75C10.5 10.9216 11.1716 10.25 12 10.25V8.75C10.3431 8.75 9 10.0931 9 11.75H10.5ZM12 10.25C12.8284 10.25 13.5 10.9216 13.5 11.75H15C15 10.0931 13.6569 8.75 12 8.75V10.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.75C4.75 7.64543 5.64543 6.75 6.75 6.75H17.25C18.3546 6.75 19.25 7.64543 19.25 8.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V8.75Z"
      />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 4.75V8.25" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 4.75V8.25" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.75 10.75H16.25" />
    </svg>
  );
};

const GlobeIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="7.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></circle>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.25 12C15.25 16.5 13.2426 19.25 12 19.25C10.7574 19.25 8.75 16.5 8.75 12C8.75 7.5 10.7574 4.75 12 4.75C13.2426 4.75 15.25 7.5 15.25 12Z"
      />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12H12H19" />
    </svg>
  );
};

const LinkIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 9.25V4.75H14.75"
      />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 5L11.75 12.25" />
    </svg>
  );
};

const CopyIcon = ({ className }: { className?: string }) => {
  return (
    <svg className={className} width="1rem" height="1rem" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5"
      />
      <rect
        width="10.5"
        height="10.5"
        x="8.75"
        y="8.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        rx="2"
      ></rect>
    </svg>
  );
};

const SpinnerIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn('animate-spin size-32', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17.1266 6.87347L16.0659 7.93413"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17.1266 17.1265L16.0659 16.0659"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7.9342 16.0659L6.87354 17.1265"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7.9342 7.93413L6.87354 6.87347"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type IconProps = {
  name: 'menu' | 'github' | 'axiom' | 'tweet' | 'lotus' | 'calendar' | 'globe' | 'link' | 'copy' | 'spinner';
  className?: string;
};

export const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case 'menu':
      return <MenuIcon className={className} />;
    case 'github':
      return <GitHubIcon className={className} />;
    case 'axiom':
      return <AxiomIcon className={className} />;
    case 'tweet':
      return <TweetIcon className={className} />;
    case 'lotus':
      return <LotusIcon className={className} />;
    case 'calendar':
      return <CalendarIcon className={className} />;
    case 'globe':
      return <GlobeIcon className={className} />;
    case 'link':
      return <LinkIcon className={className} />;
    case 'copy':
      return <CopyIcon className={className} />;
    case 'spinner':
      return <SpinnerIcon className={className} />;
    default:
      return null;
  }
};
