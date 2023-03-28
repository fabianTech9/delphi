import React from 'react';
import cn from 'classname';

import styles from './Description.module.scss';

function Description({ video }: any): JSX.Element {
  const { title, description1, description2, description3 } = video;

  return (
    <div className={styles.container}>
      {title && (
        <h2 className={cn('termina-medium', 'h2', styles.title)}>{title}</h2>
      )}
      {description1 && <h3 className="h3">{description1}</h3>}
      {description2 && <h3 className="h3">{description2}</h3>}
      {description3 && <h3 className="h3">{description3}</h3>}
    </div>
  );
}

export default Description;
