import React, { useState } from 'react';
import { Slider } from '@mui/material';

import IconButton from '@components/iconButton/IconButton';

import styles from './Volume.module.scss';

function Volume({ initialVolume, onVolumeChange }: any): JSX.Element {
  const [volume, setVolume] = useState(initialVolume ?? 100);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeClick = (): void => {
    const newIsMuted = !isMuted;

    setIsMuted(newIsMuted);
    onVolumeChange({
      volume,
      isMuted: newIsMuted,
    });
  };

  const handleVolumeChange = (e, newValue): void => {
    setIsMuted(false);
    setVolume(newValue);
    onVolumeChange({
      volume,
      isMuted: false,
    });
  };

  const getVolumeIcon = (): string => {
    if (isMuted || volume === 0) {
      return '/icons/volume-mute.svg';
    }
    if (volume < 25) return '/icons/volume-25.svg';
    if (volume < 50) return '/icons/volume-50.svg';
    if (volume < 75) return '/icons/volume-75.svg';

    return '/icons/volume-100.svg';
  };

  return (
    <>
      <IconButton
        className={styles.iconButton}
        height={24}
        imageUrl={getVolumeIcon()}
        title="Volume"
        width={24}
        onClick={handleVolumeClick}
      />
      <Slider
        aria-label="Volume"
        size="small"
        sx={{
          width: '100px',
          '& .MuiSlider-rail': {
            color: '#fff',
            opacity: 0.5,
          },
          '& .MuiSlider-thumb': {
            color: '#fff',
            '&:after': {
              display: 'none',
            },
            '&.Mui-active': {
              boxShadow: 'none',
            },
          },
          '& .MuiSlider-track': {
            color: '#fff',
            border: 'none',
          },
        }}
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
      />
    </>
  );
}

export default Volume;
