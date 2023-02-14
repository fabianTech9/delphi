import React from 'react';

import Countdown from '@components/actions/Countdown/Countdown';

import styles from './Quiz.module.scss';

function Actions({
  background,
  question,
  answers,
  countdown,
}: any): JSX.Element {
  const style = {
    '--action-background-image': `url(${background})`,
  };

  const handleClick = (label): void => {
    alert(`"${label}" was clicked`);
  };

  return (
    <div
      className={styles.container}
      // @ts-ignore
      style={style}
    >
      <div className={styles.questionContainer}>
        <h2 dangerouslySetInnerHTML={{ __html: question }} />
        <div className={styles.countdown}>
          <Countdown countdown={countdown} />
        </div>
        <ul className={styles.answers}>
          {answers.map((answer, i) => (
            <li className={styles.answer} key={answer.id}>
              <button
                className={styles.button}
                type="button"
                onClick={() => handleClick(answer.label)}
              >
                <span className={styles.option}>{i + 1}</span>
                {answer.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Actions;
