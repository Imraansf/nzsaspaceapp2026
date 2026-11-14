import React from 'react';
import { Artifact, LunarLandmark } from '../types/space';
import { CesiumPlanetaryViewer } from './CesiumPlanetaryViewer';

interface CesiumMoonViewerProps {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  onSelectArtifact: (artifact: Artifact) => void;
  landmarks?: LunarLandmark[];
  showLandmarks?: boolean;
  onSelectLandmark?: (landmark: LunarLandmark) => void;
  selectedLandmark?: LunarLandmark | null;
}

export const CesiumMoonViewer: React.FC<CesiumMoonViewerProps> = (props) => {
  return <CesiumPlanetaryViewer body="moon" {...props} />;
};
