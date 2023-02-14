import React from 'react';

import styles from './PlayerAction.module.scss';

function PlayerAction({
  image,
  text,
  borderColor,
  backgroundColor,
  textColor,
  type,
}: any): JSX.Element {
  const style = {
    '--action-border-color': borderColor,
    '--action-text-color': textColor,
    '--action-background-color': backgroundColor,
  };

  let content = null;

  switch (type) {
    case 'overlay': {
      content = <img alt="delphi" className={styles.watermark} src={image} />;
      break;
    }
    case 'textBanner': {
      content = (
        <div
          className={styles.container}
          // @ts-ignore
          style={style}
          target="_blank"
        >
          <figure className={styles.imageContainer}>
            <img alt={text} src={image} />
          </figure>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      );
      break;
    }
  }

  return content;
}

export default PlayerAction;
