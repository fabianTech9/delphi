import React from 'react';

import Quiz from '@components/action/quiz/Quiz';

function Action({ action }: any): JSX.Element {
  let content = null;

  switch (action.type) {
    case 'quiz': {
      content = <Quiz {...action} />;
      break;
    }
  }

  return content;
}

export default Action;
