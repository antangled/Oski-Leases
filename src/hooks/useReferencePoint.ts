import { useState, useCallback } from 'react';
import type { ReferencePoint } from '../types/listing';
import { CAMPUS_CENTER } from '../constants/mapConfig';

export function useReferencePoint() {
  const [referencePoint, setReferencePoint] = useState<ReferencePoint>(CAMPUS_CENTER);

  const updateReferencePoint = useCallback((point: ReferencePoint) => {
    setReferencePoint(point);
  }, []);

  return { referencePoint, updateReferencePoint };
}
