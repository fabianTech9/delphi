import React, { useEffect, useState } from 'react';

import styles from './Countdown.module.scss';

function Countdown({ countdown }: any): JSX.Element {
  const [value, setValue] = useState(countdown);

  useEffect(() => {
    const interval = setInterval(() => {
      if (value > 0) {
        setValue(value - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [value]);

  return (
    <div className={styles.container}>
      <img alt="clock" className={styles.icon} src="./images/clock.svg" />
      <span className={styles.value}>{`${value}s`}</span>
    </div>
  );
}

export default Countdown;
