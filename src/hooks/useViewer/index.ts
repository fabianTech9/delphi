import { useReducer, useRef, useState } from 'react';
import {
  BroadcastEvent,
  Director,
  MediaStreamLayers,
  MediaStreamSource,
  View,
  ViewerCount,
  ViewProjectSourceMapping,
} from '@millicast/sdk';

import reducer from './reducer';
import {
  RemoteTrackSource,
  RemoteTrackSources,
  SimulcastQuality,
  Viewer,
  ViewerActionType,
  ViewerProps,
} from './types';
import {
  addRemoteTrack,
  buildQualityOptions,
  projectToStream,
  unprojectFromStream,
} from './utils';

const useViewer = ({
  handleError,
  streamAccountId,
  streamName,
  subscriberToken,
}: ViewerProps): Viewer => {
  const viewerRef = useRef<View>();

  const [remoteTrackSources, dispatch] = useReducer(
    reducer,
    new Map() as RemoteTrackSources
  );

  const remoteTrackSourcesRef = useRef<RemoteTrackSources>();
  remoteTrackSourcesRef.current = remoteTrackSources;

  // Use this to keep track of the quantity of concurrent active event handlers
  const activeEventCounterRef = useRef(0);
  const mainAudioMappingRef = useRef<ViewProjectSourceMapping>();
  const mainVideoMappingRef = useRef<ViewProjectSourceMapping>();

  const [mainMediaStream, setMainMediaStream] = useState<MediaStream>();
  const [mainQualityOptions, setMainQualityOptions] = useState<any>(
    buildQualityOptions()
  );

  const [viewerCount, setViewerCount] = useState<number>(0);

  const handleInternalError = (error: unknown): void => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const connect = async (): Promise<void> => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    try {
      await viewer.connect({
        events: ['active', 'inactive', 'layers', 'viewercount'],
      });
    } catch {
      try {
        await viewer.reconnect();
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const handleBroadcastEvent = async (event: BroadcastEvent): Promise<void> => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { sourceId, tracks } = event.data as MediaStreamSource;

    switch (event.name) {
      case 'active':
        try {
          const activeEventCounter = activeEventCounterRef.current + 1;
          activeEventCounterRef.current = activeEventCounter;

          const newRemoteTrackSource = await addRemoteTrack(
            viewer,
            sourceId,
            tracks
          );

          dispatch({
            remoteTrackSource: newRemoteTrackSource,
            sourceId,
            type: ViewerActionType.ADD_SOURCE,
          });

          if (
            !remoteTrackSourcesRef.current?.size &&
            activeEventCounter === 1
          ) {
            await projectToStream(
              viewer,
              newRemoteTrackSource,
              mainAudioMappingRef.current,
              mainVideoMappingRef.current
            );
          } else {
            await viewer.project(sourceId, newRemoteTrackSource.projectMapping);
          }
        } catch (error) {
          handleInternalError(error);
        } finally {
          activeEventCounterRef.current -= 1;
        }

        break;

      case 'inactive': {
        const remoteTrackSource = remoteTrackSourcesRef.current?.get(sourceId);

        if (remoteTrackSource) {
          try {
            dispatch({ sourceId, type: ViewerActionType.REMOVE_SOURCE });
            await unprojectFromStream(viewer, remoteTrackSource);
          } catch (error) {
            handleInternalError(error);
          }
        }

        if (!remoteTrackSourcesRef.current?.size) {
          setMainQualityOptions(buildQualityOptions());
        }

        break;
      }

      case 'viewercount':
        setViewerCount((event.data as ViewerCount).viewercount);
        break;

      case 'layers': {
        const { mediaId } = mainVideoMappingRef.current ?? {};

        if (mediaId) {
          const mid = parseInt(mediaId, 10);
          const { active } =
            (event.data as MediaStreamLayers).medias[mid] ?? {};

          setMainQualityOptions(buildQualityOptions(active));
        }

        break;
      }
    }
  };

  const handleConnectionStateChange = (event: string): void => {
    // eslint-disable-next-line no-console
    console.log(event);
  };

  // Get the audio/video media IDs for the main stream from the track event
  // and use them to create the main stream mapping
  const handleTrack = (event: RTCTrackEvent): any => {
    const {
      streams: [mediaStream],
      track: { kind },
      transceiver: { mid },
    } = event;

    if (mediaStream && mid !== null) {
      // const newMapping = { media: kind, mediaId: mid, trackId: kind };

      setMainMediaStream(mediaStream);

      if (kind === 'audio') {
        // mainAudioMappingRef.current = newMapping;
      } else if (kind === 'video') {
        // mainVideoMappingRef.current = newMapping;
      }
    }
  };

  const projectToMainStream = async (
    sourceId?: string
  ): Promise<RemoteTrackSource | void> => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const remoteTrackSource = remoteTrackSources.get(sourceId);

    if (remoteTrackSource) {
      try {
        await unprojectFromStream(viewer, remoteTrackSource);
        await projectToStream(
          viewer,
          remoteTrackSource,
          mainAudioMappingRef.current,
          mainVideoMappingRef.current
        );

        // eslint-disable-next-line consistent-return
        return remoteTrackSource;
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const reprojectFromMainStream = async (sourceId?: string) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const remoteTrackSource = remoteTrackSources.get(sourceId);

    if (remoteTrackSource) {
      try {
        await viewer.project(sourceId, remoteTrackSource.projectMapping);
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const setSourceQuality = (sourceId?: string, quality?: SimulcastQuality) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { streamQuality, simulcastLayer } = quality ?? {};

    if (streamQuality === 'Auto') {
      // @ts-ignore
      viewer.select({});
    } else {
      // @ts-ignore
      viewer.select(simulcastLayer ?? {});
    }

    dispatch({
      quality: streamQuality ?? 'Auto',
      sourceId,
      type: ViewerActionType.UPDATE_SOURCE_QUALITY,
    });
  };

  const startViewer = async (): Promise<void> => {
    if (!viewerRef.current?.isActive()) {
      try {
        // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
        const viewer = new View(streamName, tokenGenerator);

        viewer.on('broadcastEvent', handleBroadcastEvent);
        viewer.on('connectionStateChange', handleConnectionStateChange);
        viewer.on('track', handleTrack);

        viewerRef.current = viewer;

        connect();
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const stopViewer = (): void => {
    const { current: viewer } = viewerRef;
    // const { current: collection } = collectionRef;

    if (viewer) {
      viewer.removeAllListeners('broadcastEvent');
      // collection?.stop();
      viewer.stop();

      viewerRef.current = undefined;
    }
  };

  const tokenGenerator = (): any =>
    Director.getSubscriber({ streamAccountId, streamName, subscriberToken });

  return {
    mainMediaStream,
    mainQualityOptions,
    // mainStatistics,
    projectToMainStream,
    remoteTrackSources,
    reprojectFromMainStream,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  };
};

export * from './types';
export default useViewer;
