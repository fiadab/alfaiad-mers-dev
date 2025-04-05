// global.d.ts
declare module '*.svg' {
    import React from 'react';
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
  }
  
  declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
  }