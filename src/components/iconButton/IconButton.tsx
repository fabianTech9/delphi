import React from 'react';
import cn from 'classnames';

import Image from 'next/image';

import styles from './IconButton.module.scss';

function IconButton({
  className,
  imageUrl,
  title,
  width,
  height,
}: any): JSX.Element {
  return (
    <button
      className={cn(styles.button, className)}
      title={title}
      type="button"
    >
      <Image height={height} src={imageUrl} width={width} />
    </button>
  );
}

export default IconButton;
