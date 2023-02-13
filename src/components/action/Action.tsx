import React from 'react';

import styles from './Action.module.scss';

function Action({
  image,
  text,
  url,
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

  return (
    <div
      className={styles.container}
      // @ts-ignore
      style={style}
      target="_blank"
    >
      {type === 'fullwidth' ? (
        <img
          alt="delphi"
          className={styles.watermark}
          src="https://ocmproduction-delphitheater.ocecdn.oraclecloud.com/content/published/api/v1.1/assets/CONTA2F19C865F9145AEA78127858F76AB79/native/Lower+Third.png?channelToken=d57d3338641c4004a255b7be5e742af6"
        />
      ) : (
        <>
          <figure className={styles.imageContainer}>
            <img alt={text} src={image} />
          </figure>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </>
      )}
    </div>
  );
}

export default Action;
