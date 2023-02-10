import React from 'react';

import styles from './Action.module.scss';

function Action({
  image,
  text,
  url,
  borderColor,
  backgroundColor,
  textColor,
}: any): JSX.Element {
  const style = {
    '--action-border-color': borderColor,
    '--action-text-color': textColor,
    '--action-background-color': backgroundColor,
  };

  return (
    <a
      className={styles.container}
      href={url}
      rel="noreferrer"
      // @ts-ignore
      style={style}
      target="_blank"
    >
      <figure className={styles.imageContainer}>
        <img alt={text} src={image} />
      </figure>

      <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
    </a>
  );
}

export default Action;
