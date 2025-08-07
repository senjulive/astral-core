
import * as React from 'react';

export const NotificationIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <foreignObject x="0" y="0" width="24" height="24">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          fontSize: '20px',
          lineHeight: '24px',
          textAlign: 'center',
          color: 'currentColor',
        }}
      >
        🔔
      </div>
    </foreignObject>
  </svg>
);
